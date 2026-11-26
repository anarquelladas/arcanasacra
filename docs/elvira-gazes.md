# Retratos apaisados de Elvira y marco horizontal (datos para `Altar.tsx`)

Generado con `scripts/portrait.mjs` y `scripts/frame-wide.mjs` (Node + sharp; no hay Python en esta maquina).
Cada imagen tiene version noche (`public/objetos/<f>.webp`) y dia (`public/objetos/ink/<f>.webp`).
Los tres retratos nuevos son **apaisados, 1200x727 px (relacion 1.65)**, la misma que el hueco del marco `frame-wide`.
Los porcentajes son del ancho/alto del retrato (como en `GAZES`). Los iris son los ya existentes (`elvira-iris-l/r.webp`).

## Entradas para GAZES (pegar tal cual)

```ts
{ file: 'elvira-d', eyes: [[36.67, 45.05], [46.48, 44.9]],  iris: 2.55, rx: 2.42, ry: 2.1  }, // apaisado
{ file: 'elvira-e', eyes: [[44.82, 39.88], [55.18, 40.03]], iris: 2.29, rx: 2.18, ry: 1.89 }, // apaisado
{ file: 'elvira-f', eyes: [[42.15, 36.35], [57.85, 37.65]], iris: 3.65, rx: 3.48, ry: 3.01 }, // apaisado, encuadre CERRADO (sustituye al amplio)
```

Los iris son pequenos (2-2.6 %) porque son planos amplios; el desplazamiento del iris (`look[0]*34 %` del propio iris)
funciona igual, pero conviene probar el recorrido y, si se ve corto, multiplicar el factor para los apaisados.

## Ronda 2 (feedback de Ann: gustan a, c, f; no b, d, e)

Montaje de comparacion: `docs/img/comp-elvira-noche.jpg` y `docs/img/comp-elvira-dia.jpg` (a, c, g, h en `frame.webp`; f, i en `frame-wide2`).

### elvira-f cerrado
Recorte 1898x1150 sobre 3840x3011 (antes 2700x1636), ojos al 37 % de la altura; imagen 1200x727. `elvira-f-eyes.webp` recalculado (r 3.6 %).

### Nuevos retratos (pegar tal cual)

```ts
{ file: 'elvira-g', eyes: [[43.18, 39.53], [56.82, 40.44]], iris: 4.69, rx: 4.47, ry: 1.82 }, // VERTICAL ovalado 760x982, frame.webp
{ file: 'elvira-h', eyes: [[41.14, 44.78], [58.79, 45.22]], iris: 4.8,  rx: 4.57, ry: 1.86 }, // VERTICAL ovalado 760x982, sombrero de bruja
{ file: 'elvira-i', eyes: [[44.83, 61.72], [55.13, 62.27]], iris: 2.8,  rx: 2.67, ry: 2.31 }, // apaisado 1200x728, sombrero ancho
```

Mascaras de ojos: `node scripts/eye-masks.mjs elvira-g elvira-h elvira-i` (ahora acepta nombres); r 4.5 / 4.5 / 2.8 %. En `g` el hueco se acota a una elipse (`ell`) porque el ojo se une a la piel.
Los verticales son ovalados con alfa elíptica (como a/b/c), caben en `frame.webp` con el mismo hueco que ellos.

| Archivo | Foto original | Autor / licencia | URL | Recorte (px) |
| --- | --- | --- | --- | --- |
| `elvira-g` | *Elvira promoting Knott's Berry Farm's Halloween Haunt* (35641035160), cabeza ladeada | Orange County Archives, CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Elvira_promoting_Knott%27s_Berry_Farm%27s_Halloween_Haunt_(35641035160).jpg | 1700 de ancho sobre version 3840x4407; ojos (1980,1078) y (2212,1098), r 38 |
| `elvira-h`, `elvira-i` | *Elvira with Elvira promoting Knott's Berry Farm's Halloween Haunthat 1991* (35641028170), sombrero de bruja | Orange County Archives, CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Elvira_with_Elvira_promoting_Knott%27s_Berry_Farm%27s_Halloween_Haunthat_1991_(35641028170).jpg | original 6450x8354; h 1400 de ancho, i 2400; ojos (2975,1827) y (3222,1835), r 32 |

Notas: la foto del sombrero tiene fondo blanco; se usa `bgcut 222` (fondo a negro) y un filete hueso fino (`rim`) para que el sombrero no desaparezca sobre el negro. Es una foto blanda (baja resolucion de origen). `g`, `h`, `i` son recortes nuevos de fotos que ya teniamos: no hay mas.

### Busqueda de mas fotos (2026-11-26): no quedan
Categoria *Elvira, Mistress of the Dark* en Commons: solo las 8 de Orange County Archives + Comikaze + waving + Ontario (cera). *Cassandra Peterson Elvira.jpg* es ella sin disfraz delante de un cartel; las series 2025 (Nightmare Weekend), Dragcon 2017 y GalaxyCon 2026 estan sin disfraz. *Cosplay of Elvira* son otras personas. Busqueda web: nada con licencia libre verificable (Getty, estudio, prensa).

