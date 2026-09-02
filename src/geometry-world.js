import { OBJECT_TYPES, rectPolygon } from "./geometry.js?v=geometry1";

// Coordinates here are the 480 x 270 ART GRID, explicitly authored against the
// approved room layouts. Conversion to the 960 x 540 simulation happens once.
// Artwork is never read by this module. New art must preserve these templates.
const pt=([x,y])=>({x:x*2,y:y*2});
const rect=([x,y,w,h])=>({x:x*2,y:y*2,w:w*2,h:h*2});
const poly=points=>points.map(([x,y])=>[x*2,y*2]);
const floor=(x,y,w,h)=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]];
function object(id,type,footprint,top=footprint[1],attachments={},outline=null){
  const [x,y,w,h]=footprint;
  return {id,type,collision:[rect(footprint)],ground:pt([x+w/2,y+h]),
    visual:{bounds:rect([x,top,w,y+h-top])},occlusion:poly(outline||floor(x,top,w,y+h-top)),
    attachments:Object.fromEntries(Object.entries(attachments).map(([key,p])=>[key,pt(p)]))};
}
const wall=(id,r,top=r[1])=>object(id,"WALL",r,top);
const table=(id,r,top)=>object(id,"TABLE_LARGE",r,top);
const chair=(id,r,top,sit)=>object(id,"CHAIR",r,top,{sitAnchor:sit});
// Interactions are approach points on clear floor, NOT the centre of furniture.
const ROOMS={
  bedroom:{floor:floor(9,88,462,174),spawn:[251,190],
    objects:[object("bed","BED",[36,65,120,97],22,{lieAnchor:[103,97]}),object("nightstand","COUNTER",[14,62,41,35],39),
      object("desk","COUNTER",[341,81,111,51],42,{interactionAnchor:[393,145]}),chair("deskChair",[365,115,25,24],91,[378,127]),
      object("shelf","COUNTER",[9,199,100,63],169),object("wardrobe","WALL",[418,165,53,97],143)],
    props:{bed:[170,130],desk:[397,146],window:[249,102],shelf:[121,216],photo:[119,188]},
    exits:{landing:[254,252]},npcs:{mara:[309,186]}},
  landing:{floor:floor(10,91,460,171),spawn:[220,185],
    objects:[wall("stairs",[11,51,88,162],5),object("stairCupboard","COUNTER",[93,133,58,32],101),
      object("sideboard","COUNTER",[190,93,53,29],76),object("kitchen","COUNTER",[271,63,183,39],14,{interactionAnchor:[329,116]}),
      table("diningTable",[335,143,102,48],127),chair("diningChair",[366,122,26,19],110,[379,139]),
      object("entranceTable","COUNTER",[321,237,62,30],216),object("coatStand","WALL",[291,236,21,28],210),
      object("frontDoor","WALL",[243,238,45,32],205),object("leftEntranceTable","COUNTER",[0,230,55,37],204),
      object("umbrellaBasket","COUNTER",[437,225,33,36],190),object("stairPlant","WALL",[77,201,35,41],164)],
    props:{kettle:[330,115],frontdoor:[268,201]},exits:{bedroom:[64,223],street:[268,201]},npcs:{mara:[261,166]}},
  street:{floor:floor(18,112,443,151),spawn:[111,197],
    objects:[wall("house",[28,35,130,78]),wall("parkWall",[190,32,110,59]),wall("eastHouse",[335,35,115,74]),
      object("bench","SOFA",[147,186,48,10],166,{sitAnchor:[171,185]}),object("busShelter","COUNTER",[348,156,91,24],111),
      object("busPost","WALL",[323,167,10,24],108),object("notice","COUNTER",[155,151,21,13],115)],
    props:{bus:[391,191],notice:[166,179]},exits:{landing:[92,119],highstreet:[451,216],park:[242,121]},npcs:{mara:[291,215]}},
  highstreet:{floor:floor(8,153,464,109),spawn:[237,194],
    objects:[wall("westShops",[0,0,217,151]),wall("eastShops",[254,0,226,151]),
      object("shelter","COUNTER",[32,212,82,40],178),object("bin","COUNTER",[155,224,16,17],216),
      object("busSign","WALL",[133,220,9,23],188),
      object("planter","COUNTER",[178,233,32,15],221),object("bikes","COUNTER",[217,228,48,20],210),
      object("bench","SOFA",[289,229,41,18],219,{sitAnchor:[311,237]}),object("secondBench","SOFA",[362,228,47,18],215,{sitAnchor:[383,237]}),
      object("postbox","COUNTER",[435,216,13,24],197),wall("westRail",[0,250,220,20],245),wall("eastRail",[269,250,211,20],245)],
    props:{shop:[82,161],bench:[309,210]},exits:{street:[19,179],cafe:[323,161],arcade:[177,161],station:[237,161],college:[461,179]},
    npcs:{mara:[279,191],iris:[124,181],june:[357,191],nia:[205,182],ren:[419,186]}},
  college:{floor:floor(10,106,460,156),spawn:[239,198],
    objects:[wall("westWall",[0,0,222,106]),wall("eastWall",[262,0,218,106]),
      wall("westStairRail",[60,227,125,43],203),wall("eastStairRail",[296,227,104,43],204),
      object("westPlant","WALL",[183,246,25,21],222),object("eastPlant","WALL",[274,248,23,20],226),
      object("leftStand","COUNTER",[32,169,40,22],153),object("rightStand","COUNTER",[379,183,64,44],151)],
    props:{fountain:[240,158],board:[160,118]},exits:{highstreet:[239,251],hall:[240,112],library:[381,116],musicroom:[93,116]},
    npcs:{iris:[136,155],nia:[284,160],mara:[348,174]}},
  hall:{floor:floor(9,85,462,73),spawn:[228,123],
    objects:[wall("backWall",[0,0,480,81]),object("topBench","SOFA",[343,76,48,13],61,{sitAnchor:[367,87]}),
      wall("foregroundWall",[0,161,480,109],150)],
    props:{lockers:[46,102],poster:[172,97]},exits:{college:[20,122],classroom:[126,95],cafeteria:[320,95],archive:[459,122]},
    npcs:{nia:[284,126],mara:[377,126]}},
  classroom:{floor:floor(14,90,452,172),spawn:[304,251],
    objects:[wall("blackboardWall",[0,0,480,89]),table("lecturerDesk",[181,98,104,25],76),
      table("windowDesks",[28,159,110,75],134),table("middleDesks",[180,158,105,76],133),table("backDesks",[337,157,101,77],134),
      object("leftBooks","COUNTER",[26,69,51,27],16),object("rightBooks","COUNTER",[407,72,46,22],46)],
    props:{seat1:[82,141],seat2:[234,141],seat3:[390,141]},exits:{hall:[305,253]},
    npcs:{iris:[152,184],theo:[311,172],nia:[153,247],mara:[323,237]}},
  cafeteria:{floor:floor(12,108,456,154),spawn:[236,251],
    objects:[object("servingCounter","COUNTER",[102,64,249,40],33,{interactionAnchor:[237,115]}),
      object("machine","COUNTER",[410,65,40,38],16),table("friendsTable",[44,151,148,88],131),table("quietTable",[270,151,146,89],131),
      wall("leftBench",[0,141,24,108],128),wall("rightBench",[447,139,33,113],110)],
    props:{lunch:[236,117],table1:[122,137],table2:[346,137]},exits:{hall:[236,252]},
    npcs:{iris:[214,174],theo:[244,187],nia:[218,225],june:[263,120],mara:[432,194]}},
  library:{floor:floor(9,89,463,174),spawn:[304,247],
    objects:[wall("backShelves",[0,0,329,87]),wall("rightShelves",[369,0,111,85]),
      object("librarianDesk","COUNTER",[14,118,73,50],100),table("northTable",[153,115,131,28],98),table("southTable",[151,191,133,34],174),
      object("readingCorner","SOFA",[381,108,57,23],89,{sitAnchor:[410,116]}),object("recordsCart","COUNTER",[402,146,34,19],132),
      wall("westForeground",[0,222,96,48],191),wall("eastForeground",[346,220,134,50],185),
      object("westPlant","WALL",[99,245,16,23],220),object("eastPlant","WALL",[323,244,18,24],219)],
    props:{study:[303,124],records:[438,177],folklore:[235,97]},exits:{college:[353,102]},
    npcs:{ren:[320,159],theo:[119,157],mara:[310,218]}},
  musicroom:{floor:floor(12,110,457,152),spawn:[240,246],
    objects:[wall("backWall",[0,0,480,88]),object("piano","COUNTER",[139,72,110,38],15),chair("pianoStool",[171,103,42,18],85,[191,113]),
      object("recordPlayer","COUNTER",[332,85,64,24],38),object("westInstruments","COUNTER",[12,127,60,80],99),
      chair("centreChair",[284,154,32,24],118,[302,169]),chair("lowerChair",[297,226,33,22],195,[314,240]),
      object("cello","COUNTER",[370,211,44,31],147),object("eastInstruments","COUNTER",[449,189,31,58],124),
      object("westStand","COUNTER",[85,201,33,23],154),object("musicStand","COUNTER",[329,181,19,20],150),object("upperStand","COUNTER",[366,155,19,21],114)],
    props:{piano:[235,128],record:[361,126]},exits:{college:[240,251]},npcs:{june:[250,159],mara:[221,201]}},
  cafe:{floor:floor(11,109,458,153),spawn:[243,247],
    objects:[object("counter","COUNTER",[14,86,263,37],60,{interactionAnchor:[234,137]}),
      object("booth","SOFA",[330,99,101,34],67,{sitAnchor:[348,130],standAnchor:[310,134]}),
      table("boothTable",[361,113,36,23],86),
      table("middleTable",[143,166,78,22],148),table("windowTable",[324,156,94,24],137),
      table("leftTable",[40,219,70,28],200),table("rightTable",[346,221,93,26],202),
      object("counterPlant","WALL",[17,124,32,19],104),object("doorPlant","WALL",[0,232,26,30],192),
      object("radioCabinet","COUNTER",[279,84,25,24],59)],
    props:{counter:[233,137],booth:[308,133],piano2:[295,120]},exits:{highstreet:[244,253]},
    npcs:{sam:[291,138],june:[297,191],nia:[252,213],iris:[289,247],mara:[310,134],theo:[241,153]}},
  arcade:{floor:floor(11,101,459,161),spawn:[245,250],
    objects:[object("leftMachines","COUNTER",[8,87,175,34],27),object("prizeCounter","COUNTER",[202,72,92,28],47),
      object("starCabinet","COUNTER",[301,64,42,36],29),object("rightMachines","COUNTER",[361,86,112,47],41),
      object("westMachines","COUNTER",[0,166,104,39],142),object("eastMachines","COUNTER",[361,182,119,40],150),
      object("leftRoundTable","TABLE_SMALL",[146,205,36,20],192),object("rightRoundTable","TABLE_SMALL",[284,205,40,20],189),
      wall("leftRail",[0,241,216,29],224),wall("rightRail",[276,240,204,30],224)],
    props:{cabinet:[322,114],prize:[246,112]},exits:{highstreet:[244,252]},npcs:{theo:[294,156],mara:[205,164]}},
  park:{floor:[[9,148],[54,139],[91,119],[119,71],[137,58],[163,63],[173,93],[212,99],[259,86],[285,91],[307,72],[335,69],[362,88],[390,101],[431,99],[471,118],[471,228],[404,253],[265,262],[194,262],[90,244],[9,211]],spawn:[232,247],
    objects:[{id:"pond",type:"WALL",collision:[poly([[162,144],[184,120],[266,114],[321,140],[324,182],[287,204],[204,202],[166,179]])],
      ground:pt([242,203]),visual:{bounds:rect([160,114,166,90])},occlusion:[],attachments:{}},
      object("greenhouse","WALL",[378,139,91,43],97),object("bench","SOFA",[174,188,35,14],177,{sitAnchor:[190,195]}),
      object("westLamp","WALL",[129,177,10,10],126),object("eastLamp","WALL",[335,190,8,10],141),
      object("westTree","WALL",[49,104,39,19],12),object("eastTree","WALL",[435,78,21,19],14),
      object("northShrub","WALL",[281,108,26,15],67),object("westShrub","WALL",[84,218,37,16],205),
      object("eastShrub","WALL",[382,223,28,24],195),object("parkBench","SOFA",[422,215,30,9],204,{sitAnchor:[438,220]}),
      wall("westFence",[0,251,194,19],239),wall("eastFence",[262,251,218,19],239)],
    props:{pond:[344,159],greenhouse:[371,190],parkbench:[186,216]},exits:{street:[232,252]},npcs:{iris:[143,211],nia:[261,222],mara:[354,199],ren:[352,105],theo:[308,233],june:[216,222],sam:[328,212]}},
  station:{floor:floor(9,155,462,107),spawn:[222,243],
    objects:[wall("stationBuilding",[0,0,367,151]),wall("stairs",[399,35,41,116]),
      object("leftPlanter","COUNTER",[49,208,36,18],198),object("bench","SOFA",[90,211,54,14],196,{sitAnchor:[116,220]}),
      object("centrePlanter","COUNTER",[288,210,28,17],200),object("signpost","WALL",[368,212,13,16],168),
      object("rightBoard","COUNTER",[402,208,39,17],189),object("lamp","WALL",[386,204,11,20],144),
      object("westTree","WALL",[10,218,29,33],173),object("eastTree","WALL",[450,211,30,49],178),
      wall("westFence",[0,240,162,30],228),wall("eastFence",[254,240,226,30],228)],
    props:{platform:[419,164],machine:[273,164]},exits:{highstreet:[212,252],annex:[453,171]},npcs:{ren:[328,188],mara:[365,165]}},
  archive:{floor:[[36,260],[184,132],[254,132],[406,260]],spawn:[235,237],
    objects:[wall("leftShelving",[0,195,93,75],0),wall("rightShelving",[402,203,78,67],0),
      wall("farWall",[183,0,73,132]),
      {id:"leftWall",type:"WALL",collision:[poly([[0,0],[181,0],[181,129],[47,257],[0,270]])],ground:pt([25,270]),visual:{bounds:rect([0,0,181,270])},occlusion:[],attachments:{}},
      {id:"rightWall",type:"WALL",collision:[poly([[259,0],[480,0],[480,270],[410,257],[259,129]])],ground:pt([445,270]),visual:{bounds:rect([259,0,221,270])},occlusion:[],attachments:{}}],
    props:{archiveDoor:[347,224],room307:[163,179]},exits:{hall:[235,251]},npcs:{ren:[220,188],mara:[287,227]}},
  annex:{floor:[[20,188],[120,111],[407,111],[447,260],[20,260]],spawn:[92,220],
    objects:[object("evidenceTable","TABLE_LARGE",[175,161,126,61],128),object("westCabinet","COUNTER",[66,129,53,34],97),
      wall("westShelves",[123,0,207,111]),wall("eastShelves",[412,161,68,109],91),object("crates","COUNTER",[0,218,25,31],204)],
    props:{box:[160,156],photos:[314,164],redDoor:[380,126]},exits:{station:[70,190]},npcs:{mara:[338,226]}}
};
// A developer-only room uses the same geometry/attachment/rendering pipeline.
ROOMS.geometrylab={floor:floor(8,42,464,218),spawn:[247,232],
  objects:[chair("chair",[77,149,24,16],124,[89,160]),table("table",[139,160,89,29],135),
    object("sofa","SOFA",[310,95,91,31],66,{sitAnchor:[350,121]}),object("bed","BED",[329,198,99,40],152,{lieAnchor:[373,197]}),
    object("counter","COUNTER",[111,81,130,25],61,{interactionAnchor:[177,121]}),wall("wall",[267,127,17,64],87)],
  props:{chair:[91,183],table:[183,205],sofa:[348,142],bed:[311,223],counter:[177,121]},exits:{bedroom:[40,71]},npcs:{mara:[245,190]}};

