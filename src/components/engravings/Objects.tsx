// Lacre de cera (usado por AboutLetter, Letter y About).

import { rng, smooth, type Pt } from '../../lib/ornament';

function waxBlob(cx: number, cy: number, r: number, seed: number) {
  const rand = rng(seed);
  const pts: Pt[] = [];
  const n = 26;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = i === n ? 0 : r + (rand() - 0.5) * r * 0.16;
    pts.push([cx + Math.cos(a) * (rr || r), cy + Math.sin(a) * (rr || r)]);
  }
  pts[n] = pts[0];
  return smooth(pts) + 'Z';
}

export function WaxSeal({ cx, cy, r = 22, letter = 'A' }: { cx: number; cy: number; r?: number; letter?: string }) {
  return (
    <g className="seal">
      <path d={waxBlob(cx, cy, r, 11)} fill="url(#wax)" stroke="#2a0706" strokeWidth="0.56" />
      <circle cx={cx} cy={cy} r={r * 0.68} fill="none" stroke="#3d0b0a" strokeWidth="0.98" />
      <circle cx={cx} cy={cy} r={r * 0.6} fill="none" stroke="#b5463c" strokeWidth="0.35" opacity=".6" />
      <text x={cx} y={cy + r * 0.32} textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontStyle="italic" fontSize={r * 0.95} fill="#3d0b0a">{letter}</text>
      <path d={`M${cx - r * 0.5},${cy - r * 0.55}Q${cx - r * 0.2},${cy - r * 0.78} ${cx + r * 0.15},${cy - r * 0.7}`} stroke="#d77a6c" strokeWidth="0.84" fill="none" opacity=".5" strokeLinecap="round" />
    </g>
  );
}
