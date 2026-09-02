import {
  PALETTE, CHARACTERS, MAPS, ITEMS, SCHEDULES, QUESTS, OPENING_LINES,
  CHARACTER_TALK, MARA_TALKS, RANDOM_EVENTS, DAY_CARDS, maraSchedule
} from "./data.js";
import { music } from "./audio.js";

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d", {alpha:false, desynchronized:true});
ctx.imageSmoothingEnabled = false;
const W=960,H=540,SAVE_KEY="thursday-save-v1";
const ART={};
const ART_FILES={
  alexWalk:["../assets/characters/alex-walk.png",true],
  maraPortraits:["../assets/characters/mara-portraits.png",true],
  maraWalk:["../assets/characters/mara-walk.png",true],
  castDirections:["../assets/characters/cast-directions.png",true],
  castPortraits:["../assets/characters/cast-portraits.png",false],
  furniture:["../assets/environment/furniture-atlas.png",false],
  outdoor:["../assets/environment/outdoor-atlas.png",true],
  materials:["../assets/environment/material-atlas.png",false]
};

function removeConnectedLightBackground(img){
  const out=document.createElement("canvas");out.width=img.naturalWidth;out.height=img.naturalHeight;
  const ox=out.getContext("2d",{willReadFrequently:true});ox.drawImage(img,0,0);
  const frame=ox.getImageData(0,0,out.width,out.height),d=frame.data,w=out.width,h=out.height,n=w*h;
  const seen=new Uint8Array(n),queue=new Int32Array(n);let head=0,tail=0;
  const pale=p=>{const i=p*4,r=d[i],g=d[i+1],b=d[i+2];return r>172&&g>172&&b>172&&Math.max(r,g,b)-Math.min(r,g,b)<22;};
  const add=p=>{if(!seen[p]&&pale(p)){seen[p]=1;queue[tail++]=p;}};
  for(let x=0;x<w;x++){add(x);add((h-1)*w+x);}for(let y=0;y<h;y++){add(y*w);add(y*w+w-1);}
  while(head<tail){const p=queue[head++],x=p%w,y=(p/w)|0;d[p*4+3]=0;if(x)add(p-1);if(x<w-1)add(p+1);if(y)add(p-w);if(y<h-1)add(p+w);}
  for(let p=0;p<n;p++)if(pale(p))d[p*4+3]=0;
  ox.putImageData(frame,0,0);return out;
}

for(const [id,[src,clean]] of Object.entries(ART_FILES)){
  const img=new Image();img.decoding="async";img.onload=()=>{ART[id]=clean?removeConnectedLightBackground(img):img;};img.src=new URL(src,import.meta.url).href;
}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const lerp=(a,b,t)=>a+(b-a)*t;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const rectHit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const fmtTime=m=>`${String(Math.floor(m/60)%24).padStart(2,"0")}:${String(Math.floor(m%60)).padStart(2,"0")}`;
const dayName=d=>["","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","SUNDAY"][(d-1)%7+1];
const seeded=n=>{const x=Math.sin(n*999.91)*43758.5453;return x-Math.floor(x);};
const shade=(hex,amount)=>{
  const raw=String(hex).replace("#","");if(raw.length!==6)return hex;
  const n=parseInt(raw,16),r=clamp((n>>16)+amount,0,255),g=clamp(((n>>8)&255)+amount,0,255),b=clamp((n&255)+amount,0,255);
  return `#${((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}`;
};

function relationship() { return {affection:0,trust:0,fear:0,suspicion:0,resentment:0,talks:0}; }

function newState() {
  const relationships={}; Object.keys(CHARACTERS).forEach(k=>relationships[k]=relationship());
  return {
    version:1, seed:Math.floor(Math.random()*9999999), day:1, time:432, weather:"sun",
    map:"bedroom", player:{x:480,y:350,facing:"down"}, money:18, grade:0, energy:100,
    relationships, flags:{}, inventory:{}, quests:{welcome:{active:true,progress:0}},
    contacts:["nia"], messages:{nia:[{from:"nia",time:"07:02",text:"Orientation at nine! I left a map in your locker. You cannot escape friendship."}]},
    unread:{nia:1}, decor:[], visited:{bedroom:true}, talkedToday:{}, eventHistory:[], eventCooldowns:{},
    corruption:0, motifInfection:0, clues:0, chapterComplete:false, choices:[], playSeconds:0,
    stats:{steps:0,conversations:0,dates:0,events:0,classes:0,games:0},
    log:["MONDAY 07:12 — Moved into Mallow Street."], npcRelations:{}, socialTick:0
  };
}

class Game {
  constructor() {
    this.state=newState();
    this.mode="title";
    this.previousMode="play";
    this.keys=new Set(); this.pressed=new Set();
    this.mouse={x:0,y:0,clicked:false};
    this.last=performance.now(); this.acc=0; this.clockAcc=0; this.footstep=0;
    this.dialogue=null; this.dialogueIndex=0; this.dialogueReveal=0; this.dialoguePause=0;this.dialogueVoiceCount=0;this.choiceIndex=0;
    this.overlayIndex=0; this.phoneContact=0; this.toast=null; this.toastTimer=0;
    this.fade=1; this.fadeDir=-1; this.transition=null; this.dayCard=null;
    this.nearby=null; this.particles=[]; this.rain=[]; this.screenShake=0;
    this.mini=null; this.follow=null; this.titlePulse=0; this.autosaveTimer=0;
    this.lastMap=""; this.eventCheck=0; this.sceneCaption=null; this.captionTimer=0;
    this.playerMoving=false;this.playerWalkTime=0;this.pointerTarget=null;
    this.perf={frames:0,elapsed:0,fps:60,maxFrame:0};
    this.applyQAMode();
    this.initInput(); this.initTouch(); this.buildRain();
    setTimeout(()=>document.querySelector("#loading")?.classList.add("hidden"),300);
    requestAnimationFrame(t=>this.loop(t));
  }

  applyQAMode(){
    const p=new URLSearchParams(location.search),scene=p.get("qa");
    if(scene==="chapter"){
      const s=this.state;s.day=5;s.time=1210;s.chapterComplete=true;s.clues=5;s.corruption=3;s.motifInfection=3;s.relationships.mara.affection=8;s.relationships.mara.resentment=5;s.relationships.iris.affection=6;s.stats.events=3;this.mode="chapter";this.fade=0;this.fadeDir=0;return;
    }
    if(!scene||!MAPS[scene])return;
    const s=this.state;s.map=scene;s.day=clamp(Number(p.get("day"))||3,1,5);s.time=clamp(Number(p.get("time"))||780,0,1439);
    s.weather=p.get("weather")||((s.day===3||s.day===4)?"rain":"sun");s.player={...MAPS[scene].spawn,facing:"down"};
    const clean=p.get("clean")==="1";
    if(!clean)s.flags={metMara:true,recordsQuest:true,searchedRecords:true,room307:true,investigationUnlocked:true,followDone:true};
    for(const flag of (p.get("set")||"").split(",").filter(Boolean))s.flags[flag]=true;
    s.clues=clean?0:3;s.corruption=clamp(Number(p.get("corruption"))||(clean?0:s.day-2),0,3);s.motifInfection=clamp(Number(p.get("motif"))||(clean?0:Math.floor(s.day/2)),0,3);
    if(!clean)for(const id of Object.keys(CHARACTERS)){s.relationships[id].affection=5;s.contacts.push(id);s.messages[id]=s.messages[id]||[];s.unread[id]=0;}
    if(p.has("talks"))s.relationships.mara.talks=clamp(Number(p.get("talks"))||0,0,99);
    s.contacts=[...new Set(s.contacts)];
    const near=p.get("near");if(near){
      const map=MAPS[scene],target=(map.props||[]).find(v=>v.id===near)||(map.exits||[]).find(v=>v.to===near||v.label===near);
      if(target){const tx=target.x+target.w/2,ty=target.y+target.h/2,candidates=[];for(let y=62;y<490;y+=8)for(let x=46;x<915;x+=8){const box={x:x-12,y:y-12,w:24,h:26};if(!map.walls.some(w=>rectHit(box,w))&&Math.hypot(x-tx,y-ty)<76)candidates.push({x,y,d:Math.hypot(x-tx,y-ty)});}candidates.sort((a,b)=>a.d-b.d);if(candidates[0])s.player={x:candidates[0].x,y:candidates[0].y,facing:"up"};}
    }
    const npc=p.get("npc");if(npc&&CHARACTERS[npc]){
      const n=npc==="mara"?maraSchedule(s):(SCHEDULES[npc]||[]).find(v=>s.time>=v.from&&s.time<v.to&&v.map===scene);
      if(n&&n.map===scene)s.player={x:clamp(n.x-58,46,914),y:n.y,facing:"right"};
    }
    this.mode="play";this.fade=0;this.fadeDir=0;
  }

  initInput() {
    addEventListener("keydown",e=>{
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Space"].includes(e.code)) e.preventDefault();
      if (!this.keys.has(e.code)) this.pressed.add(e.code);
      this.keys.add(e.code); music.start();
    });
    addEventListener("keyup",e=>this.keys.delete(e.code));
    canvas.addEventListener("pointermove",e=>this.setMouse(e));
    canvas.addEventListener("pointerdown",e=>{this.setMouse(e);this.mouse.clicked=true;if(this.mode==="play"&&this.mouse.y>65)this.pointerTarget={x:this.mouse.x,y:this.mouse.y};music.start();canvas.focus();});
  }

  initTouch() {
    document.querySelectorAll("#touch-controls button").forEach(b=>{
      const code=b.dataset.key;
      b.addEventListener("pointerdown",e=>{e.preventDefault();this.keys.add(code);this.pressed.add(code);music.start();});
      const up=e=>{e.preventDefault();this.keys.delete(code);};
      b.addEventListener("pointerup",up);b.addEventListener("pointercancel",up);b.addEventListener("pointerleave",up);
    });
  }

  setMouse(e) { const r=canvas.getBoundingClientRect();this.mouse.x=(e.clientX-r.left)*W/r.width;this.mouse.y=(e.clientY-r.top)*H/r.height; }
  consume(...codes) { for(const c of codes) if(this.pressed.has(c)){this.pressed.delete(c);return true;} return false; }
  hasSave(){try{return !!localStorage.getItem(SAVE_KEY)}catch{return false}}

  loop(now) {
    const rawDt=(now-this.last)/1000,dt=Math.min(.05,rawDt);this.last=now;this.acc+=dt;
    this.perf.frames++;this.perf.elapsed+=rawDt;this.perf.maxFrame=Math.max(this.perf.maxFrame,rawDt*1000);
    if(this.perf.elapsed>=1){this.perf.fps=this.perf.frames/this.perf.elapsed;const out=document.querySelector("#qa-status");if(out)out.textContent=JSON.stringify({fps:Number(this.perf.fps.toFixed(1)),maxFrameMs:Number(this.perf.maxFrame.toFixed(1)),mode:this.mode,map:this.state.map,day:this.state.day,time:Math.floor(this.state.time)});this.perf.frames=0;this.perf.elapsed=0;this.perf.maxFrame=0;}
    while(this.acc>=1/60){this.update(1/60);this.pressed.clear();this.mouse.clicked=false;this.acc-=1/60;}
    this.draw();
    requestAnimationFrame(t=>this.loop(t));
  }

  update(dt) {
    this.titlePulse+=dt; if(this.toastTimer>0)this.toastTimer-=dt;if(this.captionTimer>0)this.captionTimer-=dt;
    if(this.fadeDir!==0){this.fade=clamp(this.fade+this.fadeDir*dt*2.4,0,1);if(this.fade===0||this.fade===1)this.fadeDir=0;}
    if(this.mode==="title") this.updateTitle();
    else if(this.mode==="daycard") this.updateDayCard(dt);
    else if(this.mode==="play") this.updatePlay(dt);
    else if(this.mode==="dialogue") this.updateDialogue(dt);
    else if(this.mode==="phone") this.updatePhone();
    else if(this.mode==="journal") this.updateJournal();
    else if(this.mode==="pause") this.updatePause();
    else if(this.mode==="shop") this.updateShop();
    else if(this.mode==="mini") this.updateMini(dt);
    else if(this.mode==="follow") this.updateFollow(dt);
    else if(this.mode==="chapter") this.updateChapter();
    this.updateParticles(dt);
  }

  updateTitle() {
    const options=this.hasSave()?["CONTINUE","NEW GAME","ABOUT"]:["NEW GAME","ABOUT"];
    if(this.consume("ArrowDown","KeyS"))this.overlayIndex=(this.overlayIndex+1)%options.length;
    if(this.consume("ArrowUp","KeyW"))this.overlayIndex=(this.overlayIndex+options.length-1)%options.length;
    if(this.mouse.clicked){
      options.forEach((_,i)=>{if(this.mouse.y>292+i*42&&this.mouse.y<330+i*42)this.overlayIndex=i;});
    }
    if(this.consume("Enter","Space","KeyE")||this.mouse.clicked){
      const pick=options[this.overlayIndex];
      if(pick==="CONTINUE")this.load();
      if(pick==="NEW GAME")this.startNew();
      if(pick==="ABOUT")this.startDialogue([
        {speaker:"",text:"THURSDAY — an original psychological-horror life simulation."},
        {speaker:"",text:"All students and romantic characters are adults aged 18 or older."},
        {speaker:"",text:"Headphones recommended. The music is listening too."}
      ],"title");
    }
    music.setScene("home",{infection:0});
  }

  startNew(){this.state=newState();this.mode="daycard";this.dayCard={...DAY_CARDS[0],timer:0,intro:true};this.fade=1;this.fadeDir=-1;music.setScene("morning",{infection:0});}

