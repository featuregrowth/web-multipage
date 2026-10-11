# TP Final SEO + GEO — Punto 3: Plan de contenidos on-page

**Proyecto:** Feature Growth (agencia de Marketing, Data e IA B2B) · `featuregrowth.cl`
**Alcance:** estructura de **6 piezas clave** (2 pillars + 2 artículos + 2 herramientas), 3 por perfil de autor, listas para implementar y publicar.

> **Nota de terminología.** El plan inicial venía redactado como "blog/`/blog/`". Ese modelo se descartó: **hoy los artículos secundarios (spokes) viven en la sección Noticias (`/noticias/`)**, que funciona como hub + historial de publicaciones. En todo este documento, "artículo" equivale a una pieza dentro de Noticias.

> **Arquitectura de keywords.** Estas 6 piezas forman parte del mapa de keywords y silos definido en [`docs/tp-punto-2-keyword-research-arquitectura.md`](tp-punto-2-keyword-research-arquitectura.md).

---

## 1. Arquitectura de contenido (Topic Clusters / Silo)

El contenido no se publica al azar: respeta una arquitectura de **clusters temáticos** que reparte la autoridad de un tema hacia sus piezas de profundización.

| Capa | Función | Ubicación en el sitio | Ejemplos |
|------|---------|-----------------------|----------|
| **Pillar (Hub central)** | Tema amplio, cabecera del silo. Captura la búsqueda genérica y distribuye autoridad. | **Raíz del dominio** (carpeta propia) | `/growth-marketing-b2b/`, `/marketing-data-science/` |
| **Spoke (Artículo)** | Profundiza una intención informacional/comparativa y enlaza jerárquicamente al pillar. | **`/noticias/`** | `/noticias/demand-gen-vs-lead-gen-b2b/`, `/noticias/implementar-ga4-server-side-gcp/` |
| **Tool (Herramienta)** | Resuelve un problema práctico con un activo interactivo; imán de enlaces y menciones (linkbaiting). | **`/herramientas/`** | `/herramientas/calculadora-presupuesto-growth/`, `/herramientas/inspector-senal-tracking/` |

**Silo temático y enlazado interno:** cada spoke enlaza a su pillar con texto ancla descriptivo, y cada pillar enlaza a sus spokes y a la herramienta del mismo tema. Las herramientas enlazan de vuelta a la pillar y al artículo técnico relacionado. Esto concentra autoridad temática (E-E-A-T temático) y facilita que los motores generativos entiendan la relación entre piezas.

Todas las URLs son **limpias** (carpeta + `index.html`, sin parámetros ni `.html` visible).

---

## 2. Criterios globales aplicados a todas las piezas (framework de 3 capas + E-E-A-T)

**Capa 1 — SEO (estructura y jerarquía)**
- Un único `<h1>` descriptivo por página, seguido de `<h2>`/`<h3>` con jerarquía lógica.
- Title tags optimizados (tema + intención, con sufijo de marca `· Feature Growth`).
- Meta description con propuesta de valor y llamada a la acción.
- URLs limpias, jerárquicas y en español.
- Enlazado interno "silo" con **textos ancla descriptivos** (no "click aquí").

**Capa 2 — AEO (Answer Engine Optimization)**
- **Párrafo de respuesta directa y autocontenida (40–60 palabras)** inmediatamente debajo del primer `H2`, marcado con la clase `.answer`, para capturar *Featured Snippet* (Posición Cero) y respuestas de asistentes.
- Los `H2` se redactan como **preguntas reales** ("¿Qué es…?", "¿Por qué…?") para alimentar *People Also Ask*.

**Capa 3 — GEO (Generative Engine Optimization)**
- **Densidad de evidencia**: tablas comparativas, porcentajes empíricos, rangos de referencia, listas de pasos y fragmentos de código.
- Formato estructurado y fragmentable (tablas, `<ol>`, `<ul>`, `<code>`), que según la literatura de GEO (Aggarwal et al., 2023) es el mayor predictor de citación en modelos generativos tipo RAG (ChatGPT, Gemini, Perplexity).

