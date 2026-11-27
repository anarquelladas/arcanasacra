---
name: ronda2-arreglos
description: Trampas de las tareas 2.8.x (sangre sobre cabecera, foco del lacre, skip link, indicador de retrato)
metadata:
  type: project
---
- Sangre: la tira va en `.blood::before` con mask (banda superior + recorte sobre los enlaces via `--hl/--hr` puestos por Altar.tsx). Trampa: redeclarar `--hl` en el pseudoelemento rompe la herencia; usar `var(--hl, 100%)`. De dia los enlaces llevan halo de papel.
- Foco al plegar AboutLetter: el lacre esta `disabled` mientras la carta esta abierta, asi que el foco se da en un `useEffect` tras pasar a `closed`, no en `fold`.
- 2.8.3 (copia fantasma) no se reproduce fuera de fullPage.
- Skip link `.skip-candle` (Base.astro) solo visible con `data-intro=dark`; debe ir antes de "Skip to content" para ser el 1er Tab. El candelabro tiene `id="candle"`.
- `SHOW_PORTRAIT_INDEX` (Altar.tsx) es temporal hasta que Ana elija retrato (ROADMAP 2.8.6).
- Shell: escribir ediciones con `node -e` y plantillas con `${}` rompe en bash; usar Edit.
