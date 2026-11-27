# Licencias y créditos de Arcana Sacra

Auditoría 2026-11-27 (tarea 2.4). Fuente de los datos: `.claude/agent-memory/image-alchemist/MEMORY.md`, `docs/elvira-gazes.md`, `src/layouts/Base.astro`, `README.md`, `package.json`.
Regla: solo dominio público, CC0, CC BY, CC BY-SA con crédito. Lo que no consta en el repo se marca "por confirmar" (no se inventan URLs).
Pie de la web (`Base.astro`) y README llevan los créditos agrupados por autor; cada fila de abajo indica si está cubierta ahí.

## Riesgos abiertos (resumen)

| Riesgo | Gravedad | Qué hay que hacer |
| --- | --- | --- |
| Fuente **Billa Mount**: archivo = demo "just for personal use" de Kana Widana / Alit Design (© 2020) | Alto, **aceptado por Ann (decisión 2026-11-26; no volver a preguntar)** | Nada ahora. Reabrir solo si Ann compra la licencia (~17 $, Fontspring) o pasa a Ballet. |
| **`frame.webp`** (marco ovalado de forja): imagen aportada por Ann, origen sin confirmar. Es el marco en uso de todos los retratos | Alto | Ann: de dónde salió; o sustituir por uno libre (tarea 2.5). |
| Elvira: personaje registrado y derechos de imagen de Cassandra Peterson | Medio | Presentado como homenaje, solo fotos CC BY 2.0 con crédito; nunca dibujada ni como marca. |
| Retratos de Elvira que se quedan: sin decidir | Informativo | Al cerrar 2.8.6 revisar esta tabla y el pie (si cambian las fotos usadas). |

## Imágenes (`public/objetos/` y `public/objetos/ink/`)

| Recurso | Autor | Licencia | URL | Crédito en web | Estado |
| --- | --- | --- | --- | --- | --- |
| mirror, candle, key, dagger, inkwell | Walters Art Museum (Walters 54105, 48715, 52137, 51517, 54514) | Dominio público | por confirmar (solo constan los números de inventario) | sí (pie y README) | ok |
| ball (MET 32811), eye (*Lover's Eyes*, DT4436), candelabrum (MET DP-12252-029, A. Pugin) | The Metropolitan Museum of Art | CC0 | por confirmar (constan los números de objeto) | sí | ok |
| bat, batface | Ernst Haeckel, *Kunstformen der Natur* | Dominio público | por confirmar | sí | ok |
| skeleton | Andreas Vesalius, *De humani corporis fabrica* (164frc) | Dominio público | por confirmar | sí | ok |
| poison | Wellcome Collection, *Green glass poison bottle* (L0036271) | CC BY 4.0 | por confirmar | sí | ok |
| moth, moth-pepper, deathshead | Didier Descouens (MHNT), Wikimedia Commons | CC BY-SA 4.0 | por confirmar (archivos: *Acherontia atropos MHNT dos / Tête de mort*, *Biston betularia male dorsal*) | sí (con aviso de misma licencia) | ok |
| tarot | Tarot World Project, *XVII L'Étoile*, Nicolas Conver 1760 | CC BY-SA 4.0 | por confirmar | sí | ok |
| blood-drip, blood-drop, elvira-iris-l/r | Generadas por código (propias) | Propias | n/a | n/a | ok |
| elvira-a (y `elvira-a-eyes`) | Orange County Archives, *Elvira promoting Knott's Berry Farm's Halloween Haunt* (35859341932) | CC BY 2.0 | por confirmar (solo consta el ID de Flickr) | sí | ok |
| elvira-c y elvira-f | Orange County Archives, misma foto (36030656275) | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Elvira_promoting_Knott%27s_Berry_Farm%27s_Halloween_Haunt_(36030656275).jpg | sí | ok |
| elvira-g y `elvira.webp` (gabinete, `Stamp elvira`) | Orange County Archives (35641035160) | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Elvira_promoting_Knott%27s_Berry_Farm%27s_Halloween_Haunt_(35641035160).jpg | sí | ok |
| elvira-h y elvira-i | Orange County Archives, *Elvira ... Haunt hat 1991* (35641028170) | CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Elvira_with_Elvira_promoting_Knott%27s_Berry_Farm%27s_Halloween_Haunthat_1991_(35641028170).jpg | sí | ok |
| frame-wide2 (marco alternativo, `USE_OVAL_STRETCHED = false`) | F. de Cuvilliés (diseño) y C. A. de Lespilliez (grabado), *Frame with Two Scrolls of Leaves*, Cooper Hewitt CH 18238247 | Dominio público | https://commons.wikimedia.org/wiki/File:Bound_Print,_Frame_with_Two_Scrolls_of_Leaves,_Troisi%C3%A8me_Livre_de_Cadres_(Third_Book_of_Frames),_1740%E2%80%9368_(CH_18238247).jpg | sí (pie y README) | ok. Hoy es la alternativa, no el marco por defecto; si Ann se queda con el ovalado, se puede retirar con su crédito |
| **frame.webp** (marco ovalado en uso) | Aportado por Ann; autor desconocido | **Sin confirmar** | por confirmar | no | **sin confirmar** (riesgo) |
| frame-wide (Cuvilliés CH 18238167) | F. de Cuvilliés / C. A. von Lespilliez | Dominio público | https://commons.wikimedia.org/wiki/File:Bound_Print,_Frame_with_Rocaille_Volutes_and_Wings,_Premier_Livre_de_Cadres_(First_Book_of_Frames),_1740%E2%80%9368_(CH_18238167).jpg | no hace falta | retirado del repo; la tarea 2.2.10 original ya no aplica (elvira-d/e y frame-wide borrados) |

Fotos de Elvira retiradas del repo (b, d, e): sin crédito pendiente. Los orígenes de b, d, e constan en `docs/elvira-gazes.md` por si se recuperan.
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
- README: Billa Mount en tipografías, IDs de Flickr de las fotos de Elvira, marco `frame.webp` como origen sin confirmar y marco Cuvilliés; quitada la mención a "la figura de About" (ya no existe).
