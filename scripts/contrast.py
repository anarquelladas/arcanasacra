"""Convierte una foto o grabado de un objeto en imagen de ALTO CONTRASTE recortada.

  python3 scripts/contrast.py entrada.jpg public/objetos/nombre.webp [--width 900] [--thresh 0]

- Recorta el objeto del fondo (GrabCut de OpenCV, partiendo de un marco interior).
- Lo pasa a blanco y negro duro, como un sello: tinta negra donde la foto es oscura,
  color hueso donde es clara. Fuera del objeto queda transparente.
- --thresh ajusta el corte (-30 más claro … +30 más oscuro).
"""
import argparse, numpy as np, cv2
from scipy import ndimage as nd
from PIL import Image

BONE = (233, 223, 200)
INK = (14, 13, 11)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('dst')
    ap.add_argument('--width', type=int, default=900)
    ap.add_argument('--thresh', type=int, default=0)
    ap.add_argument('--margin', type=float, default=.02)
    ap.add_argument('--nocut', action='store_true', help='no recortar el fondo')
    ap.add_argument('--diff', type=float, default=0, help='sumar a la máscara lo que se aleje del color del fondo (0 = no)')
    ap.add_argument('--nofill', action='store_true', help='no rellenar huecos de la máscara (fondo entre brazos, etc.)')
    ap.add_argument('--outline', type=int, default=0, help='filete color hueso de N px alrededor del recorte (para objetos oscuros)')
    a = ap.parse_args()

    img = cv2.imread(a.src, cv2.IMREAD_COLOR)
    h, w = img.shape[:2]
    s = min(1.0, 1800 / max(h, w))
    img = cv2.resize(img, (int(w * s), int(h * s)), interpolation=cv2.INTER_AREA)
    h, w = img.shape[:2]

    # 1. máscara del objeto
    if a.nocut:
        mask = np.ones((h, w), np.uint8)
    else:
        # GrabCut en pequeño (rápido) y la máscara se reescala
        ss = min(1.0, 600 / max(h, w))
        small = cv2.resize(img, (int(w * ss), int(h * ss)), interpolation=cv2.INTER_AREA)
        sh, sw = small.shape[:2]
        m = np.zeros((sh, sw), np.uint8)
        mx, my = int(sw * a.margin), int(sh * a.margin)
        bg, fg = np.zeros((1, 65), np.float64), np.zeros((1, 65), np.float64)
        cv2.grabCut(small, m, (mx, my, sw - 2 * mx, sh - 2 * my), bg, fg, 5, cv2.GC_INIT_WITH_RECT)
        m = cv2.resize(np.where((m == 1) | (m == 3), 255, 0).astype(np.uint8), (w, h), interpolation=cv2.INTER_LINEAR)
        mask = (m > 127).astype(np.uint8)
        # además: todo lo que se aleja del color del fondo (mediana del borde)
        border = np.concatenate([img[0], img[-1], img[:, 0], img[:, -1]]).astype(np.float32)
        diff = np.linalg.norm(img.astype(np.float32) - np.median(border, 0), axis=2)
        if a.diff: mask |= (diff > a.diff).astype(np.uint8)
        k = max(9, int(max(h, w) * .025)) | 1
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k)))
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
        n, lab, stats, _ = cv2.connectedComponentsWithStats(mask)
        if n > 1:  # quedarse con las piezas grandes
            keep = [i for i in range(1, n) if stats[i, cv2.CC_STAT_AREA] > 0.02 * stats[1:, cv2.CC_STAT_AREA].max()]
            mask = np.isin(lab, keep).astype(np.uint8)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((15, 15), np.uint8))
        if not a.nofill: mask = nd.binary_fill_holes(mask).astype(np.uint8)
        mask = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 1.2)

    # 2. blanco y negro duro con algo de detalle local
    g0 = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    g = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)).apply(g0)
    inside = g0[mask > .5] if (mask > .5).any() else g0.ravel()
    t, _ = cv2.threshold(inside.reshape(-1, 1), 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    loc = cv2.adaptiveThreshold(g, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 41, 12)
    light = ((g0 > t + a.thresh) & (loc > 0)).astype(np.float32)  # 1 = hueso, 0 = tinta

    # 3. grano de sello
    rng = np.random.default_rng(1)
    noise = cv2.GaussianBlur(rng.standard_normal((h, w)).astype(np.float32), (0, 0), .9)
    light = np.where(noise > 2.2, 0, light)
    light = cv2.GaussianBlur(light, (0, 0), .6)

    if a.outline:
        hard = (mask > .5).astype(np.uint8)
        k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * a.outline + 1, 2 * a.outline + 1))
        ring = cv2.dilate(hard, k) - hard
        light = np.maximum(light, ring.astype(np.float32))
        mask = np.maximum(mask, cv2.GaussianBlur(cv2.dilate(hard, k).astype(np.float32), (0, 0), 1.0))
    rgb = np.zeros((h, w, 3), np.float32)
    for c in range(3):
        rgb[..., c] = INK[c] + (BONE[c] - INK[c]) * light
    alpha = np.clip(mask, 0, 1) * 255
    out = np.dstack([rgb, alpha]).astype(np.uint8)
    ys, xs = np.where(alpha > 10)
    y0, x0 = ys.min(), xs.min()
    out = out[y0:ys.max() + 1, x0:xs.max() + 1]
    im = Image.fromarray(out, 'RGBA')
    k = 1.0
    if im.width > a.width:
        k = a.width / im.width
        im = im.resize((a.width, round(im.height * k)), Image.LANCZOS)
    print('crop', int(x0 / s), int(y0 / s), 'escala', k * s)
    im.save(a.dst, quality=86, method=6) if a.dst.endswith('.webp') else im.save(a.dst)
    print('ok', a.dst, im.size)

if __name__ == '__main__':
    main()
