// Marco apaisado ligero (frame-wide2): grabado de Cuvillies (Cooper Hewitt CH 18238247, PD).
// Uso (desde la carpeta que contiene big/f247.jpg): node scripts/frame-wide2.mjs
// Tinta = lineas del grabado (hueso en noche, tinta negra en dia) sobre fondo transparente.
import {createRequire} from 'module'; const sharp=createRequire('C:/Users/Ana Arquelladas/Documents/GitHub/arcanasacra/package.json')('sharp');
const REPO='C:/Users/Ana Arquelladas/Documents/GitHub/arcanasacra/public/objetos/';
const X0=500,X1=2275,Y0=495,Y1=3010;      // recorte del grabado (sin filete de la lamina ni firma)
const HC=[1400,1900],HR=[682,672];         // hueco: centro y radios (px del original)
const SX=1.62, TW=1500;
const crop=sharp('big/f247.jpg').extract({left:X0,top:Y0,width:X1-X0,height:Y1-Y0}).grayscale().toColourspace('b-w');
const {data:g,info}=await crop.clone().raw().toBuffer({resolveWithObject:true});
const W=info.width,H=info.height;
const bgb=await crop.clone().blur(40).raw().toBuffer();
const ink=Buffer.alloc(W*H);
for(let i=0;i<W*H;i++){ink[i]=Math.min(1,Math.max(0,(bgb[i]-g[i]-10)/50))*255}
// hueco a 0 (elipse)
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const d=((x+X0-HC[0])/HR[0])**2+((y+Y0-HC[1])/HR[1])**2;if(d<1)ink[y*W+x]=0}
const W3=Math.round(W*SX);
let a=await sharp(ink,{raw:{width:W,height:H,channels:1}}).resize(W3,H,{kernel:'lanczos3',fit:'fill'}).blur(2.2).toColourspace('b-w').raw().toBuffer();
// engrosar un poco: realce de contraste de la tinta
for(let i=0;i<a.length;i++){a[i]=Math.round(Math.min(1,Math.max(0,(a[i]/255-.08)/.30))*255)}
// quitar motas sueltas: sin componentes pequenos (inundacion por etiquetas)
const lab=new Int32Array(W3*H),sizes=[];let n=0;const st=[];
for(let s=0;s<W3*H;s++){if(a[s]<90||lab[s])continue;n++;let c=0;st.push(s);lab[s]=n;const pix=[];
 while(st.length){const i=st.pop();pix.push(i);c++;const x=i%W3,y=(i/W3)|0;
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const nx=x+dx,ny=y+dy;if(nx<0||ny<0||nx>=W3||ny>=H)continue;const j=ny*W3+nx;if(a[j]>=90&&!lab[j]){lab[j]=n;st.push(j)}}}
 sizes[n]=c;if(c<900)for(const i of pix)a[i]=0}
const hx=Math.round((HC[0]-X0)*SX),hy=HC[1]-Y0,hrx=Math.round(HR[0]*SX),hry=HR[1];
let bx0=W3,by0=H,bx1=0,by1=0;for(let y=0;y<H;y++)for(let x=0;x<W3;x++)if(a[y*W3+x]>60){bx0=Math.min(bx0,x);bx1=Math.max(bx1,x);by0=Math.min(by0,y);by1=Math.max(by1,y)}
const bw=bx1-bx0+1,bh=by1-by0+1,th=Math.round(bh*TW/bw);
const pcx=v=>+((v)/bw*100).toFixed(2),pcy=v=>+((v)/bh*100).toFixed(2);
console.log('bbox',bw,bh,'out',TW,th,'hueco elipse centro %',pcx(hx-bx0),pcy(hy-by0),'radios %',pcx(hrx),pcy(hry),'bbox hueco %: left',pcx(hx-hrx-bx0),'top',pcy(hy-hry-by0),'w',pcx(2*hrx),'h',pcy(2*hry));
const BONE=[233,223,200],INK=[0x1a,0x16,0x11];
const night=Buffer.alloc(W3*H*4),day=Buffer.alloc(W3*H*4);
for(let i=0;i<W3*H;i++){for(let c=0;c<3;c++){night[i*4+c]=BONE[c];day[i*4+c]=INK[c]}night[i*4+3]=a[i];day[i*4+3]=a[i]}
for(const [buf,p] of [[night,REPO+'frame-wide2.webp'],[day,REPO+'ink/frame-wide2.webp']])
 await sharp(buf,{raw:{width:W3,height:H,channels:4}}).extract({left:bx0,top:by0,width:bw,height:bh}).resize(TW,th,{kernel:'lanczos3',fit:'fill'}).webp({quality:88,alphaQuality:92}).toFile(p);
await sharp(night,{raw:{width:W3,height:H,channels:4}}).extract({left:bx0,top:by0,width:bw,height:bh}).resize(1000).flatten({background:'#0e0d0b'}).jpeg().toFile('prev-frame2-night.jpg');
