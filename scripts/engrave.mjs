// Foto de objeto -> sello "grabado" a dos tintas (noche: hueso; dia: tinta negra), pensado para mostrarse pequeno.
// Se trabaja a baja resolucion (rasgos gruesos, trama en los medios tonos) y se escala con bordes nitidos.
// Uso: node scripts/engrave.mjs <nombre> [salida_dir]   (nombres: dagger-h key-a key-b key-ring grimoire)
// Las fotos de origen se pasan por variable SRC_DIR (ver LICENCIAS.md).
import sharp from 'sharp';
import fs from 'fs';
sharp.cache(false);

// devuelve siempre 1 canal (sharp puede expandir a 3 tras blur/resize)
const one = async (pipe, w, h) => { const { data, info } = await pipe.toColourspace('b-w').raw().toBuffer({ resolveWithObject: true }); if (info.channels === 1) return data; const o = Buffer.alloc(w * h); for (let i = 0; i < w * h; i++) o[i] = data[i * info.channels]; return o; };
const SRC = process.env.SRC_DIR || '.';
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]].map((r) => r.map((v) => (v + 0.5) / 16));
const BONE = [0xe9, 0xdf, 0xc8], INK = [0x1a, 0x16, 0x11];

// cfg: file, crop {left,top,width,height} (opcional), rot (grados), flop, bg ('black'|'light'), thr, low [w,h], out [w,h], amp, local
const CFG = {
  'dagger-h': { file: 'turk.jpg', crop: { left: 430, top: 110, width: 300, height: 1470 }, rot: -90, bg: 'black', thr: 26, low: [420, 82], out: [1000, 194], amp: 0.55, gain: 1.6, sig: 5 },
  'key-a': { file: 'rk2301.jpg', rot: -90, bg: 'light', thr: 90, low: [120, 222], out: [486, 900], amp: 0.5, gain: 1.8, sig: 4, trim: true },
  'key-b': { file: 'rk16959.jpg', rot: -90, bg: 'light', thr: 90, low: [88, 222], out: [360, 900], amp: 0.5, gain: 1.8, sig: 4, trim: true },
  'key-ring': { file: 'rk2001.jpg', crop: { left: 2200, top: 560, width: 980, height: 1330 }, bg: 'light', thr: 90, low: [150, 178], out: [507, 600], amp: 0.5, gain: 1.8, sig: 4, trim: true },
  grimoire: { file: 'book2.jpg', bg: 'black', thr: 22, low: [260, 352], out: [700, 948], amp: 0.5, gain: 1.7, sig: 6, trim: true },
};

const name = process.argv[2], outDir = process.argv[3] || 'public/objetos';
const c = CFG[name]; if (!c) throw new Error('nombre desconocido: ' + name);

