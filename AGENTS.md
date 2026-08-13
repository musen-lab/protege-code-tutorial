# Agent instructions

This file is the canonical operating guide for any AI agent contributing to or
validating this repository. It applies to the entire repository. Read it before
making changes.

## What this repository is

Inside Protégé is an interactive, source-guided course for learning the Protégé
Desktop codebase. It is a tutorial web application, not the Protégé application
itself.

The primary learner is an experienced programmer returning to Java after
working mainly with Ruby/Rails and TypeScript/Angular. Preserve technical depth,
but introduce it through a clear causal path rather than an encyclopedia of
classes.

Read these files before making substantial content or information-architecture
changes:

- `MISSION.md`: learner, outcome, and teaching constraints
- `CURRICULUM.md`: the ordered ten-journey course and diagram inventory
- `RESOURCES.md`: evidence base
- `GLOSSARY.md`: canonical terminology
- `docs/HANDBOOK-AUDIT.md`: consistency audit against the developer handbook

## Product invariants

- The ten journeys are the primary path and should be followed in order.
- The Architecture Atlas and Field notebook are supporting references, not
  competing starting points.
- Diagrams teach architecture, ownership, dependencies, runtime flow, and event
  flow. They are not decoration.
- Important claims and diagrams must be traceable to the verified Protégé
  source snapshot.
- Source complexity may be staged, but it must not be simplified into an
  incorrect mental model.
- Progress remains device-local unless a separately approved requirement
  changes that behavior.
- Navigation must remain usable without JavaScript-specific routing behavior.

## Repository map

- `app/page.tsx`: course trailhead
- `app/journeys/[slug]/page.tsx`: guided journey route
- `app/atlas/page.tsx`: Architecture Atlas
- `app/reference/page.tsx`: Field notebook
- `app/lib/course.ts`: source snapshot, curriculum data, diagrams, checkpoints,
  code cutaways, and source-link generation
- `app/components/`: shared interactive and navigational components
- `app/globals.css`: global visual system and responsive behavior
- `tests/rendered-html.test.mjs`: production-rendering regression tests
- `exercises/`: buildable learner exercises with their own prerequisites and
  provenance records
- `docs/`: audits and captured visual evidence
- `public/`: static assets and social preview
- `build/`, `worker/`, `vite.config.ts`: Vinext, Vite, and Cloudflare-compatible
  build/runtime integration
- `.openai/hosting.json`: existing Sites project identity, not a place for
  secrets or local configuration

Do not edit generated or local-only directories such as `node_modules/`,
`dist/`, `.vinext/`, `.wrangler/`, `outputs/`, or `work/`.

## Source-evidence rules

`SOURCE_COMMIT` in `app/lib/course.ts` is the tutorial's Protégé source
baseline. Source links are generated for `protegeproject/protege` at that exact
commit.

When changing a factual claim, class relationship, source cutaway, or diagram:

1. Inspect the implementation at `SOURCE_COMMIT`.
2. Verify the exact class, method, ownership direction, lifecycle, and line
   reference involved.
3. Check the developer-handbook audit when the topic overlaps it.
4. Update or add a rendered regression assertion when the claim is important
   to the course's architecture model.

Do not silently update claims to the latest Protégé branch. Changing
`SOURCE_COMMIT` is a separate audit task. It requires rechecking source links,
line anchors, code cutaways, diagrams, handbook alignment, snapshot labels, and
tests.

## Local setup

Use a supported Node.js LTS line, with `22.13.0` as the minimum. Node 24 LTS is
recommended. The repository records exact npm dependencies in
`package-lock.json`.

```bash
npm ci
npm run build
npm run start
```

The local course is available at `http://localhost:3000`. No Java, Maven,
database, environment variables, local Protégé checkout, or ChatGPT sign-in is
required to run it.

Use `npm run dev` for rapid iteration. The current Vinext release does not
inject the generated `next/font` styles in development mode, so Geist and Lora
fall back to system fonts. Use `npm run build` followed by `npm run start` for
typography checks and final visual validation.

