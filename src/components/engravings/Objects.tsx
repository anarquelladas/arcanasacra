// Grabados originales dibujados a mano en SVG: polilla, baraja, sobre lacrado,
// espejo de mano, vela, llave, luna, destello y ojo.
// Todos usan los patrones de <Defs/> (h-*, hh-*, hx-*, dot-*) y el filtro #rough.

import type { CSSProperties } from 'react';
import { rng, smooth, type Pt } from '../../lib/ornament';

type P = { className?: string; style?: CSSProperties };

const INK = { stroke: 'var(--ink)', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const DARK = { stroke: 'var(--ink-dark)', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
const GOLD = { stroke: 'var(--gold)', fill: 'none', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

/* ───────────── Polilla ───────────── */

function feather(from: Pt, ctrl: Pt, to: Pt, n = 14) {
  let d = '';
  for (let i = 2; i < n; i++) {
    const t = i / n;
    const x = (1 - t) ** 2 * from[0] + 2 * (1 - t) * t * ctrl[0] + t * t * to[0];
    const y = (1 - t) ** 2 * from[1] + 2 * (1 - t) * t * ctrl[1] + t * t * to[1];
    const l = 4.5 * (1 - t * 0.6);
    d += `M${x - l * 0.8},${y - l * 0.2}L${x},${y}L${x + l * 0.2},${y - l * 0.9}`;
  }
  return d;
}

function MothWing() {
  const dots: Pt[] = [];
  for (let i = 0; i < 9; i++) {
    const t = i / 8;
    dots.push([231 - t * 24 + Math.sin(t * 3) * 4, 30 + t * 44]);
  }
  return (
    <g className="wing">
      {/* ala anterior */}
      <path d="M126,64C150,34 196,12 231,21C240,40 227,63 205,79C186,91 158,95 128,83Z" fill="var(--bg)" strokeWidth="1.12" />
      <path d="M127,66C142,50 160,40 174,38C168,56 161,72 157,90C146,92 135,89 128,83Z" fill="url(#h-i)" stroke="none" />
      <path d="M200,16C214,14 226,16 231,21C234,30 232,38 228,44C220,36 210,26 200,16Z" fill="url(#hh-i)" stroke="none" />
      <path d="M148,34C160,50 175,60 186,88M186,20C194,38 204,52 216,70M163,26C176,38 190,46 204,50" strokeWidth="0.63" />
      <path d="M128,70Q172,46 222,28M130,77Q174,70 214,60M131,81Q170,86 201,78" strokeWidth="0.42" opacity=".8" />
      <path d="M178,48Q193,55 183,64Q187,55 178,48Z" fill="var(--ink)" />
      {dots.map(([x, y], i) => <circle key={i} cx={x - 6} cy={y} r="1.3" fill="var(--ink)" stroke="none" />)}
      {/* ala posterior */}
      <path d="M127,84C150,94 187,99 199,122C207,143 191,165 166,161C145,157 133,134 126,100Z" fill="var(--bg)" strokeWidth="1.12" />
      <path d="M127,85C141,93 151,101 151,113C143,119 134,111 126,100Z" fill="url(#h-i)" stroke="none" />
      <path d="M150,150C160,160 176,164 188,156" strokeWidth="0.56" strokeDasharray="1.5 3" />
      <path d="M130,90Q160,106 192,128M130,96Q150,128 166,158" strokeWidth="0.42" opacity=".8" />
      <circle cx="168" cy="130" r="13.5" strokeWidth="0.84" />
      <circle cx="168" cy="130" r="9" fill="url(#hh-i)" strokeWidth="0.56" />
      <circle cx="168" cy="130" r="3.4" fill="var(--ink)" />
      <circle cx="166.3" cy="128.3" r="1.1" fill="var(--bg)" stroke="none" />
    </g>
  );
}

export function Moth({ className, style }: P) {
  return (
    <svg viewBox="0 0 240 180" className={className} style={style} aria-hidden="true">
      <g {...INK} filter="url(#rough)" strokeWidth="0.84">
        <path d={feather([117, 50], [106, 26], [84, 12])} strokeWidth="0.56" />
        <path d={`M117,50Q106,26 84,12`} />
        <g transform="translate(240 0) scale(-1 1)">
          <path d={feather([117, 50], [106, 26], [84, 12])} strokeWidth="0.56" />
          <path d="M117,50Q106,26 84,12" />
        </g>
        <MothWing />
        <g transform="translate(240 0) scale(-1 1)">
          <MothWing />
        </g>
        <path d="M112.5,88C110,108 113,128 120,138C127,128 130,108 127.5,88Z" fill="url(#h-i)" />
        {[94, 102, 110, 118, 126].map((y) => (
          <path key={y} d={`M${113.5 - (y > 118 ? -2 : 0)},${y}Q120,${y + 4} ${126.5 + (y > 118 ? -2 : 0)},${y}`} strokeWidth="0.63" />
        ))}
        <ellipse cx="120" cy="73" rx="9" ry="14" fill="url(#hx-i)" />
        <circle cx="120" cy="55.5" r="6.5" fill="var(--bg)" />
        <circle cx="116.5" cy="54" r="1.8" fill="var(--ink)" />
        <circle cx="123.5" cy="54" r="1.8" fill="var(--ink)" />
      </g>
    </svg>
  );
}

/* ───────────── Baraja de tarot ───────────── */

export function CardBack({ x = 0, y = 0 }: { x?: number; y?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="120" height="190" rx="7" fill="#15120d" stroke="var(--gold)" strokeWidth="0.98" />
      <rect x="7" y="7" width="106" height="176" rx="4" {...GOLD} strokeWidth="0.56" />
      <rect x="11" y="11" width="98" height="168" rx="3" fill="url(#dot-g)" opacity=".35" />
      <g {...GOLD} strokeWidth="0.7">
        <circle cx="60" cy="95" r="26" fill="#15120d" />
        <circle cx="60" cy="95" r="20" />
        {Array.from({ length: 16 }, (_, i) => {
          const a = (i / 16) * Math.PI * 2;
          const r1 = 28, r2 = i % 2 ? 36 : 44;
          return <path key={i} d={`M${60 + Math.cos(a) * r1},${95 + Math.sin(a) * r1}L${60 + Math.cos(a) * r2},${95 + Math.sin(a) * r2}`} />;
        })}
        <path d="M44,95Q60,82 76,95Q60,108 44,95Z" />
        <circle cx="60" cy="95" r="5" fill="var(--gold)" />
        <path d="M60,22l3,7 7,3-7,3-3,7-3-7-7-3 7-3z M60,148l3,7 7,3-7,3-3,7-3-7-7-3 7-3z" fill="var(--gold)" stroke="none" />
      </g>
    </g>
  );
}

export function CardFace({ numeral, name, children }: { numeral: string; name: string; children?: React.ReactNode }) {
  return (
    <g>
      <rect width="120" height="190" rx="7" fill="url(#paper)" stroke="var(--ink-dark)" strokeWidth="0.84" />
      <rect x="6" y="6" width="108" height="178" rx="4" {...DARK} strokeWidth="0.7" />
      <rect x="9" y="9" width="102" height="172" rx="3" {...DARK} strokeWidth="0.35" />
      <text x="60" y="25" textAnchor="middle" fontFamily="Cormorant SC, serif" fontSize="12" fill="var(--ink-dark)">{numeral}</text>
      <path d="M9,32H111M9,158H111" {...DARK} strokeWidth="0.49" />
      <text x="60" y="174" textAnchor="middle" fontFamily="Cormorant SC, serif" fontSize="10.5" letterSpacing="1.2" fill="var(--ink-dark)">{name}</text>
      {children}
    </g>
  );
}

export function MagicianEmblem() {
  return (
    <g {...DARK} strokeWidth="0.77" filter="url(#rough)">
      <path d="M42,60C42,50 54,50 60,60C66,70 78,70 78,60C78,50 66,50 60,60C54,70 42,70 42,60Z" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        const r1 = 30, r2 = i % 2 ? 38 : 48;
        return <path key={i} d={`M${60 + Math.cos(a) * r1},${100 + Math.sin(a) * r1}L${60 + Math.cos(a) * r2},${100 + Math.sin(a) * r2}`} strokeWidth="0.42" />;
      })}
      <path d="M60,74L66,94 86,100 66,106 60,126 54,106 34,100 54,94Z" fill="url(#hh-k)" />
      <path d="M60,74L66,94 86,100 66,106 60,126 54,106 34,100 54,94Z" />
      <circle cx="60" cy="100" r="5" fill="var(--paper-ink, #e9dfc8)" />
      <path d="M24,150Q60,142 96,150" />
      <path d="M26,154H94" strokeWidth="0.35" strokeDasharray="2 2" />
    </g>
  );
}

