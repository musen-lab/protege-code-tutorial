# Inside Protégé

An interactive, source-guided field course for learning the Protégé Desktop
codebase. The course is designed for an experienced programmer returning to
modern Java after working primarily with Ruby on Rails and TypeScript/Angular.

## Course shape

- Eight guided journeys, from module orientation through safe contribution
- Interactive architecture, runtime, extension, and edit-flow diagrams
- Source cutaways linked to exact files in the local Protégé checkout
- Java time-capsule notes and Rails/Angular conceptual bridges
- Prediction checkpoints, field exercises, and a searchable reference notebook

The tutorial is intentionally progressive rather than encyclopedic. It teaches
the stable paths and concepts that make the rest of the source tree navigable.

## Development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
npm run lint
npm test
```

`npm test` creates the production build and verifies rendered HTML for the
trailhead, a guided journey, the architecture atlas, and the field notebook.

## Course records

- `MISSION.md` defines the learner and teaching contract.
- `CURRICULUM.md` maps the progression and completion criteria.
- `GLOSSARY.md` provides canonical project terminology.
- `RESOURCES.md` records the source and documentation evidence base.
- `learning-records/` stores durable learner context.