## Contribution workflow

1. Read the relevant mission, curriculum, resource, and audit material.
2. Inspect the current working tree and preserve unrelated changes.
3. Verify the code or runtime mechanism before recommending or implementing a
   change.
4. Make the smallest coherent change that preserves the product invariants.
5. Validate at the level appropriate to the change, using the matrix below.
6. Step back and explicitly evaluate whether `README.md`, `AGENTS.md`,
   `CLAUDE.md`, or another contributor guide must change. Include any required
   documentation in the same update.
7. Review the final diff for accidental content, generated files, and stale
   claims.
8. Commit the validated change immediately and directly to `main` with a
   concise, descriptive commit message.

Current repository policy:

- Work directly on `main`.
- Do not leave a completed, validated update uncommitted.
- Do not create branches or pull requests unless explicitly requested.
- Do not add a Git remote, push commits, publish the site, or change site access
  unless explicitly authorized.
- Never commit credentials, local environment files, or private source
  material.

If a remote collaboration workflow is adopted later, update this section
before following the new workflow.

## Implementation guidance

- Keep TypeScript strict and prefer existing components and data shapes.
- Keep course content centralized in `app/lib/course.ts` unless a real module
  boundary justifies moving it.
- Use `sourceUrl` and `SourceRef` for Protégé source links. Do not hand-build
  drifting branch URLs. External artifact examples must use fixed commit or
  release URLs and record their provenance.
- Preserve semantic HTML, keyboard operation, visible focus, readable contrast,
  and the mobile fallback for every interaction.
- For relationship-heavy material, prefer a labeled diagram plus selectable
  details. Keep the diagram deterministic; learners should not need to arrange
  nodes themselves.
- Keep code-like module and class names legible. Verify that arrow labels are
  not crossed by lines or clipped by adjacent nodes.
- Internal navigation intentionally uses browser-native anchors. Do not replace
  it with framework navigation without a verified need and regression coverage.
- Course progress is stored under `inside-protege-progress-v1` in browser local
  storage. Treat changes to that key or data shape as a migration concern.
- The current value records only the last reading position, not completion.
  `docs/progress-model-proposal.md` is an unapproved design. Do not implement
  its completion model without a separate maintainer decision.

## Validation matrix

| Change type | Required validation |
| --- | --- |
| Documentation only | Check every command or link changed, then run `git diff --check`. |
| Course content or source claim | Verify against `SOURCE_COMMIT`, then run `npm run lint` and `npm test`. |
| Component, route, diagram data, or CSS | Run `npm run lint` and `npm test`, then inspect the affected page. Development mode is acceptable for iteration; use `npm run build` and `npm run start` for the final visual check. |
| Responsive or visual behavior | Compare the production-mode page before and after at the same viewport. Check desktop and mobile behavior. |
| Dependency change | Use `npm install` only intentionally, inspect `package.json` and `package-lock.json`, then run the full validation suite. |
| Build or runtime integration | Run `npm run build`, then `npm run start` and verify `http://localhost:3000` responds successfully. |
| Buildable exercise | Run the exercise's declared build and artifact-inspection commands, then confirm its provenance against the fixed upstream source or release artifact. |

The standard full validation command is:

```bash
npm run lint && npm test
```

`npm test` creates a fresh production build before exercising the server-rendered
HTML. Passing tests are necessary but do not replace browser inspection for a
visual or interaction change.

## Before committing

- Confirm that the worktree contains only intended source changes.
- Run `git diff --check`.
- Confirm that required validation passed and report any warning honestly.
- Do not stage ignored build output or dependency directories.
- Do not credit an AI agent as author or co-author in the commit message.

## Handoff

Report what changed, which source evidence was checked, which validation ran,
and whether the working tree is clean. State clearly that nothing was pushed or
published unless that action was explicitly requested and completed.
