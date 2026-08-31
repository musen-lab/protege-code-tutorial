# Improvement round 1 completion report

Work order: `handoff-tutorial-improvement-round-2026-08-31.md`

Implementation date: 2026-08-31

Tutorial baseline: `protegeproject/protege@d9c9d392f9d88b5c4dc49a109009e9c460b6fb2b`

Visual baseline: tutorial commit `d24f8c2`

## Product decisions and source corrections

- Quizzes are optional diagnostics. They do not count toward course completion,
  do not create required-unit ids, and do not save responses. This preserves a
  clear completion contract: course progress records explicit engagement with
  the lesson itself, while retrieval practice remains available without
  coercion.
- Progress remains `inside-protege-progress-v2`. Foundation sections change
  only the required-unit catalogue, not the stored shape or meaning. Existing
  completed ids remain valid and unknown ids are already ignored by summary
  calculations, so a v3 migration would add risk without preserving any
  additional state. Progress tests cover both catalogue changes and v1-to-v2
  migration behavior.
- The work order describes a 31-question bank, but the read-only bank actually
  contained 38 questions when implemented. All 38 were retained: 6 for Lesson
  1, 9 for Lesson 2, 8 for Lesson 3, a 6-question Block 1 recap, and 9 for
  Lesson 4. Two cold retests were folded into the relevant lesson diagnostics.
- One quiz premise claimed eight active built-in tabs. Pinned source contains
  seven active `OWLWorkspaceViewsTab` declarations at
  `protege-editor-owl/src/main/resources/plugin.xml:309-385`; the eighth
  occurrence at lines 1540-1550 is commented out. The question now teaches
  that correction instead of repeating the premise.
- The OWL API companion's absolute warning about raw ontology-manager changes
  was narrowed. At this pin, underlying-manager changes still reach registered
  listeners and history handling, while the `OWLModelManager` facade adds
  application policy such as rewrite and minimization. The course keeps the
  facade as the safe plugin boundary without claiming behavior the source
  contradicts.

## Work-order disposition

| Item | Status | Implementation |
| --- | --- | --- |
| WO-1: section depth marker | Done | Added `foundation` and `core` depth semantics, collapsed foundation sections with explicit skip guidance, excluded foundation material from `requiredUnitIds`, preserved all existing unit ids, and kept progress storage on v2. Added progress and rendered-HTML regression coverage. |
| WO-2: quiz feature | Done | Added a separate, append-friendly quiz data module and a semantic native-details UI. All 38 available questions render after Lessons 1-4, including the Block 1 recap, concealed answers, synthesis and distractor markers, and exact pinned-source links. Quiz responses are not saved and do not affect completion. Desktop Chrome and iPhone 12 WebKit layouts were inspected in production mode. |
| WO-3: Lesson 1 problem-first reordering | Done | Lesson 1 now opens with the unknown-panel problem and the familiar Annotations view, then introduces modules. It distinguishes catalogue offers from later construction, includes verified 186/1,898/51/5 counts, contrasts `point` and `class`, records the 0-versus-516 import direction, and adds the `OWLRendererPreferences` string-boundary leak. |
| WO-4: Lesson 2 mechanism-first rework | Done | Lesson 2 now begins with the flat-classpath failure and bundle classloaders, shows a provenance-recorded `protege-common` manifest, teaches needs/offers and version ranges, then presents the five literal startup blocks with causal sequencing. It adds boot delegation, per-user plugin search, the resolver failure rule, and the file-log diagnostic path. |
| WO-5: OSGi and Swing from-zero tracks | Done | Added optional foundation tracks for OSGi and Swing/EDT. The OSGi track covers the shared-classpath failure, per-bundle loaders, needs/offers, and the distinction between OSGi and plugin APIs. The Swing track covers the single event loop and queue, producers and consumer, and one t1-t5 `invokeLater` timeline with the requested three takeaways. |
| WO-6: precise fixes | Done | Added the `point` versus `class` contrast and checkpoint; the Lesson 4 namespace-versus-class callout and checkpoint; the verified CORBA packaging mismatch as an open diagnostic; false-positive-resistant source searches; corrected the factory handoff diagram; and added the JDK 21 AutoValue snapshot warning without claiming a root cause. |
| WO-7: runnable OWL API companion | Done | Linked Matthew Horridge's tutorial at fixed commit `1953d8f93da9efee147ade7dba4f763b033ac91f` from the OWL API primer and Lesson 9. Added its provided-scope rationale, linked runnable change practice, and reconciled its undo guidance with the pinned Protégé source. |

## Source and documentation controls

- Every new Protégé claim, count, relationship, and answer link was checked
  with `git show`, `git grep`, or `git cat-file` against `SOURCE_COMMIT` in the
  read-only source clone.
- The generated manifest teaching artifact is stored at
  `docs/source-artifacts/protege-common-manifest.txt` with provenance back to
  `protege-common/pom.xml:43-57`.
- `docs/HANDBOOK-AUDIT.md` records each restored handbook topic, the two quiz
  premise corrections, and the deliberate source nuance around OWL API change
  handling.
- `AGENTS.md` now states the foundation-section and optional-diagnostic
  contribution rules. README installation and usage did not change, so no
  README update was necessary.

## Validation and evidence

- `npm run lint`: pass.
- `npm test`: pass, 28 tests, including v1 migration, v2 catalogue survival,
  foundation exclusion, all 38 rendered questions, no v3 key, source-linked
  answers, and the corrected tab premise.
- `git diff --check`: pass.
- Production build and server: `npm run build`, followed by a fresh
  `npm run start -- --port 3101` after the build.
- Visual evidence: `docs/evidence/2026-08-31/README.md`, with matched before
  and after captures at 1440 by 1000 desktop and iPhone 12 WebKit.

## Commits

- `662b8f1 Restore lint compatibility`
- `a4c6759 Add optional foundation lesson depth`
- `320ea4a Teach runtime foundations before startup flow`
- `71ddd9c Apply source-backed teaching corrections`
- `115f988 Link the runnable OWL API companion`
- `e78b742 Add optional source-backed lesson diagnostics`

## Consciously left out

- Runnable-probe course restructuring, findings for Lessons 5-10, heavy-section
  splitting, dark mode, and the catalog-subsystem walkthrough remain out of
  scope exactly as directed.
- No quiz answer persistence, scoring, required engagement, or progress-key
  migration was added.
- No source-repository defect was changed. The CORBA and AutoValue findings are
  teaching examples only.
- No manual deployment was performed. Pushing `main` remains the repository's
  established Vercel deployment trigger.
