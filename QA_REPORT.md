# MARA — foundation v3 QA

Test date: 2 September 2026. This report supersedes the earlier five-day report. Local browser play-testing was performed against the actual build; screenshots are not mockups.

## Automated checks

`npm run check` passes JavaScript syntax, sixteen-map connectivity and interaction reachability, seven-character schedules, ten event references and eleven items. It also runs twelve logic regressions:

1. Every image referenced by the active runtime exists.
2. Three manual slots remain independent from autosave.
3. Continue resumes a newer autosave (slot zero).
4. Legacy migration retains the original save and cannot overwrite slot one.
5. Invalid settings values cannot poison text speed or volume controls.
6. Days five through twelve advance without an early chapter ending.
7. Weekend schedule destinations and time ranges are valid.
8. Ambient dialogue has branches and respects the evening-only gate.
9. Following silence/resume is scheduled once, not once per frame.
10. Settings and save-slot panels accept pointer input.
11. Instant text reveals the line without a simultaneous voice burst.
12. The annex finale is unavailable before day twelve.

These use a headless DOM/audio mock for game logic. They do not prove visual quality, audio quality or every narrative route.

`npm run art:web` completes: 50 runtime WebPs, 5,903,844 bytes (5.63 MiB), including retained legacy files. New PNG masters total 23 files / approximately 41 MiB and are not part of the Pages download. `git diff --check` passes.

## Browser checks

- Ordinary title renders the authored bedroom image and functioning menu targets.
- Settings opened from the title; text speed changed through the pointer UI.
- Manual save/load panels show three distinct slots, not three labels for the same save. A day-six bedroom state was saved through the UI into slot three, survived page reload, appeared under Load and resumed into the bedroom.
- Mara's new portrait sheets, readable dialogue choices, reveal effects and full-body mug pose rendered in the café.
- Supporting cast's replacement square portrait rendered correctly.
- New seminar room and archive annex backgrounds rendered after image decode.
- Following scene displayed the new walk sheet, cover/noise indicators and route branch.
- 390×844 viewport: controls are below the scene, not over the portrait/dialogue. The text remains too small in portrait orientation; this is an acknowledged mobile usability gap.
- Development-console warning/error sampling returned no entries during the inspected scenes.
- One desktop sample reported 239.8 FPS / 4.3 ms worst frame while in the save panel. This is host-specific, not a low-end device performance guarantee.

## Defects found and fixed

- Continue used a falsy fallback for slot zero, incorrectly ignoring autosave.
- Following repeatedly restarted its silence/music transition after Mara's stop interval.
- Oversized portrait-mode touch controls covered the game; moved below it and added Menu.
- Title/pause/settings/slot actions needed proper pointer hit targets; added them.
- Phone lacked pointer contact selection/reply/close targets; added them.
- Instant text could schedule many bleeps at once; it now bypasses bleep scheduling.
- Evening-only ambient dialogue could play in the morning; added a time condition.
- A generated prop retained visible checkerboard background; atlas cleanup corrected.
- Two café tables allowed the player to pass through their visible surfaces; added blockers.
- Reduced-flash mode now suppresses authored horn/tail/shadow glimpses as well as the one-frame campus portrait.

## Screenshot evidence

Latest real browser captures: `outputs/screenshots/foundation-v3/`. Old galleries remain untouched for comparison. Normal QA entry points include `?qa=cafe&day=6&time=700&near=booth`, `?qa=classroom&day=4&clean=1`, `?qa=annex&day=12&time=1200`, and `?qa=follow`. QA modes are explicit test fixtures, not evidence that every intervening story branch was completed by hand.

## Not verified / not finished

No physical phone or low-powered laptop was available. No network-throttled decode test or whole twelve-day manual playthrough was completed. The score has not received a final headphone/loudness/listening acceptance pass; new bleeps and volume routing are implemented, but the soundtrack is still synthesized rather than final rendered stems. Several room collision/prop anchors and foreground occlusion still disagree with their background art. Mara's generated sheets need further face/cluster consistency editing, and most action poses are not multi-frame animations. The twelve-day calendar lacks final content density. Later chapters/endings, rich supporting expression libraries, remapping, non-fiction content warnings and fully unified/mobile-readable UI remain open in `DEVELOPMENT_STATUS.md`.
