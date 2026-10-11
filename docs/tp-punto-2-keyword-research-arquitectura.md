# TP Final SEO + GEO — Punto 2: Keyword research y arquitectura de contenidos

**Proyecto:** Feature Growth (agencia de Marketing, Data e IA B2B) · `featuregrowth.cl`
**Alcance:** marco metodológico, matriz de **24 keywords** (12 por perfil) con intención y *business potential*, arquitectura de *topic clusters* (pillars, spokes y herramientas), reglas de *siloing* y **auditoría de cumplimiento** en el sitio.

> **Nota de terminología.** El plan original ubicaba los *spokes* en `/blog/…`. Ese modelo se descartó: **hoy viven en la sección Noticias (`/noticias/`)**, que funciona como hub + historial de publicaciones. En todo este documento, "artículo" equivale a una pieza dentro de Noticias.
>
> **Relación con el Punto 3.** El detalle on-page de 6 de estas piezas (título, URL, headings H1/H2/H3, EEAT y estrategia SERP/IA) está desarrollado en [`docs/tp-punto-3-plan-onpage.md`](tp-punto-3-plan-onpage.md).

---

## 1. Marco metodológico general

1. **De palabras clave a Autoridad Temática (*Topical Authority*):** no se posicionan términos sueltos ni se aplica *keyword stuffing*. Se construyen **Topic Clusters (Hub & Spoke / Silos)** que demuestran cobertura temática profunda a buscadores tradicionales (Google/Bing) y a motores generativos (ChatGPT, Gemini, Perplexity).
2. **Criterio de selección (intención & *Business Potential*):** el volumen de búsqueda aislado es engañoso. Solo se seleccionan términos cuya intención se alinee con la oferta del negocio y permitan presentar los servicios de forma natural.
3. **Respuestas generativas y *Query Fan-Out*:** los sistemas de respuesta generativa usan *Retrieval-Augmented Generation* (RAG) y dividen consultas complejas en múltiples subconsultas en paralelo. Las páginas deben cubrir la pregunta literal **y** el abanico de preguntas que la rodea.
4. **Optimización en 3 capas (SEO + AEO + GEO):**
   - **Capa 1 — SEO (cimientos):** indexación, jerarquía HTML, E-E-A-T y red de enlaces internos.
   - **Capa 2 — AEO:** bloques de respuesta directa autocontenidos (40–60 palabras) bajo cada H2, para capturar *Featured Snippets* (Posición Cero).
   - **Capa 3 — GEO:** máxima densidad de evidencia (datos cuantitativos, porcentajes, tablas y código), en línea con el *paper* de Princeton (Aggarwal et al., 2023).

---

## 2. Entregable 1 — Perfil Fran (Growth Marketing B2B y Generación de Demanda)

### A. Punto de partida y oportunidad
- **Buyer persona:** Founders, CMOs, Directores de Marketing y VPs de Ventas de empresas B2B y SaaS en América Latina.
- **Oportunidad:** vacío de contenido experto en español que combine *growth marketing* B2B con digitalización de eventos corporativos y evidencia empírica.

### B. Matriz de keywords (12 términos B2B)
| Palabra clave / prompt objetivo | Intención | Business Potential | Capa asignada | URL destino en el sitio |
| :--- | :--- | :--- | :--- | :--- |
| agencia de growth marketing B2B | Comercial | Alto | SEO / GEO | `/` y `/growth-marketing-b2b/` |
| estrategias de generación de demanda B2B | Informacional profunda | Alto | SEO / AEO / GEO | `/growth-marketing-b2b/` |
| cómo medir el ROI de un evento corporativo | Informacional / Transaccional | Alto | SEO / AEO | `/noticias/medir-roi-eventos-corporativos/` |
| demand gen vs lead gen diferencias | Comercial / Investigación | Medio | AEO / GEO | `/noticias/demand-gen-vs-lead-gen-b2b/` |
| embudo de ventas B2B para empresas SaaS | Informacional | Alto | SEO / GEO | `/growth-marketing-b2b/` + `/servicios/crm-automatizacion-ia.html` |
| mejores agencias de marketing B2B en LATAM | Comercial (listado) | Alto | GEO (citabilidad off-page) | `/` + Punto 4 (Off-Page) |
| captación de leads cualificados en eventos B2B | Informacional | Alto | SEO / GEO | `/noticias/medir-roi-eventos-corporativos/` |
| estrategias de social selling para ejecutivos | Informacional | Medio | SEO | `/servicios/consultoria-estrategica.html` |
| calculadora de presupuesto de growth marketing | Transaccional / Tool | Alto | Off-Page / Linkbaiting | `/herramientas/calculadora-presupuesto-growth/` |
| métricas clave de crecimiento B2B CAC LTV | Informacional | Medio | AEO / GEO | `/growth-marketing-b2b/` |
| cómo optimizar el pipeline de ventas B2B | Informacional | Alto | SEO / GEO | `/noticias/optimizar-pipeline-ventas-b2b/` |
| tecnología para eventos corporativos B2B | Comercial | Alto | SEO / GEO | `/noticias/medir-roi-eventos-corporativos/` + `/servicios/marca-eventos.html` |

