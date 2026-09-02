// Headless logic regression tests. These do not substitute for visual/browser QA.
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import * as data from "../src/data.js";
import * as ambient from "../src/content/ambient.js";
import * as geometry from "../src/geometry.js";
import * as streetArt from "../src/street-art.js";

const storage=new Map(), calls=[],drawCalls=[];
const drawing=new Proxy({},{get:(target,name)=>target[name]||(name==="measureText"?(text)=>({width:text.length*8}):(...args)=>drawCalls.push([name,...args]))});
const element={dataset:{},classList:{add(){}},addEventListener(){},getContext(){return drawing;}};
const context=vm.createContext({
  ...data,...ambient,...geometry,...streetArt, URL,URLSearchParams,console,Math,Date,Uint8Array,Int32Array,
  location:{search:""},performance:{now:()=>0},window:{},
  document:{querySelector:()=>element,querySelectorAll:()=>[],createElement:()=>element},
  localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,value)},
  addEventListener(){},requestAnimationFrame(){},setTimeout(){},
  Image:class{set src(value){this.onload?.();}},
  music:new Proxy({},{get:(_,name)=>(...args)=>calls.push([name,...args])})
});
const source=readFileSync(new URL("../src/game.js",import.meta.url),"utf8")
  .replace(/^import\s[\s\S]*?;\r?$/gm,"")
  .replaceAll("import.meta.url",JSON.stringify(new URL("../src/game.js",import.meta.url).href));
vm.runInContext(source+"\nwindow.TEST={Game,newState,ART_FILES};",context);
const {Game,newState,ART_FILES}=context.window.TEST;
const game=context.window.THURSDAY;
let tests=0;
function test(name,fn){fn();tests++;console.log(`PASS ${name}`);}

