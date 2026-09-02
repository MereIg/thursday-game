import { installWorldGeometry } from "./geometry-world.js?v=geometry1";

export const PALETTE = {
  ink: "#1b1930", deep: "#10101e", cream: "#fff3da", paper: "#f3dfbe",
  plum: "#4d3554", rose: "#c95f78", blush: "#e9a3a1", rust: "#9b4d4f",
  moss: "#52705e", leaf: "#73916c", sky: "#8eb4bd", rain: "#607a91",
  gold: "#e5b85c", brown: "#61483e", shadow: "#2b273d", white: "#fffaf0"
};

export const CHARACTERS = {
  mara: {
    name: "Mara", color: "#b95865", hair: "#8d3946", coat: "#52705e", skin: "#f1bf9f",
    role: "?", bio: "You have never been able to find her name on a class list.", motif: "mara",
    sprite:{hairStyle:"long",accent:"#e3b84f",legs:"#292538",shoes:"#33242d"}
  },
  iris: {
    name: "Iris Bell", color: "#d78378", hair: "#4f2e38", coat: "#e0a26f", skin: "#9d654e",
    role: "Photography", bio: "19. Makes empty places look like memories.", motif: "iris",
    sprite:{hairStyle:"bob",accent:"#263044",legs:"#5e4650",shoes:"#33242d",accessory:"camera"}
  },
  june: {
    name: "June Okafor", color: "#7967a8", hair: "#251f31", coat: "#7766a3", skin: "#704737",
    role: "Music", bio: "21. Can turn any surface into a piano.", motif: "june",
    sprite:{hairStyle:"locs",accent:"#e0ad58",legs:"#3a3151",shoes:"#211c2b",accessory:"earrings"}
  },
  theo: {
    name: "Theo Mercer", color: "#4e8291", hair: "#b58b55", coat: "#4e718d", skin: "#efc49f",
    role: "Computing", bio: "20. Treats sincerity like a software bug.", motif: "theo",
    sprite:{hairStyle:"messy",accent:"#d8c06b",legs:"#343c59",shoes:"#242333",accessory:"hood"}
  },
  ren: {
    name: "Ren Akiyama", color: "#6b7550", hair: "#1e2228", coat: "#6b7550", skin: "#d9a47e",
    role: "Library / Folklore", bio: "22. Asks questions after sensible people stop.", motif: "ren",
    sprite:{hairStyle:"undercut",accent:"#bd9d67",legs:"#2d3636",shoes:"#1e2328",accessory:"glasses"}
  },
  nia: {
    name: "Nia Ward", color: "#c58c35", hair: "#3b262e", coat: "#bd8735", skin: "#5c392e",
    role: "Student Union", bio: "19. Knows everyone and most of their business.", motif: "friends",
    sprite:{hairStyle:"puff",accent:"#e9c564",legs:"#514052",shoes:"#29222d",accessory:"pin"}
  },
  sam: {
    name: "Sam Calder", color: "#648b7a", hair: "#553c32", coat: "#648b7a", skin: "#b87d61",
    role: "Foxglove Café", bio: "23. Remembers your order, forgets to charge friends.", motif: "friends",
    sprite:{hairStyle:"curly",accent:"#e7ded0",legs:"#3b4d47",shoes:"#2b2525",accessory:"apron"}
  }
};

const edgeWalls = [
  {x: 0, y: 0, w: 960, h: 50}, {x: 0, y: 500, w: 960, h: 40},
  {x: 0, y: 0, w: 34, h: 540}, {x: 926, y: 0, w: 34, h: 540}
];

