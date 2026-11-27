import { useEffect, useRef } from 'react';

// Sangre que gotea desde el borde superior de la pagina, simulada en un canvas (sin imagen).
// Una banda fina y ondulante recorre el borde; de ella cuelgan gotas que van ganando masa, se alargan
// por su propio peso, se estiran en un hilo y se sueltan; el hilo se recoge y deja una semilla que vuelve
// a crecer. Unas cuantas son "corredoras" que resbalan despacio y cuelgan un rato antes de caer.
// La forma se funde con un filtro SVG (efecto "goo") para que banda, hilo y gota sean un solo fluido.
// Con prefers-reduced-motion se pinta un fotograma fijo.

type Phase = 'wait' | 'grow' | 'fall' | 'retract';
interface Drip {
  x: number; phase: Phase; t: number;       // t: temporizador de la fase
  len: number;                              // largo del hilo desde la banda
  r: number; rMax: number;                  // radio de la cabeza
  mass: number; v: number;
  maxLen: number; breakLen: number; creep: number;
  hang: number;                             // segundos que cuelga antes de soltarse
  canFall: boolean;                         // solo unas pocas gotas caen; el resto cuelga sin llegar a soltarse
  w: number;                                // grosor del hilo
}
interface Bead { x: number; y: number; v: number; r: number }

const BAND = (x: number, t: number) => 5 + 2.6 * Math.sin(x * 0.011 + t * 0.15) + 1.8 * Math.sin(x * 0.037 + 1.3 - t * 0.1);
const rand = (a: number, b: number) => a + Math.random() * (b - a);

const lenFor = (canFall: boolean) => (canFall ? (Math.random() < 0.45 ? rand(60, 200) : rand(16, 46)) : rand(12, 58));

function makeDrip(x: number, delay: number, canFall: boolean): Drip {
  return {
    x, phase: 'wait', t: -delay, len: 0, r: 2, rMax: rand(4.2, 6.6), mass: 0, v: 0,
    maxLen: lenFor(canFall),
    breakLen: rand(150, 260), creep: rand(4, 11), hang: canFall ? rand(2, 10) : 0, w: 4.2, canFall,
  };
}

