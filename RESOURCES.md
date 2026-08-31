# Protégé Desktop Resources

## Knowledge

- [Protégé source at the tutorial snapshot](https://github.com/protegeproject/protege/tree/d9c9d392f9d88b5c4dc49a109009e9c460b6fb2b)
  The authority for class behavior, plugin declarations, manifests, and build configuration. Use for every source-level claim.
- `Protege Developer Handbook 2026-08-11 (Matthew Horridge).html`
  The developer-authored orientation, plugin-development, and debugging reference used for the August 12, 2026 consistency audit. Its claims were checked against the pinned source rather than copied uncritically.
- `protege-llm-wiki/external/protege-docs/index.md`
  Source-derived architecture documentation generated from the same `d9c9d39` commit. Use for orientation, inventories, and cross-module routing, then verify critical flows in source.
- [Protégé developer documentation](https://github.com/protegeproject/protege/wiki/Developer-Documentation)
  Project-maintained developer guidance. Use for contributor context while remembering it is not versioned with this checkout.
- [DeepWiki project overview](https://deepwiki.com/musen-lab/protege/1-protege-desktop-project-overview)
  A convenient generated navigation and diagram reference. Use for comparison and discovery only, not as authority.
- [Java SE 11 documentation](https://docs.oracle.com/en/java/javase/11/)
  Oracle's language and platform reference for the project's Java baseline.
- [OWL API](https://github.com/owlcs/owlapi)
  Primary library source for ontology objects, managers, changes, formats, and reasoner interfaces used by `protege-editor-owl`.

## Technology sources of record

- [OSGi Core framework overview](https://docs.osgi.org/specification/osgi.core/8.0.0/framework.introduction.html)
  The specification-level introduction to bundles, package visibility, lifecycle, and services.
- [Apache Felix documentation](https://felix.apache.org/documentation/)
  The framework implementation Protégé ships and launches.
- [Eclipse runtime components](https://help.eclipse.org/latest/topic/org.eclipse.platform.doc.isv/guide/runtime_components.htm) and [extension registry guide](https://help.eclipse.org/latest/topic/org.eclipse.platform.doc.isv/guide/runtime_registry.htm)
  Official documentation for the Equinox registry components and `plugin.xml` extension model embedded by Protégé.
- [W3C OWL 2 overview](https://www.w3.org/TR/owl2-overview/) and [OWL API documentation](https://owlcs.github.io/owlapi/)
  The ontology language specification and the Java library used to represent and change it.
- [Oracle Swing tutorial](https://docs.oracle.com/javase/tutorial/uiswing/) and [Event Dispatch Thread guide](https://docs.oracle.com/javase/tutorial/uiswing/concurrency/dispatch.html)
  The desktop UI toolkit and its single-threaded interaction model.
- [bnd documentation](https://bnd.bndtools.org/)
  The bytecode analysis and OSGi manifest tooling exposed through the Maven bundle plugin.
- [Eclipse PDE](https://www.eclipse.org/pde/) and [m2e](https://eclipse.dev/m2e/)
  The IDE tooling targeted by Protégé's `ide` Maven profile.

## Recorded build artifacts

- `docs/source-artifacts/protege-common-manifest.txt`
  A normalized extract of the real `protege-common` OSGi manifest generated
  from a git archive of the pinned source. The file records the build command,
  source commit, JAR checksum, raw manifest checksum, and the emitted package
  version ranges used in Lesson 2.

## Brand source

- [Official Protégé website](https://protege.stanford.edu/) and its
  [Protégé icon](https://protege.stanford.edu/img/protege-icon.svg)
  The header combines the official three-color icon and Protégé wordmark
  treatment with a separate “Code Tutorial” product suffix. The icon is stored
  locally as `public/protege-icon.svg` so the course remains usable offline.
  The local file is an exact copy retrieved on 2026-08-12, SHA-256
  `3f7fdd08b4f232a4b9e566099ed832612ff160098667bcd36d3b2f02da1758ac`.

## Wisdom (Communities)

- [Protégé GitHub issues](https://github.com/protegeproject/protege/issues)
  Real maintenance problems and accepted project behavior. Use to practice tracing unfamiliar changes.
- `protege-dev` mailing list
  Project community for source-code and plugin-development questions.

## Gaps

- Some generated inventories are exact only for commit `d9c9d39`; later source revisions need regeneration or direct recounting.
- Four OWL extension points lack schema files, so their contracts must be learned from implementation code.
