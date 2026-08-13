import { RelationshipDiagram } from "./components/RelationshipDiagram";
import { ResumeCourse } from "./components/ResumeCourse";
import { SiteHeader } from "./components/SiteHeader";
import { atlasLenses, lessons, SOURCE_COMMIT } from "./lib/course";

export default function Home() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main>
        <section className="home-hero">
          <div className="home-hero-copy">
            <span className="eyebrow">{`One course · ${lessons.length} journeys · one recommended order`}</span>
            <h1>Learn Protégé by following one clear path.</h1>
            <p>
              {`${lessons.length} source-backed journeys move from a user action to the modules, classes, runtime wiring, ontology state, and UI reactions that make it work. Start at Journey 1 and continue in order.`}
            </p>
            <div className="snapshot-note">
              <span>Verified snapshot</span>
              <code>{SOURCE_COMMIT.slice(0, 7)}</code>
              <span>Java 11 · Protégé 5.6.10-SNAPSHOT</span>
            </div>
          </div>
          <ResumeCourse />
        </section>

        <section className="course-rhythm" aria-labelledby="course-rhythm-title">
          <div>
            <span className="eyebrow">How every journey works</span>
            <h2 id="course-rhythm-title">A repeated four-step learning rhythm</h2>
            <p>This is the method used inside each journey, not another place to navigate.</p>
          </div>
          <ol>
            <li><span>1</span><strong>Observe</strong><p>Begin with something Protégé visibly does.</p></li>
            <li><span>2</span><strong>Trace</strong><p>Follow that behavior through modules and objects.</p></li>
            <li><span>3</span><strong>Read</strong><p>Inspect the small source cutaway that explains it.</p></li>
            <li><span>4</span><strong>Practice</strong><p>Predict or reproduce the flow yourself.</p></li>
          </ol>
        </section>

        <section className="journey-index">
          <div className="home-section-heading">
            <span className="eyebrow">The primary course</span>
            <h2>{`Follow all ${lessons.length} journeys in order`}</h2>
            <p>Each journey assumes the mental model built by the one before it.</p>
          </div>
          <div className="journey-cards">
            {lessons.map((lesson) => (
              <a href={`/journeys/${lesson.slug}`} key={lesson.slug} className="journey-card">
                <span>{String(lesson.number).padStart(2, "0")}</span>
                <div>
                  <small>{lesson.duration}</small>
                  <h3>{lesson.title}</h3>
                  <p>{lesson.question}</p>
                </div>
                <b aria-hidden="true">→</b>
              </a>
            ))}
          </div>
        </section>

        <section className="home-map-section">
          <div className="home-section-heading">
            <span className="eyebrow">A preview, not another starting point</span>
            <h2>One visual language follows you through the course</h2>
            <p>Diagrams answer a specific relationship question. Select a node to read its role.</p>
          </div>
          <RelationshipDiagram diagram={atlasLenses.modules} />
        </section>

        <section className="reference-tools">
          <div className="home-section-heading">
            <span className="eyebrow">Supporting references</span>
            <h2>Use these when a journey points you there</h2>
            <p>They deepen or refresh the course. They are not competing starting points.</p>
          </div>
          <div className="reference-tool-grid">
            <a href="/atlas">
              <span>Visual reference</span>
              <strong>Architecture Atlas</strong>
              <p>Revisit module, runtime, extension, and edit-flow relationships.</p>
            </a>
            <a href="/reference">
              <span>Lookup reference</span>
              <strong>Field Notebook</strong>
              <p>Refresh Java idioms, class landmarks, extension points, and search recipes.</p>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
