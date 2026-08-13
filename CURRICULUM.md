# Inside Protégé: Production Curriculum

The default route is nine causal journeys. Reference material stays available through the Atlas and Field Notebook without interrupting Next and Previous navigation.

## Journeys

1. **Survey the landscape**: five modules, three integration mechanisms, and the framework-to-OWL boundary.
2. **Start the application**: launch script, plain-JVM launcher, Felix start levels, deferred application startup.
3. **Open an ontology**: `EditorKit` discovery, `OWLEditorKit` assembly, EDT handoff, OWL API loading, model events.
4. **Build the screen**: workspace, declarative tabs and views, layout descriptors, lifecycle and disposal.
5. **Make a change**: UI action, `OWLOntologyChange` list, minimization, OWL API listeners, dirty state, history, repaint.
6. **Follow an extension**: `plugin.xml`, Equinox registry, loader/filter/wrapper, contributing bundle classloader, singleton rule.
7. **Work safely**: IDE/debugger, plugin-JAR, and full-distribution loops; Maven reactor, bundle exports, dependency packaging, tests, logging, and Swing thread rules.
8. **Navigate independently**: task-to-module recipes, source searches, failure signatures, and a capstone investigation.
9. **Build a view plugin**: minimal view lifecycle, complete `plugin.xml`, Maven and BND packaging, manifest inspection, compatibility ranges, installation, and runtime observation.

## Diagram inventory

- Build-time module dependency map
- Runtime OSGi start-level map
- Core abstraction class diagram
- Startup sequence diagram with plain JVM and OSGi lanes
- Ontology-loading sequence with EDT and worker lanes
- `OWLEditorKit` object-assembly diagram
- Workspace, tab, view containment diagram
- Declarative UI contribution flow
- Ontology-change event and undo/redo flow
- Plugin discovery and classloader flow
- Extension-point ecosystem map
- Maven-to-distribution dependency checklist
- IDE, plugin-only, and release feedback-loop selector
- Task-to-change-point atlas
- Source-to-visible-view build and discovery pipeline

Every diagram answers one named question, uses stable semantic colors, and links important nodes to the exact source snapshot.
