export const SOURCE_COMMIT = "d9c9d392f9d88b5c4dc49a109009e9c460b6fb2b";

export type Tone = "runtime" | "core" | "owl" | "ui" | "data";

export type SourceRef = {
  label: string;
  path: string;
  line?: number;
  note: string;
  url?: string;
};

export type DiagramNode = {
  title: string;
  subtitle: string;
  detail: string;
  tone: Tone;
  source?: SourceRef;
  position?: {
    column: number;
    row: number;
  };
};

export type DiagramSpec = {
  title: string;
  question: string;
  kind?: string;
  columns?: number;
  nodes: DiagramNode[];
  edges: string[];
  connections?: {
    from: string;
    to: string;
    label: string;
  }[];
  caption: string;
};

export type Checkpoint = {
  prompt: string;
  answer: string;
};

export type LessonSection = {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  diagram?: DiagramSpec;
  code?: {
    path: string;
    line: number;
    language: string;
    snippet: string;
    focus: string;
    url?: string;
  };
  exercise?: {
    title: string;
    goal: string;
    path: string;
    steps: string[];
    commands?: string;
    verify: string[];
  };
  javaNote?: {
    title: string;
    body: string;
  };
  bridge?: {
    title: string;
    useful: string;
    limit: string;
  };
  checkpoint?: Checkpoint;
};

export type Lesson = {
  slug: string;
  number: number;
  title: string;
  question: string;
  summary: string;
  duration: string;
  outcomes: string[];
  sections: LessonSection[];
  capability: string;
  sourceRefs: SourceRef[];
};

export function sourceUrl(path: string, line?: number) {
  const anchor = line ? `#L${line}` : "";
  return `https://github.com/protegeproject/protege/blob/${SOURCE_COMMIT}/${path}${anchor}`;
}

export function sourceRefUrl(source: SourceRef) {
  return source.url ?? sourceUrl(source.path, source.line);
}

const src = (label: string, path: string, line: number | undefined, note: string, url?: string): SourceRef => ({
  label,
  path,
  line,
  note,
  url,
});

const PLUGIN_EXAMPLE_COMMIT = "d879601324d0c45d99e0d0879219ef15763ced50";
const PLUGIN_EXAMPLE_URL = `https://github.com/protegeproject/protege-plugin-examples/blob/${PLUGIN_EXAMPLE_COMMIT}`;
const CELLFIE_COMMIT = "1dd0896c8dd07b4f764d40225e374a5dc15a5d28";
const CELLFIE_URL = `https://github.com/protegeproject/cellfie-plugin/blob/${CELLFIE_COMMIT}`;
const EXISTENTIAL_QUERY_JAR_URL = "https://repo1.maven.org/maven2/edu/stanford/protege/existentialquery/2.0.0/existentialquery-2.0.0.jar";

