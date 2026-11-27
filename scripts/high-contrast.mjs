// Alto contraste "grabado": umbral local a dos tonos (sin grises). Uso: node hc.mjs
import { createRequire } from 'module';
import fs from 'fs';
const sharp = createRequire('C:/Users/Ana Arquelladas/Documents/GitHub/arcanasacra/package.json')('sharp');
sharp.cache(false);
const REPO = 'C:/Users/Ana Arquelladas/Documents/GitHub/arcanasacra/';
const SP = 'C:/Users/ANAARQ~1/AppData/Local/Temp/claude/d26fbfdd5c74ddd6/ad1e75a7-8fc8-4744-8e15-2ab7e51897c5/scratchpad/hc/';
fs.mkdirSync(SP, { recursive: true });

const load = async (f) => { const { data, info } = await sharp(f).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); return { data, w: info.width, h: info.height }; };
const blur1 = async (buf, w, h, s) => sharp(buf, { raw: { width: w, height: h, channels: 1 } }).blur(s).toColourspace('b-w').raw().toBuffer();

// luminancia 0..255 normalizada con CLAHE para sacar detalle local
async function lumClahe(img) {
  const { data, w, h } = img; const g = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) g[i] = Math.round(0.3 * data[i * 4] + 0.59 * data[i * 4 + 1] + 0.11 * data[i * 4 + 2]);
  return sharp(g, { raw: { width: w, height: h, channels: 1 } }).clahe({ width: Math.max(8, Math.round(w / 8)), height: Math.max(8, Math.round(h / 8)), maxSlope: 4 }).toColourspace('b-w').raw().toBuffer();
}

// binario: 1 = claro (metal/luz), 0 = oscuro. Umbral local (media desenfocada) + suelo global.
async function binarize(img, { sigma = 9, bias = 4, floor = 40, soft = 0.7 }) {
  const { w, h } = img; const L = await lumClahe(img); const M = await blur1(L, w, h, sigma);
  const b = Buffer.alloc(w * h);
  for (let i = 0; i < w * h; i++) b[i] = img.data[i * 4 + 3] > 20 && L[i] > M[i] + bias && L[i] > floor ? 255 : 0;
  return blur1(b, w, h, soft); // borde apenas suavizado
}

function sil(img) { const { w, h, data } = img; const s = Buffer.alloc(w * h); for (let i = 0; i < w * h; i++) s[i] = data[i * 4 + 3] > 40 ? 255 : 0; return s; }

async function out(buf, w, h, name) {
  await sharp(buf, { raw: { width: w, height: h, channels: 4 } }).png().toFile(SP + name + '.png');
}
const BONE = [0xe9, 0xdf, 0xc8], INK = [0x1a, 0x16, 0x11];

// ---------- GRIMORIO ----------
{
  const n = await load(REPO + 'public/objetos/grimoire.webp'); const { w, h } = n;
  const S = sil(n);
  const B = await binarize(n, { sigma: 11, bias: 3, floor: 34, soft: 0.6 });
  const night = Buffer.alloc(w * h * 4), day = Buffer.alloc(w * h * 4);
  // contorno exterior del objeto (filete): silueta menos silueta erosionada
  const er = await blur1(Buffer.from(S.map((v) => 255 - v)), w, h, 3); // 255 - S desenfocado
  for (let i = 0; i < w * h; i++) {
    const s = S[i] / 255, b = B[i] / 255;
    const rim = s > 0.5 && er[i] > 40 ? 1 : 0;
    // noche: hueso donde hay luz/metal o en el filete; el cuero oscuro queda transparente
    const an = Math.min(1, Math.max(b, rim)) * s;
    night.set([...BONE, Math.round(an * 255)], i * 4);
    // dia: tinta donde NO hay luz (cuero) y en el filete; el metal queda en papel
    const ad = Math.min(1, Math.max(1 - b, rim)) * s;
    day.set([...INK, Math.round(ad * 255)], i * 4);
  }
  await out(night, w, h, 'grimoire'); await out(day, w, h, 'grimoire-ink');
}

