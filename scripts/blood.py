# Goteo de sangre en ráster (tileable en horizontal) y una gota suelta.
import numpy as np, cv2
from PIL import Image
rng = np.random.default_rng(13)
W, H = 1600, 260

def shade(mask, glossy=True):
    m = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 2.2)
    m = (m > .5).astype(np.float32)
    d = cv2.distanceTransform((m * 255).astype(np.uint8), cv2.DIST_L2, 5)
    d = d / (d.max() + 1e-6)
    gy, gx = np.gradient(cv2.GaussianBlur(d, (0, 0), 3))
    light = np.clip(-gx * 9, 0, 1) * (d > .18) * (d < .62)   # brillo fino en el flanco izquierdo
    base = np.array([84, 5, 9], np.float32); deep = np.array([30, 1, 3], np.float32); hi = np.array([170, 70, 66], np.float32)
    t = np.clip(d * 1.6, 0, 1)[..., None]
    rgb = deep * (1 - t) + base * t
    if glossy:
        spec = (light > .2).astype(np.float32)
        spec = cv2.GaussianBlur(cv2.erode(spec, np.ones((2, 2), np.uint8)), (0, 0), .8)[..., None] * .4
        rgb = rgb * (1 - spec) + hi * spec
    grain = cv2.GaussianBlur(rng.standard_normal(m.shape).astype(np.float32), (0, 0), .8)[..., None] * 6
    rgb = np.clip(rgb + grain, 0, 255)
    a = cv2.GaussianBlur(m, (0, 0), .7)
    return np.dstack([rgb, a * 255]).astype(np.uint8)

# tira con goteos
mask = np.zeros((H, W), np.uint8)
yy = np.arange(W)
top = 26 + 7 * np.sin(yy / 61) + 4 * np.sin(yy / 17 + 1)
for x in range(W): mask[: int(top[x]), x] = 1
x = 10
while x < W - 10:
    w = rng.integers(7, 22); L = int(rng.choice([rng.integers(25, 70), rng.integers(70, 210)], p=[.65, .35]))
    for yy2 in range(int(top[x]) - 2, L):
        t = (yy2 - top[x]) / max(L - top[x], 1)
        ww = w * (1 - .45 * t) * (1 + .25 * np.sin(yy2 / 9))
        cv2.line(mask, (int(x - ww / 2), yy2), (int(x + ww / 2), yy2), 1, 1)
    cv2.circle(mask, (x, L), int(w * .62), 1, -1)
    # menisco entre el borde y la gota
    cv2.ellipse(mask, (x, int(top[x])), (int(w * 1.1), 6), 0, 0, 180, 1, -1)
    x += int(rng.integers(30, 120))
strip = shade(mask)
Image.fromarray(strip, 'RGBA').save('blood-drip.png')

# gota suelta
d = np.zeros((90, 50), np.uint8)
cv2.circle(d, (25, 62), 18, 1, -1)
pts = np.array([[25, 6], [10, 56], [40, 56]], np.int32); cv2.fillPoly(d, [pts], 1)
Image.fromarray(shade(d), 'RGBA').save('blood-drop.png')
c = Image.new('RGBA', (W, H + 100), (14, 13, 11, 255)); c.alpha_composite(Image.open('blood-drip.png')); c.alpha_composite(Image.open('blood-drop.png'), (700, H + 5))
c.convert('RGB').resize((800, 180)).save('blood-prev.png')
