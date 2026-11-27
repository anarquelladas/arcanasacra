// Imagen de sello (tinta maciza, en /public/objetos) con un brillo que la recorre al pasar.
import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import Smoke from './Smoke';

export type StampName =
  | 'moth' | 'moth-pepper' | 'deathshead' | 'tarot' | 'mirror' | 'key' | 'candle' | 'candelabrum' | 'dagger'
  | 'inkwell' | 'eye' | 'ball' | 'poison' | 'bat' | 'batface' | 'skeleton' | 'elvira' | 'tarot-priestess' | 'tarot-empress' | 'dagger-h' | 'key-a' | 'key-b' | 'key-ring' | 'grimoire' | 'ball-3' | 'ball-4';

/** La misma imagen en dos tintas: hueso para el modo oscuro y tinta negra para el claro. */
export function Dual({ file, className = '', style, alt = '', lazy = true }: { file: string; className?: string; style?: CSSProperties; alt?: string; lazy?: boolean }) {
  const l = lazy ? 'lazy' : 'eager';
  return (
    <>
      <img className={`${className} v-dark`} src={`/objetos/${file}`} alt={alt} style={style} draggable={false} loading={l} decoding="async" />
      <img className={`${className} v-light`} src={`/objetos/ink/${file}`} alt={alt} style={style} draggable={false} loading={l} decoding="async" aria-hidden={alt ? undefined : true} />
    </>
  );
}

export function Stamp({ name, className = '', alt = '', style }: { name: StampName; className?: string; alt?: string; style?: CSSProperties }) {
  const src = `/objetos/${name}.webp`;
  return (
    <span className={`stamp stamp-${name} ${className}`} style={{ ...style, ['--src' as string]: `url(${src})` }}>
      <Dual file={`${name}.webp`} alt={alt} />
      <span className="shine" aria-hidden="true" />
    </span>
  );
}

/** Polilla en dos mitades para que aletee en 3D. */
export function MothStamp({ className = '', file = 'moth.webp' }: { className?: string; file?: string }) {
  return (
    <span className={`stamp moth-fly ${className}`} style={{ ['--src' as string]: `url(/objetos/${file})` }}>
      <Dual file={file} className="wing-img l" />
      <Dual file={file} className="wing-img r" />
      <span className="shine" aria-hidden="true" />
    </span>
  );
}

/** Palmatoria (antes vela con llama; ahora solo la imagen). */
export function CandleStamp({ className = '' }: { className?: string }) {
  return <Stamp name="candle" className={className} />;
}

