import { useEffect, useRef, useState } from 'react';
import { playSound } from '../lib/sound';
import { Dual } from './Stamp';

// Murcielago posado en el marco de Elvira. Al pulsarlo sale volando (aleteando) fuera de la pantalla y,
// pasado un rato (20-40 s), vuelve volando y se posa otra vez. Con prefers-reduced-motion se queda quieto.

type Phase = 'perch' | 'leaving' | 'away' | 'returning';

export default function BatPerch() {
  const [phase, setPhase] = useState<Phase>('perch');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const fly = () => {
    if (phase !== 'perch' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    playSound('hover');
    setPhase('leaving');
  };
  const done = () => {
    if (phase === 'leaving') {
      setPhase('away');
      timer.current = setTimeout(() => setPhase('returning'), 20000 + Math.random() * 20000);
    } else if (phase === 'returning') setPhase('perch');
  };

  return (
    <span className="bat-spot">
      {phase === 'perch' && (
        <button type="button" className="bat-perch" onClick={fly} aria-label="A bat hangs from the frame: click to send it flying">
          <Dual file="bat-perch.webp" className="bat-perch-img" lazy={false} />
        </button>
      )}
      {(phase === 'leaving' || phase === 'returning') && (
        <span className={`bat-fly ${phase}`} onAnimationEnd={(e) => { if (e.target === e.currentTarget) done(); }} aria-hidden="true">
          <Dual file="bat-fly.webp" className="bat-wings" lazy={false} />
        </span>
      )}
    </span>
  );
}
