import { useEffect, useRef, type RefObject } from 'react';

// Humo del candelabro: un hilo fino por llama, dibujado en un canvas.
// Cada hilo es una polilinea suavizada que ondula despacio, se mece con un viento lento
// y se adelgaza y desvanece hacia arriba. Al arrastrar el objeto, el hilo se queda atras
// (inercia) y vuelve a erguirse al soltar. Pinta con --ink: hueso de noche, tinta de dia.

// El canvas es mas grande que el candelabro (ver .smoke en global.css): margen a izquierda/derecha y por encima.
const SPAN_X = 4, PAD_X = 1.5, SPAN_Y = 2.3, PAD_Y = 1.3;
const POINTS = 26;          // puntos por hilo
const LENGTH = 0.8;        // largo del hilo (en alturas de candelabro)

/** Hilo de una llama: fase propia y desfase del curvado respecto al resto. */
interface Thread { phase: number; speed: number; amp: number; lx: Float32Array; ly: Float32Array }

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

    const threads: Thread[] = cups.map((_, i) => ({
      phase: i * 1.9 + 0.7, speed: 0.9 + (i % 3) * 0.18, amp: 0.8 + (i % 2) * 0.25,
      lx: new Float32Array(POINTS), ly: new Float32Array(POINTS),
    }));
    const pts = new Float32Array(POINTS * 2);

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
      const seg = (h * LENGTH) / (POINTS - 1);
      // viento lento y variable (suma de dos senos con periodos que no encajan)
      const wind = Math.sin(time * 0.45) * 0.6 + Math.sin(time * 0.97 + 1.3) * 0.4;

      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      g.lineCap = 'round';

      threads.forEach((th, ti) => {
        const [cx, cy] = cups[ti];
        const bx = w * PAD_X + (cx / 100) * w, by = h * PAD_Y + (cy / 100) * h - w * 0.07;
        // inercia: los puntos altos se quedan mas en el "mundo"; un muelle los devuelve a su sitio
        const relax = Math.min(1, dt * 2.4);
        for (let k = 1; k < POINTS; k++) {
          const u = k / (POINTS - 1);
          const stay = 0.25 + 0.75 * u;
          th.lx[k] = (th.lx[k] - ddx * stay) * (1 - relax);
          th.ly[k] = (th.ly[k] - ddy * stay) * (1 - relax);
        }
        // forma del hilo: ondulacion sinusoidal creciente con la altura + viento
        for (let k = 0; k < POINTS; k++) {
          const u = k / (POINTS - 1);
          const sway = Math.sin(time * th.speed - u * 7 + th.phase) * w * 0.1 * th.amp * u;
          const drift = wind * w * 0.22 * u * u;
          pts[k * 2] = bx + sway + drift + th.lx[k];
          pts[k * 2 + 1] = by - k * seg + th.ly[k] * 0.6;
        }
        // trazo por tramos: mas fino y mas tenue hacia arriba, curvas por puntos medios
        for (let k = 0; k < POINTS - 1; k++) {
          const u = k / (POINTS - 1);
          const a = 0.5 * Math.pow(1 - u, 1.4);
          if (a < 0.01) continue;
          g.strokeStyle = `rgba(${ink},${a})`;
          g.lineWidth = 1.8 - 1.1 * u;
          const x0 = k === 0 ? pts[0] : (pts[(k - 1) * 2] + pts[k * 2]) / 2;
          const y0 = k === 0 ? pts[1] : (pts[(k - 1) * 2 + 1] + pts[k * 2 + 1]) / 2;
          const x1 = (pts[k * 2] + pts[(k + 1) * 2]) / 2, y1 = (pts[k * 2 + 1] + pts[(k + 1) * 2 + 1]) / 2;
          g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(pts[k * 2], pts[k * 2 + 1], x1, y1); g.stroke();
        }
      });
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [cups, offset]);

  return <canvas ref={ref} className="smoke" aria-hidden="true" />;
}