  updateDayCard(dt){
    this.dayCard.timer+=dt;
    if(this.dayCard.timer>1.2&&(this.consume("Enter","Space","KeyE")||this.mouse.clicked||this.dayCard.timer>4.2)){
      const intro=this.dayCard.intro;this.mode="play";this.fade=1;this.fadeDir=-1;
      if(intro)this.startDialogue(OPENING_LINES,"play");
      this.dayCard=null;this.updateMusic(true);
    }
  }

  updatePlay(dt) {
    const s=this.state,map=MAPS[s.map];s.playSeconds+=dt;this.clockAcc+=dt;
    if(this.clockAcc>=1){s.time+=1;this.clockAcc-=1;this.storyTick();}
    if(s.time>=1500)this.exhaustionSleep();
    if(this.mouse.clicked&&this.nearby&&this.mouse.y>445){this.pointerTarget=null;this.interact();return;}
    let dx=0,dy=0;this.playerMoving=false;
    if(this.keys.has("ArrowLeft")||this.keys.has("KeyA"))dx--;
    if(this.keys.has("ArrowRight")||this.keys.has("KeyD"))dx++;
    if(this.keys.has("ArrowUp")||this.keys.has("KeyW"))dy--;
    if(this.keys.has("ArrowDown")||this.keys.has("KeyS"))dy++;
    if(dx||dy)this.pointerTarget=null;
    if(!dx&&!dy&&this.pointerTarget){const px=this.pointerTarget.x-s.player.x,py=this.pointerTarget.y-s.player.y,d=Math.hypot(px,py);if(d>7){dx=px/d;dy=py/d;}else this.pointerTarget=null;}
    if(dx||dy){
      this.playerMoving=true;this.playerWalkTime+=dt;
      const l=Math.hypot(dx,dy);dx/=l;dy/=l;const speed=this.keys.has("ShiftLeft")?185:135;
      this.movePlayer(dx*speed*dt,dy*speed*dt,map);
      s.player.facing=Math.abs(dx)>Math.abs(dy)?(dx<0?"left":"right"):(dy<0?"up":"down");
      s.stats.steps+=Math.hypot(dx*speed*dt,dy*speed*dt);
      this.footstep-=dt;if(this.footstep<=0){music.sfx("step");this.footstep=.34;}
    }
    this.nearby=this.findNearby();
    if(this.consume("KeyE","Enter","Space"))this.interact();
    if(this.consume("KeyP")){this.previousMode="play";this.mode="phone";this.overlayIndex=0;}
    if(this.consume("KeyJ")){this.previousMode="play";this.mode="journal";this.overlayIndex=0;}
    if(this.consume("Escape")){this.mode="pause";this.overlayIndex=0;}
    this.eventCheck+=dt;
    if(this.eventCheck>8){this.eventCheck=0;this.tryRandomEvent();}
    this.updateMusic();
    this.autosaveTimer+=dt;if(this.autosaveTimer>90){this.autosaveTimer=0;this.save(false);}
  }

  movePlayer(dx,dy,map){
    const p=this.state.player;
    const tryAxis=(axis,amount)=>{
      const old=p[axis];p[axis]+=amount;const box={x:p.x-12,y:p.y-12,w:24,h:26};
      if(map.walls.some(w=>rectHit(box,w)))p[axis]=old;
    };
    tryAxis("x",dx);tryAxis("y",dy);
  }

  getNPCs() {
    const s=this.state,out=[];
    for(const [id,blocks] of Object.entries(SCHEDULES)){
      if(s.flags[`${id}Gone`]||(id==="theo"&&s.flags.theoMissingDay&&s.day===4))continue;
      const b=blocks.find(v=>s.time>=v.from&&s.time<v.to);
      if(b&&b.map===s.map)out.push({id,...b});
    }
    const mara=maraSchedule(s);if(mara&&mara.map===s.map)out.push({id:"mara",...mara});
    return out;
  }

  findNearby(){
    const s=this.state,p=s.player,candidates=[];
    for(const n of this.getNPCs()){const d=dist(p,n);if(d<82)candidates.push({type:"npc",d,data:n,label:`Talk to ${CHARACTERS[n.id].name}`});}
    for(const e of MAPS[s.map].exits){const q={x:e.x+e.w/2,y:e.y+e.h/2};const d=dist(p,q);if(d<82&&(!e.requires||s.flags[e.requires]))candidates.push({type:"exit",d,data:e,label:e.label});}
    for(const prop of MAPS[s.map].props){const q={x:prop.x+prop.w/2,y:prop.y+prop.h/2};const d=dist(p,q);if(d<82)candidates.push({type:"prop",d,data:prop,label:prop.label});}
    return candidates.sort((a,b)=>(a.d-(a.type==="npc"?28:0))-(b.d-(b.type==="npc"?28:0)))[0]||null;
  }

  interact(){
    if(!this.nearby)return;
    music.sfx("choice");
    if(this.nearby.type==="exit")this.changeMap(this.nearby.data);
    if(this.nearby.type==="npc")this.talkTo(this.nearby.data.id);
    if(this.nearby.type==="prop")this.useProp(this.nearby.data.action);
  }

  changeMap(exit){
    this.fade=0;this.fadeDir=1;music.sfx("door");this.advanceTime(8);
    this.state.map=exit.to;this.state.player.x=exit.tx;this.state.player.y=exit.ty;this.state.visited[exit.to]=true;
    this.sceneCaption=MAPS[exit.to].name;this.captionTimer=2.2;this.tryRandomEvent(.12);this.updateMusic(true);
  }

  talkTo(id){
    const s=this.state,r=s.relationships[id];r.talks++;s.stats.conversations++;s.talkedToday[id]=true;
    if(!s.contacts.includes(id)){s.contacts.push(id);s.messages[id]=s.messages[id]||[];s.unread[id]=0;}
    if(id==="june"&&s.inventory.record&&!s.flags.gaveJuneRecord){
      this.startDialogue([{speaker:"June Okafor",portrait:"june",text:"Is that the Harrow Street pressing? I've been looking everywhere for that.",choices:[
        {text:"It's for you.",reply:"Then dinner is for you. Tomorrow? I know somewhere with terrible chairs and perfect noodles.",character:"june",affection:4,trust:2,custom:()=>{s.flags.gaveJuneRecord=true;s.flags.juneDate=true;s.inventory.record--;this.addMessage("june","Tomorrow, 19:00. Wear something resistant to chilli oil.");}},
        {text:"You can borrow it.",reply:"A record and a reason to see you again. Efficient flirting.",character:"june",affection:3,custom:()=>{s.flags.juneDate=true;}},
        {text:"I just bought it.",reply:"Then I am practising admirable restraint.",character:"june",affection:1}
      ]}],"play");
    } else if(id==="theo"&&s.inventory.charm&&!s.flags.gaveTheoCharm){
      this.startDialogue([{speaker:"Theo Mercer",portrait:"theo",text:"You actually won the plastic star. I have spent a humiliating amount trying.",choices:[
        {text:"You can have it.",reply:"This is either romance or pity. I accept both. Arcade rematch tonight?",character:"theo",affection:4,custom:()=>{s.flags.gaveTheoCharm=true;s.flags.theoDate=true;s.inventory.charm--;}},
        {text:"Win your own.",reply:"Cruel. Attractive, but cruel.",character:"theo",affection:2}
      ]}],"play");
    } else if(id==="mara"){
      const node=MARA_TALKS.find(n=>n.condition(s));
      this.conversationNode(id,node);
      if(!s.flags.metMara)this.log("Met a girl called Mara. Only Mara.");
    } else {
      const pool=CHARACTER_TALK[id]||[];const ix=Math.min(pool.length-1,Math.floor(r.talks/2));
      this.conversationNode(id,pool[ix]||{text:"Good to see you.",choices:[{text:"You too.",reply:"See? Social interaction. We survived."}]});
      this.progressWelcome(id);
    }
    this.advanceTime(10);
  }

  conversationNode(id,node){
    const lines=[{speaker:CHARACTERS[id].name,text:node.text,portrait:id,expression:node.expression,demonHint:node.demonHint,demonHintAt:node.demonHintAt,choices:node.choices.map(c=>({...c,character:id}))}];
    this.startDialogue(lines,"play");
  }

  startDialogue(lines,returnMode="play",onEnd=null){
    this.previousMode=returnMode;this.mode="dialogue";this.dialogue=lines;this.dialogueIndex=0;this.dialogueReveal=0;this.dialoguePause=0;this.dialogueVoiceCount=0;this.choiceIndex=0;this.dialogueEnd=onEnd;
  }

  dialogueProfile(line){
    const id=line.portrait||({Alex:"alex",Mara:"mara",Iris:"iris",June:"june",Theo:"theo",Ren:"ren",Nia:"nia",Sam:"sam"}[line.speaker]||"narrator");
    const profiles={alex:{rate:46,every:3,comma:.055,stop:.13},mara:{rate:40,every:2,comma:.08,stop:.17},iris:{rate:34,every:3,comma:.11,stop:.2},june:{rate:38,every:2,comma:.12,stop:.23},theo:{rate:56,every:3,comma:.045,stop:.1},ren:{rate:45,every:4,comma:.08,stop:.16},nia:{rate:63,every:3,comma:.035,stop:.085},sam:{rate:37,every:3,comma:.095,stop:.18},narrator:{rate:44,every:99,comma:.07,stop:.15}};
    const still=id==="mara"&&(line.demonHint||line.expression==="still");return{id,still,...profiles[id],...(still?{rate:27,every:4,comma:.16,stop:.3}:null)};
  }

  updateDialogue(dt){
    const line=this.dialogue?.[this.dialogueIndex];if(!line){this.closeDialogue();return;}
    const profile=this.dialogueProfile(line),before=Math.floor(this.dialogueReveal);
    if(this.dialoguePause>0)this.dialoguePause=Math.max(0,this.dialoguePause-dt);
    else{
      this.dialogueReveal=Math.min(line.text.length,this.dialogueReveal+dt*profile.rate);
      const after=Math.floor(this.dialogueReveal);
      for(let i=before;i<after;i++){
        const ch=line.text[i]||"";if(!/\s/.test(ch)&&++this.dialogueVoiceCount%profile.every===0)music.voice(profile.id,profile.still);
        if(/[.!?]/.test(ch))this.dialoguePause=Math.max(this.dialoguePause,profile.stop);else if(/[,;:—]/.test(ch))this.dialoguePause=Math.max(this.dialoguePause,profile.comma);
      }
    }
    const fully=this.dialogueReveal>=line.text.length;
    if(line.choices&&fully){
      if(this.consume("ArrowDown","KeyS"))this.choiceIndex=(this.choiceIndex+1)%line.choices.length;
      if(this.consume("ArrowUp","KeyW"))this.choiceIndex=(this.choiceIndex+line.choices.length-1)%line.choices.length;
      for(let i=0;i<line.choices.length;i++)if(this.consume(`Digit${i+1}`)){this.choiceIndex=i;this.choose(line.choices[i]);return;}
      if(this.mouse.clicked){
        line.choices.forEach((_,i)=>{const y=315+i*46;if(this.mouse.y>y&&this.mouse.y<y+38){this.choiceIndex=i;this.choose(line.choices[i]);}});
      }
      if(this.consume("Enter","Space","KeyE"))this.choose(line.choices[this.choiceIndex]);
    } else if(this.consume("Enter","Space","KeyE")||this.mouse.clicked){
      if(!fully)this.dialogueReveal=line.text.length;else this.nextDialogue();
    }
    if(this.consume("Escape")&&this.previousMode==="title")this.closeDialogue();
  }

  choose(choice){
    music.sfx("choice");const id=choice.character,r=id?this.state.relationships[id]:null;
    if(r){for(const k of ["affection","trust","fear","suspicion","resentment"])if(choice[k])r[k]+=choice[k];}
    if(choice.flag)this.state.flags[choice.flag]=true;
    if(choice.effect)this.effect(choice.effect);
    if(choice.custom)choice.custom();
    this.state.choices.push({day:this.state.day,time:this.state.time,text:choice.text,character:id});
    this.dialogue.splice(this.dialogueIndex+1,0,{speaker:id?CHARACTERS[id].name:"",text:choice.reply||"…",portrait:id,expression:choice.expression,demonHint:choice.demonHint,demonHintAt:choice.demonHintAt});
    this.dialogue[this.dialogueIndex].choices=null;this.nextDialogue();
    if(id==="mara"&&choice.jealousy)this.state.relationships.mara.resentment+=choice.jealousy;
  }

  nextDialogue(){this.dialogueIndex++;this.dialogueReveal=0;this.dialoguePause=0;this.dialogueVoiceCount=0;this.choiceIndex=0;if(this.dialogueIndex>=this.dialogue.length)this.closeDialogue();}
  closeDialogue(){const cb=this.dialogueEnd;this.mode=this.previousMode||"play";this.dialogue=null;this.dialogueEnd=null;if(cb)cb();}

