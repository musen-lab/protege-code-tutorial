import type { Metadata } from "next";
import { SiteHeader } from "@/app/components/SiteHeader";
import { SOURCE_COMMIT, sourceUrl } from "@/app/lib/course";
import { sourceRefUrl } from "@/app/lib/course";
import { technologyPrimerList } from "@/app/lib/technologies";

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

type ExtensionPoint = {
  id: string;
  purpose: string;
  declarationLine: number;
  schema?: string;
};

const coreExtensionPoints: ExtensionPoint[] = [
  { id: "ViewComponent", purpose: "Add a configurable, dockable view inside an editor kit.", declarationLine: 8, schema: "ViewComponent.exsd" },
  { id: "WorkspaceTab", purpose: "Add a top-level workspace tab and its default view layout.", declarationLine: 6, schema: "WorkspaceTab.exsd" },
  { id: "EditorKitMenuAction", purpose: "Add a menu, submenu, or action for an editor kit.", declarationLine: 12, schema: "EditorKitMenuAction.exsd" },
  { id: "ToolBarAction", purpose: "Add a grouped action to the main editor-kit toolbar.", declarationLine: 15, schema: "ToolBarAction.exsd" },
  { id: "ViewAction", purpose: "Add an icon action to a specific contributed view.", declarationLine: 10, schema: "ViewAction.exsd" },
  { id: "preferencespanel", purpose: "Add a panel to the application preferences dialog.", declarationLine: 17, schema: "preferencespanel.exsd" },
  { id: "explanationpreferencespanel", purpose: "Add a panel to the explanation preferences dialog.", declarationLine: 20, schema: "explanationpreferencespanel.exsd" },
  { id: "EditorKitHook", purpose: "Install code that is initialized and disposed with a matching editor kit.", declarationLine: 23, schema: "EditorKitHook.exsd" },
  { id: "EditorKitFactory", purpose: "Advertise and create an EditorKit implementation.", declarationLine: 4, schema: "EditorKitFactory.exsd" },
  { id: "OntologyRepositoryFactory", purpose: "Contribute a factory that creates an ontology repository.", declarationLine: 26, schema: "OntologyRepositoryFactory.exsd" },
  { id: "OntologyLoader", purpose: "Declare a loader class associated with an editor-kit id.", declarationLine: 29, schema: "OntologyLoader.exsd" },
  { id: "OtherStartupActions", purpose: "Add an alternate action to the startup window.", declarationLine: 32, schema: "OtherStartupActions.exsd" },
];

const owlExtensionPoints: ExtensionPoint[] = [
  { id: "inference_reasonerfactory", purpose: "Register a selectable OWL reasoner factory.", declarationLine: 6, schema: "ReasonerFactory.exsd" },
  { id: "inference_preferences", purpose: "Add a preferences panel that customizes an inference engine.", declarationLine: 9, schema: "inference_preferences.exsd" },
  { id: "explanation", purpose: "Supply a named explanation service implementation.", declarationLine: 13, schema: "ExplanationServices.exsd" },
  { id: "inconsistentOntologyExplanation", purpose: "Supply a named service for explaining ontology inconsistency.", declarationLine: 14, schema: "InconsistentOntologyServices.exsd" },
  { id: "entity_renderer", purpose: "Add a selectable OWL entity rendering scheme.", declarationLine: 28, schema: "entity_renderer.exsd" },
  { id: "ui_renderer_entitycolorprovider", purpose: "Provide the colors used to render OWL entities.", declarationLine: 16, schema: "EntityColorProvider.exsd" },
  { id: "ui_editor_description", purpose: "Add an indexed editor for OWL class expressions.", declarationLine: 25, schema: "UI_Editor_Description.exsd" },
  { id: "searchmanager", purpose: "Contribute a named SearchManager initialized with the OWL editor kit.", declarationLine: 31 },
  { id: "moveaxiomskit", purpose: "Add a named strategy for moving axioms between ontologies.", declarationLine: 21, schema: "MoveAxiomsKit.exsd" },
  { id: "io_listener", purpose: "Listen to OWL editor-kit input and output activity.", declarationLine: 23 },
  { id: "repository", purpose: "Contribute a CatalogEntryManager for ontology-library entries.", declarationLine: 27 },
  { id: "ExtraReasonerMenuAction", purpose: "Add an extra action to the Reasoner menu.", declarationLine: 29 },
];

