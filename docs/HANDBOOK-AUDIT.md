# Protégé Developer Handbook consistency audit

Audit date: 2026-08-12

Handbook reviewed: `Protege Developer Handbook 2026-08-11 (Matthew Horridge).html`

Tutorial source baseline: `protegeproject/protege@d9c9d392f9d88b5c4dc49a109009e9c460b6fb2b`

## Method

The handbook was converted to plain text and read in full. Its architectural, build, lifecycle, extension, and debugging claims were mapped to the ten course journeys, Architecture Atlas, and Field Notebook. Every disputed or potentially drift-prone claim was then checked in the pinned source, POM files, plugin declarations, assembly configuration, CI workflow, and fixed real-plugin artifacts.

## Findings and disposition

| Area | Result | Evidence and action |
| --- | --- | --- |
| Five module responsibilities | Aligned | The course and handbook assign bootstrap to launcher, XML service setup to common, domain-neutral UI and plugin contracts to editor-core, OWL behavior to editor-owl, and packaging to desktop. |
| Direct Maven dependency graph | Corrected | The Atlas previously drew a linear path that implied `editor-core` depends on `common`. POM inspection shows `editor-core -> launcher` and `common -> launcher`, with no core-to-common edge. The diagram now renders the full branching graph. |
| Java version | Corrected | “Java 11 is the ceiling” was misleading. Java 11 is the compilation target and bundled runtime. CI verifies JDK 11 and 21. The Field Notebook now distinguishes source target, build JDK, and runtime JDK. |
| Build commands | Expanded | The course now teaches the handbook's release command, `mvn -Prelease clean package`, and separately explains the CI matrix across default, ide, and release profiles on JDK 11 and 21. |
| Fast development loops | Restored in Journey 7 | The course now distinguishes `mvn -Pide package` plus an IDE OSGi launch, a standalone plugin JAR copied to `plugins` or `~/.Protege/plugins`, and a full distribution build. The IDE profile behavior is tied to `pom.xml:565-650`; plugin search paths are tied to `protege-desktop/src/main/felix/conf/config.xml:48-51`. |
| Editor-kit ownership | Corrected | A linear class diagram implied `OWLModelManager` owns `OWLWorkspace`. Source shows both are final fields owned by `OWLEditorKit`. The diagram now shows separate ownership edges and the workspace-to-model accessor through the kit. |
| Selection ownership | Added | `OWLSelectionModel` is owned by `OWLWorkspace`. The central object graph and class landmarks now show it. |
| View accessor and lifecycle chain | Added to reference | `AbstractOWLViewComponent` is now a class landmark. The guided screen journey already teaches view initialization and disposal. |
| Ontology change path | Aligned with source nuance | The course uses `OWLModelManager.applyChanges` as the application boundary, then traces rewrite, minimization, OWL API notification, history, dirty state, and UI reactions. The handbook's prohibition on direct manager calls is retained as a rule. The course also records the source-level nuance that direct OWL API calls still notify registered listeners, but skip facade policy. |
| Model-manager event type names | Aligned | The tutorial uses `OWLModelManagerListener` and `OWLModelManagerChangeEvent`, matching source and avoiding the nonexistent `OWLModelManagerChangeListener` name. |
| Extension discovery pipeline | Aligned and expanded | The course already covered Equinox metadata, filter, loader, wrapper, contributor bundle classloading, and initialization. It now also names the plugin JAR, manifest, Maven/BND, no-argument constructor, and lifecycle contracts. |
| Silent plugin failures | Corrected | The course previously covered only singleton metadata. It now also explains `ProtegeApplication.isPlugin`, which classifies only bundle locations containing `plugin`. A JAR under `bundles` may start but not be reported as a plugin. |
| Extension-point inventory | Expanded | The Field Notebook now lists all 24 first-party points exactly: 12 from editor-core and 12 from editor-owl. |
| Logging and diagnostics | Corrected | The course previously led with the in-app log. It now leads with `~/.Protege/logs/protege.log`, which remains available when the UI cannot start, and treats the in-app view as a convenient second surface. |
| OSGi and JPF history | Intentionally secondary | The course explains the current Felix plus Equinox mechanism. The older Protégé and JPF chronology is useful background but not required on the primary causal path, so it remains handbook reference material rather than a new journey. |
| Compatibility library cautions | Intentionally secondary | Guava Optional, AutoValue, Swing threading, and mixed-era reflection are covered. Detailed JAXB and historical Equinox compatibility notes remain reference-level material because they do not change the stable architecture map. |
| Minimal plugin authoring | Restored as Journey 9 | The handbook's class, `plugin.xml`, POM, build, copy, restart, and observe sequence is now a guided exercise. Java and extension metadata are traced to `protege-plugin-examples@d879601`; current build versions are isolated in the exercise POM and verified by a clean Maven build. |
| Generated manifest inspection | Restored as required evidence | Journey 9 teaches `jar tf` and `unzip -p ... META-INF/MANIFEST.MF`. It explicitly treats the generated manifest as the runtime contract rather than assuming the POM's intent became the emitted headers. |
| Version-range diagnosis | Restored with released artifact | The handbook's incompatibility example is grounded in the released `existentialquery:2.0.0` JAR. Its recorded manifest imports OWL API packages with `[4.1,5)`, which excludes 5.0. The downloaded artifact's SHA-256 is stored with the checked excerpt. |
| Embed versus import | Restored with Cellfie | The Cellfie 2.1.0 POM at commit `1dd0896` embeds Apache POI, Gson, mapping-master, and related private libraries while importing Protégé and OWL API packages. Journey 9 uses the concrete list and explains class identity across bundle classloaders. |
| BND instruction vocabulary | Restored from pinned POMs | Negation, `resolution:=optional`, `registry="split"`, ordering, and the trailing wildcard are tied to `protege-common/pom.xml:49-57` and `protege-editor-core/pom.xml:104-110` at the tutorial baseline. |
| Frame-based ontology editors | Added beyond handbook | The handbook does not explain the dominant frame, section, row, and object-editor idiom. Journey 10 now traces `OWLClassDescriptionViewComponent` through the concrete SubClass Of section and row, then into `OWLDataFactory`, `AddAxiom` or replacement changes, and `OWLModelManager.applyChanges`. |

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
- Extension-point count and ids: both module `src/main/resources/plugin.xml` files
- Log destination: `protege-desktop/src/main/logging/conf/logback.xml`
- Official example lifecycle, contribution, and bundle POM: `protegeproject/protege-plugin-examples@d879601324d0c45d99e0d0879219ef15763ced50`
- Cellfie embed/import instructions: `protegeproject/cellfie-plugin@1dd0896c8dd07b4f764d40225e374a5dc15a5d28`, `pom.xml:72-111`
- Released compatibility manifest: `edu.stanford.protege:existentialquery:2.0.0`, `META-INF/MANIFEST.MF`, SHA-256 recorded in `docs/source-artifacts/existentialquery-2.0.0-manifest.txt`

## Conclusion

After the corrections above, the tutorial is consistent with the handbook on the project architecture, core object graph, extension system, build baseline, and debugging workflow. Where the handbook uses a stronger simplification than the implementation supports, the tutorial states the safe rule and preserves the verified source-level behavior.
