# MARA art library

## Geometry v4 — current production policy

The active 14 character sheets now rebuild unchanged from `production/characters/`.
They are lossless, fixed-canvas, pixel-editable masters. No alpha-box cropping,
per-pose normalization or automatic centring remains in the production builder.
Large generated PNGs remain as source/reference history; they are not automatically
valid future sheet templates. Read `../ASSET_SPEC.md` before editing/importing art.

New street source: `scenes/mallow-street-geometry-v4.png`; built-in image-generation
prompt: `scenes/mallow-street-geometry-prompt.md`. Its source pieces are fitted to
existing geometry by `src/street-art.js`. Runtime: 51 images, approximately 5.68 MiB.
`web/integrity.json` and `outputs/geometry-asset-audit.json` record the reviewed files.
The v3 conversion description below is historical; it is no longer the build path.

All art used by the project is committed here. Nothing is hotlinked. Full PNG files are editable source masters; `web/` contains the deterministic runtime assets. Older v1/v2 masters and builds remain for comparison. The v3 inventory below supersedes earlier counts.

## Foundation v3 — active replacements

23 new PNG masters, approximately 41 MiB total:

- `characters/mara-canonical-pixel-v3.png`: canonical neutral face and directional identity reference; no runtime duplicate needed.
- `characters/mara-portraits-{warm,vulnerable,jealous,intense,romance,anomaly}-pixel-v3.png`: six 2×3 sheets, 36 unique cells. Runtime aliases provide additional names, not additional art.
- `characters/mara-walk-pixel-v3.png`: four directions × four frames.
- `characters/mara-actions-{everyday,distress}-pixel-v3.png`: two 3×2 sheets, twelve static poses. Everyday order: mug, phone, read, wave, hugSelf, stand. Distress order: wipeTears, tremble, collapse, clutchSleeve, angryCry, abruptStill.
- `characters/cast-portraits-{neutral,happy,concerned}-pixel-v3.png`: three 3×2 sheets ordered Iris, June, Theo / Ren, Nia, Sam.
- `scenes/{rowan-house,east-hall,seminar-room,cafeteria,music-room,archive-corridor,archive-annex}-v3.png`: seven replacement interiors.
- `scenes/{cafe,library,station}-shifted-v3.png`: altered counterparts to existing normal scenes.

Character v3 conversion: magenta key, crop, nearest-neighbour-only resampling, lossless WebP. No LANCZOS or palette reduction for these new character sheets. Walk-cell stray fragments are removed by connected-component cleanup. The source is still AI-generated pixel-style artwork and needs further deliberate pixel/face editing; this is not a claim of human hand-pixelled art.

The complete runtime library now contains **50 WebPs, 5,903,844 bytes (5.63 MiB)**, including retained legacy files. Seven interiors and ten of the twelve action states have integration hooks; see the ledger for remaining animation/scene work. All assets remain in Git; Pages serves only runtime WebPs, not the large PNG masters.

## Appearance authority

- `references/mara-authoritative.jpg` — current Mara authority: adult, red-brown wavy half-up hair, crown loop, burgundy back ribbon, brass leaf clip, amber eyes, moss cardigan, cream lace blouse and plaid skirt.
- `references/mara-alternate.jpg` — earlier mood/expression reference only.

Mara has no surname. Normal sheets do not present an overt monster form.

## Character masters

- `characters/alex-walk.png` — four directions × four frames.
- `characters/mara-walk.png` — four directions × four frames.
- `characters/cast-directions.png` — Iris, June, Theo, Ren, Nia and Sam direction sprites.
- `characters/cast-portraits.png` — six neutral portraits.
- `characters/cast-portraits-happy-v2.png` — six happy reactions.
- `characters/cast-portraits-concerned-v2.png` — six concerned reactions.
- `characters/mara-portraits.png` — original six-state sheet retained for history.
- `characters/mara-portraits-warm-v2.png` — neutral, laugh, shy/embarrassed, teasing, affectionate and awkward.
- `characters/mara-portraits-vulnerable-v2.png` — concerned, tired, watery-eyed, quiet crying, sobbing and pleading.
- `characters/mara-portraits-jealous-v2.png` — forced smile, restrained jealousy, hurt, annoyed, angry crying and panic.
- `characters/mara-portraits-intense-v2.png` — shouting, furious, shocked, still, cold and dissociated.
- `characters/mara-portraits-romance-v2.png` — excited, proud, flirtatious, sleepy, surprised affection and content.
- `characters/mara-portraits-anomalies-v2.png` — clip-side error, wrong pupils, held stillness, canine suggestion, horn-like hair silhouette and wrong shadow.
- `characters/mara-actions-everyday-v2.png` — six everyday full-body poses.
- `characters/mara-actions-distress-v2.png` — six distressed full-body poses.

The earlier state-name inventory included aliases. The active v3 library has 36 unique Mara portrait cells and twelve action cells; do not report aliases as extra expressions.

## Authored scene masters

- `title/mara-bedroom-v2.png` — ordinary warm title illustration.
- `scenes/bedroom-v2.png` and `bedroom-shifted-v2.png`.
- `scenes/college-hall-v2.png` and `college-hall-shifted-v2.png`.
- `scenes/cafe-v2.png`.
- `scenes/park-rain-v2.png`.
- `scenes/library-v2.png`.
- `scenes/arcade-v2.png`.
- `scenes/station-rain-v2.png`.
- `scenes/high-street-rain-v2.png`.

Normal/shifted pairs preserve composition so small continuity errors can carry horror.

## Modular legacy atlases

- `environment/material-atlas.png` — sixteen material families.
- `environment/furniture-atlas.png` — twenty furniture/evidence props.
- `environment/outdoor-atlas.png` — twenty nature/architecture props.

These remain useful for minor maps and fallbacks, but major locations now use authored scene art rather than visible flat rectangles with stretched materials.

## Runtime library

`scripts/build_web_art.py` creates `web/` using the following production rules:

- scenes: 480×270; title: 320×180; both palette-limited and enlarged with nearest-neighbour scaling;
- dialogue portraits: true 128×128 cells with transparent cleaned backgrounds;
- walk cycles: 64×80 native cells;
- action poses: 112×160 native cells;
- no smoothing at runtime;
- isolated neutral checkerboard pixels are removed before palette reduction;
- See the v3 totals above; all source PNG masters remain in Git.

Rebuild with `npm run art:web`. Do not hand-edit `web/`; change the master or the conversion script and regenerate.
