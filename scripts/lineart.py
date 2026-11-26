# Grabados de línea sobre papel: silueta rellena (hueso) con la tinta en negro.
import sys, numpy as np, cv2
from scipy import ndimage as nd
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
dil = int(sys.argv[3]) if len(sys.argv) > 3 else 9
mode = sys.argv[4] if len(sys.argv) > 4 else 'ink'
BONE = np.array([233, 223, 200]); INK = np.array([14, 13, 11])
img = cv2.imread(src); h, w = img.shape[:2]
g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
if mode == 'sat':   # objeto saturado (dorado) sobre fondo gris
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    ink = (hsv[..., 1] > 70) & (hsv[..., 2] > 40)
elif mode == 'white':  # objeto sobre fondo blanco liso
    ink = g < 228
else:
    ink = g < 150
ink = cv2.morphologyEx(ink.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (dil, dil))
m = cv2.dilate(ink, k)
m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (dil * 2 + 1, dil * 2 + 1)))
m = nd.binary_fill_holes(m).astype(np.uint8)
n, lab, st, _ = cv2.connectedComponentsWithStats(m)
if n > 1:
    big = st[1:, cv2.CC_STAT_AREA].max()
    m = np.isin(lab, [i for i in range(1, n) if st[i, cv2.CC_STAT_AREA] > big * .03]).astype(np.uint8)
alpha = cv2.GaussianBlur(m.astype(np.float32), (0, 0), 1.0)
inside = g[m > 0]
t, _ = cv2.threshold(inside.reshape(-1, 1), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
light = (g > t).astype(np.float32)
rng = np.random.default_rng(2)
noise = cv2.GaussianBlur(rng.standard_normal((h, w)).astype(np.float32), (0, 0), .9)
light = np.where(noise > 2.2, 0, light); light = cv2.GaussianBlur(light, (0, 0), .6)
rgb = INK + (BONE - INK) * light[..., None]
out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
ys, xs = np.where(alpha > .05); out = out[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
im = Image.fromarray(out, 'RGBA')
if im.width > 900: im = im.resize((900, round(im.height * 900 / im.width)), Image.LANCZOS)
im.save(dst); print('ok', dst, im.size, 'crop', xs.min(), ys.min())
