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

#### Medir, no suponer: cómo se obtienen estos indicadores

Los umbrales de la tabla **no se cumplen por declaración**: hay que **entrar a una página y medirlos**. La evaluación de Google no usa el promedio, sino el **percentil 75** de las cargas reales, **separando móvil y escritorio**: al menos el 75 % de las visitas debe alcanzar el umbral "bueno" en las tres métricas **a la vez** para que la página apruebe.

**Dos formas de medir, que se complementan:**

| Tipo | Fuente | Herramientas | Para qué sirve |
|---|---|---|---|
| **Datos de campo** | Usuarios reales (Chrome User Experience Report, **CrUX**) | PageSpeed Insights, Search Console, Chrome DevTools | Radiografía real del sitio en el percentil 75 |
| **Datos de laboratorio** | Entorno simulado | **Lighthouse** | Diagnosticar y prevenir problemas antes de publicar |

> ⚠️ **Salvedad clave:** Lighthouse **no puede medir INP** (en un entorno simulado no hay un usuario real interactuando). En su lugar reporta **Total Blocking Time (TBT)** como aproximación. Por eso el laboratorio es excelente para diagnosticar, pero **no reemplaza la medición de campo**: la experiencia real depende del dispositivo, la red y el comportamiento de cada persona.

**Protocolo de medición (paso a paso, para dejar registro en el PDF):**

1. Entrar a **PageSpeed Insights** (`pagespeed.web.dev`) y pegar la URL de la página a evaluar.
2. Leer el **bloque superior** del informe = *datos de campo* (CrUX). Si la página es nueva o tiene poco tráfico, puede no haber datos de campo todavía.
3. Leer el **informe de Lighthouse** = *datos de laboratorio* (LCP, CLS y **TBT** en lugar de INP).
4. Repetir la corrida en **móvil y escritorio**, y anotar **LCP / INP / CLS del percentil 75** contrastándolos contra los umbrales "bueno".
5. Guardar **captura de pantalla + tabla de resultados** para adjuntar al PDF entregable.

**Plantilla de registro (completar por página):**

| Página | Dispositivo | LCP (≤ 2,5 s) | INP (≤ 200 ms) | CLS (≤ 0,1) | Estado |
|---|---|---|---|---|---|
| `/` (home) | Móvil | | | | |
| `/` (home) | Escritorio | | | | |
| Página de conversión | Móvil | | | | |

**Palancas WPO para corregir (según la documentación de Google):**

- Priorizar la **imagen principal del LCP** y **nunca** aplicarle carga diferida (*lazy loading*).
- Aplicar `loading="lazy"` **solo** a las imágenes que están por debajo del pliegue.
- Reservar siempre las **dimensiones** (`width`/`height`) de imágenes, videos y anuncios → evita los saltos que disparan el **CLS**.
- Reducir el **trabajo de JavaScript en el hilo principal** → mejora el **INP**.

> **Contexto SEO:** los Core Web Vitals son **una señal entre muchas**, no la única. La **relevancia y la calidad del contenido** siguen teniendo el peso primario, así que buscar un puntaje perfecto solo por SEO no es el mejor uso del tiempo. El objetivo real es **mejorar la experiencia de las personas**, que es lo que los sistemas de Google buscan premiar.

#### Las tres configuraciones móviles de Google

Google reconoce **tres formas** de construir un sitio que funcione bien en celulares, y cada una exige cuidados distintos:

| Configuración | Cómo trabaja | Estructura | Costo de mantenimiento |
|---|---|---|---|
| **Responsive design** (diseño responsivo) | El servidor entrega el **mismo HTML en la misma URL**, sin importar el dispositivo; el diseño se adapta al tamaño de pantalla | 1 URL · 1 HTML | Bajo — contenido y metadatos idénticos en móvil y desktop |
| **Dynamic serving** (publicación dinámica) | **Misma URL**, pero el servidor entrega un **HTML distinto según el dispositivo**, apoyándose en el encabezado `Vary: user-agent` | 1 URL · N HTML | Alto — hay que mantener variantes sincronizadas |
| **Separate URLs** (URLs separadas) | **Páginas distintas en direcciones distintas**, típicamente `m.ejemplo.com` para la versión móvil | N URLs · N HTML | Alto — hay que mantener dos versiones sincronizadas |

