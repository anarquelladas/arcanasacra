import { arm, leaf, mirrorX, mirrorY, volute, type Pt } from '../../lib/ornament';

// Banda de forja simétrica: volutas en "lira" que nacen de un nudo central.
// viewBox 640×160, centro (320, 80).

const CX = 320;
const CY = 80;

function halfBand() {
  const bars: string[] = [];
  const thin: string[] = [];
  const leaves: string[] = [];
  const o: Pt = [336, CY];
  // lira grande: sube, se abre y se enrosca
  const lyre = arm(o, [1, -0.25], { c: [478, 44], R: 30, turns: 1.6, at: 180, dir: 1 }, 0.55, 0.5);
  bars.push(lyre, mirrorY(lyre, CY));
  // volutas pequeñas pegadas al nudo
  const small = arm([334, 72], [0.4, -1], { c: [372, 34], R: 15, turns: 1.4, at: 180, dir: 1 }, 0.5, 0.6);
  bars.push(small, mirrorY(small, CY));
  // tallo horizontal que remata en dos cuernos enroscados
  bars.push('M336,80L556,80');
  const horn = arm([556, 80], [1, -0.2], { c: [588, 62], R: 15, turns: 1.5, at: 90, dir: -1 }, 0.35, 0.4);
  bars.push(horn, mirrorY(horn, CY));
  // zarcillos finos que salen de la lira
  const t1 = arm([446, 26], [0.6, -1], { c: [530, 18], R: 9, turns: 1.3, at: 180, dir: 1 }, 0.4, 0.5);
  const t2 = arm([520, 60], [1, 0.3], { c: [556, 40], R: 8, turns: 1.2, at: 90, dir: -1 }, 0.5, 0.5);
  thin.push(t1, mirrorY(t1, CY), t2, mirrorY(t2, CY));
  thin.push(volute({ c: [420, 80], R: 9, turns: 1.3, at: 180, dir: 1 }));
  leaves.push(leaf([538, 26], 16, -40), leaf([560, 30], 12, 10), leaf([424, 62], 11, -70));
  leaves.push(...leaves.map((l) => mirrorY(l, CY)));
  return { bars, thin, leaves };
}

const H = halfBand();
const ALL = {
  bars: [...H.bars, ...H.bars.map((d) => mirrorX(d, CX))],
  thin: [...H.thin, ...H.thin.map((d) => mirrorX(d, CX))],
  leaves: [...H.leaves, ...H.leaves.map((d) => mirrorX(d, CX))],
};
const RIVETS: Pt[] = [
  [336, 80], [304, 80], [478, 44], [478, 116], [162, 44], [162, 116], [588, 62], [52, 62], [588, 98], [52, 98], [556, 80], [84, 80],
];

export function IronBand({ className, flip }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 640 160"
      className={className}
      aria-hidden="true"
      style={flip ? { transform: 'scaleY(-1)' } : undefined}
    >
      <g filter="url(#rough)" strokeLinecap="round" fill="none">
        <g stroke="var(--ink)" strokeWidth="1.25">
          {ALL.bars.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g stroke="var(--ink)" strokeWidth=".7" opacity=".8">
          {ALL.thin.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g stroke="var(--ink)" strokeWidth=".6" fill="url(#h-i)" opacity=".85">
          {ALL.leaves.map((d, i) => <path key={i} d={d} />)}
        </g>
        {/* nudo central: un rombo pequeño */}
        <g stroke="var(--ink)" strokeWidth=".9">
          <path d="M320,68L330,80 320,92 310,80Z" fill="var(--bg)" />
          <circle cx="320" cy="80" r="1.6" fill="var(--ink)" stroke="none" />
          {RIVETS.slice(2).map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.1" fill="var(--ink)" stroke="none" />
          ))}
        </g>
      </g>
    </svg>
  );
}

/** Abanico de esquina, como el montante de una reja: arcos concéntricos,
 *  radios finos y una corona de liras enroscadas. La esquina es (0,0). */
export function IronCorner({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const P = (r: number, deg: number): Pt => [Math.cos((deg * Math.PI) / 180) * r, Math.sin((deg * Math.PI) / 180) * r];
  const f = (p: Pt) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`;
  const arc = (r: number) => `M${f(P(r, 0))}A${r},${r} 0 0 1 ${f(P(r, 90))}`;
  const spokes: string[] = [];
  for (let d = 3.75; d < 90; d += 7.5) spokes.push(`M${f(P(150, d))}L${f(P(166, d))}`);
  const lyres: string[] = [];
  const leaves: string[] = [];
  [11.25, 33.75, 56.25, 78.75].forEach((d) => {
    const a = (d * Math.PI) / 180;
    const out: Pt = [Math.cos(a), Math.sin(a)];
    const tan: Pt = [-Math.sin(a), Math.cos(a)];
    const base = P(92, d);
    for (const side of [1, -1] as const) {
      const c: Pt = [Math.cos(a) * 128 + tan[0] * side * 10, Math.sin(a) * 128 + tan[1] * side * 10];
      const at = (Math.atan2(-tan[1] * side, -tan[0] * side) * 180) / Math.PI;
      lyres.push(arm(base, [out[0] + tan[0] * side * 0.5, out[1] + tan[1] * side * 0.5], { c, R: 9, turns: 1.35, at, dir: side === 1 ? -1 : 1 }, 0.5, 0.5));
    }
    leaves.push(leaf(P(150, d), 12, d + 180, 0.3));
  });
  const petals: string[] = [];
  for (let d = 9; d < 90; d += 18) petals.push(leaf([0, 0], 58, d, 0.22));
  return (
    <svg viewBox="-4 -4 180 180" className={className} style={style} aria-hidden="true">
      <g filter="url(#rough)" fill="none" stroke="var(--ink)" strokeLinecap="round">
        <path d={arc(166)} strokeWidth="1.3" />
        <path d={arc(150)} strokeWidth="1" />
        <path d={arc(92)} strokeWidth="1.2" />
        <path d={arc(86)} strokeWidth=".6" />
        <path d={arc(64)} strokeWidth=".8" />
        {spokes.map((d, i) => <path key={i} d={d} strokeWidth=".8" />)}
        {lyres.map((d, i) => <path key={i} d={d} strokeWidth="1.1" />)}
        {leaves.map((d, i) => <path key={i} d={d} strokeWidth=".6" fill="url(#h-i)" />)}
        {petals.map((d, i) => <path key={i} d={d} strokeWidth=".7" fill="url(#hh-i)" />)}
        {[0, 22.5, 45, 67.5, 90].map((d) => <circle key={d} cx={P(158, d)[0]} cy={P(158, d)[1]} r="1.8" fill="var(--ink)" stroke="none" />)}
      </g>
    </svg>
  );
}
