# Arcana Sacra — historia del proyecto y traspaso

Documento de memoria para retomar el trabajo en una sesión nueva (Claude Code en consola u otra).
Complementa a `CLAUDE.md` (reglas) y a `.claude/agent-memory/*/MEMORY.md` (memoria de cada subagente).

## 1. Quién y para qué

- **Ana** (GitHub `anarquelladas`). Programa en el trabajo con **Laravel/PHP**; quiere un portfolio para buscar
  puestos con **TypeScript, React, Python** y **agentes de IA**. Además empieza a **tatuar y dibujar** con la marca **Arcana Sacra**.
- Una sola web para las dos facetas, inspirada en el ambiente de `sacredskins.net` (web de una amiga: tatuaje + modelaje).
- Ana escribe en español. **La web está en inglés.**

## 2. Infraestructura

- Dominio **arcanasacra.net** comprado en **Cloudflare Registrar** (nov 2026, ~11,86 $/año, renovación automática, DNS de Cloudflare). El `.com` estaba cogido.
- Hosting previsto: **Cloudflare Workers & Pages** conectado al repo (preset Astro, `npm run build`, `dist`, `NODE_VERSION=22`), dominio en *Custom domains*.
  **Aún no está conectado.**
- Correo previsto: `hello@arcanasacra.net` con Cloudflare Email Routing → su Gmail. **Aún no creado.**
- Subdominios por proyecto posibles (`demo.arcanasacra.net`) sin pagar hosting.
- `.github/workflows/refresh.yml`: recompila a diario vía deploy hook (secreto `CLOUDFLARE_DEPLOY_HOOK`, **pendiente**).
- Repo: `github.com/anarquelladas/arcanasacra`, clon local en `Documentos\GitHub\arcanasacra`.
  GitHub Desktop está vinculado a su cuenta personal (antes tenía una corporativa).

## 3. Cronología del diseño (qué pidió y qué se decidió)

