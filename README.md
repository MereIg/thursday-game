# MARA

**MARA** is an original 2D school-life and relationship game whose warm routines gradually become unreliable. It is built with HTML5 Canvas and the Web Audio API, with no external runtime dependencies or hotlinked art.

## Play

Run a local web server from this directory:

```powershell
python -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

## Controls

- Move: `WASD` or arrow keys
- Interact / advance dialogue: `E`, `Space`, or `Enter`
- Phone: `P`
- Journal / objectives: `J`
- Pause: `Escape`
- Choose dialogue: number keys, arrows + Enter, or mouse
- Mouse: click the ground to move and click the interaction prompt to use it
- Touch controls are available on-screen on touch devices

Audio begins after the first click or keypress, as required by browsers. Headphones are strongly recommended: the adaptive score is a core game system.

## Scope

The playable opening covers five in-game days with a free-roaming home, college, and town; seven scheduled characters with distinct dialogue voices and typing cadences; relationship and suspicion systems; quests, shopping and room customization; messages; three date paths; probabilistic events; an early stalking arc; a playable investigation sequence; scarce frame-length visual slips around Mara; and several state-dependent conclusions to the opening chapter. The story never supplies Mara with a surname or explains what she is.

The committed `assets/` directory contains the full raster art pass: Alex and Mara walk cycles, the supporting cast, dialogue portraits, material textures, furniture, evidence, nature, architecture, storefront and station assets. See [assets/README.md](assets/README.md) for the manifest and [outputs/screenshots](outputs/screenshots) for the browser-tested gallery.

Project documentation:

- [GAME_DESIGN.md](GAME_DESIGN.md) — complete long-form game and systems plan.
- [ORIGINAL_VISION.md](ORIGINAL_VISION.md) — preserved creative brief and non-negotiables.
- [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md) — honest implemented/planned ledger and QA notes.
- [QA_REPORT.md](QA_REPORT.md) — automated checks, browser smoke tests and defects fixed.
- [ART_PROMPTS.md](ART_PROMPTS.md) — generation specifications and runtime treatment.
- [assets/README.md](assets/README.md) — committed master/runtime asset manifest.
