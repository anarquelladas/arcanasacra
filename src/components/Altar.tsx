import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CandelabrumStamp, DaggerStamp, Dual, MothStamp, Stamp } from './Stamp';
import './altar.css';

// La portada es una mesa de curiosidades: cada objeto se puede arrastrar,
// reacciona al pasar por encima y, si es un portal, lleva a una sección.

interface Thing {
  id: string;
  href?: string;
  label?: string;
  hint?: string;
  depth: number;
  rot: number;
  node: ReactNode;
}

// Retratos de Elvira para el medallón: posición de cada ojo (%), tamaño del iris y del hueco del ojo.
// tilt: inclinación (grados) del hueco de cada ojo; el recorte sigue su forma para que el iris no asome por los párpados.
const GAZES = [
  { file: 'elvira-a', eyes: [[26.18, 38.13, 10], [73.82, 37.95, -10]], iris: 11.4, rx: 9.6, ry: 3.6 },
  { file: 'elvira-b', eyes: [[26.27, 43.0, 10], [73.73, 37.02, -24]], iris: 11.2, rx: 9.4, ry: 3.2 },
  { file: 'elvira-c', eyes: [[40.07, 35.73, 0], [60.0, 36.29, 0]], iris: 4.6, rx: 4.2, ry: 1.6 },
] as const;

// Relación alto/ancho del retrato (.portrait): permite dibujar una elipse inclinada en porcentajes.
const AR = 1.289;
/** Elipse inclinada como polygon() en % del retrato. */
function eyeClip(x: number, y: number, rx: number, ry: number, tilt: number) {
  const t = (tilt * Math.PI) / 180;
  const pts: string[] = [];
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    const ex = rx * Math.cos(a), ey = ry * AR * Math.sin(a); // unidades de ancho
    const px = ex * Math.cos(t) - ey * Math.sin(t);
    const py = ex * Math.sin(t) + ey * Math.cos(t);
    pts.push(`${(x + px).toFixed(2)}% ${(y + py / AR).toFixed(2)}%`);
  }
  return `polygon(${pts.join(',')})`;
}

// Gotas de la tira blood-drip.webp (1600x260) que se reutilizan sueltas: [x de origen, ancho, alto], de más fina a más ancha; todas con su bulbo.
const DRIPS: ReadonlyArray<readonly [number, number, number]> = [
  [445, 20, 69], [1102, 24, 69], [795, 28, 86], [368, 29, 77], [875, 28, 65],
];
interface Drip { x: number; y: number; w: number; h: number; bx: number }

/** Huecos entre letras/palabras del título y la nav (coordenadas de página) donde cuelga una gota. */
function measureGaps(): { cx: number; cy: number; gw: number }[] {
  const gaps: { cx: number; cy: number; gw: number }[] = [];
  const mark = document.querySelector('nav.top .mark');
  const text = mark?.firstChild;
  if (text && text.nodeType === Node.TEXT_NODE) {
    const i = (text.textContent ?? '').indexOf(' ');
    if (i > 0) {
      const range = document.createRange();
      range.setStart(text, i); range.setEnd(text, i + 1);
      const r = range.getBoundingClientRect();
      gaps.push({ cx: r.left + r.width / 2, cy: r.top + r.height / 2, gw: Math.max(r.width, 14) });
    }
  }
  const items = [...document.querySelectorAll('nav.top ul > li')].map((li) => li.getBoundingClientRect());
  for (let i = 0; i < items.length - 1; i++) {
    const a = items[i], b = items[i + 1];
    if (Math.abs(a.top - b.top) > a.height / 2) continue; // otra fila (móvil)
    gaps.push({ cx: (a.right + b.left) / 2, cy: a.top + a.height / 2, gw: b.left - a.right });
  }
  return gaps;
}

const THINGS: Thing[] = [
  { id: 'moth', href: '/art/', label: 'Art', hint: 'tattoos & drawings', depth: 8, rot: -6, node: <MothStamp /> },
  { id: 'deck', href: '/code/', label: 'Code', hint: 'projects & agents', depth: 6, rot: 5, node: <Stamp name="tarot" /> },
  { id: 'mirror', href: '/about/', label: 'About', hint: 'who is behind it', depth: 5, rot: -8, node: <Stamp name="mirror" /> },
  { id: 'ball', href: '/contact/', label: 'Contact', hint: 'ask the crystal ball', depth: 7, rot: 2, node: <Stamp name="ball" /> },
  { id: 'candle', depth: 3, rot: 0, node: <CandelabrumStamp /> },
  { id: 'dagger', depth: 12, rot: 24, node: <DaggerStamp /> },
];

