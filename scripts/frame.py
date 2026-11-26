import numpy as np, cv2
from PIL import Image
from scipy import ndimage as nd
Image.MAX_IMAGE_PIXELS=None
img=cv2.imread('as-frame.jpg'); g=cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
x0,y0,x1,y1=360,560,2270,3330
g=g[y0:y1,x0:x1].astype(np.float32); h,w=g.shape
# inner oval (hatched) in crop coords
cx,cy,rx,ry=938,1522,508,708
yy,xx=np.mgrid[0:h,0:w].astype(np.float32)
e=((xx-cx)/rx)**2+((yy-cy)/ry)**2
bg=cv2.GaussianBlur(g,(0,0),40)
ink=np.clip((bg-g-18)/50,0,1)          # tinta relativa al papel
ink[e<1.0]=0; ink[:, :45]=0; ink[:, -45:]=0
# limpieza: quitar motas sueltas
hard=(ink>.35).astype(np.uint8)
n,lab,st,_=cv2.connectedComponentsWithStats(hard)
keep=np.zeros(n,bool); keep[1:]=st[1:,cv2.CC_STAT_AREA]>25
ink=ink*keep[lab]
# silueta para versión "sello"
sil=cv2.morphologyEx(cv2.dilate((ink>.3).astype(np.uint8),np.ones((9,9),np.uint8)),cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(25,25)))
sil=nd.binary_fill_holes(sil).astype(np.uint8)
n2,lab2,st2,_=cv2.connectedComponentsWithStats(sil)
sil=(lab2==1+np.argmax(st2[1:,cv2.CC_STAT_AREA])).astype(np.float32); sil[e<1.0]=0
ink=ink*(sil>0)
sil=cv2.GaussianBlur(sil,(0,0),1.2)
ys,xs=np.where(sil>.05); b=(ys.min(),ys.max()+1,xs.min(),xs.max()+1)
print('bbox',b,'oval center in out',(cx-b[2])/(b[3]-b[2]),(cy-b[0])/(b[1]-b[0]),'rx%',rx/(b[3]-b[2]),'ry%',ry/(b[1]-b[0]))
BONE=np.array([233,223,200]);INK=np.array([14,13,11])
def save(rgb,a,name,sc=1100):
    out=np.dstack([rgb,a*255]).astype(np.uint8)[b[0]:b[1],b[2]:b[3]]
    im=Image.fromarray(out,'RGBA'); im=im.resize((round(im.width*sc/im.height),sc),Image.LANCZOS); im.save(name)
# A: líneas hueso
save(np.broadcast_to(BONE,(h,w,3)).astype(float),ink,'out/frame-line.png')
# B: sello (silueta hueso con tinta negra)
light=1-(ink>.45)
save(INK+(BONE-INK)*light[...,None],sil,'out/frame-stamp.png')