export const MAPS = {
  bedroom: {
    name: "Your Bedroom", region: "HOME", kind: "bedroom", music: "home",
    spawn: {x: 480, y: 350}, walls: [...edgeWalls, {x: 52,y:72,w:250,h:122}, {x:650,y:76,w:220,h:98}, {x:60,y:350,w:170,h:100}],
    exits: [{x:850,y:410,w:62,h:70,to:"landing",tx:100,ty:380,label:"Open the door"}],
    props: [
      {id:"bed",x:64,y:92,w:224,h:86,label:"Rest / sleep",action:"sleep"},
      {id:"desk",x:676,y:92,w:160,h:70,label:"Use computer",action:"computer"},
      {id:"window",x:385,y:54,w:170,h:48,label:"Look outside",action:"window"},
      {id:"shelf",x:62,y:364,w:155,h:74,label:"Arrange room",action:"decorate"},
      {id:"photo",x:606,y:72,w:30,h:38,label:"Look at photograph",action:"photo"}
    ]
  },
  landing: {
    name: "Rowan House", region: "HOME", kind: "home", music: "home",
    spawn:{x:130,y:380}, walls:[...edgeWalls,{x:60,y:70,w:210,h:160},{x:420,y:90,w:430,h:120},{x:350,y:315,w:250,h:120}],
    exits:[
      {x:48,y:360,w:70,h:90,to:"bedroom",tx:820,ty:390,label:"Your room"},
      {x:820,y:390,w:80,h:80,to:"street",tx:130,ty:350,label:"Go outside"}
    ],
    props:[{id:"kettle",x:460,y:110,w:70,h:70,label:"Make tea",action:"tea"},{id:"frontdoor",x:820,y:390,w:80,h:80,label:"Go outside",action:"exit"}]
  },
  street: {
    name: "Mallow Street", region: "TOWN", kind: "street", music:"town",
    spawn:{x:130,y:350}, walls:[...edgeWalls,{x:55,y:70,w:260,h:145},{x:380,y:65,w:220,h:150},{x:670,y:70,w:230,h:145}],
    exits:[
      {x:62,y:210,w:100,h:45,to:"landing",tx:780,ty:390,label:"Home"},
      {x:850,y:310,w:70,h:110,to:"highstreet",tx:90,ty:350,label:"High Street"},
      {x:430,y:180,w:100,h:65,to:"park",tx:480,ty:430,label:"Park path"}
    ],
    props:[{id:"bus",x:700,y:275,w:90,h:120,label:"Read timetable",action:"bus"},{id:"notice",x:300,y:260,w:45,h:65,label:"Community noticeboard",action:"notice"}]
  },
  highstreet: {
    name:"Larkspur High Street",region:"TOWN",kind:"town",music:"town",
    spawn:{x:100,y:350},walls:[...edgeWalls,{x:60,y:65,w:210,h:170},{x:320,y:65,w:250,h:170},{x:620,y:65,w:270,h:170}],
    exits:[
      {x:38,y:320,w:60,h:120,to:"street",tx:840,ty:350,label:"Mallow Street"},
      {x:120,y:180,w:100,h:65,to:"cafe",tx:480,ty:420,label:"Foxglove Café"},
      {x:390,y:180,w:110,h:65,to:"arcade",tx:480,ty:420,label:"Lantern Arcade"},
      {x:730,y:180,w:110,h:65,to:"station",tx:480,ty:420,label:"Station"},
      {x:850,y:330,w:70,h:100,to:"college",tx:90,ty:360,label:"Bellwether College"}
    ],
    props:[{id:"shop",x:600,y:270,w:90,h:120,label:"Corner Shop",action:"shop"},{id:"bench",x:280,y:330,w:120,h:45,label:"Sit for a while",action:"wait"}]
  },
  college: {
    name:"Bellwether Courtyard",region:"COLLEGE",kind:"college",music:"school",
    spawn:{x:90,y:360},walls:[...edgeWalls,{x:120,y:60,w:720,h:120},{x:370,y:270,w:220,h:115}],
    exits:[
      {x:35,y:325,w:65,h:120,to:"highstreet",tx:830,ty:350,label:"Town"},
      {x:190,y:140,w:120,h:70,to:"hall",tx:120,ty:390,label:"East Hall"},
      {x:650,y:140,w:120,h:70,to:"library",tx:480,ty:420,label:"Library"},
      {x:430,y:140,w:100,h:70,to:"musicroom",tx:480,ty:420,label:"Music wing"}
    ],
    props:[{id:"fountain",x:390,y:280,w:180,h:90,label:"Bellwether fountain",action:"fountain"},{id:"board",x:760,y:270,w:70,h:90,label:"Student board",action:"collegeboard"}]
  },
  hall: {
    name:"East Hall",region:"COLLEGE",kind:"hall",music:"school",
    spawn:{x:120,y:390},walls:[...edgeWalls,{x:120,y:70,w:180,h:120},{x:390,y:70,w:180,h:120},{x:660,y:70,w:180,h:120}],
    exits:[
      {x:40,y:360,w:70,h:100,to:"college",tx:220,ty:230,label:"Courtyard"},
      {x:155,y:155,w:100,h:65,to:"classroom",tx:480,ty:420,label:"Seminar 2"},
      {x:425,y:155,w:100,h:65,to:"cafeteria",tx:480,ty:420,label:"Cafeteria"},
      {x:695,y:155,w:100,h:65,to:"archive",tx:480,ty:420,label:"Archive corridor"}
    ],
    props:[{id:"lockers",x:250,y:280,w:420,h:70,label:"Your locker",action:"locker"},{id:"poster",x:700,y:275,w:60,h:80,label:"Photography-club poster",action:"poster"}]
  },
  classroom: {
    name:"Seminar Room 2",region:"COLLEGE",kind:"classroom",music:"school",
    spawn:{x:480,y:420},walls:[...edgeWalls,{x:120,y:85,w:720,h:70}],
    exits:[{x:430,y:450,w:100,h:60,to:"hall",tx:190,ty:240,label:"East Hall"}],
    props:[
      {id:"seat1",x:180,y:250,w:90,h:55,label:"Sit by the window",action:"class_window"},
      {id:"seat2",x:435,y:250,w:90,h:55,label:"Sit in the middle",action:"class_middle"},
      {id:"seat3",x:690,y:250,w:90,h:55,label:"Sit at the back",action:"class_back"}
    ]
  },
  cafeteria: {
    name:"Cafeteria",region:"COLLEGE",kind:"cafeteria",music:"friends",
    spawn:{x:480,y:420},walls:[...edgeWalls,{x:60,y:65,w:250,h:100},{x:650,y:65,w:250,h:100}],
    exits:[{x:430,y:455,w:100,h:55,to:"hall",tx:460,ty:240,label:"East Hall"}],
    props:[
      {id:"lunch",x:80,y:85,w:200,h:70,label:"Buy lunch — £4",action:"lunch"},
      {id:"table1",x:170,y:270,w:140,h:70,label:"Eat with friends",action:"friends_lunch"},
      {id:"table2",x:650,y:270,w:140,h:70,label:"Sit somewhere quiet",action:"quiet_lunch"}
    ]
  },
  library: {
    name:"Bellwether Library",region:"COLLEGE",kind:"library",music:"library",
    spawn:{x:480,y:420},walls:[...edgeWalls,{x:70,y:70,w:170,h:290},{x:720,y:70,w:170,h:290},{x:330,y:80,w:300,h:80}],
    exits:[{x:430,y:455,w:100,h:55,to:"college",tx:700,ty:230,label:"Courtyard"}],
    props:[
      {id:"study",x:360,y:260,w:240,h:75,label:"Study",action:"study"},
      {id:"records",x:720,y:220,w:70,h:90,label:"Old college records",action:"records"},
      {id:"folklore",x:170,y:220,w:70,h:90,label:"Folklore shelf",action:"folklore"}
    ]
  },
  musicroom: {
    name:"Music Room",region:"COLLEGE",kind:"music",music:"june",
    spawn:{x:480,y:420},walls:[...edgeWalls,{x:80,y:80,w:310,h:160},{x:650,y:75,w:220,h:110}],
    exits:[{x:430,y:455,w:100,h:55,to:"college",tx:480,ty:230,label:"Courtyard"}],
    props:[{id:"piano",x:100,y:175,w:270,h:65,label:"Play the piano",action:"rhythm"},{id:"record",x:700,y:90,w:130,h:70,label:"Listen to records",action:"listen"}]
  },
  cafe: {
    name:"Foxglove Café",region:"TOWN",kind:"cafe",music:"cafe",
    spawn:{x:480,y:420},walls:[...edgeWalls,{x:60,y:70,w:410,h:90},{x:680,y:70,w:200,h:120},{x:680,y:275,w:112,h:68},{x:310,y:310,w:145,h:70}],
    exits:[{x:430,y:455,w:100,h:55,to:"highstreet",tx:170,ty:280,label:"High Street"}],
    props:[
      {id:"counter",x:90,y:90,w:350,h:60,label:"Order / work",action:"cafe"},
      {id:"booth",x:690,y:260,w:160,h:90,label:"Window booth",action:"booth"},
      {id:"piano2",x:700,y:90,w:150,h:80,label:"Old upright piano",action:"cafe_piano"}
    ]
  },
  arcade: {
    name:"Lantern Arcade",region:"TOWN",kind:"arcade",music:"arcade",
    spawn:{x:480,y:420},walls:[...edgeWalls,{x:65,y:70,w:150,h:240},{x:745,y:70,w:150,h:240},{x:330,y:75,w:300,h:100}],
    exits:[{x:430,y:455,w:100,h:55,to:"highstreet",tx:445,ty:280,label:"High Street"}],
    props:[{id:"cabinet",x:370,y:90,w:220,h:70,label:"STARLANCE — £2",action:"arcade_game"},{id:"prize",x:745,y:100,w:60,h:180,label:"Prize counter",action:"prize"}]
  },
  park: {
    name:"Larkspur Park",region:"TOWN",kind:"park",music:"town",
    spawn:{x:480,y:430},walls:[...edgeWalls,{x:80,y:80,w:180,h:130},{x:700,y:70,w:180,h:150},{x:365,y:210,w:230,h:110}],
    exits:[{x:430,y:455,w:100,h:55,to:"street",tx:480,ty:150,label:"Mallow Street"}],
    props:[{id:"pond",x:390,y:225,w:180,h:80,label:"Watch the pond",action:"pond"},{id:"greenhouse",x:720,y:160,w:140,h:60,label:"Greenhouse",action:"greenhouse"},{id:"parkbench",x:170,y:310,w:150,h:50,label:"Sit",action:"parkbench"}]
  },
  station: {
    name:"Larkspur Station",region:"TOWN",kind:"station",music:"night",
    spawn:{x:480,y:420},walls:[...edgeWalls,{x:70,y:70,w:820,h:75},{x:110,y:235,w:740,h:75}],
    exits:[
      {x:430,y:455,w:100,h:55,to:"highstreet",tx:780,ty:280,label:"High Street"},
      {x:820,y:315,w:80,h:100,to:"annex",tx:120,ty:400,label:"Service lane",requires:"investigationUnlocked"}
    ],
    props:[{id:"platform",x:150,y:250,w:650,h:50,label:"Check departures",action:"train"},{id:"machine",x:740,y:150,w:100,h:70,label:"Ticket machine",action:"tickets"}]
  },
  archive: {
    name:"Archive Corridor",region:"COLLEGE",kind:"archive",music:"library",
    spawn:{x:480,y:420},walls:[...edgeWalls,{x:100,y:70,w:760,h:100},{x:90,y:245,w:310,h:80},{x:560,y:245,w:310,h:80}],
    exits:[{x:430,y:455,w:100,h:55,to:"hall",tx:730,ty:240,label:"East Hall"}],
    props:[{id:"archiveDoor",x:620,y:250,w:200,h:70,label:"Locked archive",action:"archive_door"},{id:"room307",x:140,y:250,w:200,h:70,label:"Room 307",action:"room307"}]
  },
  annex: {
    name:"Old Archive Annex",region:"?",kind:"annex",music:"investigation",
    spawn:{x:120,y:400},walls:[...edgeWalls,{x:70,y:65,w:820,h:80},{x:320,y:205,w:320,h:170}],
    exits:[{x:45,y:360,w:70,h:100,to:"station",tx:800,ty:390,label:"Service lane"}],
    props:[
      {id:"box",x:350,y:205,w:120,h:50,label:"Open the cardboard box",action:"evidence_box"},
      {id:"photos",x:500,y:205,w:110,h:50,label:"Examine photographs",action:"evidence_photos"},
      {id:"redDoor",x:730,y:90,w:100,h:80,label:"A door painted red",action:"red_door"}
    ]
  }
};

