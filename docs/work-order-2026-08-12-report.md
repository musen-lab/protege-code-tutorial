# Work order completion report, 2026-08-12

Source baseline: `protegeproject/protege@d9c9d392f9d88b5c4dc49a109009e9c460b6fb2b`

Review snapshot: application commit `4361b76` plus this report update. The six
original work-order items are followed by the learner-experience improvements
implemented during maintainer review. The source baseline has not changed.

## Original work order

| Item | Status | What was done | Reason for anything partial or skipped |
| --- | --- | --- | --- |
| 1. Hands-on plugin authoring | Done | Added Lesson 9, **Build a view plugin**, and the buildable `exercises/minimal-view-plugin` Maven project. The lesson covers the complete view lifecycle and `plugin.xml`, bundle POM and BND instructions, generated-manifest inspection, the released existentialquery 2.0.0 `[4.1,5)` manifest, Cellfie embed-versus-import behavior, duplicate host API class identity, and the negation, optional-resolution, split-registry, ordering, and wildcard vocabulary. External examples are fixed to releases or commits and their provenance is recorded. | The exercise was built and its JAR and generated manifest were inspected. Installing it into a separately downloaded Protégé GUI and manually opening the view was not automated; the learner exercise gives the exact installation and observation steps. |
| 2. Fast development loops | Done | Expanded Lesson 7 with three distinct loops: `mvn -Pide package` plus an IDE OSGi launch, a standalone plugin JAR copied to the installation or per-user plugins directory, and the full `mvn -Prelease clean package` distribution loop. The IDE profile, module opt-in, plugin search paths, and assembly behavior cite exact pinned lines. | None. |
| 3. Frames and OWLFrameList | Done | Added Lesson 10, **Edit through frames**, without renumbering the original eight lessons. It explains frame, section, row, and object-editor roles; generic parameters; `OWLFrameList` dialog flow; concrete SubClass Of add and edit paths; `OWLDataFactory`; annotation preservation; inferred-row behavior; and model-manager application. Two deterministic diagrams answer the class-anatomy and add-sequence questions, and a sibling-editor tracing exercise transfers the pattern. | None. |
| 4. Field Notebook upgrades | Done | Expanded all 24 first-party extension points from ids into one-line purpose cards with exact declaration links. Added a “start with these four” guide, links to every available `.exsd`, explicit markers for the four OWL points without schemas in this snapshot, and the developer wiki and protege-dev support links named by the pinned project README. | None. The missing four `.exsd` files are reported as absent rather than invented. |
| 5. Honest Practice and progress semantics | Done within the requested scope | Replaced “Predict or reproduce the flow yourself” with copy that distinguishes universal understanding checks from guided field exercises in selected lessons. Updated README usage language to say that current storage is a resume position, not completion. Added `docs/progress-model-proposal.md` with a proposed completion criterion, `inside-protege-progress-v1` to v2 migration, storage schema, UI changes, rollout checks, and explicit decision points. | The completion-based tracking model was deliberately not implemented, as the work order reserves that product decision for the maintainer. The runtime remains on `inside-protege-progress-v1`. |
| 6. Small factual additions | Done | Added the source-accurate `editorKitId="any"` rule, including the nuance that it is the default authoring choice rather than an omission default; explained historical `…PluginJPFImpl` names through their live Equinox `IExtension` imports; added the log-and-detach behavior for failing coarse model listeners; and tied the handbook's reflection/BND warning to Protégé's `Class.forName` and `UIManager` classloader handoff. | None. |

## Additional work completed during maintainer review

| Addition | Status | What was done | Review evidence |
| --- | --- | --- | --- |
| Technology orientation | Done | Added nine reusable primers for OSGi, Felix, the Equinox extension registry, OWL, OWL API, Swing and the EDT, bnd, PDE and m2e, and SAX and JAXB. Each primer explains the general technology before its Protégé-specific role, links to official documentation in a new tab, and cites exact pinned Protégé source. Primers appear at first important use and in the Field Notebook. | Commit `221dce2`; `app/lib/technologies.ts`, `docs/terminology-audit-2026-08-12.md`, and the before-and-after captures in `docs/terminology-search-branding-2026-08-12.md`. |
| Course-wide search | Done | Added a server-rendered `/search` route and ordinary GET form. The index covers lesson overviews and sections, diagrams, source cutaways, exercises, technology primers, Atlas lenses, and Field Notebook landmarks. Search works without client-side routing, normalizes case and accents, requires every query token to match, ranks title and context matches first, and caps results at 60. | Commit `3c46f72`; tests exercise empty, matching, and missing-result states and inspect the implementation for browser-native form behavior. |
| Learner-facing terminology and brand hierarchy | Done | Replaced learner-facing “Journey” with “Lesson,” retained `/journeys/...` as a stable legacy route, made “Protégé Code Tutorial” the product label, and retained “Inside Protégé” as the course name. Updated metadata, navigation, resume/restart language, curriculum, glossary, README, audit, and tests consistently. | Commit `464716f`; desktop, mobile, and first-primer comparisons are recorded in `docs/terminology-search-branding-2026-08-12.md`. |
| Official Protégé identity | Done | Replaced the provisional drawn mark with the official icon-only Protégé SVG from `protege.stanford.edu`, paired it with the wordmark and **Code Tutorial** suffix, recorded its provenance, and added a hash assertion so the official asset is not silently redrawn. | Commit `e60ca46`; provenance is in `RESOURCES.md`; desktop and mobile captures are indexed by `docs/screenshots/README.md`. |
| Search as a separate utility | Done | Moved search out of the primary menu. The approved hybrid treatment uses a 16px magnifier in a subtle 34px circle, a 44px interaction target, and a wider gap before the Course menu item. The native `/search` link has an explicit accessible name and fits the second mobile header row. | Commit `50fd3e9`; the measured comparison and reproduction steps are in `docs/search-utility-2026-08-12.md`. |
| Cross-browser favicon support | Done | Added a conventional ICO containing 16, 32, and 48px versions derived from the official SVG, retained the SVG alternative, and versioned both URLs to bypass stale favicon caches. Production inspection verified all emitted link elements and successful responses with the expected content types. | Commit `25ac9d8`; rendered tests verify link metadata, ICO dimensions, and the exact binary hash. |
| Homepage course promise | Done | Changed the ambiguous “Learn Protégé” headline to “Learn the Protégé codebase, one lesson at a time.” Added the outcome of building enough mental model to navigate, debug, and extend Protégé, then reduced the desktop headline size to preserve a balanced hero. | Commit `4361b76`; the final production page was inspected at 1280 by 800 and 390 by 844, and rendered tests assert both statements. |

