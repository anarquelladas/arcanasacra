import { useEffect, useRef, type RefObject } from 'react';

// Humo del candelabro: partículas en un canvas. Al arrastrar el objeto, las partículas
// se quedan atrás (inercia) y el humo ondea en sentido contrario al movimiento.
// Pinta con la variable --ink, así sirve para noche (hueso) y día (tinta).

interface P { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; wob: number }

// El canvas es mas grande que el candelabro (ver .smoke en global.css): margen a izquierda/derecha y por encima.
const SPAN_X = 4, PAD_X = 1.5, SPAN_Y = 2.3, PAD_Y = 1.3;

/** Posiciones de las copas (% del candelabro) donde nace el humo. */
export default function Smoke({ cups, offset }: { cups: readonly (readonly [number, number])[]; offset: RefObject<[number, number]> }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const g = cv.getContext('2d')!;
    let raf = 0, last = performance.now(), W = 0, H = 0, dpr = 1;
    let ink = '233,223,200', lastInk = 0;
    const ps: P[] = [];
    let prev: [number, number] = [...(offset.current ?? [0, 0])] as [number, number];
    let visible = true;

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

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) { last = now; return; }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

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

      // nace un hilo de humo en cada copa
      if (ps.length < 90 && Math.random() < dt * 14) {
        const [cx, cy] = cups[Math.floor(Math.random() * cups.length)];
        ps.push({
          x: w * PAD_X + (cx / 100) * w, y: h * PAD_Y + (cy / 100) * h - w * 0.07,
          vx: (Math.random() - 0.5) * 3, vy: -(18 + Math.random() * 12),
          age: 0, life: 2.6 + Math.random() * 1.6, size: w * (0.022 + Math.random() * 0.02), wob: Math.random() * 6.28,
        });
      }

      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.age += dt;
        const t = p.age / p.life;
        if (t >= 1) { ps.splice(i, 1); continue; }
        // el humo se queda en el "mundo": cuanto mas viejo, menos sigue al candelabro
        const stay = Math.min(1, 0.3 + t * 1.1);
        p.x -= ddx * stay; p.y -= ddy * stay;
        p.vx += Math.sin(p.age * 2.2 + p.wob) * 9 * dt;   // ondea
        p.x += p.vx * dt; p.y += p.vy * dt;
        const r = p.size * (1 + t * 3.2);
        const a = Math.sin(Math.PI * Math.min(1, t * 1.15)) * 0.42;
        const grad = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grad.addColorStop(0, `rgba(${ink},${a})`);
        grad.addColorStop(1, `rgba(${ink},0)`);
        g.fillStyle = grad;
        g.beginPath(); g.arc(p.x, p.y, r, 0, 6.2832); g.fill();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [cups, offset]);

  return <canvas ref={ref} className="smoke" aria-hidden="true" />;
}
