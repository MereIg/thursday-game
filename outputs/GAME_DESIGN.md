# MARA — Game Design Bible (archived export)

## High concept

**MARA** is a long-form 2D psychological-horror dating/life simulator about routine becoming evidence. The current canonical plan is the root-level `GAME_DESIGN.md`; this file is retained as an earlier exported snapshot.

The campus is Bellwether College, a small post-secondary arts and humanities college in the rain-prone town of Larkspur. All students and romanceable characters are adults aged 18–23. The player character is an adult first-year transfer student whose name and pronouns can be customized in the full release. The vertical slice uses the neutral default name **Alex Rowan**.

The central constant is **Mara**. That is the only name anyone has for her. She appears to be an adult in her early twenties, but her age, surname, family, course, address, history, and even the point at which she entered Alex's life are unknown. Every ordinary biographical fact she offers is unverified or contradicts something else. Mara is witty, affectionate, volatile, observant, possessive, murderous, and not redeemable. Her love is real. Her evil is real. Neither cancels the other. She cannot be permanently killed, cannot be fixed, and cannot be replaced by the protagonist. Every route is shaped by her, but routes are not all about surrendering to her.

## Design pillars

1. **Attachment before violation.** Ordinary play must be enjoyable enough to sustain dozens of hours: social simulation, dates, classes, jobs, errands, clubs, collecting, exploration, and quiet evenings.
2. **The familiar becomes evidence.** Horror alters known spaces, music, schedules, portraits, texts, and memories. A one-tile change matters because the player knows the room.
3. **Mara is human in motion, inhuman in stillness.** Her emotions are messy and sometimes pathetic. Her most frightening moments are often calm.
4. **Music is narrative state.** Mara's six-note theme spreads through the score without explanation. Players learn to hear danger before seeing it.
5. **Uncertainty survives discovery.** Investigation yields leverage and contradictions, never a definitive demon taxonomy.
6. **Consequences have names.** Missing people are not counters. Their jokes vanish, schedules break, quests remain unfinished, and other people change.

## The world

Larkspur is a compact town built around Bellwether College and an older rail line. Its warmth is sincere: rain under café awnings, an arcade that never replaces its carpet, a park greenhouse maintained by volunteers, tiny shops, and residential streets where friends live. Underneath is an inconsistent history. Street names change between maps. A demolished boarding house appears in photographs taken years later. Bellwether's records contain Thursdays that repeat.

Primary regions:

- **Rowan House:** Alex's bedroom, kitchen, landing, back garden, and later the spaces that should not fit beneath it.
- **Bellwether College:** courtyard, east and west halls, seminar rooms, library, computer lab, cafeteria, roof, gym, changing rooms, theatre, music room, club rooms, archives, maintenance tunnels, staff corridor, storage, and unused Room 307.
- **Larkspur town:** High Street, Foxglove Café, Lantern Arcade, Corner Shop, station, bus stops, park, greenhouse, canal walk, residential roads, shopping arcade, laundrette, old cinema, alleys, and friends' homes.
- **Conditional spaces:** Mara's claimed house, the Red Corridor, a platform with no number, a version of Alex's room photographed decades ago, and the room behind the archive wall.

## Main cast

### Mara

Apparently a student. Apparently Alex's age. Bright red-brown hair, moss-green coat, warm amber eyes. No enrolment record consistently lists her, nobody can name a class she attends, and different people remember being introduced to her in mutually exclusive places. Her public persona is lightly chaotic, funny, generous, and disarmingly earnest. She remembers preferences and brings gifts that feel thoughtful before they feel invasive. She loves Alex with joyous sincerity and considers autonomy an avoidable misunderstanding.

Mara is genuinely evil: she can deliberately terrify, isolate, erase, maim, or murder people because it improves her imagined shared life. She understands that victims suffer. Sometimes that knowledge is the point. She can regret upsetting Alex while feeling no remorse for the act.

Her demonic nature is expressed only through contradictions: delayed reflections, archival appearances, impossible travel, survival, predictive slips, animal fear, temperature, and musical contamination. “Demon” is an internal creative rule, never a clean reveal, species label, lore entry, or explanation available to the player. No single discovery defines her.

### Iris Bell — 19, romanceable

