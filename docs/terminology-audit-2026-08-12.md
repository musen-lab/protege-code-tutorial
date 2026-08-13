# External technology terminology audit

Audit date: 2026-08-12

Protégé source baseline: `protegeproject/protege@d9c9d392f9d88b5c4dc49a109009e9c460b6fb2b`

## Method

Every lesson, diagram, code cutaway, Java note, Architecture Atlas lens, and Field Notebook section was searched for named platforms, libraries, specifications, build tools, and historical terms. A term received a reusable primer when knowing its role is necessary to follow a runtime or build trace. A term remained a short contextual explanation when the course already defines it locally or when it is incidental to the primary path.

Each primer has two evidence layers:

1. An official or standards-body source for the technology itself.
2. Exact pinned Protégé source showing the role that technology plays in this application.

## Findings

| Term | First important use | Disposition | Protégé evidence |
| --- | --- | --- | --- |
| OWL | Lesson 1, five-module map | Added language-level primer and W3C links | `OWLEditorKit.java:50`, `OWLModelManager.java:42` |
| OWL API | Lesson 1, editor-owl responsibility | Added library primer and official project links | `OWLModelManager.java:42`, `OntologyLoader.java:89` |
| OSGi | Lesson 1, build-time versus runtime wiring | Added specification primer that separates OSGi from Maven and Felix | `Launcher.java:97`, `config.xml:23` |
| Equinox | Lesson 1, reverse runtime connection | Added registry primer that states Protégé runs Felix and embeds Equinox registry bundles | `config.xml:29`, `PluginUtilities.java:97` |
| Apache Felix | Lesson 2, plain-JVM launch | Added framework-implementation primer | `Launcher.java:67`, `Launcher.java:97` |
| SAX and JAXB | Lesson 2, start levels | Added combined XML infrastructure primer | `Activator.java:19`, `config.xml:18` |
| Swing and EDT | Lesson 3, ontology-load thread handoff | Added UI toolkit and threading primer | `OntologyLoader.java:57` |
| Eclipse PDE and m2e | Lesson 7, IDE feedback loop | Added development-tool primer and clarified that the Maven profile prepares but does not launch the application | `pom.xml:565` |
| bnd | Lesson 7, dependency contracts | Added bundle-tooling primer and distinguished it from Maven | `protege-editor-core/pom.xml:84` |
| Maven | Lesson 1 | Existing audience knowledge and in-course build explanations are sufficient; no standalone primer added | Root and module POMs throughout the course |
| Java service providers | Lesson 2 | Existing Java time-capsule note explains the mechanism at the exact call site | `Launcher.java:67` |
| Guava Optional, AutoValue, streams, generics, nullability | Field Notebook and contextual notes | Existing Java time-capsule material is sufficient | Exact imports and call sites are linked from affected lessons |
| JPF | Lesson 6 | Existing copy explicitly identifies the name as historical and proves the current wrapper consumes Equinox `IExtension` | `ViewComponentPluginJPFImpl.java:3` |
| SLF4J and Logback | Lesson 7 diagnostics | Incidental to the main trace; the course identifies the concrete log surface and configuration without adding a platform primer | `protege-desktop/src/main/logging/conf/logback.xml:1` |
| RDF and IRI | Lessons 3 and 10 | Introduced within the OWL primer and explained at the relevant loader or model operation; no separate platform primer added | `OntologyLoader.java:93` and linked OWL API call sites |

## Result

Nine reusable primers now appear at first use and in the Field Notebook. The audit intentionally avoids interrupting every paragraph with definitions. It gives extra context where the technology changes the learner's mental model of build wiring, runtime wiring, classloading, UI threading, or ontology state.
