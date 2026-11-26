// Geometría para la forja ornamental: volutas (espirales) unidas por brazos curvos.
// Todo se calcula al compilar y se pinta como trazos SVG.

export type Pt = [number, number];

const r2 = (n: number) => Math.round(n * 100) / 100;
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const mul = (a: Pt, k: number): Pt => [a[0] * k, a[1] * k];
const norm = (a: Pt): Pt => {
  const l = Math.hypot(a[0], a[1]) || 1;
  return [a[0] / l, a[1] / l];
};

/** Puntos de una espiral que empieza en el radio exterior y se enrosca hacia dentro. */
export function spiralPts(
  c: Pt,
  R: number,
  turns: number,
  startDeg: number,
  dir: 1 | -1,
  steps = 90,
): Pt[] {
  const pts: Pt[] = [];
  const a0 = (startDeg * Math.PI) / 180;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const th = a0 + dir * t * turns * Math.PI * 2;
    const r = R * Math.pow(1 - t * 0.86, 1.25);
    pts.push([c[0] + Math.cos(th) * r, c[1] + Math.sin(th) * r]);
  }
  return pts;
}

/** Polilínea suavizada (Catmull-Rom → Bézier cúbica). */
export function smooth(pts: Pt[], moveTo = true): string {
  let d = moveTo ? `M${r2(pts[0][0])},${r2(pts[0][1])}` : '';
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${r2(c1[0])},${r2(c1[1])} ${r2(c2[0])},${r2(c2[1])} ${r2(p2[0])},${r2(p2[1])}`;
  }
  return d;
}

export interface Volute {
  /** centro de la espiral */
  c: Pt;
  /** radio exterior */
  R: number;
  /** vueltas */
  turns: number;
  /** ángulo (grados) del punto exterior donde llega el brazo */
  at: number;
  /** sentido de enroscado: 1 horario, -1 antihorario (en pantalla) */
  dir: 1 | -1;
}

/**
 * Un brazo que sale de `from` en dirección `fromDir` (vector) y desemboca
 * tangente en una voluta. Devuelve el path completo.
 */
export function arm(from: Pt, fromDir: Pt, v: Volute, k1 = 0.45, k2 = 0.45): string {
  const sp = spiralPts(v.c, v.R, v.turns, v.at, v.dir);
  const q = sp[0];
  const tq = norm([sp[1][0] - sp[0][0], sp[1][1] - sp[0][1]]);
  const dist = Math.hypot(q[0] - from[0], q[1] - from[1]);
  const c1 = add(from, mul(norm(fromDir), dist * k1));
  const c2 = add(q, mul(tq, -dist * k2));
  const head = `M${r2(from[0])},${r2(from[1])}C${r2(c1[0])},${r2(c1[1])} ${r2(c2[0])},${r2(c2[1])} ${r2(q[0])},${r2(q[1])}`;
  return head + smooth(sp, false);
}

/** Sólo la espiral, sin brazo. */
export function volute(v: Volute): string {
  return smooth(spiralPts(v.c, v.R, v.turns, v.at, v.dir));
}

/** Refleja un path horizontalmente respecto a x = cx (sólo comandos absolutos M/C/L/Q). */
export function mirrorX(d: string, cx: number): string {
  return d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${r2(2 * cx - Number(x))},${y}`);
}

/** Refleja verticalmente respecto a y = cy. */
export function mirrorY(d: string, cy: number): string {
  return d.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => `${x},${r2(2 * cy - Number(y))}`);
}

/** Hoja lanceolada pequeña orientada según `deg`. */
export function leaf(at: Pt, len: number, deg: number, w = 0.32): string {
  const a = (deg * Math.PI) / 180;
  const dx = Math.cos(a), dy = Math.sin(a);
  const nx = -dy, ny = dx;
  const tip: Pt = [at[0] + dx * len, at[1] + dy * len];
  const m: Pt = [at[0] + dx * len * 0.5, at[1] + dy * len * 0.5];
  const c1: Pt = [m[0] + nx * len * w, m[1] + ny * len * w];
  const c2: Pt = [m[0] - nx * len * w, m[1] - ny * len * w];
  return `M${r2(at[0])},${r2(at[1])}Q${r2(c1[0])},${r2(c1[1])} ${r2(tip[0])},${r2(tip[1])}Q${r2(c2[0])},${r2(c2[1])} ${r2(at[0])},${r2(at[1])}Z`;
}

/** Generador pseudoaleatorio determinista (para que el HTML sea estable entre compilaciones). */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
