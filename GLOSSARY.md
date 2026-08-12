# Protégé Desktop Glossary

Canonical terminology as used throughout the course. When writing or editing
course content, prefer these terms and spellings; do not introduce synonyms
for concepts that already have an entry here.

## Course terms

- **Journey**: one of the eight ordered guided lessons that form the primary
  course path. Learner-facing copy says "journey"; the code's data type is
  `Lesson` in `app/lib/course.ts`.
- **Lens**: one of the four Architecture Atlas views (Modules, Runtime,
  Extensions, Edit flow). Each lens asks one question of the same system.
- **Source cutaway**: a short, possibly condensed code excerpt linked to the
  exact file and line at the verified snapshot.
- **Prediction checkpoint**: a question the learner answers before revealing
  the answer. Recall practice, not an exercise.
- **Verified snapshot**: the pinned Protégé commit (`SOURCE_COMMIT` in
  `app/lib/course.ts`) that every source link, cutaway, and factual claim is
  checked against.
- **Field notebook**: the reference page (`/reference`) for Java idioms, class
  landmarks, extension points, and search recipes.
- **Transfer bridge**: a note mapping a Protégé concept onto Rails or Angular
  experience, always paired with where the analogy breaks.
- **Java time capsule**: a note explaining a Java idiom for a reader returning
  to Java after years away.

## Protégé terms

- **Module**: one of the five Maven modules (`protege-launcher`,
  `protege-common`, `protege-editor-core`, `protege-editor-owl`,
  `protege-desktop`). "Module" always means a Maven module, never an OSGi
  bundle.
- **Bundle**: a JAR with OSGi metadata installed into Felix at a start level.
  Every module ships as a bundle except desktop, which packages them.
- **Start level**: one of the five ordered Felix start stages hand-authored in
  `config.xml`.
- **Extension point**: a named contract declared in a host `plugin.xml` that
  contributions plug into (for example `ViewComponent`, `EditorKitFactory`).
- **Contribution** (or **extension**): an entry in a bundle's `plugin.xml`
  that targets an extension point and names an implementation class.
- **Plugin**: a contributor bundle installed under a `plugins` directory.
  Protégé's plugin report only counts bundles whose install location contains
  the word "plugin".
- **Singleton bundle**: a bundle whose `Bundle-SymbolicName` carries
  `singleton:=true`; Equinox reads `plugin.xml` only from these.
- **Editor kit**: the per-window composition root pairing one model manager
  with one workspace (`EditorKit`, implemented by `OWLEditorKit`).
- **Model manager**: the application facade over ontology state
  (`OWLModelManager`); the boundary that ontology changes should cross.
- **Workspace**: the Swing shell owned by an editor kit; the OWL workspace
  owns the selection model and hosts tabs.
- **Tab**: a `WorkspaceTab` contribution with a viewconfig layout resource.
- **View**: the dockable container chrome; a **view component** is the
  contributed feature panel inside it.
- **Viewconfig**: an XML layout resource that places view ids in a tab's
  default layout.
- **EDT**: Swing's Event Dispatch Thread; the only thread that may touch
  visible UI state.
- **Change list**: one logical `List<OWLOntologyChange>` applied through the
  model manager; the unit of undo.
- **Coarse event**: an `OWLModelManagerListener` notification (`EventType`)
  about application state, as opposed to exact axiom-level OWL API changes.
