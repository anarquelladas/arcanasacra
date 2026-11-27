// Pasa una imagen de sello a dos tonos (sin grises) y engrosa el trazo.
// Uso: node scripts/thicken.mjs <noche|dia> <radio> <umbral 0-255> <ruta.webp> [...mas]
//  dia   : tinta negra; el trazo es el alfa (umbral alto = solo el contorno fuerte).
//  noche : tinta hueso; el trazo es luminancia*alfa.
import sharp from 'sharp';
import fs from 'fs';
sharp.cache(false);
// dilatacion binaria con disco de radio r (dos pasadas: horizontal y vertical con perfil circular aproximado)
function dilate(a, w, h, r) {
  const prof = []; for (let dy = -r; dy <= r; dy++) prof.push([dy, Math.floor(Math.sqrt(r * r - dy * dy))]);
  const out = Buffer.alloc(w * h);
  // por fila: para cada pixel activo, pinta el disco
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!a[y * w + x]) continue;
    for (const [dy, dx] of prof) { const yy = y + dy; if (yy < 0 || yy >= h) continue; const x0 = Math.max(0, x - dx), x1 = Math.min(w - 1, x + dx); out.fill(255, yy * w + x0, yy * w + x1 + 1); }
  }
  return out;
}
const [mode, r, th, ...files] = process.argv.slice(2);
const R = Math.max(0, parseInt(r, 10)), T = parseInt(th, 10);
const COL = mode === 'dia' ? [0x1a, 0x16, 0x11] : [0xe9, 0xdf, 0xc8];
for (const f of files) {
  const { data, info } = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const a = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) {
    const al = data[i * 4 + 3];
    const v = mode === 'dia' ? al : (al * (0.3 * data[i * 4] + 0.59 * data[i * 4 + 1] + 0.11 * data[i * 4 + 2])) / 255;
    a[i] = v >= T ? 255 : 0;
  }
  const G = { raw: { width: w, height: h, channels: 1 } };
  let img = sharp(a, G);
  if (R > 0) img = sharp(dilate(a, w, h, R), G);
  const m = await img.blur(0.6).toColourspace('b-w').extractChannel(0).raw().toBuffer(); // borde apenas suavizado
  const out = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    // dia: se conserva el relleno gris original y solo se engrosa el contorno fuerte
    const al = mode === 'dia' ? Math.max(m[i], data[i * 4 + 3]) : m[i];
    out[i * 4] = COL[0]; out[i * 4 + 1] = COL[1]; out[i * 4 + 2] = COL[2]; out[i * 4 + 3] = al;
  }
  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 92, alphaQuality: 100 }).toFile(f + '.tmp');
  fs.copyFileSync(f + '.tmp', f); fs.unlinkSync(f + '.tmp');
  console.log('ok', f);
}
