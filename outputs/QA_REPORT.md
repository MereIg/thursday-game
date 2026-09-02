# THURSDAY — QA Report

Test date: 2 September 2026

## Result

The five-day opening has been exercised in the actual browser build, including its real input, rendering, state transitions, save data, dialogue, side activities, stalking sequence, investigation and chapter handoff. The current build completes without console errors.

This is a tested vertical slice and expansion architecture, not a claim that the full-length game described in the design bible is already content-complete.

## Automated checks

`npm run check` currently verifies:

- JavaScript syntax for the game and adaptive audio engine.
- All 16 maps are connected to the playable world graph.
- Every map exit points to an existing map and valid destination.
- Every scheduled character references existing characters and maps.
- Every prop action has a game implementation.
- Every interaction has a collision-free position from which it can be used.
- Map prop identifiers are unique.
- Rare events reference existing locations.
- All seven characters have complete sprite-art configuration.
- The Game class contains no accidentally duplicated methods.
- Opening content pools meet the expected minimum sizes.

Current validation result:

> Validated 16 maps, 7 characters, 10 rare events, and 11 items.

## Browser playtesting completed

- New game and opening dialogue.
- Clean Monday sleep into Tuesday.
- Daily message delivery.
- Keyboard, mouse and click-to-move controls.
- Dialogue typing, choices and relationship effects.
- Mara's first meeting and introduction using only the name Mara.
- Revised character-specific dialogue voices across the full cast.
- Authored horn and tail slips during Mara's late-jealousy replies, including frame-timed screenshot inspection.
- Character-specific text cadence, punctuation rests and quiet per-character voice blips.
- Pause navigation.
- Manual save, return to title and Continue round-trip.
- Phone thread rendering.
- Late-night Mara call activation.
- Shop and currency handling.
- STARLANCE minigame, scoring and reward path.
- Music-room timing minigame architecture.
- Stalking sequence start, distance meter and failure route.
- Stalking success route and an empty annex when Mara genuinely fails to notice Alex.
- Cardboard-box evidence interaction.
- Photograph evidence interaction.
- Red-door confrontation.
- Opening-chapter completion summary and return to Friday exploration.
- Direct smoke load of every map: bedroom, landing, street, High Street, courtyard, hall, classroom, cafeteria, library, music room, café, arcade, park, station, archive corridor and annex.

No browser warnings or errors were produced during the final map sweep.

## Performance sample

The game contains a built-in hidden frame sampler used by the QA route. In the populated café scene with rain-state logic, several characters, motif infection and adaptive Web Audio active, the measured result was:

- 174.2 displayed frames per second in the test environment after the full raster-asset pass.
- 6.9 ms slowest sampled frame.

The game is designed for 60 FPS and uses a fixed-step simulation. It has no framework runtime, downloaded art, physics engine or large texture atlas. Device-specific results will vary, but the measured frame cost has substantial headroom.

## Defects found and corrected during hands-on QA

- Quick taps could be discarded on frames where rendering occurred without a fixed simulation update. Input is now buffered until an update consumes it.
- Dialogue portraits were drawn beneath an almost opaque dialogue panel. Portrait composition is now visible and intentionally framed.
- Several interaction zones were inaccessible behind collision geometry.
- A front-door prop had data but no action handler.
- Friday sleep could repeatedly duplicate Friday's messages.
- The arcade charged the player only when they won.
- Meeting Mara first at the quiet lunch table did not register the introduction or contact.
- Meeting Mara after Tuesday could skip her actual introduction.
- June and Theo could invite Alex on dates that had no playable continuation.
- Successful and failed stalking routes did not differ enough inside the annex. Mara is now absent after genuine success and present after detection.
- Desktop mouse controls were described but movement required the keyboard. Click-to-move and prompt interaction are now implemented.
- Character depth order was fixed so lower characters render in front.
- The initial dialogue pass gave too many characters the same polished setup–punchline rhythm. Their scenes now use distinct sentence structure, vocabulary, hesitation and humour.
- Random portrait corruption made Mara's nonhuman tells feel like a generic state effect. Horn, tail and wrong-shadow frames are now tied to a few authored lines and last roughly one tenth of a second.

## Art and animation pass

The original placeholder-like figures were replaced with a directional pixel-sprite system featuring:

- Unique silhouettes and palettes for the entire cast.
- Distinct hair designs for Mara, Iris, June, Theo, Ren, Nia and Sam.
- Character-specific accessories including Iris's camera, June's earrings, Theo's hood, Ren's glasses, Nia's pin and Sam's apron.
- Four-step player walking animation.
- Directional faces and hair.
- Idle blinking.
- Clothing highlights, shadows, collars, legs and shoe movement.
- Y-axis depth sorting.
- A separate portrait composition for dialogue and choices.
- Three scarce, line-authored nonhuman overlays that leave Mara's ordinary happy portrait intact.
- Raster walk sheets for Alex and Mara, directional sprites for all six supporting characters, and seven production dialogue portrait identities/expressions.
- Material, furniture/evidence, and outdoor/architecture atlases committed with the game rather than hotlinked.
- Visual collision geometry separated from rendered furniture and exits reduced to proximity highlights.

The animation stays deliberately economical in the tradition of top-down pixel RPGs: readable timing and character silhouettes instead of expensive skeletal animation.

## Remaining scope

The included game is the substantial opening requested in the original development approach. The complete multi-chapter story, all 18 planned endings, full town expansion and final soundtrack production remain future content work built on these systems. The runtime score is original and adaptive, but a commercial-scale release would still benefit from recorded or carefully rendered final instruments alongside the current composition logic.
