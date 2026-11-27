import { useEffect, useRef, useState, type ReactNode } from 'react';
import { playSound } from '../lib/sound';
import Blood from './Blood';
import { CandelabrumStamp, BallChoice, DaggerHStamp, DeckStamp, Dual, GrimoireStamp, KeysStamp, MothStamp, Stamp } from './Stamp';
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
// tilt: inclinación (grados) del ojo, usada para colocar el iris. El recorte sale de public/objetos/<file>-eyes.webp
// (scripts/eye-masks.mjs): el hueco real del ojo, así el iris queda siempre bajo los párpados.
interface Gaze { file: string; eyes: readonly (readonly [number, number, number])[]; iris: number }
// Retratos elegidos por Ann (el 1 y el 2); al pulsar alternan.
const GAZES: readonly Gaze[] = [
  { file: 'elvira-a', eyes: [[26.18, 38.13, 10], [73.82, 37.95, -10]], iris: 11.4 },
  { file: 'elvira-c', eyes: [[40.07, 35.73, 0], [60.0, 36.29, 0]], iris: 4.6 },
];

// Recorrido del iris (% de su ancho).
const TRAVEL = 34;

const THINGS: Thing[] = [
  { id: 'moth', href: '/art/', label: 'Art', hint: 'tattoos & drawings', depth: 8, rot: -6, node: <MothStamp /> },
  { id: 'deck', href: '/code/', label: 'Code', hint: 'projects & agents', depth: 6, rot: 5, node: <DeckStamp /> },
  // Guardado sin usar: { id: 'mirror', href: '/about/', label: 'About', hint: 'who is behind it', depth: 5, rot: -8, node: <Stamp name="mirror" /> },
  // PRUEBA: bolas candidatas 3 y 4 (la 4 con ?ball=4). La bola original (Stamp name="ball") queda guardada sin usar.
  { id: 'ball', href: '/contact/', label: 'Contact', hint: 'ask the crystal ball', depth: 7, rot: 2, node: <BallChoice /> },
  { id: 'candle', depth: 3, rot: 0, node: null }, // el candelabro se pinta aparte: depende del estado de la luz
  { id: 'book', href: '/about/', label: 'About', hint: 'who is behind it', depth: 5, rot: -4, node: <GrimoireStamp /> },
  { id: 'dagger', depth: 12, rot: -5, node: <DaggerHStamp /> },
  { id: 'key', href: '/contact/', label: 'Contact', hint: 'send me a letter', depth: 9, rot: -8, node: <KeysStamp /> }, // provisional: el reparto de objetos y enlaces se decidira despues
];

/** Un retrato con sus iris que siguen al cursor. El nuevo entra fundiendose sobre el anterior (ghost). */
function Portrait({ g, look, ghost = false }: { g: Gaze; look: [number, number]; ghost?: boolean }) {
  return (
    <span className={`portrait${ghost ? ' ghost' : ''}`} aria-hidden={ghost ? true : undefined}>
      <Dual file={`${g.file}.webp`} className="face" lazy={false} alt={ghost ? '' : 'Elvira, Mistress of the Dark'} />
      {g.eyes.map(([x, y], i) => (
        <span key={i} className="iris-clip" style={{ ['--eye-mask' as string]: `url(/objetos/${g.file}-eyes.webp)` }}>
          <Dual
            file={i ? 'elvira-iris-r.webp' : 'elvira-iris-l.webp'}
            className="iris"
            lazy={false}
            style={{
              left: `${x}%`, top: `${y}%`, width: `${g.iris}%`,
              transform: `translate(calc(-50% + ${look[0] * TRAVEL}%), calc(-50% + ${look[1] * 8}%))`,
            }}
          />
        </span>
      ))}
      {!ghost && <span className="shine" aria-hidden="true" style={{ ['--src' as string]: `url(/objetos/${g.file}.webp)` }} />}
    </span>
  );
}

type Theme = 'dark' | 'light';
const currentTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

