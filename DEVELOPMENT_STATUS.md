# MARA — implementation ledger

Updated 2 September 2026, geometry hardening v4. This is an opening in development,
not a finished twelve-day chapter or full game. Prior ledger: docs/status-foundation-v3.md.

## Implemented in this pass

- All 16 existing playable maps now use separately authored floor, furniture collision, interaction, door-entry, NPC and depth data. One additional geometry workshop is QA-only.
- Immutable 18×10 character foot colliders; explicit per-sheet/per-pose foot landmarks; substepped movement; collision-tested pointer routes; interactions cannot reach through solids.
- Foreground furniture occlusion using authored masks. Mara stays attached to the café booth during her date. Talking NPCs remain in place until dialogue closes when their schedule changes.
- Seated and collapsed pose scales corrected. Tremble moves the upper body only. Walk cycles no longer bob the whole sprite and shadow.
- F2 overlay, F3 fixed-position pose cycling, F4 frame stepping, attachment workshop and live pose gallery. Bed lie anchors exist; lying art does not.
- Mallow Street's prototype blocks replaced with generated source pieces fitted to its established geometry. Built-in image generation was used; source, runtime export and full prompt are in assets/scenes/.
- Fourteen pixel-editable, lossless fixed-grid production character masters. Builds copy their exact cells; the old alpha-box normalizer has been removed from production.
- Old save positions migrate to feet coordinates, recovering to a safe spawn if blocked. Original stored snapshots are not rewritten. QA fixtures do not overwrite normal autosaves.
- Automated: 20 runtime regressions, 77 approach routes / 9,995 body-solver steps, 6,257 NPC schedule positions, 68 overworld frames and 51 runtime image integrity checks.
- Browser: all existing room overlays inspected, café behind/front traversal, live Mara poses, seating/counter fixtures and changed-room checks. Evidence in outputs/screenshots/geometry/.
- Both complete user briefs retained in docs/briefs/. Mandatory future standards in ASSET_SPEC.md.

## Existing playable foundation retained

- Twelve-day calendar, daily texts, weekend schedules, day-12 finale gate. This is not yet twelve days of route-length authored content.
- Seven adult NPCs; affection/trust/fear/suspicion/resentment; simple off-screen social beats.
- Exploration, inventory, shopping, décor, classes, quests, café work, three mini-games and date scenes.
- Phone threads, replies, unread indicators and a Mara call.
- Three manual saves plus autosave; Continue chooses the latest; original THURSDAY saves migrate safely.
- Settings: text speed, master/music/ambience/SFX/voice levels, readable dialogue, reduced flashes, fullscreen.
- Character typing profiles and original synthesized voice bleeps. Adaptive synthesized score, motifs, silence and proximity changes.
- Thirty-eight extra ambient nodes: twenty Mara, three each for six other characters, each with two replies.
- Mara: 36 unique portrait cells plus aliases, 16 walking frames, 12 static action cells. Cast: neutral/happy/concerned portrait sheets.
- Normal/altered bedroom, college, café, library and station. Authored interiors throughout the opening.
- Following: authored 1D route, cover points, sprint noise, branch choice and caught/unnoticed outcomes. It is not general-purpose 2D stealth AI.
- Rare supernatural punctuation remains; no species exposition, killable-boss route or Chapter 2 expansion added.

## Still unfinished — before later chapters

- True editorial pixel-cluster/face consistency pass. Generated art is not hand-pixelled art.
- Full multi-frame sitting, drinking, wiping, crying, running, turning and lying animations. Current action cells are poses, not complete animated actions.
- Route-length normal content across all twelve days, repeatable dates, visits, clubs and substantial supporting-character scenes.
- Missing future maps: friends' homes, gym, roof, computer room, changing rooms, clubs, Mara's alleged home.
- Cast fear/grief/anger/embarrassment/outfits and larger romance coverage.
- Fully externalized story packs and content schemas; only ambient content is currently extracted.
- Real rumour propagation, cancellations, relationship-driven schedule changes and the full hidden Mara behaviour model.
- Final composed/performed/rendered stems, loudness/headphone acceptance and whole-route listening tests. The score is still synthesized.
- Unified phone/journal/shop UI, remappable controls, warning panel and comfortable portrait-phone text.
- Physical phone/low-end laptop and throttled decoding tests; full twelve-day manual multi-route acceptance.
- Geometry and visual regression review after EVERY subsequent art/layout change. This pass is not a promise of zero future edge cases.

## Build and review

npm run art:web publishes scene exports and unchanged fixed-grid character sheets.
npm run audit:assets runs the read-only image audit (Python/Pillow).
npm run check runs content, geometry, runtime and integrity checks.
python -m http.server 4173 serves the game.

Runtime images: 51 WebPs, approximately 5.68 MiB, including retained legacy files.
Source/master/QA files are in Git; only runtime assets are loaded by the game.