const starterExtensionPoints = [
  ["ViewComponent", "a feature panel"],
  ["EditorKitMenuAction", "a menu command"],
  ["WorkspaceTab", "a top-level workspace"],
  ["inference_reasonerfactory", "an OWL reasoner"],
] as const;

function ExtensionPointList({ points, module }: { points: ExtensionPoint[]; module: "core" | "owl" }) {
  const declarationPath = module === "core"
    ? "protege-editor-core/src/main/resources/plugin.xml"
    : "protege-editor-owl/src/main/resources/plugin.xml";
  const schemaRoot = module === "core" ? "protege-editor-core/schema" : "protege-editor-owl/schema";

  return (
    <ul className="extension-point-list">
      {points.map((point) => (
        <li id={`extension-${point.id}`} key={point.id}>
          <code>{point.id}</code>
          <p>{point.purpose}</p>
          <div className="extension-source-links">
            <a href={sourceUrl(declarationPath, point.declarationLine)} target="_blank" rel="noreferrer">declaration ↗</a>
            {point.schema
              ? <a href={sourceUrl(`${schemaRoot}/${point.schema}`, 1)} target="_blank" rel="noreferrer">{point.schema} ↗</a>
              : <span>No .exsd in this snapshot</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}

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
          <a href="#technologies">Technology desk</a>
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

        <section id="technologies" className="reference-section">
          <div className="reference-heading">
            <span className="eyebrow">Technology desk</span>
            <h2>Names the codebase assumes you already know</h2>
            <p>Use this index when a platform or tool name interrupts the code trace. Each entry separates the general technology from the exact role it plays in Protégé.</p>
          </div>
          <div className="technology-index">
            {technologyPrimerList.map((primer) => (
              <article id={`reference-technology-${primer.id}`} key={primer.id}>
                <span>{primer.shortName}</span>
                <h3>{primer.name}</h3>
                <p>{primer.description}</p>
                <details>
                  <summary>Read the primer</summary>
                  {primer.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </details>
                <div className="technology-index-links">
                  {primer.officialLinks.map((link) => (
                    <a href={link.url} key={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>
                  ))}
                  {primer.protegeSources.map((source) => (
                    <a href={sourceRefUrl(source)} key={`${source.path}-${source.line}`} target="_blank" rel="noreferrer">Protégé source: {source.path}:{source.line} ↗</a>
                  ))}
                </div>
              </article>
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
          <aside className="extension-starters" aria-labelledby="extension-starters-title">
            <div>
              <span className="eyebrow">Start with these four</span>
              <h3 id="extension-starters-title">Choose the socket that matches the job</h3>
              <p>Most first plugins do not need the full catalog. Begin with the visible result you want, then follow that point into its declaration and schema.</p>
            </div>
            <ul>
              {starterExtensionPoints.map(([id, result]) => (
                <li key={id}><a href={`#extension-${id}`}><code>{id}</code><span>{result}</span></a></li>
              ))}
            </ul>
          </aside>
          <div className="extension-columns">
            <article>
              <span>editor-core declares 12</span>
              <h3>Desktop framework points</h3>
              <ExtensionPointList points={coreExtensionPoints} module="core" />
              <a href={sourceUrl("protege-editor-core/src/main/resources/plugin.xml", 4)} target="_blank" rel="noreferrer">Open declarations ↗</a>
            </article>
            <article>
              <span>editor-owl declares 12</span>
              <h3>Ontology-specific points</h3>
              <ExtensionPointList points={owlExtensionPoints} module="owl" />
              <a href={sourceUrl("protege-editor-owl/src/main/resources/plugin.xml", 6)} target="_blank" rel="noreferrer">Open declarations ↗</a>
            </article>
          </div>
          <p className="reference-note">These are the 24 first-party extension points in this snapshot. Third-party bundles may declare additional points. Point ids are case-sensitive and must be fully qualified in contributions.</p>
          <a className="inline-journey-link" href="/journeys/extension">Study the complete extension trace →</a>
          <aside className="external-references">
            <h3>Continue with the project community</h3>
            <p>These living resources can change after the pinned source snapshot.</p>
            <ul>
              <li><a href="https://github.com/protegeproject/protege/wiki/Developer-Documentation" target="_blank" rel="noreferrer">Protégé Developer Documentation wiki ↗</a></li>
              <li><a href="https://protege.stanford.edu/support.php" target="_blank" rel="noreferrer">protege-dev mailing list and support ↗</a></li>
              <li><a href={sourceUrl("README.md", 11)} target="_blank" rel="noreferrer">Where the pinned project README names these resources ↗</a></li>
            </ul>
          </aside>
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