export const lessons: Lesson[] = [
  {
    slug: "landscape",
    number: 1,
    title: "Survey the landscape",
    question: "What kind of system is Protégé, and where does responsibility live?",
    summary: "Build the stable map you will reuse in every later trace: five Maven modules, three runtime integration mechanisms, and one crucial framework boundary.",
    duration: "25 min",
    outcomes: [
      "Place an unfamiliar class in one of the five modules.",
      "Distinguish Maven dependencies from OSGi runtime wiring.",
      "Explain why editor-core must not know about OWL.",
    ],
    sections: [
      {
        id: "five-parts",
        eyebrow: "Orientation",
        title: "Five modules, three different jobs",
        paragraphs: [
          "The repository is one Maven reactor, but its five modules do not form five equal application layers. Launcher creates the runtime. Common supplies one early XML service. Editor-core supplies a domain-neutral desktop framework. Editor-owl supplies the ontology model and almost all visible features. Desktop packages the result.",
          "The first useful compression is to remember responsibility, not file count. A packaging problem begins in desktop. A framework or plugin-loading problem begins in editor-core. An ontology or visible editor behavior usually begins in editor-owl.",
        ],
        diagram: {
          title: "The five-part responsibility map",
          question: "If a behavior changes, which module should you inspect first?",
          kind: "Architecture diagram",
          columns: 4,
          nodes: [
            { title: "protege-desktop", subtitle: "Package and configure", detail: "No Java source. Owns assemblies, launch scripts, config.xml, logging configuration, and bundled runtime layout.", tone: "runtime", position: { column: 2, row: 1 }, source: src("desktop POM", "protege-desktop/pom.xml", 1, "Packaging module and platform assemblies") },
            { title: "protege-launcher", subtitle: "Create the container", detail: "The only code that begins on the plain JVM classpath. It parses config.xml, starts Felix, installs bundles, and manages shutdown.", tone: "runtime", position: { column: 1, row: 2 }, source: src("Launcher", "protege-launcher/src/main/java/org/protege/osgi/framework/Launcher.java", 21, "Plain-JVM bootstrap") },
            { title: "protege-common", subtitle: "Prepare XML parsing", detail: "One activator registers SAXParserFactory at start level 1 so Equinox can parse extension declarations.", tone: "runtime", position: { column: 2, row: 2 }, source: src("Common activator", "protege-common/src/main/java/org/protege/common/Activator.java", 1, "Early OSGi service") },
            { title: "protege-editor-core", subtitle: "Host an editor", detail: "Domain-neutral Swing shell, editor-kit seam, extension registry adapters, workspace, preferences, logging, and plugin updates.", tone: "core", position: { column: 3, row: 2 }, source: src("EditorKit", "protege-editor-core/src/main/java/org/protege/editor/core/editorkit/EditorKit.java", 39, "Framework seam") },
            { title: "protege-editor-owl", subtitle: "Edit OWL", detail: "OWL API facade, ontology I/O, reasoning, history, rendering, search, and the large Swing feature set.", tone: "owl", position: { column: 4, row: 2 }, source: src("OWLEditorKit", "protege-editor-owl/src/main/java/org/protege/editor/owl/OWLEditorKit.java", 50, "OWL application assembly") },
          ],
          edges: [],
          connections: [
            { from: "protege-desktop", label: "packages", to: "protege-launcher" },
            { from: "protege-desktop", label: "packages", to: "protege-common" },
            { from: "protege-desktop", label: "packages", to: "protege-editor-core" },
            { from: "protege-desktop", label: "packages", to: "protege-editor-owl" },
            { from: "protege-launcher", label: "starts", to: "protege-common" },
            { from: "protege-launcher", label: "starts", to: "protege-editor-core" },
            { from: "protege-launcher", label: "starts", to: "protege-editor-owl" },
            { from: "protege-editor-core", label: "implemented by", to: "protege-editor-owl" },
          ],
          caption: "Desktop is build-time assembly. Launcher and common establish the runtime. Core hosts editor kinds. Editor-owl is the principal editor kind.",
        },
      },
      {
        id: "two-directions",
        eyebrow: "Architecture",
        title: "Build-time arrows and runtime arrows point differently",
        paragraphs: [
          "Maven dependencies are deliberately one-way. Editor-owl depends on editor-core, common, and launcher. Editor-core and common each depend on launcher. Desktop depends on all four modules so it can package them. Core imports no OWL classes. At runtime, core discovers an OWL editor factory through the Equinox extension registry. The implementation therefore plugs back into the framework without a reverse compile-time dependency.",
          "This distinction prevents a common reading mistake. A source import answers who can call whose exported Java API. A plugin.xml contribution answers who can appear at runtime without the host importing the contributor.",
        ],
        diagram: {
          title: "Two wiring systems over the same modules",
          question: "How can editor-core create an OWL editor without importing it?",
          kind: "Dependency diagram",
          nodes: [
            { title: "editor-owl", subtitle: "Maven depends on core", detail: "Uses EditorKit, Workspace, ViewComponent, preferences, and the plugin loader APIs exported by core.", tone: "owl" },
            { title: "editor-core", subtitle: "Declares EditorKitFactory", detail: "Defines the editor contract and asks the extension registry for contributions. It never imports OWLEditorKitFactory.", tone: "core" },
            { title: "Equinox registry", subtitle: "Runtime lookup", detail: "Reads plugin.xml contributions and retains the contributing bundle, extension point, and configuration elements.", tone: "runtime" },
            { title: "OWLEditorKitFactory", subtitle: "Runtime contribution", detail: "Editor-owl names this class in plugin.xml. Core instantiates it through the contributor's bundle classloader.", tone: "owl" },
          ],
          edges: ["compile-time use", "declares point", "discovers", "creates"],
          caption: "The compile-time dependency stays one-way. The runtime registry supplies the reverse connection.",
        },
        checkpoint: {
          prompt: "A new OWL-specific view needs AbstractOWLViewComponent. Which module owns it, and does core need to change?",
          answer: "It belongs in editor-owl or a separate plugin bundle. Core already declares the generic ViewComponent extension point, so core should not gain an OWL dependency.",
        },
      },
      {
        id: "central-seam",
        eyebrow: "Class relationship",
        title: "EditorKit pairs model and workspace",
        paragraphs: [
          "EditorKit is the central domain-neutral seam. One editor kit owns one ModelManager and one Workspace, plus lifecycle methods for new, load, save, and disposal. OWLEditorKit specializes this relationship with OWLModelManager and OWLWorkspace.",
          "OWLEditorKit keeps both concrete objects in final fields. The model manager and workspace do not hold direct references to each other. The workspace reaches the model through its editor kit, and it owns the OWLSelectionModel that coordinates selection across views.",
          "This is not dependency injection in the Angular sense. The application discovers an EditorKitFactory, calls it, and the resulting editor kit performs its own assembly. The object graph is explicit and lifecycle-heavy.",
        ],
        diagram: {
          title: "Core contract and OWL implementation",
          question: "Which objects define one open Protégé window?",
          kind: "Class and ownership diagram",
          columns: 4,
          nodes: [
            { title: "ModelManager", subtitle: "generic model contract", detail: "The core-facing model abstraction owned by an EditorKit.", tone: "core", position: { column: 1, row: 1 } },
            { title: "EditorKit", subtitle: "generic editor contract", detail: "Exposes id, factory, workspace, model manager, load/save behavior, dirty state, and per-kit disposable storage.", tone: "core", position: { column: 2, row: 1 }, source: src("EditorKit interface", "protege-editor-core/src/main/java/org/protege/editor/core/editorkit/EditorKit.java", 39, "Central contract") },
            { title: "Workspace", subtitle: "generic UI contract", detail: "The core Swing workspace paired with a model through its EditorKit.", tone: "core", position: { column: 3, row: 1 } },
            { title: "OWLModelManagerImpl", subtitle: "OWL model implementation", detail: "The application facade around the OWL API manager, history, reasoners, rendering, search, and events.", tone: "data", position: { column: 1, row: 2 } },
            { title: "OWLEditorKit", subtitle: "OWL composition root", detail: "Constructs OWLModelManagerImpl and OWLWorkspace, runs hooks, registers the kit as an OSGi service, then initializes the workspace.", tone: "owl", position: { column: 2, row: 2 }, source: src("OWLEditorKit constructor", "protege-editor-owl/src/main/java/org/protege/editor/owl/OWLEditorKit.java", 83, "OWL object graph assembly") },
            { title: "OWLWorkspace", subtitle: "OWL Swing workspace", detail: "Reaches the model through the editor kit, listens to model events, and coordinates visible editor state.", tone: "ui", position: { column: 3, row: 2 } },
            { title: "OWLSelectionModel", subtitle: "workspace-owned selection", detail: "Stores the selected OWL object and lets selection-aware views coordinate through the workspace.", tone: "ui", position: { column: 4, row: 2 } },
          ],
          edges: [],
          connections: [
            { from: "EditorKit", label: "model", to: "ModelManager" },
            { from: "EditorKit", label: "UI", to: "Workspace" },
            { from: "ModelManager", label: "implemented by", to: "OWLModelManagerImpl" },
            { from: "EditorKit", label: "implemented by", to: "OWLEditorKit" },
            { from: "Workspace", label: "implemented by", to: "OWLWorkspace" },
            { from: "OWLEditorKit", label: "owns", to: "OWLModelManagerImpl" },
            { from: "OWLEditorKit", label: "owns", to: "OWLWorkspace" },
            { from: "OWLWorkspace", label: "owns", to: "OWLSelectionModel" },
          ],
          caption: "Treat the editor kit as the lifetime boundary for one open editor window and its model/UI pair.",
        },
        bridge: {
          title: "Rails and Angular bridge",
          useful: "EditorKit resembles a per-window application container that binds a domain service graph to a UI workspace.",
          limit: "There is no request scope, Angular injector, or framework-managed component tree. Construction and disposal are explicit Java calls and plugin lifecycles.",
        },
      },
    ],
    capability: "You can place new code in the correct module and explain the core-to-OWL boundary.",
    sourceRefs: [
      src("Parent reactor", "pom.xml", 86, "Five-module build order"),
      src("Core plugin declarations", "protege-editor-core/src/main/resources/plugin.xml", 4, "Framework extension points"),
      src("OWL editor contribution", "protege-editor-owl/src/main/resources/plugin.xml", 36, "Runtime link into core"),
    ],
  },
  {
    slug: "startup",
    number: 2,
    title: "Start the application",
    question: "How does a shell script become a populated Swing window?",
    summary: "Trace the boundary from the plain JVM classpath into Felix, through ordered bundles, and finally into deferred application startup.",
    duration: "30 min",
    outcomes: [
      "Trace run.sh through Launcher.main and Felix.",
      "Explain the five OSGi start levels.",
      "Explain why ProtegeApplication waits for FrameworkEvent.STARTED.",
    ],
    sections: [
      {
        id: "plain-jvm",
        eyebrow: "Execution trace",
        title: "Only the launcher begins outside OSGi",
        paragraphs: [
          "The distribution's run script builds a deliberately small classpath and invokes Launcher.main. Launcher records command-line arguments as system properties, parses conf/config.xml, finds the OSGi FrameworkFactory through Java's service-provider mechanism, creates a fresh Felix cache, and installs bundles.",
          "This plain-JVM phase explains why launcher is both bootstrap code and a dependency carrier. Everything after framework.start runs behind OSGi classloaders and exported-package rules.",
        ],
        code: {
          path: "protege-launcher/src/main/java/org/protege/osgi/framework/Launcher.java",
          line: 234,
          language: "java",
          snippet: `public static void main(String[] args) throws Exception {
    setArguments(args);
    String config = System.getProperty(
        LAUNCH_LOCATION_PROPERTY,
        DEFAULT_CONFIG_XML_FILE_PATH_NAME);
    File configFile = PROTEGE_DIR != null
        ? new File(PROTEGE_DIR, config)
        : new File(config);
    new Launcher(configFile).start(true);
}`,
          focus: "The main method locates configuration and hands all bootstrap work to Launcher.",
        },
        javaNote: {
          title: "Try-with-resources and service providers",
          body: "Launcher uses try-with-resources when reading META-INF/services/org.osgi.framework.launch.FrameworkFactory. Java closes the reader automatically. The service-provider file supplies Felix's FrameworkFactory class without hard-coding it.",
        },
      },
      {
        id: "start-levels",
        eyebrow: "Runtime architecture",
        title: "Start order is application architecture",
        paragraphs: [
          "Each bundles element in config.xml becomes one start level. Common registers SAXParserFactory first. Equinox starts next. Registry, JAXB, and editor-core start after that. Application bundles follow. User and bundled plugins start last.",
          "The ordering is not inferred from Java dependencies. It is hand-authored configuration using literal post-assembly JAR names. That makes config.xml part of the architecture, not incidental deployment detail.",
        ],
        diagram: {
          title: "Felix start-level staircase",
          question: "What must exist before extensions can be enumerated?",
          kind: "Runtime architecture diagram",
          nodes: [
            { title: "Level 1", subtitle: "protege-common", detail: "Registers SAXParserFactory before Equinox needs to parse registry XML.", tone: "runtime" },
            { title: "Level 2", subtitle: "Equinox base", detail: "Starts common and supplement runtime bundles.", tone: "runtime" },
            { title: "Level 3", subtitle: "registry + editor-core", detail: "Starts the extension registry, JAXB, and the domain-neutral application framework.", tone: "core" },
            { title: "Level 4", subtitle: "application bundles", detail: "Starts editor-owl, OWL API, launcher bundle copy, and other shipped bundles.", tone: "owl" },
            { title: "Level 5", subtitle: "plugins", detail: "Starts bundled and per-user plugins only after their host packages and extension points exist.", tone: "ui" },
          ],
          edges: ["before", "before", "before", "before"],
          caption: "Felix begins at the highest configured level, which guarantees lower levels have already started.",
        },
        checkpoint: {
          prompt: "Why would moving editor-core to the final start level risk an empty application?",
          answer: "Core owns the extension registry adapters and application startup listener. Its real startup waits for all bundles, but the bundle and registry services must already exist before the final application assembly begins.",
        },
      },
      {
        id: "deferred-start",
        eyebrow: "Sequence",
        title: "The core activator intentionally does almost nothing",
        paragraphs: [
          "ProtegeApplication.start registers a FrameworkListener. It does not enumerate editor factories immediately. Only FrameworkEvent.STARTED triggers reallyStart, after level 4 and level 5 bundles have contributed their plugin.xml entries.",
          "reallyStart binds platform services, initializes plugin utilities and look-and-feel, initializes ProtegeManager, then opens command-line ontologies or the default editor. This delay is the difference between a populated registry and an apparently plugin-free application.",
        ],
        diagram: {
          title: "Startup sequence across runtime boundaries",
          question: "When is it safe to discover editor factories?",
          kind: "Startup sequence diagram",
          nodes: [
            { title: "run.sh", subtitle: "OS process", detail: "Chooses Java and JVM settings, then invokes Launcher with a minimal classpath.", tone: "runtime" },
            { title: "Launcher", subtitle: "plain JVM", detail: "Parses config, creates Felix, installs bundles, assigns start levels, and starts the framework.", tone: "runtime" },
            { title: "ProtegeApplication.start", subtitle: "OSGi level 3", detail: "Binds logging and installs a FrameworkListener. It deliberately does not build the app yet.", tone: "core" },
            { title: "FrameworkEvent.STARTED", subtitle: "all levels ready", detail: "Signals that application and third-party plugin contributions now exist in the registry.", tone: "runtime" },
            { title: "reallyStart", subtitle: "application assembly", detail: "Initializes plugin utilities and managers, then creates or loads an editor kit.", tone: "core" },
            { title: "WorkspaceFrame", subtitle: "visible Swing UI", detail: "The editor kit manager installs the new kit and frame after its model and workspace initialize.", tone: "ui" },
          ],
          edges: ["executes", "starts", "waits", "triggers", "creates"],
          caption: "The critical pause occurs between bundle activation and application assembly.",
        },
        code: {
          path: "protege-editor-core/src/main/java/org/protege/editor/core/ProtegeApplication.java",
          line: 85,
          language: "java",
          snippet: `public void start(final BundleContext context) {
    logManager.bind();
    context.addFrameworkListener(event -> {
        if (event.getType() == FrameworkEvent.STARTED) {
            reallyStart(context);
        }
    });
}`,
          focus: "The lambda captures context and defers application assembly until the framework is complete.",
        },
        javaNote: {
          title: "Lambda as a listener implementation",
          body: "event -> { ... } implements the single abstract method of FrameworkListener. It is similar to a TypeScript callback, but the target interface type is inferred from addFrameworkListener's parameter.",
        },
      },
    ],
    capability: "You can diagnose which startup layer failed before chasing UI code.",
    sourceRefs: [
      src("Launcher startup", "protege-launcher/src/main/java/org/protege/osgi/framework/Launcher.java", 97, "Install and start bundles"),
      src("Start-level configuration", "protege-desktop/src/main/felix/conf/config.xml", 1, "Runtime order"),
      src("Deferred application start", "protege-editor-core/src/main/java/org/protege/editor/core/ProtegeApplication.java", 85, "Framework listener"),
    ],
  },
  {
    slug: "open-ontology",
    number: 3,
    title: "Open an ontology",
    question: "Who receives a file after the user clicks Open?",
    summary: "Follow the most important end-to-end path through core, editor-owl, Swing threading, OWL API loading, IRI mapping, and model events.",
    duration: "40 min",
    outcomes: [
      "Trace Open from generic action to OWL API.",
      "Explain the EditorKitFactory runtime seam.",
      "Explain the EDT-to-worker-to-EDT flow.",
    ],
    sections: [
      {
        id: "factory-seam",
        eyebrow: "Runtime discovery",
        title: "Core asks for an editor kind, not an OWL class",
        paragraphs: [
          "ProtegeManager loads EditorKitFactory plugins from the registry. Editor-owl contributes OWLEditorKitFactory in plugin.xml. When a URI is opened, the manager instantiates that factory, asks it for an editor kit, and calls the generic handleLoadFrom contract.",
          "The call becomes OWL-specific only after dynamic instantiation. This is the same boundary you protect when adding new behavior: core owns the workflow, while editor-owl owns ontology semantics.",
        ],
        diagram: {
          title: "The factory handoff",
          question: "Where does generic framework code become OWL-specific?",
          kind: "Runtime handoff diagram",
          nodes: [
            { title: "OpenAction", subtitle: "core UI action", detail: "Asks ProtegeManager to open an editor kit. It does not import OWL classes.", tone: "core" },
            { title: "ProtegeManager", subtitle: "editor lifecycle", detail: "Gets an EditorKitFactory from its plugin wrapper and creates a new kit for the URI.", tone: "core", source: src("Create for URI", "protege-editor-core/src/main/java/org/protege/editor/core/ProtegeManager.java", 164, "Generic load workflow") },
            { title: "EditorKitFactoryPlugin", subtitle: "registry wrapper", detail: "Represents the EditorKitFactory contribution declared by editor-owl.", tone: "runtime" },
            { title: "OWLEditorKitFactory", subtitle: "OWL implementation", detail: "Constructs OWLEditorKit. This is the first concrete OWL class in the trace.", tone: "owl", source: src("OWL factory", "protege-editor-owl/src/main/java/org/protege/editor/owl/OWLEditorKitFactory.java", 25, "Concrete editor factory") },
            { title: "OWLEditorKit.handleLoadFrom", subtitle: "OWL load entry", detail: "Delegates physical URI loading to OWLModelManagerImpl and updates recent-file state.", tone: "owl" },
          ],
          edges: ["delegates", "unwraps", "instantiates", "loads"],
          caption: "The extension registry makes OWLEditorKitFactory visible to core without reversing the source dependency.",
        },
      },
      {
        id: "object-assembly",
        eyebrow: "Object graph",
        title: "OWLEditorKit is the assembly point",
        paragraphs: [
          "The constructor creates OWLModelManagerImpl and OWLWorkspace, calls workspace.setup, runs EditorKitHook contributions, installs search and I/O listeners, registers the kit as an OSGi service, then initializes the workspace.",
          "The ordering is deliberate. Hooks run after the workspace object exists but before it is populated with tabs and views. Plugins can therefore attach behavior before the visible UI is built.",
        ],
        diagram: {
          title: "One OWL editor kit under construction",
          question: "What must exist before workspace.initialise()?",
          kind: "Object construction diagram",
          nodes: [
            { title: "OWLEditorKit", subtitle: "lifetime owner", detail: "Owns the concrete model and workspace and coordinates their setup and disposal.", tone: "owl" },
            { title: "OWLModelManagerImpl", subtitle: "domain facade", detail: "Constructs the concurrent ontology manager, history, reasoner, renderer, finder, caches, and policies.", tone: "data" },
            { title: "OWLWorkspace", subtitle: "UI shell", detail: "Is created and receives setup(editorKit), but does not load its tabs yet.", tone: "ui" },
            { title: "EditorKitHooks", subtitle: "plugin lifecycle", detail: "Run with a live model manager and a constructed workspace before the UI is populated.", tone: "runtime" },
            { title: "I/O listeners + search", subtitle: "collaborators", detail: "Load from OWL extension points and attach to the model and editor kit.", tone: "owl" },
            { title: "workspace.initialise", subtitle: "build visible UI", detail: "Loads tab contributions, their layout descriptors, and view components last.", tone: "ui" },
          ],
          edges: ["creates", "sets up", "runs", "installs", "then initializes"],
          caption: "The editor kit is a manual composition root, with hooks inserted before visible UI initialization.",
        },
        code: {
          path: "protege-editor-owl/src/main/java/org/protege/editor/owl/OWLEditorKit.java",
          line: 83,
          language: "java",
          snippet: `modelManager = new OWLModelManagerImpl();
workspace = new OWLWorkspace();
workspace.setup(this);
Initializers.loadEditorKitHooks(this);
searchManagerSelector = new SearchManagerSelector(this);
loadIOListenerPlugins();
registration = ProtegeOWL.getBundleContext()
    .registerService(EditorKit.class.getCanonicalName(), this, new Hashtable<>());
workspace.initialise();`,
          focus: "Construction order creates plugin seams before loading tabs and views.",
        },
      },
      {
        id: "thread-handoff",
        eyebrow: "Threading trace",
        title: "Enter on the EDT, load on a worker, report back on the EDT",
        paragraphs: [
          "OntologyLoader requires its public entry point to be called on Swing's Event Dispatch Thread. It then submits the expensive OWL API load to a single-thread executor and shows a modal progress dialog. The dialog runs a nested event loop, so the EDT can continue painting and processing UI events while result.get waits in the calling stack.",
          "The worker creates a separate loading manager, installs ordered IRI mappers, loads the root and imports, moves them into the application's ontology manager, sets the active ontology, and emits ONTOLOGY_LOADED.",
        ],
        diagram: {
          title: "Ontology load across thread lanes",
          question: "Why does loadOntology both assert the EDT and use an executor?",
          kind: "Thread sequence diagram",
          nodes: [
            { title: "EDT: handleLoadFrom", subtitle: "UI entry", detail: "The user gesture and editor-kit lifecycle begin on the Event Dispatch Thread.", tone: "ui" },
            { title: "EDT: assert + submit", subtitle: "OntologyLoader", detail: "Rejects off-EDT calls, submits loadOntologyInternal to a single worker, then shows a modal ProgressDialog.", tone: "owl" },
            { title: "Worker: OWL API load", subtitle: "separate manager", detail: "Uses user, web, and catalog IRI mappers; missing imports are handled silently and reported through UI handlers.", tone: "data" },
            { title: "Worker: move ontologies", subtitle: "application manager", detail: "Copies newly loaded ontologies with OntologyCopy.MOVE and fires before/after I/O listener callbacks.", tone: "data" },
            { title: "Model event", subtitle: "ONTOLOGY_LOADED", detail: "Sets the active ontology, fires a coarse model-manager event, and schedules listeners on the EDT when needed.", tone: "owl" },
            { title: "EDT: workspace reacts", subtitle: "views update", detail: "Model listeners update tabs, views, titles, renderers, and other visible state.", tone: "ui" },
          ],
          edges: ["submits", "executes", "moves", "fires", "notifies"],
          caption: "The public method enforces the UI entry contract. The heavy work occurs on a dedicated worker while the modal dialog keeps the UI event loop alive.",
        },
        code: {
          path: "protege-editor-owl/src/main/java/org/protege/editor/owl/model/io/OntologyLoader.java",
          line: 57,
          language: "java",
          snippet: `public Optional<OWLOntology> loadOntology(URI documentUri)
        throws OWLOntologyCreationException {
    if (!SwingUtilities.isEventDispatchThread()) {
        throw new IllegalStateException(
            "The ontology loader must be called from the Event Dispatch Thread");
    }
    return loadOntologyInOtherThread(documentUri);
}`,
          focus: "The entry contract is explicit. Internal work moves to a single-thread executor.",
        },
        javaNote: {
          title: "Two Optional types coexist",
          body: "This file uses java.util.Optional, while OWLEditorKit still imports Guava Optional. Let the import decide which API you are reading. Java Optional has ofNullable, map, flatMap, and orElse. Guava 18 uses absent, fromNullable, transform, and or.",
        },
        checkpoint: {
          prompt: "Where would you add logic that must observe every ontology load without changing the loader itself?",
          answer: "Use the editor-owl io_listener extension point. OWLEditorKit loads those plugins before the workspace is initialized, and OntologyLoader fires before/after callbacks around each moved ontology.",
        },
      },
    ],
    capability: "You can trace and debug an ontology-open failure across registry, UI, worker, and model layers.",
    sourceRefs: [
      src("Generic URI load", "protege-editor-core/src/main/java/org/protege/editor/core/ProtegeManager.java", 164, "Framework side of the seam"),
      src("OWL assembly", "protege-editor-owl/src/main/java/org/protege/editor/owl/OWLEditorKit.java", 83, "Composition root"),
      src("Ontology loading", "protege-editor-owl/src/main/java/org/protege/editor/owl/model/io/OntologyLoader.java", 57, "Thread and OWL API path"),
    ],
  },
  {
    slug: "screen",
    number: 4,
    title: "Build the screen",
    question: "Where do Protégé's tabs and panels actually come from?",
    summary: "See how a small set of Java abstractions combines with hundreds of plugin.xml entries and XML layouts to assemble the UI at runtime.",
    duration: "35 min",
    outcomes: [
      "Place WorkspaceFrame, Workspace, tab, view, and component in a containment model.",
      "Trace a plugin.xml ViewComponent into a live Java instance.",
      "Find the three files involved in adding a default view.",
    ],
    sections: [
      {
        id: "containment",
        eyebrow: "UI architecture",
        title: "One frame contains a declaratively assembled workspace",
        paragraphs: [
          "A WorkspaceFrame belongs to one EditorKit. Its Workspace is usually a TabbedWorkspace. Each WorkspaceTab hosts a ViewsPane whose docked View containers hold ViewComponent instances. The visible ontology features are primarily contributions, not hard-coded constructor calls.",
          "This containment model matters when tracking lifecycle. Closing an editor kit disposes its workspace, tabs, views, listeners, and per-kit scratch objects. A leak often means a listener or disposable escaped this chain.",
        ],
        diagram: {
          title: "Swing containment and lifecycle",
          question: "Which object owns the component you can see?",
          kind: "UI containment diagram",
          nodes: [
            { title: "WorkspaceFrame", subtitle: "JFrame", detail: "One top-level window installed for an EditorKit.", tone: "ui" },
            { title: "OWLWorkspace", subtitle: "TabbedWorkspace", detail: "The concrete workspace for the OWL editor kind. It coordinates menu, toolbar, model events, and visible tabs.", tone: "ui" },
            { title: "OWLWorkspaceViewsTab", subtitle: "WorkspaceTab", detail: "A contributed top-level tab with a layout resource such as viewconfig-classestab.xml.", tone: "ui" },
            { title: "ViewsPane", subtitle: "dock layout", detail: "Restores split, dock, float, and visible-view state from an XML memento.", tone: "core" },
            { title: "View", subtitle: "container chrome", detail: "Provides title bar, controls, split/float behavior, and a location for one ViewComponent.", tone: "core" },
            { title: "AbstractOWLViewComponent", subtitle: "feature panel", detail: "A concrete OWL view initializes its UI, listens to editor/model state, and disposes resources.", tone: "owl" },
          ],
          edges: ["contains", "loads", "hosts", "creates", "wraps"],
          caption: "Core owns the generic containers. Editor-owl contributes concrete tabs, layouts, and view components.",
        },
      },
      {
        id: "declarative-ui",
        eyebrow: "Contribution flow",
        title: "Three artifacts place a default view on screen",
        paragraphs: [
          "The Java class implements behavior. plugin.xml makes it discoverable as a ViewComponent and supplies label, category, color, and applicability. A viewconfig XML file places the contribution in a default tab layout.",
          "Leaving out the plugin entry means the class is never discovered. Leaving out the layout entry means users may add it manually, but it does not appear in that tab by default. This separation is intentional customization infrastructure.",
        ],
        diagram: {
          title: "Declarative UI assembly",
          question: "Why can a correct Java class still be absent from the UI?",
          kind: "Contribution flow diagram",
          nodes: [
            { title: "View class", subtitle: "behavior", detail: "Extends ViewComponent or AbstractOWLViewComponent and implements initialize/dispose behavior.", tone: "owl" },
            { title: "plugin.xml", subtitle: "discovery metadata", detail: "Registers the class on core's ViewComponent extension point with id, label, category, and editorKitId.", tone: "runtime", source: src("Class description contribution", "protege-editor-owl/src/main/resources/plugin.xml", 442, "View registration") },
            { title: "viewconfig-*.xml", subtitle: "default placement", detail: "Names view ids in a split/dock layout used by a WorkspaceTab contribution.", tone: "ui" },
            { title: "WorkspaceTabPluginLoader", subtitle: "tab discovery", detail: "Loads matching tab contributions and sorts them by string index.", tone: "core" },
            { title: "ViewComponentPluginLoader", subtitle: "view discovery", detail: "Instantiates matching view contributions through the registry and bundle classloader.", tone: "core" },
            { title: "Visible panel", subtitle: "live component", detail: "The ViewsPane wraps the component, restores layout, and participates in disposal.", tone: "ui" },
          ],
          edges: ["registers", "places", "loads tab", "loads view", "renders"],
          caption: "Behavior, discoverability, and default placement are separate concerns.",
        },
        checkpoint: {
          prompt: "You added a ViewComponent extension and can add it manually, but it does not appear on the Classes tab after resetting preferences. What is missing?",
          answer: "The view id must be added to viewconfig-classestab.xml, or another layout resource referenced by that WorkspaceTab contribution.",
        },
      },
      {
        id: "tab-initialization",
        eyebrow: "Source reading",
        title: "User state decides which contributed tabs appear",
        paragraphs: [
          "TabbedWorkspace.initialise reads remembered visible tab ids. On first run, it shows contributions marked protegeDefaultTab. On later runs, it restores exactly the remembered set. Contributions are combined with custom user tabs and ordered by their string index.",
          "The method catches failures around individual tabs: a tab that was constructed but failed to load is filled with an error panel, while a tab whose instantiation threw is only logged. This is part of the project's broader philosophy: one broken plugin should degrade one feature, not prevent the application window from opening.",
        ],
        code: {
          path: "protege-editor-core/src/main/java/org/protege/editor/core/ui/workspace/TabbedWorkspace.java",
          line: 40,
          language: "java",
          snippet: `public void initialise() {
    final List<String> visibleTabs =
        new TabbedWorkspaceStateManager().getTabs();
    for (WorkspaceTabPlugin plugin : getOrderedPlugins()) {
        if (visibleTabs.isEmpty() && plugin.isProtegeDefaultTab()) {
            addTabForPlugin(plugin);
        }
        else if (visibleTabs.contains(plugin.getId())) {
            addTabForPlugin(plugin);
        }
    }
}`,
          focus: "Registry contributions are filtered by persisted workspace state before instantiation.",
        },
        bridge: {
          title: "Angular bridge",
          useful: "plugin.xml plus a viewconfig file resembles route/component metadata plus a user-configurable layout registry.",
          limit: "There is no template compiler or dependency injector creating the tree. Equinox returns metadata, Protégé's loaders instantiate classes, and Swing containers own the resulting components.",
        },
      },
    ],
    capability: "You can add, locate, or debug a tab or view without wandering through 763 UI classes.",
    sourceRefs: [
      src("Tabbed workspace", "protege-editor-core/src/main/java/org/protege/editor/core/ui/workspace/TabbedWorkspace.java", 23, "Tab loading and lifecycle"),
      src("OWL tab contributions", "protege-editor-owl/src/main/resources/plugin.xml", 310, "Declarative tabs"),
      src("Classes layout", "protege-editor-owl/src/main/resources/viewconfig-classestab.xml", 1, "Default view placement"),
    ],
  },
  {
    slug: "change",
    number: 5,
    title: "Make a change",
    question: "How does one UI edit become ontology state, history, and a refreshed view?",
    summary: "Trace OWLOntologyChange lists through the model facade, change minimization, OWL API listeners, dirty tracking, undo/redo, caches, and UI reactions.",
    duration: "40 min",
    outcomes: [
      "Use OWLModelManager as the change boundary.",
      "Distinguish coarse model events from axiom-level changes.",
      "Explain how one user action becomes one undoable unit.",
    ],
    sections: [
      {
        id: "change-boundary",
        eyebrow: "Execution trace",
        title: "Changes should cross the model-manager facade",
        paragraphs: [
          "Editors and actions create one or more OWLOntologyChange objects, then call OWLModelManager.applyChanges. The implementation optionally rewrites anonymous-defined-class changes, minimizes redundant operations, and delegates the final list to OWLOntologyManager.",
          "Application features should not call the raw ontology manager's applyChanges method. A direct call can still reach registered OWL API listeners in this implementation, including OWLModelManagerImpl itself, but it skips the facade's rewrite and minimization policy. Use OWLModelManager as the stable application boundary.",
        ],
        code: {
          path: "protege-editor-owl/src/main/java/org/protege/editor/owl/model/OWLModelManagerImpl.java",
          line: 716,
          language: "java",
          snippet: `public void applyChanges(List<? extends OWLOntologyChange> changes) {
    changes = rewriteIfNeeded(changes);
    List<OWLOntologyChange> minimizedChanges =
        new ChangeListMinimizer().getMinimisedChanges(changes);
    if (minimizedChanges.isEmpty()) {
        return;
    }
    manager.applyChanges(minimizedChanges);
}`,
          focus: "The excerpt condenses the real method to emphasize rewrite, minimization, and the OWL API handoff.",
        },
        javaNote: {
          title: "Bounded wildcards",
          body: "List<? extends OWLOntologyChange> accepts a list whose element type is OWLOntologyChange or a subtype. You can read each element as OWLOntologyChange, but cannot safely add arbitrary changes to the caller's list.",
        },
      },
      {
        id: "two-event-channels",
        eyebrow: "Event architecture",
        title: "Two event channels answer different questions",
        paragraphs: [
          "OWL API ontology-change listeners receive exact change lists such as AddAxiom, RemoveAxiom, or SetOntologyID. Protégé uses these for dirty tracking, history, import-closure updates, and feature-level reactions.",
          "OWLModelManagerListener receives coarse application events such as ONTOLOGY_LOADED, ACTIVE_ONTOLOGY_CHANGED, REASONER_CHANGED, or ENTITY_RENDERER_CHANGED. These events say that a subsystem state changed, not which axioms changed.",
        ],
        diagram: {
          title: "One edit, two notification channels",
          question: "Should a listener inspect axioms or react to application state?",
          kind: "Event sequence diagram",
          nodes: [
            { title: "UI editor", subtitle: "creates change list", detail: "A frame row, dialog, tree action, or menu action creates one logical list of OWLOntologyChange values.", tone: "ui" },
            { title: "OWLModelManager.applyChanges", subtitle: "policy boundary", detail: "Rewrites and minimizes changes before calling the OWL API manager.", tone: "owl" },
            { title: "OWLOntologyManager", subtitle: "domain mutation", detail: "Applies changes and calls registered OWLOntologyChangeListener instances with the exact resulting list.", tone: "data" },
            { title: "History + dirty state", subtitle: "axiom channel", detail: "HistoryManager logs the list as one unit. Dirty ontology ids and import-closure state are updated.", tone: "data" },
            { title: "Model-manager events", subtitle: "coarse channel", detail: "Explicit EventType values communicate active ontology, load, reasoner, rendering, and visibility transitions.", tone: "owl" },
            { title: "Views and actions", subtitle: "UI reaction", detail: "Feature listeners refresh models, repaint components, update enabled state, or rebuild caches as appropriate.", tone: "ui" },
          ],
          edges: ["submits", "applies", "notifies", "may emit", "refreshes"],
          caption: "Use exact ontology changes for content mutations. Use EventType for application-level transitions.",
        },
        checkpoint: {
          prompt: "A panel should refresh when the entity renderer changes, even if no ontology axiom changed. Which channel fits?",
          answer: "OWLModelManagerListener with EventType.ENTITY_RENDERER_CHANGED. An OWL API ontology-change listener would never see that preference and cache transition.",
        },
      },
      {
        id: "history",
        eyebrow: "State flow",
        title: "Undo and redo store lists, not individual axioms",
        paragraphs: [
          "HistoryManagerImpl pushes each listener-delivered change list onto the undo stack. A normal change clears redo. Undo reverses the list and applies it through the ontology manager while the manager is in UNDOING mode. The resulting listener callback records the corresponding forward list on redo.",
          "This means the grouping chosen by the feature matters. If a single user gesture generates five changes in one applyChanges call, one Undo reverses all five together.",
        ],
        diagram: {
          title: "History state machine",
          question: "How does Protégé keep undo and redo lists forward-facing?",
          kind: "State diagram",
          nodes: [
            { title: "NORMAL", subtitle: "new edit", detail: "Clear redo and push the forward change list onto undo.", tone: "data" },
            { title: "UNDOING", subtitle: "apply reverse list", detail: "Pop a forward list from undo, reverse it, and apply it. The listener callback reverses that result back onto redo.", tone: "owl" },
            { title: "REDOING", subtitle: "apply forward list", detail: "Pop the forward list from redo and apply it. The callback pushes it back onto undo.", tone: "owl" },
            { title: "Undo stack", subtitle: "lists of changes", detail: "Each entry is one user-visible unit, not necessarily one axiom operation.", tone: "data" },
            { title: "Redo stack", subtitle: "forward lists", detail: "Always stores the change direction that redo should apply.", tone: "data" },
          ],
          edges: ["undo", "redo", "records", "mirrors"],
          caption: "Both stacks retain forward change lists; the mode determines when reversal is needed.",
        },
        bridge: {
          title: "Rails bridge",
          useful: "A change list resembles an explicit command or transaction unit whose inverse is known.",
          limit: "It is in-memory editor history, not database transaction rollback. Save persists the ontology document later, and listeners observe each applied list.",
        },
      },
    ],
    capability: "You can follow an edit through mutation, history, dirty state, and UI notification.",
    sourceRefs: [
      src("Apply changes", "protege-editor-owl/src/main/java/org/protege/editor/owl/model/OWLModelManagerImpl.java", 716, "Change boundary"),
      src("Change listener", "protege-editor-owl/src/main/java/org/protege/editor/owl/model/OWLModelManagerImpl.java", 736, "History and dirty state"),
      src("History manager", "protege-editor-owl/src/main/java/org/protege/editor/owl/model/history/HistoryManagerImpl.java", 79, "Undo/redo state machine"),
    ],
  },
  {
    slug: "extension",
    number: 6,
    title: "Follow an extension",
    question: "How does a line in plugin.xml become a running object?",
    summary: "Trace an extension declaration through Equinox, matching, wrapper creation, contributor classloading, lifecycle, packaging, and the two silent discovery failures.",
    duration: "45 min",
    outcomes: [
      "Trace plugin.xml through AbstractPluginLoader.",
      "Explain why the contributing bundle's classloader matters.",
      "Diagnose a plugin that starts but contributes nothing.",
    ],
    sections: [
      {
        id: "registry-pipeline",
        eyebrow: "Runtime wiring",
        title: "Extensions are metadata until a loader asks for them",
        paragraphs: [
          "Equinox parses extension declarations into IExtension objects. A Protégé loader names a plugin namespace and extension-point id, filters matching extensions, wraps their metadata in a typed plugin object, and eventually asks that wrapper to instantiate the declared class.",
          "The registry does not eagerly create every menu, view, or reasoner. Loaders choose when to query, how to filter by editorKitId or parameters, and when to create the actual plugin instance.",
        ],
        diagram: {
          title: "Extension discovery pipeline",
          question: "Which step turns XML metadata into Java behavior?",
          kind: "Extension architecture diagram",
          columns: 4,
          nodes: [
            { title: "Core extension point", subtitle: "socket declaration", detail: "Defines a contract such as ViewComponent, WorkspaceTab, or EditorKitFactory.", tone: "core", position: { column: 1, row: 1 } },
            { title: "OWL plugin.xml", subtitle: "first-party plug", detail: "Contributes OWL editor factories, tabs, views, menus, and domain-specific services.", tone: "owl", position: { column: 1, row: 2 } },
            { title: "Third-party plugin.xml", subtitle: "external plug", detail: "Names an exact extension point, implementation class, id, and point-specific attributes.", tone: "ui", position: { column: 1, row: 3 } },
            { title: "IExtensionRegistry", subtitle: "Equinox metadata", detail: "Indexes extension points and contributions from all singleton bundles.", tone: "runtime", position: { column: 2, row: 2 } },
            { title: "PluginExtensionFilter", subtitle: "query + matcher", detail: "Selects contributions for one point and applies editor-kit or parameter matchers.", tone: "core", position: { column: 3, row: 1 } },
            { title: "AbstractPluginLoader", subtitle: "typed wrapper set", detail: "Loops through IExtension values and delegates wrapper creation to a point-specific subclass.", tone: "core", position: { column: 3, row: 2 }, source: src("AbstractPluginLoader", "protege-editor-core/src/main/java/org/protege/editor/core/plugin/AbstractPluginLoader.java", 56, "Generic discovery loop") },
            { title: "Plugin wrapper", subtitle: "lazy factory", detail: "Exposes id, label, properties, documentation, and newInstance for the point's Java type.", tone: "core", position: { column: 3, row: 3 } },
            { title: "Plugin instance", subtitle: "running behavior", detail: "The contributor bundle loads the declared class, which enters the point-specific initialize/dispose lifecycle.", tone: "owl", position: { column: 4, row: 2 } },
          ],
          edges: [],
          connections: [
            { from: "Core extension point", label: "declared in", to: "IExtensionRegistry" },
            { from: "OWL plugin.xml", label: "contributes to", to: "IExtensionRegistry" },
            { from: "Third-party plugin.xml", label: "contributes to", to: "IExtensionRegistry" },
            { from: "IExtensionRegistry", label: "queried by", to: "PluginExtensionFilter" },
            { from: "PluginExtensionFilter", label: "feeds", to: "AbstractPluginLoader" },
            { from: "AbstractPluginLoader", label: "creates", to: "Plugin wrapper" },
            { from: "Plugin wrapper", label: "instantiates", to: "Plugin instance" },
          ],
          caption: "The conversion from metadata to behavior is controlled by a point-specific Protégé loader and wrapper.",
        },
      },
      {
        id: "classloader",
        eyebrow: "OSGi boundary",
        title: "The registry remembers who contributed the class",
        paragraphs: [
          "OSGi bundles do not share one application classloader. PluginUtilities maps an IExtension to its IContributor, asks PackageAdmin for that contributor's bundle, and calls bundle.loadClass on the configured implementation name.",
          "This is why reflection through Class.forName from core would be wrong. Core's classloader cannot necessarily see a plugin's private implementation package, even when the plugin can see core's exported API.",
        ],
        code: {
          path: "protege-editor-core/src/main/java/org/protege/editor/core/plugin/PluginUtilities.java",
          line: 127,
          language: "java",
          snippet: `public Object getExtensionObject(IExtension ext, String property)
        throws InstantiationException, IllegalAccessException,
               ClassNotFoundException {
    Bundle bundle = getBundle(ext);
    return bundle
        .loadClass(getAttribute(ext, property))
        .newInstance();
}`,
          focus: "The contributor bundle, not editor-core's classloader, loads the implementation.",
        },
        javaNote: {
          title: "Reflection style is older than the Java 11 baseline",
          body: "Class.newInstance is deprecated in modern Java because it hides constructor exceptions. New code usually uses getDeclaredConstructor().newInstance(), but changing this shared loader needs compatibility and exception-behavior review.",
        },
      },
      {
        id: "plugin-contract",
        eyebrow: "Bundle anatomy",
        title: "A plugin JAR crosses both Maven and OSGi contracts",
        paragraphs: [
          "A Protégé plugin JAR needs META-INF/MANIFEST.MF, plugin.xml at the JAR root, and its implementation classes. The manifest imports host API packages and exports only packages other bundles need. The plugin.xml contribution names the exact fully qualified extension-point id and an implementation with a public no-argument constructor.",
          "A Maven plugin project normally uses bundle packaging and enables maven-bundle-plugin as an extension. BND derives imports from bytecode, but reflective dependencies may need explicit Import-Package entries. Put setup in the point-specific initialize method, not the constructor. A Bundle-Activator is usually unnecessary for a normal UI contribution.",
        ],
        diagram: {
          title: "Plugin JAR contract",
          question: "Which file answers each runtime question?",
          kind: "Bundle anatomy diagram",
          nodes: [
            { title: "pom.xml", subtitle: "build as bundle", detail: "Uses bundle packaging and maven-bundle-plugin so BND generates the OSGi manifest.", tone: "runtime" },
            { title: "MANIFEST.MF", subtitle: "class visibility", detail: "Declares a singleton symbolic name plus Import-Package and any intentional Export-Package entries.", tone: "runtime" },
            { title: "plugin.xml", subtitle: "extension metadata", detail: "Targets the exact extension-point id and names the implementation class and point-specific attributes.", tone: "core" },
            { title: "Implementation", subtitle: "no-arg construction", detail: "Has a public no-argument constructor and performs setup in initialize or the point-specific lifecycle callback.", tone: "owl" },
          ],
          edges: ["generates", "makes visible", "names"],
          caption: "Maven builds the bundle, OSGi wires packages, Equinox registers metadata, and Protégé controls object lifecycle.",
        },
      },
      {
        id: "silent-discovery",
        eyebrow: "Failure mode",
        title: "A started bundle can still fail two different plugin checks",
        paragraphs: [
          "Equinox reads plugin.xml only for singleton bundles. Missing singleton metadata prevents extension registration. Separately, Protégé reports a bundle as a plugin only when its installation location contains the word plugin. A JAR under bundles can resolve and contribute if its metadata is valid, but it will not appear in Protégé's plugin report. Neither issue has to stop application startup.",
          "When a plugin appears installed but its feature is absent, open ~/.Protege/logs/protege.log first. Check singleton metadata, plugin.xml at the JAR root, the exact fully qualified extension-point id, and package imports. If the bundle is active but absent from the plugin report, also confirm the JAR is in the distribution or per-user plugins directory.",
        ],
        diagram: {
          title: "Bundle lifecycle, plugin reporting, and extension registration",
          question: "Which check explains the symptom you see?",
          kind: "Diagnostic relationship diagram",
          columns: 3,
          nodes: [
            { title: "JAR location", subtitle: "configured path", detail: "Felix can start a configured bundle from bundles or plugins, but the path affects how Protégé classifies it.", tone: "runtime", position: { column: 1, row: 1 } },
            { title: "Bundle started", subtitle: "lifecycle active", detail: "Its activator may run successfully, creating the impression that installation worked.", tone: "runtime", position: { column: 2, row: 1 } },
            { title: "Plugin report", subtitle: "location contains plugin", detail: "ProtegeApplication.isPlugin reports only bundles whose installation location contains the word plugin.", tone: "ui", position: { column: 3, row: 1 } },
            { title: "Singleton check", subtitle: "Equinox requirement", detail: "plugin.xml contributions are recognized only when Bundle-SymbolicName has singleton:=true.", tone: "core", position: { column: 1, row: 2 } },
            { title: "Registry entries", subtitle: "extension metadata", detail: "If singleton metadata is missing, the expected extensions never appear here.", tone: "runtime", position: { column: 2, row: 2 } },
            { title: "Visible feature", subtitle: "menu/view/reasoner", detail: "No loader can create an instance because there is no registered contribution to query.", tone: "ui", position: { column: 3, row: 2 } },
          ],
          edges: [],
          connections: [
            { from: "JAR location", label: "Felix may start", to: "Bundle started" },
            { from: "JAR location", label: "if path contains plugin", to: "Plugin report" },
            { from: "Singleton check", label: "allows plugin.xml into", to: "Registry entries" },
            { from: "Registry entries", label: "loaders create", to: "Visible feature" },
          ],
          caption: "Bundle activation, Protégé's plugin report, and Equinox extension registration are three separate facts.",
        },
        checkpoint: {
          prompt: "A plugin's activator log appears, but its ViewComponent does not appear in the Add view menu. What should you verify first?",
          answer: "Confirm Bundle-SymbolicName ends with ;singleton:=true, plugin.xml is at the JAR root, and the extension-point id is exact. Check the plugins path separately if the bundle is missing from Protégé's plugin report.",
        },
      },
    ],
    capability: "You can trace and diagnose an extension from metadata to a live plugin instance.",
    sourceRefs: [
      src("Plugin loader", "protege-editor-core/src/main/java/org/protege/editor/core/plugin/AbstractPluginLoader.java", 56, "Registry query"),
      src("Bundle classloading", "protege-editor-core/src/main/java/org/protege/editor/core/plugin/PluginUtilities.java", 76, "Contributor mapping"),
      src("OWL extension points", "protege-editor-owl/src/main/resources/plugin.xml", 6, "Domain-specific plugin surface"),
    ],
  },
  {
    slug: "work-safely",
    number: 7,
    title: "Work safely",
    question: "Which constraints make a change compile successfully but fail in the product?",
    summary: "Connect Maven, BND manifests, OSGi exports, assembly lists, Swing threads, tests, and diagnostics into a practical change checklist.",
    duration: "35 min",
    outcomes: [
      "Build and run the actual assembled distribution.",
      "Recognize package-export and shipping-list failures.",
      "Use the log and focused tests before broad debugging.",
    ],
    sections: [
      {
        id: "build-run",
        eyebrow: "Development loop",
        title: "The real runtime is the assembled distribution",
        paragraphs: [
          "The documented release build is mvn -Prelease clean package; its platform packages land under protege-desktop/target. CI goes further: it runs clean verify for the default, ide, and release profiles on both JDK 11 and JDK 21. The build requires JDK 11 or later and Maven 3.6.3 or later.",
          "There is no representative mvn exec:java shortcut because Protégé needs Felix, bundle directories, configuration, and plugin metadata. For a runtime-sensitive change, launch an assembled distribution, inspect the startup log, and exercise the path inside the actual OSGi environment.",
        ],
        code: {
          path: "pom.xml",
          line: 86,
          language: "shell",
          snippet: `mvn -Prelease clean package
cd protege-desktop/target/\
  protege-5.6.10-SNAPSHOT-platform-independent/\
  Protege-5.6.10-SNAPSHOT
./run.sh`,
          focus: "Build the whole reactor, then launch the assembled OSGi distribution.",
        },
      },
      {
        id: "four-contracts",
        eyebrow: "Dependency flow",
        title: "A shipping dependency crosses four contracts",
        paragraphs: [
          "A dependency can be available to Maven while absent from the runtime distribution. The root dependencyManagement fixes its version. A module dependency puts it on that module's build path. BND instructions decide whether it is embedded or imported. Desktop assembly descriptors decide whether a separate JAR ships.",
          "The macOS assembly duplicates the bundle include list, so a separate shipping dependency often needs edits in both dependency-sets.xml and protege-os-x.xml. Omitting an assembly edit can produce a successful build and a runtime NoClassDefFoundError.",
        ],
        diagram: {
          title: "From Maven coordinate to runtime class",
          question: "At which boundary did a dependency disappear?",
          kind: "Packaging dependency diagram",
          nodes: [
            { title: "Root dependencyManagement", subtitle: "version policy", detail: "Declares one repository-wide version but does not place the library on any module classpath.", tone: "runtime" },
            { title: "Module dependency", subtitle: "compile availability", detail: "Makes the library available to one module and gives BND bytecode to inspect.", tone: "core" },
            { title: "BND manifest", subtitle: "embed/import/export", detail: "Determines whether classes are inlined, imported from another bundle, or exposed to plugins.", tone: "runtime" },
            { title: "Assembly include", subtitle: "distribution availability", detail: "Copies separate bundle JARs into the shipped bundles directory under stable artifactId names.", tone: "runtime" },
            { title: "config.xml", subtitle: "start-level placement", detail: "For explicitly named bundles, assigns the post-rename JAR to the required runtime level.", tone: "runtime" },
            { title: "Runtime classloader", subtitle: "actual visibility", detail: "Only exported packages and correctly wired imports are visible across bundle boundaries.", tone: "data" },
          ],
          edges: ["selects", "feeds", "packages", "places", "exposes"],
          caption: "Compile-time availability, distribution presence, and OSGi visibility are separate facts.",
        },
        checkpoint: {
          prompt: "The editor module compiles and tests pass, but the assembled app throws NoClassDefFoundError for a new library. Which files come next?",
          answer: "Inspect the module's BND scope/instructions and the desktop shipping lists, especially dependency-sets.xml and the duplicate include list in protege-os-x.xml.",
        },
      },
      {
        id: "diagnostics",
        eyebrow: "Debugging",
        title: "Use the runtime's own map before guessing",
        paragraphs: [
          "Start with ~/.Protege/logs/protege.log. The in-app log view exposes the same diagnostic stream and can show the platform banner: JVM, memory, locale, framework, operating system, and plugin status. The file remains available when the UI cannot start.",
          "At DEBUG level, protege-common logs OSGi service registrations. For UI hangs, capture thread state and identify the EDT. For missing contributions, separate bundle resolution from extension-registry visibility. For model bugs, determine whether exact OWL changes or coarse model events stopped flowing.",
        ],
        diagram: {
          title: "Failure signature to first evidence",
          question: "What should you inspect before reading arbitrary classes?",
          kind: "Diagnostic decision diagram",
          nodes: [
            { title: "App will not boot", subtitle: "launcher/start levels", detail: "Read launcher and Felix errors, confirm config.xml paths and early common/Equinox bundles.", tone: "runtime" },
            { title: "Plugin absent", subtitle: "bundle vs registry", detail: "Read protege.log, then check plugin-directory location, singleton metadata, root plugin.xml, point id, and import resolution.", tone: "core" },
            { title: "UI frozen", subtitle: "EDT", detail: "Find long work on the Event Dispatch Thread or a modal/worker handoff that never completes.", tone: "ui" },
            { title: "Edit not reflected", subtitle: "event channels", detail: "Trace applyChanges, OWL API listeners, dirty/history state, EventType, and the specific view listener.", tone: "owl" },
            { title: "Class missing at runtime", subtitle: "OSGi packaging", detail: "Check bundle presence, Import-Package, Export-Package, embedding scope, and assembly lists.", tone: "data" },
          ],
          edges: ["read log", "separate layers", "inspect threads", "trace changes"],
          caption: "Name the failing boundary first. Then choose the smallest source path that can explain it.",
        },
      },
    ],
    capability: "You can validate changes in the environment that users actually run and localize common runtime-only failures.",
    sourceRefs: [
      src("Compiler baseline", "pom.xml", 354, "Java 11 release"),
      src("Bundle assembly list", "protege-desktop/src/main/assembly/dependency-sets.xml", 1, "Separate JAR shipping"),
      src("Core manifest instructions", "protege-editor-core/pom.xml", 1, "Export and embed rules"),
    ],
  },
  {
    slug: "navigate",
    number: 8,
    title: "Navigate independently",
    question: "How do you find the right change point when the tutorial is no longer guiding you?",
    summary: "Turn the architecture into repeatable investigation recipes, then use a capstone to route an unfamiliar problem through module, mechanism, class, and evidence.",
    duration: "45 min",
    outcomes: [
      "Route a task by architectural mechanism before searching class names.",
      "Use narrow repository searches that reveal declarations and implementations together.",
      "Explain a new flow with source-backed evidence.",
    ],
    sections: [
      {
        id: "task-atlas",
        eyebrow: "Change map",
        title: "Start from the kind of responsibility",
        paragraphs: [
          "A request usually names a user-visible symptom, not the owning mechanism. Translate it first. A new panel is a ViewComponent contribution plus layout. A new reasoner is an OWL extension. A startup failure crosses launcher, config.xml, and bundle wiring. An edit behavior crosses an action or frame row, model-manager changes, listeners, and UI state.",
          "This routing step is more valuable than guessing a class name. It determines which module, metadata file, lifecycle, and test surface should appear in your evidence.",
        ],
        diagram: {
          title: "Task-to-change-point atlas",
          question: "Which seam should your first search target?",
          kind: "Architecture routing diagram",
          nodes: [
            { title: "Add a view or tab", subtitle: "UI contribution", detail: "Start with plugin.xml ViewComponent or WorkspaceTab, then implementation class and viewconfig layout.", tone: "ui" },
            { title: "Change ontology behavior", subtitle: "model facade", detail: "Start with OWLModelManager, the responsible model subsystem, OWL API changes, and listeners.", tone: "owl" },
            { title: "Add plugin capability", subtitle: "extension contract", detail: "Start with extension-point declaration, schema or loader code, plugin wrapper, lifecycle, and exported packages.", tone: "core" },
            { title: "Fix startup or packaging", subtitle: "runtime assembly", detail: "Start with run scripts, Launcher, config.xml, BND manifest instructions, and assembly descriptors.", tone: "runtime" },
            { title: "Fix stale or slow display", subtitle: "events and rendering", detail: "Start with exact/coarse listeners, rendering caches, hierarchy provider, and the affected Swing model.", tone: "data" },
            { title: "Change reasoning", subtitle: "reasoner plugin", detail: "Start with OWLReasonerManager, inference_reasonerfactory, async classification, and reasoner events.", tone: "owl" },
          ],
          edges: ["route", "route", "route", "route", "route"],
          caption: "The first search should name the architectural seam, not a guessed implementation.",
        },
      },
      {
        id: "search-recipes",
        eyebrow: "Source navigation",
        title: "Search declarations and behavior together",
        paragraphs: [
          "For extension-based features, search the contribution id or class in plugin.xml and Java at the same time. For events, search both the EventType value and addListener calls. For a visible label, find it in plugin.xml before searching Swing code. For runtime failures, search the literal JAR or package in POMs, assembly XML, and config.xml.",
          "A productive trace records four facts: entry point, responsibility boundary, next handoff, and evidence. Once those are known, secondary collaborators become optional depth instead of noise.",
        ],
        code: {
          path: "protege-editor-owl/src/main/resources/plugin.xml",
          line: 442,
          language: "shell",
          snippet: `rg -n "OWLClassDescriptionViewComponent" \
  protege-editor-owl/src/main/resources/plugin.xml \
  protege-editor-owl/src/main/java

rg -n "ENTITY_RENDERER_CHANGED|addListener" \
  protege-editor-owl/src/main/java

rg -n "artifact-name|package.name" \
  pom.xml protege-*/pom.xml protege-desktop/src/main`,
          focus: "Search metadata and Java together so you see discovery and behavior in one result set.",
        },
      },
      {
        id: "capstone",
        eyebrow: "Capstone",
        title: "Investigate a plugin that loads but shows no new view",
        paragraphs: [
          "Begin with protege.log: did Felix start the bundle? Confirm the JAR is under a plugins path. Then inspect singleton metadata and plugin.xml packaging: did Equinox register the contribution? Confirm the point id and editorKitId: will the loader match it? Confirm the implementation package can see core and that any host-facing API package is exported. Finally inspect the Add view menu and default layout separately.",
          "This single investigation reuses every major map in the tutorial: distribution, bundle lifecycle, extension registry, classloading, editor-kit matching, declarative UI, and workspace state.",
        ],
        diagram: {
          title: "Capstone evidence chain",
          question: "At which boundary does the feature disappear?",
          kind: "Diagnostic sequence diagram",
          nodes: [
            { title: "1. JAR shipped", subtitle: "assembly", detail: "Confirm the plugin is present in the distribution or per-user plugin directory.", tone: "runtime" },
            { title: "2. Bundle resolved", subtitle: "Felix", detail: "Confirm imports resolve and the startup banner reports the bundle as started.", tone: "runtime" },
            { title: "3. Extension registered", subtitle: "Equinox", detail: "Confirm singleton metadata, root plugin.xml, and the exact ViewComponent point id.", tone: "core" },
            { title: "4. Loader matches", subtitle: "Protégé", detail: "Confirm editorKitId, parameters, and the expected plugin loader query.", tone: "core" },
            { title: "5. Class instantiates", subtitle: "bundle classloader", detail: "Confirm public no-arg construction, package imports, and initialization logs or exceptions.", tone: "owl" },
            { title: "6. UI places it", subtitle: "workspace state", detail: "Distinguish manual Add view visibility from inclusion in a default viewconfig layout.", tone: "ui" },
          ],
          edges: ["then", "then", "then", "then", "then"],
          caption: "Each check proves one boundary and prevents later code from masking an earlier failure.",
        },
        checkpoint: {
          prompt: "Can you explain why 'the plugin loaded' is not enough evidence that a ViewComponent should appear?",
          answer: "Felix bundle lifecycle, Equinox extension registration, Protégé loader matching, implementation classloading, and workspace placement are separate gates. Bundle start proves only the second gate in that chain.",
        },
      },
    ],
    capability: "You can investigate a new task using architecture, targeted searches, and evidence instead of directory browsing.",
    sourceRefs: [
      src("View declaration example", "protege-editor-owl/src/main/resources/plugin.xml", 442, "Metadata-to-class search"),
      src("Plugin utility", "protege-editor-core/src/main/java/org/protege/editor/core/plugin/PluginUtilities.java", 76, "Contributor and registry bridge"),
      src("Model event dispatch", "protege-editor-owl/src/main/java/org/protege/editor/owl/model/OWLModelManagerImpl.java", 188, "EDT-aware event path"),
    ],
  },
  {
    slug: "build-plugin",
    number: 9,
    title: "Build a view plugin",
    question: "How do you turn a small Java class into a plugin Protégé can discover and run?",
    summary: "Build a real ViewComponent bundle, inspect the generated manifest, install it in Protégé, and diagnose the compatibility boundaries that separate compilation from runtime success.",
    duration: "60 min",
    outcomes: [
      "Build and inspect a minimal ViewComponent plugin JAR.",
      "Explain how plugin.xml, BND instructions, and the generated manifest cooperate.",
      "Recognize version-range and duplicate-class failures before debugging UI code.",
    ],
    sections: [
      {
        id: "view-lifecycle",
        eyebrow: "Implementation",
        title: "Begin with the smallest honest view lifecycle",
        paragraphs: [
          "A minimal OWL view extends AbstractOWLViewComponent and implements two lifecycle hooks. initialiseOWLView constructs Swing state after the workspace and model manager are available. disposeOWLView releases anything the view registered or created. The official plugin example creates a Metrics component in the first hook and disposes it in the second.",
          "The class alone is not a plugin. Protégé cannot discover it until plugin.xml contributes it to the ViewComponent extension point, and OSGi cannot load it until the JAR manifest describes a singleton bundle with compatible package imports.",
        ],
        code: {
          path: "src/main/java/edu/stanford/bmir/protege/examples/view/ExampleViewComponent.java",
          line: 8,
          language: "java",
          snippet: `public class ExampleViewComponent extends AbstractOWLViewComponent {
    private Metrics metricsComponent;

    @Override
    protected void initialiseOWLView() throws Exception {
        setLayout(new BorderLayout());
        metricsComponent = new Metrics(getOWLModelManager());
        add(metricsComponent, BorderLayout.CENTER);
    }

    @Override
    protected void disposeOWLView() {
        metricsComponent.dispose();
    }
}`,
          focus: "This cutaway is from the official protege-plugin-examples repository at a fixed commit. The exercise keeps the same lifecycle and trims the UI to one label.",
          url: `${PLUGIN_EXAMPLE_URL}/src/main/java/edu/stanford/bmir/protege/examples/view/ExampleViewComponent.java#L8-L25`,
        },
        javaNote: {
          title: "Protected lifecycle hooks",
          body: "Protégé calls the final public setup path inherited from AbstractOWLViewComponent, which then invokes these protected hooks. Your plugin supplies behavior at the intended subclass seam without replacing the host's setup order.",
        },
      },
      {
        id: "plugin-document",
        eyebrow: "Discovery metadata",
        title: "plugin.xml names the extension point and implementation",
        paragraphs: [
          "The complete minimal document below follows the official example's ViewComponent declaration. The point attribute targets the exact extension-point id declared by editor-core. The class value must match the compiled class name. The label, header color, and category determine how the view is presented in the Add view interface.",
          "Place plugin.xml at src/main/resources/plugin.xml. Maven copies it to the JAR root, where Equinox expects the declaration. A correctly compiled class with a missing, nested, or misspelled plugin.xml remains invisible to the extension registry.",
        ],
        code: {
          path: "src/main/resources/plugin.xml",
          line: 1,
          language: "xml",
          snippet: `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<?eclipse version="3.0"?>
<plugin>
  <extension id="ExampleViewComponent"
             point="org.protege.editor.core.application.ViewComponent">
    <label value="Example view component"/>
    <class value="edu.stanford.bmir.protege.examples.view.ExampleViewComponent"/>
    <headerColor value="@org.protege.ontologycolor"/>
    <category value="@org.protege.ontologycategory"/>
  </extension>
</plugin>`,
          focus: "This complete exercise document is traced to the official example declaration at plugin.xml:24-31; only surrounding unrelated extensions were removed.",
          url: `${PLUGIN_EXAMPLE_URL}/src/main/resources/plugin.xml#L24-L31`,
        },
      },
      {
        id: "bundle-build",
        eyebrow: "Build artifact",
        title: "Maven compiles; BND writes the runtime contract",
        paragraphs: [
          "The POM uses bundle packaging and enables maven-bundle-plugin as a Maven extension. Bundle-SymbolicName ends with singleton:=true because Equinox only processes plugin.xml contributions from singleton bundles. The provided Protégé dependency compiles the plugin without copying host classes into its JAR.",
          "BND analyzes bytecode and writes Import-Package into META-INF/MANIFEST.MF. The exercise asks for Protégé OWL packages in the 5.6 line and leaves the trailing wildcard so BND can add other packages it detects. The generated manifest, not the POM text, is the runtime source of truth.",
        ],
        code: {
          path: "pom.xml",
          line: 8,
          language: "xml",
          snippet: `<packaging>bundle</packaging>

<dependency>
  <groupId>edu.stanford.protege</groupId>
  <artifactId>protege-editor-owl</artifactId>
  <version>5.6.6</version>
  <scope>provided</scope>
</dependency>

<plugin>
  <groupId>org.apache.felix</groupId>
  <artifactId>maven-bundle-plugin</artifactId>
  <version>5.1.9</version>
  <extensions>true</extensions>
  <configuration><instructions>
    <Bundle-SymbolicName>\${project.artifactId};singleton:=true</Bundle-SymbolicName>
    <Import-Package>
      org.protege.editor.owl.*;version="[5.6,6)",
      *
    </Import-Package>
  </instructions></configuration>
</plugin>`,
          focus: "The exercise POM is a current, build-verified adaptation of the official example POM at lines 5-62. Its Protégé version is the published 5.6.6 artifact available from Maven Central.",
          url: `${PLUGIN_EXAMPLE_URL}/pom.xml#L5-L62`,
        },
        diagram: {
          title: "From source tree to visible ViewComponent",
          question: "Which artifact or runtime gate turns Java source into a visible view?",
          kind: "Build and discovery pipeline",
          columns: 3,
          nodes: [
            { title: "Java + plugin.xml + POM", subtitle: "authoring inputs", detail: "The class supplies lifecycle behavior, plugin.xml declares the contribution, and the POM supplies dependencies plus BND instructions.", tone: "data", position: { column: 1, row: 1 } },
            { title: "Maven + BND", subtitle: "package bundle", detail: "Maven compiles the class and copies resources. BND analyzes packages and generates the OSGi manifest.", tone: "runtime", position: { column: 2, row: 1 } },
            { title: "Plugin JAR", subtitle: "inspect before install", detail: "The root contains plugin.xml; META-INF/MANIFEST.MF contains singleton metadata and package imports.", tone: "runtime", position: { column: 3, row: 1 } },
            { title: "plugins directory", subtitle: "installation location", detail: "Copy the JAR into Protégé's plugins directory and restart so Felix installs the bundle.", tone: "runtime", position: { column: 1, row: 2 } },
            { title: "Equinox registry", subtitle: "discover contribution", detail: "The registry reads the singleton bundle's plugin.xml and records its ViewComponent contribution.", tone: "core", position: { column: 2, row: 2 } },
            { title: "Add view menu", subtitle: "instantiate class", detail: "The loader matches the extension and the bundle classloader creates the view when the user selects it.", tone: "ui", position: { column: 3, row: 2 } },
          ],
          edges: [],
          connections: [
            { from: "Java + plugin.xml + POM", label: "build", to: "Maven + BND" },
            { from: "Maven + BND", label: "writes", to: "Plugin JAR" },
            { from: "Plugin JAR", label: "copy", to: "plugins directory" },
            { from: "plugins directory", label: "restart", to: "Equinox registry" },
            { from: "Equinox registry", label: "offers", to: "Add view menu" },
          ],
          caption: "Compilation proves only the first transition. Manifest inspection, registry discovery, and view instantiation prove the remaining gates.",
        },
      },
      {
        id: "compatibility-ranges",
        eyebrow: "Compatibility diagnosis",
        title: "Version ranges can reject a newer host cleanly",
        paragraphs: [
          "The released existentialquery 2.0.0 JAR imports OWL API model and reasoner packages with version range [4.1,5). The opening bracket includes 4.1; the closing parenthesis excludes 5.0 and every later major version. An OSGi resolver therefore cannot wire those imports to an OWL API 5 exporter, even if the Java source might otherwise compile after an upgrade.",
          "Treat a range failure as an explicit compatibility boundary. Rebuild against the intended host, update only ranges justified by source and runtime verification, then inspect the newly generated manifest. Do not widen a range merely to make resolution proceed.",
        ],
        code: {
          path: "META-INF/MANIFEST.MF",
          line: 11,
          language: "manifest",
          snippet: `Import-Package: org.protege.editor.owl.ui.view;version="5.0",
 com.google.common.base;version="[18.0,19)",
 org.semanticweb.owlapi.model;version="[4.1,5)",
 org.semanticweb.owlapi.reasoner;version="[4.1,5)",
 org.semanticweb.owlapi.reasoner.impl;version="[4.1,5)"`,
          focus: "Extracted from the released edu.stanford.protege:existentialquery:2.0.0 JAR. The checked copy and SHA-256 are recorded in docs/source-artifacts.",
          url: EXISTENTIAL_QUERY_JAR_URL,
        },
      },
      {
        id: "embed-or-import",
        eyebrow: "Class identity",
        title: "Embed private libraries; import host APIs",
        paragraphs: [
          "Cellfie 2.1.0 provides a concrete separation. Its BND instructions embed libraries such as Apache POI, Gson, and mapping-master inside the plugin while importing org.protege.editor.*, OWL API, and optional external packages. The plugin carries its private implementation dependencies but shares the host's API types through OSGi imports.",
          "Never embed Protégé or OWL API classes in a plugin. Two bundles can then load two distinct Class objects with the same fully qualified name. Crossing the extension boundary with those lookalike types can cause ClassCastException because Java type identity includes the defining classloader.",
        ],
        code: {
          path: "pom.xml",
          line: 72,
          language: "xml",
          snippet: `<Embed-Dependency>
  commons-codec, poi, poi-ooxml, xmlbeans, gson, mapping-master
</Embed-Dependency>
<Import-Package>
  org.protege.editor.core.*;version="5.0.0",
  org.protege.editor.owl.*;version="5.0.0",
  org.semanticweb.owlapi.*;version="[4.1.3,5.0.0)",
  org.apache.*;resolution:=optional,
  *
</Import-Package>`,
          focus: "This is a shortened, line-preserving excerpt from Cellfie 2.1.0's real POM. The full lists remain available at the linked fixed commit.",
          url: `${CELLFIE_URL}/pom.xml#L72-L111`,
        },
      },
      {
        id: "bnd-vocabulary",
        eyebrow: "Manifest vocabulary",
        title: "Read BND instructions as filters and directives",
        paragraphs: [
          "Protégé's pinned POMs show the vocabulary in production. A leading exclamation mark excludes matching packages from generated imports. resolution:=optional permits a bundle to resolve when that package has no provider. The editor-core instruction registry=\"split\" tells BND how to handle the Eclipse registry package split across sources. The trailing wildcard asks BND to include every remaining detected import.",
          "Order matters because BND evaluates package patterns from top to bottom. Specific exclusions and directives belong before the catch-all wildcard. After any edit, inspect the built manifest to see the concrete header BND emitted.",
        ],
        code: {
          path: "protege-editor-core/pom.xml",
          line: 104,
          language: "xml",
          snippet: `<Import-Package>
  !com.sun.*,
  !com.apple.*,
  !sun.swing,
  org.eclipse.core.runtime;registry="split",
  *
</Import-Package>`,
          focus: "These instructions come directly from the pinned editor-core POM. The common module adds examples such as !com.ibm.* and sun.misc;resolution:=optional.",
        },
        checkpoint: {
          prompt: "Why is mvn package not enough evidence that a plugin can run?",
          answer: "Compilation does not prove that plugin.xml is at the JAR root, singleton metadata is present, package imports match the host, or the extension registry can discover and instantiate the class. Inspect the JAR, then run it in the assembled product.",
        },
      },
      {
        id: "build-install",
        eyebrow: "Practice",
        title: "Build, inspect, install, and observe",
        paragraphs: [
          "The repository includes a complete minimal plugin under exercises/minimal-view-plugin. Its Java class, plugin.xml, and POM are adaptations of the fixed official example, with a currently published Protégé 5.6.6 dependency so the exercise builds from a clean Maven cache.",
          "The exercise is complete only after you inspect the JAR and observe the view in a real Protégé runtime. A successful Maven build is useful evidence, but it is not the runtime result.",
        ],
        exercise: {
          title: "Ship one visible view",
          goal: "Produce a bundle whose generated manifest and root plugin.xml match the runtime contract, then make its view appear in Protégé.",
          path: "exercises/minimal-view-plugin",
          steps: [
            "Build the bundle from the exercise directory.",
            "List the JAR and confirm plugin.xml is at its root.",
            "Read META-INF/MANIFEST.MF and find Bundle-SymbolicName plus Import-Package.",
            "Copy the JAR to the plugins directory of a Protégé 5.6 installation, then restart Protégé.",
            "Open Window > Views and add Example view component. If it is absent, inspect ~/.Protege/logs/protege.log and revisit Journey 6's discovery gates.",
          ],
          commands: `cd exercises/minimal-view-plugin
mvn clean package
jar tf target/protege-minimal-view-1.0.0.jar
unzip -p target/protege-minimal-view-1.0.0.jar META-INF/MANIFEST.MF`,
          verify: [
            "The JAR contains plugin.xml at the root and ExampleViewComponent.class under its package path.",
            "The manifest contains Bundle-SymbolicName: protege-minimal-view;singleton:=true.",
            "The manifest imports org.protege.editor.owl packages instead of embedding Protégé classes.",
            "Example view component appears in Protégé and displays the active ontology's class count.",
          ],
        },
      },
    ],
    capability: "You can build, inspect, install, and diagnose a minimal Protégé ViewComponent plugin.",
    sourceRefs: [
      src("Official plugin example class", "src/main/java/edu/stanford/bmir/protege/examples/view/ExampleViewComponent.java", 8, "View lifecycle at a fixed plugin-example commit", `${PLUGIN_EXAMPLE_URL}/src/main/java/edu/stanford/bmir/protege/examples/view/ExampleViewComponent.java#L8-L25`),
      src("Official plugin example declaration", "src/main/resources/plugin.xml", 24, "Real ViewComponent contribution", `${PLUGIN_EXAMPLE_URL}/src/main/resources/plugin.xml#L24-L31`),
      src("Official plugin example POM", "pom.xml", 5, "Bundle packaging and BND instructions", `${PLUGIN_EXAMPLE_URL}/pom.xml#L5-L62`),
      src("Existential Query 2.0.0 manifest", "META-INF/MANIFEST.MF", 11, "Released JAR with bounded OWL API imports", EXISTENTIAL_QUERY_JAR_URL),
      src("Cellfie 2.1.0 POM", "pom.xml", 72, "Real embed and import strategy", `${CELLFIE_URL}/pom.xml#L72-L111`),
      src("Pinned core BND instructions", "protege-editor-core/pom.xml", 88, "Singleton, imports, exports, and registry directive"),
      src("Pinned common BND instructions", "protege-common/pom.xml", 49, "Negation and optional-resolution examples"),
    ],
  },
];

