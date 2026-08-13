import { atlasLenses, lessons } from "./course";
import { technologyPrimerList } from "./technologies";

export type SearchRecord = {
  href: string;
  kind: "Lesson" | "Technology" | "Atlas" | "Field notebook";
  title: string;
  context: string;
  text: string;
};

const lessonRecords: SearchRecord[] = lessons.flatMap((lesson) => {
  const lessonHref = `/journeys/${lesson.slug}`;
  const overview: SearchRecord = {
    href: lessonHref,
    kind: "Lesson",
    title: `Lesson ${lesson.number}: ${lesson.title}`,
    context: lesson.question,
    text: [lesson.title, lesson.question, lesson.summary, ...lesson.outcomes, ...lesson.sourceRefs.flatMap((source) => [source.label, source.path, source.note])].join(" "),
  };

  const sections = lesson.sections.map((section): SearchRecord => ({
    href: `${lessonHref}#${section.id}`,
    kind: "Lesson",
    title: section.title,
    context: `Lesson ${lesson.number}: ${lesson.title}`,
    text: [
      section.eyebrow,
      section.title,
      ...section.paragraphs,
      section.code?.snippet,
      section.code?.focus,
      section.javaNote?.title,
      section.javaNote?.body,
      section.bridge?.title,
      section.bridge?.useful,
      section.bridge?.limit,
      section.checkpoint?.prompt,
      section.checkpoint?.answer,
      section.exercise?.title,
      section.exercise?.goal,
      ...(section.exercise?.steps ?? []),
      ...(section.exercise?.verify ?? []),
      section.diagram?.title,
      section.diagram?.question,
      section.diagram?.caption,
      ...(section.diagram?.nodes.flatMap((node) => [node.title, node.subtitle, node.detail]) ?? []),
      ...(section.diagram?.connections?.flatMap((edge) => [edge.from, edge.label, edge.to]) ?? []),
    ].filter(Boolean).join(" "),
  }));

  return [overview, ...sections];
});

const technologyRecords: SearchRecord[] = technologyPrimerList.map((primer) => ({
  href: `/reference#reference-technology-${primer.id}`,
  kind: "Technology",
  title: primer.name,
  context: primer.description,
  text: [
    primer.name,
    primer.shortName,
    primer.description,
    ...primer.paragraphs,
    ...primer.officialLinks.map((link) => link.label),
    ...primer.protegeSources.flatMap((source) => [source.label, source.path, source.note]),
  ].join(" "),
}));

const atlasRecords: SearchRecord[] = Object.values(atlasLenses).map((lens) => ({
  href: "/atlas",
  kind: "Atlas",
  title: lens.title,
  context: lens.question,
  text: [
    lens.title,
    lens.question,
    lens.caption,
    ...lens.nodes.flatMap((node) => [node.title, node.subtitle, node.detail]),
    ...(lens.connections?.flatMap((edge) => [edge.from, edge.label, edge.to]) ?? []),
  ].join(" "),
}));

const referenceRecords: SearchRecord[] = [
  {
    href: "/reference#java",
    kind: "Field notebook",
    title: "Java time capsule",
    context: "Java 11, lambdas, streams, Optional, generics, AutoValue, concurrency, and nullability",
    text: "Java 11 compilation target runtime JDK lambdas method references streams java.util.Optional Guava Optional generics wildcards AutoValue ExecutorService SwingUtilities ListenableFuture nullability Nonnull Nullable",
  },
  {
    href: "/reference#classes",
    kind: "Field notebook",
    title: "Class landmarks",
    context: "High-value source entry points",
    text: "Launcher ProtegeApplication ProtegeManager EditorKit AbstractPluginLoader PluginUtilities TabbedWorkspace OWLEditorKit OWLModelManagerImpl OntologyLoader HistoryManagerImpl OWLWorkspace AbstractOWLViewComponent bootstrap lifecycle registry model workspace view",
  },
  {
    href: "/reference#extensions",
    kind: "Field notebook",
    title: "Extension-point catalog",
    context: "All 24 first-party extension points and available schemas",
    text: "ViewComponent WorkspaceTab EditorKitMenuAction ToolBarAction ViewAction preferencespanel explanationpreferencespanel EditorKitHook EditorKitFactory OntologyRepositoryFactory OntologyLoader OtherStartupActions inference_reasonerfactory inference_preferences explanation inconsistentOntologyExplanation entity_renderer ui_renderer_entitycolorprovider ui_editor_description searchmanager moveaxiomskit io_listener repository ExtraReasonerMenuAction plugin.xml exsd schema",
  },
  {
    href: "/reference#search",
    kind: "Field notebook",
    title: "Source-navigation recipes",
    context: "Search visible features, model events, dependencies, and extension contracts",
    text: "ripgrep rg visible label ClassName plugin.xml fireEvent addListener artifact package dependency POM assembly ExtensionPointId PluginLoader source navigation search recipes",
  },
];

export const searchRecords = [...lessonRecords, ...technologyRecords, ...atlasRecords, ...referenceRecords];

export function searchCourse(query: string) {
  const normalizedQuery = normalize(query);
  const tokens = normalizedQuery.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];

  return searchRecords
    .map((record) => {
      const title = normalize(record.title);
      const context = normalize(record.context);
      const text = normalize(record.text);
      if (!tokens.every((token) => title.includes(token) || context.includes(token) || text.includes(token))) return null;

      const score = tokens.reduce((total, token) => {
        if (title === normalizedQuery) return total + 12;
        if (title.includes(token)) return total + 6;
        if (context.includes(token)) return total + 3;
        return total + 1;
      }, 0);
      return { ...record, score };
    })
    .filter((record): record is SearchRecord & { score: number } => record !== null)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 60);
}

function normalize(value: string) {
  return value.toLocaleLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}