export const ITEMS = {
  tea:{name:"Thermos of tea",desc:"Still warm. Comfort +1."},
  pastry:{name:"Foxglove pastry",desc:"Sam insists the misshapen ones taste better."},
  film:{name:"35mm film",desc:"Iris can use this on a photo walk."},
  charm:{name:"Plastic star charm",desc:"A ridiculous arcade prize."},
  record:{name:"Second-hand record",desc:"June has been looking for this pressing."},
  greenRibbon:{name:"Green ribbon",desc:"You don't remember buying it."},
  key307:{name:"Room 307 key",desc:"The label is newer than the key."},
  tornPhoto:{name:"Torn photograph",desc:"The date on the back is forty-six years ago."},
  irisbuckle:{name:"Iris's camera buckle",desc:"Iris is still using her camera."},
  lamp:{name:"Amber desk lamp",desc:"Makes the bedroom feel more like yours."},
  plant:{name:"Potted fern",desc:"Ren says it is difficult to kill."}
};

export const SCHEDULES = {
  iris: [
    {from:420,to:570,map:"college",x:270,y:330},{from:570,to:720,map:"classroom",x:250,y:350},
    {from:720,to:830,map:"cafeteria",x:245,y:365},{from:830,to:1020,map:"college",x:710,y:350},
    {from:1020,to:1200,map:"park",x:250,y:350},{from:1200,to:1440,map:"cafe",x:750,y:350}
  ],
  june: [
    {from:450,to:660,map:"musicroom",x:520,y:290},{from:660,to:810,map:"cafeteria",x:700,y:360},
    {from:810,to:1050,map:"musicroom",x:500,y:300},{from:1050,to:1260,map:"cafe",x:760,y:340}
  ],
  theo: [
    {from:480,to:680,map:"classroom",x:720,y:340},{from:680,to:820,map:"cafeteria",x:300,y:360},
    {from:820,to:1020,map:"library",x:520,y:360},{from:1020,to:1380,map:"arcade",x:550,y:330}
  ],
  ren: [
    {from:480,to:1080,map:"library",x:620,y:330},{from:1080,to:1260,map:"archive",x:480,y:360},
    {from:1260,to:1380,map:"station",x:680,y:380}
  ],
  nia: [
    {from:450,to:670,map:"college",x:550,y:350},{from:670,to:820,map:"cafeteria",x:480,y:350},
    {from:820,to:1020,map:"hall",x:610,y:370},{from:1020,to:1260,map:"cafe",x:570,y:350}
  ],
  sam: [
    {from:420,to:1320,map:"cafe",x:535,y:260}
  ]
};

