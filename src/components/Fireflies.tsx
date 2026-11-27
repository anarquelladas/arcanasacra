import { useEffect, useRef } from 'react';

// Luciernagas: unas pocas vagan por la pagina, parpadean y alumbran un poco a su alrededor.
// Al pulsar cerca de una, sale huyendo. Un canvas fijo y sin eventos sobre el contenido; el clic se
// escucha en la ventana (no impide pulsar enlaces). De dia son motas de tinta sin luz.

interface Fly {
  x: number; y: number; vx: number; vy: number;
  heading: number; turn: number; speed: number;
  phase: number; rate: number;      // parpadeo
  scare: number;                     // >0 mientras huye (segundos)
}

const GLOW = 95;       // radio de la luz (px)
const HIT = 46;        // radio de pulsacion que las asusta (px)

export default function Fireflies() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const g = cv.getContext('2d')!;
    let W = 0, H = 0, dpr = 1, raf = 0, last = performance.now(), time = 0;
    let tabVisible = !document.hidden;
    const n = innerWidth < 700 ? 5 : 9;
    const flies: Fly[] = Array.from({ length: n }, () => ({
      x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: 0, vy: 0,
      heading: Math.random() * 6.28, turn: 0, speed: 18 + Math.random() * 16,
      phase: Math.random() * 6.28, rate: 0.5 + Math.random() * 0.6, scare: 0,
    }));

    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
    };
    size();
    addEventListener('resize', size);
    const onVis = () => { tabVisible = !document.hidden; last = performance.now(); };
    document.addEventListener('visibilitychange', onVis);

    // al pulsar cerca, las luciernagas huyen en sentido contrario
    const onDown = (e: PointerEvent) => {
      for (const f of flies) {
        const dx = f.x - e.clientX, dy = f.y - e.clientY;
        const d = Math.hypot(dx, dy);
        if (d < HIT) {
          const a = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.9;
          f.heading = a; f.scare = 1.6 + Math.random() * 0.8;
        }
      }
    };
    addEventListener('pointerdown', onDown, { passive: true });

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!tabVisible) { last = now; return; }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now; time += dt;
      const dark = document.documentElement.dataset.intro === 'dark'; // en la intro a oscuras brillan mas
      const day = document.documentElement.dataset.theme === 'light' && !dark;

      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      g.globalCompositeOperation = day ? 'source-over' : 'lighter';

      for (const f of flies) {
        // rumbo: deriva suave con giros lentos al azar; al huir va recto y rapido
        f.turn += (Math.random() - 0.5) * 6 * dt;
        f.turn *= Math.max(0, 1 - 1.2 * dt);
        f.heading += f.turn * dt * 2;
        const boost = f.scare > 0 ? 9 : 1;
        if (f.scare > 0) f.scare -= dt;
        const tvx = Math.cos(f.heading) * f.speed * boost;
        const tvy = Math.sin(f.heading) * f.speed * boost * 0.85 - (f.scare > 0 ? 0 : Math.sin(time * 0.6 + f.phase) * 4);
        const k = Math.min(1, dt * (f.scare > 0 ? 9 : 1.6));
        f.vx += (tvx - f.vx) * k; f.vy += (tvy - f.vy) * k;
        f.x += f.vx * dt; f.y += f.vy * dt;
        // al salirse de la pantalla vuelven a entrar por el lado opuesto
        const m = 60;
        if (f.x < -m) f.x = W + m; else if (f.x > W + m) f.x = -m;
        if (f.y < -m) f.y = H + m; else if (f.y > H + m) f.y = -m;

        // parpadeo: encendida un rato, apagandose despacio (mas viva al asustarse)
        const s = Math.sin(time * f.rate * 2 + f.phase);
        const blink = Math.pow(Math.max(0, s * 0.5 + 0.5), 2.2);
        const a = (0.25 + 0.75 * blink) * (dark ? 1 : 0.85);

        if (day) {
          g.fillStyle = `rgba(26,22,17,${0.35 + 0.4 * blink})`;
          g.beginPath(); g.arc(f.x, f.y, 1.6, 0, 6.2832); g.fill();
          continue;
        }
        const r = GLOW * (0.6 + 0.4 * blink);
        const gr = g.createRadialGradient(f.x, f.y, 0, f.x, f.y, r);
        gr.addColorStop(0, `rgba(236,226,190,${0.2 * a})`);
        gr.addColorStop(0.35, `rgba(220,210,170,${0.07 * a})`);
        gr.addColorStop(1, 'rgba(220,210,170,0)');
        g.fillStyle = gr;
        g.beginPath(); g.arc(f.x, f.y, r, 0, 6.2832); g.fill();
        g.fillStyle = `rgba(250,246,226,${0.5 + 0.5 * a})`;
        g.beginPath(); g.arc(f.x, f.y, 1.8, 0, 6.2832); g.fill();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener('resize', size);
      removeEventListener('pointerdown', onDown);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="fireflies" aria-hidden="true" />;
}
