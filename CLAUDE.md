# Arcana Sacra — memoria del proyecto

Web personal de **Ana** (GitHub `anarquelladas`), dominio `arcanasacra.net` (registrado en Cloudflare).
Une dos facetas: **tatuaje / dibujo** (marca "Arcana Sacra") y **portfolio de programación** para buscar trabajo
(trabaja con Laravel/PHP; quiere mostrar TypeScript, React, Python y agentes de IA).

- Ana habla en **español**; la **web está en inglés** (no hacen falta tildes ni eñes en la web).
- Subir a GitHub: en su ordenador GitHub Desktop está con una cuenta corporativa; sube a su cuenta personal desde el navegador (ventana privada → repo → *Add file → Upload files*).
- Despliegue: GitHub → Cloudflare (Workers & Pages), build `npm run build`, salida `dist`, `NODE_VERSION=22`.

## Comandos

```bash
npm install
npm run dev      # http://localhost:4321
npm run build
python3 scripts/contrast.py foto.jpg public/objetos/nombre.webp --width 900   # foto → alto contraste
python3 scripts/textures.py                                                   # regenera texturas
```

## Estructura

| Ruta | Qué es |
| --- | --- |
| `src/pages/` | `index` (mesa de curiosidades), `art`, `code`, `about`, `contact`, `404` |
| `src/components/Altar.tsx` | Portada: objetos arrastrables, rótulos al pasar, ojo que sigue al cursor, palmatoria que apaga la luz |
| `src/components/Cabinet.tsx` | Gabinete de Art: filtros, cajones, visor en óvalo (teclado ← → Esc) |
| `src/components/TarotSpread.tsx` | Code: repos de GitHub como cartas de tarot que se giran |
| `src/components/Letter.tsx` | Contact: sobre con lacre que se rompe |
| `src/components/Stamp.tsx` | `Stamp`, `Dual`, `MothStamp`: imágenes en dos tintas (noche/día) |
| `src/components/engravings/` | Solo defs SVG auxiliares (papel, lacre, halo). **No** añadir dibujos vectoriales nuevos |
| `src/data/site.ts`, `src/data/art.ts` | Textos, enlaces, herramientas y piezas del gabinete |
| `src/lib/github.ts` | Lee repos públicos con el topic `portfolio` al compilar (cartas de ejemplo si no hay) |
| `public/objetos/*.webp` | Imágenes en tinta hueso (modo noche) · `public/objetos/ink/*.webp` en tinta negra (modo día) |
| `scripts/contrast.py` | Recorta (GrabCut) y pasa fotos a alto contraste tipo sello |
| `scripts/lineart.py` | Igual para grabados de línea o fondos difíciles (modos ink / white / sat) |
| `scripts/blood.py` | Genera el goteo y la gota de sangre |
| `.claude/agents/` | Subagentes del proyecto (ver abajo) |

## Dirección de arte (lo aprendido con Ana — respetarlo siempre)

Lo que **le gusta**:
- Imágenes **de alto contraste tipo sello / grabado entintado**, hechas a partir de **fotos o grabados reales**
  (sus referencias: hojas de sellos victorianos — daga, frasco, crucifijo, pistola, rejas, lámparas).
- Ornamental, *southern gothic*, antiguo, rococó, pero **limpio y con aire**.
- Tipografía caligráfica con grandes floreos: **Billa Mount** (la de sacredskins.net). Respaldo libre: **Ballet**.
  Texto en **Cormorant Garamond**, versalitas en **Cormorant SC**.
- Interacción mediante **objetos/imágenes**, no botones típicos. El ojo central que sigue al cursor.
- Portada con **pocas piezas y grandes**, ordenadas (no muchas pequeñas y desordenadas).
- Vibra **brujil y vampírica**: bola de cristal, daga, velas/candelabro, veneno, murciélagos, calaveras, **sangre** (único color: rojo).
- Polillas **feas y oscuras** (esfinge de la calavera, polilla moteada), no "mariposas pomposas".
- Le encanta **Elvira, Mistress of the Dark**: pidió verla en imagen. Se usan fotos promocionales CC BY 2.0 (Orange County Archives): tres retratos suyos (`elvira-a/b/c`) dentro de un marco ovalado de forja negra (el que mandó Ana; menos recargado que el de Cuvilliés) en el centro; los iris siguen al cursor y al pulsar cambia de retrato y su figura está en About y en el gabinete. Nunca dibujarla; solo fotos con licencia libre y con crédito. Riesgo: derechos de imagen/marca → presentarlo como homenaje.
- Modo noche (hueso sobre negro) y modo día (tinta negra sobre papel, como sellos estampados).

Lo que **no le gusta** (ya lo rechazó):
- Dibujos vectoriales/lineales hechos a mano en SVG ("quedan cutres"), aunque se pasen a sello.
- Dorados, placas de latón, cortinas de terciopelo, brillitos, estrellitas, rastro de polvo: "hortero".
- Hacerlo **más pequeño** cuando pide "más bonito": quiere más belleza, no menos tamaño.
- Diseños genéricos "que se nota que son de IA".

Paleta: fondo `#0e0d0b` + textura pizarra; hueso `#e9dfc8`; tinta `#1a1611`; único acento: rojo sangre/lacre.
Sangre: `public/objetos/blood-drip.webp` y `blood-drop.webp`, generadas por código; **oscura** (granate casi negro) y saliendo de un límite (borde superior de la página), nunca a media página.

## Imágenes y licencias

- Fuentes válidas: dominio público o licencias que permiten uso comercial (PD, CC0, CC BY, CC BY-SA con crédito).
- Wikimedia Commons funciona desde el navegador; **la Met y el Art Institute bloquean navegadores automatizados**.
- Créditos actuales (pie de la web y README): Walters Art Museum (PD), The Met (*Lover's Eyes*, bola de cristal, candelabro de Pugin; CC0),
  Haeckel y Vesalius (PD), Wellcome Collection (frasco de veneno, CC BY 4.0), Didier Descouens (polillas, CC BY-SA), Tarot World Project (*L'Étoile*, CC BY-SA).
- **No** usar las hojas de sellos que Ana mandó como referencia: parecen un producto comercial.
- Fuente Billa Mount: el archivo que tiene Ana es la **demo de uso personal**; no se sube al repo público
  (`.gitignore`). Con licencia comercial, poner `public/fonts/billa-mount.ttf` (o `.woff2`).

## Convenciones de código

- Astro + TypeScript estricto + islas React (`client:load` / `client:visible`). CSS por componente, variables en `src/styles/global.css`.
- Temas con `:root[data-theme='light']`; nada de colores fijos nuevos: usar `--bg`, `--ink`, `--surface`, `--veil`…
- Toda imagen nueva necesita sus dos versiones (`objetos/x.webp` y `objetos/ink/x.webp`) y se pinta con `Stamp`/`Dual`.
- Respetar `prefers-reduced-motion`. Accesibilidad: rótulos `aria-label` en objetos-puerta.
- Antes de dar algo por hecho: `npm run build` y captura con Playwright (escritorio 1440×900 y móvil 390×844).

## Subagentes

`art-director`, `image-alchemist`, `frontend-artisan`, `portfolio-keeper`, `scribe` — en `.claude/agents/`,
cada uno con memoria propia en `.claude/agent-memory/<nombre>/MEMORY.md`.