export function TarotDeck({ className, style }: P) {
  return (
    <svg viewBox="0 0 230 250" className={className} style={style} aria-hidden="true">
      <g className="card c1"><CardBack x={55} y={40} /></g>
      <g className="card c2"><CardBack x={55} y={40} /></g>
      <g className="card c3">
        <g transform="translate(55 40)">
          <CardFace numeral="I" name="EL MAGO"><MagicianEmblem /></CardFace>
        </g>
      </g>
    </svg>
  );
}

/* ───────────── Sobre lacrado ───────────── */

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

export function Envelope({ className, style }: P) {
  const wav = (y: number) => `M30,${y}q6,-4 12,0t12,0t12,0t12,0t12,0`;
  return (
    <svg viewBox="0 0 260 190" className={className} style={style} aria-hidden="true">
      <g filter="url(#rough)">
        <rect x="20" y="34" width="220" height="140" rx="3" fill="url(#paper)" stroke="var(--ink-dark)" strokeWidth="0.84" />
        <path d="M20,174L114,106M240,174L146,106" {...DARK} strokeWidth="0.7" />
        <path d="M20,174L114,106 146,106 240,174Z" fill="url(#h-k)" opacity=".18" />
        <g {...DARK} strokeWidth="0.56" opacity=".65">
          <path d={wav(138)} /><path d={wav(146)} /><path d={wav(154)} />
          <circle cx="104" cy="146" r="15" />
          <circle cx="104" cy="146" r="11" strokeWidth="0.28" />
          <path id="pm" d="M93,146a11,11 0 1 1 22,0" fill="none" stroke="none" />
          <text fontFamily="Cormorant SC, serif" fontSize="5.5" fill="var(--ink-dark)" stroke="none">
            <textPath href="#pm" startOffset="50%" textAnchor="middle">ARCANA·SACRA</textPath>
          </text>
          <text x="104" y="150" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="7" fill="var(--ink-dark)" stroke="none">MMXXVI</text>
        </g>
        <g className="flap">
          <path d="M20,34L130,112 240,34Z" fill="url(#paper)" stroke="var(--ink-dark)" strokeWidth="0.84" strokeLinejoin="round" />
          <path d="M28,38L130,108 232,38" {...DARK} strokeWidth="0.35" opacity=".6" />
          <path d="M20,34L130,112 240,34 228,34 130,102 32,34Z" fill="url(#hh-k)" opacity=".2" />
        </g>
        <WaxSeal cx={130} cy={110} r={21} />
      </g>
    </svg>
  );
}

