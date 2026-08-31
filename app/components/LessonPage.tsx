import type { Lesson, LessonSection } from "@/app/lib/course";
import { adjacentLessons, lessons, sectionUnitId, sourceUrl } from "@/app/lib/course";
import { Checkpoint } from "./Checkpoint";
import { CourseMap } from "./CourseMap";
import { ProgressTracker } from "./ProgressTracker";
import { RelationshipDiagram } from "./RelationshipDiagram";
import { ExerciseCompletion, ProgressLiveRegion, SectionCompletion } from "./SectionCompletion";
import { SectionNav } from "./SectionNav";
import { SiteHeader } from "./SiteHeader";
import { SourceLink } from "./SourceLink";
import { TechnologyPrimerGroup } from "./TechnologyPrimer";
import { LessonQuiz } from "./LessonQuiz";
import { getQuizGroups } from "@/app/lib/quizzes";

function SectionBody({ lessonSlug, section }: { lessonSlug: string; section: LessonSection }) {
  const isFoundation = section.depth === "foundation";

  return (
    <>
      {!isFoundation && (
        <div className="section-copy">
          <span className="eyebrow">{section.eyebrow}</span>
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      )}

      {isFoundation && (
        <div className="section-copy foundation-copy">
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      )}

      {section.technologyIds && <TechnologyPrimerGroup ids={section.technologyIds} />}

      {section.diagram && <RelationshipDiagram diagram={section.diagram} />}

      {section.callout && (
        <aside className="course-callout">
          <span>{section.callout.label}</span>
          <h3>{section.callout.title}</h3>
          <p>{section.callout.body}</p>
        </aside>
      )}

      {section.table && (
        <figure className="course-table">
          <h3>{section.table.title}</h3>
          <div>
            <table>
              <thead>
                <tr>{section.table.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr>
              </thead>
              <tbody>
                {section.table.rows.map((row, rowIndex) => (
                  <tr key={`${section.table?.title}-${rowIndex}`}>
                    {row.map((cell, cellIndex) => cellIndex === 0
                      ? <th key={cellIndex} scope="row">{cell}</th>
                      : <td key={cellIndex}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <figcaption>{section.table.caption}</figcaption>
        </figure>
      )}

      {section.code && (
        <figure className="code-cutaway">
          <div className="code-heading">
            <span>Source cutaway</span>
            <a href={section.code.url ?? sourceUrl(section.code.path, section.code.line)} target="_blank" rel="noreferrer">
              {section.code.path}:{section.code.line} ↗
            </a>
          </div>
          <pre><code>{section.code.snippet}</code></pre>
          <figcaption>{section.code.focus}</figcaption>
        </figure>
      )}

      {(section.javaNote || section.bridge) && (
        <div className="learning-notes">
          {section.javaNote && (
            <aside className="learning-note java-note">
              <span>Java time capsule</span>
              <h3>{section.javaNote.title}</h3>
              <p>{section.javaNote.body}</p>
            </aside>
          )}
          {section.bridge && (
            <aside className="learning-note bridge-note">
              <span>Transfer bridge</span>
              <h3>{section.bridge.title}</h3>
              <p><strong>Useful:</strong> {section.bridge.useful}</p>
              <p><strong>Where it breaks:</strong> {section.bridge.limit}</p>
            </aside>
          )}
        </div>
      )}

      {section.exercise && (
        <aside className="exercise-block">
          <span>Hands-on exercise</span>
          <h3>{section.exercise.title}</h3>
          <p>{section.exercise.goal}</p>
          <code className="exercise-path">{section.exercise.path}</code>
          <ol>
            {section.exercise.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
          {section.exercise.commands && <pre><code>{section.exercise.commands}</code></pre>}
          <strong>Evidence of success</strong>
          <ul>
            {section.exercise.verify.map((item) => <li key={item}>{item}</li>)}
          </ul>
          {!isFoundation && <ExerciseCompletion unitId={sectionUnitId(lessonSlug, section.id)} />}
        </aside>
      )}

      {section.checkpoint && (
        <Checkpoint
          {...section.checkpoint}
          unitId={sectionUnitId(lessonSlug, section.id)}
          completesSection={!isFoundation && !section.exercise}
        />
      )}

      {!isFoundation && !section.exercise && !section.checkpoint && (
        <SectionCompletion unitId={sectionUnitId(lessonSlug, section.id)} />
      )}
    </>
  );
}

export function LessonPage({ lesson }: { lesson: Lesson }) {
  const { previous, next } = adjacentLessons(lesson.slug);
  const progress = Math.round((lesson.number / lessons.length) * 100);
  const quizGroups = getQuizGroups(lesson.slug);

  return (
    <div className="site-shell">
      <SiteHeader />
      <div className="lesson-progress" aria-label={`Lesson ${lesson.number} of ${lessons.length}`}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="lesson-grid">
        <aside className="lesson-rail">
          <CourseMap currentSlug={lesson.slug} />
          <SectionNav
            slug={lesson.slug}
            sections={lesson.sections.map(({ id, title }) => ({ id, title }))}
          />
        </aside>

        <main className="lesson-main">
          <ProgressLiveRegion />
          <header className="lesson-hero">
            <div className="lesson-kicker">
              <span>Lesson {lesson.number} of {lessons.length}</span>
              <span>{lesson.duration}</span>
            </div>
            <ProgressTracker number={lesson.number} slug={lesson.slug} title={lesson.title} />
            <h1>{lesson.question}</h1>
            <p>{lesson.summary}</p>
            <div className="outcomes">
              <span>After this lesson, you can</span>
              <ul>
                {lesson.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
              </ul>
            </div>
          </header>

          {lesson.sections.map((section, index) => (
            <section className={`lesson-section${section.depth === "foundation" ? " lesson-section-foundation" : ""}`} id={section.id} key={section.id}>
              <div className="section-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
              {section.depth === "foundation" ? (
                <details className="foundation-section">
                  <summary>
                    <span>{section.eyebrow}</span>
                    <strong>{section.title}</strong>
                    <small>{section.skipIf ?? "Skip this if the background is already familiar."}</small>
                  </summary>
                  <div className="foundation-section-body">
                    <SectionBody lessonSlug={lesson.slug} section={section} />
                  </div>
                </details>
              ) : (
                <SectionBody lessonSlug={lesson.slug} section={section} />
              )}
            </section>
          ))}

          <LessonQuiz groups={quizGroups} />

          <section className="capability-banner">
            <span>You can now</span>
            <h2>{lesson.capability}</h2>
          </section>

          <section id="sources" className="source-trail">
            <div>
              <span className="eyebrow">Verified source trail</span>
              <h2>Reconstruct this lesson yourself</h2>
              <p>These links point to the pinned Protégé source or exact artifact snapshots used to build the tutorial.</p>
            </div>
            <div className="source-list">
              {lesson.sourceRefs.map((source) => <SourceLink key={`${source.path}-${source.line}`} source={source} />)}
            </div>
          </section>

          <nav className="lesson-pagination" aria-label="Lesson navigation">
            {previous ? (
              <a href={`/lessons/${previous.slug}`} className="previous-link">
                <small>← Previous</small>
                <strong>{previous.title}</strong>
              </a>
            ) : (
              <a href="/" className="previous-link">
                <small>← Trailhead</small>
                <strong>Course overview</strong>
              </a>
            )}
            {next ? (
              <a href={`/lessons/${next.slug}`} className="next-link">
                <small>Next →</small>
                <strong>{next.title}</strong>
              </a>
            ) : (
              <a href="/atlas" className="next-link">
                <small>Continue →</small>
                <strong>Architecture Atlas</strong>
              </a>
            )}
          </nav>
        </main>
      </div>
    </div>
  );
}
