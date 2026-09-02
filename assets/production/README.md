# Fixed-grid production masters

These 14 lossless character sheets are the approved, pixel-editable masters for
the active runtime. They preserve the exact frame pixels reviewed in-game. The
larger generated PNGs are retained separately as reference/source history.

Builds copy these sheets unchanged to `assets/web/characters`. No silhouette
trimming, alpha-derived centring, per-pose stretching or guessed frame bounds.
Read `ASSET_SPEC.md` and update explicit `SPRITE_SPECS` only after visual review.
Run `npm run art:web`, `npm run audit:assets`, and `npm run check` after edits.

This means technically approved placement, not a claim that every generated
pixel/face already meets final artistic direction.
