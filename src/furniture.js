// Positions/orientations inferred from visible furniture in the source raster. Meters.
const f=(id,room,type,x,z,w,d,rot=0)=>({id,room,type,x,z,w,d,rot});
export const furniture=[
 f('b1-bed','bed1','bed',2.16,1.34,1.83,2.12),f('b1-n1','bed1','nightstand',.96,.44,.48,.48),f('b1-n2','bed1','nightstand',3.35,.44,.48,.48),f('b1-chair1','bed1','chair',3.88,1.2,.52,.56,-Math.PI/2),f('b1-chair2','bed1','chair',3.88,1.94,.52,.56,-Math.PI/2),f('b1-console','bed1','console',1.02,3.34,1.65,.35,Math.PI),
 f('b2-bed','bed2','bed',1.18,9.95,1.6,2.08,Math.PI/2),f('b2-n1','bed2','nightstand',.38,8.81,.46,.46),f('b2-n2','bed2','nightstand',.38,11.08,.46,.46),f('b2-seat','bed2','sofa',1.95,11.52,1.55,.66,Math.PI),f('b2-tv','bed2','console',3.57,10.08,1.45,.3,-Math.PI/2),
 f('b3-bed','bed3','bed',9.78,10.77,1.65,2.1,Math.PI),f('b3-n1','bed3','nightstand',8.7,11.57,.45,.45),f('b3-n2','bed3','nightstand',10.88,11.57,.45,.45),f('b3-chair1','bed3','chair',8.18,9.55,.52,.55,Math.PI/2),f('b3-chair2','bed3','chair',8.18,10.24,.52,.55,Math.PI/2),f('b3-console','bed3','console',10.6,8.31,1.5,.32),
 f('draw-sofa','drawing','sofa',8.08,.73,2.15,.86),f('draw-table','drawing','coffee',8.08,1.95,1.1,.65),f('draw-chair1','drawing','chair',7.55,3.12,.62,.65,Math.PI),f('draw-chair2','drawing','chair',8.55,3.12,.62,.65,Math.PI),
 f('lounge-sofa','lounge','sofa',4.51,7.55,1.85,.83,Math.PI/2),f('lounge-table','lounge','coffee',5.51,7.55,.62,1.1),f('lounge-loveseat','lounge','sofa',5.65,9.4,1.45,.62,Math.PI),f('lounge-console','lounge','console',7.43,7.85,.6,.22,-Math.PI/2),
 f('dining','lounge','dining',4.4,4.68,1.3,.8),f('dining-c1','lounge','diningchair',4.04,4.10,.43,.48),f('dining-c2','lounge','diningchair',4.78,4.10,.43,.48),f('dining-c3','lounge','diningchair',4.04,5.27,.43,.48,Math.PI),f('dining-c4','lounge','diningchair',4.78,5.27,.43,.48,Math.PI),
 f('kitchen-north','kitchen','cabinet',9.1,4.12,2.6,.6),f('kitchen-east','kitchen','sink',10.21,5.15,1.45,.6,-Math.PI/2),f('kitchen-south','kitchen','stove',9.52,5.65,1.25,.58,Math.PI),f('fridge','kitchen','fridge',8.15,5.6,.6,.62,Math.PI),
 f('bath1-shower','bath1','shower',.48,4.3,.88,.88),f('bath1-wc','bath1','toilet',.94,5.22,.5,.68),f('bath1-sink','bath1','basin',1.99,4.12,.6,.42),
 f('bath2-shower','bath2','shower',.48,7.12,.88,.88),f('bath2-wc','bath2','toilet',.95,6.2,.5,.68,Math.PI),f('bath2-sink','bath2','basin',1.99,7.32,.6,.42),
 f('bath3-shower','bath3','shower',11.2,7.43,.88,.88),f('bath3-wc','bath3','toilet',10.71,6.54,.5,.68),f('bath3-sink','bath3','basin',9.77,6.36,.6,.42),
 f('powder-wc','powder','toilet',11.13,.38,.45,.62),f('powder-basin','powder','basin',11.27,1.55,.4,.35),
 f('store-shelf','store','shelf',8.88,7.05,.35,1.55),
 f('terrace-chair1','terrace','chair',7.13,10.48,.52,.52,-Math.PI/2),f('terrace-chair2','terrace','chair',7.13,11.25,.52,.52,-Math.PI/2),f('terrace-table','terrace','coffee',6.44,10.87,.45,.45),
];
export const plants=[{room:'bed1',x:3.97,z:.4},{room:'drawing',x:9.96,z:.4},{room:'bed2',x:.4,z:8.16},{room:'bed3',x:11.2,z:11.6},{room:'terrace',x:4.25,z:11.26},{room:'terrace',x:4.9,z:11.26},{room:'balcony',x:-.53,z:2.4}];
export function furnitureBox(f){const swap=Math.abs(Math.sin(f.rot))>.5;return {id:f.id,x:f.x,z:f.z,w:swap?f.d:f.w,d:swap?f.w:f.d};}