export const DAY_SCHEDULES = {
  6:{
    iris:[{from:570,to:820,map:"highstreet",x:700,y:350},{from:820,to:1080,map:"park",x:610,y:350},{from:1080,to:1250,map:"cafe",x:680,y:350}],
    june:[{from:600,to:800,map:"cafe",x:720,y:350},{from:800,to:1060,map:"highstreet",x:430,y:350}],
    theo:[{from:620,to:980,map:"arcade",x:550,y:330},{from:980,to:1180,map:"cafe",x:610,y:350}],
    ren:[{from:600,to:1040,map:"library",x:620,y:330},{from:1040,to:1200,map:"park",x:520,y:350}],
    nia:[{from:570,to:790,map:"highstreet",x:520,y:350},{from:790,to:1120,map:"cafe",x:570,y:350}],
    sam:[{from:480,to:1260,map:"cafe",x:535,y:260}]
  },
  7:{
    iris:[{from:650,to:1050,map:"park",x:610,y:350},{from:1050,to:1190,map:"highstreet",x:700,y:350}],
    june:[{from:650,to:1080,map:"park",x:700,y:350}],
    theo:[{from:640,to:1050,map:"park",x:440,y:350},{from:1050,to:1260,map:"arcade",x:550,y:330}],
    ren:[{from:650,to:850,map:"highstreet",x:390,y:350},{from:850,to:1080,map:"park",x:520,y:350}],
    nia:[{from:620,to:1100,map:"park",x:350,y:350},{from:1100,to:1240,map:"cafe",x:570,y:350}],
    sam:[{from:560,to:1140,map:"cafe",x:535,y:260}]
  }
};

