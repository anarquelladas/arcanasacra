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
- [ ] 2.1 QA completo: modo día, móvil y noche tras los cambios del marco y Elvira (todas las páginas). Informe con capturas y lista de fallos. · *Dueño*: `qa-tester`, luego `art-director` valora · *Hecho cuando*: informe en `docs/qa/` y fallos convertidos en tareas.
- [ ] 2.2 Arreglar los fallos de 2.1 (una tarea por fallo, añadidas aquí). · *Dueño*: `frontend-artisan`.
- [ ] 2.3 Limpiar código e imágenes sin uso: `engravings/Ironwork.tsx`, `Objects.tsx` (salvo `CardBack`/`WaxSeal`), `lib/ornament.ts`, imágenes `eye`, `iris-l/r`, `candle`, `inkwell`, `key` (comprobar con búsqueda que nada las usa). · *Dueño*: `frontend-artisan` · *Hecho cuando*: build verde y sin referencias rotas.
- [ ] 2.4 Auditoría de licencias: marco ovalado (origen sin confirmar), fuente, Elvira, créditos del pie y del README. · *Dueño*: `license-auditor` · *Hecho cuando*: tabla en `docs/LICENCIAS.md` con cada recurso, licencia, URL y estado.
- [ ] 2.5 Resolver el marco: confirmar derechos o sustituirlo por uno libre. · *Dueño*: `image-alchemist` + Ana · dep.: 2.4.
- [!] 2.6 Fuente Billa Mount: **decisión de Ana (2026-11-26): dejarla como está.** Queda anotado que el archivo es la demo "just for personal use" de Kana Widana / Alit Design (© 2020); `license-auditor` lo documenta en `docs/LICENCIAS.md` como riesgo aceptado y no vuelve a preguntar. Reabrir si Ana compra la licencia (~17 $, Fontspring) o decide pasar a Ballet.

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
