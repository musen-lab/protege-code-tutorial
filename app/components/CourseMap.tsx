import { lessons } from "@/app/lib/course";

export function CourseMap({ currentSlug }: { currentSlug?: string }) {
  return (
    <details className="course-map" open>
      <summary>
        <span>Your course route</span>
        <span className="course-map-summary">8 in order</span>
      </summary>
      <ol>
        {lessons.map((lesson) => (
          <li key={lesson.slug} className={lesson.slug === currentSlug ? "is-current" : ""}>
            <a href={`/journeys/${lesson.slug}`} aria-current={lesson.slug === currentSlug ? "page" : undefined}>
              <span>{String(lesson.number).padStart(2, "0")}</span>
              <span>
                <strong>{lesson.title}</strong>
                <small>{lesson.duration}</small>
              </span>
            </a>
          </li>
        ))}
      </ol>
      <div className="course-map-reference">
        <span>References</span>
        <a href="/atlas">Architecture Atlas</a>
        <a href="/reference">Field notebook</a>
      </div>
    </details>
  );
}
