# Second evaluation, 2026-08-12

Scope: the work recorded in `docs/work-order-2026-08-12-report.md` (commits
`98a8c37` through `6ed0db0`), reviewed against the pinned Protégé snapshot
`d9c9d392f9d88b5c4dc49a109009e9c460b6fb2b`, the local Protégé clone, and the
production build in a browser at desktop and mobile widths.

## Verdict

The round-1 depth criticism is substantially resolved. The course now teaches
a complete plugin-authoring vertical slice with a buildable exercise, the
three development loops, and the frames editing idiom, and the extras
(search, technology primers, branding, honest Practice copy) hold up under
inspection. No factual error was found in any newly added claim.

## What was verified

- `npm run lint` clean; all 11 rendered-HTML tests pass on a fresh build.
- Lesson 10 (frames): all 21 source references land on the claimed
  constructs; the add-path, `OWLDataFactory`, annotation-preservation,
  inferred-row, and single-change-list claims are exact against source.
- Lesson 9 and Lesson 7 key references (ide profile `pom.xml:565`, plugin
  search paths `config.xml:48`, package-phase assembly, BND vocabulary at
  `protege-editor-core/pom.xml:104`) are exact.
- `exercises/minimal-view-plugin`: `mvn clean package` succeeds; the JAR has
  root `plugin.xml`, a singleton symbolic name, and `[5.6,6)` host imports;
  the extension-point id matches editor-core's declaration at the pinned
  commit.
- The recorded existentialquery SHA-256 reproduces byte-for-byte from the
  released JAR; the `[4.1,5)` version-range claim matches its real manifest.
- All 24 extension-point declaration links, the four-missing-`.exsd` claim,
  and the technology primers check out.
- Report-vs-reality: cited commits, docs, logo/favicon hash assertions, and
  search behavior claims all hold. No learner-facing "Journey" remains.
- Mobile at a real 375 px viewport: no horizontal overflow (a clipped
  headless screenshot during review was a capture artifact, not a bug).

## Fixed during this review

- The completion report's reviewer-orientation URLs pointed at nonexistent
  slugs (`/journeys/plugin-authoring`, `/journeys/frames`); corrected to
  `/journeys/build-plugin` and `/journeys/edit-through-frames`.
- `docs/source-artifacts/existentialquery-2.0.0-manifest.txt` now discloses
  that it is an excerpt and that the SHA-256 refers to the complete JAR.

## Follow-up items (none blocking)

Resolution note, later the same day: items 1 through 7 below were fixed and
validated (lint clean, 11/11 rendered-HTML tests) in the commits following
this document. Only item 8 (optional internal rename) and item 9 (the
progress-model product decision) remain open.

1. **Undisclosed snippet condensations in Lesson 10** (`app/lib/course.ts`).
   Content is faithful, but three cutaways silently drop code: the
   `OWLFrameSection` interface snippet omits about seven members; the
   `AbstractOWLFrameSectionRow.handleEditingFinished` snippet omits the
   guards and the null-ontology else branch (which applies a single
   `AddAxiom` instead of remove+add); the section-level
   `handleEditingFinished` snippet omits the `strategySelector`
   construction. Add one disclosure line to each `focus` text, as the
   `applyChanges` cutaway already does.
2. **Off-by-a-few-lines citation anchors in `app/lib/technologies.ts`**:
   `config.xml:23` and `:29` point one line above the payload;
   `Activator.java:19` is one line below the `registerService` call;
   `OntologyLoader.java:89` is cited for IRI-mapper configuration that lives
   at lines 101-105. Also confirm the bnd introduction URL slug
   (`100-introduction` may have moved to `110-`).
3. **Lint scoping for `exercises/`**: `eslint.config.mjs` and
   `tsconfig.json` do not exclude `exercises/`; lint passes today only
   because the exercise contains no JS/TS. Add explicit ignores.
4. **Search page whitespace query**: `q=%20` renders a degenerate
   "0 results / Matches for ' '" state instead of the suggestions state.
5. **`aria-label="Technology primers"` on a plain `div`**
   (`app/components/TechnologyPrimer.tsx:6`) is not exposed without a role;
   either add a role or drop the label.
6. **`CURRICULUM.md` lists the primers as eight bullets** (OWL and OWL API
   combined) while nine exist; align the count.
7. **Optional wording hedge in Lesson 10**: "R is the frame's root object"
   is a simplification; the section root is `OWLClassExpression` and
   `AbstractOWLClassAxiomFrameSection.getRootObject()` can substitute an
   `AnonymousDefinedClassManager` expression for the frame root.
8. **Optional internal rename**: CSS classes `.journey-*` and the
   `JourneyPage` component keep the old vocabulary; harmless (the
   `/journeys/` URL segment is intentionally retained), a candidate for the
   next refactor that touches those files.
9. **Open product decision**: completion-based progress tracking
   (`docs/progress-model-proposal.md`) awaits the maintainer's call; the
   runtime remains on `inside-protege-progress-v1`.

Two exhaustive reference sweeps (the remaining lesson 7 and lesson 9
SourceRefs beyond the key ones listed above) were still in flight when this
document was written; the checked subset contained no errors, and external
Cellfie references are unverifiable locally by design (no pinned local clone).