### C. Arquitectura de contenidos (Cluster B2B)
1. **Pillar (Hub Central):** `/growth-marketing-b2b/` — guía marco de los 4 pilares (Performance, Eventos, CRM/IA y Consultoría).
2. **Spoke 1 (Medición de eventos):** `/noticias/medir-roi-eventos-corporativos/` — captura de First-Party Data con QR y cálculo del CAC real.
3. **Spoke 2 (Comparativa de estrategia):** `/noticias/demand-gen-vs-lead-gen-b2b/` — respalda la regla 70/30 de distribución presupuestaria.
4. **Spoke 3 (Velocidad de pipeline):** `/noticias/optimizar-pipeline-ventas-b2b/` — aceleración del ciclo comercial, *lead scoring* y *Win Rate*.
5. **Tool Page (Linkbaiting):** `/herramientas/calculadora-presupuesto-growth/` — calculadora de inversión y retorno B2B.

---

## 3. Entregable 2 — Perfil Matías (Marketing Data Science, Analítica e IA)

### A. Punto de partida y oportunidad
- **Buyer persona:** Heads of Data, Growth Engineers, CMOs técnicos y CTOs de e-commerce y plataformas digitales.
- **Oportunidad:** alta demanda de soluciones ante la pérdida de señal (*signal loss*) por el fin de las cookies de terceros y los bloqueadores.

### B. Matriz de keywords (12 términos técnicos)
| Palabra clave / prompt objetivo | Intención | Business Potential | Capa asignada | URL destino en el sitio |
| :--- | :--- | :--- | :--- | :--- |
| marketing data science consultoría | Comercial | Alto | SEO / GEO | `/marketing-data-science/` |
| cómo implementar GA4 server side | Informacional técnica | Alto | SEO / AEO / GEO | `/noticias/implementar-ga4-server-side-gcp/` |
| mejores prácticas Meta CAPI e-commerce | Informacional / Comercial | Alto | SEO / GEO | `/noticias/optimizar-event-match-quality-meta-capi/` |
| auditoría de event match quality score | Transaccional / Tool | Alto | Off-Page / Linkbaiting | `/herramientas/inspector-senal-tracking/` |
| soluciones a la pérdida de cookies de terceros | Informacional | Alto | AEO / GEO | `/marketing-data-science/` |
| modelos de atribución con python y marketing | Informacional técnica | Alto | SEO / GEO | `/noticias/modelos-atribucion-marketing-python/` |
| automatizaciones de marketing con python | Informacional | Medio | SEO | `/servicios/crm-automatizacion-ia.html` |
| cómo mejorar la señal de conversiones en TikTok Ads | Informacional | Alto | SEO / AEO | `/marketing-data-science/` |
| ga4 bigquery exportación de datos guía | Informacional técnica | Medio | SEO / GEO | `/noticias/modelos-atribucion-marketing-python/` |
| first party data estrategia para e-commerce | Informacional | Alto | SEO / GEO | `/marketing-data-science/` |
| agencias especializadas en server side tracking LATAM | Comercial | Alto | GEO (citabilidad off-page) | `/` + Punto 4 (Off-Page) |
| configuración de stape io y google tag manager server | Informacional técnica | Alto | SEO / AEO | `/noticias/implementar-ga4-server-side-gcp/` |

### C. Arquitectura de contenidos (Cluster Data & Analytics)
1. **Pillar (Hub Central):** `/marketing-data-science/` — pérdida de datos, arquitecturas server-side y atribución estadística.
2. **Spoke 1 (Tracking cloud):** `/noticias/implementar-ga4-server-side-gcp/` — despliegue de contenedor en GCP y GTM Server.
3. **Spoke 2 (Meta CAPI & privacidad):** `/noticias/optimizar-event-match-quality-meta-capi/` — elevación del EMQ con normalización y *hash* SHA256.
4. **Spoke 3 (Modelado en Python):** `/noticias/modelos-atribucion-marketing-python/` — Markov y Shapley sobre datos de BigQuery.
5. **Tool Page (Linkbaiting):** `/herramientas/inspector-senal-tracking/` — inspector de señal de tracking: stack de medición, deduplicación, PII sin hashear, consentimiento y server-side.

---

## 4. Reglas de enlazado interno (siloing)

