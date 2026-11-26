# Arcana Sacra

Web personal de tatuaje, dibujo y código. Hecha con **Astro + TypeScript + React**, desplegada en **Cloudflare** desde GitHub.

- **Inicio**: una mesa de curiosidades. Los objetos se pueden arrastrar; los que llevan etiqueta son puertas (polilla → Arte, baraja → Código, espejo → Sobre mí, sobre → Contacto). El ojo te sigue, la vela se apaga y enciende con un clic (y entonces sólo ves lo que alumbra el cursor).
- **Arte**: gabinete con cajones-filtro (cortinas de terciopelo) y visor en medallón ovalado (teclado: ← → Esc).
- **Código**: tus repos de GitHub como cartas de tarot que se revelan al pulsarlas. Barajar, revelar todas y filtrar por lenguaje.
- **Sobre mí** y **Contacto** (rompe el lacre para leer la carta).

Los objetos son imágenes de sello de alto contraste en `public/objetos/` (generadas con `scripts/stamp.py`). Puedes sustituir cualquiera por tu propio dibujo escaneado con el mismo nombre: PNG/WebP con fondo transparente y tinta clara. Las texturas se generan con `scripts/textures.py`.

Tipografías: Ballet (títulos y subtítulos, licencia libre OFL) y Cormorant Garamond (texto).

## En tu ordenador

Necesitas Node 22 o superior.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/
```

## Qué editar

| Qué | Dónde |
| --- | --- |
| Correo, Instagram, LinkedIn, retrato, herramientas | `src/data/site.ts` |
| Piezas del gabinete | `src/data/art.ts` + imágenes en `public/arte/` |
| Texto de Sobre mí | `src/pages/sobre-mi.astro` |
| Colores y tipografía | `src/styles/global.css` |

Para añadir una pieza: sube `public/arte/polilla.jpg` y pon `src: '/arte/polilla.jpg'` en su entrada de `art.ts`. Las que no tienen `src` muestran un grabado de muestra.

Para que un proyecto aparezca en **Código**: en GitHub, abre el repo → ⚙ junto a *About* → añade el topic `portfolio`. Pon también una descripción y, si tiene demo, la URL en *Website*.

## Subirlo a GitHub

```bash
git init
git add .
git commit -m "Arcana Sacra"
git branch -M main
git remote add origin https://github.com/anarquelladas/arcanasacra.git
git push -u origin main
```

## Publicarlo en Cloudflare

1. Cloudflare → **Workers & Pages** → **Create** → pestaña **Pages** → **Connect to Git** → elige `arcanasacra`.
2. Framework preset: **Astro**. Build command: `npm run build`. Output directory: `dist`.
3. En **Settings → Environment variables** añade `NODE_VERSION = 22`.
4. Cuando termine, **Custom domains** → `arcanasacra.net` (y `www.arcanasacra.net` si quieres).

Desde ese momento cada `git push` publica la web.

### Refresco diario de los repos (opcional)

1. En Cloudflare, proyecto → **Settings → Builds → Deploy hooks** → crea uno y copia la URL.
2. En GitHub, repo → **Settings → Secrets and variables → Actions** → nuevo secreto `CLOUDFLARE_DEPLOY_HOOK` con esa URL.
3. La acción `.github/workflows/refresh.yml` lo llamará cada mañana.

Si algún día la API de GitHub te limita, crea un token de solo lectura y ponlo como variable `GITHUB_TOKEN` en Cloudflare.

## Créditos de las imágenes

Convertidas a alto contraste con `scripts/contrast.py` a partir de:

- Walters Art Museum (dominio público): espejo etrusco, palmatoria de Sèvres, llave, daga, tintero.
- The Met (CC0): *Lover's Eyes* (el ojo), esfera de cristal, candelabro de Augustus Pugin.
- Ernst Haeckel, *Kunstformen der Natur* (dominio público): murciélagos.
- Andreas Vesalius, *De humani corporis fabrica* (dominio público): esqueleto.
- Wellcome Collection, frasco de veneno verde (CC BY 4.0).
- Marco ovalado del medallón: imagen aportada por Ann (comprobar que se puede usar antes de publicar).
- Orange County Archives, fotos promocionales de Elvira para Knott's Berry Farm (CC BY 2.0), Wikimedia Commons: los ojos del centro y la figura de About.
  Aviso: Elvira es un personaje registrado y la imagen de Cassandra Peterson tiene derechos de imagen; se usa como homenaje, no como respaldo.
- Didier Descouens, Wikimedia Commons (CC BY-SA 4.0): esfinge de la calavera (*Acherontia atropos*) y polilla moteada (*Biston betularia*).
- Tarot World Project, *XVII L'Étoile*, tarot de Nicolas Conver 1760 (CC BY-SA 4.0), Wikimedia Commons.

La sangre y los iris del ojo están generados por código. Las adaptaciones de imágenes CC BY-SA se publican con la misma licencia; el pie de la web lo indica.

## Agentes de Claude

El proyecto trae memoria y subagentes para Claude Code:

- `CLAUDE.md` — memoria del proyecto: stack, estructura, dirección de arte (lo que gusta y lo que no), licencias y convenciones.
- `.claude/agents/` — subagentes:
  - **art-director**: decide y revisa todo lo visual.
  - **image-alchemist**: busca imágenes libres y las pasa a alto contraste en dos tintas.
  - **frontend-artisan**: implementa en Astro + TypeScript + React.
  - **portfolio-keeper**: repos con el topic `portfolio`, despliegue y dominio.
  - **scribe**: textos de la web en inglés.
- `.claude/agent-memory/<agente>/MEMORY.md` — memoria propia de cada subagente (`memory: project`), ya rellena con lo aprendido.
