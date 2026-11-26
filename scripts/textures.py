# Genera las texturas de fondo (pizarra negra con motas y arañazos, y papel).
import numpy as np, random
from PIL import Image, ImageDraw, ImageFilter
rng = np.random.default_rng(7); random.seed(7)

def blur_wrap(a, s):
    h, w = a.shape
    fy = np.fft.fftfreq(h)[:, None]; fx = np.fft.fftfreq(w)[None, :]
    g = np.exp(-2 * (np.pi * s) ** 2 * (fx ** 2 + fy ** 2))
    return np.real(np.fft.ifft2(np.fft.fft2(a) * g))

def fbm(n, scales):
    out = np.zeros((n, n))
    for s, amp in scales:
        r = blur_wrap(rng.standard_normal((n, n)), s); r /= r.std(); out += r * amp
    return out

N = 1024
# --- pizarra ---
base = fbm(N, [(60, .5), (14, .35), (3, .2), (.7, .12)])
img = 15 + base * 4.5
rgb = np.stack([img * 1.0, img * .96, img * .9], -1)
im = Image.fromarray(np.clip(rgb, 0, 255).astype('uint8'))
layer = Image.new('L', (N, N), 0); d = ImageDraw.Draw(layer)
# nubes de motas de tiza
for _ in range(26):
    cx, cy, r = random.random() * N, random.random() * N, random.uniform(20, 120)
    for _ in range(int(r * 6)):
        a = random.random() * 6.283; rr = abs(random.gauss(0, r * .5))
        x, y = (cx + np.cos(a) * rr) % N, (cy + np.sin(a) * rr) % N
        s = random.choice([0, 0, 0, 1, 1, 2]); v = random.randint(40, 190)
        d.ellipse([x - s / 2, y - s / 2, x + s / 2, y + s / 2], fill=v)
for _ in range(2500):
    x, y = random.random() * N, random.random() * N
    d.point((x, y), fill=random.randint(30, 120))
# arañazos finos (craquelado)
for _ in range(70):
    x, y = random.random() * N, random.random() * N
    ang = random.random() * 6.283; v = random.randint(25, 80); w = 1
    for _ in range(random.randint(8, 40)):
        ang += random.gauss(0, .35); L = random.uniform(3, 12)
        nx, ny = x + np.cos(ang) * L, y + np.sin(ang) * L
        for ox in (-N, 0, N):
            for oy in (-N, 0, N):
                d.line([x + ox, y + oy, nx + ox, ny + oy], fill=v, width=w)
        x, y = nx, ny
layer = layer.filter(ImageFilter.GaussianBlur(.45))
L = np.asarray(layer).astype(float) / 255
arr = np.asarray(im).astype(float)
chalk = np.array([205, 196, 180])
arr = arr * (1 - L[..., None] * .8) + chalk * L[..., None] * .8
Image.fromarray(np.clip(arr, 0, 255).astype('uint8')).save('public/tex/slate.webp', quality=82)

# --- papel ---
M = 768
p = fbm(M, [(80, .5), (20, .35), (4, .25), (.6, .25)])
fib = blur_wrap(rng.standard_normal((M, M)), .5); fib = blur_wrap(np.cumsum(fib, 1) * 0 + fib, .3)
v = 206 + p * 7 + fib * 3
rgb = np.stack([v * 1.0, v * .93, v * .82], -1)
Image.fromarray(np.clip(rgb, 0, 255).astype('uint8')).save('public/tex/paper.webp', quality=82)
print('ok')