1. Primera versión Astro con farol en el cursor y tracería gótica → *"feo, genérico, se nota que es IA"*.
2. Grabados SVG + placas doradas + cortinas → *"hortero"*.
3. Versión reducida → *"no he dicho más pequeño, sino más bonito"*.
4. Letras: quiere la de Sacred Skins → **Billa Mount** (Alit Design). Respaldo libre: **Ballet**.
5. *"Las imágenes vectoriales quedan cutres"* → solo **fotos/grabados reales en alto contraste** tipo sello (sus referencias: hojas de sellos victorianos).
6. Imágenes de museo en alto contraste → aprobado. Ojo central que sigue al cursor.
7. Web en **inglés**. **Modo día** (papel + tinta negra) además del modo noche.
8. Carta del tarot: **La Estrella** (*XVII L'Étoile*, Conver 1760).
9. Vibra **brujil y vampírica**: bola de cristal, daga, velas, veneno, murciélagos, sangre. Le encanta **Elvira, Mistress of the Dark**.
10. Polillas *"más feas, más dark, no pomposas"* → esfinge de la calavera y polilla moteada.
11. Sangre *"muy out"* → más oscura y saliendo del borde superior.
12. Prefiere **pocas piezas grandes y ordenadas**.
13. Elvira en **imagen**: sus ojos en el centro → *"¡me gusta!"*.
14. Tres retratos de Elvira que cambian al pulsar, dentro de un marco. Cuvilliés *"demasiado exagerado"* →
    marco ovalado de forja negra más sencillo (imagen que mandó Ana).

## 4. Estado actual de la web

- **Portada (`/`)**: sangre oscura desde el borde superior; título "Arcana Sacra" (Billa Mount/Ballet) y "tattoo, drawing & code";
  medallón central = **marco ovalado + retrato de Elvira** (3 opciones, iris que siguen al cursor, parpadeo, clic = cambia);
  objetos-puerta: esfinge de la calavera → Art, La Estrella → Code, espejo etrusco → About, bola de cristal → Contact;
  decoración: candelabro (clic apaga las velas y deja solo la luz del cursor), daga que gotea sangre al pasar, murciélago que cruza volando.
  Objetos arrastrables. Botón ☼ Day / ☾ Night en el menú.
- **Art (`/art`)**: "Cabinet of Curiosities", vitrina con filtros (All/Tattoos/Drawings/Flash) y visor en óvalo. Piezas de **muestra** (src/data/art.ts).
- **Code (`/code`)**: "Arcana of Code", repos de GitHub con topic `portfolio` como cartas de tarot. Hoy muestra **3 cartas de ejemplo**.
- **About (`/about`)**: carta "Hello, I'm Ana" + figura de Elvira "patron saint of the house". El texto lo escribió Claude: **Ana debe revisarlo**.
- **Contact (`/contact`)**: sobre con lacre que se rompe; email `hello@arcanasacra.net`.

## 5. Imágenes, fuentes y licencias

Todas en `public/objetos/` (noche, tinta hueso) y `public/objetos/ink/` (día, tinta negra). Detalle por imagen en
`.claude/agent-memory/image-alchemist/MEMORY.md`. Créditos en el pie (`src/layouts/Base.astro`) y en `README.md`.

- Wikimedia Commons funciona; **The Met y Art Institute bloquean navegadores automatizados**.
- Fotos originales descargadas en `C:\Users\Ana Arquelladas\Downloads\as-*.jpg` (necesarias para regenerar con los scripts).
- **Billa Mount**: en `public/fonts/billa-mount.ttf`.
- **Marco ovalado actual**: imagen que mandó Ana, **origen sin confirmar** → confirmar derechos antes de publicar o buscar uno libre.
- **Elvira**: fotos CC BY 2.0 (Orange County Archives). Personaje registrado / derechos de imagen de Cassandra Peterson → presentado como homenaje.

## 6. Pendientes

- [ ] Conectar Cloudflare Pages al repo y el dominio; variable `NODE_VERSION=22`.
- [ ] Crear `hello@arcanasacra.net` (Email Routing) y añadir Instagram/LinkedIn en `src/data/site.ts`.
- [ ] Revisar textos de About y títulos del gabinete; subir fotos reales de sus dibujos/tatuajes (`public/arte/` + `src/data/art.ts`).
- [ ] Confirmar licencia del marco ovalado.
- [ ] Crear proyectos reales con topic `portfolio` (agente en Python, app TS+React, proyecto Laravel).
- [ ] Revisar modo día y móvil tras los últimos cambios (marco y Elvira) — no se comprobaron.
- [ ] Limpiar código sin uso: `src/components/engravings/Ironwork.tsx`, `Objects.tsx` (salvo `CardBack`/`WaxSeal`), `src/lib/ornament.ts`,
      imágenes `eye`, `iris-l/r`, `candle`, `inkwell`, `key` si ya no se usan.

## 7. Forma de trabajar con Ana

- Le gusta ver capturas de cada cambio y opciones para elegir.
- Respuestas en español, breves. Pedir confirmación antes de descargar archivos o publicar.
- Las descargas del navegador le piden confirmación (ajuste de su navegador).
- Antes de dar algo por bueno: `npm run build` + mirar la página (escritorio y móvil, noche y día).

## 8. Sesión 2026-11-26 (resumen para la próxima)

PR #4 fusionado en `develop` (vista previa: rama `develop` en Cloudflare Pages). `main` / `arcanasacra.net` NO tiene aún esto.

Hecho: QA rondas 1 y 2 (`docs/qa/`) y arreglos; portada con intro a oscuras + candelabro como interruptor de tema
(tema inicial según el sistema; llamas en tinta; humo en hilo con viento e inercia); sangre desde el borde superior con
gotas entre letras; iris recortados con máscara real del ojo (`scripts/eye-masks.mjs`); retratos de Elvira a, c, g, f, h, i
(ciclo al clic, indicador "n / 6" con `SHOW_PORTRAIT_INDEX`); marco apaisado = ovalado estirado (`USE_OVAL_STRETCHED`,
alternativa `frame-wide2`); About sin Elvira y con carta interactiva; nombre en la web = **Ann**; sonido sintetizado
(`src/lib/sound.ts`, botón ♪) en portada, About, Contact, gabinete y tarot.

Pendiente: afinar sonidos de oído y probar la intro en móvil táctil real (2.7.5, 2.7.6); elegir retratos finales (2.8.6);
auditoría de licencias (2.2.10, 2.8.7, 2.8.9); créditos del marco Cuvilliés si se vuelve a usar; 1.5 y 1.6 (cuenta de Ann);
fase 3 (textos, Instagram/LinkedIn, fotos reales) y fase 4 (proyectos de portfolio). Ver `docs/ROADMAP.md`.
