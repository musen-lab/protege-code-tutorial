import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the production trailhead", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Protégé Code Tutorial \| Inside Protégé<\/title>/i);
  assert.match(html, /aria-label="Protégé Code Tutorial home"/);
  assert.match(html, /<img[^>]+src="\/protege-icon\.svg"/);
  assert.match(html, /<span>Protégé<\/span>/);
  assert.match(html, /<strong>Code Tutorial<\/strong>/);
  assert.match(html, /class="header-search-link" href="\/search" aria-label="Search the Protégé Code Tutorial"/);
  assert.match(html, /<link rel="shortcut icon" href="\/favicon\.ico\?v=1"/);
  assert.match(html, /<link rel="icon" href="\/favicon\.ico\?v=1" type="image\/x-icon" sizes="16x16 32x32 48x48"/);
  assert.match(html, /<link rel="icon" href="\/protege-icon\.svg\?v=1" type="image\/svg\+xml"/);
  assert.doesNotMatch(html, /href="\/search">Search<\/a>/);
  assert.match(html, /Learn the Protégé codebase, one lesson at a time\./);
  assert.match(html, /Build the mental model you need to navigate, debug, and extend Protégé\./);
  assert.match(html, /Start Lesson 1/);
  assert.match(html, /A repeated four-step learning rhythm/);
  assert.match(html, /Follow all 10 lessons in order/);
  assert.match(html, /Architecture Atlas/);
  assert.match(html, /Field notebook/);
  assert.match(html, /d9c9d39/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);

  const logo = await readFile(new URL("../public/protege-icon.svg", import.meta.url));
  assert.equal(
    createHash("sha256").update(logo).digest("hex"),
    "3f7fdd08b4f232a4b9e566099ed832612ff160098667bcd36d3b2f02da1758ac",
  );

  const favicon = await readFile(new URL("../public/favicon.ico", import.meta.url));
  assert.equal(favicon.readUInt16LE(0), 0);
  assert.equal(favicon.readUInt16LE(2), 1);
  assert.equal(favicon.readUInt16LE(4), 3);
  assert.deepEqual([favicon[6], favicon[22], favicon[38]], [16, 32, 48]);
  assert.equal(
    createHash("sha256").update(favicon).digest("hex"),
    "f699b66241e25449c3a275c0c78857f115c958df1cb8f327ebbc54da9025b450",
  );
});

test("explains automatic stop and resume behavior", async () => {
  const home = await (await render()).text();
  assert.match(home, /Your place will be saved automatically in this browser\./);
  assert.match(home, /Check your understanding\. Selected lessons add a guided field exercise\./);
  assert.doesNotMatch(home, /Predict or reproduce the flow yourself/);

  const lesson = await (await render("/lessons/landscape")).text();
  assert.match(lesson, /Your place is saved in this browser\.|Your place saves as you read\./);

  // The completion model is implemented: the client reads v2, migrates v1,
  // and completion is counted only from explicitly completed units.
  const progressCore = await readFile(new URL("../app/lib/progress.mjs", import.meta.url), "utf8");
  assert.match(progressCore, /inside-protege-progress-v2/);
  assert.match(progressCore, /completedUnitIds: \[\]/);

  const home2 = await (await render()).text();
  assert.match(home2, /Course completion/);
  assert.match(home2, /0 of \d+ sections/);
});

test("keeps optional foundation material out of required v2 progress", async () => {
  const courseSource = await readFile(new URL("../app/lib/course.ts", import.meta.url), "utf8");
  assert.match(courseSource, /depth\?: "foundation" \| "core"/);
  assert.match(courseSource, /filter\(\(section\) => section\.depth !== "foundation"\)/);

  const progressCore = await readFile(new URL("../app/lib/progress.mjs", import.meta.url), "utf8");
  assert.match(progressCore, /inside-protege-progress-v2/);
  assert.doesNotMatch(progressCore, /inside-protege-progress-v3/);
});

