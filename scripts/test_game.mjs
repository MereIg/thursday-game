// Headless logic regression tests. These do not substitute for visual/browser QA.
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import vm from "node:vm";
import * as data from "../src/data.js";
import * as ambient from "../src/content/ambient.js";

const storage=new Map(), calls=[];
const element={dataset:{},classList:{add(){}},addEventListener(){},getContext(){return{};}};
const context=vm.createContext({
  ...data,...ambient, URL,URLSearchParams,console,Math,Date,Uint8Array,Int32Array,
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
console.log(`${tests} logic regression checks passed. Visual and audio inspection remain separate.`);
