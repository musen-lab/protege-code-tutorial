import type { Metadata } from "next";
import { SiteHeader } from "@/app/components/SiteHeader";
import { searchCourse } from "@/app/lib/search";

export const metadata: Metadata = {
  title: "Search",
  description: "Search every lesson, technology primer, Architecture Atlas lens, and Field Notebook section.",
};

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: Promise<{ q?: string | string[] }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = (Array.isArray(params.q) ? params.q[0] ?? "" : params.q ?? "").trim();
  const results = searchCourse(query);

  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="search-page">
        <header className="search-hero">
          <span className="eyebrow">Course search</span>
          <h1>Find the lesson, concept, class, or tool you need.</h1>
          <p>Searches every lesson section, diagram, source cutaway, technology primer, Atlas lens, and Field Notebook section.</p>
          <form className="course-search" action="/search" method="get" role="search">
            <label htmlFor="course-search-query">Search the Protégé code tutorial</label>
            <div>
              <input
                id="course-search-query"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Try OSGi, OWLEditorKit, Event Dispatch Thread..."
                autoComplete="off"
              />
              <button type="submit">Search</button>
            </div>
          </form>
        </header>

        {query ? (
          <section className="search-results" aria-live="polite">
            <div className="search-results-heading">
              <span>{results.length} {results.length === 1 ? "result" : "results"}</span>
              <h2>Matches for “{query}”</h2>
            </div>
            {results.length > 0 ? (
              <ol>
                {results.map((result) => (
                  <li key={`${result.kind}-${result.href}-${result.title}`}>
                    <a href={result.href}>
                      <span>{result.kind}</span>
                      <h3>{result.title}</h3>
                      <p>{result.context}</p>
                      <strong>Open result →</strong>
                    </a>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="search-empty">
                <h3>No course content matched that phrase.</h3>
                <p>Try a class name, extension point, platform, or shorter mechanism name.</p>
              </div>
            )}
          </section>
        ) : (
          <section className="search-suggestions" aria-labelledby="search-suggestions-title">
            <h2 id="search-suggestions-title">Useful starting searches</h2>
            <div>
              {[
                ["OSGi", "Runtime modules and package visibility"],
                ["Equinox", "plugin.xml and extension discovery"],
                ["Event Dispatch Thread", "Swing thread boundaries"],
                ["OWLEditorKit", "The OWL composition root"],
                ["ViewComponent", "Plugin views and extension contracts"],
                ["applyChanges", "Ontology changes, history, and events"],
              ].map(([term, description]) => (
                <a href={`/search?q=${encodeURIComponent(term)}`} key={term}>
                  <strong>{term}</strong>
                  <span>{description}</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
