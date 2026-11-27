// Lacre de cera (usado por AboutLetter, Letter y About).

// El lacre es ahora una imagen: cera granate con relieve y una A (generada por codigo con iluminacion SVG, scripts/wax-seal.mjs).
// La imagen ocupa 560 px y el disco de cera mide el 87 % de ese ancho; por eso el lado es r * 2.4.
export function WaxSeal({ cx, cy, r = 22 }: { cx: number; cy: number; r?: number; letter?: string }) {
  const s = r * 2.4;
  return (
    <g className="seal">
      <image href="/objetos/seal.webp" x={cx - s / 2} y={cy - s / 2} width={s} height={s} />
    </g>
  );
}