test("offers explicit completion controls on lesson pages", async () => {
  const landscape = await (await render("/lessons/landscape")).text();
  assert.match(landscape, /Mark section complete/);
  assert.match(landscape, /Revealing this answer records the section as complete\./);

  const plugin = await (await render("/lessons/build-plugin")).text();
  assert.match(plugin, /I completed this exercise/);
});

test("keeps the menu actionable and offers a restart path", async () => {
  const home = await (await render()).text();
  assert.doesNotMatch(home, />References<\/span>/);

  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(styles, /\.header-search-link \{[^}]*width: 44px;[^}]*height: 44px;/s);
  assert.match(styles, /\.header-search-link::before \{[^}]*width: 34px;[^}]*height: 34px;/s);

  const resumeSource = await readFile(new URL("../app/components/ResumeCourse.tsx", import.meta.url), "utf8");
  assert.match(resumeSource, /Restart from Lesson 1/);
  assert.match(resumeSource, /clearProgress\(\)/);
  assert.match(resumeSource, /clears your course completion and your saved reading position/);

  const clientSource = await readFile(new URL("../app/lib/progress-client.ts", import.meta.url), "utf8");
  assert.match(clientSource, /removeItem\(PROGRESS_V2_KEY\)/);
  assert.match(clientSource, /removeItem\(PROGRESS_V1_KEY\)/);
});

test("server-renders every production page type", async () => {
  const pages = [
    ["/lessons/open-ontology", /Who receives a file after the user clicks Open\?/],
    ["/lessons/build-plugin", /How do you turn a small Java class into a plugin Protégé can discover and run\?/],
    ["/lessons/edit-through-frames", /How does a row in Protégé become an OWL axiom change\?/],
    ["/atlas", /One system, four relationship lenses\./],
    ["/reference", /Details you need often, without breaking the learning trail\./],
    ["/search", /Find the lesson, concept, class, or tool you need\./],
  ];

  for (const [path, expected] of pages) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.match(html, expected, path);
    assert.doesNotMatch(html, /Inside Protégé \| Inside Protégé/, path);
    assert.doesNotMatch(html, /Application error|Internal Server Error/, path);
  }
});

test("searches lessons and references without client-side routing", async () => {
  const emptySearch = await (await render("/search")).text();
  assert.match(emptySearch, /Search the Protégé code tutorial/);
  assert.match(emptySearch, /Useful starting searches/);
  assert.match(emptySearch, /Event Dispatch Thread/);

  const felixResults = await (await render("/search?q=Felix")).text();
  assert.match(felixResults, /Matches for/);
  assert.match(felixResults, /name="q" value="Felix"/);
  assert.match(felixResults, /Apache Felix/);
  assert.match(felixResults, /href="\/lessons\/startup#plain-jvm"/);
  assert.match(felixResults, /href="\/reference#reference-technology-felix"/);

  const classResults = await (await render("/search?q=OWLEditorKit")).text();
  assert.match(classResults, /OWLEditorKit is the assembly point/);
  assert.match(classResults, /href="\/lessons\/open-ontology#object-assembly"/);
  assert.match(classResults, /href="\/lessons\/landscape#central-seam"/);

  const noResults = await (await render("/search?q=definitely-not-a-course-term")).text();
  assert.match(noResults, /No course content matched that phrase/);

  const headerSource = await readFile(new URL("../app/components/SiteHeader.tsx", import.meta.url), "utf8");
  assert.match(headerSource, /href="\/search"/);
});