**La opción que Google recomienda es *responsive design***, porque es la más fácil de implementar y mantener: al compartir contenido y metadatos entre móvil y desktop, desaparecen los errores de desincronización. Las otras dos configuraciones obligan a mantener dos versiones en paralelo, y ahí es donde suelen aparecer los problemas.

**Decisión del proyecto: `web-multipage` usa *responsive design*.** Motivos:

1. **Mobile-first indexing** — Google evalúa con su rastreador móvil; con una sola versión, lo que rastrea en móvil es exactamente el mismo HTML que ve el usuario de escritorio.
2. **Paridad SSR** — el mismo HTML estático sirve a buscadores, crawlers de IA y navegadores, sin ramas condicionales por user-agent.
3. **Menor costo y menor riesgo** — no hay dos plantillas que sincronizar, por lo que no puede haber *content drift* ni *cloaking* accidental.
4. **Alineado con el stack** — HTML/CSS/JS puro, sin servidor de aplicación que haga *sniffing* de user-agent.

**Evidencia en el sitio (y descarte explícito de las otras dos configuraciones):**

- **URL única por página** y el mismo HTML para todos los dispositivos (23 archivos `.html`, uno por vista).
- `<meta name="viewport" content="width=device-width, initial-scale=1.0" />` presente en **las 23 páginas** (verificado con `grep -rl 'name="viewport"' --include="*.html"`).
- Adaptación por **media queries** en `css/styles.css`: `@media (max-width: 960px)`, `@media (max-width: 760px)`, `@media (max-width: 420px)` y `@media print`.
- **Sin encabezado `Vary: user-agent`** → no se usa *dynamic serving*.
- **Sin subdominio `m.featuregrowth.cl`** ni rutas móviles paralelas → no se usan *separate URLs*.

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

#### Caso práctico: `aviso-legal.html` — rastreo ≠ indexación

La página **`aviso-legal.html`** es pública (va enlazada en el footer de todas las páginas) pero **no debe aparecer en los resultados de búsqueda**. Es el ejemplo exacto del malentendido más común de `robots.txt`: **bloquear una URL con `Disallow` controla el rastreo, no la indexación**, y una página bloqueada puede seguir indexándose a través de enlaces externos —mostrando la URL desnuda, sin descripción—.

Por eso la decisión implementada fue:

| Mecanismo | Estado | Motivo |
|---|---|---|
| `<meta name="robots" content="noindex, follow">` | **Sí** | Es la forma real de impedir la indexación. `follow` conserva el flujo de enlaces internos. |
| `Disallow: /aviso-legal.html` en `robots.txt` | **No** | Si se bloqueara el rastreo, Googlebot **no podría leer el `noindex`**, anulando el objetivo. `robots.txt` solo documenta la decisión en un comentario. |
| Inclusión en `sitemap.xml` | **No** | No se sugiere a los buscadores una URL que no debe indexarse. |
| Enlace en el footer | **Sí** | La página debe ser accesible para el usuario (finalidad legal), sin depender de que sea indexable. |

> **Regla de oro:** `robots.txt` = gestión del tráfico de rastreo (crawl budget); `noindex` (etiqueta o encabezado `X-Robots-Tag`) = control de aparición en resultados. Para información sensible, la única protección confiable es la contraseña.

##### ¿Por qué no bloqueamos el aviso legal con `Disallow`?

La pregunta natural es: si no queremos que aparezca, ¿por qué dejar que lo rastreen? La respuesta es que **el `noindex` necesita que la página sea rastreada al menos una vez** para poder leerse. El razonamiento completo:

1. **`Disallow` anularía el `noindex`.** Si se bloquea el rastreo, Googlebot no descarga la página, por lo tanto **nunca ve la directiva `noindex`** y esta queda inútil. Bloquear y desindexar son objetivos distintos que se estorban entre sí cuando se combinan sin criterio.
2. **Un solo rastreo es suficiente.** El aviso legal es una página estática que no cambia; Googlebot la rastrea una vez, procesa el `noindex` y la excluye del índice. A partir de ahí deja de volver a rastrearla por su cuenta.
3. **El ahorro de *crawl budget* es irrelevante aquí.** El motivo para bloquear en `robots.txt` es no malgastar rastreo (sitios de decenas de miles de URLs). Bloquear **una** URL estática en un sitio chico no aporta ningún ahorro real; en cambio, sí sacrifica la garantía de de-indexación.
4. **Priorizamos la garantía.** El riesgo de que una URL bloqueada se indexe vía enlaces externos ("sin descripción") es bajo acá (no hay enlaces externos al aviso legal), pero existe; con `noindex` + rastreo permitido el resultado es determinista.

**Conclusión:** para este caso el `noindex` sin `Disallow` es la opción técnicamente correcta. Se reservaría el `Disallow` para contenido de bajo valor que **solo** se quiera ahorrar de rastrear y para el que no importe la indexación (p. ej. parámetros de filtros o URLs internas de resultados). Si en algún momento se necesitara bloquearlo, el protocolo correcto sería: **primero permitir el rastreo para que Google lea el `noindex` y lo desindexe, y solo después añadir el `Disallow`.**

### 3.2 Rendimiento WPO y paridad móvil
- **71/71 imágenes** con atributos `width` y `height` → reserva de espacio en el DOM (protege el **CLS ≤ 0,1**).
- **`loading="lazy"`** aplicado a imágenes secundarias; la zona *hero* es de texto/gradiente (sin imagen LCP con lazy).
- Contenido principal **visible en el HTML fuente**, no oculto tras gestos; el menú móvil mantiene los enlaces en el DOM (rastreables).
- Sin dependencia de frameworks: HTML/CSS/JS puro → sin *hydration* ni bloqueo de render.

### 3.3 Datos estructurados
Implementados según la tabla del Eje 4, en el `<head>` de cada página (JSON-LD), con `@graph` cuando se agrupan entidades (pillars y equipo).

### 3.4 Localización, idioma y hreflang

**Marco.** Un sitio **multilingüe** ofrece contenido en más de un idioma; uno **multirregional** apunta a usuarios de distintos países. El `hreflang` es la anotación que **relaciona las variantes** de una misma página y le indica a Google cuál mostrar a cada usuario. Un punto que se malinterpreta seguido: **hreflang no es un detector de idioma**. Google no lo usa (ni el atributo `lang`) para descubrir en qué idioma está escrita una página —eso lo resuelve con sus propios algoritmos—, sino para emparejar la versión correcta.

**El caso de `featuregrowth.cl`: sitio mono-mercado (solo Chile).** La operación actual tiene base y foco en **Chile**, y el contenido no es solo "en español": está **localizado** para ese mercado (modismos, moneda `priceCurrency: CLP`, casos locales). Por eso existe **una sola versión por URL** y no hay variantes de idioma ni de región que relacionar. Consecuencia técnica: **`hreflang`, `x-default` y los `alternate` del sitemap no aplican**; implementarlos hoy sería redundante y, peor, propenso al error clásico de anotaciones no recíprocas (si A apunta a B, B debe apuntar de vuelta a A, o Google ignora la anotación). La decisión correcta es **no señalizar** y, en cambio, cuidar la coherencia del locale.

**Consistencia implementada.** Todas las señales de idioma/región apuntan a un único valor (Chile):

| Señal | Dónde | Valor |
|---|---|---|
| `<html lang>` | 24 páginas | `es-CL` |
| `inLanguage` (JSON-LD) | 14 páginas | `es-CL` |
| `og:locale` (Open Graph) | páginas con OG | `es_CL` |
| `priceCurrency` (JSON-LD `Offer`) | herramientas | `CLP` |
| `areaServed` (JSON-LD `Service`) | pillars | `CL` |
| Formateo de números | `js/tools.js` | `es-CL` |

