# MARA — geometry and asset contract

## Non-negotiable rule

Visual art does not define gameplay geometry. Do not compute collision, world
position, depth or interactions from alpha, PNG centres or silhouette bounds.
Unexpected visual/placement inconsistency is a bug, not a Mara anomaly.

The full user briefs are preserved in `docs/briefs/geometry-hardening.txt` and
`docs/briefs/chapter1-production.txt`. Geometry must pass before expanding content.

## Coordinate systems

The simulation is 960×540. Existing environments use a 480×270 art grid at 2×.
`src/geometry-world.js` uses art-grid coordinates and converts them once. Actor
positions, physics, input and draw anchors always use simulation coordinates.
The preferred tile unit is 16 art pixels / 32 simulation pixels. Fine collision
and attachments may use smaller integer coordinates. No camera-dependent physics.

| Asset | Fixed cell | Sheet arrangement | Ground/placement rule |
| --- | --- | --- | --- |
| Alex and Mara walking | 64×80 | 4 columns × 4 direction rows | Foot landmark (32,78), world scale 1 |
| Supporting directions | 64×80 | 4 directions × 6 characters | Same foot landmark; not four-frame walk cycles |
| Mara actions | 112×160 | 3 columns × 2 rows | Per-pose landmarks in `SPRITE_SPECS`, not automatic centring |
| Mara portraits | 128×128 | 2 columns × 3 rows | UI-only; never used as an overworld collider |
| Cast portraits | 128×128 | 3 columns × 2 rows | UI-only |
| Existing room backgrounds | 480×270 | one scene | Geometry and foreground masks are separate |

All overworld actors use the immutable 18×10 feet rectangle: x−9, y−5. Hair,
bags, hands and expressions never change it. `drawPlacement()` subtracts the
authored landmark from the actor's world coordinate. The walking renderer no
longer bobs the whole sprite/shadow. Trembling moves only the upper-body slice.
Seated and collapsed poses have smaller visual scales, not a changed collider.

Every sprite cell needs transparent padding: no opaque pixels on its four cell
edges, at least one clear row/column, and no neighbouring-cell artwork. Keep
frame spacing zero between these padded fixed-size cells. Do not trim sheets.
Pixel-edit at native size; nearest-neighbour display only. Prefer clean one-pixel
outlines, two/three shade clusters, and consistent hair/skin/cardigan palette
ramps from the canonical Mara reference. This pass fixes placement, not every
generated face/cluster inconsistency. No normal expression may intentionally
change her jaw, clip side or costume; such changes belong in anomaly sheets.

## Authored map data

Each map has a walkable floor polygon, objects, spawn, named NPC anchors, doors
and approach points. Each object has a template type, collision definition,
visual bounds, ground/depth point, optional occlusion polygon, attachments and
an explicit interaction or null. Types include CHARACTER, CHAIR, TABLE_SMALL,
TABLE_LARGE, BED, SOFA, DOOR, COUNTER, WALL, NPC_INTERACTION and ITEM_PICKUP.
Template dimensions are starting standards; room instances have reviewed shapes.

Interactions use clear-floor approach anchors and a separate radius. A line-of-
sight test prevents reaching through furniture/walls. Doors have their own
source approach and reciprocal destination entry. `map.walls` and old prop
rectangles are compatibility/presentation data, **not physics**.

Depth uses ground points, never bitmap dimensions. Authored foreground masks
repaint the relevant portion of the room after actors behind the object. The
masks are manually specified, never alpha-generated. A seated actor is attached
to `sitAnchor` and drawn just above its parent's ground layer, so its chair back
does not erase it; tables in front still occlude it. This does not move its feet.
`lieAnchor` is specified for beds, but a proper lying animation is not available;
the workshop explicitly reports that rather than rotating/stretching a stand pose.

Mallow Street demonstrates art fitting: `src/street-art.js` cuts reviewed source
pieces and fits them to the existing authored geometry. Collision is unchanged
by the source image. The composition is cached once, not rebuilt each frame.

## Production pipeline

1. Author geometry, output cell dimensions, foot landmark and required attachments.
2. Create/generate art for that template; keep the original source in Git.
3. Pixel-edit/fix/crop artwork to the template without changing gameplay positions.
4. Review every frame in the actual renderer, in front of and behind furniture.
5. Run `npm run audit:assets`, review its report, then `npm run check`.
6. Commit masters, runtime exports, metadata, prompt and QA captures together.

The 14 active fixed-grid character masters now live in
`assets/production/characters/` as lossless WebPs. They are pixel-editable images,
not procedural character definitions. `npm run art:web` copies those sheets
unchanged: **there is no alpha-box repacker in the production build anymore**.
Large generated PNGs remain under `assets/characters/` as reference/archive, not
ready-to-import frame templates. Legacy exports remain versioned for comparison.
New source art must be deliberately fitted and approved; do not restore the old
silhouette-normalizing importer. Scene exports still use the older downsampling
process, which remains an artistic quality limitation.

`assets/web/integrity.json` binds approved runtime hashes and sprite specs.
CI rejects art/anchor changes that bypass review. The read-only Pillow audit
checks dimensions, frame edges, empty frames and sole/baseline proximity; it
inventories all image files. Its alpha inspection is QA only and is never used
to author physics or placement. Hashes prove integrity, not artistic quality.

## Debugging and acceptance

- F2: collision overlay. Red solids, yellow interactions, cyan actor feet,
  purple depth/foreground, green floor, blue spawns, orange attachments.
- F3: cycle every Mara pose at the same world coordinate. F4: walk-frame step.
- F5: release attachment/pose audit. F6: Alex/Mara avatar in the workshop.
- `?qa=geometrylab&clean=1`: chair, table, sofa, bed, door, counter, wall.
- `?qa=geometrylab&clean=1&pose=all`: live-rendered pose comparison.
- `?qa=cafe&clean=1&debug=geometry&mark=middleTable&side=behind`: depth test.
- `?qa=bedroom&clean=1&debug=geometry&near=desk`: explicit approach fixture.

Debug overlays pause the ordinary clock/random events. QA fixtures do not
overwrite normal autosaves. Explicit manual saves remain explicit user actions.
Old saves migrate from the former centre-offset position to feet coordinates;
blocked positions recover to the authored room spawn without rewriting the
original stored save. Snapshot labels/versioning remain backward compatible.

Automated acceptance checks all approach paths by moving the real body solver,
all day/weekend NPC positions, door destinations, actor overlap handling,
out-of-room shapes, missing anchors, frame contracts and saved-position recovery.
Visual acceptance remains separate. Review changed rooms again whenever either
art or geometry changes. Do not claim that passing tests proves pixel-perfect art.