test("teaches the frame-based ontology editing idiom", async () => {
  const frames = await (await render("/lessons/edit-through-frames")).text();
  assert.match(frames, /Lesson 10 of 10/);
  assert.match(frames, /Frame means an entity-shaped editor, not a window/);
  assert.match(frames, /OWLFrameList&lt;OWLClass&gt;/);
  assert.match(frames, /Anatomy of a class description editor/);
  assert.match(frames, /R = selected root, A = stored axiom type, E = value edited/);
  assert.match(frames, /Add one SubClass Of axiom/);
  assert.match(frames, /getOWLDataFactory/);
  assert.match(frames, /FreshAxiomLocationStrategy/);
  assert.match(frames, /RemoveAxiom followed by AddAxiom/);
  assert.match(frames, /An inferred row has no asserting ontology/);
  assert.match(frames, /Trace a sibling axiom editor/);
  assert.match(frames, /OWLModelManager\.applyChanges/);
});

test("teaches plugin authoring with buildable, sourced artifacts", async () => {
  const plugin = await (await render("/lessons/build-plugin")).text();
  assert.match(plugin, /Lesson 9 of 10/);
  assert.match(plugin, /From source tree to visible ViewComponent/);
  assert.match(plugin, /singleton:=true/);
  assert.match(plugin, /generated manifest, not the POM text, is the runtime source of truth/i);
  assert.match(plugin, /\[4\.1,5\)/);
  assert.match(plugin, /excludes 5\.0 and every later major version/);
  assert.match(plugin, /Never embed Protégé or OWL API classes in a plugin/);
  assert.match(plugin, /ClassCastException/);
  assert.match(plugin, /registry=&quot;split&quot;/);
  assert.match(plugin, /mvn clean package/);
  assert.match(plugin, /Window &gt; Views/);
  assert.match(plugin, /d879601324d0c45d99e0d0879219ef15763ced50/);
  assert.match(plugin, /1dd0896c8dd07b4f764d40225e374a5dc15a5d28/);

  const pom = await readFile(new URL("../exercises/minimal-view-plugin/pom.xml", import.meta.url), "utf8");
  assert.match(pom, /<packaging>bundle<\/packaging>/);
  assert.match(pom, /<scope>provided<\/scope>/);
  assert.match(pom, /singleton:=true/);
  assert.match(pom, /org\.protege\.editor\.owl\.\*;version="\[5\.6,6\)"/);

  const pluginXml = await readFile(new URL("../exercises/minimal-view-plugin/src/main/resources/plugin.xml", import.meta.url), "utf8");
  assert.match(pluginXml, /point="org\.protege\.editor\.core\.application\.ViewComponent"/);
  assert.match(pluginXml, /edu\.stanford\.bmir\.protege\.examples\.view\.ExampleViewComponent/);

  const artifact = await readFile(new URL("../docs/source-artifacts/existentialquery-2.0.0-manifest.txt", import.meta.url), "utf8");
  assert.match(artifact, /87182fe546fccc76e15e09900f6cc710d793a643d9dbbad953794770aed8802c/);
  assert.match(artifact, /org\.semanticweb\.owlapi\.model;version="\[4\.1,5\)"/);
});

