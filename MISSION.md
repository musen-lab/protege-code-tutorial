# Mission: Become productive in the Protégé Desktop codebase

## Why
Build enough architectural and source-level understanding to investigate, modify, review, and debug Protégé Desktop confidently without depending on generated documentation to choose the next file.

## Success looks like
- Explain how the five Maven modules relate at build time and through OSGi at runtime.
- Trace startup, ontology loading, UI assembly, ontology changes, and plugin discovery through real classes.
- Locate the right module, extension point, and representative class for an unfamiliar task.
- Read the Java 11-era idioms used here without losing the architectural thread.
- Make and validate a small change while respecting Swing, OWL API, OSGi, and packaging constraints.

## Constraints
- The learner last used Java regularly about 12 years ago.
- Recent experience is primarily Ruby/Rails and TypeScript/Angular.
- The codebase is large, so depth must be staged without hiding important complexity.
- Architecture and code-flow diagrams are primary teaching tools, not decoration.

## Out of scope
- Exhaustive explanation of every Java class in the default learning path.
- A complete OWL 2 or ontology-engineering course.
- Equal coverage of every plugin contribution before the core runtime model is understood.