- **Flujo vertical de autoridad:** todos los *spokes* y *tool pages* incluyen un enlace interno hacia su Pillar (`/growth-marketing-b2b/` o `/marketing-data-science/`) con **texto ancla descriptivo** (sin "clic aquí" ni "leer más").
- **Flujo horizontal / transversal:** la Pillar enlaza a cada *spoke* al introducir su subtema, y los *spokes* se cruzan entre sí cuando aportan contexto (bloques "Recursos relacionados").
- **Traducción de entidades:** el texto nombra explícitamente entidades del sector (**HubSpot, Salesforce, Meta CAPI, GA4, BigQuery, LinkedIn Ads, Google Ads, Stape.io**) para reforzar la interpretabilidad en el grafo de conocimiento.

---

## 5. Auditoría de cumplimiento en el sitio

### 5.1 Arquitectura de URLs — ✅ cumplida al 100%
| Capa | URL del plan | URL real en el sitio | Estado |
|------|--------------|----------------------|--------|
| Pillar Fran | `/growth-marketing-b2b/` | `/growth-marketing-b2b/` | ✅ |
| Spoke eventos | `/blog/medir-roi-eventos-corporativos/` | `/noticias/medir-roi-eventos-corporativos/` | ✅ (adaptada) |
| Spoke comparativa | `/blog/demand-gen-vs-lead-gen-b2b/` | `/noticias/demand-gen-vs-lead-gen-b2b/` | ✅ (adaptada) |
| Spoke pipeline | `/blog/optimizar-pipeline-ventas-b2b/` | `/noticias/optimizar-pipeline-ventas-b2b/` | ✅ (adaptada) |
| Tool Fran | `/herramientas/calculadora-presupuesto-growth/` | igual | ✅ |
| Pillar Matías | `/marketing-data-science/` | igual | ✅ |
| Spoke GA4 | `/blog/implementar-ga4-server-side-gcp/` | `/noticias/implementar-ga4-server-side-gcp/` | ✅ (adaptada) |
| Spoke EMQ | `/blog/optimizar-event-match-quality-meta-capi/` | `/noticias/optimizar-event-match-quality-meta-capi/` | ✅ (adaptada) |
| Spoke atribución | `/blog/modelos-atribucion-marketing-python/` | `/noticias/modelos-atribucion-marketing-python/` | ✅ (adaptada) |
| Tool Matías | `/herramientas/inspector-senal-tracking/` | igual | ✅ |

### 5.2 Siloing — ✅ cumplido
- Enlaces verticales a los pillars presentes.
- **0 textos ancla genéricos** ("clic aquí"/"leer más").
- Entidades presentes: Meta CAPI, GA4, BigQuery, LinkedIn Ads, Google Ads, Markov, Shapley, SHA256, HubSpot, Salesforce, Stape.io.

### 5.3 Cobertura de keywords — hallazgos y cierre
Auditoría sobre el contenido de `<main>` (evitando coincidencias de footer/menú). Se listan los gaps detectados y la acción aplicada.

| Perfil | Keyword | Estado inicial | Acción de cierre aplicada |
|--------|---------|----------------|---------------------------|
| Fran | agencia de growth marketing B2B | No cubierta | Añadido "agencia de growth marketing B2B" en el home y en la Pillar |
| Fran | embudo B2B / SaaS | Parcial (sin "SaaS") | Incorporada la entidad **SaaS** (home, Pillar y servicios) |
| Fran | captación de leads cualificados en eventos B2B | Parcial | Agregado párrafo con "leads cualificados" en el artículo de eventos |
| Fran | tecnología para eventos corporativos B2B | Parcial (solo servicios) | Agregada mención "tecnología para eventos corporativos B2B" en el artículo |
| Matías | server-side tracking + LATAM | Parcial | Añadida frase "empresas SaaS y de e-commerce en LATAM" en la Pillar de Data |
| Matías | configuración de stape.io y GTM server | No cubierta | Agregada mención a **Stape.io** en el artículo de GA4 Server-Side |
| Ambos | HubSpot / Salesforce (entidades) | Bajo | Añadidas entidades en la Pillar B2B y en el servicio de CRM |

**Keywords asignadas a GEO / Off-Page** ("mejores agencias de marketing B2B en LATAM" y "agencias especializadas en server side tracking LATAM"): no requieren sección on-page; su cobertura depende de citabilidad externa (Digital PR), desarrollada en el Punto 4.

---

## 6. Checklist de cumplimiento del Punto 2

- [x] **Marco metodológico** (topical authority, business potential, query fan-out, capas SEO/AEO/GEO).
- [x] **Matriz de 24 keywords** con intención, *business potential* y capa asignada.
- [x] **Arquitectura de contenidos** (Pillars + Spokes + Tool por cluster) con URLs reales.
- [x] **Reglas de siloing** definidas y verificadas.
- [x] **Auditoría de cumplimiento** con gaps detectados y acciones de cierre aplicadas.
