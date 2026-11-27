# Licencias y créditos de Arcana Sacra

Auditoría 2026-11-27 (tarea 2.4). Fuente de los datos: `.claude/agent-memory/image-alchemist/MEMORY.md`, `docs/elvira-gazes.md`, `src/layouts/Base.astro`, `README.md`, `package.json`.
Regla: solo dominio público, CC0, CC BY, CC BY-SA con crédito. Lo que no consta en el repo se marca "por confirmar" (no se inventan URLs).
Pie de la web (`Base.astro`) y README llevan los créditos agrupados por autor; cada fila de abajo indica si está cubierta ahí.

## Riesgos abiertos (resumen)

| Riesgo | Gravedad | Qué hay que hacer |
| --- | --- | --- |
| Fuente **Billa Mount**: archivo = demo "just for personal use" de Kana Widana / Alit Design (© 2020) | Alto, **aceptado por Ann (decisión 2026-11-26; no volver a preguntar)** | Nada ahora. Reabrir solo si Ann compra la licencia (~17 $, Fontspring) o pasa a Ballet. |
| **`frame.webp`** (marco ovalado de forja): imagen aportada por Ann, origen sin confirmar. Es el marco en uso de todos los retratos | Alto | Ann: de dónde salió; o sustituir por uno libre (tarea 2.5). |
| **`ball-3.webp` y `ball-4.webp`** (bola de cristal de prueba; `ball-4` roja es la de la portada por defecto, `?ball=3` la otra): de Pinterest, aportadas por Ann; autor y licencia desconocidos | Alto | Ann: enlace original de cada una; si no hay licencia libre, sustituir por una libre (Met `ball.webp` CC0 ya está en el repo) o retirar antes de publicar en `main` (P.2). Nota: el montaje usa textura de ball-3. |
| **`moth-brahmaea.webp` y `moth-saturnia.webp`** (candidatas de polilla, activas con `?moth=b` / `?moth=s`): origen y licencia no constan en el repo | Medio | Image-alchemist/Ann: indicar archivo de Commons y autor de cada una antes de elegirla (P.1). Si no se confirman, no dejarlas fijas. |
| Elvira: personaje registrado y derechos de imagen de Cassandra Peterson | Medio | Presentado como homenaje, solo fotos CC BY 2.0 con crédito; nunca dibujada ni como marca. |

## Imágenes (`public/objetos/` y `public/objetos/ink/`)

| Recurso | Autor | Licencia | URL | Crédito en web | Estado |
| --- | --- | --- | --- | --- | --- |
| mirror, candle, key, dagger, inkwell | Walters Art Museum (Walters 54105, 48715, 52137, 51517, 54514) | Dominio público | por confirmar (solo constan los números de inventario) | sí (pie y README) | ok |
| dagger-h | Walters Art Museum, *Turkish - Dagger and Scabbard*, Walters 5177 | Dominio público | https://commons.wikimedia.org/wiki/File:Turkish_-_Dagger_and_Scabbard_-_Walters_5177.jpg | sí (pie y README) | ok |
| key-a, key-b, key-ring | Rijksmuseum, *Sleutel* BK-KOG-2301 (key-a), BK-16959 (key-b), BK-KOG-2001 (argolla) | CC0 | https://commons.wikimedia.org/wiki/File:Sleutel,_BK-KOG-2301.jpg · https://commons.wikimedia.org/wiki/File:Sleutel,_BK-16959.jpg · https://commons.wikimedia.org/wiki/File:Sleutel,_BK-KOG-2001.jpg | sí (pie y README) | ok |
| grimoire | Walters Art Museum, *T'oros Roslin Gospels, Binding*, Walters W.539, upper board outside | CC0 | https://commons.wikimedia.org/wiki/File:T%27oros_Roslin_Gospels,_Binding,_Walters_Manuscript_W.539,_Upper_board_outside.jpg | sí (pie, Walters) | ok |
| bat-fly | Ernst Haeckel, *Kunstformen der Natur*, lamina Chiroptera fig. 1 | Dominio publico | https://commons.wikimedia.org/wiki/File:Haeckel_Chiroptera.jpg | si (pie y README) | ok (ala derecha espejada de la izquierda) |
| bat-perch | August Specht, *Brehms Tierleben* (1911), murcielago de herradura colgado | Dominio publico | https://commons.wikimedia.org/wiki/File:Brehms_Tierleben._Allgemeine_kunde_des_Tierreichs_(1911)_(19791465044).jpg | si (pie y README) | ok |
| ball (MET 32811), eye (*Lover's Eyes*, DT4436), candelabrum (MET DP-12252-029, A. Pugin) | The Metropolitan Museum of Art | CC0 | por confirmar (constan los números de objeto) | sí | ok |
| bat, batface | Ernst Haeckel, *Kunstformen der Natur* | Dominio público | por confirmar | sí | ok |
| skeleton | Andreas Vesalius, *De humani corporis fabrica* (164frc) | Dominio público | por confirmar | sí | ok |
| poison | Wellcome Collection, *Green glass poison bottle* (L0036271) | CC BY 4.0 | por confirmar | sí | ok |
| moth, moth-pepper, deathshead | Didier Descouens (MHNT), Wikimedia Commons | CC BY-SA 4.0 | por confirmar (archivos: *Acherontia atropos MHNT dos / Tête de mort*, *Biston betularia male dorsal*) | sí (con aviso de misma licencia) | ok |
| tarot | Tarot World Project, *XVII L'Étoile*, Nicolas Conver 1760 | CC BY-SA 4.0 | por confirmar | sí | ok |
| tarot-priestess, tarot-empress | Tarot World Project, *La Papesse* y *L'Imperatrice*, Nicolas Conver 1760 (Commons: File:II_LA_PAPESSE_Nicolas_Conver_Tarot_1760.jpg y File:II_L%27IMP%C3%89RATRICE_Nicolas_Conver_Tarot_1760.jpg) | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:II_LA_PAPESSE_Nicolas_Conver_Tarot_1760.jpg | si (mismo credito que L'Etoile) | ok |
| **ball-3, ball-4** (bola de cristal; ball-4 es la predeterminada en la portada) | Pinterest, aportadas por Ann; autor desconocido | **Sin confirmar** | por confirmar | no | **sin confirmar** (riesgo; no pasar a `main` sin origen) |
| **moth-brahmaea, moth-saturnia** (candidatas, solo con `?moth=b`/`?moth=s`) | Desconocido (no consta en el repo; *Brahmaea* y *Saturnia pyri*) | **Sin confirmar** | por confirmar | no | **sin confirmar** (no fijar ni publicar hasta documentar) |
| blood-drip, blood-drop, elvira-iris-l/r | Generadas por código (propias) | Propias | n/a | n/a | ok |
| elvira-a (y `elvira-a-eyes`) | Orange County Archives, *Elvira promoting Knott's Berry Farm's Halloween Haunt* (35859341932) | CC BY 2.0 | por confirmar (solo consta el ID de Flickr) | sí | ok |
| elvira-c | Orange County Archives, misma foto (36030656275) | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Elvira_promoting_Knott%27s_Berry_Farm%27s_Halloween_Haunt_(36030656275).jpg | sí | ok |
| `elvira.webp` (gabinete, `Stamp elvira`) | Orange County Archives (35641035160) | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Elvira_promoting_Knott%27s_Berry_Farm%27s_Halloween_Haunt_(35641035160).jpg | sí | ok |
| **frame.webp** (marco ovalado en uso) | Aportado por Ann; autor desconocido | **Sin confirmar** | por confirmar | no | **sin confirmar** (riesgo) |
| frame-wide (Cuvilliés CH 18238167) | F. de Cuvilliés / C. A. von Lespilliez | Dominio público | https://commons.wikimedia.org/wiki/File:Bound_Print,_Frame_with_Rocaille_Volutes_and_Wings,_Premier_Livre_de_Cadres_(First_Book_of_Frames),_1740%E2%80%9368_(CH_18238167).jpg | no hace falta | retirado del repo; la tarea 2.2.10 original ya no aplica (elvira-d/e y frame-wide borrados) |

