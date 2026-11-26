# Memoria · frontend-artisan

## Stack y versiones
Astro 7, @astrojs/react, @astrojs/sitemap, React 19, TypeScript. Fuentes por @fontsource (cormorant-garamond, cormorant-sc, ballet)
y Billa Mount local (`public/fonts/billa-mount.ttf`, ignorada en git).

## Decisiones técnicas
- Tema: `data-theme` en `<html>`, guardado en `localStorage['as-theme']`; script inline en el `<head>` para evitar parpadeo.
  Botón "☼ Day / ☾ Night" en `Nav.astro`.
- `Dual` pinta dos `<img>` (`.v-dark` y `.v-light`); el CSS oculta una según el tema. `mix-blend-mode` NO sirve aquí
  porque `.obj`/`.lift` crean contextos de apilamiento aislados (transform / filter).
- Ojo: `eye.webp` (iris borrados) + `iris-l/r.webp` posicionados en % (izq. 24.3 %, der. 64.8 %, top 66.7 %, ancho 10.8 %)
  y recortados con `clip-path: ellipse(...)`. El desplazamiento se calcula en `Altar.tsx` (pointermove → look[x,y]).
- Polilla que aletea: dos copias de la imagen recortadas por la mitad con `clip-path` y `rotateY` alterno.
- Objetos: arrastre solo con ratón (pointer capture); un arrastre > 6 px anula el clic.
- Astro: los `<style>` de página van con scope; para estilos de componentes React usar `:global()` o CSS importado.
- `IronBand`/`IronCorner` y otros SVG de `engravings/` quedan sin uso visual salvo `Defs` y `WaxSeal`: candidatos a limpiar.

## Comprobaciones habituales
`npm run build` → `npx astro preview --port 4321` → capturas Playwright (CommonJS, `require('playwright')`).

## Trampas (2026-11-26, tareas 2.2.x)
- Las dos versiones de `skeleton.webp` vienen cortadas por la derecha en el grabado original: se funde con `mask-image` en `cabinet.css` en vez de rehacer la imagen.
- Sin Python ni ImageMagick: para ICO usar sharp (PNG 48 px dentro de cabecera ICO escrita a mano).
- `astro preview` ya puede estar en 4399 (sirve `dist`, basta con reconstruir); un segundo preview falla y un `&` en la tool Bash muere al acabar el comando.
- Imagen de la llave 404 es muy alta (1:3.3): limitar por ancho (92 px en móvil) para que el mensaje entre en la primera pantalla.
- Aviso de pieza de muestra: `import.meta.env.DEV` en `Cabinet.tsx`.