test("renders handbook-aligned developer guidance", async () => {
  const reference = await (await render("/reference")).text();
  assert.match(reference, /Java 11 is the compilation target/);
  assert.match(reference, /Audited against Matthew Horridge/);
  assert.match(reference, /editor-core declares 12/);
  assert.match(reference, /editor-owl declares 12/);
  assert.match(reference, /OtherStartupActions/);
  assert.match(reference, /ExtraReasonerMenuAction/);
  assert.match(reference, /Start with these four/);
  assert.match(reference, /Choose the socket that matches the job/);
  assert.match(reference, /Add a configurable, dockable view inside an editor kit/);
  assert.match(reference, /Add a menu, submenu, or action for an editor kit/);
  assert.match(reference, /Register a selectable OWL reasoner factory/);
  assert.match(reference, /Contribute a CatalogEntryManager for ontology-library entries/);
  assert.match(reference, /protege-editor-core\/schema\/ViewComponent\.exsd#L1/);
  assert.match(reference, /protege-editor-owl\/schema\/ReasonerFactory\.exsd#L1/);
  assert.ok((reference.match(/No \.exsd in this snapshot/g)?.length ?? 0) >= 4);
  assert.match(reference, /Protégé Developer Documentation wiki/);
  assert.match(reference, /protege-dev mailing list and support/);
  assert.match(reference, /README\.md#L11/);
  assert.match(reference, /Names the codebase assumes you already know/);
  assert.match(reference, /OSGi Core framework overview/);
  assert.match(reference, /Eclipse Equinox extension registry/);
  assert.match(reference, /Apache Felix/);
  assert.match(reference, /Swing and the Event Dispatch Thread/);
  assert.match(reference, /bnd OSGi bundle tooling/);
  assert.match(reference, /target="_blank"/);
  assert.doesNotMatch(reference, /Java 11 is the ceiling/);

  const extensionPointIds = [
    "ViewComponent", "WorkspaceTab", "EditorKitMenuAction", "ToolBarAction", "ViewAction",
    "preferencespanel", "explanationpreferencespanel", "EditorKitHook", "EditorKitFactory",
    "OntologyRepositoryFactory", "OntologyLoader", "OtherStartupActions",
    "inference_reasonerfactory", "inference_preferences", "explanation",
    "inconsistentOntologyExplanation", "entity_renderer", "ui_renderer_entitycolorprovider",
    "ui_editor_description", "searchmanager", "moveaxiomskit", "io_listener", "repository",
    "ExtraReasonerMenuAction",
  ];
  for (const id of extensionPointIds) {
    assert.match(reference, new RegExp(`id="extension-${id}"`), id);
  }

  const extension = await (await render("/lessons/extension")).text();
  assert.match(extension, /installation location contains the word plugin/);
  assert.match(extension, /three separate facts/);
  assert.match(extension, /Plugin JAR contract/);
  assert.match(extension, /default authoring choice/);
  assert.match(extension, /This is not an omission default/);
  assert.match(extension, /rejects a missing attribute/);
  assert.match(extension, /ViewComponentPluginJPFImpl/);
  assert.match(extension, /historical leftovers, not evidence that the current runtime uses JPF/);
  assert.match(extension, /EditorKitExtensionMatcher\.java#L12/);
  assert.match(extension, /PluginParameterExtensionMatcher\.java#L68/);
  assert.match(extension, /ViewComponentPluginJPFImpl\.java#L3/);
  assert.match(extension, /a class named only at runtime is invisible to BND/);
  assert.match(extension, /Class\.forName\(lafClsName\)/);
  assert.match(extension, /UIManager an explicit classloader/);
  assert.match(extension, /ProtegeApplication\.java#L321/);

  const change = await (await render("/lessons/change")).text();
  assert.match(change, /A coarse-event listener that throws is logged and then removed/);
  assert.match(change, /If updates quietly stop, inspect protege\.log/);
  assert.match(change, /modelManagerChangeListeners\.remove\(listener\)/);
  assert.match(change, /OWLModelManagerImpl\.java#L188/);

  const workSafely = await (await render("/lessons/work-safely")).text();
  assert.match(workSafely, /Use three loops, not one build for every question/);
  assert.match(workSafely, /mvn -Pide package/);
  assert.match(workSafely, /unpacks provided dependencies into target\/dependency/);
  assert.match(workSafely, /~\/\.Protege\/plugins/);
  assert.match(workSafely, /Protégé reactor does not need to rebuild/);
  assert.match(workSafely, /The shortest faithful feedback loop/);
  assert.match(workSafely, /mvn -Prelease clean package/);
  assert.match(workSafely, /\.Protege\/logs\/protege\.log/);
});

test("introduces external technologies before relying on their vocabulary", async () => {
  const landscape = await (await render("/lessons/landscape")).text();
  assert.match(landscape, /OSGi is a set of Java specifications/);
  assert.match(landscape, /Protégé does not use Equinox as its OSGi framework/);
  assert.match(landscape, /OWL is a W3C language for describing ontologies/);
  assert.match(landscape, /OWL API is a Java library, not the OWL language itself/);
  assert.match(landscape, /docs\.osgi\.org\/specification\/osgi\.core/);

  const startup = await (await render("/lessons/startup")).text();
  assert.match(startup, /Apache Felix is an implementation of the OSGi framework specification/);
  assert.match(startup, /SAX is Java&#x27;s event-driven XML parsing API/);

  const openOntology = await (await render("/lessons/open-ontology")).text();
  assert.match(openOntology, /Swing is Java&#x27;s long-standing desktop user-interface toolkit/);
  assert.match(openOntology, /Oracle Event Dispatch Thread guide/);

  const workSafely = await (await render("/lessons/work-safely")).text();
  assert.match(workSafely, /PDE is Eclipse&#x27;s Plug-in Development Environment/);
  assert.match(workSafely, /bnd is OSGi bundle tooling used behind Maven/);
  assert.match(workSafely, /META-INF\/MANIFEST\.MF/);
});

test("renders architecture as connected, accessible diagrams", async () => {
  const landscape = await (await render("/lessons/landscape")).text();
  assert.match(landscape, /Class and ownership diagram/);
  assert.match(landscape, /ModelManager/);
  assert.match(landscape, /OWLModelManagerImpl/);
  assert.match(landscape, /Core contract and OWL implementation relationships/);
  assert.match(landscape, /What the box colors mean/);
  assert.match(landscape, /Runtime &amp;(amp;)? packaging|Runtime & packaging/);
  assert.match(landscape, /Framework \(editor-core\)/);

  const extension = await (await render("/lessons/extension")).text();
  assert.match(extension, /Extension architecture diagram/);
  assert.match(extension, /Core extension point/);
  assert.match(extension, /Third-party plugin\.xml/);

  const source = await readFile(new URL("../app/components/RelationshipDiagram.tsx", import.meta.url), "utf8");
  assert.match(source, /<canvas/);
  assert.match(source, /data-diagram-node/);
  assert.match(source, /diagram-mobile-relations/);
  assert.equal(source.match(/geometries\.forEach/g)?.length, 2);
  assert.match(source, /diagram-code-title/);

  const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
  assert.match(styles, /\.diagram-node \.diagram-code-title \{[^}]*white-space: nowrap/);
  assert.match(styles, /\.code-cutaway pre \{[^}]*box-sizing: border-box;[^}]*width: 100%/);
  assert.match(styles, /\.code-cutaway pre code \{[^}]*display: block;[^}]*max-width: 100%/);
});

test("teaches the first three lessons from the motivating mechanisms", async () => {
  const landscape = await (await render("/lessons/landscape")).text();
  assert.ok(
    landscape.indexOf("How can Protégé display code it has never heard of?")
      < landscape.indexOf("Five modules, three different jobs"),
  );
  assert.match(landscape, /186 extension declarations across 1,898 lines/);
  assert.match(landscape, /Fifty-one of those declarations offer view panels/);
  assert.match(landscape, /default Classes-tab layout places only five/);
  assert.match(landscape, /OWLClassAnnotationsViewComponent/);
  assert.match(landscape, /Two attributes, two different questions/);
  assert.match(landscape, /The compiler protects types, not strings/);
  assert.match(landscape, /0 OWL or OWL API imports in editor-core and 516 editor-core imports in editor-owl/);

  const startup = await (await render("/lessons/startup")).text();
  assert.match(startup, /34 dependency artifacts/);
  assert.match(startup, /One classpath cannot safely host an open-ended application/);
  assert.match(startup, /OSGi from zero: loaders, needs, and offers/);
  assert.match(startup, /Skip this if you already understand bundle classloaders/);
  assert.match(startup, /Bundle-SymbolicName: org\.protege\.common/);
  assert.match(startup, /org\.osgi\.framework;version=&quot;\[1\.10,2\)&quot;/);
  assert.match(startup, /An unresolved required import means no bundle start/);
  assert.match(startup, /\.Protege\/logs\/protege\.log/);
  assert.match(startup, /sun\.\*, com\.sun\.\*, apple\.\*, and com\.apple\.\*/);
  assert.match(startup, /The five configured start blocks/);
  assert.match(startup, /org\.eclipse\.equinox\.common\.jar; org\.eclipse\.equinox\.supplement\.jar/);

  const ontology = await (await render("/lessons/open-ontology")).text();
  assert.match(ontology, /Swing from zero: one event loop, one UI thread/);
  assert.match(ontology, /What invokeLater actually does/);
  assert.match(ontology, /\[paint A, updateView\]/);
  assert.match(ontology, /invokeLater returns immediately/);
  assert.match(ontology, /receives an already-unwrapped EditorKitFactory/);
});

test("renders the precise cross-lesson corrections from the teaching pass", async () => {
  const screen = await (await render("/lessons/screen")).text();
  assert.match(screen, /Two namespaces, one shape/);
  assert.match(screen, /org\.protege\.editor\.owl\.OWLClassDescription in a layout&#x27;s pluginId/);
  assert.match(screen, /catalogue key formed from the contributor namespace and extension id/);

  const safety = await (await render("/lessons/work-safely")).text();
  assert.match(safety, /The CORBA ORB crosses only some of the four contracts/);
  assert.match(safety, /bundles\/glassfish-corba-orb\.jar/);
  assert.match(safety, /both ship glassfish-corba-omgapi instead/);
  assert.match(safety, /open question, not a diagnosed consequence/);

  const navigation = await (await render("/lessons/navigate")).text();
  assert.match(navigation, /case-insensitive search for owl under editor-core matches 20 Java files/);
  assert.match(navigation, /Window, showLog, and FlowLayout noise/);
  assert.match(navigation, /\^import \(org\\\.protege/);

  const plugin = await (await render("/lessons/build-plugin")).text();
  assert.match(plugin, /Use JDK 11 if the full host build misses AutoValue classes/);
  assert.match(plugin, /12 expected AutoValue_\* classes were not generated/);
  assert.match(plugin, /auto-value 1\.6\.5 beside auto-value-annotations 1\.11\.1/);
  assert.match(plugin, /root cause has not been established/);
});

test("links the runnable OWL API companion without overstating raw-change behavior", async () => {
  const reference = await (await render("/reference")).text();
  assert.match(reference, /For runnable practice from zero, Matthew Horridge&#x27;s OWL API 4\.x tutorial/);
  assert.match(reference, /ten ordered main classes, three written guides, and tests/);
  assert.match(reference, /protege-owlapi-tutorial\/tree\/1953d8f93da9efee147ade7dba4f763b033ac91f/);

  const plugin = await (await render("/lessons/build-plugin")).text();
  assert.match(plugin, /independently reaches the same provided-scope rule/);
  assert.match(plugin, /Runnable Lesson 6: changes and undo/);
  assert.match(plugin, /Use OWLModelManager even though raw changes still notify listeners/);
  assert.match(plugin, /records history and dirty state/);
  assert.match(plugin, /stronger claim that every raw call skips undo and UI is therefore not supported/);
  assert.match(plugin, /OWLModelManager\.java#L702|OWLModelManagerImpl\.java#L702/);
});

test("internal navigation remains browser-native", async () => {
  const navigationFiles = [
    "../app/page.tsx",
    "../app/atlas/page.tsx",
    "../app/reference/page.tsx",
    "../app/components/CourseMap.tsx",
    "../app/components/LessonPage.tsx",
    "../app/components/SiteHeader.tsx",
    "../app/search/page.tsx",
  ];

  for (const path of navigationFiles) {
    const source = await readFile(new URL(path, import.meta.url), "utf8");
    assert.doesNotMatch(source, /next\/link|<\/?Link\b/, path);
  }
});
