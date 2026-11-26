# Retratos apaisados de Elvira y marco horizontal (datos para `Altar.tsx`)

Generado con `scripts/portrait.mjs` y `scripts/frame-wide.mjs` (Node + sharp; no hay Python en esta maquina).
Cada imagen tiene version noche (`public/objetos/<f>.webp`) y dia (`public/objetos/ink/<f>.webp`).
Los tres retratos nuevos son **apaisados, 1200x727 px (relacion 1.65)**, la misma que el hueco del marco `frame-wide`.
Los porcentajes son del ancho/alto del retrato (como en `GAZES`). Los iris son los ya existentes (`elvira-iris-l/r.webp`).

## Entradas para GAZES (pegar tal cual)

```ts
{ file: 'elvira-d', eyes: [[36.67, 45.05], [46.48, 44.9]],  iris: 2.55, rx: 2.42, ry: 2.1  }, // apaisado
{ file: 'elvira-e', eyes: [[44.82, 39.88], [55.18, 40.03]], iris: 2.29, rx: 2.18, ry: 1.89 }, // apaisado
{ file: 'elvira-f', eyes: [[44.48, 33.56], [55.52, 34.47]], iris: 2.57, rx: 2.44, ry: 2.12 }, // apaisado
```

Los iris son pequenos (2-2.6 %) porque son planos amplios; el desplazamiento del iris (`look[0]*34 %` del propio iris)
funciona igual, pero conviene probar el recorrido y, si se ve corto, multiplicar el factor para los apaisados.

## Marco `frame-wide` (apaisado)

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
