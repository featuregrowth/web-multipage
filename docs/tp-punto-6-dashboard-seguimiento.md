# TP Final SEO + GEO — Punto 6: Dashboard de seguimiento (SEO + GEO)

## 1. Marco teórico: el "Gran Desacople"

La irrupción de la búsqueda generativa (AI Overviews, ChatGPT Search, Perplexity) produce el fenómeno del **"Gran Desacople"**: el tráfico de clics tradicionales tiende a bajar, mientras la **visibilidad y la intención de compra aumentan** a través de respuestas sintéticas. Medir el éxito en 2026 exige unir dos familias de métricas:

1. **SEO clásico** (Search Console + GA4): impresiones, clics, CTR, posición media y conversiones en el sitio.
2. **GEO emergente** (Brand Radar / auditorías de prompts): menciones de marca, citación de fuentes, impresiones en AI Overviews y **AI Share of Voice** (% de presencia de la marca frente a competidores en respuestas generativas).

El dashboard se consolida en **Looker Studio**, conectando tres fuentes en paralelo: **Google Search Console** (pre-clic), **Google Analytics 4** (post-clic) y **Ahrefs Brand Radar / auditorías de prompts GEO**.

> **Nota NA:** como GA4 clasifica el tráfico de ChatGPT/Perplexity/Claude como *Referral* o *Unassigned*, no alcanza con UTMs (los motores generativos no permiten etiquetar sus enlaces). El tráfico de IA se aísla en GA4 con una **regla de canal personalizada por expresión regular de referrer** (ver §5).

---

## 2. Matriz de KPIs — Perfil Fran (Growth Marketing B2B)

| KPI | Descripción y relevancia comercial | Herramienta | Frecuencia | Justificación |
|---|---|---|---|---|
| **SQLs orgánicos B2B (Key Events)** | Reuniones de diagnóstico/auditoría agendadas desde canal orgánico | GA4 (Key Events) + CRM (HubSpot/Salesforce) | Semanal | Mide impacto real en pipeline; evita métricas de vanidad |
| **Impresiones y clics del cluster B2B** | Volumen capturado en keywords de demanda B2B | Google Search Console | Semanal | Evalúa el crecimiento de autoridad temática en la categoría |
| **CTR comercial y posición media** | Clics y ranking en búsquedas de alta intención | Google Search Console | Quincenal | Mide atractivo de snippets y efectividad de respuestas AEO |
| **Uso de la Calculadora B2B** | Ejecuciones y exportaciones PDF (`calc_b2b_submit`, `calc_b2b_print`) | GA4 (Custom Events vía GTM) | Semanal | Mide el rendimiento del activo de linkbaiting / captación sin fricción |
| **AI Share of Voice (Growth B2B)** | % de aparición en prompts "agencias de Growth B2B en LATAM" | Ahrefs Brand Radar / auditoría de prompts | Mensual | Mide dominancia de marca y consenso de fuentes en ChatGPT y Gemini |

---

## 3. Matriz de KPIs — Perfil Matías (Marketing Data Science, Analítica e IA)

| KPI | Descripción y relevancia técnica | Herramienta | Frecuencia | Justificación |
|---|---|---|---|---|
| **Escaneos del Inspector de Señal** | Escaneos de tracking completados (`inspector_scan_done`) | GA4 (Custom Events vía GTM) | Semanal | Atracción del activo linkbaiting técnico (consultores, CTOs) |
| **Event Match Quality (EMQ) promedio** | Calificación 1–10 enviada en implementaciones CAPI | Meta Ads Manager / GA4 CAPI Server logs | Semanal | Controla salud de datos y efectividad del server-side |
| **Tráfico orgánico técnico (spokes)** | Visitas a guías GA4 Server-Side, CAPI y Python | Search Console / GA4 | Semanal | Captación de perfil técnico y *growth engineers* |
| **Backlinks desde dominios tech/data** | Enlaces desde GitHub, Medium, Towards Data Science, blogs | Ahrefs / Semrush / GitHub API | Mensual | Autoridad de dominio vía recursos de código |
| **AI Share of Voice y citación de código** | Citación de featuregrowth en prompts de código/ingeniería | Ahrefs Brand Radar / ChatGPT Search / Perplexity | Mensual | Presencia en LLM ante consultas de Server-Side/código |