**E-E-A-T (Experiencia, Experticia, Autoridad, Confiabilidad)**
- **Autoría explícita** con byline y `author-box` (nombre, rol, bio y enlace al equipo).
- **Datos estructurados** en JSON-LD: `Article`/`NewsArticle`/`TechArticle` + `author` (Person con `jobTitle` y LinkedIn) + `publisher` (Organization) + `datePublished`/`dateModified`.
- **Demostración de experiencia**: evidencia cuantitativa propia, metodología y lenguaje de primera mano.

---

## 3. Fichas de las piezas

### Perfil A — Fran (Growth Marketing B2B y Generación de Demanda)

#### Pieza 1 · Pillar Page (hub central)
| Campo | Definición |
|-------|------------|
| **Tipo** | Pillar (hub del silo Growth) |
| **Ubicación** | Raíz del dominio |
| **URL sugerida** | `https://featuregrowth.cl/growth-marketing-b2b/` |
| **Title tag** | Guía de Growth Marketing B2B y Generación de Demanda (2026) · Feature Growth (~59 car. + marca) |
| **Meta description** | El Growth Marketing B2B optimiza todo el embudo con experimentación y datos. Framework de Feature Growth para construir un motor de demanda predictible y medir ingresos cualificados. |
| **H1** | Framework de Growth Marketing B2B: Cómo Construir un Motor de Demanda Predictible |
| **H2** | 1. ¿Qué es el Growth Marketing B2B y en qué se diferencia del marketing tradicional?<br>2. Los 4 Pilares del Sistema de Generación de Demanda de Feature Growth<br>3. Arquitectura del cluster temático y red de contenidos<br>4. Métricas de rendimiento y ratios de eficiencia B2B |
| **H3** | · El cambio de paradigma: de la métrica de vanidad a los ingresos cualificados (SQL) |
| **Enfoque semántico / entidades** | Growth Marketing B2B, generación de demanda (demand generation), pipeline de ventas, MQL, SQL, CAC, LTV, Payback, Win Rate, unit economics, LinkedIn Ads, Google Search, Meta Ads, CRM, SaaS, HubSpot, Salesforce. |
| **Criterios E-E-A-T** | Firmado por **Fran Contreras** (Cofundadora · Estrategia & Growth) con byline + author-box. JSON-LD `Article` + `Service` (en `@graph`) con autor, organización y fechas. Incorpora metodología propietaria (los 4 pilares) y ratios de atribución comercial. |
| **Estrategia AEO / GEO** | Párrafo de respuesta directa (~45 palabras) tras el primer H2 (definición de Growth Marketing B2B). Tabla de KPIs B2B (LTV:CAC 3:1–5:1, Payback 5–9 meses, MQL→SQL 22–35%, Win Rate 18–28%) para forzar citación por modelos RAG. |
| **Enlazado interno (silo)** | → `/noticias/demand-gen-vs-lead-gen-b2b/`, `/noticias/optimizar-pipeline-ventas-b2b/`, `/noticias/medir-roi-eventos-corporativos/`, `/herramientas/calculadora-presupuesto-growth/`. |

