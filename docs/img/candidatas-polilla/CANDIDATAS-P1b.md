# Polillas candidatas P.1 (ronda 2)

Seis opciones nuevas, todas fotos de ejemplares reales pasadas a dos tintas (umbral local sobre CLAHE + filete).
Hoja comparativa: `hoja-p1b.png`. Archivos: `<nombre>.webp` (noche, hueso) y `<nombre>-ink.webp` (dia, tinta #1a1611).
Ninguna esta copiada a `public/`. Generadas con `moth.mjs` (Node + sharp; ver scratchpad de la sesion).

| nombre | especie | autor | licencia | URL (Wikimedia Commons) | notas |
| --- | --- | --- | --- | --- | --- |
| chersis | Sphinx chersis (esfinge del fresno), hembra | Didier Descouens (MHNT) | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Sphinx_chersis_MHNT_CUT_2010_0_327_Wisconsin,_Sauk_County_female_dorsal.jpg | Alas muy estrechas y cuerpo grueso: la mas "polilla". Fondo negro, mascara por luminancia. |
| amyntor | Ceratomia amyntor (esfinge del olmo) | Didier Descouens (MHNT) | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Ceratomia_amyntor_MHNT_CUT_2010_0_406_Chaffeys_Locks_Leeds_Co_Ontario,_male_dorsal.jpg | Alas con nervios muy grabados, abdomen largo. |
| manduca | Manduca sexta (esfinge del tabaco), macho | Didier Descouens (MHNT) | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File:Manduca_sexta_MHNT_CUT_2010_0_104_Caranavi,_La_Paz_Bolivia_male_dorsal.jpg | Abdomen rayado, parecido a la esfinge actual pero mas oscura. |
| fraxini | Catocala fraxini (ala-lazo azul) | Florida Museum of Natural History (MGCL 1099557) | CC0 | https://commons.wikimedia.org/wiki/File:Catocala_fraxini_MGCL_1099557_D.jpg | Alas anteriores moteadas, posteriores negras con banda. Recortada con diferencia al fondo degradado (--diff 30). |
| maestosa | Catocala maestosa | Florida Museum of Natural History (MGCL 1112027) | CC0 | https://commons.wikimedia.org/wiki/File:Catocala_maestosa_MGCL_1112027_D.jpg | La mas oscura y fea; posteriores casi negras (en noche quedan huecas con solo el borde). |
| nupta | Catocala nupta (ala-lazo roja) | Florida Museum of Natural History (MGCL 1098078) | CC0 | https://commons.wikimedia.org/wiki/File:Catocala_nupta_MGCL_1098078_D.jpg | Antenas largas, dibujo de las posteriores muy bonito en tinta. |

## Valoracion
- Mejor encaje con "cuerpo grueso, alas estrechas, estilo grabado": **chersis** y **amyntor** (esfinges); **nupta** si se admite una alas anchas.
- Las MHNT exigen credito CC BY-SA (Didier Descouens, ya acreditado en el pie por las otras polillas). Las MGCL son CC0, sin obligacion de credito (se puede citar igualmente).
- Pendiente si se elige una: copiar a `public/objetos/` y `public/objetos/ink/`, acreditar y quitar la actual.
- Sin grabados PD (Biodiversity Heritage Library/Commons) adecuados: los grabados de esfinges hallados son laminas a color de baja resolucion; Commons limita peticiones (429).