## Validation

- Every new Protégé claim, cutaway, relationship, and source trail was checked at the source baseline above. Real external artifacts use fixed commit or release URLs; the released existentialquery manifest has a recorded SHA-256.
- `docs/HANDBOOK-AUDIT.md` contains a disposition for every restored handbook topic.
- `npm run lint && npm test` passes; `npm test` creates a fresh production build and all 11 rendered-HTML tests pass.
- `mvn clean package` passes in `exercises/minimal-view-plugin`; the generated JAR contains root `plugin.xml` and a BND-generated OSGi manifest with the expected singleton and import headers.
- Maven 3 reports that the latest Maven 4 beta resource, install, and deploy plugins are incompatible, selects compatible Maven 3 releases, and completes successfully. These warnings do not affect the generated exercise bundle.
- Production pages were inspected with `npm run build && npm run start` at desktop and mobile widths. The diagrams, source cutaways, extension-point cards, long ids, technology primers, search page, header, logo, favicon metadata, and revised hero remain contained and usable. Code cutaways scroll internally on mobile.
- The original work order was implemented in six application commits ending at `b1acd58`, then documented in `cd4f834`. Seven additional application commits, `221dce2` through `4361b76`, record the review-driven work above. This report update is documentation only.
- Changes were committed directly to `main`. No remote was added, nothing was pushed or published, and the final worktree was checked clean after each completed change.

## Reviewer orientation

Start with these surfaces:

1. `/`: the ordered ten-lesson trailhead, course promise, resume and restart behavior, official branding, and separate search utility.
2. `/lessons/landscape`: the first lesson and first-use technology primers. (The `journeys` URL segment was retained at review time; the maintainer later approved renaming it to `lessons` before publication.)
3. `/search?q=OSGi`: server-rendered search across course and reference content.
4. `/lessons/build-plugin`: the complete plugin vertical slice and links to the buildable exercise.
5. `/lessons/edit-through-frames`: frame-based ontology editing, including class and add-sequence diagrams.
6. `/reference`: the technology index, Java compatibility notes, class landmarks, all 24 first-party extension points, and source-navigation recipes.

Important implementation boundaries:

- Protégé facts are pinned to `SOURCE_COMMIT`; official technology links are living references and may advance independently.
- Search is a build-time in-memory index over authored course data, not a crawler or external search service.
- Progress remains a device-local last-position bookmark under `inside-protege-progress-v1`; it is not course-completion tracking.
- Final typography and visual checks require `npm run build && npm run start`. The current Vinext development server falls back to system fonts.
- Browser-native anchors and the GET search form are deliberate no-JavaScript fallbacks.

Recommended review commands:

```bash
npm ci
npm run lint && npm test
npm run start
```

For the plugin exercise:

```bash
cd exercises/minimal-view-plugin
mvn clean package
jar tf target/protege-minimal-view-1.0.0.jar
unzip -p target/protege-minimal-view-1.0.0.jar META-INF/MANIFEST.MF
```

## Consciously left out

- Completion-based progress tracking and its v2 storage migration. Only the requested proposal was created.
- Automated GUI installation and observation of the example plugin in a separately downloaded Protégé distribution. Build, packaging, manifest, and learner runtime instructions are present and verified.
- Additional hands-on implementations for the other 23 extension points. The Field Notebook gives their sourced purposes and contracts; Lesson 9 intentionally teaches one complete vertical slice.
- Fuzzy search, stemming, result highlighting, and a remote search service. The current deterministic local index is intentionally small and browser-native.
- Renaming the legacy `/journeys/...` route. Learner-facing language is “Lesson,” but changing bookmarked URLs was not necessary for clarity. (Superseded later on 2026-08-12: with the site still unpublished, the maintainer approved the rename, and the route is now `/lessons/...`.)
- Any remote repository, branch, pull request, site publication, or access-control change. Those actions were outside the authorized local-only scope.