test("every runtime image exists",()=>{
  for(const [id,[path]] of Object.entries(ART_FILES))assert.ok(existsSync(new URL(path,new URL("../src/game.js",import.meta.url))),id);
});
test("three manual saves stay separate from autosave",()=>{
  storage.clear();game.state=newState();game.state.money=11;game.save(true,1);
  game.state.money=22;game.save(true,2);game.state.money=33;game.save(true,3);
  game.state.money=44;game.save(false);
  for(const [slot,money] of [[1,11],[2,22],[3,33],[0,44]]){game.load(slot);assert.equal(game.state.money,money);}
});
test("Continue selects a newer autosave, including slot zero",()=>{
  const raw=JSON.parse(storage.get("mara-autosave-v2"));raw.savedAt=Date.now()+10000;storage.set("mara-autosave-v2",JSON.stringify(raw));
  game.mode="title";game.overlayIndex=0;game.pressed.add("Enter");game.updateTitle(1/60);
  assert.equal(game.state.money,44);assert.equal(game.mode,"play");
});
test("legacy migration preserves original and never overwrites manual slot",()=>{
  storage.clear();const old=newState();old.version=1;old.day=5;old.money=71;
  const original=JSON.stringify(old);storage.set("thursday-save-v1",original);game.migrateLegacySave();
  assert.equal(storage.get("thursday-save-v1"),original);game.load(1);assert.equal(game.state.day,5);assert.equal(game.state.version,2);
  const slot=storage.get("mara-save-v2-1");old.money=1;storage.set("thursday-save-v1",JSON.stringify(old));game.migrateLegacySave();assert.equal(storage.get("mara-save-v2-1"),slot);
});
test("invalid settings cannot poison volume or text-speed controls",()=>{
  storage.set("mara-settings-v1",JSON.stringify({textSpeed:"broken",music:5,voice:-1,sfx:"loud",readable:"false"}));
  const settings=game.readSettings();assert.equal(settings.textSpeed,"normal");assert.equal(settings.music,1);assert.equal(settings.voice,0);assert.equal(settings.sfx,.7);assert.equal(settings.readable,false);
});
test("calendar advances from day five through twelve without ending early",()=>{
  game.state=newState();game.state.day=5;game.state.flags.metMara=true;
  for(let day=6;day<=12;day++){game.sleep();assert.equal(game.state.day,day);assert.equal(game.state.chapterComplete,false);assert.ok(data.DAY_CARDS.find(x=>x.day===day));assert.ok(game.state.corruption<=3);}
  assert.ok(game.state.flags.investigationUnlocked);assert.ok(game.state.messages.mara.some(x=>x.text==="don't take the train today"));
  game.sleep();assert.equal(game.state.day,12);assert.equal(game.state.flags.fridayLooped,true);
});
test("weekend schedules only reference real maps and valid times",()=>{
  for(const overrides of Object.values(data.DAY_SCHEDULES))for(const [id,blocks] of Object.entries(overrides)){assert.ok(data.CHARACTERS[id]);for(const block of blocks){assert.ok(data.MAPS[block.map]);assert.ok(block.to>block.from);}}
});
test("ambient dialogue is branchable and evening-only lines respect time",()=>{
  for(let seed=1;seed<100;seed++){const s={seed,day:3,time:650};const node=ambient.maraAmbientNode(s,seed);assert.equal(node.choices.length,2);assert.ok(!node.minTime);for(const id of ["iris","june","theo","ren","nia","sam"])assert.equal(ambient.castAmbientNode(id,s,seed).choices.length,2);}
  assert.equal(Object.values(ambient.AMBIENT_COUNTS).reduce((a,b)=>a+b,0),38);
});
test("following silence and restart occur once, not every frame",()=>{
  game.state=newState();game.startFollow();calls.length=0;const f=game.follow;
  for(let i=0;i<1000;i++){f.suspicion=0;f.playerX=f.maraX-200;game.updateFollow(1/60);}
  assert.equal(calls.filter(x=>x[0]==="setScene"&&x[1]==="silence").length,1);
  assert.equal(calls.filter(x=>x[0]==="setScene"&&x[1]==="stalking").length,1);
});
test("settings and manual-slot panels respond to pointer input",()=>{
  game.settings=game.readSettings();game.previousMode="title";game.mode="settings";game.mouse={x:660,y:110,clicked:true};game.updateSettings();assert.equal(game.settings.textSpeed,"fast");
  game.mode="slots";game.slotMode="save";game.previousMode="pause";game.mouse={x:480,y:220,clicked:true};game.state.money=91;game.updateSlots();assert.equal(JSON.parse(storage.get("mara-save-v2-2")).state.money,91);
});
test("instant dialogue reveals all text without a voice burst",()=>{
  calls.length=0;game.settings.textSpeed="instant";game.mouse.clicked=false;game.pressed.clear();
  game.startDialogue([{speaker:"Mara",portrait:"mara",text:"Wait. I had something to tell you."}]);game.updateDialogue(1/60);
  assert.equal(game.dialogueReveal,game.dialogue[0].text.length);assert.equal(calls.filter(x=>x[0]==="voice").length,0);
});
test("annex finale is gated until day twelve",()=>{
  game.state=newState();game.state.day=11;game.state.flags.boxSeen=true;game.state.flags.photosSeen=true;game.redDoor();assert.equal(game.state.flags.redDoorSeen,undefined);
  game.state.day=12;game.redDoor();assert.equal(game.state.flags.redDoorSeen,true);assert.equal(game.state.chapterComplete,false);
});
test("every map transition lands at a valid authored entry",()=>{
  for(const [id,map] of Object.entries(data.MAPS))for(const exit of map.exits){
    game.state=newState();game.state.map=id;game.state.player={...map.spawn};game.changeMap(exit);
    assert.equal(game.state.map,exit.to);assert.ok(geometry.canStand(data.MAPS[exit.to],game.state.player),`${id} -> ${exit.to}`);
  }
});
test("old saves blocked by new furniture recover without rewriting the saved file",()=>{
  game.state=newState();delete game.state.geometryVersion;game.state.player={x:120,y:200,facing:"up"};game.save(true,1);
  const original=storage.get("mara-save-v2-1");game.load(1);
  assert.ok(geometry.canStand(data.MAPS.bedroom,game.state.player));assert.equal(game.state.geometryVersion,1);
  assert.equal(storage.get("mara-save-v2-1"),original);
});
test("QA scenes do not overwrite real autosaves",()=>{
  const original=storage.get("mara-autosave-v2");game.qaSession=true;game.state.money=999;game.save(false);
  assert.equal(storage.get("mara-autosave-v2"),original);game.qaSession=false;
});
test("talking pins an NPC until the scene ends when the timetable changes",()=>{
  game.state=newState();game.state.map="classroom";game.state.time=715;game.sceneActors=null;game.poseAudit=null;
  const before=game.getNPCs().find(n=>n.id==="iris");game.talkTo("iris");
  assert.equal(game.state.time,725);assert.equal(game.getNPCs().find(n=>n.id==="iris").x,before.x);
  game.closeDialogue();assert.ok(!game.getNPCs().some(n=>n.id==="iris"));
});
test("actual sprite draw calls preserve the foot landmark across all Mara poses",()=>{
  game.state=newState();game.mode="play";game.playerWalkTime=0;
  for(const pose of geometry.POSE_AUDIT)for(let frame=0;frame<4;frame++){
    drawCalls.length=0;game.renderActor={qaPose:pose,qaFrame:frame,attached:true};
    game.drawArtSprite("mara",400,300);const draw=drawCalls.filter(c=>c[0]==="drawImage").at(-1);
    assert.ok(draw,pose);const spec=geometry.SPRITE_SPECS[pose]||geometry.SPRITE_SPECS.mara;
    const actualY=pose==="tremble"?draw[7]+(spec.anchor.y-116)*spec.scale:draw[7]+spec.anchor.y*spec.scale;
    assert.ok(Math.abs(actualY-300)<.001,pose);assert.equal(draw[6]+spec.anchor.x*spec.scale,400,pose);
  }
  game.renderActor=null;
});
test("seating uses the furniture attachment and renders above its seat-back",()=>{
  game.state=newState();game.state.map="geometrylab";game.testAttachment("chair");
  const chair=data.MAPS.geometrylab.geometry.objects.find(o=>o.id==="chair"),mara=game.sceneActors[0];
  assert.equal(mara.x,chair.attachments.sitAnchor.x);assert.equal(mara.y,chair.attachments.sitAnchor.y);
  assert.ok(mara.depth>chair.ground.y);assert.equal(mara.action,"mug");
  game.detachActor();assert.equal(game.sceneActors,null);
});
test("a café date keeps Mara physically seated through different dialogue expressions",()=>{
  game.state=newState();game.state.map="cafe";game.state.relationships.mara.affection=6;game.boothAction();
  const before=JSON.stringify(game.sceneActors[0]);game.nextDialogue();assert.equal(JSON.stringify(game.sceneActors[0]),before);
  assert.equal(game.sceneActors[0].action,"mug");game.closeDialogue();
});
test("new game, travel and loading clear temporary attachment and path state",()=>{
  game.state=newState();game.qaSession=false;game.save(true,3);
  for(const reset of [()=>game.startNew(),()=>game.changeMap(data.MAPS.bedroom.exits[0]),()=>game.load(3)]){
    game.poseGallery=true;game.poseAudit={index:0};game.sceneActors=[{id:"mara"}];game.attachment={objectId:"chair"};game.navigationPath=[{x:10,y:10}];game.pointerTarget={x:10,y:10};
    reset();assert.equal(game.poseGallery,false);assert.equal(game.poseAudit,null);assert.equal(game.sceneActors,null);assert.equal(game.attachment,null);assert.equal(game.pointerTarget,null);assert.equal(game.navigationPath.length,0);
  }
});
test("E opens every door through the real interaction dispatch and play keeps updating",()=>{
  let doors=0;
  for(const [mapId,map] of Object.entries(data.MAPS))for(const exit of map.exits){
    game.state=newState();game.state.map=mapId;game.state.player={...exit.interactionAnchor,facing:"up"};
    if(exit.requires)game.state.flags[exit.requires]=true;
    game.detachActor();game.poseAudit=null;game.poseGallery=false;game.geometryDebug=true;
    game.mode="play";game.nearby=null;game.pointerTarget=null;game.navigationPath=[];
    game.keys.clear();game.pressed.clear();game.mouse.clicked=false;game.clockAcc=0;
    game.pressed.add("KeyE");
    assert.doesNotThrow(()=>game.updatePlay(1/60),`${mapId} -> ${exit.to}`);
    assert.equal(game.state.map,exit.to,`${mapId} -> ${exit.to}`);
    assert.ok(geometry.canStand(data.MAPS[exit.to],game.state.player));
    const seconds=game.state.playSeconds;game.pressed.clear();
    assert.doesNotThrow(()=>game.updatePlay(1/60));assert.ok(game.state.playSeconds>seconds);
    doors++;
  }
  game.geometryDebug=false;assert.ok(doors>=30);console.log(`  ${doors} directed doors checked with E`);
});