/* ───────────── Espejo de mano ───────────── */

export function HandMirror({ className, style, children }: P & { children?: React.ReactNode }) {
  const beads = Array.from({ length: 36 }, (_, i) => {
    const a = (i / 36) * Math.PI * 2;
    return [80 + Math.cos(a) * 52, 98 + Math.sin(a) * 62] as Pt;
  });
  return (
    <svg viewBox="0 0 160 290" className={className} style={style} aria-hidden="true">
      <defs>
        <clipPath id="mirror-glass"><ellipse cx="80" cy="98" rx="45" ry="55" /></clipPath>
      </defs>
      <g {...GOLD} strokeWidth="0.91" filter="url(#rough)">
        {/* cresta de concha */}
        <path d="M58,38C60,18 100,18 102,38Z" fill="url(#hh-g)" />
        {Array.from({ length: 9 }, (_, i) => {
          const a = Math.PI + (i / 8) * Math.PI;
          return <path key={i} d={`M80,38L${80 + Math.cos(a) * 22},${38 + Math.sin(a) * 19}`} strokeWidth="0.63" />;
        })}
        <path d="M58,38C50,30 40,34 42,42C44,48 52,46 50,40M102,38C110,30 120,34 118,42C116,48 108,46 110,40" strokeWidth="1.12" />
        <path d="M80,30m-60,68a60,70 0 1,0 120,0a60,70 0 1,0 -120,0ZM80,30m-48,68a48,58 0 1,1 96,0a48,58 0 1,1 -96,0Z" fill="url(#hh-g)" fillRule="evenodd" strokeWidth="1.4" />
        {beads.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.6" fill="var(--gold)" stroke="none" />)}
      </g>
      <ellipse cx="80" cy="98" rx="45" ry="55" fill="url(#glass)" />
      <g clipPath="url(#mirror-glass)">
        {children}
        <g className="sheen">
          <path d="M20,140L120,40" stroke="#fff" strokeOpacity=".12" strokeWidth="9.8" />
          <path d="M40,150L130,60" stroke="#fff" strokeOpacity=".07" strokeWidth="3.5" />
        </g>
      </g>
      <g {...GOLD} strokeWidth="0.91" filter="url(#rough)">
        <path d="M70,166Q76,176 71,186Q80,192 89,186Q84,176 90,166Z" fill="url(#h-g)" />
        <ellipse cx="80" cy="194" rx="11" ry="7" fill="url(#hx-g)" />
        <path d="M73,201C69,224 72,244 69,262Q80,268 91,262C88,244 91,224 87,201Z" fill="url(#h-g)" />
        <path d="M80,204V258" strokeWidth="0.42" />
        <circle cx="80" cy="272" r="8" fill="url(#hx-g)" />
        <circle cx="80" cy="283" r="3" fill="var(--gold)" />
      </g>
    </svg>
  );
}

/* ───────────── Vela ───────────── */

export function Candle({ className, style }: P) {
  return (
    <svg viewBox="0 0 120 270" className={className} style={style} aria-hidden="true">
      <circle className="halo" cx="60" cy="52" r="56" fill="url(#halo)" />
      <path className="flame" d="M60,22C71,44 72,60 60,72C48,60 49,44 60,22Z" fill="url(#flame)" />
      <g filter="url(#rough)">
        <path d="M60,82V70" stroke="#1b1712" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M46,84Q53,79 60,84T74,84V196H46Z" fill="var(--ink)" stroke="var(--ink-dark)" strokeWidth="0.56" />
        <path d="M64,86H74V196H64Z" fill="url(#hh-k)" opacity=".5" />
        <path d="M49,85C48,96 52,100 51,108C50,114 47,114 47,108V88M70,86C71,92 69,96 70,100" fill="var(--ink)" stroke="var(--ink-dark)" strokeWidth="0.49" />
        <g {...GOLD} strokeWidth="0.91">
          <path d="M40,198Q60,190 80,198L76,206H44Z" fill="url(#h-g)" />
          <ellipse cx="60" cy="210" rx="44" ry="10" fill="#1a1610" />
          <ellipse cx="60" cy="210" rx="36" ry="7" strokeWidth="0.49" />
          <circle cx="108" cy="208" r="9" strokeWidth="2.1" />
          <path d="M54,220Q48,232 56,240Q60,244 64,240Q72,232 66,220Z" fill="url(#hx-g)" />
          <ellipse cx="60" cy="254" rx="30" ry="7" fill="url(#hh-g)" />
          <path d="M42,248Q60,240 78,248" strokeWidth="0.56" />
        </g>
      </g>
    </svg>
  );
}

/* ───────────── Llave ───────────── */

export function Key({ className, style }: P) {
  return (
    <svg viewBox="0 0 240 100" className={className} style={style} aria-hidden="true">
      <g {...GOLD} strokeWidth="0.98" filter="url(#rough)">
        <circle cx="44" cy="50" r="28" fill="url(#hh-g)" strokeWidth="1.4" />
        <circle cx="44" cy="50" r="22" fill="var(--bg)" />
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
          return <circle key={i} cx={44 + Math.cos(a) * 11} cy={50 + Math.sin(a) * 11} r="9" />;
        })}
        <circle cx="44" cy="50" r="5" fill="var(--gold)" />
        <path d="M72,45H206M72,55H206" />
        <rect x="72" y="45" width="134" height="10" fill="url(#h-g)" stroke="none" />
        <ellipse cx="80" cy="50" rx="3.5" ry="9" fill="var(--bg)" />
        <ellipse cx="90" cy="50" rx="3" ry="7.5" fill="var(--bg)" />
        <path d="M176,55V80H186V70H194V84H204V55" fill="url(#hx-g)" />
        <circle cx="210" cy="50" r="6" fill="var(--bg)" />
      </g>
    </svg>
  );
}

