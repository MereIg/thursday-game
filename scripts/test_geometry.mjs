import assert from "node:assert/strict";
import { MAPS, SCHEDULES, DAY_SCHEDULES, maraSchedule } from "../src/data.js";
import { canStand, canInteract, findPath, moveBody, bodyAt, overlaps, OBJECT_TYPES, SPRITE_SPECS, drawPlacement, CHARACTER_BODY, rectPolygon } from "../src/geometry.js";

const failures=[];let paths=0,spawnChecks=0,bodySteps=0;
const check=(ok,message)=>{if(!ok)failures.push(message);};
const finite=p=>p&&Number.isFinite(p.x)&&Number.isFinite(p.y);
for(const [id,map] of Object.entries(MAPS)){
  const geo=map.geometry;
  check(geo?.floor?.length>=3,`${id}: missing floor`);
  check(canStand(map,map.spawn),`${id}: spawn blocked`);
  const ids=new Set();
  for(const obj of geo.objects){
    check(!ids.has(obj.id),`${id}: duplicate object ${obj.id}`);ids.add(obj.id);
    check(!!OBJECT_TYPES[obj.type],`${id}.${obj.id}: missing object template`);
    check(finite(obj.ground),`${id}.${obj.id}: missing ground anchor`);
    check(Array.isArray(obj.collision),`${id}.${obj.id}: missing collision definition`);
    check(!!obj.visual?.bounds,`${id}.${obj.id}: missing visual bounds`);
    for(const shape of obj.collision){
      const points=Array.isArray(shape)?shape:rectPolygon(shape);
      check(points.every(([x,y])=>Number.isFinite(x)&&Number.isFinite(y)&&x>=0&&x<=960&&y>=0&&y<=540),`${id}.${obj.id}: collision outside room`);
    }
    for(const [key,p] of Object.entries(obj.attachments)){
      check(finite(p),`${id}.${obj.id}.${key}: invalid attachment`);
      if(key==="interactionAnchor"||key==="standAnchor")check(canStand(map,p),`${id}.${obj.id}.${key}: blocked approach`);
    }
  }
  for(const target of [...map.props,...map.exits]){
    const label=`${id}.${target.id||target.to}`;
    check(finite(target.ground),`${label}: missing ground point`);
    check(finite(target.interactionAnchor),`${label}: missing interaction anchor`);
    check(canStand(map,target.interactionAnchor),`${label}: blocked interaction`);
    check(canInteract(map,target.interactionAnchor,target),`${label}: cannot interact from its own approach`);
    const path=findPath(map,map.spawn,target.interactionAnchor);
    check(!!path,`${label}: disconnected from spawn`);
    if(path){
      paths++;const actor={...map.spawn};
      for(const end of path){
        const count=Math.ceil(Math.hypot(end.x-actor.x,end.y-actor.y)/2),dx=(end.x-actor.x)/count,dy=(end.y-actor.y)/count;
        for(let i=0;i<count;i++){moveBody(map,actor,dx,dy);bodySteps++;check(canStand(map,actor),`${label}: movement entered solid`);}
      }
      check(Math.hypot(actor.x-target.interactionAnchor.x,actor.y-target.interactionAnchor.y)<1,`${label}: movement did not reach target`);
    }
    if(target.to)check(canStand(MAPS[target.to],{x:target.tx,y:target.ty}),`${label}: destination blocked`);
  }
  for(const [npc,p] of Object.entries(geo.npcs))check(canStand(map,p),`${id}.${npc}: NPC anchor blocked`);
}
// Check every schedule slice, including weekends, distant sightings and overlaps.
for(let day=1;day<=12;day++)for(let time=420;time<1440;time+=10){
  const present=[];
  for(const [id,regular] of Object.entries(SCHEDULES)){
    const block=(DAY_SCHEDULES[day]?.[id]||regular).find(b=>time>=b.from&&time<b.to);
    if(block)present.push({id,map:block.map});
  }
  const mara=maraSchedule({day,time,flags:{}});if(mara)present.push({id:"mara",map:mara.map});
  for(const actor of present){
    const p=MAPS[actor.map].geometry.npcs[actor.id];spawnChecks++;
    check(p&&canStand(MAPS[actor.map],p),`Day ${day}, ${time}: ${actor.id} missing/blocked in ${actor.map}`);
    if(!p)continue;
    for(const other of present)if(other.id>actor.id&&other.map===actor.map){const q=MAPS[actor.map].geometry.npcs[other.id];if(q)check(!overlaps(bodyAt(p),bodyAt(q)),`NPC overlap: ${actor.map} ${actor.id}/${other.id}`);}
  }
}
// Pose switches do not change world position, feet collider, or depth point.
const foot={x:493,y:381};
for(const [name,spec] of Object.entries(SPRITE_SPECS)){
  const place=drawPlacement(spec,foot);
  assert.equal(place.x+spec.anchor.x*spec.scale,foot.x,name);
  assert.equal(place.y+spec.anchor.y*spec.scale,foot.y,name);
  assert.deepEqual(bodyAt(foot),{x:484,y:376,w:18,h:10});
  check(spec.anchor.x>=0&&spec.anchor.x<spec.cell.w&&spec.anchor.y>=0&&spec.anchor.y<spec.cell.h,`${name}: anchor outside cell`);
}
assert.ok(Object.isFrozen(CHARACTER_BODY));
// A large frame must not tunnel through the test room wall.
const p={x:510,y:340};moveBody(MAPS.geometrylab,p,200,0);check(p.x<534,"large movement crossed wall");
const occupied={x:490,y:420};moveBody(MAPS.geometrylab,occupied,30,0,[{x:490,y:420}]);check(occupied.x===520,"schedule overlap trapped the player");
const approaching={x:450,y:420};moveBody(MAPS.geometrylab,approaching,60,0,[{x:490,y:420}]);check(approaching.x<=472,"player walked through an NPC");
// No interaction through furniture just because its radius reaches another side.
const counter=MAPS.geometrylab.props.find(p=>p.id==="counter");check(!canInteract(MAPS.geometrylab,{x:354,y:180},counter),"interaction through counter");
if(failures.length){console.error([...new Set(failures)].join("\n"));process.exit(1);}
console.log(`Geometry: ${Object.keys(MAPS).length} rooms, ${paths} connected approach routes, ${bodySteps} movement steps, ${spawnChecks} schedule spawns, ${Object.keys(SPRITE_SPECS).length} anchored sprite states PASS.`);
