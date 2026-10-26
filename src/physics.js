import {walls,openings,wallBox,doorBox,isOnFloor,CONFIG} from './architecture.js';
import {furniture,furnitureBox,plants} from './furniture.js';
export function intersects(x,z,b,r=CONFIG.radius){const cx=Math.max(b.x-b.w/2,Math.min(x,b.x+b.w/2)),cz=Math.max(b.z-b.d/2,Math.min(z,b.z+b.d/2));return (x-cx)**2+(z-cz)**2<r*r-1e-8;}
export const solids=walls.filter(w=>w.kind==='solid'||w.kind==='window').map(w=>({...wallBox(w),id:w.id}));
export const furnitureSolids=[...furniture.map(furnitureBox),...plants.map(p=>({x:p.x,z:p.z,w:.3,d:.3}))];
export function collision(x,z,doors={},includeFurniture=true){if(!isOnFloor(x,z))return true;return solids.some(b=>intersects(x,z,b))||openings.filter(o=>o.kind==='door').some(o=>intersects(x,z,doorBox(o,!!doors[o.id])))||(includeFurniture&&furnitureSolids.some(b=>intersects(x,z,b)));}
export function moveWithCollision(pos,dx,dz,doors){const steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.06));let x=pos.x,z=pos.z;for(let i=0;i<steps;i++){if(!collision(x+dx/steps,z,doors))x+=dx/steps;if(!collision(x,z+dz/steps,doors))z+=dz/steps;}return {x,z};}
export function nearestDoor(x,z,max=1.8){return openings.filter(o=>o.kind==='door').map(o=>({...o,distance:Math.hypot(x-(o.axis==='h'?(o.a+o.b)/2:o.c),z-(o.axis==='h'?o.c:(o.a+o.b)/2))})).filter(o=>o.distance<max).sort((a,b)=>a.distance-b.distance)[0];}
export function canCloseDoor(o,pos){return !intersects(pos.x,pos.z,doorBox(o,false),CONFIG.radius+.02);}
