// Imagen de sello (tinta maciza, en /public/objetos) con un brillo que la recorre al pasar.
import { useEffect, useRef, type CSSProperties, type RefObject } from 'react';
import Smoke from './Smoke';

export type StampName =
  | 'moth' | 'moth-pepper' | 'deathshead' | 'tarot' | 'mirror' | 'key' | 'candle' | 'candelabrum' | 'dagger'
  | 'inkwell' | 'eye' | 'ball' | 'poison' | 'bat' | 'batface' | 'skeleton' | 'elvira' | 'tarot-priestess' | 'tarot-empress' | 'dagger-h' | 'key-a' | 'key-b' | 'key-ring' | 'grimoire';

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
export function MothStamp({ className = '' }: { className?: string }) {
  return (
    <span className={`stamp moth-fly ${className}`} style={{ ['--src' as string]: 'url(/objetos/moth.webp)' }}>
      <Dual file="moth.webp" className="wing-img l" />
      <Dual file="moth.webp" className="wing-img r" />
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

/** Hoja que se curva al pasar: tres tiras encadenadas, cada una gira un poco mas que la anterior. */
function Leaf({ n }: { n: number }) {
  const strip = (i: number): React.ReactNode => (
    <span className={`gs gs${i}`}>
      <span className="g-side g-f" /><span className="g-side g-b" />
      {i < 3 && strip(i + 1)}
    </span>
  );
  return <span className={`g-leaf l${n}`}>{strip(1)}</span>;
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
      <Leaf n={1} /><Leaf n={2} /><Leaf n={3} />
      <span className="g-cover">
        <Stamp name="grimoire" className="g-front" />
        <span className="g-inside" />
      </span>
    </span>
  );
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