## Marco `frame-wide2` (apaisado ligero, ELIPTICO)
- Archivos: `public/objetos/frame-wide2.webp` y `ink/frame-wide2.webp`, 1500x1312 px. Solo lineas del grabado (hueso/tinta) sobre transparente: mucho mas aireado que `frame-wide`.
- Hueco ELIPTICO, en % del marco: **left 12.27, top 29.15, width 76.84, height 53.44** (relacion 1.644, retrato 1200x727). Retrato con `object-fit: cover` y `clip-path: ellipse(50% 50% at 50% 50%)`. Las manos de las esquinas de `elvira-f` quedan recortadas por la elipse.
- Origen: *Frame with Two Scrolls of Leaves*, Troisieme Livre de Cadres, 1740-68, F. de Cuvillies (diseno) y C. A. de Lespilliez (grabado). Cooper Hewitt (CH 18238247). **Dominio publico**. https://commons.wikimedia.org/wiki/File:Bound_Print,_Frame_with_Two_Scrolls_of_Leaves,_Troisi%C3%A8me_Livre_de_Cadres_(Third_Book_of_Frames),_1740%E2%80%9368_(CH_18238247).jpg
- Transformacion: recorte sin filete de lamina, tinta separada del papel, hueco vaciado, estirado x1.62, motas quitadas (`scripts/frame-wide2.mjs`).

## Marco `frame-wide` (apaisado, recargado; descartado por Ann)

- Archivos: `public/objetos/frame-wide.webp` y `public/objetos/ink/frame-wide.webp`, 1500x1317 px (relacion 1.14).
- Hueco para el retrato (rectangulo), en % del marco: **left 16.26, top 38.34, width 68.42, height 47.12** (relacion del hueco 1.65).
- Para clavar la proporcion del retrato: `aspect-ratio: 1200 / 727`.
- Origen: *Frame with Rocaille Volutes and Wings*, Premier Livre de Cadres, 1740-68, F. de Cuvillies (diseno) y Carl Albert von Lespilliez (grabado). Cooper Hewitt (CH 18238167). **Dominio publico**.
  URL: https://commons.wikimedia.org/wiki/File:Bound_Print,_Frame_with_Rocaille_Volutes_and_Wings,_Premier_Livre_de_Cadres_(First_Book_of_Frames),_1740%E2%80%9368_(CH_18238167).jpg
- Transformacion: tinta separada del papel, interior rayado vaciado, quitada una banda horizontal de 170 px (de 1110) en los montantes y estirado x1.45 en horizontal para pasar de vertical a apaisado. Es obra derivada de un grabado PD; no usa el marco de Ana como fuente.

## Fotos (todas CC BY 2.0, Orange County Archives, Wikimedia Commons)

| Archivo | Foto original | Autor / licencia | URL | Recorte (px del original) | Ojos y datos |
| --- | --- | --- | --- | --- | --- |
| `elvira-d` | *Elvira with monsters at Knott's Berry Farm, mid-1980s* (35896686071) | Orange County Archives, CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Elvira_with_monsters_at_Knott%27s_Berry_Farm,_mid-1980s_(35896686071).jpg | x0 0, y0 0, 3300x2000 sobre 3974x3014; `--thresh -30` | ver GAZES arriba |
| `elvira-e` | *Elvira at Knott's Berry Farm, 1997* (35896692491) | Orange County Archives, CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Elvira_at_Knott%27s_Berry_Farm,_1997_(35896692491).jpg | 1100x667 alrededor de los ojos (version 3840 px); `--thresh -15`; la foto tiene a dos "monstruos" a los lados | ver GAZES arriba |
| `elvira-f` | *Elvira promoting Knott's Berry Farm's Halloween Haunt* (36030656275) | Orange County Archives, CC BY 2.0 | https://commons.wikimedia.org/wiki/File:Elvira_promoting_Knott%27s_Berry_Farm%27s_Halloween_Haunt_(36030656275).jpg | 2700x1636 sobre 3840x3011; `--thresh +25`. Es la misma foto que `elvira-c`, en plano amplio con las manos | ver GAZES arriba |

Iris originales borrados con una elipse blanca del globo ocular (el iris generado se mueve encima). `elvira-d` tiene mucho contraste de origen: la cara queda muy blanca y el maquillaje muy negro.

## Descartadas (para que no se vuelvan a mirar)

- Comikaze Expo 2011 (6325368610): casi de perfil, no sirve para seguir al cursor.
- *Elvira promoting...* (35896710711) a color: guina un ojo (guino); (35641028170) bruja con escoba: cara minuscula.
- Todas las fotos de Cassandra Peterson (Galaxy Con, Nightmare Weekend, 2011, 2014) estan **sin disfraz** (pelo rojo): no son Elvira.
- *Elvira waving* (CC BY 2.0, Owen Byrne): cara minuscula en desfile. *Ontario, Canada (254540158)*: es una figura de cera.
- No quedan mas fotos libres de Elvira en Commons: las ocho de Orange County Archives (tres ya usadas en `elvira-a/b/c`, `elvira.webp`; mas estas tres).

## Creditos pendientes para `license-auditor`

Anadir al pie (`Base.astro`) y README: Orange County Archives (CC BY 2.0) ya cubre las fotos; **anadir** las dos fotos nuevas
(1980s con monstruos y 1997, mismo autor/licencia) si el pie las lista por separado; y el **marco Cuvillies/Lespilliez, Cooper Hewitt, dominio publico**.
