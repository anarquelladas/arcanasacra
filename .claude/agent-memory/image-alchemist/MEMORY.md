# Memoria · image-alchemist

## Imágenes en uso (todas en public/objetos/ + public/objetos/ink/)
| archivo | fuente | licencia | notas |
| --- | --- | --- | --- |
| moth.webp | Acherontia atropos MHNT dos — Didier Descouens | CC BY-SA 4.0 | máscara "no blanco" (scripts/lineart.py modo white, dil 5) |
| moth-pepper.webp | (MHNT) Biston betularia male dorsal — Didier Descouens | CC BY-SA 4.0 | fondo negro, GrabCut |
| deathshead.webp | Acherontia atropos MHNT Tête de mort — Didier Descouens | CC BY-SA 4.0 | `--nocut` |
| ball.webp | MET 32811 (esfera de cristal sobre soporte) | CC0 | recortada la regla inferior (93 %) |
| candelabrum.webp | Candelabrum MET DP-12252-029, Augustus Pugin | CC0 | máscara por saturación (dorado sobre gris); copas medidas para las llamas |
| poison.webp | Green glass poison bottle, Wellcome L0036271 | CC BY 4.0 | recortado 20 % izq. y 8 % inferior (etiqueta de inventario) |
| bat.webp / batface.webp | Haeckel, Kunstformen der Natur, Chiroptera | PD | |
| skeleton.webp | Vesalius, De humani corporis fabrica (164frc) | PD | quitado el encabezado; silueta rellena (lineart.py) |
| elvira-eyes.webp | Elvira promoting Knott's Berry Farm's Halloween Haunt (35859341932), Orange County Archives | CC BY 2.0 | recorte x900–2800, y1500–2700; iris borrados (r=92) en (540,624) y (1350,620) del recorte; óvalo con filete |
| elvira-iris-l/r.webp | generados (iris claro, anillo límbico oscuro, pupila, brillo) | propios | izq. 28.4 %/52 %, der. 71 %/52 %, ancho 8.6 % |
| elvira.webp | Elvira promoting… (35641035160), Orange County Archives | CC BY 2.0 | `--nofill --outline 6` (pelo negro sobre fondo negro necesita filete) |
| blood-drip / blood-drop | generadas por código (scripts/blood.py) | propias | rojo con brillo fino y grano |
| tarot.webp | XVII L'ETOILE Nicolas Conver Tarot 1760 — Tarot World Project | CC BY-SA 4.0 | recorte x .088–.898, y .046–.938 (quita marca de agua), `--nocut --thresh 8` |
| mirror.webp | Etruscan Mirror with Female Figure, Walters 54105 (reverso) | PD | |
| candle.webp | Sèvres Candlestick, Walters 48715 | PD | recortado el 80 % superior (quitar mesa) |
| key.webp | German Lock Nut with Key, Walters 52137 | PD | recortado el 36 % izquierdo (solo la llave) |
| dagger.webp | Italian Dagger for the Left Hand, Walters 51517 | PD | |
| inkwell.webp | al-Harawi Inkwell, Walters 54514 View A | PD | fondo degradado: GrabCut solo |
| eye.webp | Lover's Eyes, The Met DT4436 | CC0 | iris borrados con cv2.inpaint (r=52) en (430,1035) y (835,1035); `--thresh -25` |
| iris-l/r.webp | generados (estrías radiales + pupila + brillo) | propios | se mueven sobre el ojo |

Retiradas: *I Le Bateleur* (sustituida por La Estrella); Graellsia isabellae y Attacus atlas ("demasiado pomposas").

## Lecciones
- La Met (Incapsula) y el Art Institute (Cloudflare) devuelven 403 a navegadores automatizados. Wikimedia sí funciona.
- GrabCut a 600 px y reescalar la máscara: a 1800 px tarda minutos.
- `--diff` (sumar lo que difiere del color del borde) filtra fondo con degradado: usarlo solo con fondos planos.
- Tras convertir, rellenar huecos de la máscara (fill holes) para que el interior blanco de objetos no desaparezca.
- Versión de día: color #1a1611, alfa = clip((218 − luminancia) / 204) × alfa.

