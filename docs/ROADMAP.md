# Arcana Sacra — hoja de ruta

Fuente única de verdad del trabajo pendiente. **Todos los agentes leen este archivo al empezar** y lo actualizan al terminar.
Contexto: `CLAUDE.md` (reglas), `docs/HISTORIA.md` (decisiones y estado). Este archivo manda en el *orden*.

## Cómo se trabaja

**Ramas**
- `main` = producción (lo que ve `arcanasacra.net`). **Nadie hace push a `main`** salvo Ana, mediante PR `develop` → `main`.
- `develop` = integración. Aquí se junta todo y se prueba (Cloudflare crea una URL de vista previa por rama).
- `feat/<id>-<slug>` = una rama por tarea, creada desde `develop` (ej. `feat/2-1-qa-dia-movil`). PR hacia `develop`.

**Estados**: `[ ]` pendiente · `[~]` en curso (anotar rama) · `[x]` hecho · `[!]` bloqueado, necesita a Ana.

**Reglas para los agentes**
1. Coge la **primera tarea `[ ]`** cuyas dependencias estén `[x]`, salvo que Ana pida otra. Márcala `[~]` con tu rama.
2. Trabaja solo en tu tarea. Si descubres trabajo nuevo, **añádelo al final de su fase** en vez de hacerlo ahora.
3. Cumple el *Hecho cuando* de la tarea. Para cambios visuales: `art-director` antes, `qa-tester` después.
4. Antes de dar nada por hecho: `npm run build` + capturas (1440×900 y 390×844, noche y día).
5. Al terminar: marca `[x]`, añade una línea al **Registro** (fecha, tarea, agente, qué cambió) y actualiza `docs/HISTORIA.md` si cambió el estado del proyecto.
6. Commits pequeños y claros. Nunca subas secretos; la fuente `billa-mount.ttf` solo se publica si Ana confirma licencia comercial (ver 0.3).
7. Lo que requiere cuenta de Ana (Cloudflare, GitHub, correo, licencias de pago) lo hace Ana: deja `[!]` con los pasos exactos.
8. Pedir confirmación a Ana antes de publicar, descargar archivos o gastar dinero.

**Dueños**: `project-manager` (orden y coordinación) · `art-director` · `image-alchemist` · `frontend-artisan` · `scribe` · `portfolio-keeper` · `qa-tester` · `license-auditor` · **Ana** (cuentas y decisiones).

---

## Fase 0 — Preparación (ya hecha en esta sesión)
- [x] 0.1 Crear rama `develop` y esta hoja de ruta.
- [x] 0.2 Crear agentes `project-manager`, `qa-tester`, `license-auditor`.
- [x] 0.3 Fuente Billa Mount: Ana confirma (2026-11-26) que ha encontrado una versión libre. `license-auditor` debe anotar el origen exacto y la licencia en `docs/LICENCIAS.md` (tarea 2.4).
- [x] 0.4 Commit de `CLAUDE.md`, `docs/`, agentes y `.gitignore` en `develop`.

