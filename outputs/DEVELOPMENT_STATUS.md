# MARA — implementation ledger

Updated: 2 September 2026, foundation v3. This is a development build, not the full game. The design bible is the destination; the checkboxes below are the current implementation. Image generation is not the same thing as finished hand-placed pixel art.

## Implemented

- [x] Sixteen connected home, college and town maps; movement, collision, contextual interaction, mouse/keyboard/touch input.
- [x] Twelve-day calendar, daily message beats, weekend schedule overrides and a day-12 chapter gate. Old day-five saves can advance. **Content density is not yet twelve fully authored days.**
- [x] Seven scheduled adult NPCs, relationships, trust/fear/suspicion/resentment, authored off-screen social changes.
- [x] Items, shopping, room decoration, quests, classes, café work, three mini-games and date scenes.
- [x] Phone threads, unread messages, Mara replies/call; pointer contact selection and reply/close targets.
- [x] Three manual save slots plus separate autosave. Continue chooses the newest snapshot, including autosave. Old `thursday-save-v1` is imported into slot one without deleting the original or overwriting an existing manual save.
- [x] Real settings: four text speeds, master/music/ambience/SFX/character-voice volumes, readable dialogue type, reduced flashes and fullscreen. Settings persist separately from saves.
- [x] Distinct original synthesized character bleeps, typing cadences and punctuation pauses. Instant text skips bleep bursts.
- [x] Adaptive synthesized score, location arrangements, motif infection, silence and proximity transitions. **Final performed/rendered music stems are not done.**
- [x] Thirty-eight extra repeatable conversation nodes in `src/content/ambient.js`: 20 Mara, three each for six supporting characters, two replies per node. Most remain intentionally mundane.
- [x] New canonical Mara pixel-style reference; six replacement portrait sheets with **36 unique cells** and multiple named aliases, sixteen directional walk frames, twelve static action cells.
- [x] New supporting portrait sheets: six characters × neutral/happy/concerned. Their larger emotion/outfit libraries remain unfinished.
- [x] Action selection in ambient dialogue, café date, late call and annex scenes. The visible overworld Mara also uses an action cell when her current dialogue selects one. Tremble uses small timed displacement; portrait changes crossfade. These are **not twelve complete multi-frame action animations**.
- [x] Seven more full-scene interiors: Rowan House, east hall, seminar room, cafeteria, music room, archive corridor and annex. These replace atlas-backed room presentation, not the map/collision system.
- [x] Shifted café, library and station, in addition to existing bedroom/college pairs.
- [x] Following has cover points, sprint noise, a street/alley branch and separate caught/unnoticed outcomes. It is an authored one-dimensional sequence, **not general-purpose 2D sight-cone AI**.
- [x] Random supernatural events pushed to days 6–11; initial distance alone no longer forces stalking music. Selected rare horn/tail/shadow punctuation remains; reduced-flash mode suppresses those flashes.
- [x] All generated PNG masters and rebuilt runtime WebPs retained in Git. No hotlinked art. The 50-file runtime library totals 5.63 MiB, including retained legacy assets.
- [x] Twelve new logic regression checks, existing map/content validation and browser screenshot QA. CI runs these before deploying Pages.

## Art direction and remaining quality work

Mara's v3 portraits/actions/walk cells use a common canonical reference and nearest-neighbour-only resampling. No LANCZOS or palette-quantization pass is used for those v3 character sheets. The source is still generated, not literally hand-pixelled; exact face landmarks and pixel clusters need another editorial pass. The environments still use the earlier scene downsampling process and need a proper spatial/collision/occlusion pass. Adding a background does not automatically make its furniture navigable correctly.

Current Mara action names: mug, phone, read, wave, hugSelf, stand, wipeTears, tremble, collapse, clutchSleeve, angryCry, abruptStill. Collapse and angryCry are library coverage, not yet selected by an authored scene. The others are selected in ordinary or story dialogue. Supporting walk sprites and Alex have not received the same v3 redraw.

## Next acceptance gates — before Chapters 2–5

- [ ] One shared pixel-grid/landmark edit pass across every normal Mara face; anomalies must be the only deliberate identity errors.
- [ ] Proper multi-frame sitting, drinking, wiping, crying, running and turning animations; scene blocking instead of relying on a full-body dialogue card.
- [ ] Align every authored room with collisions, interaction anchors and foreground occlusion. Café tabletop blockers were corrected in this pass; full-map alignment is not complete.
- [ ] Fill days 6–12 with route-length playable events, repeatable dates, club activities, visits, lessons and varied ordinary conversations. A calendar extension is not seven days of finished writing.
- [ ] Build missing places: friends' homes, computer room, gym, roof, changing rooms, clubs and Mara's alleged house. They are not existing rooms with finished art.
- [ ] Supporting anger, embarrassment, fear, grief, laughter, outfits and date looks.
- [ ] Fully externalize story dialogue/events and add content schemas. Only ambient dialogue is extracted so far.
- [ ] Real social-graph rumour propagation, cancellations, relationship-driven schedule overrides and persistence.
- [ ] Final music composition, performance/rendering, stem exports, loudness/headphone checks and transitions listened to across a whole run.
- [ ] Unified phone/journal/shop UI, remappable controls, non-fiction content-warning panel, longer message history and fully readable mobile dialogue.
- [ ] Test on physical phones and lower-powered laptops. Viewport emulation is not hardware QA. Portrait mode keeps controls out of the scene but text is still too small for comfortable play; landscape is recommended.
- [ ] Then expand the later chapters and genuinely different ending chapters from `GAME_DESIGN.md`.

## Reproduction

`npm run art:web` rebuilds assets (Python + Pillow). `npm run check` runs syntax, world validation and logic regressions. `python -m http.server 4173` serves the game. See `QA_REPORT.md` for the actual tested scenes. Latest captures are under `outputs/screenshots/foundation-v3/`; older captures remain for comparison.