export function maraSchedule(state) {
  const day = state.day, time = state.time;
  const sightings = [
    {day:1,from:470,to:520,map:"street",x:815,y:270,distant:true},
    {day:1,from:720,to:760,map:"cafeteria",x:790,y:180,distant:true},
    {day:1,from:1020,to:1090,map:"highstreet",x:845,y:260,distant:true},
    {day:2,from:500,to:600,map:"college",x:790,y:330},
    {day:2,from:740,to:800,map:"cafeteria",x:510,y:360},
    {day:2,from:1080,to:1180,map:"street",x:510,y:310},
    {day:3,from:450,to:520,map:"highstreet",x:800,y:350,distant:true},
    {day:3,from:680,to:760,map:"hall",x:820,y:360},
    {day:3,from:1050,to:1150,map:"cafe",x:760,y:435},
    {day:4,from:460,to:530,map:"college",x:820,y:355},
    {day:4,from:700,to:780,map:"library",x:480,y:350},
    {day:4,from:1120,to:1200,map:"park",x:270,y:350},
    {day:5,from:450,to:560,map:"hall",x:520,y:350},
    {day:5,from:980,to:1090,map:"station",x:560,y:380},
    {day:6,from:620,to:720,map:"cafe",x:755,y:430},
    {day:6,from:1040,to:1140,map:"park",x:275,y:350},
    {day:7,from:660,to:750,map:"library",x:485,y:350},
    {day:7,from:1080,to:1190,map:"highstreet",x:810,y:350,distant:true},
    {day:8,from:470,to:550,map:"college",x:820,y:355},
    {day:8,from:1030,to:1140,map:"arcade",x:700,y:330},
    {day:9,from:680,to:760,map:"hall",x:820,y:360},
    {day:9,from:1120,to:1200,map:"street",x:520,y:310},
    {day:10,from:980,to:1090,map:"station",x:560,y:380},
    {day:11,from:700,to:780,map:"library",x:480,y:350},
    {day:12,from:450,to:560,map:"hall",x:520,y:350},
    {day:12,from:1110,to:1260,map:"annex",x:760,y:380}
  ];
  const found=sightings.find(s=>s.day===day && time>=s.from && time<s.to) || null;
  if(found?.map==="annex"&&state.flags.followDone&&!state.flags.maraKnowsFollow)return null;
  return found;
}

export const QUESTS = {
  welcome:{name:"Make Bellwether yours",desc:"Explore college and speak to three people.",reward:"£8 and a desk lamp"},
  samTea:{name:"Emergency tea",desc:"Take Sam's thermos to June in the music room.",reward:"£6 and Foxglove friendship"},
  irisFilm:{name:"A roll of light",desc:"Buy film and meet Iris in the park after 17:00.",reward:"A photograph for your room"},
  theoScore:{name:"STARLANCE rivalry",desc:"Score 700 points at Lantern Arcade.",reward:"Plastic star charm"},
  records:{name:"The student who isn't there",desc:"Check the library records, Room 307, and Friday's station route.",reward:"You may wish you hadn't"}
};