export default function Altar() {
  const stage = useRef<HTMLDivElement>(null);
  const [blink, setBlink] = useState(false);
  const [look, setLook] = useState<[number, number]>([0, 0]);
  const [gaze, setGaze] = useState(0);
  const [drips, setDrips] = useState<Drip[]>([]);
  const [lit, setLit] = useState(true);
  const [moved, setMoved] = useState<Record<string, [number, number]>>({});
  const [top, setTop] = useState<string>('');
  const drag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number; dist: number } | null>(null);
  const wasDrag = useRef(false);

  // parallax + mirada del ojo
  useEffect(() => {
    const el = stage.current!;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--px', nx.toFixed(3));
        el.style.setProperty('--py', ny.toFixed(3));
        const eye = el.querySelector('.tracking-eye')?.getBoundingClientRect();
        if (eye) {
          const dx = e.clientX - (eye.left + eye.width / 2);
          const dy = e.clientY - (eye.top + eye.height * 0.42);
          const a = Math.atan2(dy, dx);
          const m = Math.min(1, Math.hypot(dx, dy) / 320);
          setLook([Math.cos(a) * m, Math.sin(a) * m]);
        }
      });
    };
    addEventListener('pointermove', onMove);
    return () => removeEventListener('pointermove', onMove);
  }, []);

  // gotas extra que cuelgan de los huecos entre letras, calculadas con el layout real (y al redimensionar)
  useEffect(() => {
    const place = () => {
      const blood = document.querySelector('.blood') as HTMLElement | null;
      if (!blood) return;
      const s = blood.offsetHeight / 260; // escala de la tira (1 en escritorio, menos en móvil)
      const out: Drip[] = [];
      let n = 0;
      for (const g of measureGaps()) {
        if (g.cy > blood.offsetHeight * 0.5) continue; // la gota no llegaría a esa fila
        const pool = DRIPS.filter(([, w]) => w * s <= g.gw);
        if (!pool.length) continue;
        const [bx, w, h] = pool[n++ % pool.length];
        out.push({ x: g.cx - (w * s) / 2, y: 0, w: w * s, h: h * s, bx });
      }
      setDrips(out);
    };
    place();
    document.fonts?.ready.then(place);
    addEventListener('resize', place);
    return () => removeEventListener('resize', place);
  }, []);

  const down = (id: string) => (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const [ox, oy] = moved[id] ?? [0, 0];
    drag.current = { id, sx: e.clientX, sy: e.clientY, ox, oy, dist: 0 };
    wasDrag.current = false;
    setTop(id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    d.dist = Math.max(d.dist, Math.hypot(dx, dy));
    if (d.dist > 6) {
      wasDrag.current = true;
      setMoved((m) => ({ ...m, [d.id]: [d.ox + dx, d.oy + dy] }));
    }
  };
  const up = (e: React.PointerEvent) => {
    if (drag.current) (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    drag.current = null;
  };
  const click = (t: Thing) => (e: React.MouseEvent) => {
    if (wasDrag.current) { e.preventDefault(); wasDrag.current = false; return; }
    if (t.id === 'candle') setLit((l) => !l);
    if (t.id === 'key') e.currentTarget.classList.toggle('turned');
  };

  return (
    <>
      {/* la sangre va fuera del altar para anclarse al borde superior de la pagina */}
      <div className="blood" aria-hidden="true">
        {drips.map((d, i) => (
          <span key={i} className="drip" style={{ left: d.x, width: d.w, height: d.h, ['--bx' as string]: d.bx }} />
        ))}
      </div>
      <div ref={stage} className={`altar ${lit ? '' : 'dark'}`}>
      <div className="light" aria-hidden="true" />
      <span className="bat-flight" aria-hidden="true"><Dual file="bat.webp" className="bat-img" lazy={false} /></span>

      <header className="crest">
        <button
          className="eye-btn"
          onClick={() => { setBlink(true); setTimeout(() => { setGaze((g) => (g + 1) % GAZES.length); setBlink(false); }, 180); }}
          aria-label="Elvira, Mistress of the Dark: click to change her gaze"
        >
          <span className="tracking-eye eye">
            <span className={`portrait ${blink ? 'blink' : ''}`}>
              <Dual file={`${GAZES[gaze].file}.webp`} className="face" lazy={false} alt="Elvira, Mistress of the Dark" />
              {GAZES[gaze].eyes.map(([x, y, tilt], i) => (
                <span key={i} className="iris-clip" style={{ clipPath: eyeClip(x, y, GAZES[gaze].rx, GAZES[gaze].ry, tilt) }}>
                  <Dual
                    file={i ? 'elvira-iris-r.webp' : 'elvira-iris-l.webp'}
                    className="iris"
                    lazy={false}
                    style={{
                      left: `${x}%`, top: `${y}%`, width: `${GAZES[gaze].iris}%`,
                      transform: `translate(calc(-50% + ${look[0] * 34}%), calc(-50% + ${look[1] * 8}%))`,
                    }}
                  />
                </span>
              ))}
            </span>
            <Dual file="frame.webp" className="frame-img" lazy={false} />
          </span>
        </button>
        <h1>Arcana Sacra</h1>
        <p className="tagline">tattoo, drawing &amp; code</p>
        <span className="rule" aria-hidden="true" />
        <p className="whisper caps">move the objects · some open doors · her gaze changes if you touch it</p>
      </header>

      {THINGS.map((t) => {
        const off = moved[t.id] ?? [0, 0];
        const style = {
          ['--dx' as string]: `${off[0]}px`,
          ['--dy' as string]: `${off[1]}px`,
          ['--depth' as string]: t.depth,
          ['--rot' as string]: `${t.rot}deg`,
          zIndex: top === t.id ? 8 : undefined,
        };
        const inner = (
          <>
            <span className="lift">{t.node}</span>
            {t.label && (
              <span className="tag" aria-hidden="true">
                {t.label}
                <small>{t.hint}</small>
              </span>
            )}
          </>
        );
        const common = {
          className: `obj obj-${t.id}${t.href ? ' portal' : ''}`,
          style,
          onPointerDown: down(t.id),
          onPointerMove: move,
          onPointerUp: up,
          onClick: click(t),
          draggable: false,
        };
        return t.href ? (
          <a key={t.id} href={t.href} aria-label={`${t.label}: ${t.hint}`} {...common}>{inner}</a>
        ) : (
          <button key={t.id} type="button" aria-label={t.id === 'candle' ? (lit ? 'Blow out the candles' : 'Light the candles') : t.id === 'key' ? 'Turn the key' : `Move the ${t.id}`} {...common}>{inner}</button>
        );
      })}
    </div>
    </>
  );
}
