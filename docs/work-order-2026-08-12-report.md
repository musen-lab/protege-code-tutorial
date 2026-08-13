# Work order completion report, 2026-08-12

Source baseline: `protegeproject/protege@d9c9d392f9d88b5c4dc49a109009e9c460b6fb2b`

| Item | Status | What was done | Reason for anything partial or skipped |
| --- | --- | --- | --- |
| 1. Hands-on plugin authoring | Done | Added Journey 9, **Build a view plugin**, and the buildable `exercises/minimal-view-plugin` Maven project. The journey covers the complete view lifecycle and `plugin.xml`, bundle POM and BND instructions, generated-manifest inspection, the released existentialquery 2.0.0 `[4.1,5)` manifest, Cellfie embed-versus-import behavior, duplicate host API class identity, and the negation, optional-resolution, split-registry, ordering, and wildcard vocabulary. External examples are fixed to releases or commits and their provenance is recorded. | The exercise was built and its JAR and generated manifest were inspected. Installing it into a separately downloaded Protégé GUI and manually opening the view was not automated; the learner exercise gives the exact installation and observation steps. |
| 2. Fast development loops | Done | Expanded Journey 7 with three distinct loops: `mvn -Pide package` plus an IDE OSGi launch, a standalone plugin JAR copied to the installation or per-user plugins directory, and the full `mvn -Prelease clean package` distribution loop. The IDE profile, module opt-in, plugin search paths, and assembly behavior cite exact pinned lines. | None. |
| 3. Frames and OWLFrameList | Done | Added Journey 10, **Edit through frames**, without renumbering the original eight journeys. It explains frame, section, row, and object-editor roles; generic parameters; `OWLFrameList` dialog flow; concrete SubClass Of add and edit paths; `OWLDataFactory`; annotation preservation; inferred-row behavior; and model-manager application. Two deterministic diagrams answer the class-anatomy and add-sequence questions, and a sibling-editor tracing exercise transfers the pattern. | None. |
| 4. Field Notebook upgrades | Done | Expanded all 24 first-party extension points from ids into one-line purpose cards with exact declaration links. Added a “start with these four” guide, links to every available `.exsd`, explicit markers for the four OWL points without schemas in this snapshot, and the developer wiki and protege-dev support links named by the pinned project README. | None. The missing four `.exsd` files are reported as absent rather than invented. |
| 5. Honest Practice and progress semantics | Done within the requested scope | Replaced “Predict or reproduce the flow yourself” with copy that distinguishes universal understanding checks from guided field exercises in selected journeys. Updated README usage language to say that current storage is a resume position, not completion. Added `docs/progress-model-proposal.md` with a proposed completion criterion, `inside-protege-progress-v1` to v2 migration, storage schema, UI changes, rollout checks, and explicit decision points. | The completion-based tracking model was deliberately not implemented, as the work order reserves that product decision for the maintainer. The runtime remains on `inside-protege-progress-v1`. |
| 6. Small factual additions | Done | Added the source-accurate `editorKitId="any"` rule, including the nuance that it is the default authoring choice rather than an omission default; explained historical `…PluginJPFImpl` names through their live Equinox `IExtension` imports; added the log-and-detach behavior for failing coarse model listeners; and tied the handbook's reflection/BND warning to Protégé's `Class.forName` and `UIManager` classloader handoff. | None. |

## Validation

- Every new Protégé claim, cutaway, relationship, and source trail was checked at the source baseline above. Real external artifacts use fixed commit or release URLs; the released existentialquery manifest has a recorded SHA-256.
- `docs/HANDBOOK-AUDIT.md` contains a disposition for every restored handbook topic.
- `npm run lint && npm test` passes; `npm test` creates a fresh production build and all nine rendered-HTML tests pass.
- `mvn clean package` passes in `exercises/minimal-view-plugin`; the generated JAR contains root `plugin.xml` and a BND-generated OSGi manifest with the expected singleton and import headers.
- Production pages were inspected with `npm run build && npm run start` at desktop and mobile widths. The new diagrams, source cutaways, extension-point cards, and long ids remain contained; code cutaways scroll internally on mobile; browser error logs are empty.
- Changes were committed directly to `main` as six coherent commits. No remote was added, nothing was pushed or published, and the final worktree is clean.

## Consciously left out

- Completion-based progress tracking and its v2 storage migration. Only the requested proposal was created.
- Automated GUI installation and observation of the example plugin in a separately downloaded Protégé distribution. Build, packaging, manifest, and learner runtime instructions are present and verified.
- Additional hands-on implementations for the other 23 extension points. The Field Notebook gives their sourced purposes and contracts; Journey 9 intentionally teaches one complete vertical slice.
- Any remote repository, branch, pull request, site publication, or access-control change. Those actions were outside the authorized local-only scope.
