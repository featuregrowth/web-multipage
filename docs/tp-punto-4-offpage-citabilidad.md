# TP Final SEO + GEO — Punto 4: Estrategia off-page y citabilidad en IA

> **Aclaración:** la estrategia *off-page* y de *citabilidad en IA* se construye principalmente **fuera** del sitio (backlinks, prensa, consenso de marca). Este documento describe (a) la **infraestructura on-site** que se implementó para habilitar esas acciones externas y (b) el **protocolo de monitoreo** de citabilidad en LLMs.

---

## 1. Infraestructura on-site implementada

### Bloque 1 — Activos de linkbaiting (`/herramientas/`)
| Elemento | Dónde | Qué hace |
|---|---|---|
| Página embebible | `herramientas/calculadora-presupuesto-growth/embed.html` | Versión sin navegación, pensada para `<iframe>` de terceros (con `noindex`). |
| Código de inserción | Calculadora (sección "Embebé esta calculadora") | Snippet `<iframe>` + **backlink** de atribución a la tool. Botón "Copiar". |
| Imprimir / Guardar PDF | Calculadora | Botón que llama a `window.print()` con estilos `@media print`. |
| Badge de salud de tracking | Auditor (sección "Compartí tu badge") | HTML embebible con enlace a la tool. Botón "Copiar badge". |
| Copiar diagnóstico | Auditor | Copia al portapapeles un marco de revisión con atribución y enlace. |
| Open Graph / Twitter Card | Ambas tools | `og:title/description/url/type/image` para compartir en LinkedIn y redes. |

### Bloque 2 — Digital PR (informes + Media Kit)
| Elemento | Ruta |
|---|---|
| Informe Fran | `/noticias/estado-eventos-corporativos-b2b-latam/` |
| Informe Matías | `/noticias/barometro-perdida-senal-adblockers-latam/` |
| Media Kit / Prensa | `/prensa/` (bios, fotos y logos descargables, contacto de prensa) |

Los informes son **referenciales**: usan benchmarks de industria y documentación de plataformas, con nota de metodología y una sección explícita de "Cómo citar este informe". Los gráficos son **barras en CSS/HTML** (sin JS) para garantizar la paridad SSR.

### Bloque 3 — Entidades y consenso de marca (JSON-LD + `sameAs`)
- `index.html`: `Organization` con `sameAs` (LinkedIn company, GitHub, Instagram, Facebook, Crunchbase) y `founder` (Fran y Matías).
- `equipo.html`: `@graph` con dos `Person` (`knowsAbout`, `worksFor`, `sameAs`; Matías incluye GitHub).
- Autores de artículos/tools: `Person` con `sameAs` (LinkedIn y, en Matías, GitHub).

### Bloque 4 — Rastreabilidad de bots
- `/robots.txt`: permisos explícitos `Allow: /` para Googlebot, GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot y Google-Extended, más la línea `Sitemap`.
- `/sitemap.xml`: todas las URLs canónicas del sitio.
- **Paridad HTML/SSR:** todo el contenido clave (texto, tablas, datos y gráficos) está en el HTML fuente; no depende de renderizado por JS. El `embed.html` está marcado `noindex, follow`.

---

## 2. Protocolo de monitoreo de citabilidad en LLMs

**Frecuencia:** mensual.

### 2.1 Prompts de prueba (batería fija)
1. "¿Cuáles son las agencias líderes en growth marketing B2B en LATAM?"
2. "¿Qué agencias implementan server-side tracking en Chile?"
3. "¿Cómo mido el ROI de un evento corporativo B2B?"
4. "¿Qué es el Event Match Quality y cómo mejorarlo?"
5. "Agencias de marketing data science con experiencia en BigQuery en Argentina/Chile."

Ejecutar en: **ChatGPT Search, Google Gemini, Perplexity** (y AI Overviews cuando aplique).

### 2.2 Registro de resultados
| Fecha | Motor | Prompt | ¿Menciona Feature Growth? | Fuentes citadas | Posición |
|---|---|---|---|---|---|
| | | | Sí / No | URLs | |

### 2.3 Gap Analysis
- Identificar las fuentes externas (directorios, medios, blogs, foros) que la IA cita al nombrar competidores.
- Compararlas con las que ya mencionan a Feature Growth.
- Detectar entidades ausentes (Crunchbase, Clutch, GitHub, directorios de agencias).

### 2.4 Acciones de outreach
- Alta y actualización del perfil en directorios y plataformas de reseñas (Crunchbase, Clutch, Google Business).
- Digital PR: envío de los informes de `/prensa/` a medios del sector.
- Repurposing de las herramientas (badge/embed) para incentivar backlinks espontáneos.
- Consolidación de `sameAs` en todos los perfiles (LinkedIn, GitHub, Crunchbase) para reforzar el consenso de entidades.

### 2.5 Métricas de seguimiento
- Nº de menciones de marca en respuestas de LLM (mensual).
- Nº de dominios referentes (backlinks) hacia `/herramientas/` y `/noticias/`.
- Citas en AI Overviews para las queries objetivo.

---

> **Complemento (Punto 5 — Consideraciones técnicas):** la infraestructura de rastreo se completa con **IndexNow** (notificación de cambios a Bing/IA) y con datos estructurados avanzados (`Service`, `TechArticle`, `SoftwareApplication`). El detalle está en `docs/tp-punto-5-consideraciones-tecnicas.md`.