/** Candelabro de sello con llamas en sus copas (posiciones medidas sobre la imagen). Con `smoke`, saca humo que reacciona al arrastre. */
export const CUPS: ReadonlyArray<readonly [number, number]> = [[10.1, 14.7], [31.7, 13.7], [49.3, 0.4], [67.3, 15.1], [91.2, 15.4]];
export function CandelabrumStamp({ className = '', lit = true, smoke }: { className?: string; lit?: boolean; smoke?: RefObject<[number, number]> }) {
  return (
    <span className={`candelabrum ${lit ? "lit" : ""} ${className}`}>
      <Stamp name="candelabrum" />
      {CUPS.map(([x, y], i) => (
        <span key={i} className="flame-dot" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * -0.37}s` }} aria-hidden="true" />
      ))}
      {smoke && lit && <Smoke cups={CUPS} offset={smoke} />}
    </span>
  );
}

/** Daga de la que cae una gota de sangre al pasar el cursor. */
export function DaggerStamp({ className = '' }: { className?: string }) {
  return (
    <span className={`dagger ${className}`}>
      <Stamp name="dagger" />
      <img className="drop" src="/objetos/blood-drop.webp" alt="" draggable={false} />
    </span>
  );
}

/** Daga horizontal de la portada: de la punta cae despacio una gota de sangre. */
export function DaggerHStamp({ className = '' }: { className?: string }) {
  return (
    <span className={`dagger dagger-h ${className}`}>
      <Stamp name="dagger-h" />
      <img className="drop" src="/objetos/blood-drop.webp" alt="" draggable={false} />
    </span>
  );
}

/** Llavero: dos llaves cuelgan de una argolla y se balancean desde ella al pasar el cursor. */
export function KeysStamp({ className = '' }: { className?: string }) {
  return (
    <span className={`keys ${className}`}>
      <Stamp name="key-a" className="k k-a" />
      <Stamp name="key-b" className="k k-b" />
      <Stamp name="key-ring" className="k k-ring" />
    </span>
  );
}

const WORDS = ['arcana', 'sacra', 'luna', 'nox', 'umbra', 'sanguis', 'herba', 'stella', 'corvus', 'velum', 'ignis', 'mors', 'aqua', 'ossa', 'anima', 'sigil', 'nigra', 'rosa', 'cinis', 'somnus'];

/** Garabato de escritura a mano: lineas de texto cursivo (Ballet) dibujadas en un canvas y usadas como mascara. No se lee nada. */
function makeScribble(): string | null {
  const cv = document.createElement('canvas');
  cv.width = 420; cv.height = 560;
  const g = cv.getContext('2d');
  if (!g) return null;
  g.fillStyle = '#000'; g.textBaseline = 'alphabetic';
  let y = 34;
  while (y < cv.height - 16) {
    const size = 24 + Math.random() * 7;
    g.font = `${size}px Ballet, cursive`;
    let line = '';
    const max = 330 - Math.random() * 90;
    while (g.measureText(line).width < max) line += WORDS[Math.floor(Math.random() * WORDS.length)] + ' ';
    g.save();
    g.translate(18 + Math.random() * 14, y); g.rotate((Math.random() - 0.5) * 0.025);
    g.globalAlpha = 0.72 + Math.random() * 0.28;
    g.fillText(line, 0, 0);
    g.restore();
    y += 30 + Math.random() * 5;
    if (Math.random() < 0.09) y += 22; // pausa entre parrafos
  }
  return cv.toDataURL('image/png');
}

/** Hoja del grimorio: una pieza con anverso y reverso; al girar se inclina un poco para parecer curvada. */
function Leaf({ n }: { n: number }) {
  return <span className={`g-leaf l${n}`}><span className="g-side g-f" /><span className="g-side g-b" /></span>;
}

/** Grimorio: al pasar se abre la tapa y se van pasando las hojas, curvandose. Puerta a About. */
export function GrimoireStamp({ className = '' }: { className?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let alive = true;
    const paint = () => { const url = alive ? makeScribble() : null; if (url) el.current?.style.setProperty('--scribble', `url(${url})`); };
    if (document.fonts?.load) document.fonts.load('26px Ballet').then(paint, paint); else paint();
    return () => { alive = false; };
  }, []);
  return (
    <span ref={el} className={`grimoire ${className}`}>
      <span className="g-block" />
      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <Leaf key={n} n={n} />)}
      <span className="g-cover">
        <Stamp name="grimoire" className="g-front" />
        <span className="g-inside" />
      </span>
    </span>
  );
}

/** PRUEBA: bola de cristal candidata. Por defecto la 3; con ?ball=4 en la URL se ve la 4. */
export function BallChoice({ className = '' }: { className?: string }) {
  const [v, setV] = useState<'ball-3' | 'ball-4'>('ball-3');
  useEffect(() => {
    try { if (new URLSearchParams(location.search).get('ball') === '4') setV('ball-4'); } catch { /* sin URL */ }
  }, []);
  return <Stamp name={v} className={className} />;
}

/** PRUEBA: polilla candidata. Por defecto la actual; ?moth=b (Brahmaea) o ?moth=s (Saturnia pyri) en la URL para compararlas. */
export function MothChoice({ className = '' }: { className?: string }) {
  const [f, setF] = useState('moth.webp');
  useEffect(() => {
    try {
      const v = new URLSearchParams(location.search).get('moth');
      if (v === 'b') setF('moth-brahmaea.webp'); else if (v === 's') setF('moth-saturnia.webp');
    } catch { /* sin URL */ }
  }, []);
  return <MothStamp className={className} file={f} />;
}

/** La carta de la portada: al pasar, detras salen en abanico La Sacerdotisa y La Emperatriz. */
export function DeckStamp() {
  return (
    <span className="deck-fan">
      <Stamp name="tarot-priestess" className="fan-card fan-l" />
      <Stamp name="tarot-empress" className="fan-card fan-r" />
      <Stamp name="tarot" className="fan-main" />
    </span>
  );
}
