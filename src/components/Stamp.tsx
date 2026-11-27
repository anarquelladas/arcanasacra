// Imagen de sello (tinta maciza, en /public/objetos) con un brillo que la recorre al pasar.
import type { CSSProperties, RefObject } from 'react';
import Smoke from './Smoke';

export type StampName =
  | 'moth' | 'moth-pepper' | 'deathshead' | 'tarot' | 'mirror' | 'key' | 'candle' | 'candelabrum' | 'dagger'
  | 'inkwell' | 'eye' | 'ball' | 'poison' | 'bat' | 'batface' | 'skeleton' | 'elvira' | 'tarot-priestess' | 'tarot-empress';

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