  useProp(action){
    const s=this.state;
    const simple=(speaker,text)=>this.startDialogue([{speaker,text}],"play");
    if(action==="sleep")return this.askSleep();
    if(action==="computer")return this.startDialogue([{speaker:"Alex",text:s.flags.phoneClue?"The connection log shows your phone waking at 03:17 every night. No device name.":"Email, class portal, a folder of music, and seventeen tabs you will definitely read later."}],"play");
    if(action==="window")return this.windowScene();
    if(action==="decorate")return this.decorate();
    if(action==="photo")return simple("Alex",s.flags.changedPhoto?"The photograph shows the café booth. Mara is sitting beside you. This photograph was taken before you met her.":"A photograph from orientation. Everyone is mid-laugh. The background is pleasantly out of focus.");
    if(action==="tea"){this.addItem("tea");return simple("Alex","Tea made. The house clicks softly around you.");}
    if(action==="exit"){const door=MAPS[s.map].exits.find(e=>e.to==="street");if(door)this.changeMap(door);return;}
    if(action==="bus")return simple("",s.day>=3?"Every route is on time except the 16:40, which has no destination printed.":"The last bus is 23:10. Someone has drawn a tiny smiling face beside it.");
    if(action==="notice")return simple("","GUITAR LESSONS. LOST CAT. PARK VOLUNTEERS. A blank square where something has been torn down very carefully.");
    if(action==="shop")return this.openShop();
    if(action==="wait"){this.advanceTime(60);this.toastMsg("An hour passes.");return;}
    if(action==="fountain")return simple("",s.day===4?"Six coins rest at the bottom. Every one is dated next year.":"The college fountain smells faintly of pennies and rain.");
    if(action==="collegeboard")return simple("","FILM CLUB — MUSIC SOCIETY — FOLKLORE — VOLUNTEERING. Nia has circled every option for you.");
    if(action==="locker")return this.locker();
    if(action==="poster")return simple("Iris","The photo walk is Wednesday after five. Bring film and shoes you don't respect.");
    if(action.startsWith("class_"))return this.attendClass(action);
    if(action==="lunch")return this.buyLunch();
    if(action==="friends_lunch")return this.groupLunch();
    if(action==="quiet_lunch")return this.quietLunch();
    if(action==="study"){s.grade+=2;this.advanceTime(50);return simple("",`You study until the paragraphs behave. Grade confidence: ${s.grade}.`);}
    if(action==="records")return this.searchRecords();
    if(action==="folklore")return simple("Ren",s.day>=4?"Every local account agrees on one detail: it happened on Thursday. They do not agree which Thursday.":"Half the books are folklore. The other half are books Ren insists will become folklore eventually.");
    if(action==="rhythm")return this.startMini("rhythm");
    if(action==="listen"){s.energy=Math.min(100,s.energy+8);this.advanceTime(30);return simple("","You listen to both sides. The room feels larger when you close your eyes.");}
    if(action==="cafe")return this.cafeAction();
    if(action==="booth")return this.boothAction();
    if(action==="cafe_piano")return simple("",s.flags.heardMotifTalk?"You pick out June's six notes. A cup breaks behind the counter.":"One key is slightly flat. It is also the nicest-sounding key.");
    if(action==="arcade_game")return this.arcadeAction();
    if(action==="prize")return simple("Theo","The plastic star costs four hundred tickets or one act of burglary. I'm flexible.");
    if(action==="pond")return simple("",s.day===4?"The ducks leave the water at once. A red-haired reflection remains for a moment longer.":"A duck regards your academic prospects with open contempt.");
    if(action==="greenhouse")return this.greenhouse();
    if(action==="parkbench")return this.parkBench();
    if(action==="train")return this.trainAction();
    if(action==="tickets")return simple("","The machine offers tickets to LARKSPUR, despite already being in Larkspur.");
    if(action==="archive_door")return this.archiveDoor();
    if(action==="room307")return this.room307();
    if(action==="evidence_box")return this.evidenceBox();
    if(action==="evidence_photos")return this.evidencePhotos();
    if(action==="red_door")return this.redDoor();
  }

  askSleep(){
    const s=this.state;
    if(s.time<1080){this.startDialogue([{speaker:"Alex",text:"It's too early to sleep. The day is still mine."}],"play");return;}
    this.startDialogue([{speaker:"Alex",text:`Sleep and end ${dayName(s.day).toLowerCase()}?`,choices:[
      {text:"Sleep.",reply:"You lock the door. You check it twice.",effect:"sleepNow"},
      {text:"Stay awake.",reply:"There are still things to do."}
    ]}],"play",()=>{if(this.state.flags._sleepNow){delete this.state.flags._sleepNow;this.sleep();}});
    this.dialogue[0].choices[0].character=null;
    this.dialogue[0].choices[0].effect="sleepNow";
  }

  sleep(){
    const s=this.state;
    if(s.day>=5){s.time=430;s.energy=100;s.talkedToday={};s.flags.fridayLooped=true;this.save(false);this.mode="daycard";this.dayCard={title:"FRIDAY",sub:"The week does not end.",timer:0};music.setScene("morning",{infection:3,weather:s.weather});return;}
    s.day++;s.time=430;s.energy=100;s.talkedToday={};s.weather=s.day===3||s.day===4?"rain":"sun";
    s.motifInfection=Math.min(3,Math.floor((s.day-1)/2));s.corruption=Math.max(s.corruption,s.day-2);
    this.dailyMessages();this.socialSimulation();this.save(false);
    this.mode="daycard";this.dayCard={...(DAY_CARDS.find(d=>d.day===s.day)||{title:"SATURDAY",sub:"The week does not end."}),timer:0};
    music.setScene("morning",{infection:s.motifInfection,weather:s.weather},true);
  }

  exhaustionSleep(){this.state.map="bedroom";this.state.player={x:480,y:350,facing:"down"};this.sleep();}
  advanceTime(m){this.state.time+=m;this.state.energy=clamp(this.state.energy-m*.035,0,100);this.storyTick();}
  log(text){this.state.log.unshift(`${dayName(this.state.day)} ${fmtTime(this.state.time)} — ${text}`);this.state.log=this.state.log.slice(0,30);}

  windowScene(){
    const s=this.state;
    if(s.flags.movePillow&&!s.flags.pillowFound){s.flags.pillowFound=true;this.addItem("greenRibbon");this.startDialogue([{speaker:"",text:"The street is empty."},{speaker:"",text:"Under your pillow is a green ribbon. It smells like rain, though the window is shut."}],"play");return;}
    if(s.day>=3&&s.time>1200)this.startDialogue([{speaker:"",text:"A figure stands beneath the dead streetlamp."},{speaker:"Alex",text:"When the next car passes, the pavement is empty."}],"play");
    else this.startDialogue([{speaker:"",text:s.weather==="rain"?"Rain turns Mallow Street into a long reflection.":"The town is already awake. Someone across the street closes a curtain."}],"play");
  }

  decorate(){
    const choices=[];
    if(safeHas(this.state.inventory,"lamp")&&!this.state.decor.includes("lamp"))choices.push({text:"Place the amber lamp.",reply:"The room becomes warmer.",custom:()=>this.state.decor.push("lamp")});
    if(safeHas(this.state.inventory,"plant")&&!this.state.decor.includes("plant"))choices.push({text:"Place the fern.",reply:"A small green thing now depends on you.",custom:()=>this.state.decor.push("plant")});
    if(this.state.flags.irisRoomPhoto&&!this.state.decor.includes("photo"))choices.push({text:"Pin Iris's photograph up.",reply:"For now, the photograph contains only the people you remember.",custom:()=>this.state.decor.push("photo")});
    choices.push({text:"Leave it as it is.",reply:"Familiar is a kind of decoration."});
    this.startDialogue([{speaker:"Alex",text:"What should change?",choices}],"play");
  }

  openShop(){this.previousMode="play";this.mode="shop";this.overlayIndex=0;}
  updateShop(){
    const goods=[{id:"film",price:5},{id:"record",price:8},{id:"plant",price:6},{id:"pastry",price:3}];
    if(this.consume("ArrowDown","KeyS"))this.overlayIndex=(this.overlayIndex+1)%(goods.length+1);
    if(this.consume("ArrowUp","KeyW"))this.overlayIndex=(this.overlayIndex+goods.length)%(goods.length+1);
    if(this.consume("Escape","KeyE")){this.mode="play";return;}
    if(this.consume("Enter","Space")){
      if(this.overlayIndex===goods.length){this.mode="play";return;}
      const g=goods[this.overlayIndex];if(this.state.money>=g.price){this.state.money-=g.price;this.addItem(g.id);this.toastMsg(`${ITEMS[g.id].name} purchased.`);}else this.toastMsg("Not enough money.");
    }
  }

  locker(){
    const s=this.state;
    if(!s.flags.gotMap){s.flags.gotMap=true;s.money+=4;this.startDialogue([{speaker:"",text:"Nia's map is covered in arrows, café recommendations, and one warning: “DO NOT LET THE EAST-HALL MACHINE WIN.”"},{speaker:"",text:"There is also £4 taped to it. “Emergency pastry fund.”"}],"play");}
    else this.startDialogue([{speaker:"",text:s.day>=4?"Your locker contains a handwritten timetable for Mara. Every line says ALEX.":"Books, timetable, emergency snacks. Ordinary evidence of an ordinary week."}],"play");
  }

  attendClass(seat){
    const s=this.state;s.stats.classes++;s.grade+=2;this.advanceTime(65);s.flags.attendedClass=true;
    const lines=[{speaker:"Dr. Vale",text:"History is not what happened. History is what remains mutually believable."}];
    if(seat==="class_window"&&s.day>=2)lines.push({speaker:"",text:"Outside the second-floor window, Mara is standing in the courtyard. She looks up before you do."});
    if(seat==="class_back")lines.push({speaker:"Theo",text:"Excellent choice. Educational visibility: zero. Radiator access: elite."});
    if(seat==="class_middle")lines.push({speaker:"Nia",text:"I saved you a pen. You had one, but mine has a tiny frog."});
    this.startDialogue(lines,"play");
  }

  buyLunch(){if(this.state.money<4){this.toastMsg("You need £4.");return;}this.state.money-=4;this.state.energy=Math.min(100,this.state.energy+18);this.advanceTime(25);this.toastMsg("Lunch acquired. Morale improved.");}
  groupLunch(){
    this.advanceTime(35);this.state.relationships.nia.affection++;this.state.relationships.theo.affection++;
    const lines=[{speaker:"Theo",text:"I maintain the soup is a beverage."},{speaker:"Nia",text:"You used a straw once and lost voting rights."}];
    if(this.state.day>=3)lines.push({speaker:"",text:"Iris's usual seat is empty. The cheerful cafeteria music reaches the end of its loop and starts again."});
    this.startDialogue(lines,"play");
  }
  quietLunch(){
    const first=!this.state.flags.metMara;this.advanceTime(30);this.state.energy+=8;
    if(first){this.state.flags.metMara=true;this.state.contacts.push("mara");this.state.messages.mara=[];this.state.unread.mara=0;}
    this.startDialogue([{speaker:"",text:"For half an hour, nobody needs anything from you."},{speaker:"Mara",portrait:"mara",text:first?"Sorry. Is this seat taken? I'm Mara.":"I knew you liked this table."}],"play");
  }

  searchRecords(){
    const s=this.state;
    if(!s.flags.recordsQuest){this.startDialogue([{speaker:"Ren",text:"Those are staff records. Ask me again when your reason is better than curiosity."}],"play");return;}
    if(!s.flags.searchedRecords){s.flags.searchedRecords=true;s.clues++;this.log("The register has no consistent record of Mara.");
      this.startDialogue([{speaker:"",text:"MARA appears nowhere in the current register."},{speaker:"",text:"A 1978 society photograph contains a red-haired woman in a green coat. Her face has been scratched away."},{speaker:"Ren",text:"That coat isn't vintage. That's not the important part, but it bothers me."}],"play");
    } else this.startDialogue([{speaker:"",text:"The 1978 photograph is gone. Ren remembers showing it to you. The catalogue says it never existed."}],"play");
  }

  cafeAction(){
    if(this.state.time<600){this.toastMsg("The morning rush is too busy.");return;}
    this.startDialogue([{speaker:"Sam",text:"Want a one-hour shift? £9, one free drink, and only moderate public contact.",choices:[
      {text:"Work the shift.",reply:"Apron is behind the counter. Ignore table four; table four ignores us.",customAction:"cafeWork"},
      {text:"Just order tea — £2.",reply:"Strong enough to alter a small decision.",customAction:"buyTea"},
      {text:"Maybe later.",reply:"A cornerstone of the service industry."}
    ]}],"play");
    const choices=this.dialogue[0].choices;choices.forEach(c=>{c.character="sam";if(c.customAction==="cafeWork")c.effect="cafeWork";if(c.customAction==="buyTea")c.effect="buyTea";});
  }

  effect(name){
    if(name==="sleepNow")this.state.flags._sleepNow=true;
    if(name==="money2")this.state.money+=2;
    if(name==="inviteIris")this.state.flags.irisDate=true;
    if(name==="inviteJune")this.state.flags.juneDate=true;
    if(name==="cafeWork")setTimeout(()=>this.startMini("cafe"),0);
    if(name==="buyTea"&&this.state.money>=2){this.state.money-=2;this.state.energy=Math.min(100,this.state.energy+12);}
  }

  boothAction(){
    const s=this.state;
    if(s.flags.juneDate&&s.time>=1140&&!s.flags.juneDateDone){s.flags.juneDateDone=true;s.stats.dates++;s.relationships.june.affection+=4;this.advanceTime(90);
      this.startDialogue([{speaker:"June",portrait:"june",text:"The chairs are hostile and the noodles are perfect. I promised accurately."},{speaker:"",text:"June drums a rhythm against your wrist while you wait for dessert."},{speaker:"June",portrait:"june",text:"There. Now when it gets stuck in your head, it can be mine instead."}],"play");return;}
    if(s.flags.irisDate&&s.relationships.iris.affection>=3&&!s.flags.irisDateDone){s.flags.irisDateDone=true;s.stats.dates++;s.relationships.iris.affection+=3;this.advanceTime(75);
      this.startDialogue([{speaker:"Iris",portrait:"iris",text:"I like this booth. Everyone outside becomes a film with no dialogue."},{speaker:"Alex",text:"What does that make us?"},{speaker:"Iris",portrait:"iris",text:"The people pretending not to hold hands under the table."},{speaker:"",text:"For an hour, the rain is only rain."}],"play");return;}
    if(s.relationships.mara.affection>=5&&!s.flags.maraCafeDate){s.flags.maraCafeDate=true;s.stats.dates++;s.relationships.mara.affection+=3;this.advanceTime(70);
      music.setScene("mara",{infection:1});this.startDialogue([{speaker:"Mara",portrait:"mara",text:"I ordered for you. If it's wrong, lie. I want to feel impressive."},{speaker:"Mara",portrait:"mara",text:"This is nice, isn't it? Just us and everybody else being somewhere else."},{speaker:"",text:"She makes you laugh hard enough to spill tea. For a while, nothing about her feels dangerous."}],"play");return;}
    this.advanceTime(20);this.state.energy+=5;this.startDialogue([{speaker:"",text:"You watch umbrellas pass. The booth holds a small, temporary peace."}],"play");
  }

