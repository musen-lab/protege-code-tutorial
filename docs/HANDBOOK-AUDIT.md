# Protégé Developer Handbook consistency audit

Audit date: 2026-08-12

Handbook reviewed: `Protege Developer Handbook 2026-08-11 (Matthew Horridge).html`

Tutorial source baseline: `protegeproject/protege@d9c9d392f9d88b5c4dc49a109009e9c460b6fb2b`

## Method

The handbook was converted to plain text and read in full. Its architectural, build, lifecycle, extension, and debugging claims were mapped to the eight course journeys, Architecture Atlas, and Field Notebook. Every disputed or potentially drift-prone claim was then checked in the pinned source, POM files, plugin declarations, assembly configuration, and CI workflow.

## Findings and disposition

| Area | Result | Evidence and action |
| --- | --- | --- |
| Five module responsibilities | Aligned | The course and handbook assign bootstrap to launcher, XML service setup to common, domain-neutral UI and plugin contracts to editor-core, OWL behavior to editor-owl, and packaging to desktop. |
| Direct Maven dependency graph | Corrected | The Atlas previously drew a linear path that implied `editor-core` depends on `common`. POM inspection shows `editor-core -> launcher` and `common -> launcher`, with no core-to-common edge. The diagram now renders the full branching graph. |
| Java version | Corrected | “Java 11 is the ceiling” was misleading. Java 11 is the compilation target and bundled runtime. CI verifies JDK 11 and 21. The Field Notebook now distinguishes source target, build JDK, and runtime JDK. |
| Build commands | Expanded | The course now teaches the handbook's release command, `mvn -Prelease clean package`, and separately explains the CI matrix across default, ide, and release profiles on JDK 11 and 21. |
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

## Conclusion

After the corrections above, the tutorial is consistent with the handbook on the project architecture, core object graph, extension system, build baseline, and debugging workflow. Where the handbook uses a stronger simplification than the implementation supports, the tutorial states the safe rule and preserves the verified source-level behavior.
