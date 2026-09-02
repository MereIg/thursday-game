# MARA

**MARA** is an original 2D school-life and relationship game whose warm routines gradually become unreliable. It is built with HTML5 Canvas and the Web Audio API, with no external runtime dependencies or hotlinked art.

## Play

Geometry hardening v4: all existing rooms have separate collision/interaction
layers, fixed-foot sprites and foreground occlusion. Press F2 to inspect them.
See [asset/geometry standards](ASSET_SPEC.md), [QA results](QA_REPORT.md), and
[current limitations](DEVELOPMENT_STATUS.md). Full production briefs: `docs/briefs/`.
This update does not claim that twelve days of finished story content exist.

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

The current development build runs a twelve-day opening calendar with a free-roaming home, college and town; seven scheduled characters; original character bleeps and typing cadences; relationships; quests, shopping and room customization; messages; date scenes; rare events; stalking and investigation. There are three manual save slots plus autosave, migrated legacy saves and a persistent settings panel. The calendar is playable, but it is not yet twelve days of content-complete writing. The story never supplies Mara with a surname or explains what she is.

All generated PNG sources, fixed-grid production character masters and runtime WebPs are committed in `assets/`. The current pass fits new street source art to authored geometry and locks character exports against accidental frame normalization. This is generated art under ongoing direction, not a claim of completed hand-pixelled production art. See [assets/README.md](assets/README.md) for the manifest and [latest screenshots](outputs/screenshots/geometry) for actual browser captures.

[Play the review build](https://mereig.github.io/thursday-game/). The browser build is a convenient review target; a desktop package is still planned. Source/master files are kept in Git but are not downloaded by the game. The current runtime image library is approximately 5.68 MiB.

Use `npm run check` for validation and regression tests. Phone portrait controls are placed below the canvas; landscape is recommended for readable dialogue. Physical mobile-device QA remains outstanding.

The downloadable ZIP under `outputs/` contains the runtime, regression tests and documentation. Rebuilding art requires the full repository's fixed-grid production masters, PNG scene sources and Pillow; those masters are intentionally omitted from the small ZIP.

Project documentation:

- [GAME_DESIGN.md](GAME_DESIGN.md) — complete long-form game and systems plan.
- [ORIGINAL_VISION.md](ORIGINAL_VISION.md) — preserved creative brief and non-negotiables.
- [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md) — honest implemented/planned ledger and QA notes.
- [QA_REPORT.md](QA_REPORT.md) — automated checks, browser smoke tests and defects fixed.
- [ART_PROMPTS.md](ART_PROMPTS.md) — generation specifications and runtime treatment.
- [assets/README.md](assets/README.md) — committed master/runtime asset manifest.