  arcadeAction(){
    const s=this.state;
    if(s.flags.theoDate&&s.time>=1080&&!s.flags.theoDateDone){s.flags.theoDateDone=true;s.stats.dates++;s.relationships.theo.affection+=4;this.advanceTime(75);
      this.startDialogue([{speaker:"Theo",portrait:"theo",text:"For clarity, losing on purpose would be patronising. Also impossible for me."},{speaker:"",text:"You lose three games, win two, and split chips under the broken racing cabinet."},{speaker:"Theo",portrait:"theo",text:"This is a date, right? I need to know how nervous to be retroactively."}],"play");return;}
    if(s.money<2){this.toastMsg("STARLANCE needs £2.");return;}s.money-=2;this.startMini("arcade");
  }

  greenhouse(){
    if(!this.state.inventory.plant){this.addItem("plant");this.startDialogue([{speaker:"",text:"The volunteer gives you a fern that has survived three winters and one falling shelf."}],"play");}
    else this.startDialogue([{speaker:"",text:"Warm glass, wet soil, patient leaves. No animals enter while Mara is in the park."}],"play");
  }

  parkBench(){
    const s=this.state;
    if(s.inventory.film&&s.relationships.iris.affection>=3&&s.time>=1020&&!s.flags.irisDate){s.flags.irisDate=true;s.flags.irisRoomPhoto=true;s.stats.dates++;this.advanceTime(80);
      this.startDialogue([{speaker:"Iris",portrait:"iris",text:"Golden hour. The sun doing free labour for artists."},{speaker:"",text:"You photograph windows, dogs, strangers' shoes, and each other laughing."},{speaker:"Iris",portrait:"iris",text:"Keep this one. You look like you belong here."}],"play");return;}
    this.advanceTime(30);this.startDialogue([{speaker:"",text:s.weather==="rain"?"You sit beneath the shelter and listen to rain applaud the leaves.":"The park is busy in the unimportant, comforting way."}],"play");
  }

  trainAction(){
    const s=this.state;
    if(s.day===5&&s.time>=960&&!s.flags.followDone){this.startFollow();return;}
    this.startDialogue([{speaker:"",text:s.day>=4?"The departure board flickers. For one second every train leaves at 19:17 on THURSDAY.":"Trains arrive, apologise electronically, and leave."}],"play");
  }

  archiveDoor(){
    if(this.state.inventory.key307){this.startDialogue([{speaker:"",text:"The key fits, although its label says 307, not ARCHIVE."},{speaker:"",text:"Inside, every shelf is empty except one green ribbon."}],"play");}
    else this.startDialogue([{speaker:"",text:"Locked. The metal around the keyhole is cold enough to hurt."}],"play");
  }
  room307(){
    const s=this.state;
    if(!s.flags.recordsQuest){this.startDialogue([{speaker:"",text:"Room 307 is locked. You have no reason to care."}],"play");return;}
    if(!s.flags.room307){s.flags.room307=true;s.clues++;this.addItem("key307");this.startDialogue([{speaker:"",text:"The door opens before you touch it."},{speaker:"",text:"The room is one metre too narrow from the inside. A key waits on the floor."},{speaker:"Mara",portrait:"mara",text:"You shouldn't have opened that door."},{speaker:"Alex",text:"Mara is not in the corridor when you turn around."}],"play");}
    else this.startDialogue([{speaker:"",text:"There is no Room 307. The doors jump from 306 to 308. You are holding its key."}],"play");
  }

  evidenceBox(){
    const s=this.state;if(s.flags.boxSeen){this.startDialogue([{speaker:"",text:"The box is empty now. The dust around it shows two sets of footprints: yours and bare feet."}],"play");return;}
    s.flags.boxSeen=true;s.clues+=2;this.addItem("irisbuckle");this.log("Found Iris's spare camera buckle in the annex before she lost it.");
    this.startDialogue([{speaker:"",text:"Inside the box: student cards, earrings, a cracked phone, three house keys, teeth wrapped in café napkins."},{speaker:"",text:"On top is the spare buckle Iris bought yesterday. It is still attached to her camera across town."}],"play");
  }

  evidencePhotos(){
    const s=this.state;if(s.flags.photosSeen){this.startDialogue([{speaker:"",text:"You count the photographs again. There are seven more than before."}],"play");return;}
    s.flags.photosSeen=true;s.clues+=2;this.addItem("tornPhoto");s.investigationUnlocked=true;
    this.startDialogue([{speaker:"",text:"Hundreds of photographs of you. Breakfast. Class. Your bedroom window."},{speaker:"",text:"Some are dated before you were born. In several, the room behind you is furnished differently."},{speaker:"",text:"One photograph shows Mara crying beside an empty chair. On the back: THURSDAY AGAIN."}],"play");
  }

  redDoor(){
    const s=this.state;
    if(!s.flags.boxSeen||!s.flags.photosSeen){this.startDialogue([{speaker:"",text:"Behind the red paint, something knocks once. It waits for your answer."}],"play");return;}
    s.flags.redDoorSeen=true;
    this.startDialogue([
      {speaker:"Mara",portrait:"mara",text:"Please don't."},
      {speaker:"",text:"She is standing between you and the exit. You did not hear her enter."},
      {speaker:"Mara",portrait:"mara",text:"I had such a good week with you."},
      {speaker:"Alex",text:"What are you?"},
      {speaker:"Mara",portrait:"mara",text:"Mara."},
      {speaker:"",portrait:"mara",text:"For one frame, her shadow continues upward after the ceiling ends.",demonHint:"shadow"},
      {speaker:"Mara",portrait:"mara",text:"Can we go home now?"},
      {speaker:"Alex",text:"There are photographs of me from before I existed."},
      {speaker:"Mara",portrait:"mara",text:"Your room looked nicer the first time.",demonHint:"tail"},
      {speaker:"",text:"She smiles. It is the same warm smile that made you laugh in the café."}
    ],"play",()=>this.finishChapter());
  }

  finishChapter(){this.state.chapterComplete=true;this.save(false);this.mode="chapter";this.overlayIndex=0;music.setScene("mara",{infection:3});}
  updateChapter(){if(this.consume("Enter","Space","KeyE")||this.mouse.clicked){this.mode="play";this.state.map="bedroom";this.state.player={x:480,y:350,facing:"down"};this.state.time=440;this.toastMsg("Opening complete — free exploration continues.");}}

  progressWelcome(id){
    const q=this.state.quests.welcome;if(!q||q.complete)return;
    q.people=q.people||[];if(!q.people.includes(id)){q.people.push(id);q.progress=q.people.length;}
    if(q.progress>=3){q.complete=true;this.state.money+=8;this.addItem("lamp");this.toastMsg("Quest complete: Make Bellwether yours");this.log("Bellwether began to feel familiar.");}
  }

  addItem(id,n=1){this.state.inventory[id]=(this.state.inventory[id]||0)+n;this.toastMsg(`Got: ${ITEMS[id]?.name||id}`);}
  toastMsg(text){this.toast=text;this.toastTimer=3;}

  dailyMessages(){
    const s=this.state;
    if(s.day===2){this.addMessage("nia","Everyone survives Monday! Legally, that counts as a good week.");if(s.flags.metMara)this.addMessage("mara","hi :) did you get home okay?");}
    if(s.day===3){this.addMessage("iris","Photo walk after five? Bring film. I promise one artistic puddle maximum.");if(s.flags.metMara){this.addMessage("mara","morning!!");this.addMessage("mara","sorry too many exclamation marks");this.addMessage("mara","I was excited");}}
    if(s.day===4){this.addMessage("june","The six-note thing is in the college jingle now. Tell me you hear it.");if(s.flags.metMara)this.addMessage("mara","you looked nice asleep");}
    if(s.day===5){this.addMessage("ren","Station. After 16:00. She has used the service lane three Fridays in a row.");if(s.flags.metMara)this.addMessage("mara","don't take the train today");s.flags.investigationUnlocked=true;}
  }

  addMessage(id,text,from=id){
    if(!this.state.contacts.includes(id))this.state.contacts.push(id);
    this.state.messages[id]=this.state.messages[id]||[];this.state.messages[id].push({from,time:fmtTime(this.state.time),text});
    this.state.unread[id]=(this.state.unread[id]||0)+1;music.sfx("text");this.toastMsg(`Message from ${CHARACTERS[id]?.name||id}`);
  }

  updatePhone(){
    const contacts=this.state.contacts;
    if(this.consume("Escape","KeyP")){this.mode=this.previousMode;return;}
    if(this.consume("ArrowDown","KeyS")){this.phoneContact=(this.phoneContact+1)%contacts.length;this.state.unread[contacts[this.phoneContact]]=0;}
    if(this.consume("ArrowUp","KeyW")){this.phoneContact=(this.phoneContact+contacts.length-1)%contacts.length;this.state.unread[contacts[this.phoneContact]]=0;}
    if(this.consume("KeyR")&&contacts[this.phoneContact]==="mara")this.replyMara();
  }

  replyMara(){
    const s=this.state,id="mara";this.addMessage(id,s.day>=4?"How did you know I was asleep?":"Home safe. See you tomorrow.","you");s.unread[id]=0;
    if(s.day>=4){setTimeout(()=>{this.addMessage("mara","know what?");this.addMessage("mara","sleep well :) ");s.flags.movePillow=true;},900);}
  }

  updateJournal(){if(this.consume("Escape","KeyJ"))this.mode=this.previousMode;if(this.consume("ArrowDown","KeyS"))this.overlayIndex++;if(this.consume("ArrowUp","KeyW"))this.overlayIndex=Math.max(0,this.overlayIndex-1);}
  updatePause(){
    const opts=["RESUME","SAVE GAME",music.muted?"SOUND: OFF":"SOUND: ON","TITLE SCREEN"];
    if(this.consume("ArrowDown","KeyS"))this.overlayIndex=(this.overlayIndex+1)%opts.length;if(this.consume("ArrowUp","KeyW"))this.overlayIndex=(this.overlayIndex+opts.length-1)%opts.length;
    if(this.consume("Escape")){this.mode="play";return;}
    if(this.consume("Enter","Space","KeyE")){const p=opts[this.overlayIndex];if(p==="RESUME")this.mode="play";if(p==="SAVE GAME")this.save(true);if(p.startsWith("SOUND"))music.toggleMute();if(p==="TITLE SCREEN"){this.mode="title";this.overlayIndex=0;}}
  }

  save(notify=true){try{localStorage.setItem(SAVE_KEY,JSON.stringify(this.state));if(notify){music.sfx("save");this.toastMsg("Game saved.");}}catch{this.toastMsg("Save failed in this browser.");}}
  load(){try{const raw=JSON.parse(localStorage.getItem(SAVE_KEY));this.state=Object.assign(newState(),raw);this.mode="play";this.fade=1;this.fadeDir=-1;this.updateMusic(true);this.toastMsg("Welcome back.");}catch{this.toastMsg("Save could not be read.");}}

  storyTick(){
    const s=this.state;
    if(s.day===1&&s.time>=540&&!s.flags.orientation){s.flags.orientation=true;this.toastMsg("Orientation has started in the courtyard.");}
    if(s.day>=4&&s.clues>=2&&!s.flags.investigationUnlocked){s.flags.investigationUnlocked=true;this.addMessage("ren","Service lane behind Larkspur Station. Friday, after four. Don't tell her.");}
    if(s.day===4&&s.time>1260&&!s.flags.movePillow&&s.flags.metMara){s.flags.movePillow=true;this.addMessage("mara","move your pillow");}
    if(s.day===4&&s.time>1320&&!s.flags.maraNightCall&&s.flags.metMara&&this.mode==="play")this.incomingMaraCall();
  }

  incomingMaraCall(){
    const s=this.state;s.flags.maraNightCall=true;music.sfx("call");
    this.startDialogue([{speaker:"PHONE",text:"MARA IS CALLING",choices:[
      {text:"Answer.",reply:"For several seconds there is only breathing and distant rain.",custom:()=>{s.relationships.mara.affection+=1;}},
      {text:"Decline.",reply:"The phone stops. It rings again before the screen goes dark.",custom:()=>{s.relationships.mara.resentment+=2;}},
      {text:"Turn the phone off.",reply:"The screen goes black. Her voice continues through the speaker: “Alex?”",custom:()=>{s.relationships.mara.fear+=2;s.flags.impossibleCall=true;}}
    ]},{speaker:"Mara",portrait:"mara",text:"I couldn't sleep. I kept thinking you were going somewhere without me."},{speaker:"Mara",portrait:"mara",text:"You aren't, are you?"}],"play");
  }

  socialSimulation(){
    const s=this.state;s.socialTick++;
    if(s.day===3){s.npcRelations.irisJune=-1;this.log("Iris and June argued about an altered photograph.");}
    if(s.day===4&&s.relationships.iris.affection>=5){s.relationships.mara.resentment+=3;this.log("Mara asked Nia whether Iris was ‘making you different’. ");}
    if(s.day===5&&s.relationships.theo.trust>=3)this.addMessage("theo","Your phone connected to something at 03:17 again. It used your own device name.");
  }

