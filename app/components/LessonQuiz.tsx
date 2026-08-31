import { sourceRefUrl } from "@/app/lib/course";
import type { QuizGroup } from "@/app/lib/quizzes";

export function LessonQuiz({ groups }: { groups: QuizGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <section className="lesson-quizzes" aria-labelledby="lesson-quiz-title">
      <header>
        <span>Optional diagnostic</span>
        <h2 id="lesson-quiz-title">Check what stayed with you</h2>
        <p>
          Answer from memory before revealing each explanation. These delayed
          questions do not affect course completion or save any response.
        </p>
      </header>

      {groups.map((group) => (
        <article className="quiz-group" key={group.id}>
          <div className="quiz-group-heading">
            <div>
              <span>{group.eyebrow}</span>
              <h3>{group.title}</h3>
            </div>
            <small>{group.items.length} questions</small>
          </div>
          <p>{group.intro}</p>
          <ol>
            {group.items.map((item) => (
              <li key={item.id}>
                <details className="quiz-item">
                  <summary>
                    <span className="quiz-question">{item.question}</span>
                    {item.marker && <span className={`quiz-marker quiz-marker-${item.marker}`}>{item.marker}</span>}
                  </summary>
                  <div className="quiz-answer">
                    <span>Answer</span>
                    <p>{item.answer}</p>
                    <div className="quiz-sources" aria-label="Answer sources">
                      {item.sources.map((source) => (
                        <a
                          href={sourceRefUrl(source)}
                          key={`${source.path}-${source.line}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {source.label} ↗
                        </a>
                      ))}
                    </div>
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </article>
      ))}
    </section>
  );
}
