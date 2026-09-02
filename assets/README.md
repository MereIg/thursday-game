# MARA art library

All art used by the project is committed here. Nothing is hotlinked. Full PNG files are editable source masters; `web/` contains the deterministic, lightweight, pixel-reduced assets loaded by the game.

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

The runtime exposes 42 named Mara portrait states and 12 full-body action cells.

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
- WebP output is roughly 2.2 MB while all source PNG masters remain in Git.

Rebuild with `npm run art:web`. Do not hand-edit `web/`; change the master or the conversion script and regenerate.