  tryRandomEvent(bonus=0){
    const s=this.state;if(this.mode!=="play"||this.dialogue)return;
    const chance=.08+bonus+s.corruption*.018;if(Math.random()>chance)return;
    const eligible=RANDOM_EVENTS.filter(e=>s.day>=e.minDay&&e.places.includes(s.map)&&(!e.night||s.time>1200)&&!s.eventHistory.includes(e.id)&&(!s.eventCooldowns[e.id]||s.day>=s.eventCooldowns[e.id]));
    if(!eligible.length)return;
    let total=eligible.reduce((a,e)=>a+e.weight,0),pick=Math.random()*total,event=eligible[0];
    for(const e of eligible){pick-=e.weight;if(pick<=0){event=e;break;}}
    s.eventHistory.push(event.id);s.eventCooldowns[event.id]=s.day+event.cooldown;s.flags[event.flag]=true;s.stats.events++;if(event.motif)s.motifInfection=Math.max(s.motifInfection,1);
    music.sfx("shock");this.startDialogue([{speaker:"",text:event.text}],"play");this.log("Something happened that the diary does not describe correctly.");
  }

  updateMusic(force=false){
    const s=this.state,map=MAPS[s.map];const mara=this.getNPCs().find(n=>n.id==="mara");let track=map.music;
    if(s.time>1260&&["street","highstreet","station"].includes(s.map))track="night";
    if(mara&&dist(s.player,mara)<210){track=(mara.distant||s.day<=1)?"stalking":"mara";}
    const key=`${track}-${s.motifInfection}-${!!mara}-${s.weather}`;
    if(force||key!==this.lastMap){this.lastMap=key;music.setScene(track,{infection:s.motifInfection,nearMara:!!mara,weather:s.weather});}
  }

  startMini(type){
    this.previousMode="play";this.mode="mini";this.mini={type,round:0,score:0,cursor:0,dir:1,target:.25+Math.random()*.5,timer:0,message:""};
  }
  updateMini(dt){
    const m=this.mini;m.timer+=dt;m.cursor+=m.dir*dt*(m.type==="arcade"?1.4:1.05);if(m.cursor>1){m.cursor=1;m.dir=-1;}if(m.cursor<0){m.cursor=0;m.dir=1;}
    if(this.consume("Escape")){this.mode="play";this.mini=null;return;}
    if(this.consume("Space","Enter","KeyE")||this.mouse.clicked){
      const accuracy=Math.abs(m.cursor-m.target),points=Math.max(0,Math.round((.24-accuracy)*1000));m.score+=points;m.round++;m.message=accuracy<.045?"PERFECT":accuracy<.11?"GOOD":"MISS";music.sfx(accuracy<.11?"choice":"door");m.target=.18+Math.random()*.64;
      if(m.round>=6){const type=m.type,score=m.score;this.mode="play";this.mini=null;this.finishMini(type,score);}
    }
  }
  finishMini(type,score){
    const s=this.state;s.stats.games++;if(type==="arcade"){if(score>=700){this.addItem("charm");s.relationships.theo.affection+=2;}this.startDialogue([{speaker:"Theo",text:`${score} points. ${score>=700?"I resent how impressive that was.":"The machine has chosen violence."}`}],"play");}
    if(type==="rhythm"){s.relationships.june.affection+=score>=700?3:1;s.grade++;this.advanceTime(35);this.startDialogue([{speaker:"June",text:score>=700?"You found the pulse. That's rarer than talent.":"Wrong notes are just honest notes with poor timing."}],"play");}
    if(type==="cafe"){const pay=6+Math.floor(score/300);s.money+=pay;s.relationships.sam.trust+=2;this.advanceTime(60);this.startDialogue([{speaker:"Sam",text:`£${pay}. Nobody complained in a legally actionable way. You're hired whenever.`}],"play");}
  }

  startFollow(){
    this.mode="follow";this.follow={time:0,playerX:180,maraX:590,suspicion:0,success:0,stopped:false};music.setScene("stalking",{infection:2},true);
  }
  updateFollow(dt){
    const f=this.follow;f.time+=dt;
    if(this.mouse.clicked)f.playerX=clamp(f.playerX+(this.mouse.x<W/2?-42:42),50,900);
    const move=(this.keys.has("ArrowRight")||this.keys.has("KeyD")?1:0)-(this.keys.has("ArrowLeft")||this.keys.has("KeyA")?1:0);
    f.playerX=clamp(f.playerX+move*150*dt,50,900);
    if(!f.stopped)f.maraX-=18*dt;
    const d=f.maraX-f.playerX;
    if(d<120)f.suspicion+=dt*30;else if(d>330)f.suspicion+=dt*18;else{f.suspicion=Math.max(0,f.suspicion-dt*8);f.success+=dt;}
    if(f.time>11&&!f.stopped){f.stopped=true;music.setScene("silence",{abrupt:true});}
    if(f.time>15&&f.stopped){f.stopped=false;f.maraX=620;music.setScene("stalking",{infection:2});}
    if(f.suspicion>=100){this.finishFollow(false);return;}
    if(f.time>=27){this.finishFollow(f.success>15);return;}
    if(this.consume("Escape"))this.finishFollow(false);
  }
  finishFollow(success){
    this.state.flags.followDone=true;this.state.flags.investigationUnlocked=true;this.state.flags.maraKnowsFollow=!success;this.mode="play";this.state.map="annex";this.state.player={x:120,y:400,facing:"right"};this.advanceTime(35);
    if(success)this.startDialogue([{speaker:"",text:"You keep two corners between you. Mara never looks back."},{speaker:"",text:"She enters the old annex. Seven minutes later, you realise you never saw the door open."}],"play");
    else this.startDialogue([{speaker:"",text:"Mara stops walking. She does not turn around."},{speaker:"Mara",text:"Are you having fun?"},{speaker:"",text:"She continues toward the annex. At college tomorrow, she will behave as if this never happened."}],"play");
    this.updateMusic(true);
  }

  updateParticles(dt){
    const s=this.state;
    if(s.weather==="rain"&&this.mode==="play"){
      for(const r of this.rain){r.y+=r.s*dt;r.x-=r.s*.15*dt;if(r.y>H){r.y=-10;r.x=Math.random()*W;}}
    }
    this.particles=this.particles.filter(p=>(p.life-=dt)>0);for(const p of this.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;}
  }
  buildRain(){for(let i=0;i<90;i++)this.rain.push({x:Math.random()*W,y:Math.random()*H,s:300+Math.random()*340});}

  draw(){
    ctx.save();if(this.screenShake>0)ctx.translate(Math.random()*4-2,Math.random()*4-2);
    if(this.mode==="title")this.drawTitle();
    else if(this.mode==="daycard")this.drawDayCard();
    else if(this.mode==="follow")this.drawFollow();
    else if(this.mode==="chapter")this.drawChapter();
    else {this.drawWorld();if(this.mode==="dialogue")this.drawDialogue();if(this.mode==="phone")this.drawPhone();if(this.mode==="journal")this.drawJournal();if(this.mode==="pause")this.drawPause();if(this.mode==="shop")this.drawShop();if(this.mode==="mini")this.drawMini();}
    if(this.toastTimer>0)this.drawToast();if(this.fade>0){ctx.fillStyle=`rgba(12,10,22,${this.fade})`;ctx.fillRect(0,0,W,H);}ctx.restore();
  }

  drawTitle(){
    const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#7f9faf");g.addColorStop(.58,"#efb595");g.addColorStop(1,"#252038");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    this.drawPixelSkyline();
    ctx.fillStyle="#fff3da";ctx.textAlign="center";ctx.font="52px Georgia";ctx.letterSpacing="12px";ctx.fillText("THURSDAY",480,126);ctx.letterSpacing="0px";
    ctx.fillStyle="#513849";ctx.font="italic 17px Georgia";ctx.fillText("Everybody begins somewhere.",480,158);
    this.drawPortrait("mara",735,305,1.45,"happy",true);
    const opts=this.hasSave()?["CONTINUE","NEW GAME","ABOUT"]:["NEW GAME","ABOUT"];
    opts.forEach((o,i)=>{const y=292+i*42;ctx.fillStyle=i===this.overlayIndex?"#fff3da":"#e5c1ad";ctx.font=i===this.overlayIndex?"bold 19px Georgia":"17px Georgia";ctx.textAlign="center";ctx.fillText(i===this.overlayIndex?`— ${o} —`:o,390,y+24);});
    ctx.fillStyle="#f7ddc777";ctx.font="13px Georgia";ctx.fillText("WASD / ARROWS · E / ENTER · P PHONE · J JOURNAL",390,500);
  }

  drawPixelSkyline(){
    ctx.fillStyle="#3a334c";for(let i=0;i<16;i++){const x=i*68-20,h=55+seeded(i+3)*100;ctx.fillRect(x,H-h,60,h);for(let yy=H-h+18;yy<H-10;yy+=22)for(let xx=x+12;xx<x+50;xx+=18){ctx.fillStyle=seeded(xx+yy)>.52?"#eab978":"#28243a";ctx.fillRect(xx,yy,6,9);}ctx.fillStyle="#3a334c";}
    ctx.fillStyle="#242136";ctx.fillRect(0,450,W,90);ctx.fillStyle="#8da7b2";ctx.fillRect(0,448,W,3);
  }

  drawDayCard(){ctx.fillStyle="#17152b";ctx.fillRect(0,0,W,H);const t=this.dayCard?.timer||0;ctx.globalAlpha=clamp(t,0,1);ctx.textAlign="center";ctx.fillStyle="#fff3da";ctx.font="52px Georgia";ctx.fillText(this.dayCard?.title||"MONDAY",480,250);ctx.fillStyle="#d0a993";ctx.font="italic 19px Georgia";ctx.fillText(this.dayCard?.sub||"",480,292);ctx.globalAlpha=1;}

  drawWorld(){
    this.drawMap(MAPS[this.state.map]);
    const actors=this.getNPCs().map(n=>({id:n.id,x:n.x,y:n.y,distant:n.id==="mara"&&n.distant,facing:n.facing||"down",moving:false}));
    actors.push({id:"player",x:this.state.player.x,y:this.state.player.y,distant:false,facing:this.state.player.facing,moving:this.playerMoving});
    actors.sort((a,b)=>a.y-b.y);for(const a of actors)this.drawSprite(a.id,a.x,a.y,a.distant,a.facing,a.moving);
    if(this.state.weather==="rain"&&!['bedroom','landing','cafe','arcade','classroom','cafeteria','library','musicroom','archive','annex'].includes(this.state.map))this.drawRain();
    this.drawHUD();this.drawPrompt();
    if(this.captionTimer>0){ctx.globalAlpha=clamp(this.captionTimer,0,1);ctx.fillStyle="#17152bcc";ctx.fillRect(340,72,280,38);ctx.fillStyle="#fff3da";ctx.textAlign="center";ctx.font="italic 16px Georgia";ctx.fillText(this.sceneCaption,480,97);ctx.globalAlpha=1;}
  }

  drawAtlasCell(img,cols,rows,index,x,y,w,h,alpha=1){
    if(!img)return false;const sw=img.width/cols,sh=img.height/rows,sx=(index%cols)*sw,sy=Math.floor(index/cols)*sh;
    ctx.save();ctx.globalAlpha=alpha;ctx.imageSmoothingEnabled=false;ctx.drawImage(img,sx,sy,sw,sh,x,y,w,h);ctx.restore();return true;
  }

  drawMaterial(index,x=0,y=0,w=W,h=H,alpha=.78){return this.drawAtlasCell(ART.materials,4,4,index,x,y,w,h,alpha);}
  drawFurniture(index,x,y,w,h,alpha=1){return this.drawAtlasCell(ART.furniture,5,4,index,x,y,w,h,alpha);}
  drawOutdoor(index,x,y,w,h,alpha=1){return this.drawAtlasCell(ART.outdoor,5,4,index,x,y,w,h,alpha);}

  drawMap(map){
    const k=map.kind;let floor="#a8a17d",wall="#5d5365";
    if(["bedroom","home"].includes(k)){floor="#b88468";wall="#6b4b58";}
    if(["street","town","station"].includes(k)){floor="#718083";wall="#475465";}
    if(k==="park"){floor="#6f9169";wall="#385a4c";}
    if(["college","hall","classroom","cafeteria","library","music","archive"].includes(k)){floor="#c0ae89";wall="#5a6072";}
    if(k==="cafe"){floor="#9b6d58";wall="#553b48";}
    if(k==="arcade"){floor="#302d50";wall="#19182d";}
    if(k==="annex"){floor="#423d43";wall="#1c1a24";}
    ctx.fillStyle=floor;ctx.fillRect(0,0,W,H);
    const floorTile={bedroom:0,home:2,street:3,town:4,station:13,park:12,college:6,hall:8,classroom:8,cafeteria:8,library:9,music:9,archive:14,cafe:10,arcade:11,annex:15}[k];
    if(floorTile!==undefined)this.drawMaterial(floorTile,0,0,W,H,k==="annex"?.58:.72);
    else for(let y=50;y<510;y+=32)for(let x=34;x<926;x+=32){ctx.fillStyle=(x/32+y/32)%2===0?"#ffffff08":"#00000008";ctx.fillRect(x,y,32,32);}
    const wallTile={bedroom:1,home:1,street:5,town:5,station:5,park:12,college:7,hall:7,classroom:7,cafeteria:7,library:7,music:7,archive:14,cafe:5,arcade:11,annex:15}[k];
    const furnishedInterior=["bedroom","home","classroom","cafeteria","library","music","cafe","arcade","archive","annex"].includes(k);
    for(const w of map.walls){
      const boundary=w.x<=1||w.y<=1||w.x+w.w>=959||w.y+w.h>=539;
      const visualOnlyCollision=(k==="college"&&w.y>200)||(k==="park"&&!boundary);if((furnishedInterior&&!boundary)||visualOnlyCollision)continue;
      ctx.fillStyle=wall;ctx.fillRect(w.x,w.y,w.w,w.h);if(wallTile!==undefined)this.drawMaterial(wallTile,w.x,w.y,w.w,w.h,.68);ctx.fillStyle="#fff9df18";ctx.fillRect(w.x,w.y,w.w,4);ctx.fillStyle="#12101b28";ctx.fillRect(w.x,w.y+w.h-5,w.w,5);
    }
    this.drawMapDetails(k,map);
    for(const e of map.exits){if(e.requires&&!this.state.flags[e.requires])continue;const near=Math.hypot(this.state.player.x-(e.x+e.w/2),this.state.player.y-(e.y+e.h/2))<92;if(near){ctx.fillStyle="#f3cc8b1c";ctx.fillRect(e.x,e.y,e.w,e.h);ctx.strokeStyle="#fff4dc44";ctx.strokeRect(e.x+.5,e.y+.5,e.w-1,e.h-1);}}
    for(const p of map.props)this.drawProp(p,k);
  }

