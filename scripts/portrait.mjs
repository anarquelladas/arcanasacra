// uso: node portrait.mjs nombre
import {createRequire} from 'module'; const sharp=createRequire('C:/Users/Ana Arquelladas/Documents/GitHub/arcanasacra/package.json')('sharp');
import fs from 'fs';
const REPO='C:/Users/Ana Arquelladas/Documents/GitHub/arcanasacra/public/objetos/';
const ASPECT=1.65, OW=1200;
const OPTS={
 'elvira-d':{src:'big/k80s.jpg',eyes:[[1210,902],[1534,899]],r:40,w:3300,ey:.45,thresh:-30},
 'elvira-e':{src:'big/k97.jpg',eyes:[[1585,519],[1699,520]],r:12,w:1100,ey:.40,thresh:-15},
 'elvira-f':{src:'big/c36.jpg',eyes:[[1938,1118],[2236,1133]],r:33,w:1898,ey:.37,thresh:25},
};
const name=process.argv[2]; const o=OPTS[name]; if(process.argv[3])o.thresh=+process.argv[3];
const W=o.w,H=Math.round(W/ASPECT);
const mx=(o.eyes[0][0]+o.eyes[1][0])/2,my=(o.eyes[0][1]+o.eyes[1][1])/2;
let x0=Math.round(mx-W/2),y0=Math.round(my-o.ey*H);
const meta=await sharp(o.src).metadata(); x0=Math.max(0,Math.min(meta.width-W,x0)); y0=Math.max(0,Math.min(meta.height-H,y0));
const {data:cg}=await sharp(o.src).extract({left:x0,top:y0,width:W,height:H}).grayscale().toColourspace('b-w').raw().toBuffer({resolveWithObject:true});
// borrar iris: elipse del globo ocular en blanco con borde suave
for(const [ex,ey] of o.eyes){const cx=ex-x0,cy=ey-y0,ax=1.75*o.r,ay=.95*o.r;
 for(let y=Math.floor(cy-ay-1);y<=cy+ay+1;y++)for(let x=Math.floor(cx-ax-1);x<=cx+ax+1;x++){const d=Math.sqrt(((x-cx)/ax)**2+((y-cy)/ay)**2);if(d>=1)continue;const w=Math.min(1,(1-d)*4);const i=y*W+x;cg[i]=cg[i]+(245-cg[i])*w}}
const k=OW/W,h=Math.round(H*k);
const g0=await sharp(cg,{raw:{width:W,height:H,channels:1}}).resize(OW,h,{fit:'fill'}).toColourspace('b-w').raw().toBuffer();
const gc=await sharp(g0,{raw:{width:OW,height:h,channels:1}}).clahe({width:Math.round(OW/8),height:Math.round(h/8),maxSlope:3}).toColourspace('b-w').raw().toBuffer();
const mean=await sharp(gc,{raw:{width:OW,height:h,channels:1}}).blur(12).toColourspace('b-w').raw().toBuffer();
// Otsu
const hist=new Array(256).fill(0);for(const v of g0)hist[v]++;let tot=g0.length,sum=0;for(let i=0;i<256;i++)sum+=i*hist[i];let sB=0,wB=0,best=0,t=0;
for(let i=0;i<256;i++){wB+=hist[i];if(!wB)continue;const wF=tot-wB;if(!wF)break;sB+=i*hist[i];const d=(sB/wB-(sum-sB)/wF);const v=wB*wF*d*d;if(v>best){best=v;t=i}}
// ruido
let seed=1;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const nz=Buffer.alloc(OW*h);let ns=0;for(let i=0;i<nz.length;i++){nz[i]=Math.round(rnd()*255)}
const nb=await sharp(nz,{raw:{width:OW,height:h,channels:1}}).blur(.9).toColourspace('b-w').raw().toBuffer();
let m=0,s2=0;for(const v of nb){m+=v}m/=nb.length;for(const v of nb)s2+=(v-m)**2;const sd=Math.sqrt(s2/nb.length);
const light=new Uint8Array(OW*h);
for(let i=0;i<light.length;i++){let L=(g0[i]>t+o.thresh&&gc[i]>mean[i]-12)?255:0;if((nb[i]-m)/sd>2.2)L=0;light[i]=L}
const lb=await sharp(Buffer.from(light),{raw:{width:OW,height:h,channels:1}}).blur(.6).toColourspace('b-w').raw().toBuffer();
const BONE=[233,223,200],INK=[14,13,11];
const night=Buffer.alloc(OW*h*4),day=Buffer.alloc(OW*h*4);
for(let i=0;i<lb.length;i++){const l=lb[i]/255;for(let c=0;c<3;c++)night[i*4+c]=INK[c]+(BONE[c]-INK[c])*l;night[i*4+3]=255;
 day[i*4]=0x1a;day[i*4+1]=0x16;day[i*4+2]=0x11;day[i*4+3]=Math.round((1-l)*255)}
await sharp(night,{raw:{width:OW,height:h,channels:4}}).webp({quality:84}).toFile(REPO+name+'.webp');
await sharp(day,{raw:{width:OW,height:h,channels:4}}).webp({quality:84,alphaQuality:90}).toFile(REPO+'ink/'+name+'.webp');
await sharp(night,{raw:{width:OW,height:h,channels:4}}).resize(800).jpeg().toFile('prev-'+name+'.jpg');
const pc=(v,d)=>+(v/d*100).toFixed(2);
console.log(name,'t',t,'size',OW,h,JSON.stringify({eyes:o.eyes.map(([ex,ey])=>[pc(ex-x0,W),pc(ey-y0,H)]),iris:pc(2.1*o.r,W),rx:pc(2*o.r,W),ry:pc(1.05*o.r,H)}));