## Fase 1 — Despliegue (para ver la web en el dominio)
Objetivo: ver `develop` en una URL de vista previa y `main` en `arcanasacra.net`.
- [x] 1.1 Subir `develop` a GitHub (`git push -u origin develop`). · *Dueño*: Ana (o `portfolio-keeper` con permiso) · dep.: 0.3, 0.4.
- [x] 1.2 Conectar Cloudflare Pages al repo `anarquelladas/arcanasacra`: preset Astro, `npm run build`, salida `dist`, `NODE_VERSION=22`, **rama de producción `main`**, vistas previas de ramas activadas. · *Dueño*: Ana, guiada por `portfolio-keeper` · *Hecho cuando*: existe una URL `*.pages.dev` y `develop` genera su propia vista previa. (hecho 2026-11-26)
- [x] 1.3 Custom domain `arcanasacra.net` (y `www`) en el proyecto Pages. · *Dueño*: Ana · dep.: 1.2 · *Hecho cuando*: `https://arcanasacra.net` responde con HTTPS. (hecho 2026-11-26; `www` pendiente de comprobar)
- [x] 1.4 Primera publicación: PR `develop` → `main` solo con lo ya revisado. · *Dueño*: Ana aprueba · dep.: 1.2, 2.1. (PR #2 fusionado)
- [!] 1.5 Email Routing: `hello@arcanasacra.net` → Gmail de Ana. · *Dueño*: Ana, guiada por `portfolio-keeper`.
- [!] 1.6 Deploy Hook de Cloudflare como secreto `CLOUDFLARE_DEPLOY_HOOK` en GitHub; probar `refresh.yml` a mano. · *Dueño*: Ana · dep.: 1.2.

## Fase 2 — Revisión y limpieza (lo que ya existe)
- [x] 2.1 QA completo: modo día, móvil y noche tras los cambios del marco y Elvira (todas las páginas). Informe con capturas y lista de fallos. · *Dueño*: `qa-tester`, luego `art-director` valora · *Hecho cuando*: informe en `docs/qa/` y fallos convertidos en tareas. (informe: `docs/qa/2026-11-26-qa-completo/informe.md`)
- [ ] 2.2 Arreglar los fallos de 2.1 (una tarea por fallo, añadidas aquí). · *Dueño*: `frontend-artisan`.
- [x] 2.3 Limpiar código e imágenes sin uso: `engravings/Ironwork.tsx`, `Objects.tsx` (salvo `CardBack`/`WaxSeal`), `lib/ornament.ts`, imágenes `eye`, `iris-l/r`, `candle`, `inkwell`, `key` (comprobar con búsqueda que nada las usa). · *Dueño*: `frontend-artisan` · *Hecho cuando*: build verde y sin referencias rotas.
- [x] 2.4 Auditoría de licencias: marco ovalado (origen sin confirmar), fuente, Elvira, créditos del pie y del README. · *Dueño*: `license-auditor` · *Hecho cuando*: tabla en `docs/LICENCIAS.md` con cada recurso, licencia, URL y estado.
- [ ] 2.5 Resolver el marco: confirmar derechos o sustituirlo por uno libre. · *Dueño*: `image-alchemist` + Ana · dep.: 2.4.
- [!] 2.6 Fuente Billa Mount: **decisión de Ana (2026-11-26): dejarla como está.** Queda anotado que el archivo es la demo "just for personal use" de Kana Widana / Alit Design (© 2020); `license-auditor` lo documenta en `docs/LICENCIAS.md` como riesgo aceptado y no vuelve a preguntar. Reabrir si Ana compra la licencia (~17 $, Fontspring) o decide pasar a Ballet.

- [x] 2.2.1 Visor del gabinete: el título pisa la etiqueta "FLASH · 2026" y el subtítulo (escritorio y móvil). · *Dueño*: `art-director + frontend-artisan` · `Cabinet.tsx`. Ver informe 2.1.
- [x] 2.2.2 Quitar el texto "Sample piece: replace it with your image in src/data/art.ts" visible en el visor. · *Dueño*: `frontend-artisan` · `src/data/art.ts`. Ver informe 2.1.
- [x] 2.2.3 404 en móvil: reducir la llave para que el mensaje se vea en la primera pantalla. · *Dueño*: `frontend-artisan` · `404.astro`. Ver informe 2.1.
- [x] 2.2.4 Foco de teclado más visible (hoy 1 px punteado) en navegación y objetos. · *Dueño*: `frontend-artisan` · `global.css`. Ver informe 2.1.
- [x] 2.2.5 Esqueleto recortado por la derecha en Art (modo día, escritorio). · *Dueño*: `image-alchemist / frontend-artisan` · `objetos/ink/skeleton.webp`. Ver informe 2.1.
- [x] 2.2.6 Móvil: la sangre cuelga bajo la cabecera en vez de salir del borde superior. · *Dueño*: `art-director + frontend-artisan` · `Altar.tsx / CSS`. Ver informe 2.1.
  - Recomendación art-director: la causa es que en móvil `.altar` (`altar.css` l.198, `margin-top:0`) empieza bajo la cabecera en flujo y `.blood` es `top:0` de `.altar`. No hacer `.altar` estático (su `::after` de oscuridad usa `inset:0`). Sacar `<div className="blood">` de `.altar` (fragmento en `Altar.tsx`, hermano anterior) y anclarlo al documento: en móvil `body` (solo portada) `position:relative`, `.blood{position:absolute; top:0; z-index:1}` por debajo del texto de la cabecera (título y nav con `position:relative; z-index:2`), altura ~90px / `background-size:600px 90px` (hoy 130px) para que los goteos pasen por detrás del título sin tapar los enlaces. Mantener animación `bleed` y comprobar noche y día a 390x844.
- [ ] 2.2.7 Comprobar la costura de fondo a 100vh en móvil (puede ser artefacto de captura). · *Dueño*: `qa-tester / frontend-artisan` · `global.css`. Ver informe 2.1.
- [x] 2.2.8 Añadir favicon.ico a public/ (hoy 404). · *Dueño*: `frontend-artisan` · `public/`. Ver informe 2.1.
- [x] 2.2.9 Portada: iris de Elvira recortados con elipse inclinada por ojo (no se salen de los párpados en noche ni día). · *Dueño*: `frontend-artisan` · `Altar.tsx`.
- [x] 2.2.10 Portada: sin parpadeo ni giro automático del marco; el retrato solo cambia al pulsar. · *Dueño*: `frontend-artisan` · `Altar.tsx / altar.css`.
- [x] 2.2.11 Portada: sangre pegada al borde superior en escritorio (sin hueco de 16 px), letras por encima y gotas entre las letras de título y nav. · *Dueño*: `frontend-artisan` · `Altar.tsx / altar.css`.
- [x] 2.2.9 Integrar en `Altar.tsx` los retratos apaisados `elvira-d/e/f` y el marco `frame-wide` (datos en `docs/elvira-gazes.md`). · *Dueño*: `frontend-artisan` · dep.: assets hechos (ver Registro).
- [x] 2.2.10 Créditos pendientes: añadir al pie (`Base.astro`) y al README las fotos *Elvira with monsters, mid-1980s* y *Elvira at Knott's Berry Farm, 1997* (Orange County Archives, CC BY 2.0) y el marco `frame-wide` (*Frame with Rocaille Volutes and Wings*, F. de Cuvilliés / C. A. von Lespilliez, Cooper Hewitt CH 18238167, dominio público). · *Dueño*: `license-auditor`.

- [x] 2.7.1 Portada: intro a oscuras; hay que encender el candelabro (clic, arrastre o teclado). Se recuerda en `sessionStorage['as-lit']`; pista de texto a los 6 s; con `prefers-reduced-motion` no hay oscuridad. · *Dueño*: `frontend-artisan` · `Altar.tsx`, `altar.css`, script del `<head>` en `Base.astro` (atributo `data-intro`).
- [x] 2.7.2 Portada: tras la intro el candelabro es el interruptor de tema (encendido = día, apagado = noche), sincronizado con el botón de la cabecera y `localStorage['as-theme']`. Visible también en móvil. · `Altar.tsx`.
- [x] 2.7.3 Llamas en tinta del tema (sin naranjas) y humo en canvas que ondea en sentido contrario al arrastre, con inercia. · `Smoke.tsx`, `Stamp.tsx`, `global.css`.
- [x] 2.7.4 Sonido: módulo `src/lib/sound.ts` (WebAudio sintetizado, silencio recordado, nada suena antes del primer gesto), interruptor "Sound" en la cabecera y sonidos en la portada. Definidos `paper`, `seal-break`, `envelope-open` para la carta de About. · `sound.ts`, `Nav.astro`, `Altar.tsx`.
- [ ] 2.7.5 `art-director`: valorar el interruptor de sonido (hoy texto "♪ Sound" como la pestaña de tema); sustituirlo por un objeto (campana, reloj de arena…) con `image-alchemist`. Ajustar a oído el timbre y volumen de los sonidos.
- [ ] 2.7.6 `qa-tester`: probar la intro en móvil táctil real (el candelabro queda al final de la página; la pista es fija abajo) y teclado (Tab hasta el candelabro).
- [x] 2.7.7 Carta de About (en `about.astro`, no en `Letter.tsx`, que es el sobre de Contact) convertida en sobre interactivo `AboutLetter.tsx`; sonidos en About, Contact, gabinete y tarot.
- [x] 2.8.1 `frontend-artisan`: en la portada de dia (1440), las gotas de sangre tapan los enlaces de la cabecera. (QA 2026-11-26 ronda 2)
- [x] 2.8.2 `frontend-artisan`: AboutLetter, al plegar la carta el foco debe volver al boton del lacre.
- [x] 2.8.3 (no reproducible fuera de fullPage: la hoja pequena del sobre queda a opacity 0 al abrir; sin cambios) `frontend-artisan`: AboutLetter movil/dia, copia fantasma del texto dentro del sobre abierto (verificar).
- [x] 2.8.4 Resuelta quitando a Elvira de About (Ana, 2026-11-26): fuera la figura y el rotulo; titulo sin rozar el borde en movil.
- [x] 2.8.5 (enlace "Skip to the candelabrum" primero en el orden de tab durante la intro: 1 Tab + Enter; pista inferior sin cortar) `frontend-artisan`: portada noche, la pista inferior queda cortada por la daga; valorar salto de teclado al candelabro (14 tabulaciones).
- [x] 2.8.6 (Ann elige el 1 y el 2: elvira-a y elvira-c, alternan al pulsar; sin indicador, sin apaisados) `frontend-artisan`: Ana elige retrato de Elvira para la portada (indicador temporal "n / 6", constante `SHOW_PORTRAIT_INDEX` en `Altar.tsx`). Al decidir: dejar solo el elegido (y su marco), borrar `GAZES` restantes, `SHOW_PORTRAIT_INDEX`, su <span> y CSS `.portrait-index`; `image-alchemist` retira del repo los `elvira-*` no usados. Avisar a `license-auditor` si cambian los creditos (c: fotos Orange County Archives).
- [x] 2.8.7 `license-auditor`: About ya no usa fotos de Elvira; siguen en portada y gabinete (`Stamp elvira`), el credito del pie debe mantenerse. Revisar al cerrar 2.8.6.
- [x] 2.8.8 `frontend-artisan`: integrar la ronda 2 de retratos (datos en `docs/elvira-gazes.md`): `elvira-f` con encuadre cerrado (nuevos ojos), nuevos `elvira-g`, `elvira-h` (verticales, marco `frame.webp`) y `elvira-i` (apaisado), y marco `frame-wide2` (hueco eliptico, clip-path) en lugar de `frame-wide`. Ann descarta b, d, e. Montaje: `docs/img/comp-elvira-noche.jpg`.
- [x] 2.8.9 `license-auditor`: creditos de `frame-wide2` (Cuvilliés CH 18238247, PD) y de las fotos g/h/i (Orange County Archives, CC BY 2.0: manos en la cintura 35641035160 y sombrero 1991 35641028170).

## Fase 3 — Contenido real
- [ ] 3.1 Revisar y ajustar textos de About y títulos del gabinete (Ana aprueba). · *Dueño*: `scribe`.
- [ ] 3.2 Instagram y LinkedIn en `src/data/site.ts` (Ana da los enlaces). · *Dueño*: `scribe`.
- [ ] 3.3 Subir fotos reales de dibujos y tatuajes a `public/arte/` y sustituir las piezas de muestra de `src/data/art.ts` (versión noche y día). · *Dueño*: `image-alchemist` + `scribe` · *Hecho cuando*: el gabinete no tiene piezas de muestra.
- [ ] 3.4 Metadatos SEO y tarjeta social (Open Graph) de cada página. · *Dueño*: `scribe` + `frontend-artisan`.

## Fase 4 — Portfolio de programación
- [ ] 4.1 Proyecto 1: agente en Python con herramientas (SDK de Anthropic), con README y demo; topic `portfolio`. · *Dueño*: Ana con `portfolio-keeper`.
- [ ] 4.2 Proyecto 2: app TypeScript + React que consuma una API con agente o chat integrado. · idem.
- [ ] 4.3 Proyecto 3: proyecto Laravel (p. ej. gestor de citas para estudio de tatuaje). · idem.
- [ ] 4.4 Comprobar que las cartas de Code leen los repos reales y desaparecen las de ejemplo. · *Dueño*: `portfolio-keeper`.
- [ ] 4.5 Proyecto: **página de tarot** (lecturas/cartas, algo vistoso que enseñar). Definir alcance con Ana. · *Dueño*: Ana con `portfolio-keeper` y `frontend-artisan`.
- [ ] 4.6 Proyecto: **el proyecto web que Ana ya hizo** (pendiente de que Ana diga cuál y dónde está el código). Subirlo a su cuenta con README y topic `portfolio`. · *Dueño*: `portfolio-keeper`.
- [ ] 4.7 Otros proyectos "chulos" que se vayan ocurriendo (apuntarlos aquí).

## Fase 5 — Pulido y lanzamiento
- [ ] 5.1 Rendimiento y accesibilidad (Lighthouse, foco de teclado, `aria-label`, `prefers-reduced-motion`). · *Dueño*: `frontend-artisan` + `qa-tester`.
- [ ] 5.2 Revisión final de arte en todas las páginas, dos temas y dos tamaños. · *Dueño*: `art-director`.
- [ ] 5.3 PR `develop` → `main` y comprobación en `arcanasacra.net`. · *Dueño*: Ana aprueba · dep.: todo lo anterior que ella considere necesario.

---

## Registro
| Fecha | Tarea | Agente | Qué cambió |
| --- | --- | --- | --- |
| 2026-11-26 | 0.1, 0.2 | Claude | Rama `develop`, hoja de ruta y agentes nuevos. |
| 2026-11-26 | 0.3, 0.4, 1.1, 2.6 | Claude | Fuente confirmada libre por Ana; commit y push de `develop`. |
| 2026-11-26 | 1.2, 1.3, 1.4 | Claude + Ana | Cloudflare Pages conectado, lockfile arreglado, `main` publicada y dominios `arcanasacra.net` y `www` activos. |
| 2026-11-26 | 2.6, 4.5-4.7 | Claude | Ana decide mantener la fuente; se añaden proyectos de portfolio (tarot, proyecto web previo). |
| 2026-11-26 | 2.1 | qa-tester | QA completo: pasa con 8 observaciones (media/baja); tareas 2.2.1-2.2.8 y informe en `docs/qa/2026-11-26-qa-completo/`. |
| 2026-11-26 | 2.2.1-2.2.5, 2.2.8 | frontend-artisan | Visor sin solapes (interlineado y huecos), aviso de pieza de muestra solo en dev, 404 móvil con llave pequeña, foco 2 px sólido, esqueleto con borde derecho fundido (el grabado original viene cortado), `favicon.ico`. |
| 2026-11-26 | 2.2.6 | frontend-artisan | Sangre de la portada fuera de `.altar` y anclada al borde superior del documento en móvil (90 px, tras la cabecera); escritorio sin cambios. |
| 2026-11-26 | 2.2.9-2.2.11 | frontend-artisan | Iris con recorte inclinado por ojo; eliminado el parpadeo periódico que aplastaba el marco; sangre anclada a body en todos los anchos, con gotas sueltas (trozos de blood-drip.webp, máscara de fundido) calculadas desde los huecos de título y nav. |
| 2026-11-26 | 2.2.9, 2.2.10 | image-alchemist | Nuevos retratos apaisados `elvira-d/e/f` (noche y día), marco apaisado `frame-wide` (grabado PD de Cuvilliés) y datos de ojos en `docs/elvira-gazes.md`; scripts `portrait.mjs` y `frame-wide.mjs`. |
| 2026-11-26 | 2.2.9 (apaisados) | frontend-artisan | Altar.tsx: GAZES con campo wide, retratos elvira-d/e/f en frame-wide, caja del ojo de proporcion fija (sin saltos), recorrido del iris 40 en apaisados; constante USE_WIDE_FRAME para revertir. |
| 2026-11-26 | 2.7.1-2.7.4 | frontend-artisan | Intro a oscuras con candelabro, candelabro como interruptor de tema, llamas en tinta con humo por inercia, módulo de sonido WebAudio e interruptor de sonido en la cabecera. |
| 2026-11-26 | 2.7.7 | frontend-artisan | `AboutLetter.tsx`: sobre lacrado que se abre (lacre, solapa, hoja, carta desplegada; teclado, estado anunciado, sin animacion con reduced-motion). Nuevos sonidos unfold/drawer/turn-page/tick/card-flip/shuffle en gabinete, tarot y Contact. Nombre de la web: Ann. |
| 2026-11-26 | 2.1 (ronda 2) | qa-tester | QA tras sangre, intro, candelabro, sonido y carta: pasa con 5 observaciones; tareas 2.8.1-2.8.5, informe en `docs/qa/2026-11-26-qa-ronda2/`. |
| 2026-11-26 | 2.8.1-2.8.5 | frontend-artisan | Sangre: la tira se recorta tras la banda superior bajo los enlaces (mascara en .blood::before) y de dia llevan halo de papel; foco vuelve al lacre al plegar la carta; About sin Elvira; skip link a candelabro en la intro y pista sin cortar; indicador temporal "n / 6" del retrato (SHOW_PORTRAIT_INDEX). |
| 2026-11-26 | humo | frontend-artisan | `Smoke.tsx`: el humo del candelabro pasa de bolitas a un hilo fino por llama (polilinea suavizada, ondulacion lenta + viento variable, se adelgaza y desvanece); sigue la inercia del arrastre y se endereza al soltar; pausa con pestana oculta; sin dibujo con reduced-motion. Solo se ve encendido (dia). |
| 2026-11-26 | 2.8.8, 2.8.9 | image-alchemist | Ronda 2 de Elvira: `elvira-f` cerrado, nuevos `elvira-g/h/i`, marco ligero `frame-wide2`, mascaras de ojos y datos en `docs/elvira-gazes.md`; scripts `portrait.mjs` (aspect/oval/bgcut), `eye-masks.mjs` (args, ell), `frame-wide2.mjs`. |
| 2026-11-26 | 2.8.8 | frontend-artisan | Altar: ciclo a, c, g, f, h, i (6); retirados b, d, e y `frame-wide`; apaisados con hueco eliptico y clip-path. Por defecto `USE_OVAL_STRETCHED = true` (frame.webp estirado 150x70 %, mas limpio que `frame-wide2`, que sigue disponible con `false`). Indicador "n / 6" desplazado para no pisar el marco ancho. |
| 2026-11-27 | 2.3 | Claude | Borrados `Ironwork.tsx`, `iris-l/r.webp` (noche y dia); `Objects.tsx` y `ornament.ts` reducidos a lo que usa el lacre. `eye`, `candle`, `inkwell`, `key` se conservan: los usan Cabinet, 404 y Tarot. Build verde. |
| 2026-11-27 | 2.2.10, 2.4, 2.8.7, 2.8.9 | license-auditor | Nuevo `docs/LICENCIAS.md` (imágenes, fuentes, dependencias, riesgos); pie y README con créditos de Elvira (a, c, f, g, h, i), marco Cuvilliés y `frame.webp` como origen sin confirmar; Billa Mount como riesgo aceptado. 2.2.10 queda obsoleta (frame-wide y d/e borrados). Revisar al decidir 2.8.6. 2.5 sigue abierta (frame.webp). |
| 2026-11-27 | 2.8.6 | Claude | Portada solo con elvira-a y elvira-c en frame.webp; retirados elvira-f/g/h/i, frame-wide2, modo apaisado, indicador n/6 y su CSS; creditos y LICENCIAS.md ajustados. |
| 2026-11-27 | portada | Claude + image-alchemist + qa-tester | Humo en bocanadas difusas; luciernagas (Fireflies.tsx, huyen al pulsar, de dia motas); retrato de Elvira aleatorio en cada carga con solo reflejo de cristal al pasar; carta de Code con Sacerdotisa y Emperatriz en abanico por detras (nuevas imagenes tarot-priestess/empress). Pendiente: el abanico no se ve en tactil (no hay hover). |
| 2026-11-27 | portada | Claude + image-alchemist | Retrato de Elvira con fundido al pulsar (sin giro); abanico solo hacia la derecha; daga horizontal (Walters 5177) con gota cayendo en bucle; llavero con dos llaves y argolla (Rijksmuseum CC0) que se balancea al pasar el cursor. Candidata guardada: docs/img/llaves/bizantina*.webp. |