Las menciones de alcance comercial del sitio (hero, visión, servicios) también quedaron alineadas a **Chile**. Las referencias a *LATAM* que restan en Noticias pertenecen al **tema** de los informes referenciales (su mercado de análisis), no a la operación declarada.

> **Por qué importa señalizar cuando la localización avance.** El encuadre regional lo resume: *una localización mal señalizada desperdicia toda la inversión en traducción y contenido regional*. Se puede invertir mucho en adaptar el contenido a cada país; si los buscadores no logran emparejar al usuario con la página correcta, ese esfuerzo se pierde.

**Roadmap si se expande a otros mercados hispanohablantes.** Los modismos y los precios cambian por país, así que expandirse **no es traducir: es adaptar** (tono, moneda, casos). Cuando existan versiones por país, corresponde: **(1)** elegir **un único** método de `hreflang` (etiquetas HTML, encabezados HTTP o sitemap) y sostenerlo con disciplina; **(2)** anotaciones **recíprocas y con auto-referencia**, con URLs **completamente calificadas** (protocolo incluido); **(3)** marcar una `x-default` como página de respaldo; y **(4)** **no** adaptar por IP —los rastreos de Google salen mayormente de Estados Unidos, por lo que podría rastrear la variante equivocada—, sino ofrecer un **selector visible de país e idioma**.

---

## 4. Checklist de cumplimiento

- [x] Configuración móvil **responsive design** (de las tres de Google) — Meta viewport en las **23 páginas** + media queries en `styles.css` (*mobile-first*).
- [x] `width`/`height` en todas las imágenes (CLS).
- [x] Lazy loading selectivo (sin lazy en zona hero/LCP).
- [x] `robots.txt` con apertura explícita a crawlers de IA.
- [x] `sitemap.xml` completo y jerarquizado.
- [x] Aviso legal (`aviso-legal.html`) con `noindex, follow`, fuera del sitemap y **sin** bloqueo en `robots.txt` (rastreo ≠ indexación).
- [x] IndexNow (clave + referencia de ping).
- [x] Contenido clave en HTML estático (paridad SSR).
- [x] JSON-LD avanzado: `Organization`, `Person`, `Service`, `TechArticle`, `SoftwareApplication`, `CollectionPage`.
- [x] Datos estructurados válidos (verificación automática en el build local).
- [x] Locale unificado a Chile (`lang="es-CL"`, `inLanguage "es-CL"`, `og:locale es_CL`, `priceCurrency CLP`, `areaServed CL`) — **sin `hreflang`**: una sola versión por página (mercado Chile).

---

## 5. Material para la presentación final (slide)

> Bloques **autocontenidos**, pensados como **diapositivas** del documento final. Se pueden copiar tal cual a la presentación. El primero cubre las **tres configuraciones móviles** de Google; el segundo, la **medición de los Core Web Vitals**.

### Slide 1 — «Sitio apto para móviles: las tres configuraciones de Google»

**Google reconoce tres formas de construir un sitio que funcione bien en celulares, y conviene conocerlas porque cada una exige cuidados distintos:**

- **Responsive design (diseño responsivo):** el servidor entrega el **mismo HTML en la misma URL**, sin importar el dispositivo, y el diseño se adapta al tamaño de pantalla. Es la opción que Google recomienda, por ser la más fácil de implementar y mantener.
- **Dynamic serving (publicación dinámica):** se usa la **misma URL**, pero el servidor entrega un **HTML distinto según el dispositivo**, apoyándose en el encabezado `Vary: user-agent`.
- **Separate URLs (URLs separadas):** se sirven **páginas distintas en direcciones distintas**, típicamente del estilo `m.ejemplo.com` para la versión móvil.

En el diseño responsivo, **contenido y metadatos son idénticos** en ambas versiones, lo que minimiza los errores. Las otras dos configuraciones requieren mantener **dos versiones sincronizadas**, y ahí es donde suelen aparecer los problemas.

