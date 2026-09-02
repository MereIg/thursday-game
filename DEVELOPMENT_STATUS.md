# MARA — implementation ledger

Updated: 2 September 2026

This document distinguishes the current playable opening from the planned full game. A checked item means it exists in the running build and was exercised by automated validation or browser play-testing; it does not mean the system is content-complete for the eventual long-form release.

## Playable now

- [x] Five-day opening with free exploration after the chapter summary.
- [x] Sixteen connected maps spanning home, Bellwether College and Larkspur.
- [x] Seven scheduled adult characters with off-screen social changes.
- [x] Movement, collision, contextual interaction, keyboard, mouse and touch input.
- [x] Individual dialogue reveal speeds, punctuation pauses and voice-bleep profiles.
- [x] Choice effects across affection, trust, fear, suspicion and resentment.
- [x] Inventory, money, shop, quests, room decoration, classes and three mini-games.
- [x] Phone contacts, unread state, messages, replies and a late-night Mara call.
- [x] Café, park and arcade date content.
- [x] Weather, day/time, exhaustion sleep, NPC schedules and save/load.
- [x] Ten weighted rare events with day/location/cooldown gates.
- [x] Mara sightings before formal introduction, early jealousy and cryptic lines.
- [x] Following/stealth sequence and archive-annex investigation.
- [x] Adaptive Web Audio score with location cues, crossfades and motif infection.
- [x] Frame-length horn/tail/shadow punctuation only on selected impossible lines.
- [x] Original Thursday wrong-weather event with one-frame Mara interruption.
- [x] Authored title, bedroom, college, café, park, library, arcade, station and High Street art.
- [x] Normal and subtly shifted bedroom/college variants.
- [x] Forty-two named Mara portrait states and twelve full-body action poses.
- [x] Supporting walk sprites and normal/happy/concerned portrait sets.
- [x] Versioned master PNG library plus palette-reduced WebP runtime build.
- [x] Asset-ready loading barrier, lean GitHub Pages bundle and cache-busted runtime.
- [x] Syntax/content validation and a nine-image browser QA gallery.

## Current art rules

- Runtime rooms are 480×270 and the title is 320×180; both enlarge with interpolation disabled.
- Mara and cast portrait cells are 128×128, palette-limited and background-cleaned.
- Direction sprites use 64×80 native cells; full-body actions use 112×160 cells.
- Masters stay in Git. `npm run art:web` deterministically rebuilds the lightweight library.
- Generated output is never accepted directly: it must pass crop, transparency, palette, scale and in-game inspection.
- Normal Mara art contains no obvious monster form. Anomaly portraits are individually addressable and used sparsely.

## Verified in this pass

- Title contains no horror label, slogan or reveal; browser metadata is an ordinary school-life description.
- Mara is identified only as Mara in dialogue and design canon.
- Title, bedroom, café, college, rainy park, supporting portrait, Mara portrait, annex and weather-slip frames were captured from the running build.
- Pale checkerboard fragments around generated portrait hair were found during live QA and removed in the asset pipeline.
- Slow asset decode previously exposed fallback rectangles/round portraits; the loading screen now waits for the art promise set.
- Map transitions previously faded toward permanent black; they now enter new maps with a short fade-in.
- Early random events were moved later so Monday and Tuesday can establish routine.
- Browser telemetry exposes FPS, worst frame time, mode, map, day/time and active weather-slip state for reproducible testing.

## Next production milestones

- [ ] Expand the playable calendar from five days to Chapter 1's full twelve days.
- [ ] Author remaining interiors: kitchen, friends' houses, classrooms, music room, computer room, gym, roof, club rooms, changing rooms and Mara's claimed home.
- [ ] Add seated, running, phone, drink, embrace, trembling and look-away animation use in scenes.
- [ ] Give every supporting character route-scale expression and outfit libraries.
- [ ] Move dialogue/events to external JSON-compatible content packs with migrations.
- [ ] Expand social simulation from authored ticks to daily schedule overrides and rumour propagation.
- [ ] Add line-of-sight cover, noise and route branches to following sequences.
- [ ] Record/export the composed score as authored stems while preserving the live adaptive layer.
- [ ] Build Chapters 2–5 and the major ending chapters defined in `GAME_DESIGN.md`.
- [ ] Add accessibility settings, remapping, text speed, volume buses and content warnings outside the fiction-facing title screen.
- [ ] Package a desktop build after the vertical slice is stable; the web build remains the quickest review target, not the required final platform.

## Reproduction

Run `npm run art:web`, then `npm run check`, then `python -m http.server 4173`. QA scenes use `?qa=<map>&day=<1-5>&time=<minutes>`. The weather interruption can be inspected with `?qa=college&event=weather-slip&freeze=1`; `freeze=1` exists only for visual QA and never occurs in normal play.