#### Pieza 2 · Spoke (artículo comparativo de Noticias) — *caso destacado de SERP feature*
| Campo | Definición |
|-------|------------|
| **Tipo** | Spoke (artículo comparativo) |
| **Ubicación** | Sección `/noticias/` |
| **URL sugerida** | `https://featuregrowth.cl/noticias/demand-gen-vs-lead-gen-b2b/` |
| **Title tag** | Demand Gen vs Lead Gen en B2B: Comparativa Estratégica · Feature Growth |
| **Meta description** | Lead Generation captura contactos; Demand Generation crea intención de compra. Comparativa de métricas, objetivos, formatos y canales para decidir cuándo usar cada estrategia en B2B. |
| **H1** | Demand Generation vs. Lead Generation: Cuándo Usar Cada Estrategia en B2B |
| **H2** | 1. Comparativa de filosofías comerciales B2B<br>2. Distribución de presupuesto publicitario (regla 70/30) |
| **H3** | · Cómo repartir el 70% en generación de demanda y el 30% en captura |
| **Enfoque semántico / entidades** | Demand Generation, Lead Generation, MQL, CPL, gated vs. ungated content, pipeline velocity, regla 70/30, LinkedIn Ads, retargeting B2B. |
| **Criterios E-E-A-T** | Autoría de Fran; JSON-LD `NewsArticle` con `datePublished`/`dateModified`; análisis derivado de la gestión directa de presupuestos publicitarios B2B. |
| **Estrategia AEO / GEO** | Diseñada para el **Featured Snippet de tabla**: `<table>` HTML justo debajo del primer H2, con columnas claras (`Dimensión` / `Lead Generation Tradicional` / `Demand Generation`) y filas cortas y autocontenidas. Párrafo `.answer` de respuesta directa. Dato cuantitativo citable (reparto 70/30). |
| **Enlazado interno (silo)** | → pillar `/growth-marketing-b2b/` (ancla "estrategia de growth marketing B2B"), `/noticias/optimizar-pipeline-ventas-b2b/`, `/herramientas/calculadora-presupuesto-growth/`. |

#### Pieza 3 · Tool Landing Page (activo de linkbaiting)
| Campo | Definición |
|-------|------------|
| **Tipo** | Herramienta interactiva (SoftwareApplication) |
| **Ubicación** | Sección `/herramientas/` |
| **URL sugerida** | `https://featuregrowth.cl/herramientas/calculadora-presupuesto-growth/` |
| **Title tag** | Calculadora de Presupuesto y ROI de Generación de Demanda B2B · Feature Growth |
| **Meta description** | Calculadora interactiva gratuita de presupuesto y ROI B2B: simulá pipeline, inversión publicitaria, leads y SQL necesarios y CAC objetivo según tu meta de facturación. |
| **H1** | Calculadora de Presupuesto y ROI para Generación de Demanda B2B |
| **H2** | 1. Estimación interactiva de inversión publicitaria y retorno comercial B2B<br>2. Simulador de métricas comerciales B2B |
| **H3** | · Proyección estimada (bloque de resultados)<br>· Beneficios del diagnóstico de inversión B2B |
| **Enfoque semántico / entidades** | Calculadora ROI B2B, presupuesto de marketing, simulador CAC, target revenue, CPL, MQL→SQL, Win Rate, ciclo de venta. |
| **Criterios E-E-A-T** | JSON-LD `SoftwareApplication` + autoría de Fran; transparencia de la fórmula de cálculo (macro/micro conversiones). |
| **Estrategia AEO / GEO** | Formulario interactivo (facturación objetivo, ticket promedio, CPL, MQL→SQL, Win Rate, ciclo). Excelente activo de **Digital PR / linkbaiting** y candidato a ser recomendado por asistentes ante prompts del tipo "calculadora de presupuesto de marketing B2B". |
| **Enlazado interno (silo)** | → pillar `/growth-marketing-b2b/`, `/noticias/optimizar-pipeline-ventas-b2b/`, `/noticias/demand-gen-vs-lead-gen-b2b/`. |

---

### Perfil B — Matías (Marketing Data Science, Analítica e IA)