/* ───────────── Luna ───────────── */

export function Moon({ className, style }: P) {
  return (
    <svg viewBox="0 0 120 120" className={className} style={style} aria-hidden="true">
      <defs>
        <mask id="moon-cut">
          <rect width="120" height="120" fill="#fff" />
          <circle cx="78" cy="46" r="40" fill="#000" />
        </mask>
      </defs>
      <g {...INK} strokeWidth="0.91" filter="url(#rough)">
        <circle cx="60" cy="60" r="46" fill="url(#h-i)" mask="url(#moon-cut)" />
        <path d="M53.4,14.5A46,46 0 1 0 102.5,77.6A40,40 0 0 1 53.4,14.5Z" />
        <path d="M27,46Q30,40 34,44" strokeWidth="0.63" />
        <circle cx="36" cy="80" r="3" />
        <circle cx="56" cy="94" r="2" />
      </g>
    </svg>
  );
}

/* ───────────── Destello ───────────── */

export function Sparkle({ className, style }: P) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} style={style} aria-hidden="true">
      <path d="M0,-11C1,-2 2,-1 11,0C2,1 1,2 0,11C-1,2 -2,1 -11,0C-2,-1 -1,-2 0,-11Z" fill="var(--gold)" />
    </svg>
  );
}

/* ───────────── Ojo ───────────── */

