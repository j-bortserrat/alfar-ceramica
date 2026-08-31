# ALFAR — Cerámica Artesanal · Web

Demo de web multipágina (estática) para **ALFAR**, taller y tienda de cerámica artesanal en Valencia. Marca y datos de contacto son ficticios, pensados como pieza de portfolio de Wertical Studio.

## Contenido
- `index.html` — Inicio (hero de vídeo con scroll)
- `productos.html` — Catálogo de piezas, con filtro por categoría
- `talleres.html` — Talleres y clases, calendario de próximos talleres
- `nosotros.html` — Historia, filosofía y proceso artesanal
- `contacto.html` — Formulario, mapa, horario y redes
- `en/` — Misma web en inglés (mismos nombres de archivo)
- `assets/` — estilos, script, vídeo del hero y favicon
- `.nojekyll` — para que GitHub Pages sirva los archivos tal cual

No usa dependencias externas (solo Google Fonts). Español/Inglés con páginas estáticas separadas (`en/`).

## Cómo publicar en GitHub Pages
1. Crea un repositorio nuevo en github.com (por ejemplo `alfar-ceramica`).
2. Sube **todo el contenido de esta carpeta** (los archivos `.html`, la carpeta `assets`, la carpeta `en`, `.nojekyll` y este `README.md`) arrastrándolos a la página del repositorio → *Add file* → *Upload files* → *Commit*.
3. En el repositorio: **Settings → Pages**.
4. En *Build and deployment* → *Source*: elige **Deploy from a branch**.
5. *Branch*: `main` · carpeta `/ (root)` → **Save**.
6. Espera 1-2 minutos. Tu web estará en `https://TU-USUARIO.github.io/alfar-ceramica/`.

> Importante: sube los archivos sueltos (que `index.html` quede en la raíz del repositorio), no la carpeta comprimida.

## Antes de publicar como sitio real
Todo el contenido (nombre de marca, dirección, teléfono, email, precios, horario, calendario de talleres e Instagram/Pinterest) es **de ejemplo**. Antes de lanzarlo con un negocio real, sustituye:
- Datos del negocio: `assets/app.js` (teléfono, WhatsApp y horario semanal, objeto `SITE`).
- Textos, precios y fechas: directamente en cada `.html` (y su equivalente en `en/`).
- Fotografías: las piezas usan ilustraciones vectoriales (SVG) como marcador visual en vez de fotos reales — para producción, sustitúyelas por fotografía real dentro de `.vessel-frame` en cada página (mantiene el mismo recorte 4:5, sin salto de maquetación).
- Enlaces de Instagram/Pinterest en `contacto.html` y `en/contacto.html` (ahora mismo son `href="#"`).
- El vídeo del hero (`assets/hero.mp4`, ya comprimido a 1080p/~6 MB) puede sustituirse por otro manteniendo el mismo nombre de archivo.

## Editar después
- Teléfono, WhatsApp y horario: `assets/app.js` (objeto `SITE`)
- Estilos y paleta de color: `assets/styles.css` (variables en `:root`)
