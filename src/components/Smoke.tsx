import { useEffect, useRef, type RefObject } from 'react';

// Humo del candelabro: bocanadas difusas que nacen en cada llama, suben ondulando, se ensanchan
// y se desvanecen. Estan fijas en el mundo: al arrastrar el candelabro se quedan atras (inercia)
// y el viento lento las mece. Pinta con --ink: hueso de noche, tinta de dia.

// El canvas es mas grande que el candelabro (ver .smoke en global.css): margen a izquierda/derecha y por encima.
const SPAN_X = 4, PAD_X = 1.5, SPAN_Y = 2.3, PAD_Y = 1.3;
const RATE = 7;      // bocanadas por segundo y llama
const LIFE = 4.2;    // segundos de vida
const MAX = 260;

interface Puff { x: number; y: number; r: number; age: number; seed: number; vx: number }

/** Posiciones de las copas (% del candelabro) donde nace el humo. */
export default function Smoke({ cups, offset }: { cups: readonly (readonly [number, number])[]; offset: RefObject<[number, number]> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const g = cv.getContext('2d')!;
    let raf = 0, last = performance.now(), time = 0, W = 0, H = 0, dpr = 1;
    let ink = '233,223,200', lastInk = 0;
    let prev: [number, number] = [...(offset.current ?? [0, 0])] as [number, number];
    let visible = true, tabVisible = !document.hidden;
    const puffs: Puff[] = [];
    const acc = cups.map(() => 0);

    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(cv);
    const onVis = () => { tabVisible = !document.hidden; last = performance.now(); };
    document.addEventListener('visibilitychange', onVis);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || !tabVisible) { last = now; return; }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now; time += dt;

      if (now - lastInk > 1000) { // color de tinta del tema actual
        lastInk = now;
        const v = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim();
        const m = /^#([0-9a-f]{6})$/i.exec(v);
        if (m) ink = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).join(',');
      }

      const cur = offset.current ?? [0, 0];
      const ddx = cur[0] - prev[0], ddy = cur[1] - prev[1];
      prev = [cur[0], cur[1]];
      const w = W / SPAN_X, h = H / SPAN_Y;
      // viento lento y variable (suma de dos senos con periodos que no encajan)
      const wind = Math.sin(time * 0.45) * 0.6 + Math.sin(time * 0.97 + 1.3) * 0.4;

      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);

      // nacen bocanadas nuevas en cada copa
      cups.forEach(([cx, cy], ti) => {
        acc[ti] += dt * RATE;
        while (acc[ti] >= 1 && puffs.length < MAX) {
          acc[ti] -= 1;
          puffs.push({
            x: w * PAD_X + (cx / 100) * w + (Math.random() - 0.5) * w * 0.02,
            y: h * PAD_Y + (cy / 100) * h - w * 0.07,
            r: w * (0.035 + Math.random() * 0.02), age: 0, seed: Math.random() * 6.28, vx: (Math.random() - 0.5) * w * 0.05,
          });
        }
        if (acc[ti] > 1) acc[ti] = 0;
      });

      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.age += dt;
        const u = p.age / LIFE;
        if (u >= 1) { puffs.splice(i, 1); continue; }
        // inercia: la bocanada se queda en el mundo cuando se mueve el candelabro
        p.x -= ddx * 0.85; p.y -= ddy * 0.85;
        p.y -= h * (0.16 + 0.1 * u) * dt;
        p.x += (p.vx + Math.sin(time * 0.9 + p.seed) * w * 0.035 + wind * w * 0.12 * u) * dt;
        const rad = p.r * (1 + u * 4.2);
        const a = 0.2 * Math.pow(1 - u, 1.6) * Math.min(1, p.age / 0.35);
        const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, rad);
        gr.addColorStop(0, `rgba(${ink},${a})`);
        gr.addColorStop(0.55, `rgba(${ink},${a * 0.45})`);
        gr.addColorStop(1, `rgba(${ink},0)`);
        g.fillStyle = gr;
        g.beginPath(); g.arc(p.x, p.y, rad, 0, 6.2832); g.fill();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [cups, offset]);

  return <canvas ref={ref} className="smoke" aria-hidden="true" />;
}