test("clicking the interaction prompt opens every door without a dead frame",()=>{
  for(const [mapId,map] of Object.entries(data.MAPS))for(const exit of map.exits){
    game.state=newState();game.state.map=mapId;game.state.player={...exit.interactionAnchor,facing:"up"};
    if(exit.requires)game.state.flags[exit.requires]=true;
    game.detachActor();game.poseAudit=null;game.geometryDebug=true;game.mode="play";
    game.keys.clear();game.pressed.clear();game.pointerTarget=null;game.navigationPath=[];
    game.nearby=game.findNearby();game.mouse={x:480,y:487,clicked:true};
    assert.doesNotThrow(()=>game.updatePlay(1/60),`${mapId} -> ${exit.to}`);
    assert.equal(game.state.map,exit.to);
    game.mouse.clicked=false;assert.doesNotThrow(()=>game.updatePlay(1/60));
  }
  game.geometryDebug=false;
});

test("interaction dispatches once even when a handler clears the interaction",()=>{
  game.state=newState();game.state.map="bedroom";game.mode="play";
  const originalTalk=game.talkTo,originalProp=game.useProp;let calls=0;
  try{
    game.talkTo=()=>{calls++;game.nearby=null;};
    game.nearby={type:"npc",data:{id:"mara"}};assert.doesNotThrow(()=>game.interact());
    game.useProp=()=>{calls++;game.nearby=null;};
    game.nearby={type:"prop",data:{id:"bed",action:"sleep"}};assert.doesNotThrow(()=>game.interact());
    game.nearby=null;assert.doesNotThrow(()=>game.interact());assert.equal(calls,2);
  }finally{game.talkTo=originalTalk;game.useProp=originalProp;}
});
console.log(`${tests} logic regression checks passed. Visual and audio inspection remain separate.`);
