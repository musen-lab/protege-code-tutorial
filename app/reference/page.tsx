import type { Metadata } from "next";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SOURCE_COMMIT, sourceUrl } from "@/app/lib/course";

export const metadata: Metadata = {
  title: "Field Notebook",
  description: "Java refreshers, class landmarks, extension points, and source-navigation recipes for Protégé Desktop.",
};

const javaNotes = [
  ["Java 11 is the compilation target", "Production source compiles with release 11, so it cannot use records, sealed classes, switch expressions, text blocks, or pattern matching. The application can run on newer JDKs, and CI verifies JDK 11 and 21."],
  ["Build and runtime are separate", "The platform distributions bundle JRE 11. The handbook reports successful runs on 11, 17, 21, and 25, but the current source cannot be built with Java 25 because of its older AutoValue processor. Test plugins on 11 and at least one current LTS runtime."],
  ["Lambdas and method references", "event -> handle(event) and this::handleEvent implement single-method interfaces. The target type comes from the receiving method or field declaration."],
  ["Streams", "Streams express pipelines over collections: filter, map, flatMap, collect, findFirst. They are lazy until a terminal operation and are not a replacement for every loop."],
  ["Two Optional families", "Both java.util.Optional and com.google.common.base.Optional appear. Inspect imports. Their method names differ, and OWL API 4-era code often uses Guava Optional."],
  ["Generics and wildcards", "? extends T is a producer you can read as T. ? super T is a consumer that can accept T. Protégé APIs commonly use bounded lists of OWLOntologyChange."],
  ["AutoValue", "@AutoValue marks abstract value types whose immutable implementation is generated at compile time. Search for AutoValue_ClassName when reading generated call sites."],
  ["Concurrency is mixed-era", "The code uses ExecutorService, SwingUtilities, locks, and OWL API concurrent managers, plus Guava ListenableFuture and MoreExecutors. Always identify the EDT boundary first."],
  ["Nullability is documentary", "@Nonnull and @Nullable describe intent for tools and readers. Java 11 itself does not enforce them at runtime."],
];

const classLandmarks = [
  ["Launcher", "Plain-JVM bootstrap", "protege-launcher/src/main/java/org/protege/osgi/framework/Launcher.java", 21],
  ["ProtegeApplication", "Deferred OSGi application startup", "protege-editor-core/src/main/java/org/protege/editor/core/ProtegeApplication.java", 57],
  ["ProtegeManager", "Editor-kit discovery and lifecycle", "protege-editor-core/src/main/java/org/protege/editor/core/ProtegeManager.java", 27],
  ["EditorKit", "Model-to-workspace framework seam", "protege-editor-core/src/main/java/org/protege/editor/core/editorkit/EditorKit.java", 39],
  ["AbstractPluginLoader", "Generic extension discovery", "protege-editor-core/src/main/java/org/protege/editor/core/plugin/AbstractPluginLoader.java", 31],
  ["PluginUtilities", "Registry services and contributor bundles", "protege-editor-core/src/main/java/org/protege/editor/core/plugin/PluginUtilities.java", 26],
  ["TabbedWorkspace", "Contributed tab loading and lifecycle", "protege-editor-core/src/main/java/org/protege/editor/core/ui/workspace/TabbedWorkspace.java", 23],
  ["OWLEditorKit", "OWL composition root", "protege-editor-owl/src/main/java/org/protege/editor/owl/OWLEditorKit.java", 50],
  ["OWLModelManagerImpl", "Ontology application facade", "protege-editor-owl/src/main/java/org/protege/editor/owl/model/OWLModelManagerImpl.java", 73],
  ["OntologyLoader", "EDT-aware OWL API loading", "protege-editor-owl/src/main/java/org/protege/editor/owl/model/io/OntologyLoader.java", 38],
  ["HistoryManagerImpl", "List-based undo and redo", "protege-editor-owl/src/main/java/org/protege/editor/owl/model/history/HistoryManagerImpl.java", 26],
  ["OWLWorkspace", "Workspace-owned selection and UI coordination", "protege-editor-owl/src/main/java/org/protege/editor/owl/model/OWLWorkspace.java", 77],
  ["AbstractOWLViewComponent", "OWL view accessors and lifecycle", "protege-editor-owl/src/main/java/org/protege/editor/owl/ui/view/AbstractOWLViewComponent.java", 28],
] as const;

const coreExtensionPoints = [
  "ViewComponent",
  "WorkspaceTab",
  "EditorKitMenuAction",
  "ToolBarAction",
  "ViewAction",
  "preferencespanel",
  "explanationpreferencespanel",
  "EditorKitHook",
  "EditorKitFactory",
  "OntologyRepositoryFactory",
  "OntologyLoader",
  "OtherStartupActions",
];