#### Pieza 4 · Pillar Page (hub central)
| Campo | Definición |
|-------|------------|
| **Tipo** | Pillar (hub del silo Data & Analítica) |
| **Ubicación** | Raíz del dominio |
| **URL sugerida** | `https://featuregrowth.cl/marketing-data-science/` |
| **Title tag** | Manual de Marketing Data Science y Server-Side Tracking (2026) · Feature Growth |
| **Meta description** | El fin de las cookies reduce hasta un 30% la precisión de atribución. El Marketing Data Science reestructura la recolección hacia servidores propios, first-party data y modelos estadísticos. |
| **H1** | Marketing Data Science: La Guía Definitiva para la Arquitectura de Datos y Medición |
| **H2** | 1. El fin de las cookies de terceros y el impacto en la atribución publicitaria<br>2. Arquitectura Server-Side Tracking con Google Tag Manager y GCP<br>3. Recursos del cluster temático de Data Science<br>4. Impacto cuantitativo de la recolección server-side |
| **H3** | · Consecuencias técnicas en Meta Ads, Google Ads y TikTok Ads<br>· 5 pasos para migrar a una arquitectura server-side |
| **Enfoque semántico / entidades** | Marketing Data Science, Server-Side Tracking, First-Party Data, Meta CAPI, GA4, GTM Server, Google Cloud Platform, BigQuery, Python, atribución, EMQ, ITP/ETP, SaaS, e-commerce, LATAM. |
| **Criterios E-E-A-T** | Firmado por **Matías Chaud** (Cofundador · Data & Tecnología) con byline + author-box. JSON-LD `Article` + `Service` (en `@graph`) con autor, organización y fechas. Diagramas de arquitectura, scripts y tabla de impacto. |
| **Estrategia AEO / GEO** | Párrafo `.answer` (~40 palabras) de definición. **Lista ordenada de 5 pasos** para migrar a server-side (optimizada para Featured Snippet de proceso). Tabla de impacto cuantitativo (+18–28% conversiones, EMQ 8.2–9.5/10, −200 ms en Core Web Vitals). |
| **Enlazado interno (silo)** | → `/noticias/implementar-ga4-server-side-gcp/`, `/noticias/optimizar-event-match-quality-meta-capi/`, `/noticias/modelos-atribucion-marketing-python/`, `/herramientas/inspector-senal-tracking/`. |

#### Pieza 5 · Spoke (artículo técnico de Noticias)
| Campo | Definición |
|-------|------------|
| **Tipo** | Spoke (guía técnica paso a paso) |
| **Ubicación** | Sección `/noticias/` |
| **URL sugerida** | `https://featuregrowth.cl/noticias/implementar-ga4-server-side-gcp/` |
| **Title tag** | Cómo Implementar GA4 Server-Side en GCP Paso a Paso · Feature Growth |
| **Meta description** | Guía técnica para configurar GA4 Server-Side en Google Cloud Platform: contenedor en GTM Server, subdominio propio, cabeceras HTTP y validación para recuperar entre 18% y 28% de conversiones. |
| **H1** | Guía Técnica: Configuración de GA4 Server-Side en Google Cloud Platform |
| **H2** | 1. Requisitos previos y arquitectura de contenedores<br>2. Pasos de implementación en el contenedor de servidor<br>3. Resultados de rendimiento y WPO |
| **H3** | · Configuración de parámetros de cliente GA4 Server-Side |
| **Enfoque semántico / entidades** | GA4 Server-Side, Google Cloud Platform, GTM Server, subdominio first-party, Core Web Vitals (INP/LCP), cabeceras HTTP, deduplicación de eventos, Stape.io. |
| **Criterios E-E-A-T** | Autoría de Matías; JSON-LD `TechArticle` (con `proficiencyLevel`) y fechas; tutorial escrito desde la experiencia práctica en ingeniería de datos, con métricas propias de latencia y recuperación. |
| **Estrategia AEO / GEO** | Respuesta directa autocontenida (~48 palabras) en el primer apartado. **Lista ordenada (paso a paso)** para Featured Snippet de proceso y fragmentos de código (`<code>`) que los modelos técnicos citan. Cifras reproducibles (+18–28% de conversiones, −200 ms). |
| **Enlazado interno (silo)** | → pillar `/marketing-data-science/`, `/noticias/optimizar-event-match-quality-meta-capi/`, `/herramientas/inspector-senal-tracking/`. |

