# Protégé Developer Handbook consistency audit

Audit date: 2026-08-12

Handbook reviewed: `Protege Developer Handbook 2026-08-11 (Matthew Horridge).html`

Tutorial source baseline: `protegeproject/protege@d9c9d392f9d88b5c4dc49a109009e9c460b6fb2b`

## Method

The handbook was converted to plain text and read in full. Its architectural, build, lifecycle, extension, and debugging claims were mapped to the ten course lessons, Architecture Atlas, and Field Notebook. Every disputed or potentially drift-prone claim was then checked in the pinned source, POM files, plugin declarations, assembly configuration, CI workflow, and fixed real-plugin artifacts.

## Findings and disposition

| Area | Result | Evidence and action |
| --- | --- | --- |
| Five module responsibilities | Aligned | The course and handbook assign bootstrap to launcher, XML service setup to common, domain-neutral UI and plugin contracts to editor-core, OWL behavior to editor-owl, and packaging to desktop. |
| Direct Maven dependency graph | Corrected | The Atlas previously drew a linear path that implied `editor-core` depends on `common`. POM inspection shows `editor-core -> launcher` and `common -> launcher`, with no core-to-common edge. The diagram now renders the full branching graph. |
| Java version | Corrected | “Java 11 is the ceiling” was misleading. Java 11 is the compilation target and bundled runtime. CI verifies JDK 11 and 21. The Field Notebook now distinguishes source target, build JDK, and runtime JDK. |
| Build commands | Expanded | The course now teaches the handbook's release command, `mvn -Prelease clean package`, and separately explains the CI matrix across default, ide, and release profiles on JDK 11 and 21. |
| Fast development loops | Restored in Lesson 7 | The course now distinguishes `mvn -Pide package` plus an IDE OSGi launch, a standalone plugin JAR copied to `plugins` or `~/.Protege/plugins`, and a full distribution build. The IDE profile behavior is tied to `pom.xml:565-650`; plugin search paths are tied to `protege-desktop/src/main/felix/conf/config.xml:48-51`. |
| Editor-kit ownership | Corrected | A linear class diagram implied `OWLModelManager` owns `OWLWorkspace`. Source shows both are final fields owned by `OWLEditorKit`. The diagram now shows separate ownership edges and the workspace-to-model accessor through the kit. |
| Selection ownership | Added | `OWLSelectionModel` is owned by `OWLWorkspace`. The central object graph and class landmarks now show it. |
| View accessor and lifecycle chain | Added to reference | `AbstractOWLViewComponent` is now a class landmark. The guided screen lesson already teaches view initialization and disposal. |
| Ontology change path | Aligned with source nuance | The course uses `OWLModelManager.applyChanges` as the application boundary, then traces rewrite, minimization, OWL API notification, history, dirty state, and UI reactions. The handbook's prohibition on direct manager calls is retained as a rule. The course also records the source-level nuance that direct OWL API calls still notify registered listeners, but skip facade policy. |
| Model-manager event type names | Aligned | The tutorial uses `OWLModelManagerListener` and `OWLModelManagerChangeEvent`, matching source and avoiding the nonexistent `OWLModelManagerChangeListener` name. |
| Extension discovery pipeline | Aligned and expanded | The course already covered Equinox metadata, filter, loader, wrapper, contributor bundle classloading, and initialization. It now also names the plugin JAR, manifest, Maven/BND, no-argument constructor, and lifecycle contracts. |
| `editorKitId` matching | Restored with source nuance | Lesson 6 now teaches `editorKitId="any"` as the normal authoring choice for editor-neutral contributions and a concrete kit id for specialized contributions. It also corrects a possible overreading of “default”: `EditorKitExtensionMatcher.java:12-19` explicitly matches `any` or the current id, while `PluginParameterExtensionMatcher.java:68-73` rejects a missing attribute. |
| `…PluginJPFImpl` names | Restored as source-reading guidance | Lesson 6 identifies the suffix as historical rather than a live runtime description. `ViewComponentPluginJPFImpl.java:3-4,35-63` imports and accepts Equinox `IExtension`; its loader constructs that wrapper from registry metadata. |
| Silent plugin failures | Corrected | The course previously covered only singleton metadata. It now also explains `ProtegeApplication.isPlugin`, which classifies only bundle locations containing `plugin`. A JAR under `bundles` may start but not be reported as a plugin. |
| Extension-point inventory | Expanded | The Field Notebook lists all 24 first-party points exactly: 12 from editor-core and 12 from editor-owl. It now adds a source-checked one-line purpose, a four-point starting guide, each available `.exsd` path, and an explicit marker for the four OWL points without schemas in this snapshot. Declarations are cited at `protege-editor-core/src/main/resources/plugin.xml:4-34` and `protege-editor-owl/src/main/resources/plugin.xml:6-31`; schemas are cited from each module's top-level `schema/` directory. |
| Developer wiki and protege-dev list | Restored as living references | The Field Notebook links the developer wiki and support page named by the pinned project `README.md:11-13`. They are labeled as living resources that may change after the source snapshot. |
| Logging and diagnostics | Corrected | The course previously led with the in-app log. It now leads with `~/.Protege/logs/protege.log`, which remains available when the UI cannot start, and treats the in-app view as a convenient second surface. |
| Listener failure isolation | Restored as a debugging lesson | Lesson 5 now shows `OWLModelManagerImpl.fireEvent` catching a listener failure, logging its class, and removing it from future coarse-event delivery at `OWLModelManagerImpl.java:188-209`. The tutorial tells learners to inspect the log when a view reacts once and then quietly stops. |
| OSGi and JPF history | Partially restored as foundation | Lesson 2 now restores the handbook's shared-classloader failure through Protégé 2.0 and the OSGi needs/offers remedy in an optional foundation track. Detailed JPF chronology remains secondary because it does not change the current Felix plus Equinox runtime model. |
| Optional depth and completion | Expanded | Foundation sections now open as collapsed one-click tracks and are excluded from the required-unit catalogue. Existing sections still default to core, existing unit ids are unchanged, and the saved progress record remains `inside-protege-progress-v2`. |
| Problem-first course opening | Reordered and grounded | Lesson 1 now begins with the unknown-panel problem and the familiar Classes-tab Annotations panel at `protege-editor-owl/src/main/resources/plugin.xml:431-438`. The module inventory remains intact as section 2. Counts were regenerated at the pin: 186 extensions in 1,898 lines, 51 ViewComponent offers, and 5 Classes-tab placements. |
| Compile-time boundary string leak | Added with source nuance | The 0-versus-516 import direction remains compiler-enforced for Java types. Lesson 1 now also records the literal `OWLRendererPreferences` bucket name at `ProtegeApplication.java:366-380` and the class-keyed OWL lookup at `OWLRendererPreferences.java:230`, where strings bypass the type boundary. |
| OSGi failure mechanism | Restored before startup workflow | Lesson 2 now begins with the shared-classpath conflict, separate bundle classloaders, needs/offers, and the actual generated `protege-common` manifest. The normalized manifest extract is provenance-recorded under `docs/source-artifacts/` and traces back to `protege-common/pom.xml:43-57`. |
| Five startup blocks | Expanded from real configuration | Lesson 2 now shows all five blocks from `protege-desktop/src/main/felix/conf/config.xml:23-51`, literal JAR names, search-path behavior, causal ordering, the per-user plugins path, and boot delegation at line 11. It states the resolver failure rule and leads diagnostics to the file log configured at `logback.xml:11-16`. |
| Swing event-loop background | Restored as optional foundation | Lesson 3 now explains the EDT as one event loop and one queue consumer. Its t1-t5 `invokeLater` table makes queue growth, immediate return, ordering, and EDT-safe execution explicit exactly once before the ontology-loading thread trace. |
| Extension attribute namespaces | Clarified | Lesson 1 contrasts `point=` as the host socket with `class value=` as contributed code and tests the distinction. Lesson 4 separately distinguishes fully qualified extension catalogue keys in `pluginId` from Java class names using `plugin.xml:441-444`, `viewconfig-classestab.xml:22-24`, and `ViewComponentFactory.java:33-37`. |
| Factory handoff wording | Corrected | The Lesson 3 diagram no longer says the URI-loading method unwraps a plugin. `ProtegeManager.java:191-193` performs that unwrapping in the caller overload; the method at lines 164-188 receives the `EditorKitFactory` directly. |
| CORBA packaging mismatch | Added as an open diagnostic | Lesson 7 now records that launch scripts name `glassfish-corba-orb.jar` and root dependency management declares it, while both platform assembly lists ship `glassfish-corba-omgapi` instead. The course explicitly leaves the runtime consequence open. |
| Boundary-search precision | Expanded | Lesson 8 records the verified 20-file false-positive result for a case-insensitive `owl` search under editor-core and teaches import-anchored, package-qualified searches instead. The pinned source still contains zero OWL or OWL API imports in core. |
| JDK 21 AutoValue snapshot issue | Added without causal overclaim | Lesson 9 warns that the pinned full host build was observed to miss 12 generated classes on JDK 21 with Maven 3.9.9. It records the twelve `@AutoValue` sources and the 1.6.5 processor versus 1.11.1 annotations at `pom.xml:291-303`, labels the root cause unknown, and gives JDK 11 as the observed working path. |
| External technology orientation | Expanded | The handbook and source use OSGi, Felix, Equinox, OWL API, Swing, PDE, m2e, and bnd as established vocabulary. The course now introduces each at its first important use, separates its general purpose from its specific Protégé role, and links both official documentation and exact pinned source evidence. The Field Notebook collects the same primers for lookup. |
| Compatibility library cautions | Intentionally secondary | Guava Optional, AutoValue, Swing threading, and mixed-era reflection are covered. Detailed JAXB and historical Equinox compatibility notes remain reference-level material because they do not change the stable architecture map. |
| Minimal plugin authoring | Restored as Lesson 9 | The handbook's class, `plugin.xml`, POM, build, copy, restart, and observe sequence is now a guided exercise. Java and extension metadata are traced to `protege-plugin-examples@d879601`; current build versions are isolated in the exercise POM and verified by a clean Maven build. |
| Generated manifest inspection | Restored as required evidence | Lesson 9 teaches `jar tf` and `unzip -p ... META-INF/MANIFEST.MF`. It explicitly treats the generated manifest as the runtime contract rather than assuming the POM's intent became the emitted headers. |
| Version-range diagnosis | Restored with released artifact | The handbook's incompatibility example is grounded in the released `existentialquery:2.0.0` JAR. Its recorded manifest imports OWL API packages with `[4.1,5)`, which excludes 5.0. The downloaded artifact's SHA-256 is stored with the checked excerpt. |
| Embed versus import | Restored with Cellfie | The Cellfie 2.1.0 POM at commit `1dd0896` embeds Apache POI, Gson, mapping-master, and related private libraries while importing Protégé and OWL API packages. Lesson 9 uses the concrete list and explains class identity across bundle classloaders. |
| BND instruction vocabulary | Restored from pinned POMs | Negation, `resolution:=optional`, `registry="split"`, ordering, and the trailing wildcard are tied to `protege-common/pom.xml:49-57` and `protege-editor-core/pom.xml:104-110` at the tutorial baseline. |
| Reflection invisible to BND | Restored with the handbook's concrete example | Lesson 7 labels this as a developer-handbook warning and ties the runtime example to `ProtegeApplication.java:315-336`: a look-and-feel class name comes from preferences, one branch uses `Class.forName`, and both branches provide `UIManager` with an explicit classloader. The course directs authors to add explicit imports for string-only runtime dependencies. |
| Frame-based ontology editors | Added beyond handbook | The handbook does not explain the dominant frame, section, row, and object-editor idiom. Lesson 10 now traces `OWLClassDescriptionViewComponent` through the concrete SubClass Of section and row, then into `OWLDataFactory`, `AddAxiom` or replacement changes, and `OWLModelManager.applyChanges`. |
| Runnable OWL API companion | Added with source correction | The OWL API primer and Lesson 9 now link Matthew Horridge's fixed tutorial content at `1953d8f`: ten runnable classes, three guides, tests, provided-scope rationale, and standalone Lesson 6 changes. Its absolute claim that raw manager calls bypass history is narrowed against this tutorial's pin: `OWLModelManagerImpl.java:157` registers the listener, lines 702-730 add facade rewrite/minimization, and lines 736-749 still record history and dirty state for underlying-manager changes. The course retains `OWLModelManager` as the safe plugin boundary without teaching behavior the snapshot contradicts. |