// ---------- BOLA (rojo con textura) ----------
{
  const n = await load(REPO + 'docs/img/candidatas-bola5/bola5.png'); const { w, h } = n; const N = w * h;
  const S = sil(n);
  // esfera: pixeles rojos dominantes (mascara cerrada)
  let m = Buffer.alloc(N);
  for (let i = 0; i < N; i++) { const r = n.data[i * 4], g = n.data[i * 4 + 1], b = n.data[i * 4 + 2]; m[i] = n.data[i * 4 + 3] > 200 && r > g * 1.6 && r > b * 1.4 && r > 36 ? 255 : 0; }
  const mc = await blur1(m, w, h, 6); const sph = Buffer.alloc(N); for (let i = 0; i < N; i++) sph[i] = mc[i] > 90 ? 255 : 0;
  const sphS = await blur1(sph, w, h, 1.2);
  const B = await binarize(n, { sigma: 10, bias: 4, floor: 38, soft: 0.6 });
  const L = await lumClahe(n);
  const er = await blur1(Buffer.from(S.map((v) => 255 - v)), w, h, 3);
  const night = Buffer.alloc(N * 4), day = Buffer.alloc(N * 4);
  // niveles de la esfera (posterizado en 4): del mas oscuro al mas claro
  const RED = [[24, 2, 6], [86, 8, 16], [150, 18, 28], [226, 150, 150]];
  const vals=[];for(let i=0;i<N;i++)if(sphS[i]>200)vals.push(L[i]);vals.sort((a,b)=>a-b);const q=(p)=>vals[Math.floor(vals.length*p)]||128;const q1=q(.22),q2=q(.55),q3=q(.92);
const lv = (l) => (l < q1 ? 0 : l < q2 ? 1 : l < q3 ? 2 : 3);
  for (let i = 0; i < N; i++) {
    const s = S[i] / 255; if (s <= 0) continue;
    const inS = sphS[i] / 255, b = B[i] / 255;
    const rim = er[i] > 40 ? 1 : 0;
    // metal / resto: dos tonos
    let nc = BONE, na = Math.min(1, Math.max(b, rim)) * s;
    let dc = INK, da = Math.min(1, Math.max(1 - b, rim)) * s;
    if (inS > 0.05) {
      const k = lv(L[i]); const c = RED[k];
      nc = [nc[0] * (1 - inS) + c[0] * inS, nc[1] * (1 - inS) + c[1] * inS, nc[2] * (1 - inS) + c[2] * inS]; na = na * (1 - inS) + inS * s;
      const DR = [[0x2a, 0x03, 0x08], [0x4a, 0x07, 0x0e], [0x4a, 0x07, 0x0e], [0x4a, 0x07, 0x0e]][k];
      const dA = [1, 0.88, 0.62, 0.3][k];
      dc = [dc[0] * (1 - inS) + DR[0] * inS, dc[1] * (1 - inS) + DR[1] * inS, dc[2] * (1 - inS) + DR[2] * inS]; da = da * (1 - inS) + inS * dA * s;
    }
    night.set([Math.round(nc[0]), Math.round(nc[1]), Math.round(nc[2]), Math.round(na * 255)], i * 4);
    day.set([Math.round(dc[0]), Math.round(dc[1]), Math.round(dc[2]), Math.round(da * 255)], i * 4);
  }
  await out(night, w, h, 'ball'); await out(day, w, h, 'ball-ink');
}

// ---------- hoja de comparacion ----------
const cell = async (f, bg) => { const m = await sharp(SP + f).metadata(); const sc = 520 / m.height; const b = await sharp(SP + f).resize({ height: 520 }).toBuffer(); return { b, w: Math.round(m.width * sc), bg }; };
const names = [['grimoire.png', '#0e0d0b'], ['grimoire-ink.png', '#e7dcc4'], ['ball.png', '#0e0d0b'], ['ball-ink.png', '#e7dcc4']];
const cells = []; for (const [f, bg] of names) cells.push(await cell(f, bg));
const W = cells.reduce((a, c) => a + c.w + 20, 20); const comp = []; let x = 0;
const base = await sharp({ create: { width: W, height: 560, channels: 3, background: '#555' } }).png().toBuffer();
for (const c of cells) {
  comp.push({ input: await sharp({ create: { width: c.w + 20, height: 560, channels: 3, background: c.bg } }).png().toBuffer(), left: x, top: 0 });
  comp.push({ input: c.b, left: x + 10, top: 20 }); x += c.w + 20;
}
await sharp(base).composite(comp).png().toFile(SP + 'hoja.png');
console.log('ok');