#### Pieza 6 · Tool Landing Page (activo de linkbaiting)
| Campo | Definición |
|-------|------------|
| **Tipo** | Herramienta interactiva (SoftwareApplication) |
| **Ubicación** | Sección `/herramientas/` |
| **URL sugerida** | `https://featuregrowth.cl/herramientas/inspector-senal-tracking/` |
| **Title tag** | Inspector de Señal de Tracking (Herramienta Gratuita) · Feature Growth |
| **Meta description** | Inspector gratuito de señal de tracking: escaneo automático del marcado de eventos (GTM, GA4, Meta Pixel), deduplicación, PII sin hashear, consentimiento y server-side, con evidencia medida. |
| **H1** | Inspector de Señal de Tracking |
| **H2** | 1. ¿Qué tan sana está la señal de tu sitio?<br>2. Consola de escaneo<br>3. Cómo leer el reporte<br>4. Compartí tu badge de salud de tracking |
| **H3** | · Qué mide el escáner<br>· Qué NO mide (y por qué) |
| **Enfoque semántico / entidades** | Señal de tracking, deduplicación de eventos (`event_id`), Meta CAPI, PII/SHA-256, consentimiento (CMP / Consent Mode), server-side de primera parte, Google Tag Manager, GA4. |
| **Criterios E-E-A-T** | JSON-LD `SoftwareApplication` + autoría de Matías; herramienta funcional con backend server-side propio (`functions/scan.js`) y metodología documentada en `docs/inspector-senal-tracking.md`. |
| **Estrategia AEO / GEO** | Escáner interactivo con entrada de URL que devuelve un **reporte medido** (no simulado). Activo de **Digital PR / linkbaiting** para recibir backlinks de medios de marketing y tecnología; candidato a citación como recurso recomendado por asistentes. |
| **Enlazado interno (silo)** | → pillar `/marketing-data-science/`, `/noticias/optimizar-event-match-quality-meta-capi/`, `/noticias/modelos-atribucion-marketing-python/`. |

---

## 4. Justificación de SERP feature y citación por IA generativa

La consigna pide justificar, **en al menos una pieza**, cómo podría posicionarse en una *SERP feature* o ser citada por un modelo generativo. Se desarrolla en profundidad la **Pieza 2** y se documentan dos casos secundarios.

### Caso principal — Pieza 2: *Demand Generation vs. Lead Generation* → Featured Snippet de tabla + citación RAG

**1) Ajuste a la intención de búsqueda.** La consulta "demand generation vs lead generation" es de tipo **comparativo**, una de las que Google resuelve con mayor frecuencia mediante un **Featured Snippet de tabla** (Posición Cero) y no con un párrafo. La pieza está construida exactamente para ese formato.

**2) Estructura que dispara el snippet.** Inmediatamente debajo del H2 "Comparativa de filosofías comerciales B2B" hay una `<table>` HTML con encabezados semánticos (`Dimensión / Métrica`, `Lead Generation Tradicional`, `Demand Generation (Modern Growth)`) y cinco filas cortas y autocontenidas (objetivo, fricción de acceso, métricas, formato, canales). Google y Bing extraen con facilidad 4–6 filas de este tipo de tabla, porque cada celda responde una dimensión del tema sin ambigüedad.

**3) Cobertura de entorno.** El H2 se formula como afirmación temática y la sección siguiente ("regla 70/30") aporta el contexto cuantitativo que suele aparecer en el apartado *People Also Ask* ("¿Cómo reparto el presupuesto entre demand y lead gen?").

**4) Citación por modelos generativos (GEO/RAG).** Los motores de respuesta (ChatGPT Search, Perplexity, Google AI Overviews) citan fragmentos que (a) responden una pregunta de forma directa y (b) contienen **evidencia estructurada y cuantificable**. Esta pieza cumple ambas: el bloque `.answer` es una definición autocontenida de 40–60 palabras justo tras el H2, y el dato "**70% generación / 30% captura**" es una cifra concreta y reproducible que el modelo puede atribuir a la fuente. Según el trabajo de GEO de Aggarwal et al. (2023), la evidencia cuantitativa y el formato estructurado son los mayores predictores de citación.