export const OPENING_LINES = [
  {speaker:"",text:"MONDAY — 7:12 AM"},
  {speaker:"Alex",text:"New town. New college. One box still unpacked."},
  {speaker:"Alex",text:"Mum's note says not to miss orientation. In three separate colours."},
  {speaker:"",text:"Your room is warm. Rain freckles the window. Somewhere outside, a train passes."}
];

export const CHARACTER_TALK = {
  iris: [
    {text:"You're Alex, right? Sorry. Nia described the coat.",choices:[
      {text:"That sounds like Nia.",reply:"She also said you'd pretend not to be nervous. I wasn't going to mention that part.",affection:1},
      {text:"Is it a good coat?",reply:"Turn toward the window... yeah. It is.",affection:2},
      {text:"I was hoping to remain mysterious.",reply:"You can try again tomorrow. I won't tell anyone.",trust:1}
    ]},
    {text:"I wait until people leave before I take the last photograph. Empty rooms sit differently.",choices:[
      {text:"That's a little sad.",reply:"Sometimes. I still like them.",trust:2},
      {text:"Photograph me while I'm here.",reply:"Now? ...All right. Don't fix your hair.",affection:3},
      {text:"Do rooms really change?",reply:"You notice when you look through the same viewfinder long enough.",suspicion:1}
    ]},
    {text:"I checked yesterday's pictures. That red-haired girl is in six of them.",choices:[
      {text:"Show me.",reply:"Not here. When I zoom in, the pixels around her go soft. Only around her.",trust:2,flag:"irisPhotoClue"},
      {text:"Probably another student.",reply:"Probably. I just can't work out how she crossed the courtyard between shots.",affection:1},
      {text:"Was she looking at me?",reply:"In every one.",suspicion:2,flag:"irisPhotoClue"}
    ]}
  ],
  june: [
    {text:"Oh—could you turn this page when I nod? Not yet. I'll nod. Sorry.",choices:[
      {text:"I can't read music.",reply:"You only need to count to four. If I panic, count slower.",affection:1},
      {text:"What are you playing?",reply:"I don't know yet. It keeps changing when I look away from it.",trust:1},
      {text:"I'll turn pages heroically.",reply:"Good. Quiet heroics. Starting... now.",affection:2}
    ]},
    {text:"Can a song get stuck in your head before you've heard it?",choices:[
      {text:"All the time.",reply:"Seriously? ...Okay. That helps a little.",affection:1},
      {text:"Which melody?",reply:"Six notes. Nothing clever. I keep finding them under everything else.",suspicion:2,flag:"heardMotifTalk"},
      {text:"Play it for me.",reply:"I did once. The practice-room phone rang before I finished.",trust:2,flag:"heardMotifTalk"}
    ]}
  ],
  theo: [
    {text:"Don't use the vending machine by Seminar Two. It kept my pound and made a noise like it was pleased.",choices:[
      {text:"Can it be reasoned with?",reply:"I kicked it. That made things worse between us.",affection:2},
      {text:"I'll bring exact change.",reply:"It took exact change from me. This is personal now.",trust:1},
      {text:"Is this in the student handbook?",reply:"No. Nia removed my warning from the shared document.",affection:1}
    ]},
    {text:"Your phone did that connection sound again. You didn't touch it.",choices:[
      {text:"What connection?",reply:"No device name. No address. It just says connected, then the log clears.",suspicion:2,flag:"phoneClue"},
      {text:"Can you check it?",reply:"Yeah. Leave it with me at lunch. Change your passcode first.",trust:2,flag:"phoneClue"},
      {text:"It's a new phone.",reply:"Then don't let anyone tell you this is old-device nonsense.",affection:1}
    ]}
  ],
  ren: [
    {text:"If you take a book out, leave it on the cart. Don't put it back. I'm serious.",choices:[
      {text:"It can't be that bad.",reply:"It is. Shelf labels changed twice this term.",trust:1},
      {text:"I like old systems.",reply:"Folklore club, Wednesday. We mostly argue and eat biscuits.",affection:2},
      {text:"Where are the student records?",reply:"Upstairs. Staff key. Ask a less suspicious question next time.",suspicion:1}
    ]},
    {text:"I checked the register. There isn't a Mara. Not this year. Not last year.",choices:[
      {text:"I didn't ask you to.",reply:"I know.",trust:1,flag:"recordsQuest"},
      {text:"Maybe Mara isn't her full name.",reply:"Then she enrolled with no surname, address, course, or date of birth.",suspicion:2,flag:"recordsQuest"},
      {text:"Drop it, Ren.",reply:"All right. I won't ask you about it again.",fear:1,flag:"recordsQuest"}
    ]}
  ],
  nia: [
    {text:"Alex—wait. I made you a timetable. Blue is classes. Pink is places with decent food.",choices:[
      {text:"You colour-coded lunch?",reply:"Lunch is when people actually tell you things.",affection:2},
      {text:"You're very prepared.",reply:"I made one for myself and got carried away. Take it before I add bus times.",trust:1},
      {text:"Do I have to follow it?",reply:"No. But orientation ends at eleven and they stop giving out the free pens.",affection:1}
    ]},
    {text:"Can I ask something nosy? You can say no. Are you and Iris... anything?",choices:[
      {text:"Maybe.",reply:"Okay. I won't tell her you said maybe. My face might, though.",affection:1},
      {text:"We're friends.",reply:"That's still something. Sorry. I'm not trying to turn it into gossip.",trust:1},
      {text:"Why, is somebody asking?",reply:"A girl called Mara. She knew which bench you used yesterday.",suspicion:2,flag:"maraAskedNia"}
    ]}
  ],
  sam: [
    {text:"You look cold. Tea, coffee, or the radiator seat?",choices:[
      {text:"Surprise me.",reply:"Tea, then. Coffee shouldn't be a surprise.",affection:2},
      {text:"The radiator seat.",reply:"Window booth. I'll bring water and leave you alone.",trust:1},
      {text:"Do you know everyone here?",reply:"Most people come in often enough to become predictable.",affection:1}
    ]},
    {text:"Mara was here before I opened. Is she a friend of yours?",choices:[
      {text:"She's not my friend.",reply:"Sorry. She talked as if you'd grown up together.",suspicion:2,flag:"samMaraClue"},
      {text:"What did she want?",reply:"Your order. She said you'd want it waiting. You don't have an order yet.",suspicion:2,flag:"samMaraClue"},
      {text:"Did she say where she lives?",reply:"No. She went through the staff door. I thought she worked here until I checked.",trust:1,flag:"samMaraClue"}
    ]}
  ]
};

