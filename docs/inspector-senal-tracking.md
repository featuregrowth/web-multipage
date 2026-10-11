# Inspector de Señal de Tracking — documentación técnica

> `/herramientas/inspector-senal-tracking/`
> Reemplaza al antiguo "Auditor de pérdida de señal y EMQ". El modo antiguo
> (formulario que abría un `mailto:`) está retirado y su URL hace **301**
> a esta herramienta.

## 1. Qué es y qué principio sigue

El Inspector es un **escáner automático** de la señal de medición de un sitio.
Descarga el HTML público de una URL y extrae, con evidencia, el inventario de
tags y una serie de checks de calidad del marcado.

**Principio de honestidad (la regla que ordena todo el producto):**

| Etiqueta | Significado |
|---|---|
| **Medido** | Se observó directamente en el HTML o los encabezados del sitio. |
| **Estimado** | Se deriva de lo medido (índice, DNS). Tiene margen de error. |
| **Requiere acceso** | No es observable desde afuera; necesita permisos sobre Meta/GA4. |

No se muestra ninguna métrica inventada. En particular, el **EMQ real** y el
**% de bloqueo por adblock/ITP** no se pueden calcular desde un servidor y por
eso viven en el bloque *Requiere acceso*, no en el reporte automático.

## 2. Arquitectura

```
[Navegador]  herramientas/inspector-senal-tracking/index.html + js/inspector.js
     │  POST /.netlify/functions/scan   { url }
     ▼
[Netlify Function]  functions/scan.js   (Node, sin dependencias)
     │  1. Valida URL y host (protección SSRF)
     │  2. Descarga el HTML (límite 2 MB, timeout 12 s, redirects manuales)
     │  3. Analiza tags y marcado
     │  4. DNS de subdominios server-side (estimado)
     ▼
[Reporte JSON]  →  render en el navegador
```

- **Sin build, sin dependencias.** El escáner usa `fetch` nativo de Node y
  expresiones regulares; no necesita `package.json`.
- **Un solo endpoint.** En producción `/.netlify/functions/scan`; el servidor
  local también lo expone en `/api/scan` (mismo handler).

### Archivos

| Archivo | Rol |
|---|---|
| `functions/scan.js` | Motor de escaneo + handler HTTP (Netlify Function). |
| `server.js` | Servidor de desarrollo local (estático + `/api/scan`). |
| `herramientas/inspector-senal-tracking/index.html` | Interfaz de la herramienta. |
| `js/inspector.js` | Envío, render del reporte, copiar/descargar y fallback. |
| `css/styles.css` | Sección `Inspector de Señal de Tracking` (reporte, chips, checks). |
| `netlify.toml` | Configuración de publish + functions. |

## 3. API

```
POST /.netlify/functions/scan
Content-Type: application/json
{ "url": "https://cliente.cl" }
```

También acepta `GET /.netlify/functions/scan?url=https://cliente.cl`.

Respuestas:

| Código | Caso |
|---|---|
| `200` | Reporte JSON (ver §5). |
| `400` | Falta la URL o JSON inválido. |
| `405` | Método no permitido. |
| `422` | No se pudo escanear (DNS, timeout, HTTP, SSRF bloqueado). |
| `429` | Rate limit por IP. |

## 4. Checks

### 4.1 Estáticos (medidos)

| ID | Check | Cómo se mide |
|---|---|---|
| A1 | Google Tag Manager | Busca `GTM-…` y detecta placeholders `GTM-XXXX`. |
| A2 | Google Analytics 4 | Busca `G-…` y el endpoint `google-analytics.com/g/collect`. |
| A3 | Meta Pixel | `fbq('init','…')` y `fbevents.js`. |
| A4 | Otras plataformas | TikTok, LinkedIn, Hotjar, Clarity, Google Ads, X. (Informativo.) |
| A5 | Consentimiento | CMP conocida (OneTrust, Cookiebot…) o `gtag('consent'…)`. |
| A6 | Deduplicación | Referencias a `event_id` / `eid` en los scripts inline. |
| A7 | PII en claro | Correos dentro de bloques `<script>` (enmascarados en el reporte). |
| A10 | Matching hasheado | Valores con formato SHA-256 o claves `em/ph/external_id`. |

### 4.2 Server-side (estimado)

Busca referencias a subdominios de primera parte (`ss.`, `gtm.`, `track.`,
`data.`…) en el HTML y, si no hay, prueba DNS sobre `ss.` / `gtm.` / `track.`
del dominio. Es una **estimación**, así etiquetada.

### 4.3 Rúbrica del Índice de Señal

Puntaje `0–100`, **estimado**, sobre los checks aplicables (los `n/a` no
puntúan). El bloque server-side pesa 15 puntos.