export function installWorldGeometry(maps){
  maps.geometrylab={name:"Geometry workshop (QA only)",region:"QA",kind:"geometrylab",music:"home",debugOnly:true,walls:[],
    props:Object.keys(ROOMS.geometrylab.props).map(id=>({id,label:`Test ${id}`,action:"geometry_attach"})),exits:[{to:"bedroom",label:"Return to bedroom"}]};
  for(const [id,map] of Object.entries(maps)){
    const room=ROOMS[id];if(!room)throw new Error(`Missing geometry for ${id}`);
    map.legacyWalls=map.walls;map.spawn=pt(room.spawn);
    map.geometry={floor:poly(room.floor),objects:room.objects,npcs:Object.fromEntries(Object.entries(room.npcs).map(([key,p])=>[key,pt(p)])),entries:{}};
    // Compatibility only for the old fallback-art renderer. Movement never uses it.
    map.walls=room.objects.flatMap(o=>o.collision.filter(s=>!Array.isArray(s)));
    for(const prop of map.props){
      const anchor=room.props[prop.id];if(!anchor)throw new Error(`Missing interaction ${id}.${prop.id}`);
      prop.interactionAnchor=pt(anchor);prop.interactionRadius=36;prop.objectId=prop.id;
      prop.interactionZone={x:anchor[0]*2-36,y:anchor[1]*2-36,w:72,h:72};
      const obj=room.objects.find(o=>o.id===prop.id);prop.ground=obj?.ground||pt(anchor);
      prop.type=obj?.type||"ITEM_PICKUP";prop.collision=[];prop.visual={bakedInto:id};
      prop.attachments=obj?.attachments||{handAnchor:pt(anchor)};
      if(obj)obj.interaction={anchor:prop.interactionAnchor,radius:prop.interactionRadius};
    }
    for(const exit of map.exits){
      const anchor=room.exits[exit.to];if(!anchor)throw new Error(`Missing exit ${id} -> ${exit.to}`);
      Object.assign(exit,{...rect([anchor[0]-8,anchor[1]-5,16,10]),interactionAnchor:pt(anchor),interactionRadius:28,type:"DOOR",ground:pt(anchor),entryAnchor:pt(anchor)});
      map.geometry.entries[exit.to]=pt(anchor);
      exit.collision=[];exit.visual={bakedInto:id};exit.attachments={entryAnchor:pt(anchor)};
      if(exit.to==="college"&&/courtyard/i.test(exit.label))exit.label="Bellwether Entrance Hall";
    }
  }
  for(const map of Object.values(maps))for(const exit of map.exits){
    const from=Object.keys(maps).find(id=>maps[id]===map),entry=maps[exit.to].geometry.entries[from]||maps[exit.to].spawn;
    exit.tx=entry.x;exit.ty=entry.y;
  }
  maps.college.name="Bellwether Entrance Hall";
  maps.college.props.find(p=>p.id==="fountain").label="Examine the college crest";
  maps.college.props.find(p=>p.id==="fountain").action="college_crest";
  maps.cafe.props.find(p=>p.id==="piano2").label="Listen to the counter radio";
  maps.cafe.props.find(p=>p.id==="piano2").action="cafe_radio";
  maps.park.props.find(p=>p.id==="parkbench").label="Sit by the pond";
  for(const map of Object.values(maps))for(const o of map.geometry.objects){
    o.interaction??=null;
    if(!OBJECT_TYPES[o.type])throw new Error(`Unknown object template ${o.type}`);
  }
}
