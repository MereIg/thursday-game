# THURSDAY

**THURSDAY** is an original 2D psychological-horror dating/life-sim vertical slice built with HTML5 Canvas and the Web Audio API. It has no external runtime dependencies and no hotlinked art.

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

The playable opening covers five in-game days with a free-roaming home, college, and town; seven scheduled characters with distinct dialogue voices and typing cadences; relationship and suspicion systems; quests, shopping and room customization; messages; two date paths; probabilistic events; an early stalking arc; a playable investigation sequence; scarce frame-length visual slips around Mara; and several state-dependent conclusions to the opening chapter. The story never supplies Mara with a surname or explains what she is.

The committed `assets/` directory contains the full raster art pass: Alex and Mara walk cycles, the supporting cast, dialogue portraits, material textures, furniture, evidence, nature, architecture, storefront and station assets. See [assets/README.md](assets/README.md) for the manifest and [outputs/screenshots](outputs/screenshots) for the browser-tested gallery.

The complete content and expansion architecture is documented in [GAME_DESIGN.md](GAME_DESIGN.md).
