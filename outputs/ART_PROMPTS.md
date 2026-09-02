# Art generation prompt set

## Foundation v3 — pixel-style correction

Built-in ImageGen, reference-guided. All 23 generated results are committed as PNG masters, alongside their derived WebPs. Earlier prompts below are retained as production history.

Canonical specification: adult Mara; deep chestnut half-up long hair, crown loop, amber eyes, fixed brass leaf clip, burgundy back ribbon, moss cardigan, cream lace blouse, brown plaid skirt, dark tights and brown shoes. Use the supplied current reference, not the earlier dark school-uniform image. Large clean square pixel clusters, limited deliberate shading planes, firm outlines, simplified hair masses, no airbrush, no smooth gradients, no lettering. Bright magenta chroma background for isolated character sheets.

The canonical 2×2 image defines a neutral bust plus front/side/back identity. All subsequent Mara sheets use that reference. Six 2×3 portrait sheets cover warm, vulnerable, jealous, intense, romance and anomaly states. Preserve jaw, eyes, clip side, necklace and costume; only anomalies may deliberately violate identity. The anomaly row order is wrong pupils, wrong-side clip, excessive stillness, canine suggestion, hornlike hair edge, wrong shadow. These are reference-guided generations, not guaranteed identical face geometry; a further landmark edit pass remains required.

Actions use strict 3×2 cells, not the older 2×3 layout. Everyday: seated mug, phone, reading, small wave, self-hug, standing. Distress: wipe tears, tremble, collapsed crying, clutch sleeve, angry crying, abrupt stillness. Walking uses strict 4×4, rows down/left/right/up, four restrained walk frames per row. Supporting busts use strict 3×2 in Iris/June/Theo then Ren/Nia/Sam order, three separate neutral/happy/concerned sheets.

Seven room prompts preserve a fixed overhead RPG view, warm late-afternoon lighting, restrained wood/plum/moss palette and open movement lanes: Rowan House kitchen/landing, college east hall, seminar classroom, cafeteria, music practice room, archive corridor and old annex. Three reference edits preserve the café/library/station compositions while changing selected props or spacing. These scene masters still need spatial/collision/occlusion refinement in-engine.

The character conversion pipeline uses nearest-neighbour only and lossless WebP; magenta is keyed before resizing. Directional sprites additionally discard disconnected stray fragments. Scene conversion still uses the older filtered downsampling; do not describe the entire library as hand-placed pixel art.

The production raster pass used the built-in image-generation workflow. The user's `assets/references/mara-authoritative.jpg` was the appearance authority; `mara-alternate.jpg` was used only for expression-sheet mood and organization.

All prompts required polished handcrafted pixel-art-adjacent rendering, clearly adult characters, cohesive plum/moss/rust/cream/rain-blue colour, consistent upper-left lighting, no readable text, no watermark, no blood, no horns or tails in normal art, and isolated atlas cells.

1. **Mara portraits — 2×3:** red-brown waist-length wavy half-up hair with crown loop and burgundy back ribbon; brass leaf clip; amber-brown eyes; moss cardigan; cream lace blouse; plaid skirt edge. Expressions: neutral, delighted, shy, pleading, jealous, unnaturally still.
2. **Mara walk — 4×4:** four walk frames for down, left, right and up, preserving the authoritative outfit, hair and adult proportions.
3. **Alex walk — 4×4:** warm medium-brown skin, short near-black side-parted hair, navy chore coat, rust knit top, charcoal trousers and tan cross-body bag; four directions and four frames.
4. **Supporting directions — 4×6:** direction cells for Iris, June, Theo, Ren, Nia and Sam, preserving distinct skin tones, silhouettes, clothes and signature accessories.
5. **Supporting portraits — 3×2:** one expressive bust each for Iris, June, Theo, Ren, Nia and Sam, consistent with their direction sprites.
6. **Furniture/evidence atlas — 5×4:** bed, desk, shelf, lamp, rainy window, radiator, door, lockers, bench, fountain, café counter, booth, pastry case, fern, kettle, library shelf, study table, piano, arcade cabinet and archive evidence box.
7. **Material atlas — 4×4:** home woods/wallpaper, wet town asphalt/paving/brick, college stone/plaster/tile, library/café wood, arcade carpet, park grass, station concrete, archive linoleum and annex concrete.
8. **Outdoor/architecture atlas — 5×4:** trees, shrub, hedge, flower bed, pond, greenhouse, streetlamp, bus shelter, noticeboard, three storefronts, ticket machine, platform sign, college doors, roof, fire escape, dumpster and annex door.

