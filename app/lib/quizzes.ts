import type { SourceRef } from "./course";

export type QuizMarker = "synthesis" | "distractor";

export type QuizItem = {
  id: string;
  question: string;
  answer: string;
  marker?: QuizMarker;
  sources: SourceRef[];
};

export type QuizGroup = {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  items: QuizItem[];
};

const src = (label: string, path: string, line: number, note: string): SourceRef => ({
  label,
  path,
  line,
  note,
});

const refs = {
  desktopPackaging: src("Desktop assembly", "protege-desktop/pom.xml", 93, "The desktop module runs the assembly plugin during package."),
  coreExtensionPoints: src("Core extension points", "protege-editor-core/src/main/resources/plugin.xml", 4, "Core declares the host-side extension-point identifiers."),
  pluginInstantiation: src("Extension class loading", "protege-editor-core/src/main/java/org/protege/editor/core/plugin/PluginUtilities.java", 127, "The contributor bundle loads and instantiates the named implementation class."),
  annotationsOffer: src("Annotations view offer", "protege-editor-owl/src/main/resources/plugin.xml", 431, "The OWL plugin binds a core view extension point to its implementation class."),
  dependencySets: src("Desktop bundle inventory", "protege-desktop/src/main/assembly/dependency-sets.xml", 4, "The distribution separates framework, core, and plugin dependency sets."),
  commonManifest: src("Common bundle manifest rules", "protege-common/pom.xml", 49, "BND instructions declare the bundle identity and package imports."),
  felixConfig: src("Felix configuration", "protege-desktop/src/main/felix/conf/config.xml", 11, "The runtime configuration declares boot delegation and bundle start levels."),
  deferredCoreStart: src("Deferred core startup", "protege-editor-core/src/main/java/org/protege/editor/core/ProtegeApplication.java", 85, "Core waits for the framework STARTED event before starting its application work."),
  pluginSanity: src("Plugin sanity check", "protege-editor-core/src/main/java/org/protege/editor/core/ProtegeApplication.java", 211, "Core logs missing or non-singleton plugin registry conditions."),
  launcherStart: src("Framework launch", "protege-launcher/src/main/java/org/protege/osgi/framework/Launcher.java", 97, "Launcher creates and starts the OSGi framework."),
  launcherFailures: src("Bundle failure logging", "protege-launcher/src/main/java/org/protege/osgi/framework/Launcher.java", 177, "Launcher reports bundles that fail to start."),
  launcherMain: src("Launcher entry point", "protege-launcher/src/main/java/org/protege/osgi/framework/Launcher.java", 234, "Launcher owns the process entry point and runtime handoff."),
  ontologyLoader: src("Ontology loading worker", "protege-editor-owl/src/main/java/org/protege/editor/owl/model/io/OntologyLoader.java", 57, "Ontology loading runs through a SwingWorker and a progress dialog."),
  ontologyLoaded: src("Loaded-event handoff", "protege-editor-owl/src/main/java/org/protege/editor/owl/model/io/OntologyLoader.java", 126, "The worker completion path reports success and fires the loaded event."),
  progressDialog: src("Modal progress dialog", "protege-editor-owl/src/main/java/org/protege/editor/owl/ui/util/ProgressDialog.java", 31, "The progress dialog schedules its modal display with invokeLater."),
  selectionModel: src("Selection listeners", "protege-editor-owl/src/main/java/org/protege/editor/owl/model/selection/OWLSelectionModel.java", 20, "The shared selection model exposes listener-based coordination."),
  modelEvents: src("Model event dispatch", "protege-editor-owl/src/main/java/org/protege/editor/owl/model/OWLModelManagerImpl.java", 188, "Off-EDT model events are rescheduled onto the Swing event queue."),
  classesLayout: src("Classes tab layout", "protege-editor-owl/src/main/resources/viewconfig-classestab.xml", 1, "The layout XML chooses and positions the initial five components."),
  tabDeclarations: src("Active tab declarations", "protege-editor-owl/src/main/resources/plugin.xml", 309, "Seven active built-in tabs use OWLWorkspaceViewsTab with different metadata."),
  commentedTab: src("Commented SPARQL tab", "protege-editor-owl/src/main/resources/plugin.xml", 1540, "An eighth occurrence is inside a commented-out extension block."),
  viewCatalogue: src("View catalogue", "protege-editor-core/src/main/java/org/protege/editor/core/ui/workspace/views/ViewMenuAction.java", 46, "The menu builds its catalogue from all available view plugins."),
  viewLookup: src("View plugin lookup", "protege-editor-core/src/main/java/org/protege/editor/core/ui/view/ViewComponentFactory.java", 33, "A saved plugin id is resolved back to a view plugin before instantiation."),
  uniqueExtensionId: src("Extension unique id", "protege-editor-core/src/main/java/org/protege/editor/core/plugin/AbstractProtegePlugin.java", 16, "The registry extension supplies the plugin's unique identifier."),
  editorKitOwnership: src("Editor kit ownership", "protege-editor-owl/src/main/java/org/protege/editor/owl/OWLEditorKit.java", 83, "OWLEditorKit constructs and retains its model manager and workspace."),
  viewPreferences: src("Saved view layout", "protege-editor-core/src/main/java/org/protege/editor/core/ui/view/ViewsPane.java", 168, "ViewsPane stores user layout changes through ViewLayoutPreferences."),
  stringLeak: src("Renderer preference lookup", "protege-editor-core/src/main/java/org/protege/editor/core/ProtegeApplication.java", 366, "Core reaches an OWL preference class by name instead of importing it."),
  rendererPreferences: src("Renderer preference key", "protege-editor-owl/src/main/java/org/protege/editor/owl/ui/renderer/OWLRendererPreferences.java", 230, "The OWL-side preference class uses its Java class as the preference key."),
};