> ✅ **La configuración que usa `featuregrowth.cl` es *Responsive design*:** una URL por página, el mismo HTML para todos los dispositivos, `viewport` en las 23 páginas y adaptación por *media queries* en `css/styles.css`.

**Apoyos para defender la elección (notas del orador):**

1. **Mobile-first indexing:** con una sola versión, el HTML que Google rastrea en móvil es el mismo que ve el usuario de escritorio.
2. **Una sola fuente de verdad:** sin `Vary: user-agent` (→ no es *dynamic serving*) y sin `m.featuregrowth.cl` (→ no son *URLs separadas*).
3. **Menos mantenimiento:** no hay dos plantillas que sincronizar, así no hay *content drift* ni *cloaking* accidental.
4. **Coherente con el stack:** HTML/CSS/JS puro, sin *sniffing* de user-agent en servidor.

---

### Slide 2 — «Core Web Vitals: medir, no suponer»

**Google mide la experiencia real con tres métricas, y no se aprueban por declaración: hay que entrar a la página y medirlas.**

| Métrica | Qué mide | Umbral "bueno" |
|---|---|---|
| **LCP** (Largest Contentful Paint) | Velocidad de carga del contenido principal | **≤ 2,5 s** |
| **INP** (Interaction to Next Paint) | Capacidad de respuesta / interactividad | **≤ 200 ms** |
| **CLS** (Cumulative Layout Shift) | Estabilidad visual (evitar saltos de layout) | **≤ 0,1** |

**La evaluación es por percentil, no por promedio:** al menos el **75 % de las cargas** debe alcanzar el umbral "bueno" en las **tres métricas a la vez**, y se separa **móvil** de **escritorio**.

**Cómo se miden (dos fuentes complementarias):**
- **Datos de campo** — usuarios reales, vía **CrUX**: **PageSpeed Insights**, Search Console y Chrome DevTools.
- **Datos de laboratorio** — entorno simulado con **Lighthouse**, para diagnosticar y prevenir antes de publicar.

> ⚠️ **Lighthouse no mide INP** (no hay usuario interactuando en el laboratorio): usa **Total Blocking Time (TBT)** como aproximación. El laboratorio diagnostica; la medición de campo manda.

**Cierre:** los Core Web Vitals son **una señal entre muchas**; la relevancia y la calidad del contenido siguen pesando primero. El objetivo no es el puntaje perfecto, sino mejorar la experiencia real de las personas.

**Evidencia a registrar (para el PDF):** captura de **PageSpeed Insights** por página (móvil y escritorio) con los valores **LCP / INP / CLS** del percentil 75.

---

### Slide 3 — «Localización, no solo idioma: por qué hoy no usamos hreflang»

**Multilingüe ≠ multirregional.** Multilingüe = contenido en más de un idioma; multirregional = apuntar a usuarios de distintos países. El `hreflang` **relaciona variantes** de la misma página; **no** detecta en qué idioma está escrita (eso lo resuelve Google con sus algoritmos).

**Nuestro caso: solo Chile.** Feature Growth opera hoy **solo en Chile**: una sola versión por URL, con contenido **localizado** (modismos, `CLP`, casos locales) y todas las señales de locale apuntando a un único valor: `es-CL` / `es_CL` / `CLP` / `areaServed CL`.

**Por qué no usamos hreflang (todavía).** Sin variantes de idioma o región, **no hay nada que relacionar**: sería redundante y propenso al error de anotaciones no recíprocas. No se señaliza lo que no existe.

**Cuándo sí lo usaríamos.** Al expandir a otros países, **no alcanza con traducir: hay que adaptar** (tono, modismos, moneda, casos). Ahí entra `hreflang` recíproco + `x-default` como respaldo + **selector visible de país/idioma** (nunca redirección por IP, que Google desaconseja).

> **Idea fuerza:** *una localización mal señalizada desperdicia toda la inversión en contenido regional*.
