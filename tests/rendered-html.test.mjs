import assert from "node:assert/strict";
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
  assert.match(html, /<title>Inside Protégé \| A source-guided field course<\/title>/i);
  assert.match(html, /Learn Protégé by following one clear path\./);
  assert.match(html, /Start Journey 1/);
  assert.match(html, /A repeated four-step learning rhythm/);
  assert.match(html, /Follow all 10 journeys in order/);
  assert.match(html, /Architecture Atlas/);
  assert.match(html, /Field notebook/);
  assert.match(html, /d9c9d39/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("explains automatic stop and resume behavior", async () => {
  const home = await (await render()).text();
  assert.match(home, /Your place will be saved automatically in this browser\./);
  assert.match(home, /Check your understanding\. Selected journeys add a guided field exercise\./);
  assert.doesNotMatch(home, /Predict or reproduce the flow yourself/);

  const lesson = await (await render("/journeys/landscape")).text();
  assert.match(lesson, /Your place is saved in this browser\.|Saving your place/);

  const resumeSource = await readFile(new URL("../app/components/ResumeCourse.tsx", import.meta.url), "utf8");
  assert.match(resumeSource, /inside-protege-progress-v1/);
  assert.doesNotMatch(resumeSource, /completedUnitIds|inside-protege-progress-v2/);

  const proposal = await readFile(new URL("../docs/progress-model-proposal.md", import.meta.url), "utf8");
  assert.match(proposal, /Status: proposal only, not approved or implemented/);
  assert.match(proposal, /Mark section\s+complete/);
  assert.match(proposal, /inside-protege-progress-v2/);
  assert.match(proposal, /copy its valid fields into `lastPosition`/);
  assert.match(proposal, /initialize\s+`completedUnitIds` to an empty array/);
  assert.match(proposal, /Label the home-page bar \*\*Course completion\*\*/);
});

test("keeps the menu actionable and offers a restart path", async () => {
  const home = await (await render()).text();
  assert.doesNotMatch(home, />References<\/span>/);

  const resumeSource = await readFile(new URL("../app/components/ResumeCourse.tsx", import.meta.url), "utf8");
  assert.match(resumeSource, /Restart from Journey 1/);
  assert.match(resumeSource, /removeItem\(COURSE_PROGRESS_KEY\)/);
});

test("server-renders every production page type", async () => {
  const pages = [
    ["/journeys/open-ontology", /Who receives a file after the user clicks Open\?/],
    ["/journeys/build-plugin", /How do you turn a small Java class into a plugin Protégé can discover and run\?/],
    ["/journeys/edit-through-frames", /How does a row in Protégé become an OWL axiom change\?/],
    ["/atlas", /One system, four relationship lenses\./],
    ["/reference", /Details you need often, without breaking the learning trail\./],
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

test("teaches the frame-based ontology editing idiom", async () => {
  const frames = await (await render("/journeys/edit-through-frames")).text();
  assert.match(frames, /Journey 10 of 10/);
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
  const plugin = await (await render("/journeys/build-plugin")).text();
  assert.match(plugin, /Journey 9 of 10/);
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

  const extension = await (await render("/journeys/extension")).text();
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

  const change = await (await render("/journeys/change")).text();
  assert.match(change, /A coarse-event listener that throws is logged and then removed/);
  assert.match(change, /If updates quietly stop, inspect protege\.log/);
  assert.match(change, /modelManagerChangeListeners\.remove\(listener\)/);
  assert.match(change, /OWLModelManagerImpl\.java#L188/);

  const workSafely = await (await render("/journeys/work-safely")).text();
  assert.match(workSafely, /Use three loops, not one build for every question/);
  assert.match(workSafely, /mvn -Pide package/);
  assert.match(workSafely, /unpacks provided dependencies into target\/dependency/);
  assert.match(workSafely, /~\/\.Protege\/plugins/);
  assert.match(workSafely, /Protégé reactor does not need to rebuild/);
  assert.match(workSafely, /The shortest faithful feedback loop/);
  assert.match(workSafely, /mvn -Prelease clean package/);
  assert.match(workSafely, /\.Protege\/logs\/protege\.log/);
});

test("renders architecture as connected, accessible diagrams", async () => {
  const landscape = await (await render("/journeys/landscape")).text();
  assert.match(landscape, /Class and ownership diagram/);
  assert.match(landscape, /ModelManager/);
  assert.match(landscape, /OWLModelManagerImpl/);
  assert.match(landscape, /Core contract and OWL implementation relationships/);

  const extension = await (await render("/journeys/extension")).text();
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

test("internal navigation remains browser-native", async () => {
  const navigationFiles = [
    "../app/page.tsx",
    "../app/atlas/page.tsx",
    "../app/reference/page.tsx",
    "../app/components/CourseMap.tsx",
    "../app/components/LessonPage.tsx",
    "../app/components/SiteHeader.tsx",
  ];

  for (const path of navigationFiles) {
    const source = await readFile(new URL(path, import.meta.url), "utf8");
    assert.doesNotMatch(source, /next\/link|<\/?Link\b/, path);
  }
});
