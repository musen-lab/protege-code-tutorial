# Protégé Code Tutorial

Inside Protégé is an interactive, source-guided course for learning the Protégé Desktop
codebase. The course is designed for an experienced programmer returning to
modern Java after working primarily with Ruby on Rails and TypeScript/Angular.

## Course shape

- Ten guided lessons, from module orientation through plugin and editor authoring
- Interactive architecture, runtime, extension, and edit-flow diagrams
- Source cutaways linked to exact files in a pinned Protégé GitHub snapshot
- Technology primers, Java time-capsule notes, and Rails/Angular conceptual bridges
- Prediction checkpoints, field exercises, and a searchable reference notebook
- Course-wide search across lessons, diagrams, source cutaways, technology
  primers, Atlas lenses, and Field Notebook sections

The tutorial is intentionally progressive rather than encyclopedic. It teaches
the stable paths and concepts that make the rest of the source tree navigable.

## Installation

### Prerequisites

- Node.js `22.13.0` or newer from a supported LTS line. Node 24 LTS is
  recommended; odd-numbered, non-LTS releases such as Node 23 can produce
  engine warnings in the lint toolchain.
- npm, which is included with Node.js
- An internet connection for the initial dependency download and external
  source links

Running the tutorial does not require Java, Maven, a local Protégé checkout, a
database, environment variables, or ChatGPT authentication. The optional
hands-on plugin exercise in Lesson 9 requires JDK 11 or later, Maven 3.6.3 or
later, and a Protégé 5.6 installation for its runtime check.

### If you use Homebrew...

Homebrew can install the recommended Node.js LTS release and npm:

```bash
brew install node@24
```

The versioned [`node@24`](https://formulae.brew.sh/formula/node@24) formula is
keg-only, so Homebrew may not place it first on your `PATH`. Run the following
for the current shell, and add the same `export` line to `~/.zshrc` if you want
the setting to persist:

```bash
export PATH="$(brew --prefix node@24)/bin:$PATH"
node --version
npm --version
```

Confirm that `node --version` reports a supported release, preferably `v24`,
before continuing.

### Install the dependencies

From a checkout of this repository:

```bash
cd /path/to/protege-code-tutorial
npm ci
```

`npm ci` installs the exact dependency versions recorded in
`package-lock.json`. Use `npm install` only when intentionally changing the
dependency set and updating the lockfile.

### Start the course locally

```bash
npm run build
npm run start
```

When the server reports that it is ready, open
[http://localhost:3000](http://localhost:3000) in a browser. This production-mode
server matches the typography and assets used by the hosted course. Press
`Ctrl+C` in the terminal to stop it.

### Use development mode while editing

```bash
npm run dev
```

Development mode reflects source changes without rebuilding. With the current
Vinext release, however, it does not inject the generated `next/font` styles.
Geist and Lora therefore fall back to system fonts. Use development mode for
rapid iteration, but use `npm run build` followed by `npm run start` for
typography checks and final visual validation.

## Usage

1. Open the course home page and choose **Start Lesson 1**.
2. Follow the ten lessons in order. Each lesson builds on the mental model
   established by the previous one.
3. Select boxes in diagrams to inspect their responsibilities, relationships,
   and source evidence.
4. Use the prediction checkpoints before revealing their answers. Lessons 9
   and 10 also include guided field exercises; the other lessons do not claim
   to provide reproduce-style practice.
5. Read a technology primer when the course first introduces an external
   platform such as OSGi, Felix, Equinox, OWL API, Swing, or bnd. The
   authoritative documentation and pinned Protégé evidence open in new tabs.
6. Follow source links when you want the full implementation. They open the
   exact file and line at the verified Protégé source snapshot.
7. Use the **Architecture Atlas** and **Field notebook** as supporting
   references. They are not alternative starting points.
8. Choose **Search** in the header to look up a keyword, class, extension
   point, or technology. Results link directly to the matching lesson section
   or reference entry.

The tutorial saves two things in the browser's local storage: a resume
position (current lesson and scroll offset) and course completion. Completion
is recorded only through explicit actions: marking a section complete,
revealing a checkpoint answer, or checking off a hands-on exercise. Visiting
or scrolling a lesson never counts as completing it. Return to the home page
and choose **Resume the course** to continue; the **Course completion** bar
there counts completed sections. Choose **Restart from Lesson 1** to clear
both, after a confirmation. All of this is specific to the current browser
profile and is lost if its site data is cleared.

### Run the plugin exercise

Lesson 9 includes a complete Maven project under
`exercises/minimal-view-plugin`. From the repository root:

```bash
cd exercises/minimal-view-plugin
mvn clean package
jar tf target/protege-minimal-view-1.0.0.jar
unzip -p target/protege-minimal-view-1.0.0.jar META-INF/MANIFEST.MF
```

Read the exercise's own `README.md` for installation and runtime verification.
The web course still installs and runs with Node.js alone.

## Development commands

```bash
# Start the fast development server at http://localhost:3000
# Note: generated next/font styles are not loaded in this mode
npm run dev

# Check the source with ESLint
npm run lint

# Create the production build
npm run build

# Serve an existing production build at http://localhost:3000
npm run start

# Create a fresh production build and verify the rendered pages
npm test
```

`npm test` creates the production build and verifies rendered HTML for the
trailhead, guided lessons, the Architecture Atlas, the Field notebook, and search.
Run `npm run build` before `npm run start`; `npm run dev` does not require a
production build but must not be used as the final typography or visual
baseline.

## Contributing

Read [`AGENTS.md`](AGENTS.md) before changing or validating the project. It is
the canonical guide for repository structure, source-evidence rules, testing,
visual QA, commits, and publishing constraints.

## Course records

- `MISSION.md` defines the learner and teaching contract.
- `CURRICULUM.md` maps the progression and diagram inventory.
- `GLOSSARY.md` provides canonical project terminology.
- `RESOURCES.md` records the source and documentation evidence base.
- `learning-records/` stores durable learner context.