Photography student; warm, dryly funny, and observant. Iris turns ordinary spaces into little adventures and is the first to notice that photographs are changing. Her route is about trusting recorded evidence after evidence learns to lie. She and June are former friends after a painful creative dispute.

### June Okafor — 21, romanceable

Music student and café pianist. Confident on stage, privately anxious about disappointing her family. She can hear Mara's motif before Alex consciously identifies it. Her compositions become an arena in which the score pushes back. She has a tense professional rivalry with Theo.

### Theo Mercer — 20, romanceable

Computer-science student and arcade obsessive. Funny, avoidant, loyal when forced to choose. He can recover deleted phone metadata and notices messages with impossible timestamps. His instinct to reduce everything to a technical problem eventually fails him.

### Ren Akiyama — 22

Library assistant and folklore-club president. Blunt, curious, sometimes selfish. Ren wants the truth more than safety and may use Alex as bait. They remember people for longer than most characters after disappearances.

### Nia Ward — 19

Student representative and social gravitational centre. Nia organizes parties, mediates arguments, spreads kindness and rumours with equal efficiency, and is dating Sam at the opening. Mara treats Nia as infrastructure rather than a romantic rival, which may be worse.

### Sam Calder — 23

Town café employee and part-time mature student. Patient, funny, apparently grounded. Sam has encountered Mara before but remembers her under a different name. His relationship with Nia strains as fear makes him secretive.

### Dr. Vale — 34

Archives lecturer. She has been quietly removing certain records for years. She is not allied with Mara; she is managing a pattern she cannot stop. The game never uses her surname to imply a familial or historical identity for Mara.

## Mara behaviour model

Mara is driven by hidden variables rather than a single affection meter:

- **attachment:** grows from attention, gifts, shared time, and dependence.
- **jealousy:** per-character pressure based on Alex's intimacy, secrecy, and Mara's observations.
- **abandonment panic:** spikes after broken promises, ignored calls, long absences, or explicit rejection.
- **control:** how thoroughly Mara has compromised routes, friends, devices, and domestic space.
- **exposure:** what Alex has discovered and what Mara knows Alex discovered.
- **composure:** a regenerating capacity that determines whether jealousy becomes sarcasm, sobbing, rage, or stillness.
- **hunger:** an inhuman pressure associated with Thursdays, disappearances, and the door.

Reactions are selected from contextual weighted pools. The same jealousy value can produce a joke, silence, 30 messages, a public scene, a delayed consequence, or no visible response. Cooldowns prevent repetition. Delayed reactions are stored as future events, so apparent safety can be genuine, temporary, or staged.

Mara is not omniscient. Every player action has an observation channel: direct sight, NPC report, phone compromise, route prediction, physical evidence, or supernatural intuition. She can fail checks. The interface never confirms whether a secret remains secret.

## Emotional presentation

States include playful, tender, embarrassed, clingy, watchful, jealous, wounded, panicked, furious, dissociated, and still. Transitions are more important than labels. Portrait timing, punctuation, distance, sound, and movement change by state. A panic scene may contain malformed texts and sobbing; the transition to stillness removes portrait animation, room tone, and contractions from her dialogue.

Rare cryptic lines are gated by day, location, hunger, exposure, and low probability. Most Mara dialogue is ordinary. Examples include “Your room looked warmer the first time,” “You cried more last time,” and “I hate Thursdays.” They are never collected in an in-game lore menu.

## Daily life simulation

Each day runs from 07:00 to 01:00 in ten-minute steps. Walking, conversation, classes, activities, dates, work, and travel consume time. Missing required sleep applies focus penalties and creates late-night event opportunities.

The college timetable offers attended and skipped classes, with grades unlocking scholarships, archive permissions, and different trust responses. Clubs provide mini-games and route access. Small jobs fund gifts and room objects. Weather changes schedules, outfits, crowd density, and arrangements of location music.

NPCs follow schedule blocks with conditional overrides. They continue to form and damage relationships off-screen through a social graph. Rumours propagate along trust edges. Dates, arguments, illness, disappearances, and Mara interference rewrite schedules rather than merely hiding sprites.

## Core player systems

