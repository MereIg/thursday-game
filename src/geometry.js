// Gameplay geometry is authored data. Never infer it from an image or its alpha.
export const GEOMETRY_VERSION=1;
export const CHARACTER_BODY=Object.freeze({x:-9,y:-5,w:18,h:10});
export const OBJECT_TYPES=Object.freeze({
  CHARACTER:{solid:true,radius:58,body:CHARACTER_BODY}, CHAIR:{solid:true,radius:36,footprint:[48,32],attachment:"sitAnchor"},
  TABLE_SMALL:{solid:true,radius:40,footprint:[80,48]}, TABLE_LARGE:{solid:true,radius:44,footprint:[160,64]},
  BED:{solid:true,radius:40,footprint:[112,176],attachment:"lieAnchor"}, SOFA:{solid:true,radius:40,footprint:[168,48],attachment:"sitAnchor"},
  DOOR:{solid:false,radius:28,footprint:[0,0],attachment:"entryAnchor"}, COUNTER:{solid:true,radius:42,footprint:[160,48]},
  WALL:{solid:true,radius:0,footprint:[32,32]}, NPC_INTERACTION:{solid:false,radius:58,footprint:[0,0]}, ITEM_PICKUP:{solid:false,radius:30,footprint:[0,0],attachment:"handAnchor"}
});
export const rectPolygon=r=>[[r.x,r.y],[r.x+r.w,r.y],[r.x+r.w,r.y+r.h],[r.x,r.y+r.h]];
export function pointInPolygon(p,poly){
  let inside=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const [ax,ay]=poly[i],[bx,by]=poly[j];
    const cross=(p.x-ax)*(by-ay)-(p.y-ay)*(bx-ax);
    if(Math.abs(cross)<.001&&p.x>=Math.min(ax,bx)&&p.x<=Math.max(ax,bx)&&p.y>=Math.min(ay,by)&&p.y<=Math.max(ay,by))return true;
    if((ay>p.y)!==(by>p.y)&&p.x<(bx-ax)*(p.y-ay)/(by-ay)+ax)inside=!inside;
  }
  return inside;
}
export const bodyAt=p=>({x:p.x+CHARACTER_BODY.x,y:p.y+CHARACTER_BODY.y,w:CHARACTER_BODY.w,h:CHARACTER_BODY.h});
export const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
// SAT handles the convex, manually-authored collision polygons in this project.
export function polygonOverlap(a,b){
  for(const poly of [a,b])for(let i=0;i<poly.length;i++){
    const next=poly[(i+1)%poly.length],edge=poly[i],nx=-(next[1]-edge[1]),ny=next[0]-edge[0];
    const aa=a.map(p=>p[0]*nx+p[1]*ny),bb=b.map(p=>p[0]*nx+p[1]*ny);
    if(Math.max(...aa)<=Math.min(...bb)||Math.max(...bb)<=Math.min(...aa))return false;
  }
  return true;
}
export function canStand(map,p,ignoreObject=null){
  if(!map?.geometry||!Number.isFinite(p.x)||!Number.isFinite(p.y))return false;
  const body=bodyAt(p),corners=rectPolygon(body);
  if(!corners.every(([x,y])=>pointInPolygon({x,y},map.geometry.floor)))return false;
  return !map.geometry.objects.some(o=>o.id!==ignoreObject&&o.collision.some(shape=>Array.isArray(shape)?polygonOverlap(corners,shape):overlaps(body,shape)));
}
export function sightClear(map,a,b){
  const d=Math.hypot(b.x-a.x,b.y-a.y),steps=Math.max(1,Math.ceil(d/4));
  for(let i=1;i<steps;i++){
    const p={x:a.x+(b.x-a.x)*i/steps,y:a.y+(b.y-a.y)*i/steps};
    if(!pointInPolygon(p,map.geometry.floor)||map.geometry.objects.some(o=>o.collision.some(s=>pointInPolygon(p,Array.isArray(s)?s:rectPolygon(s)))))return false;
  }
  return true;
}
export function canInteract(map,actor,target){
  const a=target.interactionAnchor;
  return !!a&&Math.hypot(actor.x-a.x,actor.y-a.y)<=target.interactionRadius&&sightClear(map,actor,a);
}
export function moveBody(map,p,dx,dy,actors=[]){
  // Substeps prevent tunnelling at low frame rates or after a large movement request.
  const count=Math.max(1,Math.ceil(Math.max(Math.abs(dx),Math.abs(dy))/4));
  for(let n=0;n<count;n++)for(const [axis,amount] of [["x",dx/count],["y",dy/count]]){
    const next={...p,[axis]:p[axis]+amount};
    const blockedByActor=actors.some(a=>{
      if(a.attached||!overlaps(bodyAt(next),bodyAt(a)))return false;
      // A schedule change may put a stationary NPC on an occupied square.
      // Let the player separate, never move deeper into the overlap or get trapped.
      if(overlaps(bodyAt(p),bodyAt(a)))return Math.hypot(next.x-a.x,next.y-a.y)<=Math.hypot(p.x-a.x,p.y-a.y);
      return true;
    });
    if(canStand(map,next)&&!blockedByActor)p[axis]=next[axis];
  }
  return p;
}
export function bodyClear(map,a,b){
  const steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/4));
  for(let i=0;i<=steps;i++)if(!canStand(map,{x:a.x+(b.x-a.x)*i/steps,y:a.y+(b.y-a.y)*i/steps}))return false;
  return true;
}
const grids=new WeakMap();
function navigationGrid(map){
  if(grids.has(map))return grids.get(map);
  const step=8,cols=120,rows=68,valid=new Uint8Array(cols*rows),point=i=>({x:(i%cols)*step+4,y:Math.floor(i/cols)*step+4});
  for(let i=0;i<valid.length;i++)valid[i]=canStand(map,point(i))?1:0;
  const grid={step,cols,rows,valid,point};grids.set(map,grid);return grid;
}
export function findPath(map,start,end){
  if(!canStand(map,start)||!canStand(map,end))return null;
  if(bodyClear(map,start,end))return [{...end}];
  const g=navigationGrid(map),{cols,valid,point}=g;
  const closest=p=>{
    const candidates=[];
    for(let i=0;i<valid.length;i++)if(valid[i]){const q=point(i),d=Math.hypot(q.x-p.x,q.y-p.y);if(d<=24)candidates.push({i,d});}
    return candidates.sort((a,b)=>a.d-b.d).find(c=>bodyClear(map,p,point(c.i)))?.i;
  };
  const from=closest(start),to=closest(end);if(from===undefined||to===undefined)return null;
  const parent=new Int32Array(valid.length).fill(-1),queue=new Int32Array(valid.length);let head=0,tail=1;
  queue[0]=from;parent[from]=from;
  while(head<tail&&parent[to]===-1){
    const current=queue[head++],x=current%cols;
    for(const next of [x>0?current-1:-1,x<cols-1?current+1:-1,current-cols,current+cols]){
      if(next<0||next>=valid.length||!valid[next]||parent[next]!==-1)continue;
      if(!bodyClear(map,point(current),point(next)))continue;
      parent[next]=current;queue[tail++]=next;
    }
  }
  if(parent[to]===-1)return null;
  const path=[{...end}];for(let i=to;i!==from;i=parent[i])path.push(point(i));path.push(point(from));path.reverse();
  // String-pull along collision-tested segments: no stair-stepping on touch.
  const smooth=[];let origin=start,index=0;
  while(index<path.length){let far=index;while(far+1<path.length&&bodyClear(map,origin,path[far+1]))far++;smooth.push(path[far]);origin=path[far];index=far+1;}
  return smooth;
}
export function safeSpawn(map,point){
  if(canStand(map,point))return {...point};
  // Recovery is for old saves, never for quietly fixing invalid authored spawns.
  return {...map.spawn};
}
export function npcAnchor(map,id){return map.geometry.npcs[id];}
export function drawPlacement(spec,point,scale=1){
  const factor=spec.scale*scale;
  return {x:point.x-spec.anchor.x*factor,y:point.y-spec.anchor.y*factor,w:spec.cell.w*factor,h:spec.cell.h*factor};
}
// Actual foot landmarks in the shipped cells, not cell centres or alpha bounds.
const walk=(art,rows)=>({art,cols:4,rows,cell:{w:64,h:80},anchor:{x:32,y:78},scale:1});
const pose=(art,index,x=56,y=157,scale=.5)=>({art,index,cols:3,rows:2,cell:{w:112,h:160},anchor:{x,y},scale});
export const SPRITE_SPECS={
  player:walk("alexWalk",4),mara:walk("maraWalk",4),cast:walk("castDirections",6),
  mug:pose("maraActionsEveryday",0,44,157,.4),phone:pose("maraActionsEveryday",1,53),read:pose("maraActionsEveryday",2,55),
  wave:pose("maraActionsEveryday",3,55),hugSelf:pose("maraActionsEveryday",4,51),stand:pose("maraActionsEveryday",5),
  wipeTears:pose("maraActionsDistress",0,57),tremble:pose("maraActionsDistress",1,54),collapse:pose("maraActionsDistress",2,40,156,.34),
  clutchSleeve:pose("maraActionsDistress",3,54),angryCry:pose("maraActionsDistress",4,57),abruptStill:pose("maraActionsDistress",5,55)
};
export const POSE_AUDIT=["down","left","right","up",...Object.keys(SPRITE_SPECS).filter(k=>!["player","mara","cast"].includes(k))];
