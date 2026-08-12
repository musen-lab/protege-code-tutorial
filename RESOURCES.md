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

## Wisdom (Communities)

- [Protégé GitHub issues](https://github.com/protegeproject/protege/issues)
  Real maintenance problems and accepted project behavior. Use to practice tracing unfamiliar changes.
- `protege-dev` mailing list
  Project community for source-code and plugin-development questions.

## Gaps

- Some generated inventories are exact only for commit `d9c9d39`; later source revisions need regeneration or direct recounting.
- Four OWL extension points lack schema files, so their contracts must be learned from implementation code.