let img = sharp(SRC + '/' + c.file).rotate();
if (c.crop) img = img.extract(c.crop);
if (c.rot) img = sharp(await img.rotate(c.rot).toBuffer());
if (c.flop) img = img.flop();
// recorte al objeto (bbox de la mascara) y reduccion
const pre = await img.resize({ width: 1200, height: 1200, fit: 'inside' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const mask0 = (data, w, h, ch) => {
  const m = new Uint8Array(w * h);
  if (c.bg === 'black') for (let i = 0; i < w * h; i++) { const l = 0.3 * data[i * ch] + 0.59 * data[i * ch + 1] + 0.11 * data[i * ch + 2]; m[i] = l > c.thr ? 1 : 0; }
  else { // fondo claro: color de las esquinas
    const px = (x, y) => [0, 1, 2].map((k) => data[(y * w + x) * ch + k]);
    const cs = [px(2, 2), px(w - 3, 2), px(2, h - 3), px(w - 3, h - 3)]; const bg = [0, 1, 2].map((k) => cs.reduce((a, p) => a + p[k], 0) / 4);
    for (let i = 0; i < w * h; i++) { const d = Math.abs(data[i * ch] - bg[0]) + Math.abs(data[i * ch + 1] - bg[1]) + Math.abs(data[i * ch + 2] - bg[2]); m[i] = d > c.thr * 1.5 ? 1 : 0; }
  }
  return m;
};
const { data: pd, info: pi } = pre; let m0 = mask0(pd, pi.width, pi.height, pi.channels);
// limpiar ruido: abre/cierra con desenfoque
const blurMask = async (m, w, h, s, t) => { const b = await one(sharp(Buffer.from(m.map((v) => v * 255)), { raw: { width: w, height: h, channels: 1 } }).blur(s), w, h); return Uint8Array.from(b, (v) => (v > t ? 1 : 0)); };
m0 = await blurMask(m0, pi.width, pi.height, 3, 110);
let x0 = pi.width, y0 = pi.height, x1 = 0, y1 = 0;
for (let y = 0; y < pi.height; y++) for (let x = 0; x < pi.width; x++) if (m0[y * pi.width + x]) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
const pad = 6; x0 = Math.max(0, x0 - pad); y0 = Math.max(0, y0 - pad); x1 = Math.min(pi.width - 1, x1 + pad); y1 = Math.min(pi.height - 1, y1 + pad);
const base = await sharp(pd, { raw: { width: pi.width, height: pi.height, channels: pi.channels } }).extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 }).png().toBuffer();
// ajuste a la caja "low" conservando proporcion y centrando
const [lw, lh] = c.low;
// mascara y gris al tamano low (se recalcula sobre la imagen ya reducida, con padding negro => ojo con fondo claro)
const cp = (x, y) => [0, 1, 2].map((k) => pd[(y * pi.width + x) * pi.channels + k]);
const cc = [cp(2, 2), cp(pi.width - 3, 2), cp(2, pi.height - 3), cp(pi.width - 3, pi.height - 3)];
const bgc = [0, 1, 2].map((k) => Math.round(cc.reduce((a, q) => a + q[k], 0) / 4));
let lowImg = sharp(base).resize({ width: lw, height: lh, fit: 'contain', background: c.bg === 'black' ? { r: 0, g: 0, b: 0 } : { r: bgc[0], g: bgc[1], b: bgc[2] } });
const lo = await lowImg.raw().toBuffer({ resolveWithObject: true });
const W = lo.info.width, H = lo.info.height, ch = lo.info.channels;
let M = mask0(lo.data, W, H, ch);
if (c.bg === 'light') { // el padding blanco puede diferir del fondo real: marcar fuera
  // se confia en la mascara por esquinas; el fondo del contain queda como fondo
}
M = await blurMask(M, W, H, 1.2, 120);
const L = new Float32Array(W * H);
for (let i = 0; i < W * H; i++) L[i] = (0.3 * lo.data[i * ch] + 0.59 * lo.data[i * ch + 1] + 0.11 * lo.data[i * ch + 2]) / 255;
// normaliza dentro de la mascara
const vals = []; for (let i = 0; i < W * H; i++) if (M[i]) vals.push(L[i]); vals.sort((a, b) => a - b);
const p = (q) => vals[Math.min(vals.length - 1, Math.floor(vals.length * q))] || 0; const lo2 = p(0.03), hi2 = p(0.97);
const N = new Float32Array(W * H); for (let i = 0; i < W * H; i++) N[i] = Math.min(1, Math.max(0, (L[i] - lo2) / (hi2 - lo2 || 1)));
const blurred = await one(sharp(Buffer.from(Uint8Array.from(N, (v) => Math.round(v * 255))), { raw: { width: W, height: H, channels: 1 } }).blur(c.sig), W, H);
const T = new Float32Array(W * H);
for (let i = 0; i < W * H; i++) T[i] = Math.min(1, Math.max(0, 0.5 + (N[i] - 0.5) * 0.6 + (N[i] - blurred[i] / 255) * c.gain));
// borde: pixeles de mascara con vecino fuera
const rim = new Uint8Array(W * H);
for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x; if (M[i] && (!M[i - 1] || !M[i + 1] || !M[i - W] || !M[i + W])) rim[i] = 1; }
const bitsN = new Uint8Array(W * H), bitsD = new Uint8Array(W * H);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = y * W + x; if (!M[i]) continue;
  const t = 0.5 + c.amp * (BAYER[y % 4][x % 4] - 0.5);
  bitsN[i] = rim[i] || T[i] > t ? 1 : 0;           // noche: hueso donde hay luz y en el filete
  bitsD[i] = rim[i] || T[i] < 1 - t + 0 ? 1 : 0;    // dia: tinta donde hay sombra y en el filete
}
fs.mkdirSync(outDir + '/ink', { recursive: true });
const emit = async (bits, col, file) => {
  const a = Buffer.from(bits.map((v) => v * 255));
  const up = await one(sharp(a, { raw: { width: W, height: H, channels: 1 } }).resize({ width: c.out[0], height: c.out[1], fit: 'fill', kernel: 'cubic' }).blur(0.8), c.out[0], c.out[1]);
  const out = Buffer.alloc(c.out[0] * c.out[1] * 4);
  for (let i = 0; i < c.out[0] * c.out[1]; i++) { // contraste de borde: nitidez sin escalones
    const v = Math.min(255, Math.max(0, (up[i] - 128) * 3 + 128)); out[i * 4] = col[0]; out[i * 4 + 1] = col[1]; out[i * 4 + 2] = col[2]; out[i * 4 + 3] = v;
  }
  await sharp(out, { raw: { width: c.out[0], height: c.out[1], channels: 4 } }).webp({ quality: 90, alphaQuality: 100 }).toFile(file);
};
await emit(bitsN, BONE, `${outDir}/${name}.webp`);
await emit(bitsD, INK, `${outDir}/ink/${name}.webp`);
console.log('ok', name, W + 'x' + H);
