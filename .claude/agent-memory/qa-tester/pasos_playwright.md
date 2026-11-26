---
name: pasos-playwright
description: Cómo ejecutar Playwright en este equipo Windows y trucos que funcionaron para el QA de Arcana Sacra
metadata:
  type: reference
---
- `playwright` no está en el repo: `npm i playwright` en el scratchpad y lanzar con `executablePath` al Chrome ya instalado en `~/AppData/Local/ms-playwright/chromium-1228/chrome-win64/chrome.exe` (la versión nueva pide otro navegador no descargado).
- No hay Python en la máquina. Servir con `npx astro preview --port 4399`.
- El lacre de Contact pulsa siempre: `click({force:true})`. Imágenes `lazy` salen vacías en fullPage: hacer scroll antes.
- Selectores: `.eye-btn`, `.iris`, `.cubby`, `.drawer`, `.vitrine`, `.arcano .back`, `.seal-btn`. Tema: `localStorage['as-theme']`.
- Capturas pesan ~27 MB por QA completo: avisar a Ana antes de subirlas.
- Fallos recurrentes (2026-11-26): visor del gabinete con título pisando etiqueta, foco punteado 1 px, 404 móvil con llave enorme.
- Ronda 2: playwright ya instalado en el scratchpad de la sesión (reinstalar si se limpia). Comprimir capturas con `sharp` del repo (`node_modules/sharp/dist/index.cjs`, importar con URL file:///) a JPG 900 px: 9 capturas = 350 KB. Contar AudioContext con `addInitScript` para comprobar que no hay audio sin gesto. La intro de la portada pide Tab x14 hasta el candelabro. Fallos recurrentes: sangre sobre la cabecera en día, floreos del título pisando rótulos.