- **Movement and maps:** eight-direction-feeling four-axis movement, layered collision, doors, contextual interactions, and conditional tile mutations.
- **Dialogue:** data-driven nodes, typed text, expression states, timed/conditional choices, relationship and flag effects.
- **Relationships:** affection, trust, fear, suspicion, resentment, and dependence per character.
- **Phone:** time-stamped threaded messages, delayed replies, read states, typing indicators, calls, photos, deletion and alteration.
- **Inventory and economy:** gifts, food, keys, evidence, décor, clothes, and quest objects.
- **Room customization:** earned objects become both comfort and later continuity markers.
- **Investigation:** evidence has provenance and confidence, while contradictions are preserved. Questions can spread through the social graph.
- **Stealth/following:** distance, sight cones, cover, noise, target suspicion, false routines, and deliberate traps.
- **World corruption:** mutations are layered on canonical maps, UI, logs, photos, saves, and music. Each has subtlety and persistence levels.
- **Save/load:** versioned state snapshots, autosave at sleep and travel, manual bedroom saves, migration support, and route seed preservation. The game never destroys real player data; “corrupted save” effects are theatrical state variants.

## Opening chapters

### Chapter 1 — The Good Week (days 1–12)

Alex settles in, meets the cast, chooses classes and a club, helps with errands, works a café shift, decorates the bedroom, and can begin three romances. Mara is visible in backgrounds before her formal introduction. Her initial route is charming and legitimately fun. The first cryptic lines are rare enough to dismiss.

The vertical slice implements the first five days: orientation, routine formation, first messages, optional café/park dates, early jealousy, distant sightings, room inconsistencies, and a Friday-night archive investigation unlocked by evidence.

### Chapter 2 — Someone Is Missing (days 13–25)

A supporting character disappears. Sunny routines continue around their empty space. Investigation, denial, and social fractures begin. Mara comforts Alex. The player's selected romance changes the victim pressure network, but no route maps one choice directly to one death.

### Chapter 3 — No Such Student

Records and memories change. Ren and Iris can preserve different forms of evidence. Mara's emotional volatility becomes public. The first apparent death of Mara occurs in some routes and does not solve anything.

### Chapter 4 — The Long Thursday

A single school day becomes structurally unreliable. Schedules disagree, rooms shift, and the same melody appears in every location. Saving everyone is impossible, but who is lost is highly conditional.

### Chapter 5 — After Bellwether

The game expands beyond school. Surviving relationships age and change. Mara uses patience measured in months. Routes diverge into escape, bargain, exposure, investigation, and complicity without turning Alex into Mara.

## Deaths and disappearances

Character outcomes include confirmed death, probable death, unacknowledged disappearance, bureaucratic erasure, false departure, altered return, and survival with lasting fear. Each outcome changes schedules, messages, unfinished quests, relationship graphs, ambient dialogue, room contents, and music instrumentation. Messages after death can result from queued sending, phone possession, world alteration, or Mara; the game does not label which.

The player can temporarily protect people through alibis, route changes, safe houses, lies, witnesses, and reducing Mara's observation channels. Protection moves pressure rather than deleting it. Mara can be outsmarted, and this is important: successful stealth and secrecy create earned possibility, while uncertainty remains.

## Random and rare events

Events are selected by seeded weighted rules checking day, time, weather, location, company, relationships, flags, prior sightings, music state, and cooldown. A run maintains an event budget so rarity remains meaningful. Pools include distant Mara sightings, transient reflections, changed photos, impossible messages, missing NPC days, spatial discrepancies, inappropriate music continuation, and dead-background cameos.

Rare events never contain progression-critical facts. Players can finish a route without them, making discoveries feel personal rather than collectible.

## Investigation and spying

Investigation routes begin with mundane discrepancies. Players compare schedules, access records, recover device logs, revisit photos, tail Mara, and enter conditional spaces. Following uses an authored route plus reactive branches: Mara can lose the player, detect them without acknowledging it, deliberately lead them, or genuinely fail to notice.

The first major spying sequence follows Mara from the college through the station service lane to the old archive annex. The player can discover objects from a not-yet-missing character, photographs of Alex with impossible dates, or only an empty room and the knowledge that Mara stopped walking before the music stopped.

## Audio architecture