export default function Altar() {
  const stage = useRef<HTMLDivElement>(null);
  const [prev, setPrev] = useState<number | null>(null); // retrato anterior: se funde mientras entra el nuevo
  const fuse = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [look, setLook] = useState<[number, number]>([0, 0]);
  const [gaze, setGaze] = useState(0);
  // en cada carga aparece uno de los retratos al azar (se elige en el cliente para no romper la hidratacion)
  useEffect(() => { setGaze(Math.floor(Math.random() * GAZES.length)); }, []);
  // intro: la mesa empieza a oscuras hasta que se enciende el candelabro (el atributo data-intro lo pone el script del <head>)
  const [intro, setIntro] = useState(false);
  const [hint, setHint] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');
  // llamas: encendido = modo dia; la excepcion es el instante de la intro, que prende la llama sin cambiar de tema
  const [flames, setFlames] = useState(false);
  const [moved, setMoved] = useState<Record<string, [number, number]>>({});
  const [top, setTop] = useState<string>('');
  const g = GAZES[gaze];
  const drag = useRef<{ id: string; sx: number; sy: number; ox: number; oy: number; dist: number } | null>(null);
  const wasDrag = useRef(false);
  const candleOff = useRef<[number, number]>([0, 0]); // posicion del candelabro, la lee el humo
  candleOff.current = moved.candle ?? [0, 0];

  // estado inicial de intro y tema; el tema tambien se vigila porque el boton de la cabecera lo cambia
  useEffect(() => {
    const root = document.documentElement;
    setIntro(root.dataset.intro === 'dark');
    const sync = () => { const t = currentTheme(); setTheme(t); setFlames(t === 'light'); };
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  // pista sutil si tras unos segundos nadie ha encontrado el candelabro
  useEffect(() => {
    if (!intro) { setHint(false); return; }
    const id = setTimeout(() => setHint(true), 6000);
    return () => clearTimeout(id);
  }, [intro]);

  /** La primera vez que se enciende: se revela la mesa y se recuerda durante la sesion. */
  const ignite = () => {
    delete document.documentElement.dataset.intro;
    try { sessionStorage.setItem('as-lit', '1'); } catch { /* sin almacenamiento: la intro se repetira */ }
    setIntro(false);
    setFlames(true);
    playSound('flame-on');
  };

  /** Despues de la intro el candelabro es el interruptor de tema: encendido = dia, apagado = noche. */
  const toggleTheme = () => {
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('as-theme', next); } catch { /* el tema vale solo para esta visita */ }
    playSound(next === 'light' ? 'flame-on' : 'flame-off');
  };

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


  const down = (id: string) => (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    const [ox, oy] = moved[id] ?? [0, 0];
    drag.current = { id, sx: e.clientX, sy: e.clientY, ox, oy, dist: 0 };
    wasDrag.current = false;
    setTop(id);
    playSound('pick');
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
    const d = drag.current;
    if (d) (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    drag.current = null;
    if (d && d.dist > 6) {
      // arrastrar el candelabro a oscuras tambien lo enciende (el clic posterior se ignora por wasDrag)
      if (d.id === 'candle' && intro) ignite(); else playSound('drop');
    }
  };
  const click = (t: Thing) => (e: React.MouseEvent) => {
    if (wasDrag.current) { e.preventDefault(); wasDrag.current = false; return; }
    // en tactil no hay hover: el primer toque abre el abanico de la carta, el segundo entra en Code
    if ((t.id === 'deck' || t.id === 'book') && matchMedia('(hover: none)').matches && !e.currentTarget.classList.contains('fanned')) {
      e.preventDefault();
      const el = e.currentTarget;
      el.classList.add('fanned');
      playSound('card-flip');
      setTimeout(() => el.classList.remove('fanned'), 5000);
      return;
    }
    if (t.id === 'candle') { if (intro) ignite(); else toggleTheme(); }
    if (t.id === 'key') e.currentTarget.classList.toggle('turned');
  };

  return (
    <>
      <Blood />
      <div ref={stage} className="altar">
      <div className="light" aria-hidden="true" />
      <span className="bat-flight" aria-hidden="true"><Dual file="bat.webp" className="bat-img" lazy={false} /></span>

      <header className="crest">
        <button
          className="eye-btn"
          onClick={() => { playSound('eye'); setPrev(gaze); setGaze((gaze + 1) % GAZES.length); clearTimeout(fuse.current); fuse.current = setTimeout(() => setPrev(null), 1900); }}
          aria-label="Elvira, Mistress of the Dark: click to change her gaze"
        >
          <span className="tracking-eye eye">
            {prev !== null && prev !== gaze && <Portrait g={GAZES[prev]} look={look} ghost />}
            <Portrait key={gaze} g={g} look={look} />
            <Dual file="frame.webp" className="frame-img" lazy={false} />
          </span>
        </button>
        <h1>Arcana Sacra</h1>
        <p className="tagline">tattoo, drawing &amp; code</p>
        <span className="rule" aria-hidden="true" />
        <p className="whisper caps">move the objects · some open doors · her gaze changes if you touch it</p>
      </header>

      {intro && hint && <p className="intro-hint caps" role="status">somewhere in the dark, a candelabrum waits</p>}

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
            <span className="lift">{t.id === 'candle' ? <CandelabrumStamp lit={flames} smoke={candleOff} /> : t.node}</span>
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
          onPointerEnter: t.label ? (e: React.PointerEvent) => { if (e.pointerType === 'mouse') playSound('hover'); } : undefined,
          draggable: false,
        };
        return t.href ? (
          <a key={t.id} href={t.href} aria-label={`${t.label}: ${t.hint}`} {...common}>{inner}</a>
        ) : (
          <button key={t.id} type="button" id={t.id === 'candle' ? 'candle' : undefined} aria-label={t.id === 'candle' ? (intro ? 'Light the candelabrum to reveal the table' : 'Candelabrum: light it for day mode, blow it out for night mode') : t.id === 'key' ? 'Move the keys' : `Move the ${t.id}`} aria-pressed={t.id === 'candle' && !intro ? theme === 'light' : undefined} {...common}>{inner}</button>
        );
      })}
    </div>
    </>
  );
}