**5) Señales de confianza para la citación.** El JSON-LD `NewsArticle` incluye `author` (Person), `publisher` (Organization) y `datePublished`/`dateModified`, lo que permite a los motores verificar autoría, autoridad del dominio y frescura antes de atribuir la respuesta.

### Casos secundarios

| Pieza | SERP feature objetivo | Por qué |
|-------|-----------------------|---------|
| **Pieza 5 — GA4 Server-Side en GCP** | Featured Snippet de **lista ordenada** (proceso "cómo…") + citación en respuestas de how-to técnico | Consulta procedural; el artículo usa `<ol>` de pasos y bloques `<code>`, formato que los snippets de lista y los asistentes técnicos extraen y citan. |
| **Pieza 3 — Calculadora de presupuesto B2B** | No compite por snippet: es **recurso recomendado por IA** | Ante prompts como "¿cómo calculo el presupuesto de marketing B2B?", los asistentes recomiendan herramientas interactivas gratuitas. Actúa además como activo de linkbaiting. |

---

## 5. Tabla resumen

| # | Perfil | Tipo | URL | Keyword principal | Formato AEO/GEO |
|---|--------|------|-----|-------------------|-----------------|
| 1 | Fran | Pillar | `/growth-marketing-b2b/` | growth marketing B2B | Respuesta directa + tabla de KPIs |
| 2 | Fran | Spoke | `/noticias/demand-gen-vs-lead-gen-b2b/` | demand generation vs lead generation | Tabla comparativa (snippet de tabla) |
| 3 | Fran | Tool | `/herramientas/calculadora-presupuesto-growth/` | calculadora presupuesto marketing B2B | Formulario interactivo |
| 4 | Matías | Pillar | `/marketing-data-science/` | marketing data science | Respuesta directa + lista de 5 pasos + tabla |
| 5 | Matías | Spoke | `/noticias/implementar-ga4-server-side-gcp/` | cómo implementar GA4 server-side | Lista ordenada (snippet de proceso) + código |
| 6 | Matías | Tool | `/herramientas/inspector-senal-tracking/` | auditor tracking / EMQ | Formulario interactivo (linkbaiting) |

---

## 6. Checklist de cumplimiento de la consigna

- [x] **Al menos 3 páginas/artículos clave** → se entregan **6 piezas** (3 por perfil).
- [x] **Título** → title tag + meta description definidos por pieza.
- [x] **URL sugerida** → URLs limpias y jerárquicas por pieza.
- [x] **Estructura de headings (H1, H2, H3)** → jerarquía completa definida y verificada por pieza.
- [x] **Enfoque semántico** → entidades y términos clave por pieza.
- [x] **Criterios E-E-A-T aplicados** → autoría, bio, JSON-LD con autor/organización/fechas, evidencia propia.
- [x] **Justificación de SERP feature / citación por IA en ≥1 caso** → desarrollo principal de la Pieza 2 + casos secundarios (Piezas 5 y 3).

---

> **Actualización (Punto 5 — Consideraciones técnicas):** se refinaron los tipos de datos estructurados del sitio.
> Las dos herramientas pasaron de `WebApplication` a **`SoftwareApplication`** (con `offers` gratuitos); la guía técnica
> de GA4 (Pieza 5) pasó de `NewsArticle` a **`TechArticle`** (con `proficiencyLevel`), al igual que las guías técnicas de
> EMQ y Atribución en Python. Las *pillar pages* incorporan además **`Service`** y `Person` en un `@graph` JSON-LD.
> Detalle completo en `docs/tp-punto-5-consideraciones-tecnicas.md`.