export function Eye({ className, style, look = [0, 0], blink = false }: P & { look?: [number, number]; blink?: boolean }) {
  const [dx, dy] = look;
  return (
    <svg viewBox="0 0 220 140" className={className} style={style} aria-hidden="true">
      <defs>
        <clipPath id="eye-clip"><path d="M30,70Q110,12 190,70Q110,128 30,70Z" /></clipPath>
      </defs>
      <g {...INK} filter="url(#rough)">
        {Array.from({ length: 31 }, (_, i) => {
          const a = Math.PI + (i / 30) * Math.PI;
          const r1 = 70, r2 = i % 2 ? 82 : 96;
          return <path key={i} d={`M${110 + Math.cos(a) * r1 * 1.25},${70 + Math.sin(a) * r1 * 0.78}L${110 + Math.cos(a) * r2 * 1.12},${70 + Math.sin(a) * r2 * 0.72}`} strokeWidth="0.56" />;
        })}
        <g clipPath="url(#eye-clip)">
          <rect x="20" y="0" width="190" height="140" fill="var(--bg)" stroke="none" />
          <g style={{ transform: `translate(${dx}px, ${dy}px)`, transition: 'transform .25s ease-out' }}>
            <circle cx="110" cy="70" r="25" fill="url(#hx-i)" strokeWidth="0.84" />
            <circle cx="110" cy="70" r="25" strokeWidth="0.84" />
            {Array.from({ length: 20 }, (_, i) => {
              const a = (i / 20) * Math.PI * 2;
              return <path key={i} d={`M${110 + Math.cos(a) * 11},${70 + Math.sin(a) * 11}L${110 + Math.cos(a) * 24},${70 + Math.sin(a) * 24}`} strokeWidth="0.42" />;
            })}
            <circle cx="110" cy="70" r="10" fill="var(--ink)" />
            <circle cx="105" cy="65" r="3" fill="var(--bg)" stroke="none" />
          </g>
          <path
            className="lid"
            d="M20,0H200V70Q110,12 20,70Z"
            fill="var(--bg)"
            stroke="none"
            style={{ transform: blink ? 'translateY(58px)' : 'translateY(0)', transition: 'transform .09s' }}
          />
        </g>
        <path d="M30,70Q110,12 190,70Q110,128 30,70Z" strokeWidth="1.26" />
        <path d="M38,60Q110,2 182,60" strokeWidth="0.7" />
        <path d="M44,82Q110,124 176,82" strokeWidth="0.49" opacity=".7" />
        {Array.from({ length: 13 }, (_, i) => {
          const t = (i + 1) / 14;
          const x = 30 + t * 160;
          const y = 70 - Math.sin(t * Math.PI) * 29;
          const ang = -Math.PI / 2 + (t - 0.5) * 1.6;
          return <path key={i} d={`M${x},${y}L${x + Math.cos(ang) * 9},${y + Math.sin(ang) * 9}`} strokeWidth="0.7" />;
        })}
      </g>
    </svg>
  );
}
