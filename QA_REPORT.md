# MARA — visual and functional QA

Test date: 2 September 2026  
Build: September pixel-art pass

## Automated validation

`npm run check` passes:

- JavaScript syntax for `src/game.js` and `src/audio.js`.
- 16 maps and their exit destinations.
- 7 characters and schedule map references.
- 10 rare events and 11 inventory items.

`npm run art:web` completes and produces 28 runtime WebP files totalling about 1.62 MB from 32 committed non-runtime art/reference files. The full master library is about 60.69 MB and is not included in the Pages payload.

`git diff --check` reports no whitespace errors.

## Browser smoke tests

The build was run through the in-app browser against the local HTTP server, not judged from source files alone.

| Test | Result |
|---|---|
| Ordinary title at first presentation | Pass; no horror genre label or revealing slogan |
| Title artwork at 320×180 native resolution | Pass; nearest-neighbour clusters visible |
| Bedroom authored art | Pass |
| Café authored art and walk sprites | Pass |
| College authored art after decode | Pass |
| Rainy park authored art and rain layer | Pass |
| Mara dialogue, typing, choices and 128×128 portrait | Pass |
| Supporting-character square portrait and choices | Pass |
| Bedroom → landing interaction and fade | Pass; mode remained `play`, map became `landing` |
| Phone open/close | Pass; `play → phone → play` |
| Natural Day 4 travel into Bellwether | Pass; map became `college` and the event completed |
| QA-frozen one-frame weather-slip composition | Pass |
| Annex scene and investigation props | Pass |
| Runtime telemetry | Approximately 239–241 FPS in the test host; sampled worst frame 16.8 ms during initial load |

## Defects found and fixed during this pass

1. Generated portrait backgrounds left pale checkerboard islands around Mara's hair. The build now removes isolated low-chroma light cells before palette reduction.
2. A fixed 300 ms loading timer exposed old rectangle/fallback art before image decode. The loading screen now waits on every runtime art promise, with a five-second failure fallback.
3. Map changes faded toward permanent black. Transitions now enter the destination at full cover and fade in.
4. Major authored rooms were not always visible in early QA captures because of defect 2; the gallery was recaptured after the asset barrier fix.
5. Smooth source portraits still read as generated illustration. Runtime portraits were reduced from 192×192 to 128×128 cells and palettes tightened; the title was reduced from 480×270 to 320×180.
6. Monday/Tuesday rare horror could arrive before attachment formed. Most supernatural event gates now begin on Days 3–5.

## Gallery

The repository contains nine screenshots captured from the running build under `outputs/screenshots/`: title, bedroom, café, college, rainy park, Iris dialogue, Mara dialogue, archive annex and the QA-frozen weather-slip frame.

## Known production gaps

This is still a five-day vertical slice, not the promised final long game. Several secondary interiors continue to use the modular atlas rather than a full authored room. Full-body Mara action sheets are built and committed but only the walk sheet and portrait states are currently selected by ordinary gameplay. Accessibility/settings depth, extended chapters and major ending routes remain production milestones in `DEVELOPMENT_STATUS.md`.
