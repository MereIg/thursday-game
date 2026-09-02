// Repeatable life-sim conversations live outside the engine and story tables.
// These are intentionally mundane; disturbing lines need ordinary life around them.

const replyChoices=(answers)=>answers.map(([text,reply,affection=0,trust=0])=>({text,reply,affection,trust}));

const MARA=[
  {text:"The café changed its tea bags. I noticed because the new ones taste like a cupboard.",expression:"annoyed",action:"mug",answers:[["That's very specific.","I've had three. I conducted research.",1],["I'll trust your expertise.","You shouldn't. I also like vending-machine soup.",2]]},
  {text:"I found a leaf shaped like a tiny hand. I nearly brought it to you, then realised that would be strange.",expression:"shy",answers:[["A little strange.","Right? Thank you. It is still in my pocket.",1],["I would've liked it.","Oh. Then—wait here. Don't laugh at it.",3]]},
  {text:"Do you ever make a plan for the whole evening and then sit on your bed for forty minutes?",expression:"tired",action:"phone",answers:[["Constantly.","Good. Not good. You know what I mean.",2],["What was the plan?","Laundry. I have suffered no meaningful loss.",1]]},
  {text:"That dog outside the shop has your exact walk.",expression:"teasing",answers:[["I don't walk like a dog.","Not the dog part. The determined little shoulders.",2],["Which dog?","Too late. Your twin has gone.",1]]},
  {text:"I burnt toast this morning and the smoke alarm said something cruel about my competence.",expression:"awkward",answers:[["It was probably right.","Alex. Betrayal before nine in the morning.",2],["Breakfast somewhere tomorrow?","Yes. Immediately yes. I mean—if you're awake.",3]]},
  {text:"Your shoelace is coming undone. I wasn't staring at your feet. That sounds worse now.",expression:"embarrassed",answers:[["Thanks for noticing.","I notice practical things. Sometimes.",2],["You can stop staring.","I have. Mostly.",0]]},
  {text:"June's rehearsal made the radiator buzz in key. She looked so pleased with herself.",expression:"laugh",answers:[["It did sound good.","Don't tell her. She'll add the building to the band.",1],["You stayed for rehearsal?","At the back. I like watching people be good at things.",2]]},
  {text:"I bought two pastries because choosing felt unfair. You can solve the moral problem.",expression:"proud",answers:[["The almond one.","Excellent. I wanted the other one.",2],["Split both.","That is disgustingly sensible. Fine.",3]]},
  {text:"The rain sounds different under the library awning. Less dramatic. More administrative.",expression:"content",answers:[["Administrative rain?","Forms in triplicate. Damp little stamp.",2],["Stay until it stops?","It might take hours. Yes.",3]]},
  {text:"I tried the arcade dance game. Theo saw. I may have to leave town.",expression:"shy",answers:[["Was it that bad?","I apologised to the machine.",2],["I'll play with you.","Only if we fail at exactly the same level.",3]]},
  {text:"Your cardigan has a thread loose at the cuff. Can I—no, sorry. You can do it.",expression:"concerned",answers:[["Go on.","Hold still. This is an ordinary amount of closeness.",3],["I'll fix it later.","Okay. Don't pull it; it'll ladder.",1]]},
  {text:"Sam drew a heart in my coffee. I think it was an accident. It looked more like an onion.",expression:"teasing",action:"mug",answers:[["Romantic onion.","Finally, a love language I understand.",2],["Maybe Sam likes you.","Sam likes tips. I respect the clarity.",1]]},
  {text:"I hate group photos. Everybody suddenly forgets what their face normally does.",expression:"awkward",answers:[["You photograph well.","You can't say things like that without warning me.",3],["Make the worst face possible.","Then at least the disaster is intentional.",2]]},
  {text:"I saw Nia carrying six folders and a cake. I helped with the cake. Priorities.",expression:"happy",answers:[["Heroic.","The icing survived. History may remember me kindly.",2],["Was there any cake left?","I saved you the corner with too much icing.",3]]},
  {text:"I couldn't choose a song on the bus, so I listened to the engine complain.",expression:"sleepy",answers:[["Good song?","Strong opening. Repetitive chorus.",2],["Share my headphones next time.","You mean that? ...All right.",3]]},
  {text:"Your hair is doing a small thing here.",expression:"affectionate",answers:[["Fix it?","Can I? Okay. Don't move.",3],["It's meant to.","Of course. Very fashionable small thing.",2]]},
  {text:"I finished that book. The ending was terrible, so obviously you have to read it too.",expression:"annoyed",action:"read",answers:[["That's a strange recommendation.","I need someone else to be annoyed correctly.",2],["Lend it to me.","I wrote complaints in the margins. Ignore those. Or don't.",3]]},
  {text:"Hi. I had something funny to tell you, but seeing you erased it.",expression:"embarrassed",action:"wave",answers:[["That's almost flattering.","It was meant to be completely flattering.",2],["Tell me when it comes back.","I'll write it down before looking at you.",2]]},
  {text:"Can we do nothing together for a bit? I'm tired of being interesting.",expression:"tired",action:"hugSelf",answers:[["Sit with me.","Thank you. I can be very good at nothing.",3],["I'm heading somewhere.","Right. Sorry. Have somewhere nice.",0]]},
  {minTime:960,text:"I like this part of the day. Everyone is going home, but nobody has left yet.",expression:"content",answers:[["It's peaceful.","Exactly. A pause with streetlights.",2],["Walk with me?","Yes. I was hoping you'd ask without me asking.",3]]}
];

