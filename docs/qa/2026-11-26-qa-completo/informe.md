# QA completo (tarea 2.1) — 2026-11-26

Rama `feat/2-1-qa-completo`. Build + `astro preview`, Chromium (Playwright), 1440x900 y 390x844, noche y día, 6 páginas (24 capturas `d|m-dark|light-<pagina>.png`) más capturas de interacción `int-*.png`.

## Veredicto: PASA con observaciones (sin fallos graves)

Correcto: `npm run build` sin errores ni avisos (6 páginas). Sin errores/avisos de consola, sin respuestas 4xx en las 24 combinaciones, sin imágenes rotas, sin desbordamiento horizontal en móvil, todos los botones/enlaces con nombre accesible, enlaces internos válidos (/art/, /code/, /about/, /contact/, /404). Sitemap y robots 200.
Interacción: el iris sigue al cursor (se mueve ~17 px entre esquinas); clic en el marco cambia retrato (elvira-a -> elvira-b); la palmatoria apaga la luz (clase `dark`) y vuelve; la daga se arrastra; rótulo al pasar (opacidad 1); filtros del gabinete (Tattoos vela 10 de 13); visor en óvalo con ← → Esc; carta de Code gira; el lacre se rompe; `prefers-reduced-motion` elimina todas las animaciones infinitas (con movimiento normal hay murciélago, llamas, etc.).

## Fallos (por gravedad)

### Media
1. **Visor del gabinete: el título caligráfico pisa la etiqueta "FLASH · 2026" y el subtítulo** (escritorio y móvil, noche). `int-art-viewer.png`, `m-dark-art-viewer.png`. Esperado: separación legible. Archivo probable: `src/components/Cabinet.tsx` / su CSS (`.medallion figcaption`). Pasar a `art-director` para valorar y a `frontend-artisan`.
2. **Texto de desarrollo visible al público**: "Sample piece: replace it with your image in src/data/art.ts" en el visor. Esperado: texto de cara al público o nada. Archivo: `src/data/art.ts` (campo de nota) / `Cabinet.tsx`. (Se cubre también con 3.3.)
3. **404 en móvil: la llave ocupa casi toda la pantalla** y el mensaje "This door opens onto nothing" queda a ~1100 px (fuera de la primera pantalla). `m-dark-404.png`. Esperado: llave más pequeña en móvil. Archivo: `src/pages/404.astro`.

### Baja
4. **Foco de teclado poco visible**: contorno punteado de 1 px en la navegación (`int-index-focus.png`); en noche apenas se ve. Esperado: foco claro (2 px, contraste). Archivo: `src/styles/global.css`.
5. **Gabinete en claro, escritorio: el esqueleto (Memento Mori) aparece recortado por la derecha** (borde vertical duro). `d-light-art.png`. Archivo: imagen `public/objetos/ink/skeleton.webp` o su recuadro en CSS.
6. **Móvil, portada: la sangre cuelga bajo la cabecera** (no del borde superior de la página) en modo día y noche, contra la regla de dirección de arte. `m-light-index.png`. Para `art-director` y luego `frontend-artisan` (`.blood` en `Altar` / layout móvil).
7. **Móvil: costura visible en el fondo a ~845 px** (el fondo/textura acaba en 100vh) en capturas de página completa (portada, art, 404). Puede ser artefacto de la captura "fullPage"; confirmar en dispositivo real. Archivo: `src/styles/global.css` (fondo del `body`).
8. **`/favicon.ico` devuelve 404** (solo se declara `favicon.svg`). Algunos navegadores/bots lo piden; añadir uno o ignorar. Archivo: `public/`.

### Notas (no son fallos)
- Las celdas "vacías" en la captura móvil de Art eran imágenes `lazy` aún sin cargar; al desplazar cargan todas (13/13).
- Cada pieza lleva dos imágenes (noche/día), una oculta; correcto.
- El lacre pulsa continuamente, lo que impide `click()` automático "estable"; sin impacto para el usuario.
- Cartas de Code: aún son de ejemplo (sample) -> tarea 4.4.
