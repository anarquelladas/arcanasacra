import { useMemo, useRef, useState, type ReactNode } from 'react';
import type { Repo } from '../lib/github';
import { Dual, MothStamp, Stamp } from './Stamp';
import './tarot.css';

// Cada proyecto es un arcano boca abajo: se inclina con el cursor y al pulsarlo se revela.

const ROMAN = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];

function emblem(lang: string | null): ReactNode {
  switch ((lang ?? '').toLowerCase()) {
    case 'typescript':
    case 'javascript':
      return <Stamp name="key" className="emb emb-tall" />;
    case 'python':
    case 'jupyter notebook':
      return <Stamp name="ball" className="emb emb-tall2" />;
    case 'php':
    case 'blade':
      return <Stamp name="poison" className="emb emb-tall" />;
    case 'html':
    case 'css':
    case 'vue':
    case 'astro':
      return <MothStamp className="emb emb-wide" />;
    default:
      return <Stamp name="dagger" className="emb emb-tall" />;
  }
}

const pretty = (s: string) => s.replace(/[-_]+/g, ' ');

function Card({ repo, index, open, onToggle }: { repo: Repo; index: number; open: boolean; onToggle: () => void }) {
  const el = useRef<HTMLDivElement>(null);
  const tilt = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const r = el.current!.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.current!.style.setProperty('--tx', `${(-y * 14).toFixed(2)}deg`);
    el.current!.style.setProperty('--ty', `${(x * 16).toFixed(2)}deg`);
    el.current!.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
    el.current!.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const reset = () => {
    el.current?.style.setProperty('--tx', '0deg');
    el.current?.style.setProperty('--ty', '0deg');
  };
  const numeral = ROMAN[(index + 1) % ROMAN.length];
  return (
    <div
      ref={el}
      className={`arcano ${open ? 'open' : ''}`}
      style={{ ['--i' as string]: index }}
      onPointerMove={tilt}
      onPointerLeave={reset}
    >
      <div className="spin">
        <button className="side back" onClick={onToggle} aria-expanded={open} aria-label={`Reveal ${pretty(repo.name)}`}>
          <span className="back-frame" aria-hidden="true"><Dual file="moth.webp" className="back-art" /></span>
          <span className="numeral">{numeral}</span>
          <span className="glint" aria-hidden="true" />
        </button>
        <article className="side face" aria-hidden={!open}>
          <header>
            <span className="caps num">{numeral}</span>
          </header>
          <div className="cameo">{emblem(repo.language)}</div>
          <h3 className="caps">{pretty(repo.name)}</h3>
          <p className="desc">{repo.description || 'No description yet.'}</p>
          <p className="meta">
            {repo.language && <span>{repo.language}</span>}
            {repo.topics.slice(0, 3).map((t) => <span key={t}>{t}</span>)}
            {repo.stars > 0 && <span>★ {repo.stars}</span>}
          </p>
          <footer>
            <a href={repo.url} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>code ↗</a>
            {repo.homepage && <a href={repo.homepage} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>demo ↗</a>}
            <button className="turn" onClick={onToggle} tabIndex={open ? 0 : -1} aria-label="Turn face down">⟲</button>
          </footer>
          {repo.sample && <span className="sample">sample</span>}
        </article>
      </div>
    </div>
  );
}

export default function TarotSpread({ repos, sample }: { repos: Repo[]; sample: boolean }) {
  const [order, setOrder] = useState(() => repos.map((_, i) => i));
  const [open, setOpen] = useState<Set<number>>(new Set());
  const [lang, setLang] = useState<string>('');
  const [shuffling, setShuffling] = useState(false);

  const langs = useMemo(() => [...new Set(repos.map((r) => r.language).filter(Boolean))] as string[], [repos]);
  const shown = order.filter((i) => !lang || repos[i].language === lang);

  const toggle = (i: number) =>
    setOpen((s) => {
      const n = new Set(s);
      n.has(i) ? n.delete(i) : n.add(i);
      return n;
    });

  const shuffle = () => {
    setShuffling(true);
    setOpen(new Set());
    setTimeout(() => {
      setOrder((o) => {
        const a = [...o];
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
      });
      setShuffling(false);
    }, 550);
  };

  const revealAll = () => setOpen((s) => (s.size === shown.length ? new Set() : new Set(shown)));

  return (
    <section className="tirada">
      <div className="rituals">
        <button className="plaque" onClick={shuffle}>Shuffle</button>
        <button className="plaque" onClick={revealAll}>{open.size === shown.length && shown.length ? 'Hide all' : 'Reveal all'}</button>
        {langs.length > 1 && (
          <div className="langs" role="group" aria-label="Filter by language">
            <button className={!lang ? 'on' : ''} onClick={() => setLang('')}>all</button>
            {langs.map((l) => (
              <button key={l} className={lang === l ? 'on' : ''} onClick={() => setLang(l)}>{l}</button>
            ))}
          </div>
        )}
      </div>
      {sample && (
        <p className="omen">
          These are sample cards. Add the <code>portfolio</code> topic to a GitHub repo and it will
          appear here on the next deploy.
        </p>
      )}
      <div className={`spread ${shuffling ? 'shuffling' : ''}`}>
        {shown.map((i, k) => (
          <Card key={repos[i].name} repo={repos[i]} index={k} open={open.has(i)} onToggle={() => toggle(i)} />
        ))}
      </div>
    </section>
  );
}