export function getLesson(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function adjacentLessons(slug: string) {
  const index = lessons.findIndex((lesson) => lesson.slug === slug);
  return {
    previous: index > 0 ? lessons[index - 1] : undefined,
    next: index >= 0 && index < lessons.length - 1 ? lessons[index + 1] : undefined,
  };
}

export const atlasLenses: Record<string, DiagramSpec> = {
  modules: {
    title: "Build-time module lens",
    question: "Which module can import which?",
    kind: "Maven dependency diagram",
    columns: 4,
    nodes: [
      { title: "desktop", subtitle: "depends on all four", detail: "Declares Maven dependencies on launcher, common, editor-core, and editor-owl so packaging runs last and gathers the runtime artifacts.", tone: "runtime", position: { column: 2, row: 1 } },
      { title: "editor-owl", subtitle: "depends on three", detail: "Depends directly on launcher, common, and editor-core. It consumes the framework APIs while keeping OWL code out of core.", tone: "owl", position: { column: 4, row: 2 } },
      { title: "editor-core", subtitle: "depends on launcher", detail: "Consumes shared OSGi, Equinox, logging, and utility dependencies carried by launcher. It has no Maven dependency on common or editor-owl.", tone: "core", position: { column: 3, row: 2 } },
      { title: "common", subtitle: "depends on launcher", detail: "Uses OSGi and logging APIs, then registers one early SAXParserFactory service. It has no dependency on editor-core.", tone: "runtime", position: { column: 2, row: 2 } },
      { title: "launcher", subtitle: "dependency carrier", detail: "Bootstraps Felix and supplies shared third-party dependencies to the reactor.", tone: "runtime", position: { column: 1, row: 2 } },
    ],
    edges: [],
    connections: [
      { from: "desktop", label: "depends on", to: "launcher" },
      { from: "desktop", label: "depends on", to: "common" },
      { from: "desktop", label: "depends on", to: "editor-core" },
      { from: "desktop", label: "depends on", to: "editor-owl" },
      { from: "editor-owl", label: "depends on", to: "launcher" },
      { from: "editor-owl", label: "depends on", to: "common" },
      { from: "editor-owl", label: "depends on", to: "editor-core" },
      { from: "editor-core", label: "depends on", to: "launcher" },
      { from: "common", label: "depends on", to: "launcher" },
    ],
    caption: "This is the direct Maven dependency graph. There is no editor-core to common edge and no core-to-OWL cycle.",
  },
  runtime: {
    title: "Runtime start-level lens",
    question: "Which bundles must already be active?",
    kind: "Runtime sequence diagram",
    nodes: [
      { title: "Level 1", subtitle: "common", detail: "Registers SAXParserFactory for extension XML parsing.", tone: "runtime" },
      { title: "Level 2", subtitle: "Equinox base", detail: "Provides common registry runtime support.", tone: "runtime" },
      { title: "Level 3", subtitle: "registry + core", detail: "Makes extension metadata and application framework code available.", tone: "core" },
      { title: "Level 4", subtitle: "owl + libraries", detail: "Contributes the OWL editor kind and domain-specific extension points.", tone: "owl" },
      { title: "Level 5", subtitle: "third-party plugins", detail: "Loads last, after host APIs and registries exist.", tone: "ui" },
    ],
    edges: ["prepares", "prepares", "hosts", "hosts"],
    caption: "Application assembly waits until the framework reports every level started.",
  },
  extensions: {
    title: "Extension-registry lens",
    question: "How does runtime wiring reverse the compile-time direction?",
    kind: "Extension architecture diagram",
    columns: 3,
    nodes: [
      { title: "core plugin.xml", subtitle: "declares points", detail: "Defines EditorKitFactory, WorkspaceTab, ViewComponent, menu, hook, and preference contracts.", tone: "core", position: { column: 1, row: 1 } },
      { title: "owl plugin.xml", subtitle: "first-party contribution", detail: "Registers OWLEditorKitFactory, tabs, views, menus, and additional OWL extension points.", tone: "owl", position: { column: 1, row: 2 } },
      { title: "Contributor bundle", subtitle: "third-party contribution", detail: "Packages plugin.xml and the implementation class behind its own OSGi classloader.", tone: "ui", position: { column: 1, row: 3 } },
      { title: "Equinox registry", subtitle: "indexes metadata", detail: "Keeps extension configuration and contributor identity.", tone: "runtime", position: { column: 2, row: 2 } },
      { title: "Protégé loaders", subtitle: "filter + instantiate", detail: "Query point-specific contributions, match editorKitId or parameters, and ask the contributor bundle to load the class.", tone: "core", position: { column: 3, row: 2 } },
    ],
    edges: [],
    connections: [
      { from: "core plugin.xml", label: "declares points in", to: "Equinox registry" },
      { from: "owl plugin.xml", label: "contributes to", to: "Equinox registry" },
      { from: "Contributor bundle", label: "contributes to", to: "Equinox registry" },
      { from: "Equinox registry", label: "queried by", to: "Protégé loaders" },
      { from: "Protégé loaders", label: "loads class from", to: "Contributor bundle" },
    ],
    caption: "The host owns contracts. Contributors own implementations. The registry connects them.",
  },
  events: {
    title: "Edit and event lens",
    question: "How does ontology state reach the visible UI?",
    kind: "Change sequence diagram",
    nodes: [
      { title: "Swing editor", subtitle: "user intent", detail: "Creates one logical list of ontology changes.", tone: "ui" },
      { title: "OWLModelManager", subtitle: "policy", detail: "Rewrites, minimizes, and delegates changes.", tone: "owl" },
      { title: "OWL API manager", subtitle: "mutation", detail: "Updates ontology state and invokes exact change listeners.", tone: "data" },
      { title: "History + caches", subtitle: "derived state", detail: "Records undo units, dirty state, imports closure, search, and rendering effects.", tone: "data" },
      { title: "Model events", subtitle: "application state", detail: "Moves coarse events to the EDT and detaches listeners that throw.", tone: "owl" },
      { title: "Views", subtitle: "visible reaction", detail: "Update Swing models, enablement, hierarchy content, rendering, and repaint.", tone: "ui" },
    ],
    edges: ["submits", "applies", "notifies", "informs", "refreshes"],
    caption: "Exact OWL changes and coarse EventType notifications cooperate rather than duplicate each other.",
  },
};
