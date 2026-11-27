// Utilidades para el lacre: polilinea suavizada y generador determinista.

export type Pt = [number, number];

const r2 = (n: number) => Math.round(n * 100) / 100;

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

/** Generador pseudoaleatorio determinista (para que el HTML sea estable entre compilaciones). */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
