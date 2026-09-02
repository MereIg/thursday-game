import { MAPS, CHARACTERS, SCHEDULES, ITEMS, QUESTS, RANDOM_EVENTS } from "./data.js";
import { readFileSync } from "node:fs";
import { canStand, canInteract } from "./geometry.js";

const errors=[];
for(const [id,map] of Object.entries(MAPS)){
  if(!map.name||!map.kind||!map.music)errors.push(`Map ${id} is missing presentation data`);
  for(const exit of map.exits||[]){
    if(!MAPS[exit.to])errors.push(`Map ${id} exits to missing map ${exit.to}`);
    if(!Number.isFinite(exit.tx)||!Number.isFinite(exit.ty))errors.push(`Map ${id} has an exit without a destination point`);
  }
  const propIds=new Set();
  for(const prop of map.props||[]){if(propIds.has(prop.id))errors.push(`Duplicate prop ${prop.id} in ${id}`);propIds.add(prop.id);}
  const reachable=obj=>canStand(map,obj.interactionAnchor)&&canInteract(map,obj.interactionAnchor,obj);
  for(const exit of map.exits||[])if(!reachable(exit))errors.push(`Exit ${exit.label} is not interactable in ${id}`);
  for(const prop of map.props||[])if(!reachable(prop))errors.push(`Prop ${prop.id} is not interactable in ${id}`);
}
for(const [id,blocks] of Object.entries(SCHEDULES)){
  if(!CHARACTERS[id])errors.push(`Schedule references missing character ${id}`);
  for(const b of blocks){if(!MAPS[b.map])errors.push(`${id} scheduled in missing map ${b.map}`);if(b.to<=b.from)errors.push(`${id} has invalid schedule range`);}
}
for(const event of RANDOM_EVENTS){for(const place of event.places)if(!MAPS[place])errors.push(`Event ${event.id} references missing map ${place}`);}
const reachableMaps=new Set(["bedroom"]),queue=["bedroom"];
while(queue.length){const id=queue.shift();for(const e of MAPS[id].exits||[])if(!reachableMaps.has(e.to)){reachableMaps.add(e.to);queue.push(e.to);}}
for(const id of Object.keys(MAPS))if(!MAPS[id].debugOnly&&!reachableMaps.has(id))errors.push(`Map ${id} is disconnected from the playable world`);
for(const [id,c] of Object.entries(CHARACTERS)){
  if(!c.sprite?.hairStyle||!c.sprite?.legs||!c.sprite?.shoes)errors.push(`Character ${id} is missing complete sprite art data`);
}
const gameSource=readFileSync(new URL("./game.js",import.meta.url),"utf8");
const methods=[...gameSource.matchAll(/^  ([A-Za-z][A-Za-z0-9_]*)\([^\n]*\)\{/gm)].map(m=>m[1]);
for(const name of new Set(methods))if(methods.filter(m=>m===name).length>1)errors.push(`Duplicate Game method ${name}`);
const implementedActions=new Set([...gameSource.matchAll(/action===["']([^"']+)["']/g)].map(m=>m[1]));
for(const [mapId,map] of Object.entries(MAPS))for(const prop of map.props||[]){
  const implemented=implementedActions.has(prop.action)||(prop.action.startsWith("class_")&&gameSource.includes('action.startsWith("class_")'));
  if(!implemented)errors.push(`Prop ${prop.id} in ${mapId} uses unimplemented action ${prop.action}`);
}
if(Object.keys(ITEMS).length<10)errors.push("Opening item pool is unexpectedly small");
if(Object.keys(QUESTS).length<5)errors.push("Opening quest pool is unexpectedly small");

if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log(`Validated ${Object.keys(MAPS).length} maps, ${Object.keys(CHARACTERS).length} characters, ${RANDOM_EVENTS.length} rare events, and ${Object.keys(ITEMS).length} items.`);
