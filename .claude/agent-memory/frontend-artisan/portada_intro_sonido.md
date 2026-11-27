---
name: portada-intro-sonido
description: Decisiones técnicas de la intro a oscuras, candelabro-tema, humo canvas y sonido (2026-11-26, tareas 2.7.x)
metadata:
  type: project
---
- Intro: `data-intro="dark"` en `<html>` lo pone el script del `<head>` (Base.astro) solo en `/`, sin `as-lit` en sessionStorage y sin reduced-motion; el CSS oscurece `.altar::after`. React lo lee en un efecto (evita desajuste de hidratación).
- Candelabro = tema: encendido = `data-theme=light`. Excepción: al encender en la intro la llama prende sin cambiar de tema (`flames` aparte de `theme`). `MutationObserver` sobre data-theme mantiene sincronizado el botón de la cabecera.
- Trampa: en `up` solo se enciende por arrastre (dist > 6); el clic simple lo gestiona `click`, si no el clic posterior alternaría el tema.
- Humo: canvas 4x ancho / 2.3x alto del candelabro (constantes en Smoke.tsx y `.smoke` en global.css deben coincidir); un canvas más estrecho cortaba el rastro.
- Sonido: `src/lib/sound.ts`, clave `as-sound`; sin gesto previo `playSound` no hace nada. Móvil: el candelabro se muestra (antes oculto) en fila propia.
- Pendiente: icono de sonido es texto "♪ Sound", falta objeto en imagen (2.7.5).