const lessonOne: QuizGroup = {
  id: "l1-diagnostic",
  eyebrow: "Lesson 1 diagnostic",
  title: "Can you reconstruct the module and extension boundaries?",
  intro: "Use the source links only after committing to an answer. The last question is a cold retest of the core socket-versus-plug distinction.",
  items: [
    {
      id: "l1-q1",
      question: "protege-desktop contains no Java source and is built last. What job does it perform?",
      answer: "It packages the runnable desktop distribution. Its Maven assembly gathers the launcher, framework, core bundles, plugin bundles, and configuration into the deliverable layout.",
      sources: [refs.desktopPackaging, refs.dependencySets],
    },
    {
      id: "l1-q2",
      question: "Core cannot import OWLEditorKit. How can it still construct one at runtime?",
      answer: "Core reads an extension declaration containing the implementation class name, asks the contributor bundle to load that class, and instantiates it. The registry string and bundle boundary replace a compile-time Java dependency.",
      sources: [refs.pluginInstantiation],
    },
    {
      id: "l1-q3",
      question: "For the core ViewComponent extension point, what exact value belongs in a plugin's point attribute, and how is it formed?",
      answer: "Use org.protege.editor.core.application.ViewComponent. The unique point id is the declaring bundle's symbolic name plus the extension-point id.",
      sources: [refs.coreExtensionPoints, refs.annotationsOffer],
    },
    {
      id: "l1-q4",
      question: "Which three fields in a view extension declaration are load-bearing?",
      answer: "point selects the host socket, class names the implementation to load, and id gives the contribution a stable identity used by layouts and lookup code.",
      sources: [refs.annotationsOffer, refs.viewLookup],
    },
    {
      id: "l1-q5",
      question: "You are adding an OWL-specific view. Must you change protege-editor-core?",
      answer: "No. Put the implementation and extension declaration in protege-editor-owl or another plugin bundle, and contribute to an existing core extension point. Core changes only when the generic contract itself must change.",
      sources: [refs.coreExtensionPoints, refs.annotationsOffer],
    },
    {
      id: "l1-q6",
      question: "In one sentence, contrast an extension point with an extension class, including whose code owns each.",
      answer: "The host bundle owns the extension point, which is the socket; the contributing plugin owns the class, which is the implementation plugged into that socket.",
      sources: [refs.coreExtensionPoints, refs.annotationsOffer],
    },
  ],
};

