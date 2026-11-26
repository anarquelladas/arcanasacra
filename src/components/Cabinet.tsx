import { useCallback, useEffect, useState, type ReactNode } from 'react';
import type { ArtKind, ArtPiece, Placeholder } from '../data/art';
import { playSound } from '../lib/sound';
import { CandelabrumStamp, DaggerStamp, MothStamp, Stamp } from './Stamp';
import './cabinet.css';

// Gabinete de curiosidades: cada hueco guarda una pieza.
// Los filtros corren una cortina sobre lo que no toca; al pulsar, la pieza se
// abre en un medallón ovalado.

const PH: Record<Placeholder, (c: string) => ReactNode> = {
  moth: (c) => <MothStamp className={c} />,
  pepper: (c) => <Stamp name="moth-pepper" className={c} />,
  deathshead: (c) => <Stamp name="deathshead" className={c} />,
  key: (c) => <Stamp name="key" className={c} />,
  candle: (c) => <Stamp name="candle" className={c} />,
  candelabrum: (c) => <CandelabrumStamp className={c} />,
  mirror: (c) => <Stamp name="mirror" className={c} />,
  eye: (c) => <Stamp name="eye" className={c} />,
  tarot: (c) => <Stamp name="tarot" className={c} />,
  inkwell: (c) => <Stamp name="inkwell" className={c} />,
  dagger: (c) => <DaggerStamp className={c} />,
  ball: (c) => <Stamp name="ball" className={c} />,
  poison: (c) => <Stamp name="poison" className={c} />,
  bat: (c) => <Stamp name="bat" className={c} />,
  batface: (c) => <Stamp name="batface" className={c} />,
  skeleton: (c) => <Stamp name="skeleton" className={c} />,
  elvira: (c) => <Stamp name="elvira" className={c} />,
};

const FILTERS: { id: '' | ArtKind; label: string }[] = [
  { id: '', label: 'All' },
  { id: 'tattoo', label: 'Tattoos' },
  { id: 'drawing', label: 'Drawings' },
  { id: 'flash', label: 'Flash' },
];

function Piece({ p, big = false }: { p: ArtPiece; big?: boolean }) {
  if (p.src) return <img src={p.src} alt={p.title} loading={big ? 'eager' : 'lazy'} className="piece-img" />;
  return <>{PH[p.placeholder ?? 'moth'](`piece-svg ph-${p.placeholder ?? 'moth'}`)}</>;
}

export default function Cabinet({ items }: { items: ArtPiece[] }) {
  const [kind, setKind] = useState<'' | ArtKind>('');
  const [sel, setSel] = useState<number | null>(null);

  const visible = items.map((p, i) => ({ p, i })).filter(({ p }) => !kind || p.kind === kind);
  const closeViewer = useCallback(() => { playSound('pick'); setSel(null); }, []);
  const go = useCallback(
    (dir: number) => {
      if (sel === null) return;
      const idx = visible.findIndex((v) => v.i === sel);
      const n = visible[(idx + dir + visible.length) % visible.length];
      setSel(n.i);
      playSound('turn-page');
    },
    [sel, visible],
  );

  useEffect(() => {
    if (sel === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeViewer();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [sel, go, closeViewer]);

  const cur = sel !== null ? items[sel] : null;

  return (
    <section className="gabinete">
      <div className="drawers" role="group" aria-label="Filter pieces">
        {FILTERS.map((f) => (
          <button key={f.id} className="drawer plaque" onClick={() => { if (kind !== f.id) playSound('tick'); setKind(f.id); }} aria-pressed={kind === f.id}>
            <span className="knob" aria-hidden="true" />
            {f.label}
          </button>
        ))}
      </div>

      <div className="frame">
        <div className="shelves">
          {items.map((p, i) => {
            const hidden = !!kind && p.kind !== kind;
            return (
              <button
                key={i}
                className={`cubby s-${p.size} ${hidden ? 'veiled' : ''}`}
                onClick={() => { if (!hidden) { playSound('drawer'); setSel(i); } }}
                tabIndex={hidden ? -1 : 0}
                aria-hidden={hidden}
                aria-label={`${p.title} (${p.kind})`}
                style={{ ['--d' as string]: `${(i % 5) * 60}ms` }}
              >
                <span className="item"><Piece p={p} /></span>
                <span className="label">{p.title}</span>
                <span className="glass" aria-hidden="true" />
                <span className="curtain" aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>

      {cur && (
        <div className="vitrine" role="dialog" aria-modal="true" aria-label={cur.title} onClick={closeViewer}>
          <figure className="medallion" onClick={(e) => e.stopPropagation()}>
            <div className="oval">
              <Piece p={cur} big />
            </div>
            <figcaption>
              <span className="kind caps">{cur.kind}{cur.year ? ` · ${cur.year}` : ''}</span>
              <strong>{cur.title}</strong>
              {cur.note && <em>{cur.note}</em>}
              {import.meta.env.DEV && !cur.src && <small>Dev only - sample piece: replace it with your image in src/data/art.ts</small>}
            </figcaption>
            <button className="nav prev" onClick={() => go(-1)} aria-label="Previous"><span>← previous</span></button>
            <button className="nav next" onClick={() => go(1)} aria-label="Next"><span>next →</span></button>
            <button className="close caps" onClick={closeViewer}>close</button>
          </figure>
        </div>
      )}
    </section>
  );
}
