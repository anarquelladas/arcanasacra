import {createRequire} from 'module'; const sharp=createRequire('C:/Users/Ana Arquelladas/Documents/GitHub/arcanasacra/package.json')('sharp');
const REPO='C:/Users/Ana Arquelladas/Documents/GitHub/arcanasacra/public/objetos/';
const meta=await sharp('big/f167.jpg').metadata(); const f=meta.width/1328;
const D=v=>Math.round(v*f);
const X0=290,Y0=370,X1=1020,Y1=1480;
const CUT0=1060,CUT1=1230, SX=1.45;
const HOLE=[418,738,905,1335];
// 1. tinta relativa al papel
const crop=sharp('big/f167.jpg').extract({left:D(X0),top:D(Y0),width:D(X1)-D(X0),height:D(Y1)-D(Y0)}).grayscale().toColourspace('b-w');
const {data:g,info}=await crop.clone().raw().toBuffer({resolveWithObject:true});
const bgb=await crop.clone().blur(30).raw().toBuffer();console.log('bgb',bgb.length);
const W=info.width,H=info.height;console.log('ch',info.channels,W,H,g.length);
const ink=Buffer.alloc(W*H);
for(let i=0;i<W*H;i++){const v=Math.min(1,Math.max(0,(bgb[i]-g[i]-14)/45));ink[i]=v*255}
// hueco interior a 0
const hx0=D(HOLE[0]-X0),hy0=D(HOLE[1]-Y0),hx1=D(HOLE[2]-X0),hy1=D(HOLE[3]-Y0);
for(let y=hy0;y<hy1;y++)for(let x=hx0;x<hx1;x++)ink[y*W+x]=0;
await sharp(ink,{raw:{width:W,height:H,channels:1}}).resize(500).png().toFile('dbg-ink0.png');
// 2.
const c0=D(CUT0-Y0),c1=D(CUT1-Y0);
const rows=[...Array(H).keys()].filter(y=>y<c0||y>=c1);
const H2=rows.length; const ink2=Buffer.alloc(W*H2);
rows.forEach((y,j)=>ink.copy(ink2,j*W,y*W,(y+1)*W));
console.log('H2',H2,ink2.length,W*H2);await sharp(ink2,{raw:{width:W,height:H2,channels:1}}).resize(500).png().toFile('dbg-ink2.png');
const W3=Math.round(W*SX);
const ink3=await sharp(ink2,{raw:{width:W,height:H2,channels:1}}).resize(W3,H2,{kernel:'lanczos3',fit:'fill'}).toColourspace('b-w').raw().toBuffer();
const hole={x0:Math.round(hx0*SX),x1:Math.round(hx1*SX),y0:hy0,y1:hy1-(c1-c0)};
// 4. silueta: cerrar y rellenar
const hard=Buffer.alloc(W3*H2);for(let i=0;i<W3*H2;i++)hard[i]=ink3[i]>80?255:0;
let sil=await sharp(hard,{raw:{width:W3,height:H2,channels:1}}).blur(7).toColourspace('b-w').raw().toBuffer();
for(let i=0;i<sil.length;i++)sil[i]=sil[i]>12?255:0;
sil=await sharp(sil,{raw:{width:W3,height:H2,channels:1}}).blur(14).toColourspace('b-w').raw().toBuffer();   // cierre
for(let i=0;i<sil.length;i++)sil[i]=sil[i]>200?255:0;
// huecos: inundación desde el borde
const out=new Uint8Array(W3*H2);const st=[];
const push=(x,y)=>{const i=y*W3+x;if(!out[i]&&sil[i]===0){out[i]=1;st.push(i)}};
for(let x=0;x<W3;x++){push(x,0);push(x,H2-1)}for(let y=0;y<H2;y++){push(0,y);push(W3-1,y)}
while(st.length){const i=st.pop(),x=i%W3,y=(i/W3)|0;if(x>0)push(x-1,y);if(x<W3-1)push(x+1,y);if(y>0)push(x,y-1);if(y<H2-1)push(x,y+1)}
const alpha=Buffer.alloc(W3*H2);
for(let y=0;y<H2;y++)for(let x=0;x<W3;x++){const i=y*W3+x;const inHole=x>=hole.x0&&x<hole.x1&&y>=hole.y0&&y<hole.y1;alpha[i]=(out[i]||inHole)?0:255}
const alphaS=await sharp(alpha,{raw:{width:W3,height:H2,channels:1}}).blur(1.2).toColourspace('b-w').raw().toBuffer();
// 5. bbox
let bx0=W3,by0=H2,bx1=0,by1=0;for(let y=0;y<H2;y++)for(let x=0;x<W3;x++)if(alphaS[y*W3+x]>40){bx0=Math.min(bx0,x);bx1=Math.max(bx1,x);by0=Math.min(by0,y);by1=Math.max(by1,y)}
console.log('bbox',bx0,by0,bx1,by1,'hole%',((hole.x0-bx0)/(bx1-bx0)*100).toFixed(2),((hole.x1-bx0)/(bx1-bx0)*100).toFixed(2),((hole.y0-by0)/(by1-by0)*100).toFixed(2),((hole.y1-by0)/(by1-by0)*100).toFixed(2),'ratio',(bx1-bx0)/(by1-by0));
const BONE=[233,223,200],INK=[14,13,11];
const night=Buffer.alloc(W3*H2*4),day=Buffer.alloc(W3*H2*4);
for(let i=0;i<W3*H2;i++){const k=ink3[i]/255>0.45?1:0;const a=alphaS[i];
 for(let c=0;c<3;c++){night[i*4+c]=k?INK[c]:BONE[c];}
 night[i*4+3]=a;
 day[i*4]=0x1a;day[i*4+1]=0x16;day[i*4+2]=0x11;day[i*4+3]=Math.round(Math.min(1,ink3[i]/255*1.4)*a);}
const bw=bx1-bx0+1,bh=by1-by0+1,TW=1500,th=Math.round(bh*TW/bw);
for(const [buf,p] of [[night,REPO+'frame-wide.webp'],[day,REPO+'ink/frame-wide.webp']])
 await sharp(buf,{raw:{width:W3,height:H2,channels:4}}).extract({left:bx0,top:by0,width:bw,height:bh}).resize(TW,th,{kernel:'lanczos3',fit:'fill'}).webp({quality:86,alphaQuality:90}).toFile(p);
// prueba sobre negro y sobre papel
await sharp(night,{raw:{width:W3,height:H2,channels:4}}).extract({left:bx0,top:by0,width:bw,height:bh}).resize(1000).flatten({background:'#0e0d0b'}).jpeg().toFile('prev-frame-night.jpg');
await sharp(day,{raw:{width:W3,height:H2,channels:4}}).extract({left:bx0,top:by0,width:bw,height:bh}).resize(1000).flatten({background:'#e9dfc8'}).jpeg().toFile('prev-frame-day.jpg');
await sharp(ink3,{raw:{width:W3,height:H2,channels:1}}).resize(900).png().toFile('dbg-ink.png');
await sharp(alphaS,{raw:{width:W3,height:H2,channels:1}}).resize(900).png().toFile('dbg-alpha.png');