const lessonTwo: QuizGroup = {
  id: "l2-diagnostic",
  eyebrow: "Lesson 2 diagnostic",
  title: "Can you reason about runtime startup and failures?",
  intro: "These questions test the runtime model, not memorized terminology. The final item repeats the startup roles after a delay.",
  items: [
    {
      id: "l2-q1",
      question: "Why not place all 34 distribution JARs on one ordinary Java classpath?",
      answer: "Protégé relies on bundle identities, declared package wiring, isolated contributor class loaders, extension metadata, and start levels. A flat classpath discards those runtime boundaries and cannot reproduce the intended assembly and discovery behavior.",
      sources: [refs.dependencySets, refs.felixConfig],
    },
    {
      id: "l2-q2",
      question: "protege-common imports org.slf4j with a version range, but no installed bundle exports a compatible package. What happens first?",
      answer: "The bundle cannot resolve, so it does not start. The framework or launcher diagnostics should show the unresolved package requirement before any application-level extension code runs.",
      sources: [refs.commonManifest, refs.launcherFailures],
    },
    {
      id: "l2-q3",
      question: "Why can an import such as sun.misc be optional in a bundle manifest?",
      answer: "The Felix configuration delegates sun.* to the parent class loader, while an optional package import prevents a missing OSGi wire from blocking bundle resolution. The two mechanisms are related runtime safeguards, not proof that the package is universally available.",
      marker: "distractor",
      sources: [refs.commonManifest, refs.felixConfig],
    },
    {
      id: "l2-q4",
      question: "Why are plugin bundles started after framework and core bundles?",
      answer: "The earlier levels establish framework services and host-side application contracts before contributors start. Launcher still isolates failures so one plugin bundle can be logged without hiding the status of the rest.",
      sources: [refs.felixConfig, refs.launcherFailures],
    },
    {
      id: "l2-q5",
      question: "Why does core wait for FrameworkEvent.STARTED instead of immediately opening the application?",
      answer: "The listener defers application startup until the OSGi framework has finished its startup transition, so core does not race the runtime that supplies its bundles and registry.",
      sources: [refs.deferredCoreStart],
    },
    {
      id: "l2-q6",
      question: "A plugin starts but its panel never appears. Name two distinct failure stages and their likely evidence.",
      answer: "First, the bundle may fail resolution or startup, which appears in framework or launcher logs. Second, an active bundle may not contribute usable metadata because plugin.xml is missing, registered incorrectly, or names the wrong point, id, or class; core's plugin checks and registry inspection expose that layer.",
      sources: [refs.launcherFailures, refs.pluginSanity],
    },
    {
      id: "l2-q7",
      question: "Why does the application check that the plugin registry is singleton when Felix already manages bundles?",
      answer: "Felix manages bundle lifecycle and package wiring. The Equinox-style extension registry separately parses plugin.xml contributions. A singleton registry prevents multiple metadata worlds from disagreeing about which extension points and extensions exist.",
      marker: "synthesis",
      sources: [refs.pluginSanity, refs.felixConfig],
    },
    {
      id: "l2-q8",
      question: "Assign one responsibility each to Launcher, Felix, and protege-editor-core.",
      answer: "Launcher bootstraps the process and framework; Felix resolves and starts bundles according to OSGi configuration; protege-editor-core starts the domain-neutral desktop application and hosts extension contracts.",
      sources: [refs.launcherMain, refs.launcherStart, refs.deferredCoreStart],
    },
    {
      id: "l2-q9",
      question: "Cold retest: state the Launcher, Felix, and core roles again without using the words start or startup.",
      answer: "Launcher creates the runtime, Felix wires and runs bundles, and core supplies the generic editor application plus its extension sockets.",
      sources: [refs.launcherMain, refs.launcherStart, refs.coreExtensionPoints],
    },
  ],
};

