// All dimensions are in METERS. +X right, +Z toward the bottom of the source image, +Y up.
// Dimensions are clear finished room dimensions, never scaled to fit the advertised area.
export const ft = (feet, inches = 0) => (feet * 12 + inches) * 0.0254;
export const GEOMETRY_STORAGE='karachi-residence-assumptions-v1';
export function validGeometry(value){
 if(!value||typeof value!=='object')throw Error('Invalid geometry settings.');
 const limits={height:[2.5,3.8],eye:[1.4,1.9],doorHeight:[1.95,2.4],windowSill:[.55,1.15],windowHeight:[1.1,1.8]};
 for(const [key,v] of Object.entries(value.config||{})){if(!limits[key]||!Number.isFinite(v)||v<limits[key][0]||v>limits[key][1])throw Error(`Invalid ${key} assumption.`);}
 for(const [id,v] of Object.entries(value.openings||{})){if(!id||typeof v!=='object'||!Number.isFinite(v.a)||!Number.isFinite(v.b)||v.b-v.a<.4999||v.b-v.a>3||Object.keys(v).some(key=>!['a','b','swing'].includes(key)))throw Error('Invalid opening coordinates.');if(v.swing!==undefined&&![1,-1].includes(v.swing))throw Error('Invalid door swing.');}
 return value;
}
export const geometryOverrides=(()=>{try{return typeof window==='undefined'?{}:validGeometry(JSON.parse(window.localStorage.getItem(GEOMETRY_STORAGE))||{});}catch{return{};}})();
export const CONFIG = { wall: ft(0,6), exteriorWall: ft(0,6), height: ft(10), eye: 1.65, radius: .22, doorHeight: ft(7), windowSill: .85, windowHeight: 1.5, entranceWidth: ft(3,6), doorWidth: .9, bathroomDoorWidth: .8,...geometryOverrides.config };
const room = (id,name,x,z,w,d,label,type='room') => ({ id,name,x,z,w,d,label,type });
export const rooms = [
  room('bed1','Bedroom 1',0,0,ft(14,6),ft(12),`14′6″ × 12′`,'bedroom'),
  room('drawing','Drawing room',5.7912,0,ft(15),ft(12),`15′ × 12′`,'drawing'),
  room('bed2','Bedroom 2',0,7.7724,ft(12,6),ft(14),`12′6″ × 14′`,'bedroom'),
  room('bed3','Bedroom 3',7.7724,8.0772,ft(12,6),ft(13),`12′6″ × 13′`,'bedroom'),
  room('lounge','Central lounge',3.9624,3.81,ft(12),ft(20),`12′ × 20′`,'lounge'),
  room('kitchen','Kitchen',7.7724,3.81,ft(9),ft(7),`9′ × 7′`,'kitchen'),
  room('bath1','Bathroom 1',0,3.81,ft(8),ft(6),`8′ × 6′`,'bath'),
  room('bath2','Bathroom 2',0,5.7912,ft(8),ft(6),`8′ × 6′`,'bath'),
  room('bath3','Bathroom 3',9.2964,6.096,ft(8),ft(6),`8′ × 6′`,'bath'),
  room('store','Store',7.7724,6.096,ft(4,6),ft(6),`4′6″ × 6′`,'store'),
  room('terrace','Terrace',3.9624,10.0584,ft(12),ft(5),`12′ × 5′`,'outdoor'),
  room('balcony','Balcony',-.9144,0,ft(2,6),ft(9),`2′6″ × 9′`,'outdoor'),
  room('powder','Powder room',10.5156,0,ft(3,6),ft(6),`3′6″ × 6′*`,'bath'),
  room('foyer','Entrance passage',4.572,0,1.0668,3.81,`3′6″ clear*`,'circulation'),
  room('hall','Dining / circulation',2.5908,3.81,1.3716,3.81,`4′0″ minimum clear*`,'circulation'),
];
export const byId = Object.fromEntries(rooms.map(r=>[r.id,r]));
// Wall centerlines lie half a thickness outside clear room bounds. Collinear overlaps are merged.
const t=CONFIG.wall/2;
const raw=[];
for(const r of rooms.filter(r=>!['foyer','hall'].includes(r.id))){
 const {x,z,w,d,id}=r;
 for(const [axis,c,a,b,side] of [['h',z-t,x-t,x+w+t,'n'],['h',z+d+t,x-t,x+w+t,'s'],['v',x-t,z-t,z+d+t,'w'],['v',x+w+t,z-t,z+d+t,'e']]){
  if(id==='lounge'&&side==='w'){raw.push({axis,c,a:7.6962,b,room:id});continue;}
  if(id==='balcony'&&side==='e')continue;
  raw.push({axis,c,a,b,room:id});
 }
}
// No invented partition between the entrance and lounge or between dining and lounge.
// Bridge ends of the west dining corridor; B1, bathrooms and B2 provide its other boundaries.
export const openings = [
 {id:'entrance',axis:'h',c:-t,a:4.572,b:5.6388,kind:'door',rooms:['outside','foyer'],assumed:true},
 {id:'entry-lounge',axis:'h',c:3.7338,a:4.4958,b:5.715,kind:'passage',rooms:['foyer','lounge'],assumed:true},
 {id:'bed1-door',axis:'v',c:4.4958,a:2.55,b:3.45,kind:'door',swing:-1,rooms:['foyer','bed1'],assumed:true},
 {id:'drawing-door',axis:'v',c:5.715,a:2.55,b:3.45,kind:'door',rooms:['foyer','drawing'],assumed:true},
 {id:'bed2-door',axis:'h',c:7.6962,a:2.75,b:3.65,kind:'door',rooms:['hall','bed2'],assumed:true},
 {id:'bed3-door',axis:'v',c:7.6962,a:8.25,b:9.15,kind:'door',rooms:['lounge','bed3'],assumed:true},
 {id:'kitchen-door',axis:'v',c:7.6962,a:4.16,b:5.21,kind:'passage',rooms:['lounge','kitchen'],assumed:true},
 {id:'bath1-door',axis:'v',c:2.5146,a:4.65,b:5.45,kind:'door',swing:-1,rooms:['hall','bath1'],assumed:true},
 {id:'bath2-door',axis:'v',c:2.5146,a:5.95,b:6.75,kind:'door',swing:-1,rooms:['hall','bath2'],assumed:true},
 {id:'store-door',axis:'v',c:7.6962,a:6.65,b:7.45,kind:'door',rooms:['lounge','store'],assumed:true},
 {id:'bath3-door',axis:'h',c:8.001,a:9.3,b:10.1,kind:'door',swing:-1,rooms:['bed3','bath3'],assumed:true},
 {id:'powder-door',axis:'v',c:10.4394,a:.8,b:1.55,kind:'door',rooms:['drawing','powder'],assumed:true},
 {id:'terrace-door',axis:'h',c:9.9822,a:4.12,b:5.32,kind:'door',rooms:['lounge','terrace'],assumed:true},
 {id:'balcony-door',axis:'v',c:-t,a:.35,b:1.15,kind:'door',rooms:['bed1','balcony'],assumed:true},
 {id:'bed1-window',axis:'h',c:-t,a:1.05,b:3.3,kind:'window',rooms:['bed1'],assumed:true},
 {id:'drawing-window',axis:'h',c:-t,a:7.2,b:8.9,kind:'window',rooms:['drawing'],assumed:true},
 {id:'drawing-east-window',axis:'v',c:10.4394,a:2.02,b:3.1,kind:'window',rooms:['drawing'],assumed:true},
 {id:'bed2-window',axis:'h',c:12.1158,a:1.05,b:2.8,kind:'window',rooms:['bed2'],assumed:true},
 {id:'bed2-west-window',axis:'v',c:-t,a:9.45,b:10.65,kind:'window',rooms:['bed2'],assumed:true},
 {id:'bed3-window',axis:'h',c:12.1158,a:9.0,b:10.5,kind:'window',rooms:['bed3'],assumed:true},
 {id:'kitchen-window',axis:'v',c:10.5918,a:4.35,b:5.35,kind:'window',rooms:['kitchen'],assumed:true},
 {id:'bath1-window',axis:'v',c:-t,a:4.15,b:4.65,kind:'window',rooms:['bath1'],assumed:true},
 {id:'bath2-window',axis:'v',c:-t,a:6.8,b:7.3,kind:'window',rooms:['bath2'],assumed:true},
 {id:'bath3-window',axis:'h',c:6.0198,a:10.86,b:11.36,kind:'window',rooms:['bath3'],assumed:true},
].map(o=>({...o,...geometryOverrides.openings?.[o.id]}));
raw.push({axis:'h',c:-t,a:4.4958,b:5.715,room:'foyer'});
// Close the tiny offset between store and main lounge / terrace junctions.
const round=n=>Math.round(n*10000)/10000;
const groups=new Map();
for(const w of raw){const key=`${w.axis}:${round(w.c)}`;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(w);}
export const walls=[];
for(const group of groups.values()){
 const axis=group[0].axis,c=round(group[0].c);
 const cuts=[...new Set(group.flatMap(w=>[round(w.a),round(w.b)]))].sort((a,b)=>a-b);
 for(let i=0;i<cuts.length-1;i++){
  const a=cuts[i],b=cuts[i+1],mid=(a+b)/2,owners=group.filter(w=>mid>w.a-.0001&&mid<w.b+.0001).map(w=>w.room);
  if(!owners.length)continue;
  const ops=openings.filter(o=>o.axis===axis&&Math.abs(o.c-c)<.001&&o.b>a&&o.a<b);
  const sub=[...new Set([a,b,...ops.flatMap(o=>[Math.max(a,o.a),Math.min(b,o.b)])])].sort((p,q)=>p-q);
  for(let j=0;j<sub.length-1;j++){const aa=sub[j],bb=sub[j+1];if(bb-aa<.001)continue;const op=ops.find(o=>(aa+bb)/2>o.a-.0001&&(aa+bb)/2<o.b+.0001);walls.push({id:`wall-${walls.length}`,axis,c,a:aa,b:bb,owners:[...new Set(owners)],opening:op?.id,kind:op?.kind||'solid',parapet:owners.every(id=>byId[id].type==='outdoor')});}
 }
}
export const assumptions = [
 {id:'scale',title:'Dimensioned reconstruction, not a measured survey',detail:'The raster is not uniformly to scale. Labeled clear dimensions are exact conversions; junction offsets are inferred. Exterior shape is not derived from the advertised 1554 ft².'},
 {id:'doors',title:'Door and window positions are provisional',detail:'Openings follow visible wall interruptions where legible. Exact widths, hinges, door swings, glazing and the third bathroom access cannot be resolved reliably. Bathroom 3 access from Bedroom 3 is assumed.'},
 {id:'balcony',title:'Balcony label differs from the brief',detail:'The source appears to read 9′ × 2′6″, not approximately 6′ × 2′6″. The reconstruction uses 9′. The narrow balcony is not wheelchair accessible.'},
 {id:'store',title:'Store label differs from the brief',detail:'The source appears to read 4′6″ × 6′0″, not 6′6″. Source dimensions are used.'},
 {id:'powder',title:'Powder room depth inferred',detail:'3′6″ width appears legible; 6′ depth and east-side drawing-room entry are inferred. The user may revise these in the coordinate JSON.'},
 {id:'standards',title:'Construction standards assumed',detail:'152.4 mm partitions, 3.048 m ceiling, 2.1336 m door height, 1.65 m eye height; 0.9 m bedroom doors, 0.8 m bath doors, 0.75 m powder door. Structural wall thickness and compass orientation are unknown. Sunlight direction is illustrative.'},
 {id:'furniture',title:'Furniture approximated from the raster',detail:'Bed, sofa and dining positions follow the image where readable. Exact products, depths, cabinetry, finishes, fixtures, ACs, fans and ceilings are design assumptions. Lounge furniture is sized to retain an eastern walking route.'},
 {id:'area',title:'Advertised area is a reference',detail:'1383 ft² net + 171 ft² circulation = 1554 ft² as printed. Modeled room sum and outer footprint are reported independently and are not asserted to match this marketing figure.'},
];
export const startPose = {position:[5.1,CONFIG.eye,-.65],target:[5.1,CONFIG.eye,5.4]};
export function wallBox(w){return w.axis==='h'?{x:(w.a+w.b)/2,z:w.c,w:w.b-w.a,d:CONFIG.wall}:{x:w.c,z:(w.a+w.b)/2,w:CONFIG.wall,d:w.b-w.a};}
export function roomAt(x,z){return rooms.find(r=>x>=r.x&&x<=r.x+r.w&&z>=r.z&&z<=r.z+r.d);}
export function doorBox(o,open){const width=o.b-o.a,mid=(o.a+o.b)/2,sign=o.swing||1;return o.axis==='h'?(open?{x:o.a+.035,z:o.c+sign*width/2,w:.07,d:width}:{x:mid,z:o.c,w:width,d:.065}):(open?{x:o.c+sign*width/2,z:o.a+.035,w:width,d:.07}:{x:o.c,z:mid,w:.065,d:width});}
export function isOnFloor(x,z,radius=.22){
 if(x>4.55&&x<5.66&&z>=-1.2&&z<.1)return true;
 return rooms.some(r=>x>=r.x-.08&&x<=r.x+r.w+.08&&z>=r.z-.08&&z<=r.z+r.d+.08);
}
export const structureSignature=JSON.stringify({rooms,walls,openings});