const CAST={
  iris:[
    {text:"A pigeon ruined the best shot on my roll and improved the second best.",answers:[["Show me both.","Only if you promise to respect the pigeon.",2],["The pigeon has an eye.","And no respect for composition.",1]]},
    {text:"I printed one for your room. Nothing artistic. You just look happy in it.",answers:[["Thank you.","Don't make it a big thing or I'll get embarrassed.",3],["You kept a copy?","Maybe. For quality control.",2]]},
    {text:"My camera strap smells like café chips now.",answers:[["Occupational hazard.","My occupation is apparently following all of you around.",1],["Worth it.","Yeah. It was.",2]]}
  ],
  june:[
    {text:"I practised the difficult bar until the easy bar became offended.",answers:[["Play it again.","You say that now. Ask me in forty repetitions.",2],["Take a break.","Tea first. Then only thirty repetitions.",1]]},
    {text:"Nia clapped between movements. Theo joined in so she wouldn't die alone.",answers:[["True friendship.","Public humiliation shared evenly.",2],["I would've clapped.","Then I'm banning all three of you.",1]]},
    {text:"I found a chord that sounds exactly like missing the last bus.",answers:[["That sounds useful.","For my transport-themed concept album.",1],["Play it for me.","Only if you walk home with me after.",3]]}
  ],
  theo:[
    {text:"I fixed Nia's laptop. The technical term was ‘turning it on’. I invoiced her one biscuit.",answers:[["Fair rate.","I offer competitive student pricing.",2],["What kind?","Chocolate. I'm not a charity.",1]]},
    {text:"STARLANCE ate my high score. I have begun a calm and proportionate feud.",answers:[["You kicked it again.","A calm kick. Proportionate footwear.",2],["I'll beat it for you.","Romance is alive and strangely specific.",3]]},
    {text:"Ren borrowed my charger and returned a book about cursed electrical objects.",answers:[["A warning?","With Ren, maybe a thank-you note.",2],["Read it.","Absolutely not. Lend me your charger.",1]]}
  ],
  ren:[
    {text:"Someone shelved cookbooks under hauntings again. I understand the argument but reject the method.",answers:[["Depends on the cooking.","You may join folklore club.",2],["Who did it?","Theo. His subtlety is developing backwards.",1]]},
    {text:"The library cat has never entered the library. It simply holds office hours outside.",answers:[["Efficient.","No overdue fines, either.",1],["What's its name?","The catalogue says Mackerel. Mackerel disagrees.",2]]},
    {text:"I made tea and forgot it until it became an archive object.",answers:[["Make another.","Radical. Stay here.",2],["Drink it cold.","Some history deserves to be lost.",1]]}
  ],
  nia:[
    {text:"Friday plan: chips, arcade, then collectively pretending we don't have assignments.",answers:[["I'm in.","Excellent. Democracy works.",2],["Who's going?","Everybody I could guilt in under six messages.",1]]},
    {text:"I bought a planner to stop over-planning. It has become the most planned object I own.",answers:[["Can I see?","No, you'll discover your own birthday itinerary.",2],["Burn it.","The stickers were expensive.",1]]},
    {text:"Sam says I can't reserve the big café table using scarves anymore.",answers:[["How many scarves?","Legally? Four.",2],["Sam is right.","Sam is often right in a deeply inconvenient way.",1]]}
  ],
  sam:[
    {text:"The grinder is making a noise like a tiny lawnmower. Tea is safer today.",answers:[["Tea, then.","A person of survival instinct.",2],["Risk the coffee.","I'll write your next of kin on the cup.",1]]},
    {text:"Someone left a paperback in the booth. Every page has a different coffee stain.",answers:[["Local art.","Our most consistent medium.",1],["Lost property?","For a week. Then Ren adopts it.",2]]},
    {text:"You lot have a usual table now. That's how it starts.",answers:[["How what starts?","Regular-customer entitlement. Soon you'll ask for spoons.",2],["You like us.","I tolerate you with increasing specificity.",3]]}
  ]
};

function pick(pool,state,talks,salt){const eligible=pool.filter(entry=>!entry.minTime||state.time>=entry.minTime);const ix=Math.abs((state.seed||1)+(state.day*17)+(talks*7)+salt)%eligible.length;return eligible[ix];}
function prepare(entry){return{...entry,choices:replyChoices(entry.answers)};}

export function maraAmbientNode(state,talks=0){return prepare(pick(MARA,state,talks,31));}
export function castAmbientNode(id,state,talks=0){const pool=CAST[id]||CAST.nia;return prepare(pick(pool,state,talks,id.length*13));}

export const AMBIENT_COUNTS={mara:MARA.length,...Object.fromEntries(Object.entries(CAST).map(([id,pool])=>[id,pool.length]))};