The score is composed as families of synchronized arrangements, not generic loops. Each cue declares tempo, key centre, bar length, melody, harmony, bass, percussion, texture, motif-infection slots, and transition rules. The runtime scheduler uses the Web Audio clock for sample-accurate notes and crossfades buses rather than restarting music on every scene.

Core themes:

- **Morning / Open Curtains:** lilting electric piano, 96 BPM, rising fourth.
- **Home / Small Lamp:** warm guitar-like plucks and low triangle pad.
- **College / First Bell:** bright marimba ostinato with friendly syncopation.
- **Town / Errand Weather:** brushed rhythm, bass, and toy-piano answer.
- **Friends / Same Table:** shared four-chord phrase with rotating lead instruments.
- **Rain / Glass Pavement:** suspended harmony and irregular droplets.
- **Night / Last Train:** sparse pulse with long unresolved notes.
- **Dates / Borrowed Afternoon:** character theme counterpoint over the location harmony.
- **Loneliness / Empty Chair:** missing downbeats and incomplete cadences.

### Mara's motif

Mara's initial romance theme, **“Where You Are,”** is a six-note melody: scale degrees 3–5–6–5–2–3. It sounds warm and yearning over a major-sixth harmony. It is deliberately singable.

Variants retain identity through contour rather than timbre:

- **Warm:** 72 BPM, intimate bell/piano voice, major-sixth chords.
- **Jealous:** 68 BPM, melody delayed against chromatic inner harmony.
- **Sad:** fragile upper register, dropped third phrase.
- **Possessive:** exact repetitions shorten until the cadence cannot escape.
- **Angry:** 132 BPM rhythmic augmentation over the same pitch contour.
- **Stalking:** two or three distant notes, no declared tonic.
- **Nightmare:** bass carries inverted contour while the apparent melody is accompaniment.
- **Late:** every location family exposes the motif slots that were present from the start.

The infection system has four intensity tiers. Tier 0 reserves rhythmic space but does not play the motif. Tier 1 inserts two notes in inner voices. Tier 2 assigns fragments to a noticeable instrument. Tier 3 restructures cadences around it. Infection can respond to Mara proximity, control, attachment, exposure, and authored scenes. It is occasionally suppressed when she is present to prevent music from becoming a reliable detector.

Silence is its own cue with routed room tone: fluorescent hum, rain, fabric, steps, distant trains, breathing, and phone vibration. The engine can hold cheerful music across terrible scenes or cut only the accompaniment while preserving a melody stem.

The vertical slice contains original generative arrangements for home, morning, college, town, café, rain, night, Mara warm, Mara stalking, and investigation, with live motif infection and proximity transitions.

## Endings and requirements

The full game targets 18 major endings plus smaller outcome variants. Major endings have unique final chapters rather than a final choice menu.

- **The Perfect Life:** accept Mara's constructed continuity after high dependence and world exposure; find contradictions to determine whether Alex notices.
- **Run:** preserve a hidden identity, escape with sufficient resources, sever observed contacts, and survive an extended new-city chapter before “found you :)”.
- **The Last Person:** seal the open continuity during Long Thursday while accumulated victim pressure is high.
- **Don't Look Behind You:** learn enough to make observation reciprocal, then refuse every invitation to confirm her absence.
- **Agreement:** voluntarily remain after negotiating enforceable protections using three independently verified rules. Mara keeps her promise.
- **The Wrong Person:** assemble contradictory pre-Bellwether photos and reject the assumed identity link.
- **Open the Door:** complete the archive lattice, preserve Thursday memories, and choose the door while Mara's composure is genuinely broken. Beyond it is not a larger creature but a world made of discarded versions of ordinary days, with Larkspur revealed as one rehearsed arrangement.
- **Normal Ending:** keep exposure low, finish college, and accept memory corrections. Credits silently omit erased cast members.
- **She Cries:** methodically dismantle every imagined proof that Alex could love her. Mara does not retaliate. She withdraws the force holding incompatible versions of the town together; people remain alive but remember mutually exclusive lives and can no longer recognize one another.
- **The Phone:** build an unobserved refuge and cut all visual channels. The final chapter is played through calls while Mara's descriptions move from the building to the room to Alex's current posture.
- **Empty Save:** carry an object that only exists in a corrected timeline, miss a train on three nonconsecutive Thursdays, protect a person nobody remembers, and save during a motifless version of “Where You Are.” The title screen returns without Alex. Starting again makes Mara the only NPC who remembers the menu.
- **A Kindness:** successfully save the primary rival but teach Mara to choose people Alex does not know; the town's missing-person statistics rise while Alex's friends thrive.
- **Witness Protection:** publicly expose Mara with overwhelming evidence. Everyone believes Alex. This does not make public knowledge protective.
- **Second Seat:** destroy Mara's access to Alex's life. Years later another protagonist notices her three tables away.
- **No Music:** sever the motif infection by sacrificing June's route and every preserved recording. The ending is entirely silent until the credits hum the six notes acoustically.

