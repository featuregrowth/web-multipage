# Guía GA4 + GTM · Medición de la web Feature Growth

> **Propósito.** Documento instructivo y didáctico para **entender** y **hacer funcionar** Google Analytics 4 (GA4) a través de Google Tag Manager (GTM) en este sitio. Sirve tanto si la medición **ya está implementada** (para verificarla) como si se quiere **replicar desde cero** (para aprender).
>
> **IDs de este proyecto**
>
> | Recurso | ID | Dónde vive |
> |---|---|---|
> | Contenedor GTM | `GTM-T5N7DK76` | Snippet en el `<head>` + `noscript` en el `<body>` |
> | Propiedad GA4 (ID de medición) | `G-8FJNNKGSV6` | Flujo de datos web de la propiedad |
> | Cuenta de Google Analytics | `78441814` | Administrar → Cuenta → Datos de la cuenta |
>
> ⚠️ **ID de cuenta ≠ ID de medición.** El `78441814` es un identificador interno de la cuenta (nunca lleva `G-`). El que se usa para medir es el **ID de medición `G-XXXXXXXXXX`**, que está dentro de la **propiedad → flujo de datos web**, no en "Datos de la cuenta".

---

## Índice

1. [Conceptos clave](#1-conceptos-clave)
2. [Cómo encajan las piezas](#2-cómo-encajan-las-piezas)
3. [Estado actual del proyecto](#3-estado-actual-del-proyecto)
4. [Parte A — Crear la propiedad GA4 y obtener el `G-`](#parte-a--crear-la-propiedad-ga4-y-obtener-el-g-)
5. [Parte B — Instalar GTM (código en el sitio)](#parte-b--instalar-gtm-código-en-el-sitio)
6. [Parte C — Conectar GA4 dentro de GTM (etiqueta base)](#parte-c--conectar-ga4-dentro-de-gtm-etiqueta-base)
7. [Parte D — Eventos personalizados (Data Layer → GTM → GA4)](#parte-d--eventos-personalizados-data-layer--gtm--ga4)
8. [Parte E — Ajustes recomendados en GA4](#parte-e--ajustes-recomendados-en-ga4)
9. [Parte F — Pruebas y depuración](#parte-f--pruebas-y-depuración)
10. [Parte G — Publicar y checklist final](#parte-g--publicar-y-checklist-final)
11. [Tabla de eventos del proyecto](#tabla-de-eventos-del-proyecto)
12. [Errores comunes y solución](#errores-comunes-y-solución)
13. [Glosario](#glosario)
14. [Referencias oficiales](#referencias-oficiales)

---

## 1. Conceptos clave

### GA4 (Google Analytics 4)
Es la **herramienta que guarda y muestra los datos**. Recibe "eventos" (visitas, clics, envíos de formulario, scroll…), los procesa y los presenta en informes. Toda la medición de GA4 gira en torno a **eventos**, no a "páginas vistas" aisladas.

- Cada propiedad GA4 tiene un **ID de medición** con formato `G-XXXXXXXXXX`.
- Ese ID es el que se conecta al sitio (directamente con `gtag.js` o, preferido aquí, a través de GTM).

### GTM (Google Tag Manager)
Es el **gestor de etiquetas**: un contenedor (con ID `GTM-XXXXXXX`) que se instala **una sola vez** en el sitio y desde cuyo panel se administran todas las etiquetas de medición **sin volver a tocar el código**.

- **Etiqueta (Tag):** "qué se envía" (p. ej. la etiqueta `Google tag` con `G-8FJNNKGSV6`).
- **Disparador (Trigger):** "cuándo se envía" (p. ej. *Todas las páginas*, o *un evento personalizado*).
- **Variable:** "qué dato se usa" (p. ej. capturar un valor del Data Layer para enviarlo como parámetro).
- **Vista previa (Preview):** modo de prueba que muestra en tiempo real qué etiquetas disparan y con qué datos, sin publicar.

### Data Layer
Es una **capa de datos** en JavaScript (`window.dataLayer`) que sirve de puente entre el sitio y GTM. El sitio "empuja" (`push`) información a esa capa y GTM la lee.

```
Sitio (HTML/JS)  →  window.dataLayer.push({...})  →  GTM lee la capa  →  dispara etiquetas  →  GA4 recibe el dato
```

- `dataLayer` **debe existir antes** que el snippet de GTM. Por eso en el `<head>` el snippet de GTM declara `w[l]=w[l]||[]`.
- Un evento del Data Layer es un objeto con la clave `event`, por ejemplo:
  ```js
  window.dataLayer.push({ event: "calc_b2b_submit", event_category: "Engagement Tool" });
  ```

### `gtag.js` vs GTM
Son **dos caminos para conectar GA4**. No se deben usar a la vez para lo mismo (duplicaría los datos).

| | `gtag.js` (directo) | GTM (recomendado aquí) |
|---|---|---|
| Dónde se configura | En el código de cada página | En el panel de GTM |
| Cambiar algo | Editar y redeployar el sitio | Solo publicar en GTM |
| Eventos | `gtag('event', ...)` | Data Layer + etiquetas |
| Riesgo de duplicar | Alto si también hay GTM | Bajo si se centraliza todo en GTM |

---

## 2. Cómo encajan las piezas

```
┌────────────────────┐        ┌───────────────────────┐        ┌─────────────────┐
│  Página del sitio  │        │   Google Tag Manager  │        │      GA4        │
│  (HTML + JS)       │        │  (contenedor GTM-...) │        │  (propiedad G-) │
├────────────────────┤        ├───────────────────────┤        ├─────────────────┤
│ 1. Carga GTM       │───────▶│ 2. Lee Data Layer     │───────▶│ 4. Guarda el    │
│ 2. Empuja eventos  │        │ 3. Dispara etiquetas  │        │    evento       │
│    al Data Layer   │        │    (Google tag, GA4   │        │                 │
│                    │        │    Event, etc.)        │        │                 │
└────────────────────┘        └───────────────────────┘        └─────────────────┘
```

**Regla de oro:** un solo responsable por medición. En este proyecto **GTM es el responsable** y GA4 es el destino.

---

## 3. Estado actual del proyecto

| Elemento | Estado | Detalle |
|---|---|---|
| Contenedor GTM en el `<head>` | ✅ Implementado | 22 páginas HTML (todas excepto `embed.html`) |
| `noscript` de GTM en el `<body>` | ✅ Implementado | Fallback sin JavaScript |
| Helper `js/analytics.js` (`fgTrack`) | ✅ Implementado | Expone `window.fgTrack(evento, params)` → `dataLayer.push` |
| Eventos en `js/tools.js` | ✅ Implementado | Ver [tabla de eventos](#tabla-de-eventos-del-proyecto) |
| Etiqueta GA4 **dentro de GTM** | ⚠️ Pendiente | Se configura en el panel (Parte C) |
| Etiquetas de **eventos** en GTM | ⚠️ Pendiente | Se configuran en el panel (Parte D) |
| `embed.html` | ➖ Excluido a propósito | Es un widget para incrustar en otros sitios; no debe medir |

> **Conclusión:** el código del sitio ya está listo. Lo que falta es la **configuración dentro del panel de GTM** (Partes C y D).

---

## Parte A — Crear la propiedad GA4 y obtener el `G-`

> Si ya tienes el `G-8FJNNKGSV6`, salta a la Parte B. Esto es para crear/replicar desde cero.

1. Entra a **https://analytics.google.com**.
2. Abajo a la izquierda → **Administrar** (icono de engranaje).
3. En la columna **Cuenta** → **Crear** → **Propiedad**.
4. Nombre de la propiedad (p. ej. *Feature Growth Web*) y **zona horaria / moneda** → Siguiente.
5. Completa el perfil del negocio (sector, tamaño, objetivos) → **Crear**.
6. Acepta las condiciones.
7. **Flujo de datos**: elige **Web**.
   - **URL del sitio**: `https://featuregrowth.cl`
   - **Nombre del flujo**: *Web*
   - Clic en **Crear flujo**.
8. Aparecerá el **ID de medición** con formato `G-XXXXXXXXXX` (en este proyecto: `G-8FJNNKGSV6`). **Ese** es el dato que necesitas.

### ¿Dónde confirmar el ID de medición luego?
`Administrar` → columna **Propiedad** → **Flujos de datos** → clic en el flujo **Web** → arriba se ve **ID de medición** (`G-...`).

> Si **no ves "Flujos de datos"** en el menú de propiedad, probablemente la cuenta solo tiene una propiedad antigua de **Universal Analytics** (`UA-`). Esa NO genera un `G-`: hay que crear la propiedad **GA4**.

---

## Parte B — Instalar GTM (código en el sitio)

> **Ya está hecho en este proyecto.** Esta sección es de referencia para entender qué se instaló y cómo replicarlo.

El contenedor va en **dos partes**:

### B.1 — En el `<head>` (lo antes posible)

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T5N7DK76');</script>
<!-- End Google Tag Manager -->
```

### B.2 — En el `<body>` (justo después de `<body>`)

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T5N7DK76"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

### B.3 — Orden recomendado dentro del `<head>`

```html
<head>
  <meta charset="UTF-8" />
  <!-- 1) GTM lo antes posible -->
  <script>...GTM...</script>
  <!-- 2) Metadatos -->
  <title>...</title>
  <!-- 3) Helper de eventos del sitio (usa el dataLayer creado por GTM) -->
  <script src="js/analytics.js"></script>
</head>
```

#### ¿Y `gtag.js`?
Alternativa a GTM (no usar ambas a la vez):

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-8FJNNKGSV6"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-8FJNNKGSV6');
</script>
```

> En este proyecto **NO se pega `gtag.js`**, porque la etiqueta de GA4 se configura dentro de GTM. Hacerlo duplicaría los `page_view`.

---

## Parte C — Conectar GA4 dentro de GTM (etiqueta base)

Esta es la pieza que realmente **hace funcionar GA4**. Se hace en el panel de GTM.

1. Entra a **https://tagmanager.google.com** y abre el contenedor **`GTM-T5N7DK76`**.
2. Menú **Etiquetas** → **Nueva**.
3. Clic en *Configuración de la etiqueta* → elige **Etiqueta de Google** (*Google tag*).
4. En **ID de etiqueta** escribe: `G-8FJNNKGSV6`
5. **Disparador**: elige **Initialization – All Pages** *(Inicialización: todas las páginas)*.
   - *¿Por qué Inicialización?* Asegura que la configuración esté lista antes que cualquier evento. El `page_view` **se envía automáticamente** con esta etiqueta.
   - Alternativa válida: **All Pages** *(Todas las páginas)*.
6. (Opcional) Configuración de consentimiento: déjalo por defecto si aún no usas un banner de cookies.
7. **Guardar**.
8. Arriba a la derecha: **Vista previa** (para testear) o **Enviar** (para publicar). Ver [Parte F](#parte-f--pruebas-y-depuración) y [Parte G](#parte-g--publicar-y-checklist-final).

> **Resultado:** cada visita registra `page_view` en GA4. Si además GA4 tiene activada la *medición mejorada*, capturará scroll, clics salientes, descargas, etc.

---

## Parte D — Eventos personalizados (Data Layer → GTM → GA4)

El sitio ya empuja eventos al Data Layer con el helper `fgTrack`. Para que **lleguen a GA4** hay que crear, **por cada evento**, un disparador y una etiqueta en GTM.

### D.1 — Cómo funciona el helper (referencia de código)

`js/analytics.js`:

```js
window.dataLayer = window.dataLayer || [];
window.fgTrack = function (eventName, params) {
  var payload = { event: eventName };
  if (params) { for (var key in params) { if (params.hasOwnProperty(key)) payload[key] = params[key]; } }
  window.dataLayer.push(payload);
};
```

`js/tools.js` (ejemplo de uso):

```js
track("calc_b2b_submit", {
  event_category: "Engagement Tool",
  event_label: "Calculadora Presupuesto B2B"
});
```

Eso produce en el Data Layer:

```js
{ event: "calc_b2b_submit", event_category: "Engagement Tool", event_label: "Calculadora Presupuesto B2B" }
```

### D.2 — Crear un DISPARADOR de "Evento personalizado" (por cada evento)

1. GTM → **Disparadores** → **Nueva**.
2. *Configuración del disparador* → **Evento personalizado** (*Custom Event*).
3. **Nombre del evento**: escribe el valor exacto de `event` (p. ej. `calc_b2b_submit`).
4. Disparar en: **Todos los eventos personalizados** (basta con el nombre).
5. **Guardar**. Repite para cada evento de la [tabla](#tabla-de-eventos-del-proyecto).

### D.3 — Crear la ETIQUETA de evento GA4 (por cada evento)

1. GTM → **Etiquetas** → **Nueva**.
2. *Configuración de la etiqueta* → **Google Analytics: evento de GA4** (*GA4 Event*).
3. **ID de medición**: `G-8FJNNKGSV6`.
4. **Nombre del evento**: el mismo del disparador (p. ej. `calc_b2b_submit`).
5. **Parámetros del evento** (opcional): agrega filas usando variables del Data Layer.
   - Nombre del parámetro: `event_category` → Valor: `{{DL - event_category}}`
   - Nombre del parámetro: `event_label` → Valor: `{{DL - event_label}}`
6. **Disparador**: selecciona el disparador de evento personalizado correspondiente (D.2).
7. **Guardar**.

### D.4 — (Opcional) Crear variables del Data Layer

Para reutilizar valores de los `params` del helper:

1. GTM → **Variables** → *Variables definidas por el usuario* → **Nueva**.
2. Tipo: **Variable de capa de datos** (*Data Layer Variable*).
3. **Nombre de la variable de la capa de datos**: la clave exacta (p. ej. `event_category`).
4. Ponle un nombre claro (p. ej. `DL - event_category`) y **Guardar**.
5. Repite para `event_label`, etc.

> **Consejo:** nómbralos con prefijo (`DL - `) para identificarlos rápido en las etiquetas.

---

## Parte E — Ajustes recomendados en GA4

Ya en **https://analytics.google.com**, dentro de la propiedad:

| Ajuste | Ruta | Para qué |
|---|---|---|
| **Medición mejorada** | Administrar → Flujos de datos → Web → *Medición mejorada* | Captura scroll, clics salientes, descargas de archivos, búsqueda en el sitio, interacción con video |
| **Marcar eventos como conversiones** | Administrar → Eventos | Marcar `calc_b2b_submit`, `audit_emq_submit`, etc. como conversiones |
| **Eventos clave / Key events** | Administrar → Eventos clave | Renombrado de "conversiones" en la nueva UI |
| **Retención de datos** | Administrar → Recopilación de datos → Retención | Elegir 14 meses (o más si está disponible) |
| **Vincular Google Ads / Search Console** | Administrar → Vínculos de productos | Cruzar datos de buscador y campañas |
| **Filtro de tráfico interno** | Administrar → Flujos de datos → *Definir reglas de tráfico interno* | Excluir tus propias visitas del equipo |
| **Consentimiento (si aplica)** | GTM + banner de cookies | Modo de consentimiento para cumplir normativa |

> **Nota Chile/LATAM:** si se activa un banner de cookies, se recomienda implementar **Consent Mode v2** desde GTM. Fuera del alcance de esta guía, pero es el siguiente nivel.

---

## Parte F — Pruebas y depuración

### F.1 — Vista previa de GTM (imprescindible)
1. GTM → botón **Vista previa** (*Preview*).
2. Se abre **Tag Assistant** pidiendo la URL: `https://featuregrowth.cl`.
3. Navega el sitio. En el panel verás:
   - Los **eventos** del Data Layer que van ocurriendo (`Page View`, `calc_b2b_submit`, etc.).
   - Las **etiquetas disparadas** (`Google tag`, `GA4 Event`) y las que **no** dispararon.
   - Los **valores de variables** enviados.
4. Si pruebas en `localhost`, agrega `http://localhost:8000` (o tu puerto) como dominio permitido.

### F.2 — GA4: Tiempo real
- GA4 → **Informes** → **Tiempo real**. Abre el sitio en otra pestaña: deberías verte como usuario activo y ver los eventos.
- *Latencia:* puede tardar de segundos a un par de minutos.

### F.3 — GA4: DebugView
- GA4 → **Administrar** → **DebugView** (*Depurar*).
- Requiere activar el modo debug en el navegador (extensión **Google Analytics Debugger** o parámetro `?_dbg=1` según implementación). Muestra cada evento con sus parámetros.

### F.4 — Extensiones útiles
- **Tag Assistant Legacy / Google Tag Assistant** (oficial).
- **Google Analytics Debugger** (Chrome).
- **DataLayer Checker**.

---

## Parte G — Publicar y checklist final

### Publicar en GTM
1. Tras probar en **Vista previa**, cierra la vista previa.
2. Arriba a la derecha → **Enviar** (*Submit*).
3. Ponle un **nombre de versión** (p. ej. *GA4 base + eventos*) y una descripción.
4. **Publicar**.

### Checklist final

- [ ] La propiedad GA4 existe y tengo el **ID de medición `G-8FJNNKGSV6`**.
- [ ] El flujo de datos **Web** apunta a `https://featuregrowth.cl`.
- [ ] GTM está instalado en todas las páginas (snippet `<head>` + `noscript` `<body>`).
- [ ] Existe la etiqueta **Google tag** con `G-8FJNNKGSV6` disparando en *Initialization/All Pages*.
- [ ] GTM está **publicado** (última versión, no solo borrador).
- [ ] En GA4 **Tiempo real** veo mi visita (`page_view`).
- [ ] Los `fgTrack` de prueba aparecen como **eventos** en GA4.
- [ ] Los eventos clave están marcados como **conversiones / eventos clave**.
- [ ] **No** hay `gtag.js` pegado en el HTML (para no duplicar).
- [ ] `embed.html` NO incluye GTM (correcto).

---

## Tabla de eventos del proyecto

Todos se disparan vía `js/tools.js` → `fgTrack()` → `dataLayer.push`. Crea un disparador + etiqueta GA4 **por cada uno**.

| Nombre del evento | Se dispara cuando… | `event_category` | `event_label` |
|---|---|---|---|
| `calc_b2b_submit` | Se envía el formulario de la Calculadora de presupuesto B2B | `Engagement Tool` | `Calculadora Presupuesto B2B` |
| `audit_emq_submit` | Se envía la solicitud de auditoría de señal/EMQ | `Technical Tool` | `Auditor Signal Loss` |
| `calc_b2b_print` | Se pulsa imprimir en la calculadora | `Lead Generation` | `Calculadora Presupuesto B2B` |
| `calc_b2b_embed_copy` | Se copia el código de inserción de la calculadora | `Lead Generation` | `Calculadora Presupuesto B2B` |
| `audit_emq_badge_copy` | Se copia el código del badge del auditor | `Linkbaiting Engagement` | `Auditor Signal Loss` |
| `audit_emq_diagnosis_copy` | Se copia el diagnóstico del auditor | `Linkbaiting Engagement` | `Auditor Signal Loss` |

Además, GTM/GA4 registran automáticamente:

| Evento automático | Origen |
|---|---|
| `page_view` | Etiqueta base `Google tag` |
| `scroll`, `click` (outbound), `file_download`, `form_start`… | *Medición mejorada* de GA4 (si está activada) |

---

## Errores comunes y solución

| Síntoma | Causa probable | Solución |
|---|---|---|
| GA4 no registra nada | Etiqueta base ausente o no publicada | Crea la etiqueta `Google tag` y **publica** en GTM |
| Todo se cuenta **dos veces** | Están activos `gtag.js` **y** la etiqueta en GTM | Elimina uno de los dos |
| Los eventos no aparecen en GA4 | No hay **etiqueta GA4 Event** o el disparador no coincide | Crea la etiqueta + disparador con el nombre **exacto** del evento |
| "No hay flujos de datos" en la propiedad | Cuenta con solo propiedad `UA-` (Universal Analytics) | Crear propiedad **GA4** |
| Confundí el ID `78441814` con el de medición | Es el **ID de cuenta**, no el `G-` | El `G-` está en **Flujos de datos** |
| La Vista previa no conecta | Dominio/ruta no permitidos | Agrega la URL (incluye `localhost:puerto` si aplica) |
| Los eventos personalizados no cargan parámetros | Falta la variable de Data Layer | Crea `DL - event_category` y úsala en la etiqueta |
| Datos inflados por visitas internas | Sin filtro de tráfico interno | Definir reglas de tráfico interno en GA4 |

---

## Glosario

| Término | Significado |
|---|---|
| **GA4** | Google Analytics 4, la versión actual de Analytics, basada en eventos |
| **GTM** | Google Tag Manager, gestor de etiquetas |
| **Contenedor** | "Caja" de GTM (`GTM-XXXXXXX`) instalada en el sitio |
| **Etiqueta / Tag** | Instrucción de "qué enviar" (p. ej. `Google tag`, evento GA4) |
| **Disparador / Trigger** | Condición de "cuándo" se envía una etiqueta |
| **Variable** | Valor reutilizable que las etiquetas pueden leer |
| **Data Layer** | Array JS (`window.dataLayer`) puente entre el sitio y GTM |
| **`page_view`** | Evento automático de vista de página en GA4 |
| **Evento** | Acción medida (clic, envío, scroll…) |
| **Conversión / Evento clave** | Evento marcado como importante para el negocio |
| **ID de medición** | Identificador `G-XXXXXXXXXX` del flujo de datos |
| **ID de cuenta** | Identificador numérico de la cuenta (sin `G-`) |
| **DebugView** | Herramienta de GA4 para inspeccionar eventos en tiempo real |
| **Tag Assistant** | Herramienta de GTM para probar etiquetas (modo Vista previa) |
| **Consent Mode** | Modo de consentimiento para cookies y privacidad |

---

## Referencias oficiales

- Conceptos de GTM: https://support.google.com/tagmanager/answer/6102821
- Etiqueta de Google (GA4 en GTM): https://support.google.com/tagmanager/answer/9442095
- Eventos de GA4 en GTM: https://support.google.com/tagmanager/answer/9268996
- Data Layer: https://developers.google.com/tag-platform/tag-manager/datalayer
- DebugView de GA4: https://support.google.com/analytics/answer/7201382
- Vista previa de GTM: https://support.google.com/tagmanager/answer/6107056
- Consent Mode: https://support.google.com/tagmanager/answer/10718549

---

© 2026 Feature Growth · Documento interno de medición (GA4 + GTM).
