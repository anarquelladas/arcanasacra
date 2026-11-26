import { useEffect, useRef, useState, type ReactNode } from 'react';
import { WaxSeal } from './engravings/Objects';
import { playSound } from '../lib/sound';
import './letter.css';
import './about-letter.css';

// Carta de presentacion de About: sobre lacrado. Al romper el lacre se abre la solapa, la hoja asoma
// y la carta completa (children) se despliega sobre el sobre. El texto siempre esta en el HTML (SEO);
// mientras esta cerrada va con `inert` para que el teclado no entre en ella.

type Phase = 'closed' | 'opening' | 'open';

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function AboutLetter({ children, greeting }: { children: ReactNode; greeting: string }) {
  const [phase, setPhase] = useState<Phase>('closed');
  const sheet = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)); };

  const openLetter = () => {
    if (phase !== 'closed') return;
    playSound('seal-break');
    if (reduced()) {
      setPhase('open');
      later(0, () => sheet.current?.focus());
      return;
    }
    setPhase('opening');
    later(150, () => playSound('envelope-open'));
    later(1250, () => playSound('paper'));
    later(1900, () => { setPhase('open'); playSound('unfold'); });
    later(2300, () => sheet.current?.focus({ preventScroll: true }));
  };

  const fold = () => {
    timers.current.forEach(clearTimeout);
    playSound('paper');
    setPhase('closed');
  };

  const isOpen = phase !== 'closed';
  return (
    <div className={`about-env ph-${phase}`}>
      <div className="sheet-wrap">
        <div className="sheet" ref={sheet} tabIndex={-1} inert={phase !== 'open'}>
          {children}
          <button className="fold" onClick={fold} aria-label="Fold the letter back into its envelope">fold it away</button>
        </div>
      </div>

      <div className={`post ${isOpen ? 'open' : ''}`}>
        <p className="hint" aria-hidden={isOpen}>break the seal</p>
        <div className="env">
          <div className="env-back" />
          <div className="letter" aria-hidden="true"><p className="dear">{greeting}</p></div>
          <svg className="env-front" viewBox="0 0 260 170" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,0L130,100 260,0V170H0Z" fill="url(#paper)" stroke="var(--ink-dark)" strokeWidth=".8" />
            <path d="M0,170L112,92M260,170L148,92" stroke="var(--ink-dark)" strokeWidth=".8" fill="none" />
            <path d="M0,170L112,92 148,92 260,170Z" fill="url(#h-k)" opacity=".15" />
          </svg>
          <svg className="env-flap" viewBox="0 0 260 120" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,0L130,112 260,0Z" fill="url(#paper)" stroke="var(--ink-dark)" strokeWidth=".8" />
            <path d="M0,0L130,112 260,0 248,0 130,102 12,0Z" fill="url(#hh-k)" opacity=".18" />
          </svg>
          <button className="seal-btn" onClick={openLetter} disabled={isOpen} aria-label="Break the seal and open the letter">
            <svg className="half l" viewBox="0 0 60 60"><WaxSeal cx={30} cy={30} r={26} /></svg>
            <svg className="half r" viewBox="0 0 60 60"><WaxSeal cx={30} cy={30} r={26} /></svg>
          </button>
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{phase === 'open' ? 'The letter is open.' : phase === 'closed' ? '' : 'Opening the letter.'}</p>
    </div>
  );
}
