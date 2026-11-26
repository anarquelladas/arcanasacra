# QA ronda 2 — 2026-11-26 (rama feat/2-1-qa-completo)

**Veredicto: PASA con 5 observaciones (ninguna grave).**

Comprobado: build limpio (6 páginas, sin avisos); 6 páginas × 1440×900 / 390×844 × noche/día; consola sin errores ni avisos; sin 404 de red; sin imágenes rotas; sin desbordamiento horizontal; enlaces internos válidos.
Audio: 0 AudioContext antes de un gesto en todas las páginas; se crea 1 tras Enter/clic. Intro: Tab llega al candelabro (14 tabulaciones), foco 2 px sólido, Enter enciende; al recargar no se repite (sessionStorage `as-lit`); tema persiste tras recargar; el candelabro alterna día/noche y guarda `as-theme`. Con reduced-motion no hay intro y las animaciones se acortan. Ojo sigue al cursor, clic cambia de retrato. Visor del gabinete ← → Esc ok. Carta de About: foco visible, Enter abre, "fold" la guarda, `aria-live` presente. Cartas de Code y lacre de Contact ok.

## Fallos (de más a menos)
1. **Media** — Portada, 1440×900, día: las gotas de sangre tapan parcialmente los enlaces Code/About/Contact/Night/Sound de la cabecera (`home-d-day-3toggled.jpg`). En noche no ocurre. Archivo: `Altar.tsx` (sangre/gotas) / `altar.css`. → frontend-artisan + art-director.
2. **Baja** — About: al plegar la carta (`fold`) el foco cae a `body` en vez de volver al botón del lacre. `AboutLetter.tsx`.
3. **Baja** — About móvil 390, día: con la carta abierta aparece una copia fantasma de "Hello, I'm Ann." dentro del sobre abierto, bajo la carta (`about-letter-open-m-day.jpg`). `about-letter.css`. Verificar fuera de fullPage.
4. **Baja** — About (ambos tamaños): el rótulo "PATRON SAINT OF THE HOUSE" queda pisado por los floreos del título de Elvira; en móvil "Mistress of the Dark" roza el borde derecho. → art-director.
5. **Baja** — Portada noche: la línea de pista ("move the objects…") queda cortada por la daga. Nota: la captura fullPage de About en día muestra un salto de fondo a 900 px (probable artefacto de captura).

## No probado
Táctil real (2.7.6) y escucha real del audio (solo verificado que no arranca sin gesto). Pasos de tab hasta el candelabro (14) es alto: valorar un salto.

Capturas clave (reducidas, 348 KB) en esta carpeta; el resto (~33 MB) queda fuera del repo.