  drawMapDetails(k,map){
    if(k==="bedroom"){
      ctx.fillStyle="#6c4960";ctx.fillRect(0,50,W,58);
      if(!ART.furniture){
        ctx.fillStyle="#a8c1c4";ctx.fillRect(385,54,170,50);ctx.fillStyle="#d8d5b9";ctx.fillRect(392,60,76,38);ctx.fillRect(476,60,72,38);
        ctx.fillStyle="#f0c890";ctx.fillRect(72,100,208,76);ctx.fillStyle="#cf7e75";ctx.fillRect(74,102,70,72);ctx.fillStyle="#e8bfa0";ctx.fillRect(146,102,132,72);
        ctx.fillStyle="#5b3e4b";ctx.fillRect(672,100,172,65);ctx.fillStyle="#1c2130";ctx.fillRect(708,72,96,62);ctx.fillStyle="#83a68f";ctx.fillRect(715,78,82,48);
      }
      if(this.state.day>=3){ctx.fillStyle="#37614a";ctx.fillRect(440,330,24,5);}
    }
    if(k==="home"){ctx.fillStyle="#e8c8a0";ctx.fillRect(430,98,410,102);ctx.fillStyle="#765465";ctx.fillRect(365,325,220,105);ctx.fillStyle="#d6b180";ctx.fillRect(380,340,190,70);}
    if(["street","town"].includes(k)){
      ctx.fillStyle="#3d4652";ctx.fillRect(0,240,W,210);ctx.fillStyle="#8d9692";ctx.fillRect(0,285,W,120);ctx.fillStyle="#c9b88e";ctx.fillRect(0,335,W,5);
      for(let x=80;x<W;x+=180){ctx.fillStyle="#e8bc74";ctx.fillRect(x,330,75,4);}
    }
    if(k==="college"){
      ctx.fillStyle="#5b4050";ctx.fillRect(110,55,740,136);this.drawMaterial(5,110,55,740,136,.42);ctx.fillStyle="#2c2638";ctx.fillRect(106,52,748,10);ctx.fillStyle="#d7b87b";ctx.fillRect(110,184,740,7);
      for(let x=145;x<820;x+=90){ctx.fillStyle="#332b3c";ctx.fillRect(x-4,76,56,80);ctx.fillStyle="#8eacb4";ctx.fillRect(x,80,48,69);ctx.fillStyle="#d8e1d955";ctx.fillRect(x+5,85,12,55);ctx.fillStyle="#513c4a";ctx.fillRect(x+22,80,4,69);ctx.fillRect(x,112,48,4);}
    }
    if(k==="classroom"){ctx.fillStyle="#3d5560";ctx.fillRect(130,92,700,55);for(let x of [180,435,690]){ctx.fillStyle="#7d5d50";ctx.fillRect(x,250,90,55);ctx.fillRect(x+8,305,8,40);ctx.fillRect(x+72,305,8,40);}}
    if(k==="cafeteria"){for(let x of [170,650]){ctx.fillStyle="#77584f";ctx.fillRect(x,270,140,70);ctx.fillStyle="#e0c99c";ctx.fillRect(x-5,265,150,12);}}
    if(k==="library"){for(let y=80;y<350;y+=42){ctx.fillStyle="#573f48";ctx.fillRect(78,y,154,28);ctx.fillRect(728,y,154,28);for(let x=85;x<220;x+=15){ctx.fillStyle=["#a55a55","#567784","#b49155"][Math.floor(x/15)%3];ctx.fillRect(x,y+3,10,22);ctx.fillRect(735+x-85,y+3,10,22);}}}
    if(k==="music"){ctx.fillStyle="#2f2839";ctx.fillRect(90,92,290,130);ctx.fillStyle="#eee1c4";for(let x=110;x<345;x+=18)ctx.fillRect(x,190,12,24);}
    if(k==="cafe"){ctx.fillStyle="#472f3a";ctx.fillRect(70,80,390,72);ctx.fillStyle="#d9a26b";ctx.fillRect(70,145,390,14);ctx.fillStyle="#e6c69c";ctx.fillRect(680,250,180,95);}
    if(k==="arcade"){for(let x of [80,150,760,830]){ctx.fillStyle="#18192c";ctx.fillRect(x,90,55,180);ctx.fillStyle=["#ec6e89","#65c1bb","#e4bb57"][x%3];ctx.fillRect(x+8,105,39,55);}}
    if(k==="park"&&!ART.outdoor){ctx.fillStyle="#557755";for(let i=0;i<9;i++){const x=60+i*108;ctx.fillRect(x,100,14,130);ctx.beginPath();ctx.arc(x+7,95,42,0,Math.PI*2);ctx.fill();}ctx.fillStyle="#5a8e8b";ctx.beginPath();ctx.ellipse(480,260,115,55,0,0,Math.PI*2);ctx.fill();}
    if(k==="station"){ctx.fillStyle="#2a303c";ctx.fillRect(75,80,810,60);ctx.fillStyle="#c3b47d";ctx.fillRect(120,245,720,16);ctx.fillStyle="#ede4c8";ctx.font="14px monospace";ctx.fillText("LARKSPUR  •  PLATFORM 1",360,115);}
    if(k==="archive"){for(let x of [120,390,660]){ctx.fillStyle="#4d4951";ctx.fillRect(x,75,180,85);ctx.fillStyle="#d6c2a0";ctx.fillRect(x+12,90,150,7);}}
    if(k==="annex"&&!ART.furniture){ctx.fillStyle="#17151d";ctx.fillRect(330,210,300,160);ctx.fillStyle="#6d222d";ctx.fillRect(730,80,100,110);if(this.state.corruption>=2){ctx.strokeStyle="#8b3340";ctx.beginPath();ctx.moveTo(780,80);ctx.lineTo(780,30);ctx.stroke();}}
    this.drawAuthoredProps(k);
  }

  drawAuthoredProps(k){
    if(!ART.furniture)return;
    if(k==="bedroom"){
      this.drawFurniture(0,48,62,270,205);this.drawFurniture(1,640,55,245,180);this.drawFurniture(2,38,326,205,170);this.drawFurniture(4,370,48,205,135);
      if(this.state.decor.includes("lamp"))this.drawFurniture(3,575,70,125,125);
      if(this.state.decor.includes("plant"))this.drawFurniture(13,180,306,105,120);this.drawFurniture(6,805,350,145,165);
    }
    if(k==="home"){this.drawFurniture(14,430,86,150,125);this.drawFurniture(6,790,318,130,160);}
    if(k==="street"||k==="town")this.drawFurniture(8,270,300,145,105);
    if(k==="park")this.drawFurniture(8,145,275,180,120);
    if(k==="college")this.drawFurniture(9,378,240,205,170);
    if(k==="hall")this.drawFurniture(7,238,230,445,190);
    if(k==="classroom"){this.drawFurniture(16,142,225,185,135);this.drawFurniture(16,388,225,185,135);this.drawFurniture(16,634,225,185,135);}
    if(k==="library"){this.drawFurniture(15,48,55,215,310);this.drawFurniture(15,695,55,215,310);this.drawFurniture(16,360,270,245,165);}
    if(k==="music")this.drawFurniture(17,68,66,350,235);
    if(k==="cafe"){this.drawFurniture(10,42,50,450,230);this.drawFurniture(11,640,230,245,185);this.drawFurniture(12,650,68,180,155);this.drawFurniture(13,825,68,95,115);}
    if(k==="arcade"){this.drawFurniture(18,45,65,120,225);this.drawFurniture(18,150,65,120,225);this.drawFurniture(18,690,65,120,225);this.drawFurniture(18,795,65,120,225);}
    if(k==="archive")this.drawFurniture(15,92,45,230,195);
    if(k==="annex")this.drawFurniture(19,315,210,330,225,.9);
    if(ART.outdoor){
      if(k==="street"){this.drawOutdoor(7,610,205,105,180);this.drawOutdoor(8,670,210,225,150);this.drawOutdoor(9,270,205,125,135);}
      if(k==="town"){this.drawOutdoor(10,35,35,250,220);this.drawOutdoor(11,305,35,285,220);this.drawOutdoor(12,610,35,285,220);}
      if(k==="college"){this.drawOutdoor(15,174,78,150,145);this.drawOutdoor(15,404,78,150,145);this.drawOutdoor(15,634,78,150,145);this.drawOutdoor(3,84,218,210,95);this.drawOutdoor(3,668,218,210,95);this.drawOutdoor(9,730,260,165,150);}
      if(k==="park"){
        this.drawOutdoor(0,25,42,205,215);this.drawOutdoor(1,205,45,175,205);this.drawOutdoor(0,745,42,205,215);this.drawOutdoor(1,610,48,165,195);this.drawOutdoor(5,350,188,270,185);this.drawOutdoor(6,690,118,225,190);this.drawOutdoor(4,75,255,170,90);this.drawOutdoor(4,690,325,170,90);
      }
      if(k==="station"){this.drawOutdoor(13,690,105,165,190);this.drawOutdoor(14,310,72,330,105);}
      if(k==="annex")this.drawOutdoor(19,700,40,150,190);
    }
  }

  drawProp(p,k){
    if(["bed","desk","window","shelf","kettle","frontdoor","bench","parkbench","fountain","lockers","study","seat1","seat2","seat3","table1","table2","pond","piano","piano2","booth","counter","machine","box","photos","greenhouse","bus","notice","board","shop","redDoor"].includes(p.id))return;
    ctx.fillStyle=k==="annex"?"#5c4a42":"#6f5b50";ctx.fillRect(p.x,p.y,p.w,p.h);ctx.fillStyle="#ffffff16";ctx.fillRect(p.x+4,p.y+4,p.w-8,5);
    if(p.id==="redDoor"){ctx.fillStyle="#762b35";ctx.fillRect(p.x,p.y,p.w,p.h);ctx.fillStyle="#d9ad77";ctx.beginPath();ctx.arc(p.x+p.w-17,p.y+p.h/2,4,0,Math.PI*2);ctx.fill();}
  }

  drawArtSprite(id,x,y,distant=false,facing="down",moving=false){
    const artFrame=moving?Math.floor(performance.now()/140)%4:0,bob=moving&&artFrame%2?-2:0;
    ctx.save();ctx.translate(Math.round(x),Math.round(y+bob));if(distant)ctx.globalAlpha=.68;
    ctx.fillStyle="#17152255";ctx.beginPath();ctx.ellipse(0,19,id==="mara"?18:16,5,0,0,Math.PI*2);ctx.fill();
    if(id==="player"&&ART.alexWalk){
      const img=ART.alexWalk,sw=img.width/4,sh=img.height/4,row={down:0,left:1,right:2,up:3}[facing]??0;
      ctx.imageSmoothingEnabled=false;ctx.drawImage(img,artFrame*sw,row*sh,sw,sh,-49,-72,98,98);ctx.restore();return true;
    }
    if(id==="mara"&&ART.maraWalk){
      const img=ART.maraWalk,sw=img.width/4,sh=img.height/4,row={down:0,left:1,right:2,up:3}[facing]??0,col=artFrame;
      ctx.imageSmoothingEnabled=false;ctx.drawImage(img,col*sw,row*sh,sw,sh,-44,-66,88,88);ctx.restore();return true;
    }
    const rows={iris:0,june:1,theo:2,ren:3,nia:4,sam:5};
    if(rows[id]!==undefined&&ART.castDirections){
      const img=ART.castDirections,sw=img.width/4,sh=img.height/6,col={down:0,left:1,right:2,up:3}[facing]??0;
      ctx.imageSmoothingEnabled=false;ctx.drawImage(img,col*sw,rows[id]*sh,sw,sh,-48,-69,96,96);ctx.restore();return true;
    }
    ctx.restore();return false;
  }

