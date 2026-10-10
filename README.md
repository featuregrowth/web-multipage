# Feature Growth · Web multi-página

Sitio web **multi-página** de la agencia **Feature Growth**, construido con **HTML, CSS y JavaScript puro**
(sin frameworks ni build), listo para subir a cualquier hosting estático gratuito.

Incluye una landing propia por cada servicio, página de equipo, una sección de noticias con
guías y publicaciones propias, y página de contacto con redes sociales.

---

## Estructura del proyecto

```
web-multipage/
├── index.html                          → Inicio
├── servicios/
│   ├── growth-performance.html         → Landing Growth & Performance
│   ├── marca-eventos.html              → Landing Marca & Eventos
│   ├── crm-automatizacion-ia.html      → Landing CRM, Automatización & IA
│   └── consultoria-estrategica.html    → Landing Consultoría Estratégica
├── equipo.html                         → Equipo fundador (con LinkedIn)
├── noticias/
│   ├── index.html                      → Noticias (hub + historial de publicaciones)
│   ├── medir-roi-eventos-corporativos/ → Guía: ROI en eventos B2B
│   ├── demand-gen-vs-lead-gen-b2b/     → Guía: Demand Gen vs Lead Gen
│   ├── implementar-ga4-server-side-gcp/ → Guía: GA4 Server-Side en GCP
│   └── optimizar-event-match-quality-meta-capi/ → Guía: Event Match Quality
├── growth-marketing-b2b/               → Pillar: Growth Marketing B2B
├── marketing-data-science/             → Pillar: Marketing Data Science
├── contacto.html                       → Contacto y redes sociales
├── _redirects                          → Redirecciones 301 (Noticias)
├── ver-sitio.sh                        → Lanzador local (servidor + navegador)
├── css/
│   └── styles.css                      → Estilos (paleta de marca, tipografía, responsive)
├── js/
│   └── main.js                         → Menú móvil, scroll, animaciones, año dinámico
├── assets/
│   ├── logo-mark.png                   → Logotipo FG · versión degradado (fondos claros)
│   ├── logo-mark-light.png             → Logotipo FG · versión blanca (fondos oscuros)
│   ├── favicon.ico                     → Favicon multi-tamaño (16/32/48) en pestañas
│   ├── favicon-32.png                  → Favicon PNG 32px
│   ├── favicon.png                     → Favicon 512px (fallback)
│   ├── apple-touch-icon.png            → Icono para iOS (180px)
│   ├── icon-192.png / icon-512.png     → Iconos de app (PWA)
│   └── img/
│       ├── servicio-growth.jpg
│       ├── servicio-marca.jpg
│       ├── servicio-crm.jpg
│       ├── servicio-consultoria.jpg
│       ├── equipo-fran.jpg
│       └── equipo-mati.jpg
└── README.md
```

> Las imágenes y el logotipo provienen del **Manual de Marca** oficial, por lo que respetan la identidad.

---

## Cómo verlo localmente

> ⚠️ **No abras la carpeta con doble clic.** Si entrás a `file:///…/marketing-data-science/`
> el navegador muestra un **índice de archivos** en vez de la página, porque las páginas usan
> **URLs limpias** (carpeta + `index.html`) y eso solo lo resuelve un servidor web.

### Opción A — Lanzador (recomendada)

Desde una terminal, dentro de la carpeta del proyecto:

```bash
./ver-sitio.sh          # abre http://localhost:8000 en el navegador
./ver-sitio.sh 8080     # opcional: elegís el puerto
```

Dejalo corriendo mientras navegás. Para detenerlo: `Ctrl + C`.

### Opción B — Servidor manual

```bash
cd web-multipage
python3 -m http.server 8000
# Luego abre http://localhost:8000
```

### Opción C — Abrir un archivo puntual

Si solo querés ver una página y no te importa perder la navegación interna, abrí
directamente el archivo, por ejemplo `marketing-data-science/index.html` (con `index.html`
incluido al final de la ruta).


---

## Cómo publicarlo en un hosting gratuito

### Opción A — Netlify Drop (la más simple, recomendada)

1. Entra a **https://app.netlify.com/drop** (cuenta gratis con GitHub, Google o email).
2. Arrastra la carpeta **`web-multipage`** completa a la zona de drop.
3. En segundos obtienes una URL pública (`https://tunombre.netlify.app`).
4. (Opcional) En *Site settings → Domain management* conectas tu dominio `featuregrowth.cl`.

> No necesitas Git, ni consola, ni instalación.

### Opción B — GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `featuregrowth-web`).
2. Sube el contenido de `web-multipage` (incluida la carpeta `servicios/`, `css/`, `js/` y `assets/`).
3. Ve a **Settings → Pages**.
4. En *Source*, elige la rama `main` y carpeta `/ (root)`. Guarda.
5. El sitio queda en `https://tuusuario.github.io/featuregrowth-web/`.

> Todo usa **rutas relativas**, así que funciona igual en la raíz o en un subdirectorio.

### Otras opciones compatibles

Vercel, Cloudflare Pages, Surge (`npx surge web-multipage`) o Firebase Hosting.

---

## Notas técnicas

- **Rutas relativas**: las páginas de `servicios/` usan `../`, por lo que no rompas la estructura de carpetas.
- **Fuentes**: Montserrat e Inter se cargan desde Google Fonts (CDN). Requiere conexión.
- **Sin backend**: el contacto usa enlaces directos (`mailto:` y WhatsApp). No hay formulario con servidor.
- **WhatsApp**: el número es de ejemplo (`+56 9 0000 0000`). Reemplázalo en `contacto.html` e `index.html`
  (busca `wa.me/56900000000`).

---

## Redes sociales y enlaces configurados

| Canal      | Enlace |
|------------|--------|
| Instagram  | https://www.instagram.com/featuregrowth/ |
| Facebook   | https://www.facebook.com/profile.php?id=61592516520817 |
| LinkedIn Fran | https://www.linkedin.com/in/francontrerasv/ |
| LinkedIn Matías | https://www.linkedin.com/in/matias-chaud/ |
| Email      | hola@featuregrowth.cl |

---

## Personalización rápida

| Qué cambiar        | Dónde |
|--------------------|-------|
| Colores de marca   | `css/styles.css` → variables en `:root` |
| Textos             | Cada archivo `.html` |
| Email / WhatsApp   | `contacto.html` e `index.html` |
| Redes sociales     | `contacto.html` y el footer de cada página |
| Imágenes           | `assets/img/` |
| Navegación         | El bloque `<header>` de cada página (agregar/quitar ítems) |

---

## Paleta de marca

| Nombre            | Hex       |
|-------------------|-----------|
| Azul Petróleo     | `#053A49` |
| Petróleo Medio    | `#0A5A6B` |
| Teal Growth       | `#1F8B80` |
| Teal Claro        | `#2FB3A5` |
| Blanco Lumínico   | `#F0FFFE` |
| Menta Suave       | `#C9E8E4` |
| Neutro Frío       | `#D5E4E3` |
| Grafito           | `#1D2B3A` |

© 2026 Feature Growth · Marketing | Data | IA