---

## 4. Protocolo mensual de monitoreo GEO y Gap Analysis

Se ejecuta el primer día hábil de cada mes:

1. **Pruebas de prompts de control** en ChatGPT Search, Gemini, Perplexity y AI Overviews.
   - *Fran:* "¿Cuáles son las mejores agencias de Growth Marketing B2B y Generación de Demanda en LATAM?"
   - *Matías:* "¿Cómo solucionar la pérdida de señal publicitaria con Server-Side Tracking y GA4?"
   - (Batería completa en `docs/tp-punto-4-offpage-citabilidad.md`, §2.1.)
2. **RAG Gap Analysis**: identificar las **fuentes que cita la IA** (links al pie de las respuestas) y compararlas con las que ya mencionan a Feature Growth.
3. **Acción correctora**: inyectar mayor **densidad de evidencia** en las piezas (tablas, estadísticas) y ejecutar *Digital PR* para aparecer en los medios/directorios que la IA cita.

---

## 5. Implementación técnica de la medición (en el sitio)

### 5.1 GTM + GA4
- Se instala el **snippet oficial de Google Tag Manager** (`GTM-T5N7DK76`) **inline en el `<head>`** de cada página y el `<noscript>` inmediatamente después de `<body>`, siguiendo las instrucciones de GTM.
- `js/analytics.js` aporta el helper **`window.fgTrack(evento, params)`**, que empuja eventos personalizados al **Data Layer** (que consume GTM).
- La etiqueta **GA4** (Measurement ID `G-…`) y sus *triggers* de evento personalizado se configuran **dentro de GTM** (no en el HTML).
- Excluido: `embed.html` (se embebe en sitios de terceros).

### 5.2 Eventos personalizados (Custom Events)
| Evento | Dónde se dispara | Categoría |
|---|---|---|
| `calc_b2b_submit` | Enviar la calculadora (cálculo válido) | Engagement Tool |
| `calc_b2b_print` | Botón "Imprimir / Guardar PDF" | Lead Generation |
| `calc_b2b_embed_copy` | Copiar el código de inserción | Lead Generation |
| `inspector_scan_start` | Se lanza un escaneo del Inspector de Señal | Technical Tool |
| `inspector_scan_done` | El escaneo termina con éxito (incluye el índice en `value`) | Technical Tool |
| `inspector_scan_error` | El escaneo devuelve error | Technical Tool |
| `inspector_tier2_cta` | Clic en "Agendar diagnóstico" del bloque Requiere acceso | Lead Generation |
| `inspector_copy` | Copiar el badge o el resumen del diagnóstico | Linkbaiting Engagement |
| `inspector_download` | Descargar el reporte en JSON | Technical Tool |

Estos eventos se marcan como **Key Events** en GA4 para medir microconversiones B2B.

### 5.3 Canal "AI" en GA4 (referrer)
Crear en GA4 (Admin → Data streams → *Channel groups*) una regla personalizada que agrupe como **"AI"** los referrers que contengan (regex, sin distinguir mayúsculas):
```
chatgpt\.com|openai\.com|perplexity\.ai|gemini\.google\.com|claude\.ai|copilot\.microsoft\.com|bing\.com/chat
```
Así el tráfico proveniente de asistentes generativos queda aislado del canal *Referral* genérico.

### 5.4 Pendiente de cumplimiento
El sitio incorpora GA4/GTM; **queda pendiente un aviso de cookies/consentimiento** si se apunta a audiencias de la UE (hoy no implementado).
