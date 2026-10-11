# TP Final SEO + GEO — Punto 5: Consideraciones técnicas

## 1. Marco teórico justificativo

El SEO técnico no es una lista de chequeo de programación: es la **infraestructura** que garantiza que tanto los buscadores tradicionales (Googlebot) como los **rastreadores de IA generativa** (GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot) puedan **descubrir, interpretar y confiar** en el contenido. Si la infraestructura falla, la mejor estrategia de contenidos queda invisible.

En un sitio **HTML estático (SSR/static)** como `web-multipage`, el HTML se entrega ya renderizado desde el servidor. Esto es ideal para la visibilidad en motores generativos, porque los sistemas RAG (*Retrieval-Augmented Generation*) consumen el HTML directamente **sin ejecutar JavaScript de cliente**.

---

## 2. Los 4 ejes técnicos priorizados

### Eje 1 — Mobile-First Indexing y performance WPO (Core Web Vitals)
Google evalúa e indexa exclusivamente con su **rastreador móvil** (*mobile-first indexing*): lo que no está disponible en móvil, para Google no existe. Métricas objetivo (percentil 75 en CrUX):

| Métrica | Objetivo | Qué mide |
|---|---|---|
| **LCP** | ≤ 2,5 s | Velocidad de carga del elemento principal |
| **INP** | ≤ 200 ms | Capacidad de respuesta / interactividad |
| **CLS** | ≤ 0,1 | Estabilidad visual (evitar saltos de layout) |

**Aplicación por perfil**
- *Fran (Growth B2B):* garantizar carga instantánea en conexiones móviles corporativas durante eventos presenciales.
- *Matías (Data Science):* optimizar la ejecución de la herramienta interactiva para no penalizar el INP.

### Eje 2 — Control de rastreo e indexación (robots.txt + sitemap + IndexNow)
Los rastreadores de IA usan las **mismas reglas de `robots.txt`** que los buscadores tradicionales. Estrategia: permitir explícitamente a los crawlers de IA el acceso a guías y herramientas, publicar un `sitemap.xml` con la jerarquía completa (pillars, spokes, tools) y notificar cambios con **IndexNow**.

### Eje 3 — Renderizado server-side (SSR) e higiene de JavaScript
A diferencia de Googlebot (que tiene una fase de renderizado diferido), los crawlers de IA y los sistemas RAG **no ejecutan JavaScript complejo**. Por eso todo el contenido clave (bloques AEO, tablas comparativas, snippets de Python/SQL) está en el **HTML fuente**, y los gráficos de los informes se construyen con **CSS**, no con canvas/JS.

### Eje 4 — Datos estructurados avanzados (JSON-LD)
Los datos estructurados desambiguan entidades y habilitan *rich snippets* y citación por LLM.

| Esquema | Dónde | Para qué |
|---|---|---|
| `Organization` (+`sameAs`, `founder`) | `index.html` | Identidad de marca y consenso de entidades |
| `Person` (+`sameAs`, `knowsAbout`) | `equipo.html`, autores, pillars | E-E-A-T y desambiguación de autores |
| `Service` | Pillars | Servicios ofrecidos y área geográfica |
| `Article` / `NewsArticle` | Guías informativas y comparativas | Autoría y frescura |
| `TechArticle` (+`proficiencyLevel`) | Guías técnicas (GA4, EMQ, Atribución) | Contenido técnico experto |
| `SoftwareApplication` (+`offers`) | Herramientas | App gratuita de negocio |
| `CollectionPage` / `WebPage` | Hubs de Noticias/Herramientas/Prensa | Estructura del sitio |

---

## 3. Auditoría del sitio (implementación)

### 3.1 Rastreo
- **`robots.txt`**: `Allow: /` para todos, con directivas explícitas para Googlebot, GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot y Google-Extended, más la línea `Sitemap`. **No se bloquean CSS ni JS** (bloquearlos perjudica el renderizado y no mejora la citabilidad).
- **`sitemap.xml`**: 22 URLs con `priority` por jerarquía (home 1.0; pillars y herramientas 0.9; hubs e informes 0.8; servicios 0.8; spokes 0.7; equipo/contacto 0.6).
- **IndexNow**: clave publicada en `/{clave}.txt` en la raíz del sitio. Notificación de cambios vía `https://api.indexnow.org/indexnow?url=<url>&key=<clave>&keyLocation=https://featuregrowth.cl/<clave>.txt`.

### 3.2 Rendimiento WPO y paridad móvil
- **71/71 imágenes** con atributos `width` y `height` → reserva de espacio en el DOM (protege el **CLS ≤ 0,1**).
- **`loading="lazy"`** aplicado a imágenes secundarias; la zona *hero* es de texto/gradiente (sin imagen LCP con lazy).
- Contenido principal **visible en el HTML fuente**, no oculto tras gestos; el menú móvil mantiene los enlaces en el DOM (rastreables).
- Sin dependencia de frameworks: HTML/CSS/JS puro → sin *hydration* ni bloqueo de render.

### 3.3 Datos estructurados
Implementados según la tabla del Eje 4, en el `<head>` de cada página (JSON-LD), con `@graph` cuando se agrupan entidades (pillars y equipo).

---

## 4. Checklist de cumplimiento

- [x] Meta viewport + diseño responsive (mobile-first).
- [x] `width`/`height` en todas las imágenes (CLS).
- [x] Lazy loading selectivo (sin lazy en zona hero/LCP).
- [x] `robots.txt` con apertura explícita a crawlers de IA.
- [x] `sitemap.xml` completo y jerarquizado.
- [x] IndexNow (clave + referencia de ping).
- [x] Contenido clave en HTML estático (paridad SSR).
- [x] JSON-LD avanzado: `Organization`, `Person`, `Service`, `TechArticle`, `SoftwareApplication`, `CollectionPage`.
- [x] Datos estructurados válidos (verificación automática en el build local).