export const MARA_TALKS = [
  {
    condition:s=>!s.flags.metMara,
    expression:"awkward",
    text:"Hey—sorry. Are you Alex?",
    choices:[
      {text:"That's me.",reply:"Yeah. I know. Sorry. I'm Mara.",affection:2,flag:"metMara"},
      {text:"Have we met?",reply:"No. Not properly. I'm Mara.",affection:1,suspicion:1,flag:"metMara"},
      {text:"You've been watching me.",reply:"I kept nearly saying hello. Then I'd waited too long and it felt strange. So... hello.",fear:1,flag:"metMara"}
    ]
  },
  {
    condition:s=>s.flags.metMara && s.relationships.mara.talks<2,
    expression:"embarrassed",
    text:"Is the radiator seat free at lunch? I thought maybe we could—it's fine if you're waiting for someone.",
    choices:[
      {text:"How do you know where I sit?",reply:"I saw you yesterday. I wasn't hiding. I just didn't come over.",suspicion:1},
      {text:"Sit with me.",reply:"Really? Okay. I was trying very hard not to look like I wanted you to ask.",affection:3},
      {text:"I'm meeting Iris.",reply:"Oh. Right. She'll want the window side.",jealousy:3,flag:"maraIrisJealous"}
    ]
  },
  {
    condition:s=>s.flags.maraIrisJealous && !s.flags.jealousTalk,
    expression:"quietCry",
    text:"About yesterday... I was weird. I know I was weird.",
    choices:[
      {text:"It's okay.",reply:"No, it isn't. But thank you for saying it.",jealousy:1,flag:"jealousTalk"},
      {text:"Were you angry?",reply:"I cried in the bathroom for twenty minutes. Then I got angry that I'd cried.",affection:1,flag:"jealousTalk"},
      {text:"Leave Iris alone.",reply:"I haven't touched Iris.",jealousy:4,fear:1,flag:"jealousTalk"}
    ]
  },
  {
    condition:s=>s.day>=8 && s.flags.maraIrisJealous && !s.flags.lateJealousTalk,
    expression:"forcedSmile",
    text:"Iris won't look at me now. I only said hello.",
    choices:[
      {text:"What did you say?",reply:"I told her you come home alone on Tuesdays. She understood.",jealousy:4,fear:2,flag:"lateJealousTalk",expression:"still",demonHint:"horn",demonHintAt:.55},
      {text:"You scared her.",reply:"Yes.",jealousy:3,fear:3,flag:"lateJealousTalk",expression:"still",demonHint:"shadow",demonHintAt:.15},
      {text:"Don't go near her.",reply:"Then stop going near her first.",jealousy:5,fear:2,flag:"lateJealousTalk",expression:"still",demonHint:"tail",demonHintAt:.5}
    ]
  },
  {
    condition:s=>s.day>=3 && s.relationships.mara.affection>=4 && !s.flags.maraWalk,
    expression:"concerned",
    text:"Can I walk with you? Just to Mallow Street. I can be quiet if you want.",
    choices:[
      {text:"I'd like that.",reply:"Okay. Good. Sorry—my hands are shaking.",affection:4,flag:"maraWalk"},
      {text:"Maybe another night.",reply:"Right. Of course. Another night.",jealousy:2,flag:"maraWalkRefused"},
      {text:"Stop waiting on my route home.",reply:"I wasn't waiting. I was... I knew you'd come this way.",suspicion:2,flag:"maraWalkRefused"}
    ]
  },
  {
    condition:s=>s.day>=11 && !s.flags.thursdayLine,
    expression:"tooStill",
    text:"You look tired. Thursdays always do this to you.",
    choices:[
      {text:"It's Wednesday.",reply:"...Right. Sorry. I hate Thursdays.",suspicion:2,flag:"thursdayLine"},
      {text:"What happens Thursday?",reply:"What do you mean?",suspicion:2,flag:"thursdayLine"},
      {text:"You look tired too.",reply:"I didn't sleep. I wanted to, but your light was on.",fear:2,flag:"thursdayLine"}
    ]
  },
  {
    condition:s=>true,
    ambientDefault:true,
    expression:"happy",
    text:"Hi. I was going to text you, but then you were actually here.",
    choices:[
      {text:"That's sweet.",reply:"I missed you. It was only a few hours. I know.",affection:2},
      {text:"You could still text me.",reply:"Then you'd have to decide whether to answer while I'm standing here.",suspicion:1},
      {text:"I was busy.",reply:"I know. You spent forty-three minutes in the library.",fear:1,jealousy:1}
    ]
  }
];