Generated source sheets are committed under `assets/`; runtime code crops, keys only pale generation backdrops, and scales them without interpolation.

## September 2026 authored pass

Mode: built-in image generation using the supplied Mara images as visual references where character consistency mattered. Every result was saved as a PNG master, then transformed by `scripts/build_web_art.py`; no raw generated bitmap is loaded by the game.

Shared production direction: warm handcrafted small-studio RPG illustration, pixel-art-adjacent shapes suitable for aggressive downsampling, clear clustered silhouettes, restrained plum/moss/rust/cream/rain-blue palette, consistent upper-left light, adult proportions, no lettering, no watermark, no gore, and no obvious horns/tails outside the anomaly sheet.

1. **Title — warm bedroom:** Mara sits naturally on the bed holding a mug in a lived-in student bedroom at evening; empty darker left third for an ordinary romance-game menu; welcoming rather than ominous.
2. **Warm portraits (2×3):** laugh, shy/embarrassed, teasing, affectionate hand-to-cheek, awkward self-consciousness and calm warmth, preserving Mara's authority exactly.
3. **Vulnerable portraits (2×3):** concern, exhaustion, watery eyes, quiet crying, uncontrolled sobbing and pleading; emotionally messy rather than glamorous.
4. **Jealous portraits (2×3):** forced social smile, jealousy held behind the eyes, hurt, annoyance, angry crying and abandonment panic.
5. **Intense portraits (2×3):** shouting, fury, shock, abrupt stillness, cold simplicity and dissociation. No supernatural costume change.
6. **Romance portraits (2×3):** childishly excited, proud, flirtatious, sleepy, surprised by tenderness and quietly content.
7. **Anomaly portraits (2×3):** copies of an ordinary calm Mara with only one low-salience inconsistency per cell: leaf clip on the wrong side, pupils tracking outward, pose held too symmetrically, barely visible canine, hair forming a horn-like two-pixel silhouette after downsampling, or shadow/reflection disagreement.
8. **Everyday actions (2×3):** sitting with a drink, reading, looking away, checking her phone, leaning against a wall and a small wave.
9. **Distress actions (2×3):** hugging herself, wiping tears, crouched crying, shaking hands, grabbing a sleeve and a perfectly motionless reset after panic.
10. **Supporting happy/concerned portraits (3×2):** Iris, June, Theo, Ren, Nia and Sam, each maintaining their established clothing, skin tone, hair and signature prop.
11. **Bedroom pair:** the same warm overhead bedroom in normal and continuity-shifted versions; bed, window, desk, wardrobe, shelf and rug stay memorable while drawer, curtain, photograph and object spacing alter.
12. **College pair:** the same elegant Bellwether entrance hall in normal and subtly misregistered Thursday versions; three doors, windows, noticeboard, trophy case, crest rug, stairs and lamps provide continuity anchors.
13. **Foxglove Café:** overhead evening café with counter, pastry case, booths, mixed tables, rain-dark windows and navigable floor lanes.
14. **Rainy park:** overhead paths, old trees, pond, greenhouse, benches and planted edges, quiet enough for dates.
15. **Library:** warm overhead stacks, study tables, service desk, lamps, archive access and clear walk lanes.
16. **Lantern Arcade:** overhead indigo/magenta arcade, racing cabinet, prize counter, rhythm machine and worn carpet without readable brand text.
17. **Station:** rainy evening platform, shelter, ticket machine, clock, benches and service-lane entrance.
18. **High Street:** wet evening shopping street with café frontage, corner shop, reflected lamps, bus stop and alleys.

Acceptance required visual inspection in the running 960×540 canvas. The first portrait build exposed pale checkerboard islands around Mara's hair; the cleanup threshold was corrected and every runtime sheet was regenerated before acceptance.
