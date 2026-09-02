# MARA — geometry hardening v4 QA

Tested 2 September 2026 against the actual local build. Prior report retained in
docs/qa-foundation-v3.md. This is a geometry/placement pass, not acceptance of the
entire Chapter 1 production brief.

## Automated results

npm run check passes:

- 17 map definitions: 16 playable rooms and one QA workshop.
- 77 doors/interaction approaches connected to their room spawn.
- 9,995 incremental steps through those paths using the real foot-body solver.
- 6,257 NPC schedule positions over days 1–12, including weekends and Mara sightings.
- Missing/out-of-room geometry, invalid anchors, blocked entries and overlapping scheduled NPC anchors checked.
- 20 runtime regressions: prior save/calendar/phone/settings/following checks plus safe map transitions, old-position recovery without rewriting saves, QA autosave isolation, dialogue actor pinning, actual sprite draw anchors, furniture attachment depth, seated-date continuity and temporary-state cleanup.
- Large movement cannot tunnel through a wall. Walking into an NPC is blocked; an existing schedule overlap permits separating instead of trapping the player.
- 51 runtime image hashes and the shared sprite-anchor contract verified. Production masters must match their runtime copies.

npm run art:web publishes 14 fixed-grid character masters unchanged. The old
alpha-box fitting/centring importer was removed. Scene exports retain their prior
downsampling process.

npm run audit:assets inventories 120 image files and checks 68 overworld frames.
No empty frames, cell-edge clipping, missing sole pixels, excessive baseline
errors or dimension-contract violations were reported. Active portrait cell
dimensions and left/right edges are checked too. Source/archive inventory is NOT an assertion
that every old generated master is a valid future sprite template.

## Rendered checks and fixes

Every existing map's collision overlay was visually compared with its artwork:
bedroom, Rowan House, Mallow Street, High Street, entrance hall, east hall,
classroom, cafeteria, library, music room, café, arcade, park, station, archive
corridor and annex. Tests exposed and corrected:

- Old prototype blockers remaining under newly painted furniture.
- Character feet/shadows drawn 18–19 pixels below the movement coordinate.
- Objects never occluding actors in front/behind order.
- Table, chair, wardrobe, instrument, shelf, plant, rail and pond footprints missing or misplaced.
- Doors/interaction targets on unrelated artwork: the college fountain became its visible floor crest; the nonexistent café piano became its visible radio cabinet.
- Library spawn intersecting a foreground plant.
- House stair approach and foreground door needing their own placement.
- Park woodland needing a shaped navigation boundary rather than an unrestricted rectangle.
- Street art not matching the template: source pieces were explicitly fitted to existing geometry, not used to generate collision.
- A chair's foreground pass erasing its seated actor: seated children now render immediately above their parent's ground layer, while foreground tables still occlude them.
- Whole-body tremble/bob shifting shoes; only the upper-body tremble slice moves now.
- Poses normalized to the same height despite sitting/collapsing.
- Clicking unrelated lower-screen floor accidentally activating the nearby interaction prompt.

Actual browser input walked Alex from behind the café middle table, around it,
to the front. Both views are captured. The route ended on valid floor; it did not
cross the tabletop. Chair, sofa, counter and bed workshop interactions were
activated using E. Mara's café date was activated through the booth and remained
seated while the dialogue used different action cards. A live-renderer gallery
shows every Mara pose against foot guides; F4 frame stepping was also exercised.

Normal and altered artwork was inspected for the bedroom, college, café,
library and station. The changes do not require a different walking layout in
the current assets. Future moved furniture needs its own authored geometry variant.

## Evidence and limitations

A 390×844 viewport check measured a 390×219.375 canvas and a separate 180-pixel
control area below it. A tap inside the café table was rejected; a tap beyond it
routed Alex around the table from (364,320) to valid floor at (362,405). The
on-screen Menu button was tested. These are scaled browser pointer tests, not a
physical touchscreen certification. Portrait text is still too small; landscape
remains recommended. Three sampled scene consoles reported no warnings/errors.
Sampled frame telemetry was 237–240 fps on this host, not a low-end benchmark.
The 844×390 landscape viewport displayed the date and its portrait without
clipping. This desktop emulation does not reproduce a phone's coarse-pointer
hardware or GPU. The downloadable ZIP was extracted to a fresh temporary
directory and its complete npm run check passed independently.

Versioned module URLs keep the new renderer from mixing with cached old map data.

Current captures: outputs/screenshots/geometry/. The pose gallery is rendered
by the actual game sprite routine, not an image-generator mockup. QA URL fixtures
are explicit setups; they do not mean all intervening story routes were played.

The workshop intentionally uses technical fixture shapes, not finished world art.
A bed lieAnchor is drawn and tested as metadata; there is no approved lying sprite.
The workshop reports that missing animation rather than faking it.

Active character frame placement is technically approved, not final face/pixel
art quality. Most actions remain static poses. No complete twelve-day manual
multi-route run, physical-phone test, low-end benchmark, network-throttle test or
final soundtrack listening/loudness pass was completed in this hardening turn.
The broad Chapter 1 content brief remains open in DEVELOPMENT_STATUS.md.