export const RANDOM_EVENTS = [
  {id:"wrongSong",minDay:6,weight:3,cooldown:2,places:["cafe","arcade"],text:"The song playing overhead begins halfway through a melody you recognise but cannot name.",flag:"wrongSong",motif:true},
  {id:"ownNumber",minDay:9,weight:2,cooldown:2,places:["bedroom"],text:"A notification appears from your own number: “don't forget the window”. It deletes itself.",flag:"ownNumber"},
  {id:"cameraFigure",minDay:8,weight:2,cooldown:2,places:["park","street","college"],text:"Your phone camera opens in your pocket. For one frame, someone is standing behind you.",flag:"cameraFigure"},
  {id:"emptyCorner",minDay:9,weight:2,cooldown:3,places:["classroom"],text:"Everyone is staring at the same empty corner. Nia laughs. Conversation resumes. Nobody explains.",flag:"emptyCorner"},
  {id:"trainMara",minDay:9,weight:2,cooldown:2,places:["highstreet","station"],text:"A train passes. Mara is visible through one window, looking directly at you. The next carriage is empty.",flag:"trainMara"},
  {id:"lightOn",minDay:9,weight:3,cooldown:2,places:["street"],text:"Your bedroom light is already on. You are certain you turned it off.",flag:"lightOn"},
  {id:"wrongReflection",minDay:8,weight:1,cooldown:3,places:["cafe","cafeteria"],text:"In the dark glass, Mara's reflection is smiling. Mara herself is not there.",flag:"wrongReflection"},
  {id:"missingDay",minDay:10,weight:1,cooldown:4,places:["college"],text:"Theo is absent all day. Nobody, including his lecturers, remembers his name. Tomorrow he will complain about homework.",flag:"theoMissingDay"},
  {id:"windowKnock",minDay:10,weight:1,cooldown:3,places:["bedroom"],night:true,text:"Three soft knocks touch the bedroom window. You are on the first floor.",flag:"windowKnock"},
  {id:"doorInside",minDay:11,weight:1,cooldown:4,places:["bedroom"],night:true,text:"You hear your bedroom door open behind you. You are facing the only door. It remains closed.",flag:"doorInside"}
];

export const DAY_CARDS = [
  {day:1,title:"MONDAY",sub:"Everybody begins somewhere."},
  {day:2,title:"TUESDAY",sub:"Your routine begins to feel like yours."},
  {day:3,title:"WEDNESDAY",sub:"Remember an umbrella."},
  {day:4,title:"THURSDAY",sub:"Nia insists Thursday lunch counts as an event."},
  {day:5,title:"FRIDAY",sub:"The first week ends in cheap chips."},
  {day:6,title:"SATURDAY",sub:"No alarm. No timetable. Rain after lunch."},
  {day:7,title:"SUNDAY",sub:"The town is quieter when college closes."},
  {day:8,title:"MONDAY",sub:"Familiar corridors. Familiar faces."},
  {day:9,title:"TUESDAY",sub:"The forecast says sunshine."},
  {day:10,title:"WEDNESDAY",sub:"Follow her. Do not let her see you."},
  {day:11,title:"THURSDAY",sub:"Mara hates Thursdays."},
  {day:12,title:"FRIDAY",sub:"Some doors remember being opened."}
];

installWorldGeometry(MAPS);