const owlExtensionPoints = [
  "inference_reasonerfactory",
  "inference_preferences",
  "explanation",
  "inconsistentOntologyExplanation",
  "entity_renderer",
  "ui_renderer_entitycolorprovider",
  "ui_editor_description",
  "searchmanager",
  "moveaxiomskit",
  "io_listener",
  "repository",
  "ExtraReasonerMenuAction",
];

export default function ReferencePage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="reference-page">
        <header className="reference-hero">
          <span className="eyebrow">Field notebook</span>
          <h1>Details you need often, without breaking the learning trail.</h1>
          <p>Version-stamped reference for Java idioms, class landmarks, extension points, and investigation commands.</p>
          <code>Source snapshot {SOURCE_COMMIT.slice(0, 7)}</code>
          <p className="audit-stamp">Audited against Matthew Horridge&apos;s Protégé Developer Handbook, dated August 11, 2026, then checked against this source snapshot.</p>
        </header>

        <nav className="reference-nav" aria-label="Field notebook sections">
          <a href="#java">Java time capsule</a>
          <a href="#classes">Class landmarks</a>
          <a href="#extensions">Extension points</a>
          <a href="#search">Search recipes</a>
        </nav>

        <section id="java" className="reference-section">
          <div className="reference-heading">
            <span className="eyebrow">Java time capsule</span>
            <h2>What changed since older Java, and what did not arrive here</h2>
          </div>
          <div className="reference-grid">
            {javaNotes.map(([title, body]) => (
              <article key={title}><h3>{title}</h3><p>{body}</p></article>
            ))}
          </div>
        </section>

        <section id="classes" className="reference-section">
          <div className="reference-heading">
            <span className="eyebrow">Class landmarks</span>
            <h2>Thirteen high-value entry points</h2>
          </div>
          <div className="class-table-wrap">
            <table className="class-table">
              <thead><tr><th>Class</th><th>Responsibility</th><th>Source</th></tr></thead>
              <tbody>
                {classLandmarks.map(([name, role, path, line]) => (
                  <tr key={name}>
                    <td><code>{name}</code></td>
                    <td>{role}</td>
                    <td><a href={sourceUrl(path, line)} target="_blank" rel="noreferrer">{path}:{line} ↗</a></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="extensions" className="reference-section">
          <div className="reference-heading">
            <span className="eyebrow">Plugin surface</span>
            <h2>Extension-point families</h2>
          </div>
          <div className="extension-columns">
            <article>
              <span>editor-core declares 12</span>
              <h3>Desktop framework points</h3>
              <ul className="extension-point-list">
                {coreExtensionPoints.map((point) => <li key={point}><code>{point}</code></li>)}
              </ul>
              <a href={sourceUrl("protege-editor-core/src/main/resources/plugin.xml", 4)} target="_blank" rel="noreferrer">Open declarations ↗</a>
            </article>
            <article>
              <span>editor-owl declares 12</span>
              <h3>Ontology-specific points</h3>
              <ul className="extension-point-list">
                {owlExtensionPoints.map((point) => <li key={point}><code>{point}</code></li>)}
              </ul>
              <a href={sourceUrl("protege-editor-owl/src/main/resources/plugin.xml", 6)} target="_blank" rel="noreferrer">Open declarations ↗</a>
            </article>
          </div>
          <p className="reference-note">These are the 24 first-party extension points in this snapshot. Third-party bundles may declare additional points. Point ids are case-sensitive and must be fully qualified in contributions.</p>
          <a className="inline-journey-link" href="/journeys/extension">Study the complete extension trace →</a>
        </section>

        <section id="search" className="reference-section">
          <div className="reference-heading">
            <span className="eyebrow">Source navigation</span>
            <h2>Search by mechanism</h2>
          </div>
          <div className="search-recipes">
            <article>
              <h3>Find a visible feature</h3>
              <pre><code>{`rg -n "visible label|ClassName" \\
  protege-*/src/main/resources/plugin.xml \\
  protege-*/src/main/java`}</code></pre>
            </article>
            <article>
              <h3>Follow a model event</h3>
              <pre><code>{`rg -n "EVENT_TYPE|fireEvent|addListener" \\
  protege-editor-owl/src/main/java`}</code></pre>
            </article>
            <article>
              <h3>Follow a shipped dependency</h3>
              <pre><code>{`rg -n "artifact-id|package.name" \\
  pom.xml protege-*/pom.xml \\
  protege-desktop/src/main`}</code></pre>
            </article>
            <article>
              <h3>Find extension contract and users</h3>
              <pre><code>{`rg -n "ExtensionPointId|PluginLoader" \\
  protege-*/src/main/resources/plugin.xml \\
  protege-*/src/main/java`}</code></pre>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