Fotos de Elvira retiradas del repo (b, d, e, f, g, h, i; Ann eligio a y c el 2026-11-27, 2.8.6) y marco frame-wide2 (retirado): sin crédito pendiente. Los orígenes de b, d, e constan en `docs/elvira-gazes.md` por si se recuperan.
Texturas (`public/tex/paper.webp`, `slate.webp`): generadas con `scripts/textures.py` (propias). `favicon.svg/.ico`: no consta autor; por confirmar (probablemente propios).

## Fuentes

| Recurso | Autor | Licencia | URL | Crédito en web | Estado |
| --- | --- | --- | --- | --- | --- |
| `public/fonts/billa-mount.ttf` (logotipo) | Kana Widana / Alit Design, © 2020 | Demo "just for personal use" (no comercial) | por confirmar (CLAUDE.md cita sacredskins.net como uso; Fontspring como venta, ~17 $) | no | **riesgo aceptado por Ann (2026-11-26)**; no volver a preguntar |
| Ballet (`@fontsource/ballet`) | Fontsource / diseñador original | OFL (según `LICENSE` del paquete) | https://fontsource.org (genérico; URL exacta por confirmar) | no obligatorio | ok |
| Cormorant Garamond y Cormorant SC (`@fontsource/...`) | Christian Thalmann (Catharsis Fonts) | OFL (según `LICENSE` del paquete) | https://fontsource.org (genérico) | no obligatorio | ok |

## Dependencias (`package.json`)

No se han comprobado una a una las licencias de las dependencias transitivas. Las directas son software abierto habitual (Astro, React, `@astrojs/*`, TypeScript: MIT/Apache-2.0 según sus repositorios). Estado: ok, pendiente de verificación con `npm ls`/`license-checker` si se quiere certeza documental.

## Cambios de créditos hechos en esta auditoría
- Pie (`src/layouts/Base.astro`): Elvira con "via Wikimedia Commons, tribute, no endorsement" y nueva línea del marco de Cuvilliés (dominio público).
- Revisión 2026-11-27 (develop): grimorio (W.539 CC0), llaves (Rijksmuseum CC0), daga (Walters 5177 PD) y murciélagos (Haeckel, Specht PD) coinciden con pie y README; no hacía falta tocar el pie. Nota: el pie ya no lleva la línea de Cuvilliés (marco retirado, no hace falta). Pendientes: ball-3/4 y polillas Brahmaea/Saturnia sin origen.
- README: Billa Mount en tipografías, IDs de Flickr de las fotos de Elvira, marco `frame.webp` como origen sin confirmar y marco Cuvilliés; quitada la mención a "la figura de About" (ya no existe).