| Bloque | Peso máx. |
|---|---|
| Stack (GTM + GA4 + Meta Pixel) | 24 |
| Consentimiento (A5) | 15 |
| Deduplicación (A6) | 20 |
| PII sin hashear (A7) | 12 |
| Matching hasheado (A10) | 4 |
| Server-side de primera parte | 15 |
| Placeholders sin reemplazar (A1) | *(penaliza si hay `XXXX`)* |

> El índice es una **rúbrica propia y transparente**. No es el EMQ de Meta ni
> un estándar de mercado.

## 5. Modelo del reporte (JSON)

```jsonc
{
  "version": "1.0.0",
  "mode": "static",
  "url": "https://cliente.cl/",
  "host": "cliente.cl",
  "scannedAt": "2026-10-11T21:30:46.620Z",
  "http": { "status": 200, "contentType": "text/html", "server": "nginx" },
  "stack": [ { "platform": "Google Analytics 4", "id": "G-XXXX", "confidence": "measured" } ],
  "checks": [
    { "id": "A6", "label": "Deduplicación browser↔server (event_id)",
      "status": "fail", "weight": 20,
      "evidence": "No se encontraron referencias a event_id",
      "fix": "Generar un event_id único y enviarlo idéntico en Pixel y CAPI." }
  ],
  "serverSide": { "found": false, "evidence": "…", "confidence": "estimated" },
  "index": { "value": 60, "confidence": "estimated", "rubric": "…" },
  "tier2": { "available": true, "items": [ /* EMQ real, % bloqueo real, pérdida medida */ ] },
  "limitations": [ "Escaneo estático: se lee el HTML servido, no se ejecuta JavaScript." ]
}
```

Estados de `checks[].status`: `ok` · `warn` · `fail` · `na` · `info`.

## 6. Seguridad

| Riesgo | Mitigación implementada |
|---|---|
| **SSRF** (escáner de URLs) | Solo `http/https`; se resuelve el host y se rechazan IP privadas/reservadas (RFC1918, loopback, link-local/`169.254.169.254`, CGNAT, ULA IPv6); hosts `.local/.internal`; redirecciones seguidas **manualmente** validando cada salto (máx. 5). |
| Descarga masiva | Límite de **2 MB** de cuerpo; `content-type` reportado. |
| Colgado | Timeout de **12 s** por salto (`AbortController`). |
| Abuso | Rate limit **best-effort** en memoria por IP (15/hora). No es distribuido (se reinicia con el cold start). |

## 7. Correr localmente

```bash
node server.js          # http://localhost:8000  (estático + /api/scan)
# o
./ver-sitio.sh          # usa server.js si hay Node; si no, cae a Python
```

Escaneo de prueba directo:

```bash
curl -X POST http://localhost:8000/api/scan \
  -H 'content-type: application/json' \
  -d '{"url":"https://www.netlify.com"}'
```

## 8. Desplegar en Netlify

El escáner necesita una **Netlify Function**, así que:

- **Conectá el repositorio por Git** (o usá `netlify deploy`/Netlify CLI). Netlify detecta `netlify.toml` y publica `functions/`.
- **Netlify Drop** (arrastrar la carpeta) sirve el sitio estático pero **no ejecuta funciones**. En ese caso el frontend cae automáticamente al **modo autoevaluación** (ver §9), marcado como *estimado*.

## 9. Fallback honesto (autoevaluación)

Si el endpoint no está disponible (p. ej. Drop sin funciones), `js/inspector.js`
detecta la ausencia de backend y muestra un cuestionario de 6 preguntas que
calcula un **índice de madurez estimado** en el navegador. Nunca se presenta
como medición: se etiqueta *Estimado (autoevaluación)*.

## 10. Limitaciones y roadmap

**Limitaciones actuales (v1 estática):**
- No ejecuta JavaScript: los tags inyectados en runtime (muy comunes, p. ej.
  Pixel cargado desde GTM) **no aparecen**. Es la razón por la que el bloque
  de *Requiere acceso* y el escaneo runtime existen como siguiente fase.
- El índice es una rúbrica propia.
- La detección server-side es estimada.

**Roadmap:**
1. **Fase B — escaneo runtime:** worker con Playwright (contenedor Docker) que
   intercepta requests reales, mapa de eventos, `event_id`, params y consent
   gating (sin/con consentimiento), y crawlea el sitemap.
2. **Tier 2 — con acceso:** EMQ real vía Meta Marketing API; pérdida de señal
   medida cruzando eventos browser ↔ server-side por `event_id`.

## 11. Eventos de medición (GA4/GTM)

`inspector_scan_start`, `inspector_scan_done` (con el índice en `value`),
`inspector_scan_error`, `inspector_tier2_cta`, `inspector_copy`,
`inspector_download`, `inspector_backend_missing`, `inspector_quiz_score`.
