const N = null;
const THEMES = {
  home: {
    bpm:78, root:48, wave:"triangle", color:"warm",
    chords:[[0,4,7,11],[5,9,12,16],[9,12,16,19],[7,11,14,17]],
    lead:[N,N,7,N,4,N,2,N, 0,N,4,N,5,N,4,N], bass:[0,N,N,N,5,N,N,N,9,N,N,N,7,N,N,N]
  },
  morning: {
    bpm:96, root:55, wave:"sine", color:"bright",
    chords:[[0,4,7,9],[5,9,12,16],[7,11,14,18],[0,4,7,11]],
    lead:[0,2,4,N,7,N,4,2, 5,7,9,N,7,4,2,N], bass:[0,N,7,N,5,N,0,N,7,N,2,N,0,N,7,N]
  },
  school: {
    bpm:112, root:60, wave:"sine", color:"bright",
    chords:[[0,4,7,11],[2,5,9,12],[5,9,12,16],[7,11,14,18]],
    lead:[0,4,7,4,2,5,9,5, 4,7,11,7,2,5,7,N], bass:[0,N,0,N,2,N,2,N,5,N,5,N,7,N,7,N]
  },
  town: {
    bpm:104, root:53, wave:"triangle", color:"warm",
    chords:[[0,4,7,9],[9,12,16,19],[5,9,12,16],[7,11,14,17]],
    lead:[N,4,N,7,9,N,7,4, N,2,5,N,4,2,0,N], bass:[0,N,7,N,9,N,4,N,5,N,0,N,7,N,2,N]
  },
  friends: {
    bpm:118, root:58, wave:"square", color:"bright", softSquare:true,
    chords:[[0,4,7,11],[7,11,14,17],[9,12,16,19],[5,9,12,16]],
    lead:[0,N,4,7,N,4,2,N, 7,N,9,7,5,N,4,2], bass:[0,N,0,N,7,N,7,N,9,N,9,N,5,N,5,N]
  },
  cafe: {
    bpm:86, root:53, wave:"triangle", color:"warm",
    chords:[[0,4,7,11],[9,12,16,19],[2,5,9,12],[7,11,14,17]],
    lead:[4,N,7,9,7,N,4,N, 5,N,9,12,11,N,7,N], bass:[0,N,N,7,9,N,N,4,2,N,N,9,7,N,N,2]
  },
  library: {
    bpm:68, root:50, wave:"sine", color:"quiet",
    chords:[[0,3,7,10],[5,8,12,15],[8,12,15,19],[7,10,14,17]],
    lead:[N,7,N,N,3,N,2,N, N,5,N,N,3,N,0,N], bass:[0,N,N,N,5,N,N,N,8,N,N,N,7,N,N,N]
  },
  june: {
    bpm:92, root:57, wave:"triangle", color:"bright",
    chords:[[0,4,7,11],[5,9,12,16],[2,5,9,12],[7,11,14,18]],
    lead:[0,4,9,7,4,2,4,N, 5,9,14,12,9,7,4,N], bass:[0,N,7,N,5,N,0,N,2,N,9,N,7,N,2,N]
  },
  arcade: {
    bpm:136, root:48, wave:"square", color:"bright", softSquare:true,
    chords:[[0,4,7],[5,9,12],[9,12,16],[7,11,14]],
    lead:[0,7,12,7,4,11,14,11, 9,16,12,9,7,14,11,7], bass:[0,N,0,N,5,N,5,N,9,N,9,N,7,N,7,N]
  },
  night: {
    bpm:60, root:45, wave:"sine", color:"night",
    chords:[[0,3,7,10],[8,12,15,19],[5,8,12,15],[7,10,14,17]],
    lead:[N,N,7,N,N,N,3,N, N,N,8,N,7,N,N,N], bass:[0,N,N,N,8,N,N,N,5,N,N,N,7,N,N,N]
  },
  rain: {
    bpm:72, root:52, wave:"sine", color:"rain",
    chords:[[0,3,7,10],[5,8,12,15],[10,14,17,21],[7,10,14,17]],
    lead:[7,N,N,3,N,5,N,N, 8,N,7,N,3,N,N,N], bass:[0,N,N,N,5,N,N,N,10,N,N,N,7,N,N,N]
  },
  mara: {
    bpm:72, root:57, wave:"triangle", color:"mara",
    chords:[[0,4,7,9],[5,9,12,16],[9,12,16,19],[7,11,14,18]],
    lead:[4,N,7,N,9,7,N,2, 4,N,N,2,0,N,4,N], bass:[0,N,N,N,5,N,N,N,9,N,N,N,7,N,N,N]
  },
  stalking: {
    bpm:54, root:45, wave:"sine", color:"stalk",
    chords:[[0,1,7],[5,8,12],[9,10,16],[7,8,14]],
    lead:[N,N,N,7,N,N,N,N, 9,N,N,7,N,N,2,N], bass:[0,N,N,N,N,N,1,N,5,N,N,N,N,N,6,N]
  },
  investigation: {
    bpm:62, root:43, wave:"triangle", color:"stalk",
    chords:[[0,1,6,10],[5,8,11,15],[3,7,10,14],[1,6,9,13]],
    lead:[N,7,N,N,8,N,6,N, N,3,N,7,N,1,N,N], bass:[0,N,N,1,5,N,N,6,3,N,N,4,1,N,6,N]
  },
  silence: {bpm:60,root:48,chords:[[0]],lead:Array(16).fill(N),bass:Array(16).fill(N),color:"silent"}
};