export default function Blood() {
  const body = useRef<HTMLCanvasElement>(null);
  const shine = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = body.current, cs = shine.current;
    if (!cv || !cs) return;
    const g = cv.getContext('2d')!, h = cs.getContext('2d')!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, dpr = 1, raf = 0, last = performance.now(), time = 0;
    let drips: Drip[] = [];
    const beads: Bead[] = [];
    let tabVisible = !document.hidden, visible = true;

    const populate = () => {
      // pocas gotas en total (una cada ~130 px); de ellas solo 5 (2 en movil) caen, repartidas a lo ancho del borde
      // reparto irregular: unas gotas casi juntas (racimos de 2-3) y otras muy separadas
      const falling = W < 700 ? 2 : 5, k = W < 700 ? 0.9 : 1;
      const xs: number[] = [];
      for (let x = rand(24, 120); x < W - 20; ) {
        xs.push(x);
        x += Math.random() < 0.4 ? rand(20, 52) * k : rand(110, 270) * k;
      }
      const fallers = new Set(Array.from({ length: Math.min(falling, xs.length) }, (_, k) => Math.round((k * (xs.length - 1)) / Math.max(1, falling - 1))));
      drips = xs.map((x, i) => makeDrip(x, rand(0, 6), fallers.has(i)));
    };
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      for (const c of [cv, cs]) { c.width = W * dpr; c.height = H * dpr; }
      populate();
    };

    const step = (dt: number) => {
      time += dt;
      for (const d of drips) {
        switch (d.phase) {
          case 'wait':
            d.t += dt; if (d.t >= 0) { d.phase = 'grow'; d.t = 0; }
            break;
          case 'grow': {
            d.t += dt;
            d.mass += dt * rand(0.05, 0.11);
            d.r = 2 + (d.rMax - 2) * Math.min(1, d.mass * 1.4);
            // se arrastra hacia abajo cada vez mas despacio (viscosidad) hasta su largo maximo
            const room = Math.max(0, 1 - d.len / d.maxLen);
            d.len += d.creep * room * dt;
            if (!d.canFall) { d.mass = Math.min(d.mass, 0.9); break; } // cuelga sin llegar a soltarse
            if (d.len >= d.maxLen * 0.98 && d.t > d.hang + 1.5 && d.mass > 0.65) { d.phase = 'fall'; d.v = 22; d.t = 0; }
            else if (d.mass > 1.25) { d.phase = 'fall'; d.v = 22; d.t = 0; }
            d.w = Math.max(3.2, d.r * 0.85);
            break;
          }
          case 'fall': {
            d.t += dt;
            d.v = Math.min(620, d.v + (60 + d.t * 520) * dt);
            d.len += d.v * dt;
            d.w = Math.max(3.1, d.w - dt * 2.2);
            if (d.len > d.breakLen) {
              beads.push({ x: d.x, y: BAND(d.x, time) + d.len, v: d.v, r: d.r * 0.92 });
              d.phase = 'retract'; d.t = 0;
            }
            break;
          }
          case 'retract':
            d.len -= 300 * dt; d.r = Math.max(2, d.r - dt * 3);
            d.w = Math.max(3.1, d.w);
            if (d.len <= 3) { d.len = 2; d.phase = 'wait'; d.t = -rand(1.2, 7); d.mass = rand(0.15, 0.4); d.r = 2.4; d.rMax = rand(4.2, 6.6);
              d.maxLen = lenFor(d.canFall); d.breakLen = rand(150, 260); d.hang = rand(0.5, 9); d.x += rand(-6, 6); d.x = Math.max(8, Math.min(W - 8, d.x)); }
            break;
        }
      }
      for (let i = beads.length - 1; i >= 0; i--) {
        const b = beads[i];
        b.v = Math.min(780, b.v + 900 * dt); b.y += b.v * dt;
        if (b.y > H + 20) beads.splice(i, 1);
      }
    };

    const draw = () => {
      g.setTransform(dpr, 0, 0, dpr, 0, 0); h.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, W, H); h.clearRect(0, 0, W, H);
      g.fillStyle = 'rgb(66,8,10)';
      // banda superior, fina e irregular
      g.beginPath(); g.moveTo(0, 0);
      for (let x = 0; x <= W; x += 8) g.lineTo(x, BAND(x, time));
      g.lineTo(W, 0); g.closePath(); g.fill();

      for (const d of drips) {
        if (d.phase === 'wait' && d.len < 3) { // semilla: un abultamiento en la banda
          if (d.mass > 0.05) { g.beginPath(); g.ellipse(d.x, BAND(d.x, time) + 1, 5 + d.mass * 4, 4 + d.mass * 3, 0, 0, 6.2832); g.fill(); }
          continue;
        }
        const y0 = BAND(d.x, time) - 1, y1 = y0 + d.len;
        const wTop = d.w * 1.9;
        // hilo: ancho arriba (cuello), mas fino hacia abajo
        g.beginPath();
        g.moveTo(d.x - wTop, y0);
        g.quadraticCurveTo(d.x - d.w * 0.5, y0 + Math.min(14, d.len * 0.4), d.x - d.w * 0.5, y0 + d.len * 0.55);
        g.lineTo(d.x - d.w * 0.5, y1); g.lineTo(d.x + d.w * 0.5, y1);
        g.lineTo(d.x + d.w * 0.5, y0 + d.len * 0.55);
        g.quadraticCurveTo(d.x + d.w * 0.5, y0 + Math.min(14, d.len * 0.4), d.x + wTop, y0);
        g.closePath(); g.fill();
        // cabeza: gota algo alargada hacia abajo
        const stretch = 1.15 + (d.phase === 'fall' ? Math.min(0.5, d.v / 900) : 0.05);
        if (d.phase !== 'retract' || d.len > 14) {
          g.beginPath(); g.ellipse(d.x, y1, d.r, d.r * stretch, 0, 0, 6.2832); g.fill();
          // brillo en la cabeza (capa sin filtro)
          h.fillStyle = 'rgba(176,58,48,.34)';
          h.beginPath(); h.ellipse(d.x - d.r * 0.38, y1 - d.r * 0.2, d.r * 0.22, d.r * 0.5, -0.2, 0, 6.2832); h.fill();
        }
        // reflejo largo en el hilo
        if (d.len > 20) {
          h.strokeStyle = 'rgba(150,44,38,.22)'; h.lineWidth = 1; h.beginPath();
          h.moveTo(d.x - d.w * 0.18, y0 + 12); h.lineTo(d.x - d.w * 0.18, y1 - d.r); h.stroke();
        }
      }
      for (const b of beads) {
        const s = 1 + Math.min(0.9, b.v / 700);
        g.beginPath(); g.ellipse(b.x, b.y, b.r, b.r * s, 0, 0, 6.2832); g.fill();
        h.fillStyle = 'rgba(176,58,48,.3)';
        h.beginPath(); h.ellipse(b.x - b.r * 0.35, b.y - b.r * 0.2, b.r * 0.2, b.r * 0.5 * s, -0.2, 0, 6.2832); h.fill();
      }
    };

    size();
    const ro = new ResizeObserver(size); ro.observe(cv);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(cv);
    const onVis = () => { tabVisible = !document.hidden; last = performance.now(); };
    document.addEventListener('visibilitychange', onVis);

    if (reduce) { // fotograma fijo: se deja correr la simulacion unos segundos
      for (let i = 0; i < 200; i++) step(0.05);
      draw();
    } else {
      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        if (!visible || !tabVisible) { last = now; return; }
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        step(dt); draw();
      };
      raf = requestAnimationFrame(frame);
    }
    return () => {
      cancelAnimationFrame(raf); ro.disconnect(); io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div className="blood" aria-hidden="true">
      <svg width="0" height="0" style={{ position: 'absolute' }} focusable="false">
        <filter id="blood-goo" colorInterpolationFilters="sRGB" x="0" y="0" width="100%" height="100%">
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -9.5" />
        </filter>
      </svg>
      <canvas ref={body} className="blood-body" />
      <canvas ref={shine} className="blood-shine" />
    </div>
  );
}