const lessonThree: QuizGroup = {
  id: "l3-diagnostic",
  eyebrow: "Lesson 3 diagnostic",
  title: "Can you trace ontology loading without freezing Swing?",
  intro: "Predict the thread and event behavior before revealing the implementation-backed explanation.",
  items: [
    {
      id: "l3-q1",
      question: "What happens if File Open performs a 60-second ontology parse directly on the Swing event-dispatch thread?",
      answer: "The event-dispatch thread cannot process paint or input events during the parse, so the interface appears frozen until the action returns.",
      sources: [refs.ontologyLoader],
    },
    {
      id: "l3-q2",
      question: "Loading takes a long time but the UI remains responsive. Where is the expensive work running?",
      answer: "OntologyLoader puts the expensive load operation in SwingWorker.doInBackground, off the event-dispatch thread, while the UI remains available to process events.",
      sources: [refs.ontologyLoader],
    },
    {
      id: "l3-q3",
      question: "A method asserts that it is on the EDT. What most likely put its caller there?",
      answer: "The call chain most likely began in a Swing event handler or was explicitly queued with SwingUtilities.invokeLater. The assertion verifies the current thread; it does not move execution there.",
      marker: "distractor",
      sources: [refs.progressDialog, refs.modelEvents],
    },
    {
      id: "l3-q4",
      question: "While the modal loading dialog is visible, can the user trigger File Open again in the owning window?",
      answer: "No. The dialog is application-modal, so its nested event loop can repaint and update the dialog while blocking interaction with the owning application window.",
      sources: [refs.progressDialog],
    },
    {
      id: "l3-q5",
      question: "Several panels must react to a shared OWL selection. What coordination mechanism does the code expose?",
      answer: "They observe the shared OWLSelectionModel through listeners. The model centralizes the current selection and notifies interested views instead of panels calling one another directly.",
      sources: [refs.selectionModel],
    },
    {
      id: "l3-q6",
      question: "What does SwingUtilities.invokeLater guarantee, and what does it not guarantee?",
      answer: "It queues work for a future turn on the event-dispatch thread. It does not run the work immediately, create a background thread, or make expensive work safe for the UI thread.",
      sources: [refs.progressDialog, refs.modelEvents],
    },
    {
      id: "l3-q7",
      question: "The UI thread is stuck, yet click events keep being recorded. How can both be true?",
      answer: "Native and application event producers can continue adding work to the event queue while the single Swing consumer is busy. Recorded events do not become visible behavior until the event-dispatch thread returns to the queue.",
      marker: "synthesis",
      sources: [refs.modelEvents],
    },
    {
      id: "l3-q8",
      question: "Trace the handoff from a completed background ontology load to panels redrawing on the EDT.",
      answer: "SwingWorker completion reports the successful load and fires the model event. OWLModelManagerImpl detects off-EDT dispatch, queues the event with invokeLater, and then listeners update their Swing views on the event-dispatch thread.",
      sources: [refs.ontologyLoaded, refs.modelEvents],
    },
  ],
};

const blockOneRecap: QuizGroup = {
  id: "block-1-recap",
  eyebrow: "Block 1 recap",
  title: "Can you combine architecture, runtime, and Swing reasoning?",
  intro: "These mixed questions deliberately cross lesson boundaries. They are still optional and do not alter course progress.",
  items: [
    {
      id: "b1-q1",
      question: "You add an Annotations button by editing core and parse its ontology inside the click handler. What are the two architectural errors?",
      answer: "The OWL-specific contribution belongs in an OWL or plugin bundle using a core extension point, not as a compile-time core dependency. The parse belongs in background work, with results returned to Swing on the event-dispatch thread.",
      marker: "synthesis",
      sources: [refs.annotationsOffer, refs.ontologyLoader],
    },
    {
      id: "b1-q2",
      question: "Core names an OWL renderer-preferences class as a string. Why is that not a compile-time boundary violation, and what risk remains?",
      answer: "A class-name string creates no Java import or bytecode dependency, so the module boundary remains intact. It is still a fragile runtime coupling: renaming or removing the target class can silently break preference cleanup or lookup.",
      marker: "distractor",
      sources: [refs.stringLeak, refs.rendererPreferences],
    },
    {
      id: "b1-q3",
      question: "A bundle is resolved and active, but its view is absent. Name two likely metadata culprits and the files you would inspect.",
      answer: "Inspect the bundle manifest for correct identity and singleton behavior, then plugin.xml for a matching point, stable id, and loadable class declaration. Runtime activation does not prove that an extension contribution was registered correctly.",
      marker: "distractor",
      sources: [refs.commonManifest, refs.annotationsOffer, refs.pluginSanity],
    },
    {
      id: "b1-q4",
      question: "Core begins constructing the application window before the framework reports STARTED. What is wrong, and what should happen instead?",
      answer: "Core is racing runtime initialization. It should register the framework listener and defer application creation until the STARTED event arrives.",
      sources: [refs.deferredCoreStart],
    },
    {
      id: "b1-q5",
      question: "A menu action parses a 400 MB ontology inside actionPerformed. Predict the user experience and explain why.",
      answer: "The window stops repainting and responding for the duration because actionPerformed runs on Swing's event-dispatch thread. The expensive parse monopolizes the same thread that consumes input and paint work.",
      sources: [refs.ontologyLoader],
    },
    {
      id: "b1-q6",
      question: "A worker finishes building a hierarchy. What mechanism should carry that result into a panel redraw?",
      answer: "Publish or fire the model-level result, then queue listener notification or the UI update onto the event-dispatch thread with invokeLater. Do not mutate Swing components directly from the worker thread.",
      sources: [refs.ontologyLoaded, refs.modelEvents],
    },
  ],
};