- Grabados de línea sobre papel: GrabCut falla; mejor silueta = dilatar la tinta + cerrar + rellenar huecos (lineart.py).
- Objetos dorados sobre fondo gris: máscara por saturación HSV (> 70).

- Para el navegador integrado de Ana: cada descarga le abre una ventana de "guardar"; es ajuste de la app/navegador, no se controla desde la página.

## Medallón de Elvira (scripts/medallion.py + scripts/frame.py)
| archivo | fuente | licencia | notas |
| --- | --- | --- | --- |
| frame.webp (actual) | imagen aportada por Ana (marco ovalado de forja negra) | sin confirmar | noche: cuerpo hueso con brillos en tinta; día: tinta donde es oscuro. Óvalo: centro 50/51.8 %, 76.5 × 67.6 % |
| (retirado) frame Cuvilliés | Cartouche with Armorial Trophies, Troisième Livre de Cadres, F. de Cuvilliés, Cooper Hewitt CH 18238233 | PD | óvalo interior centro (938,1522) r 508×708 del recorte; versión sello, solo la pieza mayor |
| elvira-a.webp | Knott's (35859341932) | CC BY 2.0 | proporción del óvalo 1016:1416; iris borrados |
| elvira-b.webp | Knott's (35896709101), primer plano a color | CC BY 2.0 | `--thresh -10` |
| elvira-c.webp | Knott's (36030656275), manos junto a la cara | CC BY 2.0 | iris pequeños (4.6 %) |
Posiciones de ojos e iris en `GAZES` de `Altar.tsx`. El retrato va en left 21.7 %, top 29 %, 58.2 × 51.9 % del marco.
- Descargas desde el navegador: piden confirmación porque su navegador pregunta dónde guardar; se arregla en sus ajustes de descargas.

## Sesion 2026-11-26 (retratos apaisados)
- En esta maquina NO hay Python (solo stubs de la Store): se uso Node + sharp (scripts/portrait.mjs, scripts/frame-wide.mjs). En sharp, `.raw()` tras resize/blur puede devolver 3 canales: usar `.toColourspace('b-w')`; `resize` con distinta proporcion necesita `fit:'fill'`; `composite` va despues de `resize` (hacer en dos pasos).
- elvira-d (Knott's mid-1980s 35896686071), elvira-e (1997, 35896692491), elvira-f (36030656275 plano amplio): CC BY 2.0 Orange County Archives. frame-wide: Cuvillies CH 18238167 PD, hueco left16.26 top38.34 w68.42 h47.12. Datos en docs/elvira-gazes.md.
- Wikimedia limita peticiones (429): espaciar 3-5 s. No quedan mas fotos libres de Elvira en Commons; las de Cassandra Peterson son sin disfraz.

## Sesion 2026-11-26 ronda 2 (Elvira)
- Ann prefiere a, c, f; rechaza b, d, e. elvira-f ahora cerrado (w1898, ey .37). Nuevos: elvira-g (35641035160, vertical), elvira-h/i (sombrero 35641028170, vertical y apaisado), CC BY 2.0 Orange County Archives. portrait.mjs admite aspect/ow/oval/bgcut (fondo blanco -> negro + filete rim).
- frame-wide2: Cuvillies CH 18238247 PD, lineas sobre transparente, hueco eliptico left12.27 top29.15 w76.84 h53.44. Scripts leen big/*.jpg del cwd (scratchpad); descargar con dl.mjs (Special:FilePath).
- Commons ya no tiene mas fotos de Elvira (ni Cassandra caracterizada). En bash, NO usar backticks dentro de node -e con comillas dobles.
