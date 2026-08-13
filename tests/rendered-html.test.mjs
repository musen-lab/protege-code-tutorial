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
  assert.match(html, /Follow these nine journeys in order/);
  assert.match(html, /Architecture Atlas/);
  assert.match(html, /Field notebook/);
  assert.match(html, /d9c9d39/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/);
});

test("explains automatic stop and resume behavior", async () => {
  const home = await (await render()).text();
  assert.match(home, /Your place will be saved automatically in this browser\./);

  const lesson = await (await render("/journeys/landscape")).text();
  assert.match(lesson, /Your place is saved in this browser\.|Saving your place/);
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

test("teaches plugin authoring with buildable, sourced artifacts", async () => {
  const plugin = await (await render("/journeys/build-plugin")).text();
  assert.match(plugin, /Journey 9 of 9/);
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
  assert.doesNotMatch(reference, /Java 11 is the ceiling/);

  const extension = await (await render("/journeys/extension")).text();
  assert.match(extension, /installation location contains the word plugin/);
  assert.match(extension, /three separate facts/);
  assert.match(extension, /Plugin JAR contract/);

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