const lessonFour: QuizGroup = {
  id: "l4-diagnostic",
  eyebrow: "Lesson 4 diagnostic",
  title: "Can you reconstruct a workspace from metadata?",
  intro: "These questions separate the catalogue of available views from the XML that places a few of them on a tab.",
  items: [
    {
      id: "l4-q1",
      question: "The plugin registry offers 51 views, but a fresh Classes tab shows five. Where does the smaller set come from?",
      answer: "viewconfig-classestab.xml names and positions the five initial components. The extension registry supplies the larger catalogue of available views; the layout chooses a starting composition.",
      sources: [refs.classesLayout, refs.viewCatalogue],
    },
    {
      id: "l4-q2",
      question: "Annotations and Usage share one CNode. What does that mean, and how do VSNode and HSNode differ?",
      answer: "Multiple components in one CNode become alternative views in one pane, typically exposed as sub-tabs. VSNode and HSNode split child regions vertically and horizontally, so they define spatial composition rather than view identity.",
      sources: [refs.classesLayout],
    },
    {
      id: "l4-q3",
      question: "Before opening source, predict the declarations needed to make a Classes tab available and give it an initial layout.",
      answer: "plugin.xml needs a WorkspaceTab extension naming its id, label, and implementation class. Its metadata points to a viewconfig XML resource whose node tree names the initial view ids and positions.",
      sources: [refs.tabDeclarations, refs.classesLayout],
    },
    {
      id: "l4-q4",
      question: "Do all eight built-in tab declarations actively use OWLWorkspaceViewsTab, and what distinguishes them?",
      answer: "The premise needs correction: seven active built-in tab declarations use OWLWorkspaceViewsTab and differ by id, label, index, and defaultViewConfigFile. An eighth occurrence belongs to a commented-out SPARQL tab block, so it is not an active declaration at the pinned commit.",
      sources: [refs.tabDeclarations, refs.commentedTab],
    },
    {
      id: "l4-q5",
      question: "Is OWLClassesTab the Java parent of OWLAssertedClassHierarchy\u200BViewComponent?",
      answer: "No. They are independent extension contributions. The workspace-tab declaration and view-component declaration become related when the Classes tab layout names that view id.",
      marker: "distractor",
      sources: [refs.tabDeclarations, refs.classesLayout],
    },
    {
      id: "l4-q6",
      question: "Why does the Classes layout mention only a small subset of the available hierarchy and class views?",
      answer: "The XML records the default composition, not the full catalogue. Additional registered views remain available through the view menu and can be added to the workspace later.",
      sources: [refs.classesLayout, refs.viewCatalogue],
    },
    {
      id: "l4-q7",
      question: "A layout stores the Description view's plugin id. Trace that id to the Java class eventually instantiated.",
      answer: "The saved id resolves to the matching registry extension. ViewComponentFactory obtains that plugin, and the extension's class attribute is loaded through the contributor bundle to create the view component.",
      marker: "distractor",
      sources: [refs.uniqueExtensionId, refs.viewLookup, refs.pluginInstantiation],
    },
    {
      id: "l4-q8",
      question: "Who owns the OWL model manager and workspace, and where should their lifecycle converge?",
      answer: "OWLEditorKit constructs and retains both objects. It is therefore the lifecycle seam that coordinates their initialization and disposal as one editor session.",
      sources: [refs.editorKitOwnership],
    },
    {
      id: "l4-q9",
      question: "A learner rearranges panes and the layout survives restart. Did Protégé rewrite the plugin JAR?",
      answer: "No. The shipped XML remains the default layout. ViewsPane persists the learner's layout separately through ViewLayoutPreferences and restores that saved preference later.",
      sources: [refs.viewPreferences],
    },
  ],
};

const quizGroupsByLesson: Record<string, QuizGroup[]> = {
  landscape: [lessonOne],
  startup: [lessonTwo],
  "open-ontology": [lessonThree, blockOneRecap],
  screen: [lessonFour],
};

export function getQuizGroups(slug: string): QuizGroup[] {
  return quizGroupsByLesson[slug] ?? [];
}

export const quizUnitCount = Object.values(quizGroupsByLesson)
  .flat()
  .reduce((total, group) => total + group.items.length, 0);
