// Patrones de grabado (rayado, cruzado, punteado) y filtros de trazo "a mano".
// Se monta una sola vez en el layout; el resto de dibujos los referencian por id.

const inks = { i: 'var(--ink)', g: 'var(--gold)', d: 'var(--ink-dim)', k: 'var(--ink-dark)' } as const;

export default function Defs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        {Object.entries(inks).map(([k, c]) => (
          <g key={k}>
            <pattern id={`h-${k}`} width="3.2" height="3.2" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="3.2" stroke={c} strokeWidth=".45" />
            </pattern>
            <pattern id={`hh-${k}`} width="2.2" height="2.2" patternUnits="userSpaceOnUse" patternTransform="rotate(-38)">
              <line x1="0" y1="0" x2="0" y2="2.2" stroke={c} strokeWidth=".5" />
            </pattern>
            <pattern id={`hx-${k}`} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
              <path d="M0,0V3M0,0H3" stroke={c} strokeWidth=".38" />
            </pattern>
            <pattern id={`dot-${k}`} width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(20)">
              <circle cx="1.5" cy="1.5" r=".4" fill={c} />
            </pattern>
          </g>
        ))}
        <pattern id="paper" width="300" height="300" patternUnits="userSpaceOnUse">
          <image href="/tex/paper.webp" width="300" height="300" />
        </pattern>
        <radialGradient id="glass" cx="38%" cy="32%" r="80%">
          <stop offset="0" stopColor="#3a3a36" />
          <stop offset=".55" stopColor="#141413" />
          <stop offset="1" stopColor="#060606" />
        </radialGradient>
        <radialGradient id="wax" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#9a2b26" />
          <stop offset=".6" stopColor="#6b1714" />
          <stop offset="1" stopColor="#3d0b0a" />
        </radialGradient>
        <radialGradient id="flame" cx="50%" cy="70%" r="60%">
          <stop offset="0" stopColor="#fff8dc" />
          <stop offset=".35" stopColor="#ffd27a" />
          <stop offset=".75" stopColor="#e07b26" stopOpacity=".85" />
          <stop offset="1" stopColor="#a33a12" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="halo" r="50%">
          <stop offset="0" stopColor="#f3e2bd" stopOpacity=".22" />
          <stop offset="1" stopColor="#f3e2bd" stopOpacity="0" />
        </radialGradient>
        {/* temblor de la plancha: los trazos no quedan perfectos */}
        <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="3" />
          <feDisplacementMap in="SourceGraphic" scale="1.1" />
        </filter>
        <filter id="rough-strong" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency=".06" numOctaves="2" seed="9" />
          <feDisplacementMap in="SourceGraphic" scale="3" />
        </filter>
        {/* tinta que "muerde" el papel: bordes irregulares y huecos */}
        <filter id="worn">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" seed="4" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.6" result="m" />
          <feComposite in="SourceGraphic" in2="m" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}
