import { createRequire } from 'module';import fs from 'fs';
const sharp=createRequire('C:/Users/Ana Arquelladas/Documents/GitHub/arcanasacra/package.json')('sharp');
sharp.cache(false);
const BONE=[0xe9,0xdf,0xc8],INK=[0x1a,0x16,0x11];
const G=(w,h)=>({raw:{width:w,height:h,channels:1}});
const blur=async(b,w,h,s)=>sharp(b,G(w,h)).blur(s).toColourspace('b-w').raw().toBuffer();
function dilate(a,w,h,r){if(!r)return a;const prof=[];for(let dy=-r;dy<=r;dy++)prof.push([dy,Math.floor(Math.sqrt(r*r-dy*dy))]);const o=Buffer.alloc(w*h);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(!a[y*w+x])continue;for(const[dy,dx]of prof){const yy=y+dy;if(yy<0||yy>=h)continue;o.fill(255,yy*w+x-Math.min(dx,x),yy*w+Math.min(w-1,x+dx)+1)}}return o}
// cfg: crop[l,t,r,b] fracciones; kind: 'dark' (fondo negro, objeto claro: encaje), 'obj' (objeto sobre fondo liso claro), 'line' (grabado sobre papel)
async function run(name,cfg){
 let img=sharp('raw/'+cfg.src+'.jpg');const m0=await img.metadata();
 if(cfg.crop){const[l,t,r,b]=cfg.crop;img=img.extract({left:Math.round(l*m0.width),top:Math.round(t*m0.height),width:Math.round((r-l)*m0.width),height:Math.round((b-t)*m0.height)});}
 const {data:rgb,info}=await img.resize({width:cfg.width||900,height:cfg.maxH||1000,fit:'inside'}).removeAlpha().raw().toBuffer({resolveWithObject:true});
 const w=info.width,h=info.height,N=w*h;const L=Buffer.alloc(N);
 for(let i=0;i<N;i++)L[i]=Math.round(.3*rgb[i*3]+.59*rgb[i*3+1]+.11*rgb[i*3+2]);
 const M=await blur(L,w,h,cfg.sigma||8);
 let ink=Buffer.alloc(N),sil=Buffer.alloc(N,255);
 if(cfg.kind==='dark'){ // encaje claro sobre negro
   for(let i=0;i<N;i++){ink[i]=L[i]>M[i]+(cfg.bias??2)&&L[i]>(cfg.floor||60)?255:0;}
   sil=ink;
   var night=ink,day=ink;
 }else{
   // fondo = mediana de los bordes
   const e=[];for(let x=0;x<w;x+=3){e.push(L[x],L[(h-1)*w+x]);}for(let y=0;y<h;y+=3){e.push(L[y*w],L[y*w+w-1]);}e.sort((a,b)=>a-b);const bg=e[e.length>>1];
   const D=await blur(L,w,h,1.5);
   if(cfg.kind==='obj'){
     for(let i=0;i<N;i++)sil[i]=Math.abs(D[i]-bg)>(cfg.diff||14)?255:0;
     const sc=await blur(sil,w,h,3);for(let i=0;i<N;i++)sil[i]=sc[i]>110?255:0;
     // quitar motas: abrir via erosion/dilatacion ligera ya hecha por blur
     const rim=Buffer.alloc(N);const inv=Buffer.from(sil.map(v=>255-v));const bi=await blur(inv,w,h,cfg.rim||2.2);
     for(let i=0;i<N;i++)rim[i]=sil[i]&&bi[i]>30?255:0;
     const dk=Buffer.alloc(N),lt=Buffer.alloc(N);
     for(let i=0;i<N;i++){const s=sil[i]>0;dk[i]=s&&L[i]<M[i]-(cfg.bias??3)?255:0;lt[i]=s&&L[i]>M[i]+(cfg.bias??3)?255:0;}
     var night=Buffer.alloc(N),day=Buffer.alloc(N);
     for(let i=0;i<N;i++){night[i]=(lt[i]||rim[i])?255:0;day[i]=(dk[i]||rim[i])?255:0;}
     if(cfg.invert){for(let i=0;i<N;i++){night[i]=(dk[i]||rim[i])?255:0;day[i]=(lt[i]||rim[i])?255:0;}}
   }else{ // line
     for(let i=0;i<N;i++)ink[i]=L[i]<M[i]-(cfg.bias??10)&&L[i]<(cfg.ceil||170)?255:0;
     night=ink;day=ink;
   }
 }
 const R=cfg.thick??1;
 const res={};
 for(const[k,b]of[['night',night],['day',day]]){
  const d=dilate(b,w,h,R);const a=await blur(d,w,h,.6);
  const out=Buffer.alloc(N*4),C=k==='night'?BONE:INK;
  for(let i=0;i<N;i++){out[i*4]=C[0];out[i*4+1]=C[1];out[i*4+2]=C[2];out[i*4+3]=a[i];}
  await sharp(out,{raw:{width:w,height:h,channels:4}}).webp({quality:90,alphaQuality:100}).toFile(`out/${name}${k==='day'?'-ink':''}.webp`);
 }
}
const J=JSON.parse(fs.readFileSync(process.argv[2]));
for(const[n,c]of Object.entries(J))await run(n,c);
