# Retratos de Elvira para el marco rococó: recorte con la proporción del óvalo, iris borrados, alto contraste.
import json, subprocess, numpy as np, cv2
from PIL import Image
Image.MAX_IMAGE_PIXELS = None
ASPECT = 724 / 935
OPTS = {
  'a': dict(src='as-elvira-face.jpg', eyes=[(1440, 2124), (2250, 2120)], r=92, w=1700, ey=.38, thresh=-25),
  'b': dict(src='as-elv-9.jpg', eyes=[(944, 1586), (1656, 1470)], r=80, w=1500, ey=.40, thresh=-10),
  'c': dict(src='as-elv-10.jpg', eyes=[(1940, 1119), (2239, 1130)], r=33, w=1500, ey=.36, thresh=-15),
}
meta = {}
for k, o in OPTS.items():
    img = cv2.imread(o['src'])
    mx = (o['eyes'][0][0] + o['eyes'][1][0]) / 2; my = (o['eyes'][0][1] + o['eyes'][1][1]) / 2
    W = o['w']; H = round(W / ASPECT); x0 = int(mx - W / 2); y0 = int(my - o['ey'] * H)
    crop = img[y0:y0 + H, x0:x0 + W].copy()
    m = np.zeros(crop.shape[:2], np.uint8)
    for (ex, ey) in o['eyes']: cv2.circle(m, (ex - x0, ey - y0), int(o['r'] * 1.15), 255, -1)
    crop = cv2.inpaint(crop, m, int(o['r'] * .2) + 3, cv2.INPAINT_TELEA)
    cv2.imwrite(f'med-{k}-src.jpg', crop)
    subprocess.run(['python3', '/home/claude/arcanasacra/scripts/contrast.py', f'med-{k}-src.jpg', f'out/med-{k}-raw.png', '--width', '760', '--nocut', '--thresh', str(o['thresh'])], check=True, capture_output=True)
    im = np.asarray(Image.open(f'out/med-{k}-raw.png').convert('RGBA')).astype(np.float32)
    h, w = im.shape[:2]
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    e = ((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2
    im[..., 3] = np.clip((1 - e) / .01, 0, 1) * 255
    Image.fromarray(im.astype(np.uint8), 'RGBA').save(f'out/med-{k}.png')
    eyes = [dict(x=round((ex - x0) / W * 100, 2), y=round((ey - y0) / H * 100, 2)) for ex, ey in o['eyes']]
    meta[k] = dict(eyes=eyes, iris=round(2.1 * o['r'] / W * 100, 2), rx=round(2.0 * o['r'] / W * 100, 2), ry=round(1.05 * o['r'] / H * 100, 2))
json.dump(meta, open('med-meta.json', 'w'), indent=1); print(json.dumps(meta))
ims = [Image.open(f'out/med-{k}.png') for k in OPTS]
c = Image.new('RGBA', (sum(i.width for i in ims) + 40, ims[0].height), (14, 13, 11, 255)); x = 0
for i in ims: c.alpha_composite(i, (x, 0)); x += i.width + 20
c.convert('RGB').resize((c.width // 2, c.height // 2)).save('med-prev.png')