No ending permanently kills Mara. No ending transforms Alex into her. Apparent victories change distance, rules, cost, or knowledge.

## Visual direction

The game uses a handcrafted pixel-adjacent look rendered through a fixed logical canvas and scaled cleanly. Cozy scenes use indigo outlines, apricot light, softened greens, lived-in clutter, high-resolution clustered-pixel portraits, and small directional character sheets. Runtime atlases provide sixteen material families, twenty furniture/evidence props and twenty outdoor/architecture assets. Collision rectangles are never treated as visible furniture. Horror rarely swaps to a new visual language. It changes one tile, holds one portrait frame, offsets a shadow, removes a background person, alters eye direction, or expands a room by eight pixels.

Mara belongs visually in the romance game: warm coat, leaf-shaped hair clip, expressive eyebrows, easy smile. Her inhuman frames are scarce enough that players debate them.

Her nonhuman tells are authored punctuation, not a transformation state. On a handful of unusually cruel or impossible lines, the typewriter reveal can expose a horn silhouette, a tail-like curve, or a shadow whose height makes no spatial sense for roughly a tenth of a second. The normal smiling portrait continues underneath. These slips have no sound sting, codex label, achievement, or explanatory follow-up, and random everyday dialogue never announces them. A player can miss every one.

## Dialogue voice direction

Dialogue is written aloud and revised by character rather than normalized into one house voice. Iris uses clipped visual observations and leaves thoughts unfinished. June restarts sentences and reaches for musical language when anxious. Theo deflects through concrete technical detail. Ren is terse and refuses ornamental mysticism. Nia speaks quickly, interrupts herself, and remembers practical social specifics. Sam is warm but plain-spoken. Mara hesitates, over-explains, laughs at herself, begs badly, and sometimes loses every verbal decoration at once. Her most dangerous answers are often the shortest.

Humour must reveal habits or relationships; it cannot exist only as a setup and punchline. Horror lines use ordinary vocabulary wherever possible. Rare cryptic remarks remain rare, and no character explains their own subtext for the player's benefit.

## Content pipeline

Content is authored in declarative JavaScript/JSON-compatible tables:

- maps define dimensions, collision rectangles, doors, props, ambient zones, and corruption overlays;
- characters define palettes, portrait parameters, schedules, relationship state, and dialogue pools;
- dialogue nodes define conditions, text, choices, effects, callbacks, and music directions;
- events define conditions, weights, cooldowns, uniqueness, scenes, and delayed consequences;
- tracks define musical note arrays, harmonies, stems, instruments, and infection slots;
- chapters define beats, deadlines, safety nets, route forks, and ending predicates.

Authoring validation checks unreachable doors, schedule destinations, missing dialogue nodes, invalid item references, event deadlocks, save serialization, and ending predicate satisfiability. The seed is stored so rare-event reports can be reproduced without making probabilities predictable during play.

## Vertical slice completion target

The included build is a substantial opening rather than a cutscene demo. It provides free movement across 16 connected areas, time progression, schedules, seven named NPCs, conversation choices, relationship/fear/suspicion values, currency and items, errands, café work, a photo activity, a rhythm activity, room décor, phone threads, weather, adaptive music, Mara's early route, jealousy, distant stalking, rare events, world-state changes, save/load, and a playable investigation. Chapter cards at the end summarize the state that will carry into the larger game.

The slice ends when the player learns not what Mara is, but that she has been organizing their week before they arrived.
