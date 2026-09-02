# THURSDAY art assets

Every runtime image used by the game is committed beneath this directory. The game has no hotlinked art and does not depend on an image host.

## Character assets

- `characters/alex-walk.png` — four-direction, four-frame adult protagonist walk sheet.
- `characters/mara-walk.png` — four-direction, four-frame Mara walk sheet using the authoritative red-brown hair, leaf clip, green cardigan, cream blouse and plaid skirt design.
- `characters/mara-portraits.png` — six Mara expressions: neutral, delighted, shy, pleading, jealous and still.
- `characters/cast-directions.png` — directional sprites for Iris, June, Theo, Ren, Nia and Sam.
- `characters/cast-portraits.png` — dialogue portraits for the six supporting characters.

## Environment assets

- `environment/material-atlas.png` — sixteen material families for home, town, college, café, park, station, archive and annex.
- `environment/furniture-atlas.png` — twenty authored furniture and evidence props.
- `environment/outdoor-atlas.png` — twenty trees, park, street, storefront, station and doorway assets.

## Design references

`references/mara-authoritative.jpg` is the current appearance authority supplied for Mara. `references/mara-alternate.jpg` is retained as an earlier mood/expression reference. Runtime sheets were generated specifically for this project and then integrated and visually tested in the live build.

## Runtime treatment

The source sheets intentionally remain at production resolution. The Canvas renderer crops atlas cells, removes only edge-connected pale generation backdrops, disables interpolation, and scales to the logical game resolution. Collision rectangles remain gameplay data and are not used as visible furniture.

