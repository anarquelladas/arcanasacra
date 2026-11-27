# QA P.5 movil tactil (390x844, hasTouch) - 2026-11-27

Veredicto: NO PASA (grimorio y llavero invisibles en movil).

## Fallos
1. GRAVE - Grimorio y llavero no se ven en movil (0x0). `.obj-book` y `.obj-key` son flex en columna (`@media (max-width:760px)`, altar.css ~l.251) y su `.lift` colapsa a ancho 0 porque `.grimoire` y `.keys` solo tienen hijos `position:absolute` (la polilla y la carta tienen imagen en flujo y si salen). Solo se ve el rotulo About/Contact. Arreglo probable: `.obj .lift { width:100% }` en el media query. Capturas: 04a, 10-abajo-movil-*.
2. MEDIO - Intro a oscuras: en movil el candelabro (#candle) esta en y~1262 px, dos pantallas por debajo; la primera vista no lo muestra y solo la pista de 6 s ayuda. Captura 01.
3. MEDIO - Llavero: es un `<a href=/contact/>` y el primer toque navega directo; `turned` y el balanceo (hover) no se ven en tactil, no hay "primer toque abre" como en grimorio/carta. (Con el fallo 1 ni se ve.)
4. BAJO - Abanico de Code: el primer toque abre, a los 5 s se cierra, el segundo toque entra en /code/. Correcto, pero la carta derecha del abanico queda cortada por el borde derecho (sin desbordamiento horizontal). Captura 05.
5. BAJO - Murcielago: el toque funciona (vuela, desaparece, sin errores), pero el boton mide 31x49 px (<44 px recomendado en tactil).

## Pasa
- Grimorio: primer toque pone `fanned` (no navega), a los 5 s se quita, segundo toque va a /about/ (la logica; visualmente no verificable por el fallo 1).
- Carta de Code: toque 1 abanico, toque 2 navega a /code/.
- Murcielago: sale volando al tocar y no navega.
- Sin desbordamiento horizontal (390/390), sin errores de consola ni respuestas 4xx/5xx.
- Candelabro: un toque enciende y revela la mesa.

Nota: Playwright `tap()` hace scroll al elemento; para tocar el candelabro a oscuras hay que usar `p.tap('#candle')`, no coordenadas sin desplazar.
