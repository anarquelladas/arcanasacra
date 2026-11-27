// Sello de lacre procedural: cera granate con relieve (iluminacion SVG) y una letra en relieve.
// Genera public/objetos/seal.webp: lacre granate con relieve y una A (necesita playwright instalado aparte).
// Uso: node scripts/wax-seal.mjs
import { chromium } from 'playwright';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import fs from 'fs';
const ROOT = fileURLToPath(new URL('..', import.meta.url));
const sharp = createRequire(ROOT + 'package.json')('sharp');
sharp.cache(false);
const FONTS = ROOT.split(String.fromCharCode(92)).join('/') + 'node_modules/@fontsource/';
const OUT = ROOT + 'scripts/.tmp-seal/';
fs.mkdirSync(OUT, { recursive: true });
const exe = process.env.CHROMIUM_PATH || undefined;

// contorno de cera irregular (determinista por semilla)
function blob(seed, R, n = 90) {
  let s = seed;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const pts = [];
  const ph = [rnd() * 6, rnd() * 6, rnd() * 6];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const r = R * (1 + 0.035 * Math.sin(a * 3 + ph[0]) + 0.025 * Math.sin(a * 5 + ph[1]) + 0.018 * Math.sin(a * 9 + ph[2]) + (rnd() - 0.5) * 0.012);
    pts.push([300 + Math.cos(a) * r, 300 + Math.sin(a) * r]);
  }
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}

const variants = {
  'A-ballet': { text: 'A', family: 'Ballet', size: 250, dy: 80, dx: 0, color: '#5c0816' },
  'A-cormorant': { text: 'A', family: 'CormorantI', size: 330, dy: 108, dx: 0, color: '#5c0816' },
};

const html = (v, seed) => `<!doctype html><html><head><style>
@font-face { font-family: 'Ballet'; src: url('file:///${FONTS}ballet/files/ballet-latin-400-normal.woff2'); }
@font-face { font-family: 'CormorantI'; src: url('file:///${FONTS}cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2'); }
html,body { margin:0; background: transparent; }
</style></head><body>
<svg id="s" width="600" height="600" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="wax" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
      <feComponentTransfer in="SourceAlpha" result="solid"><feFuncA type="discrete" tableValues="0 1 1 1 1 1 1 1 1 1"/></feComponentTransfer>
      <feGaussianBlur in="SourceAlpha" stdDeviation="2.6" result="h"/>
      <feDiffuseLighting in="h" surfaceScale="9" diffuseConstant="1.05" lighting-color="${v.color}" result="diff"><feDistantLight azimuth="235" elevation="50"/></feDiffuseLighting>
      <feSpecularLighting in="h" surfaceScale="9" specularConstant=".55" specularExponent="24" lighting-color="#f0a8a0" result="spec"><feDistantLight azimuth="235" elevation="46"/></feSpecularLighting>
      <feComposite in="spec" in2="solid" operator="in" result="specIn"/>
      <feComposite in="diff" in2="specIn" operator="arithmetic" k1="0" k2="1" k3=".85" k4="0" result="lit"/>
      <feComposite in="lit" in2="solid" operator="in"/>
    </filter>
  </defs>
  <path d="${blob(seed, 262)}" transform="translate(5,9)" fill="#000" opacity=".28" style="filter: blur(7px)"/>
  <g filter="url(#wax)">
    <path d="${blob(seed, 262)}" fill="#000" fill-opacity=".62"/>
    <path d="${blob(seed, 244)}" fill="none" stroke="#000" stroke-opacity="1" stroke-width="22" stroke-linejoin="round"/>
    <path d="${blob(seed + 7, 214)}" fill="#000" fill-opacity=".38"/>
    <circle cx="300" cy="300" r="176" fill="none" stroke="#000" stroke-width="6" stroke-opacity=".95"/>
    <text x="${300 + v.dx}" y="${300 + v.dy}" text-anchor="middle" font-family="${v.family}" font-size="${v.size}" fill="#000">${v.text}</text>
  </g>
</svg></body></html>`;

const b = await chromium.launch(exe ? { executablePath: exe } : {});
for (const [name, v] of Object.entries(variants)) {
  const p = await b.newPage({ viewport: { width: 600, height: 600 } });
  const file = OUT + `wax-${name}.html`;
  fs.writeFileSync(file, html(v, 11));
  await p.goto('file:///' + file);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
  await p.screenshot({ path: OUT + `wax-${name}.png`, omitBackground: true });
  await p.close();
}
await b.close();
await sharp(OUT + 'wax-A-cormorant.png').resize(560).webp({ quality: 92, alphaQuality: 100 }).toFile(ROOT + 'public/objetos/seal.webp');
fs.rmSync(OUT, { recursive: true, force: true });
console.log('public/objetos/seal.webp listo');
