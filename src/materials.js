import * as THREE from 'three';
const cache=new Map();
function randomGenerator(seed=19){return ()=>{seed=(Math.imul(seed,1664525)+1013904223)|0;return(seed>>>0)/4294967296;};}
// Seamless, bundled procedural PBR color maps: no network or CDN runtime dependency.
export function texture(kind){if(cache.has(kind))return cache.get(kind);const canvas=document.createElement('canvas');canvas.width=canvas.height=512;const ctx=canvas.getContext('2d'),rand=randomGenerator();
 const bases={wood:'#b69b76',marble:'#e7e4da',tile:'#dad5c9',fabric:'#d9d2c4',rug:'#c8bda6',bath:'#cdd0c8'};ctx.fillStyle=bases[kind]||'#fff';ctx.fillRect(0,0,512,512);
 if(kind==='wood'){
  for(let y=0;y<512;y++){ctx.fillStyle=`rgba(74,43,20,${.02+rand()*.12})`;ctx.fillRect(0,y,512,1);}
  for(let plank=0;plank<6;plank++){const y=plank*512/6;ctx.strokeStyle='rgba(57,42,22,.26)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(512,y);ctx.stroke();for(let j=0;j<22;j++){ctx.strokeStyle=`rgba(83,48,22,${rand()*.12})`;ctx.lineWidth=.5+rand();ctx.beginPath();let yy=y+rand()*80;ctx.moveTo(0,yy);for(let x=0;x<=512;x+=16)ctx.lineTo(x,yy+Math.sin(x/80+j)*2);ctx.stroke();}ctx.fillStyle='rgba(50,40,25,.28)';ctx.fillRect((plank%2?190:390),y,1,85);}
 }else if(kind==='marble'){
  for(let i=0;i<65;i++){ctx.strokeStyle=`rgba(115,111,96,${.015+rand()*.09})`;ctx.lineWidth=rand()*2;ctx.beginPath();const phase=rand()*6,base=rand()*1024-256;for(let x=0;x<514;x+=3){const y=(base+x*.43+Math.sin(x/47+phase)*13+Math.sin(x/17+phase)*3+512)%512;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}ctx.strokeStyle='rgba(130,126,113,.3)';ctx.strokeRect(0,0,512,512);
 }else if(kind==='tile'||kind==='bath'){
  const size=kind==='bath'?128:256;for(let y=0;y<512;y+=size)for(let x=0;x<512;x+=size){ctx.fillStyle=`rgba(255,255,255,${rand()*.13})`;ctx.fillRect(x,y,size,size);ctx.strokeStyle='#a8a99e';ctx.lineWidth=1.5;ctx.strokeRect(x+.75,y+.75,size-1.5,size-1.5);}
 }else{
  for(let y=0;y<512;y+=2){ctx.fillStyle=`rgba(80,70,51,${rand()*.1})`;ctx.fillRect(0,y,512,1);}for(let x=0;x<512;x+=2){ctx.fillStyle=`rgba(255,255,245,${rand()*.3})`;ctx.fillRect(x,0,1,512);}
  if(kind==='rug'){ctx.strokeStyle='rgba(72,59,46,.45)';for(let m=10;m<42;m+=9){ctx.lineWidth=2;ctx.strokeRect(m,m,512-2*m,512-2*m);}for(let x=65;x<460;x+=48)for(let y=65;y<460;y+=48){ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.strokeStyle='rgba(80,65,45,.22)';ctx.strokeRect(-10,-10,20,20);ctx.restore();}}
 }
 const data=ctx.getImageData(0,0,512,512);for(let i=0;i<data.data.length;i+=4){const n=(rand()-.5)*(kind==='fabric'?12:5);data.data[i]+=n;data.data[i+1]+=n;data.data[i+2]+=n;}ctx.putImageData(data,0,0);
 const tex=new THREE.CanvasTexture(canvas);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;cache.set(kind,tex);return tex;
}
export function floorMaterial(kind,w,d){const map=texture(kind).clone();map.repeat.set(w/(kind==='wood'?2.4:1.2),d/(kind==='wood'?2.4:1.2));return new THREE.MeshStandardMaterial({map,color:'#ffffff',roughness:kind==='marble'?.24:.64,metalness:kind==='marble'?.08:0});}