## Source checks

- Module declarations and versions: `pom.xml` and each module POM
- Compiler target and Maven requirement: root `pom.xml`
- CI JDK and profile matrix: `.github/workflows/ci.yml`
- Platform runtime packages and assemblies: `protege-desktop/pom.xml`
- Editor-kit ownership and construction order: `protege-editor-owl/src/main/java/org/protege/editor/owl/OWLEditorKit.java`
- Workspace model access and selection ownership: `protege-editor-owl/src/main/java/org/protege/editor/owl/model/OWLWorkspace.java`
- Change application and notification: `protege-editor-owl/src/main/java/org/protege/editor/owl/model/OWLModelManagerImpl.java`
- History behavior: `protege-editor-owl/src/main/java/org/protege/editor/owl/model/history/HistoryManagerImpl.java`
- View lifecycle and accessor chain: `protege-editor-owl/src/main/java/org/protege/editor/owl/ui/view/AbstractOWLViewComponent.java`
- Plugin classification and singleton check: `protege-editor-core/src/main/java/org/protege/editor/core/ProtegeApplication.java`
- Extension discovery and classloading: `protege-editor-core/src/main/java/org/protege/editor/core/plugin/`
- Editor-kit matching: `protege-editor-core/src/main/java/org/protege/editor/core/plugin/EditorKitExtensionMatcher.java:12-19` and `PluginParameterExtensionMatcher.java:68-73`
- Historical JPF wrapper name with live Equinox type: `protege-editor-core/src/main/java/org/protege/editor/core/ui/view/ViewComponentPluginJPFImpl.java:3-4,35-63`
- Extension-point count, ids, and declarations: `protege-editor-core/src/main/resources/plugin.xml:4-34` and `protege-editor-owl/src/main/resources/plugin.xml:6-31`
- Extension-point contracts: `protege-editor-core/schema/*.exsd` and `protege-editor-owl/schema/*.exsd`; only eight OWL declarations name schemas in this snapshot
- Developer wiki and mailing-list references: `README.md:11-13`
- Log destination: `protege-desktop/src/main/logging/conf/logback.xml`
- Coarse listener failure isolation: `protege-editor-owl/src/main/java/org/protege/editor/owl/model/OWLModelManagerImpl.java:188-209`
- Name-based Swing look-and-feel loading: `protege-editor-core/src/main/java/org/protege/editor/core/ProtegeApplication.java:315-336`
- Official example lifecycle, contribution, and bundle POM: `protegeproject/protege-plugin-examples@d879601324d0c45d99e0d0879219ef15763ced50`
- Cellfie embed/import instructions: `protegeproject/cellfie-plugin@1dd0896c8dd07b4f764d40225e374a5dc15a5d28`, `pom.xml:72-111`
- Released compatibility manifest: `edu.stanford.protege:existentialquery:2.0.0`, `META-INF/MANIFEST.MF`, SHA-256 recorded in `docs/source-artifacts/existentialquery-2.0.0-manifest.txt`

## Conclusion

After the corrections above, the tutorial is consistent with the handbook on the project architecture, core object graph, extension system, build baseline, and debugging workflow. Where the handbook uses a stronger simplification than the implementation supports, the tutorial states the safe rule and preserves the verified source-level behavior.