const MARA_MOTIF = [4, 7, 9, 7, 2, 4];
const midi = n => 440 * Math.pow(2, (n - 69) / 12);

export class MusicEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.music = null;
    this.ambient = null;
    this.sfxBus = null;
    this.voiceBus = null;
    this.active = false;
    this.track = "home";
    this.pendingTrack = "home";
    this.step = 0;
    this.nextBeat = 0;
    this.timer = null;
    this.infection = 0;
    this.nearMara = false;
    this.weather = "sun";
    this.muted = false;
    this.noiseBuffer = null;
    this.rainNode = null;
    this.rainGain = null;
    this.generation = 0;
    this.voiceStep = 0;
    this.volumes = {master:.78,music:.72,ambient:.28,sfx:.7,voice:.8};
  }

  async start() {
    if (this.active) {
      if (this.ctx?.state === "suspended") await this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    this.ctx = new AC({latencyHint:"interactive"});
    this.master = this.ctx.createGain();
    this.master.gain.value = this.volumes.master;
    this.master.connect(this.ctx.destination);
    this.music = this.ctx.createGain();
    this.music.gain.value = this.volumes.music;
    this.music.connect(this.master);
    this.ambient = this.ctx.createGain();
    this.ambient.gain.value = this.volumes.ambient;
    this.ambient.connect(this.master);
    this.sfxBus = this.ctx.createGain();
    this.sfxBus.gain.value = this.volumes.sfx;
    this.sfxBus.connect(this.master);
    this.voiceBus = this.ctx.createGain();
    this.voiceBus.gain.value = this.volumes.voice;
    this.voiceBus.connect(this.master);
    this.createNoise();
    this.active = true;
    this.nextBeat = this.ctx.currentTime + 0.05;
    this.timer = window.setInterval(()=>this.scheduler(), 80);
  }

  createNoise() {
    const len = this.ctx.sampleRate * 2;
    this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const a = this.noiseBuffer.getChannelData(0);
    let last = 0;
    for (let i=0;i<len;i++) { const white=Math.random()*2-1; last=(last*0.985)+(white*0.015); a[i]=last*3.2; }
  }

  setScene(track, {infection=this.infection, nearMara=false, weather=this.weather, abrupt=false}={}) {
    if (!THEMES[track]) track = "home";
    this.infection = Math.max(0, Math.min(3, infection));
    this.nearMara = nearMara;
    this.weather = weather;
    if (track !== this.pendingTrack) {
      this.pendingTrack = track;
      if (abrupt && this.active) {
        this.music.gain.cancelScheduledValues(this.ctx.currentTime);
        this.music.gain.setValueAtTime(this.music.gain.value, this.ctx.currentTime);
        this.music.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + .04);
        this.switchTrack(track, .12);
      }
    }
    this.updateRain();
  }

  switchTrack(track, delay=0) {
    if (!this.active) { this.track=track; this.pendingTrack=track; return; }
    const now=this.ctx.currentTime+delay;
    this.track=track; this.step=0; this.nextBeat=now+.03; this.generation++;
    this.music.gain.cancelScheduledValues(now);
    this.music.gain.setValueAtTime(.001,now);
    this.music.gain.exponentialRampToValueAtTime(Math.max(.001,this.volumes.music),now+1.2);
  }

  updateRain() {
    if (!this.active) return;
    const should = this.weather === "rain";
    if (should && !this.rainNode) {
      this.rainNode=this.ctx.createBufferSource(); this.rainNode.buffer=this.noiseBuffer; this.rainNode.loop=true;
      const filter=this.ctx.createBiquadFilter(); filter.type="highpass"; filter.frequency.value=1800;
      this.rainGain=this.ctx.createGain(); this.rainGain.gain.value=0.001;
      this.rainNode.connect(filter); filter.connect(this.rainGain); this.rainGain.connect(this.ambient);
      this.rainNode.start(); this.rainGain.gain.exponentialRampToValueAtTime(.12,this.ctx.currentTime+2);
    } else if (!should && this.rainNode) {
      const node=this.rainNode, gain=this.rainGain; this.rainNode=null; this.rainGain=null;
      gain.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+2); node.stop(this.ctx.currentTime+2.1);
    }
  }

  scheduler() {
    if (!this.active || this.ctx.state !== "running") return;
    if (this.pendingTrack !== this.track && this.step % 8 === 0) this.switchTrack(this.pendingTrack);
    const t=THEMES[this.track];
    const seconds=60/t.bpm/2;
    while (this.nextBeat < this.ctx.currentTime + .32) {
      this.scheduleStep(t,this.step,this.nextBeat,seconds);
      this.nextBeat += seconds;
      this.step=(this.step+1)%64;
    }
  }

  scheduleStep(t, step, when, dur) {
    if (this.muted || t.color==="silent") return;
    const ix=step%16, bar=Math.floor((step%64)/16), chord=t.chords[bar%t.chords.length];
    const lead=t.lead[ix], bass=t.bass[ix];
    const swing=(ix%2?dur*.08:0); when+=swing;
    if (lead!==N) this.note(t.root+lead,when,dur*.75,t.wave,.045,t.color==="stalk"?.015:0);
    if (bass!==N) this.note(t.root-12+bass,when,dur*1.65,"triangle",.035,0);
    if (ix%4===0) {
      chord.slice(0, t.color==="quiet"?2:3).forEach((n,j)=>this.note(t.root+n,when,dur*3.5,"sine",.011-j*.001,0.01));
    }
    if (["bright","warm"].includes(t.color) && ix%2===0) this.tick(when, ix%4===0?.018:.009);
    if (t.color==="mara" && ix===0) this.bell(t.root+16,when,.07);
    this.scheduleInfection(t,step,when,dur);
  }

  scheduleInfection(t,step,when,dur) {
    if (t.color==="mara" || t.color==="stalk" || this.infection<=0) return;
    const ix=step%16;
    const sparse=this.infection===1?[4,12]:this.infection===2?[2,4,6,10,12,14]:[0,2,4,6,8,10,12,14];
    if (!sparse.includes(ix)) return;
    const motifIndex=Math.floor(ix/2)%MARA_MOTIF.length;
    const pitch=t.root+MARA_MOTIF[motifIndex];
    const vol=this.infection===1?.008:this.infection===2?.018:.03;
    this.bell(pitch,when+dur*.12,vol);
  }

  note(pitch, when, duration, wave="sine", volume=.04, detune=0, destination=this.music, cutoff=null) {
    const osc=this.ctx.createOscillator(), gain=this.ctx.createGain(), filter=this.ctx.createBiquadFilter();
    osc.type=wave; osc.frequency.setValueAtTime(midi(pitch),when); osc.detune.value=detune;
    filter.type="lowpass"; filter.frequency.value=cutoff||(wave==="square"?1250:2400);
    gain.gain.setValueAtTime(.0001,when); gain.gain.exponentialRampToValueAtTime(Math.max(.001,volume),when+.018);
    gain.gain.exponentialRampToValueAtTime(.0001,when+Math.max(.07,duration));
    osc.connect(filter); filter.connect(gain); gain.connect(destination||this.music); osc.start(when); osc.stop(when+duration+.06);
  }

  bell(pitch, when, volume=.035, destination=this.music) {
    this.note(pitch,when,.75,"sine",volume,0,destination);
    this.note(pitch+12,when,.42,"sine",volume*.22,4,destination);
  }

  tick(when, volume=.012) {
    const o=this.ctx.createOscillator(),g=this.ctx.createGain(); o.type="square";o.frequency.value=1800;
    g.gain.setValueAtTime(volume,when);g.gain.exponentialRampToValueAtTime(.0001,when+.018);
    o.connect(g);g.connect(this.music);o.start(when);o.stop(when+.02);
  }

  sfx(name) {
    if (!this.active) return;
    const now=this.ctx.currentTime;
    if (name==="text") { this.bell(84,now,.028,this.sfxBus); this.bell(88,now+.07,.022,this.sfxBus); }
    if (name==="choice") this.note(72,now,.11,"triangle",.04,0,this.sfxBus);
    if (name==="door") { this.note(38,now,.18,"triangle",.045,0,this.sfxBus); this.note(33,now+.09,.24,"triangle",.025,0,this.sfxBus); }
    if (name==="step") this.note(31+Math.random()*3,now,.035,"triangle",.012,0,this.sfxBus,900);
    if (name==="shock") { this.note(41,now,1.4,"sawtooth",.035,0,this.sfxBus); this.note(42,now,1.2,"triangle",.028,0,this.sfxBus); }
    if (name==="save") [0,4,7,12].forEach((n,i)=>this.bell(67+n,now+i*.08,.025,this.sfxBus));
    if (name==="call") [0,7,3,10].forEach((n,i)=>this.bell(70+n,now+i*.12,.035,this.sfxBus));
  }

  voice(id="narrator",still=false,emotion="neutral") {
    if(!this.active||this.muted||id==="narrator")return;
    const profiles={
      alex:{pitch:66,wave:"triangle",alt:"sine",volume:.009,pattern:[0,0,2,-1],dur:.03,cutoff:1800},
      mara:{pitch:74,wave:"sine",alt:"triangle",volume:.010,pattern:[0,3,2,0,-2,2],dur:.045,cutoff:2200},
      iris:{pitch:69,wave:"sine",alt:"sine",volume:.008,pattern:[0,-2,1,-3],dur:.04,cutoff:1600},
      june:{pitch:78,wave:"triangle",alt:"sine",volume:.008,pattern:[0,4,2,7,4,2],dur:.035,cutoff:2300},
      theo:{pitch:58,wave:"square",alt:"triangle",volume:.007,pattern:[0,0,-3,2],dur:.025,cutoff:1050},
      ren:{pitch:55,wave:"triangle",alt:"sine",volume:.0075,pattern:[0,1,-1,-4],dur:.042,cutoff:1350},
      nia:{pitch:82,wave:"square",alt:"triangle",volume:.0065,pattern:[0,5,2,7,4],dur:.022,cutoff:1450},
      sam:{pitch:63,wave:"sine",alt:"triangle",volume:.008,pattern:[0,-2,3,0],dur:.05,cutoff:1500}
    };
    const p=profiles[id]||profiles.alex,index=this.voiceStep++,angry=["furious","shouting","angryCry"].includes(emotion);
    const pattern=still?[0,0,0,-1]:p.pattern,pitch=(still&&id==="mara"?50:p.pitch)+(angry?-5:0)+pattern[index%pattern.length];
    const now=this.ctx.currentTime,wave=still?"sine":(index%3===2?p.alt:p.wave),dur=still?.07:p.dur;
    this.note(pitch,now,dur,wave,still?.004:p.volume,0,this.voiceBus,still?700:p.cutoff);
    if(id==="mara"&&!still&&index%4===0)this.note(pitch+12,now+.008,dur*.7,"sine",p.volume*.22,angry?7:2,this.voiceBus,2600);
  }

  stingMara() {
    if (!this.active) return;
    const now=this.ctx.currentTime;
    MARA_MOTIF.slice(0,4).forEach((n,i)=>this.bell(57+n,now+i*.16,.045-i*.005));
  }

  toggleMute() {
    this.muted=!this.muted;
    if (this.active) this.master.gain.setTargetAtTime(this.muted?0:this.volumes.master,this.ctx.currentTime,.08);
    return this.muted;
  }

  setVolumes(values={}) {
    for(const key of Object.keys(this.volumes))if(Number.isFinite(values[key]))this.volumes[key]=Math.max(0,Math.min(1,values[key]));
    if(!this.active)return;
    const now=this.ctx.currentTime;
    this.master.gain.setTargetAtTime(this.muted?0:this.volumes.master,now,.04);
    this.music.gain.setTargetAtTime(this.volumes.music,now,.04);
    this.ambient.gain.setTargetAtTime(this.volumes.ambient,now,.04);
    this.sfxBus.gain.setTargetAtTime(this.volumes.sfx,now,.04);
    this.voiceBus.gain.setTargetAtTime(this.volumes.voice,now,.04);
  }
}

export const music = new MusicEngine();
