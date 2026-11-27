// Genera public/objetos/elvira-X-eyes.webp: máscara con el hueco real (el blanco) de cada ojo,
// sacada del propio retrato en tinta hueso. El iris se recorta con ella y queda siempre bajo los párpados.
// Uso: node scripts/eye-masks.mjs
import sharp from 'sharp';

// [x %, y %] de cada ojo y radio de búsqueda (% del ancho): mismos datos que GAZES en Altar.tsx.
const PORTRAITS = {
  'elvira-a': { eyes: [[26.18, 38.13], [73.82, 37.95]], r: 10 },
  'elvira-b': { eyes: [[26.27, 43.0], [73.73, 37.02]], r: 10 },
  'elvira-c': { eyes: [[40.07, 35.73], [60.0, 36.29]], r: 4.6 },
  'elvira-d': { eyes: [[36.67, 45.05], [46.48, 44.9]], r: 2.8 },
  'elvira-e': { eyes: [[44.82, 39.88], [55.18, 40.03]], r: 2.5 },
  'elvira-f': { eyes: [[42.15, 36.35], [57.85, 37.65]], r: 3.6 },
  'elvira-g': { eyes: [[43.18, 39.53], [56.82, 40.44]], r: 4.5, ell: [3.9, 1.65] },
  'elvira-h': { eyes: [[41.14, 44.78], [58.79, 45.22]], r: 4.5 },
  'elvira-i': { eyes: [[44.83, 61.72], [55.13, 62.27]], r: 2.8 },
};

const ONLY = process.argv.slice(2);
for (const [name, { eyes, r, ell }] of Object.entries(PORTRAITS)) {
  if (ONLY.length && !ONLY.includes(name)) continue;
  const { data, info } = await sharp(`public/objetos/${name}.webp`)
    .flatten({ background: '#000' }).greyscale().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const bright = (i) => data[i] > 110;
  const out = Buffer.alloc(W * H); // 255 = hueco del ojo
  const R = Math.round((r / 100) * W);
  for (const [ex, ey] of eyes) {
    const cx = Math.round((ex / 100) * W), cy = Math.round((ey / 100) * H);
    // Semilla: el píxel claro más cercano al centro del ojo.
    let seed = -1;
    for (let d = 0; d < R && seed < 0; d++)
      for (let dy = -d; dy <= d && seed < 0; dy++)
        for (let dx = -d; dx <= d; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== d) continue;
          const x = cx + dx, y = cy + dy;
          if (x >= 0 && y >= 0 && x < W && y < H && bright(y * W + x)) { seed = y * W + x; break; }
        }
    if (seed < 0) { console.warn(name, 'sin semilla en', ex, ey); continue; }
    // Relleno por inundación, acotado a una caja alrededor del ojo para no fugarse a la piel.
    const stack = [seed]; const seen = new Set([seed]);
    const x0 = cx - R, x1 = cx + R, y0 = cy - Math.round(R * 0.6), y1 = cy + Math.round(R * 0.6);
    while (stack.length) {
      const i = stack.pop(); out[i] = 255;
      const x = i % W, y = (i / W) | 0;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (ell && (((nx - cx) / (ell[0] / 100 * W)) ** 2 + ((ny - cy) / (ell[1] / 100 * H)) ** 2) > 1) continue;
        if (nx < x0 || nx > x1 || ny < y0 || ny > y1 || nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const j = ny * W + nx;
        if (!seen.has(j) && bright(j)) { seen.add(j); stack.push(j); }
      }
    }
  }
  // Cierra motas y suaviza el borde un pelo.
  const alpha = await sharp(out, { raw: { width: W, height: H, channels: 1 } })
    .blur(0.8).threshold(110).blur(0.6).extractChannel(0).raw().toBuffer();
  console.log('alpha', alpha.length, W * H, alpha.reduce((a, b) => a + b, 0) / alpha.length);
  // RGBA blanco con la máscara en el canal alfa.
  const rgba = Buffer.alloc(W * H * 4, 255);
  for (let i = 0; i < W * H; i++) rgba[i * 4 + 3] = alpha[i];
  await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 90, alphaQuality: 90 }).toFile(`public/objetos/${name}-eyes.webp`);
  console.log(name, W, H, 'ok');
}