  drawSprite(id,x,y,distant=false,facing="down",moving=false){
    const isPlayer=id==="player";if(this.drawArtSprite(id,x,y,distant,facing,moving))return;
    const c=isPlayer?{hair:"#392f3d",coat:"#4a627c",skin:"#d9a687",sprite:{hairStyle:"sidepart",accent:"#c9a56b",legs:"#26384f",shoes:"#23212d",accessory:"bag"}}:CHARACTERS[id];
    const sp=c.sprite||{}, frame=moving?Math.floor(this.playerWalkTime*8)%4:0, stride=frame===1?2:frame===3?-2:0, bob=moving&&frame%2===1?-1:0;
    const flip=facing==="left"?-1:1;ctx.save();ctx.translate(Math.round(x),Math.round(y+bob));ctx.scale(flip,1);if(distant)ctx.globalAlpha=.7;
    ctx.fillStyle="#17152248";ctx.beginPath();ctx.ellipse(0,28,17,6,0,0,Math.PI*2);ctx.fill();
    // Legs and shoes have a readable two-frame step without tweening.
    ctx.fillStyle=sp.legs||"#343044";ctx.fillRect(-9+stride,-1,8,23);ctx.fillRect(1-stride,-1,8,23);
    ctx.fillStyle=sp.shoes||"#29232e";ctx.fillRect(-10+stride,20,10,7);ctx.fillRect(1-stride,20,10,7);ctx.fillStyle="#ffffff22";ctx.fillRect(-9+stride,20,8,2);ctx.fillRect(2-stride,20,8,2);
    // Coat/body silhouette, sleeves, collar and a one-pixel highlight.
    ctx.fillStyle=c.coat;ctx.fillRect(-13,-13,26,25);ctx.fillRect(-16,-10+Math.max(0,stride),5,20);ctx.fillRect(11,-10+Math.max(0,-stride),5,20);
    ctx.fillStyle=shade(c.coat,-22);ctx.fillRect(-13,8,26,5);ctx.fillRect(8,-12,5,20);ctx.fillStyle=shade(c.coat,24);ctx.fillRect(-11,-11,3,17);
    ctx.fillStyle=c.skin;ctx.fillRect(-16,8+Math.max(0,stride),5,5);ctx.fillRect(11,8+Math.max(0,-stride),5,5);
    ctx.fillStyle=sp.accent||"#ead5b5";ctx.beginPath();ctx.moveTo(-8,-13);ctx.lineTo(0,-5);ctx.lineTo(8,-13);ctx.lineTo(4,-15);ctx.lineTo(0,-10);ctx.lineTo(-4,-15);ctx.closePath();ctx.fill();
    if(sp.accessory==="apron"){ctx.fillStyle="#eadfce";ctx.fillRect(-8,-9,16,18);ctx.fillStyle="#b8a995";ctx.fillRect(-6,2,12,5);}
    if(sp.accessory==="hood"){ctx.strokeStyle=sp.accent;ctx.lineWidth=2;ctx.strokeRect(-9,-13,18,7);}
    if(sp.accessory==="camera"){ctx.fillStyle="#252638";ctx.fillRect(-7,0,14,9);ctx.fillStyle="#7296a2";ctx.fillRect(-2,2,5,5);ctx.strokeStyle="#252638";ctx.beginPath();ctx.moveTo(-9,-12);ctx.lineTo(8,2);ctx.stroke();}
    if(sp.accessory==="bag"&&facing!=="up"){ctx.strokeStyle="#b69267";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-10,-11);ctx.lineTo(9,8);ctx.stroke();ctx.fillStyle="#8e6c4f";ctx.fillRect(7,4,7,11);}
    // Neck, head and directional face.
    ctx.fillStyle=c.skin;ctx.fillRect(-5,-20,10,8);ctx.fillRect(-11,-37,22,20);ctx.fillStyle=shade(c.skin,-12);ctx.fillRect(-11,-19,22,2);
    this.drawSpriteHair(sp.hairStyle||"bob",c.hair,facing);
    if(facing!=="up"){
      const blink=!moving&&Math.floor(performance.now()/120+(isPlayer?3:id.length*11))%53===0;
      ctx.fillStyle="#2b2432";
      if(facing==="left"||facing==="right"){ctx.fillRect(3,-29,3,3);ctx.fillStyle=shade(c.skin,-20);ctx.fillRect(9,-25,3,2);}
      else {ctx.fillRect(-6,-29,3,blink?1:3);ctx.fillRect(4,-29,3,blink?1:3);if(!blink){ctx.fillStyle="#fff5dc";ctx.fillRect(-6,-29,1,1);ctx.fillRect(4,-29,1,1);}ctx.fillStyle=shade(c.skin,-25);ctx.fillRect(-2,-23,5,2);}
      if(sp.accessory==="glasses"){ctx.strokeStyle="#39323b";ctx.lineWidth=1;ctx.strokeRect(-8,-31,7,6);ctx.strokeRect(2,-31,7,6);ctx.fillRect(-1,-29,3,1);}
      if(sp.accessory==="earrings"){ctx.fillStyle=sp.accent;ctx.fillRect(-12,-25,2,4);ctx.fillRect(10,-25,2,4);}
    }
    if(sp.accessory==="pin"){ctx.fillStyle=sp.accent;ctx.fillRect(7,-9,3,3);}
    if(id==="mara"){
      ctx.fillStyle=sp.accent;ctx.fillRect(7,-40,7,3);ctx.fillRect(9,-42,3,7);
      if(this.state.corruption>=3&&seeded(Math.floor(performance.now()/300))>.975){ctx.fillStyle="#140f19";ctx.fillRect(-8,-30,6,3);ctx.fillRect(3,-30,7,3);}
    }
    ctx.restore();
  }

  drawSpriteHair(style,color,facing){
    ctx.fillStyle=color;
    if(style==="long"){ctx.fillRect(-13,-42,26,10);ctx.fillRect(-14,-35,7,28);ctx.fillRect(8,-35,7,30);ctx.fillRect(-9,-44,18,5);if(facing==="up")ctx.fillRect(-10,-36,20,22);}
    else if(style==="bob"){ctx.fillRect(-13,-41,26,9);ctx.fillRect(-13,-35,6,20);ctx.fillRect(8,-35,6,20);ctx.fillRect(-8,-43,17,4);}
    else if(style==="locs"){ctx.fillRect(-12,-41,24,8);for(let i=-12;i<=10;i+=5)ctx.fillRect(i,-35,4,22+(i%3)*2);ctx.fillRect(-8,-44,18,4);}
    else if(style==="messy"){ctx.fillRect(-12,-40,24,8);ctx.fillRect(-10,-44,6,7);ctx.fillRect(-2,-46,6,9);ctx.fillRect(6,-43,6,7);ctx.fillRect(-13,-34,5,11);}
    else if(style==="undercut"){ctx.fillRect(-12,-41,24,7);ctx.fillRect(-12,-35,6,12);ctx.fillRect(-7,-44,19,5);}
    else if(style==="puff"){ctx.fillRect(-11,-39,22,8);ctx.beginPath();ctx.arc(0,-45,12,0,Math.PI*2);ctx.fill();ctx.fillRect(-12,-34,5,10);}
    else if(style==="curly"){for(let yy=-44;yy<-32;yy+=5)for(let xx=-12;xx<=9;xx+=5){ctx.beginPath();ctx.arc(xx,yy,5,0,Math.PI*2);ctx.fill();}ctx.fillRect(-13,-35,6,14);}
    else {ctx.fillRect(-12,-41,24,9);ctx.fillRect(-12,-36,6,15);ctx.fillRect(5,-43,8,9);}
  }

  drawHUD(){
    const s=this.state;ctx.fillStyle="#151326e8";ctx.fillRect(0,0,W,52);ctx.fillStyle="#fff3da";ctx.textAlign="left";ctx.font="bold 16px Georgia";ctx.fillText(`${dayName(s.day)}  ${fmtTime(s.time)}`,22,22);ctx.fillStyle="#cfae91";ctx.font="13px Georgia";ctx.fillText(MAPS[s.map].name,22,41);
    ctx.textAlign="right";ctx.fillStyle="#e6bd74";ctx.font="bold 15px Georgia";ctx.fillText(`£${s.money}`,930,22);ctx.fillStyle="#cfae91";ctx.font="12px Georgia";ctx.fillText(`P PHONE   J JOURNAL   ESC PAUSE`,930,42);
    const unread=Object.values(s.unread).reduce((a,b)=>a+b,0);if(unread){ctx.fillStyle="#c95f78";ctx.beginPath();ctx.arc(820,19,10,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff";ctx.textAlign="center";ctx.font="bold 11px sans-serif";ctx.fillText(unread,820,23);}
  }

  drawPrompt(){if(!this.nearby||this.mode!=="play")return;const text=`E  ${this.nearby.label}`;ctx.font="14px Georgia";const w=ctx.measureText(text).width+30;ctx.fillStyle="#17152be8";ctx.fillRect(480-w/2,470,w,34);ctx.strokeStyle="#fff3da55";ctx.strokeRect(480-w/2+.5,470.5,w-1,33);ctx.fillStyle="#fff3da";ctx.textAlign="center";ctx.fillText(text,480,492);}

  drawRain(){ctx.strokeStyle="#c7d7dd80";ctx.lineWidth=1;ctx.beginPath();for(const r of this.rain){ctx.moveTo(r.x,r.y);ctx.lineTo(r.x-5,r.y+13);}ctx.stroke();ctx.fillStyle="#31415122";ctx.fillRect(0,0,W,H);}

  drawDialogue(){
    const line=this.dialogue?.[this.dialogueIndex];if(!line)return;
    const boxY=line.choices?250:374;ctx.fillStyle="#161426f2";ctx.fillRect(42,boxY,W-84,H-boxY-28);ctx.strokeStyle=line.portrait==="mara"?"#c97582":"#d6b894";ctx.lineWidth=2;ctx.strokeRect(43,boxY+1,W-86,H-boxY-30);
    const portraitX=line.choices?170:145,portraitY=line.choices?410:290,portraitScale=line.choices?.75:1;
    const hintStart=line.text.length*(line.demonHintAt??.52),hintEnd=Math.min(line.text.length-.05,hintStart+4.8),hintActive=!!line.demonHint&&this.dialogueReveal>=hintStart&&this.dialogueReveal<hintEnd;
    if(line.portrait&&hintActive&&line.demonHint!=="horn")this.drawDemonHint(portraitX,portraitY,portraitScale,line.demonHint);
    const portraitExpression=line.expression||(line.portrait==="mara"?(line.demonHint?"still":"neutral"):"normal");
    if(line.portrait)this.drawPortrait(line.portrait,portraitX,portraitY,portraitScale,portraitExpression);
    if(line.portrait&&hintActive&&line.demonHint==="horn")this.drawDemonHint(portraitX,portraitY,portraitScale,line.demonHint);
    if(line.speaker){ctx.fillStyle=line.portrait==="mara"?"#f0a2aa":"#e8c792";ctx.font="bold 18px Georgia";ctx.textAlign="left";ctx.fillText(line.speaker,70,boxY+31);}
    ctx.fillStyle="#fff3da";ctx.font="18px Georgia";ctx.textAlign="left";this.wrapText(line.text.slice(0,Math.floor(this.dialogueReveal)),70,boxY+60,820,25);
    if(line.choices&&this.dialogueReveal>=line.text.length){line.choices.forEach((c,i)=>{const y=315+i*46;ctx.fillStyle=i===this.choiceIndex?"#7c4a60":"#29243a";ctx.fillRect(400,y,500,38);ctx.strokeStyle=i===this.choiceIndex?"#f0bd9e":"#ffffff18";ctx.strokeRect(400.5,y+.5,499,37);ctx.fillStyle="#fff3da";ctx.font="15px Georgia";ctx.fillText(`${i+1}. ${c.text}`,418,y+25);});}
    else if(this.dialogueReveal>=line.text.length){ctx.fillStyle="#e8c792";ctx.font="12px sans-serif";ctx.textAlign="right";ctx.fillText("▼",890,H-44);}
  }

  drawDemonHint(x,y,scale,type){
    ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.globalAlpha=.82;ctx.fillStyle="#2a1728";ctx.strokeStyle="#2a1728";ctx.lineWidth=5;
    if(type==="horn"){
      ctx.beginPath();ctx.moveTo(-36,-51);ctx.quadraticCurveTo(-49,-84,-23,-96);ctx.quadraticCurveTo(-34,-75,-19,-57);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(34,-53);ctx.quadraticCurveTo(48,-86,23,-98);ctx.quadraticCurveTo(34,-74,18,-58);ctx.closePath();ctx.fill();
    }
    if(type==="tail"){
      ctx.beginPath();ctx.moveTo(54,45);ctx.bezierCurveTo(104,53,96,-8,119,3);ctx.stroke();ctx.beginPath();ctx.moveTo(113,-5);ctx.lineTo(130,3);ctx.lineTo(115,12);ctx.closePath();ctx.fill();
    }
    if(type==="shadow"){
      ctx.globalAlpha=.5;ctx.beginPath();ctx.moveTo(-58,70);ctx.quadraticCurveTo(-74,-55,-28,-103);ctx.lineTo(-12,-72);ctx.lineTo(0,-115);ctx.lineTo(14,-71);ctx.lineTo(31,-102);ctx.quadraticCurveTo(74,-50,58,70);ctx.closePath();ctx.fill();
    }
    ctx.restore();
  }

  drawArtPortrait(id,x,y,scale=1,expression="normal"){
    const size=176*scale,dx=x-size/2,dy=y-size/2;
    let img,cols,rows,index;
    if(id==="mara"&&ART.maraPortraits){img=ART.maraPortraits;cols=2;rows=3;index={neutral:0,happy:0,laugh:1,shy:2,cry:3,jealous:4,still:5}[expression]??0;}
    else if(ART.castPortraits){const order={iris:0,june:1,theo:2,ren:3,nia:4,sam:5};if(order[id]===undefined)return false;img=ART.castPortraits;cols=3;rows=2;index=order[id];}
    else return false;
    const sw=img.width/cols,sh=img.height/rows,sx=(index%cols)*sw,sy=Math.floor(index/cols)*sh;
    ctx.save();ctx.beginPath();ctx.arc(x,y,size*.49,0,Math.PI*2);ctx.clip();ctx.fillStyle=id==="mara"?"#28202d":"#362b34";ctx.fillRect(dx,dy,size,size);ctx.imageSmoothingEnabled=false;ctx.drawImage(img,sx,sy,sw,sh,dx,dy,size,size);ctx.restore();
    ctx.save();ctx.strokeStyle=id==="mara"?"#d49887aa":"#d6b89488";ctx.lineWidth=2*scale;ctx.beginPath();ctx.arc(x,y,size*.49,0,Math.PI*2);ctx.stroke();ctx.restore();return true;
  }

  drawPortrait(id,x,y,scale=1,expression="normal",large=false){
    if(this.drawArtPortrait(id,x,y,scale,expression))return;
    const c=CHARACTERS[id];if(!c)return;ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);
    ctx.fillStyle="#201b2c88";ctx.beginPath();ctx.arc(0,0,82,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#00000020";ctx.beginPath();ctx.ellipse(7,71,68,22,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=c.coat;ctx.beginPath();ctx.moveTo(-77,80);ctx.quadraticCurveTo(-55,34,-20,26);ctx.lineTo(0,48);ctx.lineTo(20,26);ctx.quadraticCurveTo(58,35,77,80);ctx.closePath();ctx.fill();
    ctx.fillStyle="#e8d5ba";ctx.beginPath();ctx.moveTo(-21,27);ctx.lineTo(0,48);ctx.lineTo(-8,57);ctx.lineTo(-32,31);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(21,27);ctx.lineTo(0,48);ctx.lineTo(8,57);ctx.lineTo(32,31);ctx.closePath();ctx.fill();
    ctx.fillStyle=c.skin;ctx.beginPath();ctx.ellipse(0,-5,49,61,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#a65e6240";ctx.beginPath();ctx.ellipse(-27,5,10,5,0,0,Math.PI*2);ctx.ellipse(27,5,10,5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=c.hair;ctx.beginPath();ctx.arc(0,-38,55,Math.PI,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(-54,-42);ctx.lineTo(-39,-55);ctx.lineTo(-35,40);ctx.lineTo(-55,32);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(54,-43);ctx.lineTo(39,-55);ctx.lineTo(36,43);ctx.lineTo(55,35);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(-47,-48);ctx.quadraticCurveTo(-14,-76,12,-57);ctx.quadraticCurveTo(31,-72,48,-45);ctx.lineTo(37,-26);ctx.quadraticCurveTo(14,-42,-2,-45);ctx.quadraticCurveTo(-20,-34,-39,-29);ctx.closePath();ctx.fill();
    ctx.strokeStyle="#5b3540";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-25,-18);ctx.quadraticCurveTo(-20,-22,-13,-19);ctx.moveTo(13,-19);ctx.quadraticCurveTo(20,-22,26,-17);ctx.stroke();
    ctx.fillStyle="#302333";ctx.beginPath();ctx.ellipse(-20,-9,5,4,0,0,Math.PI*2);ctx.ellipse(20,-9,5,4,0,0,Math.PI*2);ctx.fill();ctx.fillStyle="#fff8e8";ctx.fillRect(-21,-11,2,2);ctx.fillRect(19,-11,2,2);
    ctx.strokeStyle="#c27d6d";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(-2,5);ctx.lineTo(3,6);ctx.stroke();
    ctx.strokeStyle="#9a4e55";ctx.lineWidth=2;ctx.beginPath();if(expression==="happy"||id==="mara")ctx.arc(0,11,15,.15,Math.PI-.15);else{ctx.moveTo(-10,18);ctx.lineTo(10,18);}ctx.stroke();
    if(id==="mara"){ctx.fillStyle="#e7bd56";ctx.beginPath();ctx.moveTo(40,-59);ctx.lineTo(51,-65);ctx.lineTo(48,-53);ctx.lineTo(58,-46);ctx.lineTo(45,-45);ctx.lineTo(39,-34);ctx.closePath();ctx.fill();}ctx.restore();
  }

  drawPhone(){
    ctx.fillStyle="#0c0b14bb";ctx.fillRect(0,0,W,H);const x=180,y=48,w=600,h=450;ctx.fillStyle="#171725";ctx.fillRect(x,y,w,h);ctx.strokeStyle="#9da8af";ctx.lineWidth=5;ctx.strokeRect(x,y,w,h);ctx.fillStyle="#24253a";ctx.fillRect(x+15,y+40,175,h-60);
    ctx.fillStyle="#fff3da";ctx.font="bold 18px sans-serif";ctx.textAlign="left";ctx.fillText("MESSAGES",x+22,y+28);
    this.state.contacts.forEach((id,i)=>{const yy=y+55+i*48;ctx.fillStyle=i===this.phoneContact?"#5b4561":"transparent";ctx.fillRect(x+20,yy,165,40);ctx.fillStyle="#fff3da";ctx.font="14px sans-serif";ctx.fillText(CHARACTERS[id]?.name||id,x+30,yy+25);if(this.state.unread[id]){ctx.fillStyle="#d6657e";ctx.beginPath();ctx.arc(x+170,yy+20,9,0,Math.PI*2);ctx.fill();}});
    const id=this.state.contacts[this.phoneContact],msgs=this.state.messages[id]||[];ctx.fillStyle="#f7ead4";ctx.font="bold 16px sans-serif";ctx.fillText(CHARACTERS[id]?.name||id,x+215,y+70);
    let yy=y+95;for(const m of msgs.slice(-7)){const mine=m.from==="you";const bw=Math.min(330,ctx.measureText(m.text).width+30);ctx.fillStyle=mine?"#536f63":"#3a334d";ctx.fillRect(mine?x+w-35-bw:x+215,yy,bw,42);ctx.fillStyle="#fff";ctx.font="13px sans-serif";this.wrapText(m.text,mine?x+w-25-bw:x+225,yy+17,bw-20,16);yy+=51;}
    ctx.fillStyle="#aeb1bd";ctx.font="12px sans-serif";ctx.fillText(id==="mara"?"R reply   P / ESC close":"↑↓ contacts   P / ESC close",x+215,y+h-20);
  }

  drawJournal(){
    ctx.fillStyle="#181426e8";ctx.fillRect(0,0,W,H);ctx.fillStyle="#ead9b9";ctx.fillRect(115,45,730,450);ctx.fillStyle="#3b3041";ctx.textAlign="left";ctx.font="bold 28px Georgia";ctx.fillText("ALEX'S WEEK",155,88);ctx.font="italic 14px Georgia";ctx.fillText("Things worth remembering while they still agree with you.",155,112);
    let y=145;ctx.font="bold 17px Georgia";ctx.fillText("QUESTS",155,y);y+=27;for(const [id,q] of Object.entries(this.state.quests)){const d=QUESTS[id];ctx.font="bold 15px Georgia";ctx.fillStyle=q.complete?"#66805d":"#493c49";ctx.fillText(`${q.complete?"✓":"○"} ${d?.name||id}`,165,y);ctx.font="13px Georgia";this.wrapText(d?.desc||"",185,y+18,580,18);y+=52;}
    ctx.fillStyle="#493c49";ctx.font="bold 17px Georgia";ctx.fillText("RECENT",155,y);y+=25;ctx.font="13px Georgia";for(const line of this.state.log.slice(this.overlayIndex,this.overlayIndex+5)){this.wrapText(line,165,y,600,18);y+=38;}
    ctx.fillStyle="#6a5964";ctx.font="12px sans-serif";ctx.fillText("J / ESC close   ↑↓ scroll",155,474);
  }

  drawPause(){ctx.fillStyle="#0b0a14cc";ctx.fillRect(0,0,W,H);ctx.fillStyle="#211d34";ctx.fillRect(320,105,320,330);ctx.strokeStyle="#dcc29a";ctx.strokeRect(321,106,318,328);ctx.fillStyle="#fff3da";ctx.textAlign="center";ctx.font="30px Georgia";ctx.fillText("PAUSED",480,155);const opts=["RESUME","SAVE GAME",music.muted?"SOUND: OFF":"SOUND: ON","TITLE SCREEN"];opts.forEach((o,i)=>{ctx.fillStyle=i===this.overlayIndex?"#efbd9b":"#a99b9b";ctx.font=i===this.overlayIndex?"bold 18px Georgia":"16px Georgia";ctx.fillText(o,480,220+i*48);});}

  drawShop(){ctx.fillStyle="#0b0a14cc";ctx.fillRect(0,0,W,H);ctx.fillStyle="#eee0c4";ctx.fillRect(250,70,460,400);ctx.fillStyle="#493642";ctx.textAlign="left";ctx.font="bold 26px Georgia";ctx.fillText("CORNER SHOP",285,115);ctx.textAlign="right";ctx.fillText(`£${this.state.money}`,675,115);const goods=[{id:"film",price:5},{id:"record",price:8},{id:"plant",price:6},{id:"pastry",price:3}];goods.forEach((g,i)=>{const y=150+i*58;ctx.fillStyle=i===this.overlayIndex?"#d8ad82":"#ead8bb";ctx.fillRect(280,y,400,48);ctx.fillStyle="#493642";ctx.textAlign="left";ctx.font="bold 15px Georgia";ctx.fillText(ITEMS[g.id].name,295,y+20);ctx.font="12px Georgia";ctx.fillText(ITEMS[g.id].desc,295,y+38);ctx.textAlign="right";ctx.font="bold 15px Georgia";ctx.fillText(`£${g.price}`,660,y+28);});ctx.fillStyle=this.overlayIndex===goods.length?"#7d5060":"#493642";ctx.textAlign="center";ctx.font="bold 16px Georgia";ctx.fillText("LEAVE",480,420);}

  drawMini(){
    this.drawWorld();ctx.fillStyle="#11101be8";ctx.fillRect(160,110,640,300);ctx.strokeStyle="#e5c28e";ctx.strokeRect(161,111,638,298);const m=this.mini;ctx.fillStyle="#fff3da";ctx.textAlign="center";ctx.font="bold 25px Georgia";ctx.fillText(m.type==="arcade"?"STARLANCE":m.type==="rhythm"?"FIND THE PULSE":"FOXGLOVE RUSH",480,160);ctx.font="14px Georgia";ctx.fillText("Press SPACE / E when the marker crosses the light",480,192);
    ctx.fillStyle="#3b3450";ctx.fillRect(250,260,460,28);ctx.fillStyle="#e8b765";ctx.fillRect(250+m.target*460-22,255,44,38);ctx.fillStyle="#f9eee0";ctx.fillRect(247+m.cursor*460,245,6,58);ctx.font="bold 18px Georgia";ctx.fillText(`${m.score}   •   ${m.round}/6   ${m.message}`,480,345);
  }

  drawFollow(){
    const f=this.follow,g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,"#171827");g.addColorStop(1,"#403643");ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.fillStyle="#11121d";for(let i=0;i<12;i++){const x=(i*120-f.time*35)%1080-60;ctx.fillRect(x,100,80,260);ctx.fillRect(x+20,70,10,300);}ctx.fillStyle="#56525c";ctx.fillRect(0,390,W,150);ctx.fillStyle="#8c7d74";ctx.fillRect(0,420,W,5);
    this.drawSprite("player",f.playerX,400,false,"right",true);this.drawSprite("mara",f.maraX,400,false,"right",true);ctx.fillStyle="#151326dd";ctx.fillRect(0,0,W,65);ctx.fillStyle="#fff3da";ctx.font="bold 16px Georgia";ctx.textAlign="left";ctx.fillText("FOLLOW MARA — keep your distance",25,27);ctx.fillStyle="#3a3044";ctx.fillRect(25,40,300,10);ctx.fillStyle=f.suspicion>70?"#d65e70":"#d7b778";ctx.fillRect(25,40,300*f.suspicion/100,10);ctx.textAlign="right";ctx.fillStyle="#cbb7a7";ctx.fillText(`${Math.ceil(27-f.time)}s`,930,31);
    if(f.stopped){ctx.fillStyle="#fff3da";ctx.textAlign="center";ctx.font="italic 18px Georgia";ctx.fillText("She stops walking.",480,110);}
  }

  drawChapter(){
    ctx.fillStyle="#12101d";ctx.fillRect(0,0,W,H);ctx.textAlign="center";ctx.fillStyle="#fff3da";ctx.font="42px Georgia";ctx.fillText("THE GOOD WEEK",480,105);ctx.fillStyle="#c68a8f";ctx.font="italic 19px Georgia";ctx.fillText("Opening chapter complete",480,137);
    const s=this.state;ctx.textAlign="left";ctx.font="16px Georgia";ctx.fillStyle="#dfcfb8";const lines=[
      `People you grew close to: ${Object.entries(s.relationships).filter(([id,r])=>id!=="mara"&&r.affection>=4).map(([id])=>CHARACTERS[id].name).join(", ")||"not enough time"}`,
      `Mara's affection: ${s.relationships.mara.affection}   Her quiet resentment: ${s.relationships.mara.resentment}`,
      `Clues carried into Chapter Two: ${s.clues}`,
      `Rare events witnessed: ${s.stats.events} of ${RANDOM_EVENTS.length}`,
      `The girl in the photograph: still smiling`
    ];lines.forEach((l,i)=>ctx.fillText(l,250,205+i*43));ctx.textAlign="center";ctx.fillStyle="#efb0b4";ctx.font="18px Georgia";ctx.fillText("Mara will remember how you played.",480,435);ctx.fillStyle="#ad9ba3";ctx.font="13px sans-serif";ctx.fillText("Press E / ENTER to continue exploring Friday",480,480);
  }

  drawToast(){ctx.globalAlpha=clamp(this.toastTimer,0,1);ctx.font="14px Georgia";const w=Math.min(600,ctx.measureText(this.toast).width+40);ctx.fillStyle="#17152bee";ctx.fillRect(480-w/2,70,w,38);ctx.strokeStyle="#d7b58a";ctx.strokeRect(480-w/2+.5,70.5,w-1,37);ctx.fillStyle="#fff3da";ctx.textAlign="center";ctx.fillText(this.toast,480,94);ctx.globalAlpha=1;}

  wrapText(text,x,y,maxWidth,lineHeight){const words=String(text).split(" ");let line="";for(let n=0;n<words.length;n++){const test=line+words[n]+" ";if(ctx.measureText(test).width>maxWidth&&n>0){ctx.fillText(line,x,y);line=words[n]+" ";y+=lineHeight;}else line=test;}ctx.fillText(line,x,y);return y;}
}

function safeHas(obj,key){return !!(obj&&obj[key]);}

const game=new Game();
window.THURSDAY=game;
