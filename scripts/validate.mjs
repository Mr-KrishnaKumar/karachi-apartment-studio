import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {rooms,walls,openings,CONFIG,ft,byId,wallBox,structureSignature} from '../src/architecture.js';
import {collision,intersects,moveWithCollision,solids} from '../src/physics.js';
import {furniture,furnitureBox} from '../src/furniture.js';
import {presets,roomDesign} from '../src/designs.js';
const checks=[];
function test(name,fn){try{const detail=fn();checks.push({name,passed:true,detail});console.log('PASS',name,detail||'');}catch(e){checks.push({name,passed:false,error:e.message});console.error('FAIL',name,e.message);}}
test('Exact imperial conversions',()=>{assert.equal(ft(1),.30479999999999996);assert.ok(Math.abs(ft(14,6)-4.4196)<1e-10);assert.ok(Math.abs(ft(0,1)-.0254)<1e-10);});
test('Room count and required spaces',()=>{assert.equal(rooms.filter(r=>r.type==='bedroom').length,3);assert.equal(rooms.filter(r=>r.type==='drawing').length,1);assert.equal(rooms.filter(r=>r.id.startsWith('bath')).length,3);for(const id of ['kitchen','store','powder','terrace','balcony','lounge','foyer'])assert.ok(byId[id]);});
test('All labeled rooms have the stated clear dimensions',()=>{for(const [id,w,d] of [['bed1',ft(14,6),ft(12)],['drawing',ft(15),ft(12)],['bed2',ft(12,6),ft(14)],['bed3',ft(12,6),ft(13)],['lounge',ft(12),ft(20)],['kitchen',ft(9),ft(7)],['bath1',ft(8),ft(6)],['bath2',ft(8),ft(6)],['bath3',ft(8),ft(6)]]){assert.equal(byId[id].w,w);assert.equal(byId[id].d,d);}});
test('Clear room rectangles do not overlap',()=>{const list=rooms.filter(r=>r.type!=='circulation');for(let i=0;i<list.length;i++)for(let j=i+1;j<list.length;j++){const a=list[i],b=list[j],x=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x),z=Math.min(a.z+a.d,b.z+b.d)-Math.max(a.z,b.z);assert.ok(!(x>.0001&&z>.0001),`${a.id} overlaps ${b.id}`);}});
test('Shared store/bathroom wall is aligned',()=>{assert.ok(Math.abs(byId.store.x+byId.store.w+CONFIG.wall-byId.bath3.x)<1e-9);return 'Store east and bathroom west share one wall centerline.';});
test('Wall centerline segments do not duplicate each other',()=>{for(let i=0;i<walls.length;i++)for(let j=i+1;j<walls.length;j++){const a=walls[i],b=walls[j];if(a.axis===b.axis&&Math.abs(a.c-b.c)<.0001)assert.ok(Math.min(a.b,b.b)-Math.max(a.a,b.a)<.0001,`${a.id} / ${b.id}`);}});
test('Door opening coverage and minimum clear width',()=>{for(const o of openings.filter(o=>o.kind==='door')){const segments=walls.filter(w=>w.opening===o.id),width=segments.reduce((n,w)=>n+w.b-w.a,0);assert.ok(Math.abs(width-(o.b-o.a))<.001,`${o.id} has unmatched geometry (${width})`);assert.ok(o.b-o.a>=.7499,`${o.id} narrower than assumption`);}return `Minimum provisional door: 0.75 m; walk collider diameter ${CONFIG.radius*2} m.`;});
test('Furniture stays inside its assigned room or shared dining space',()=>{for(const f of furniture){const r=byId[f.room],b=furnitureBox(f),minX=f.id.startsWith('dining')?byId.hall.x:r.x;assert.ok(b.x-b.w/2>=minX-.001&&b.x+b.w/2<=r.x+r.w+.001&&b.z-b.d/2>=r.z-.001&&b.z+b.d/2<=r.z+r.d+.001,`${f.id} outside ${r.id}`);}});
test('Preset switching never changes structure',()=>{const before=structureSignature;for(const p of presets)for(const r of rooms){const style=roomDesign({preset:p.id,overrides:{}},r.id);assert.ok(style.wall&&style.wood&&style.floor);assert.equal(structureSignature,before);}assert.equal(presets.length,6);});
test('Closed entrance blocks entry; open entrance admits entry',()=>{assert.ok(collision(5.1,-.0762,{},false));assert.equal(collision(5.1,-.0762,{entrance:true},false),false);});
test('Sliding movement cannot tunnel through walls',()=>{const pos=moveWithCollision({x:3.9,z:1.5},2,0,{});assert.ok(pos.x<4.3);return `Stopped at x=${pos.x.toFixed(3)} m before Bedroom 1 east wall.`;});
test('All rooms are reachable from the entrance with doors open and furniture present',()=>{
 const doors=Object.fromEntries(openings.filter(o=>o.kind==='door').map(o=>[o.id,true]));
 const step=.055,minX=-1.2,minZ=-1.2,nx=Math.ceil((12.2-minX)/step),nz=Math.ceil((12.6-minZ)/step),grid=new Uint8Array(nx*nz),seen=new Uint8Array(nx*nz);
 for(let j=0;j<nz;j++)for(let i=0;i<nx;i++)grid[j*nx+i]=collision(minX+i*step,minZ+j*step,doors)?1:0;
 const sx=Math.round((5.1-minX)/step),sz=Math.round((-.65-minZ)/step),start=sz*nx+sx,queue=new Int32Array(nx*nz);assert.equal(grid[start],0);let head=0,tail=1;queue[0]=start;seen[start]=1;
 while(head<tail){const k=queue[head++],i=k%nx,j=Math.floor(k/nx);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const ni=i+dx,nj=j+dz,n=nj*nx+ni;if(ni<0||nj<0||ni>=nx||nj>=nz||grid[n]||seen[n])continue;seen[n]=1;queue[tail++]=n;}}
 const report=rooms.map(r=>{let count=0;for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const x=minX+i*step,z=minZ+j*step;if(x>r.x+.1&&x<r.x+r.w-.1&&z>r.z+.1&&z<r.z+r.d-.1&&seen[j*nx+i])count++;}return{room:r.id,reachableCells:count};});
 writeFileSync('docs/navigation-report.json',JSON.stringify({gridStep:step,playerRadius:CONFIG.radius,allDoorsOpen:true,gridReachable:tail,rooms:report,limitation:'This verifies a human walking collider, not wheelchair accessibility or exact door swept-volume clearance.'},null,2));
 const failed=report.filter(r=>r.reachableCells<4);assert.equal(failed.length,0,`Unreachable: ${failed.map(r=>r.room).join(', ')}`);return `${rooms.length} spaces reachable on a ${step} m grid with furniture and open door leaves.`;
});
writeFileSync('docs/validation-report.json',JSON.stringify({timestamp:new Date().toISOString(),checks},null,2));
console.log(`${checks.filter(c=>c.passed).length}/${checks.length} checks passed.`);if(checks.some(c=>!c.passed))process.exitCode=1;
