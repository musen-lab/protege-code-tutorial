# Completion-based progress proposal

Status: proposal only, not approved or implemented.

The current application stores the most recently visited journey and scroll
position under `inside-protege-progress-v1`. That makes Resume useful, but a
visit to a late journey can make the progress bar look like course completion.
This proposal separates reading position from demonstrated course progress.

## Completion criterion

Track stable section ids, not scroll percentage or route visits. A normal
reading section completes only when the learner activates **Mark section
complete**. A prediction checkpoint completes when its answer is revealed. A
field exercise completes only when the learner explicitly checks **I completed
this exercise**; the browser should not pretend to verify work performed in an
IDE or terminal. A journey completes when every required section, checkpoint,
and exercise in that journey is complete. Course completion is the number of
completed required units divided by the total number of required units.

The explicit action is intentionally modest evidence. It avoids awarding
credit for merely opening Journey 10, while remaining usable offline and
without accounts, telemetry, or server-side grading.

## Storage shape and v1 migration

Introduce `inside-protege-progress-v2` with an explicit schema version:

```json
{
  "version": 2,
  "lastPosition": {
    "number": 4,
    "path": "/journeys/screen",
    "scrollY": 1860,
    "slug": "screen",
    "title": "Build the screen",
    "updatedAt": "2026-08-12T20:00:00.000Z"
  },
  "completedUnitIds": ["screen:observe", "screen:trace"],
  "updatedAt": "2026-08-12T20:00:00.000Z"
}
```

On the first client read, prefer a valid v2 value. If none exists, parse v1
defensively and copy its valid fields into `lastPosition`; initialize
`completedUnitIds` to an empty array because a historical visit is not evidence
of completion. Write v2 before removing v1, and remove v1 only after that write
succeeds. If parsing or writing fails, preserve v1 and continue to offer the
existing resume destination. Ignore unknown unit ids so renamed or removed
sections cannot break the page. Add new required units as incomplete.

## UI changes

- Keep **Start**, **Resume**, and **Restart** actions. Resume uses
  `lastPosition`; it does not imply completion.
- Label the home-page bar **Course completion** and calculate it from required
  units. Show the saved resume destination separately.
- Add an accessible completion control to each required section. Checkpoints
  and exercises use their purpose-specific actions instead of a second generic
  checkbox.
- Mark completed sections and journeys in the table of contents, and announce
  changes through a polite live region without moving focus.
- Make Restart confirmation state that it clears both completion and the saved
  reading position.

## Decision and rollout

Before implementation, the maintainer should approve the completion criterion,
whether field exercises are required, and whether completion controls should be
reversible. Implementation should include unit tests for migration and corrupt
storage, rendered assertions for honest labels, keyboard and screen-reader QA,
and production checks at desktop and mobile widths. Until that decision, the
v1 data shape and visit-based bar remain unchanged.
