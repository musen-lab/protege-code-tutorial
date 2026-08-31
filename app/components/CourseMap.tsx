"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { lessonUnitIds, lessons } from "@/app/lib/course";
import {
  getProgressSnapshot,
  readProgress,
  subscribeToProgress,
} from "@/app/lib/progress-client";

export function CourseMap({ currentSlug }: { currentSlug?: string }) {
  // On narrow screens the full route list fills the first viewport and makes
  // a successful lesson navigation look like nothing happened, so the map
  // collapses to its summary bar there. Desktop keeps it open, and without
  // JavaScript the list stays open everywhere.
  const [open, setOpen] = useState(true);
  useEffect(() => {
    const collapseOnMobile = window.setTimeout(() => {
      if (window.matchMedia("(max-width: 760px)").matches) setOpen(false);
    }, 0);
    return () => window.clearTimeout(collapseOnMobile);
  }, []);

  const snapshot = useSyncExternalStore(subscribeToProgress, getProgressSnapshot, () => null);
  const completedSlugs = useMemo(() => {
    if (snapshot === null) return new Set<string>();
    const completed = new Set(readProgress()?.completedUnitIds ?? []);
    return new Set(
      lessons
        .filter((lesson) => {
          const units = lessonUnitIds(lesson.slug);
          return units.length > 0 && units.every((unit) => completed.has(unit));
        })
        .map((lesson) => lesson.slug),
    );
  }, [snapshot]);

  const current = lessons.find((lesson) => lesson.slug === currentSlug);

  return (
    <details
      className="course-map"
      open={open}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>
        <span>Your course route</span>
        <span className="course-map-summary">
          {current ? `Lesson ${current.number} of ${lessons.length}` : `${lessons.length} in order`}
        </span>
      </summary>
      <ol>
        {lessons.map((lesson) => {
          const complete = completedSlugs.has(lesson.slug);
          return (
            <li key={lesson.slug} className={lesson.slug === currentSlug ? "is-current" : ""}>
              <a href={`/lessons/${lesson.slug}`} aria-current={lesson.slug === currentSlug ? "page" : undefined}>
                <span>{String(lesson.number).padStart(2, "0")}</span>
                <span>
                  <strong>
                    {lesson.title}
                    {complete && (
                      <>
                        <span className="lesson-complete-mark" aria-hidden="true"> ✓</span>
                        <span className="sr-only"> (complete)</span>
                      </>
                    )}
                  </strong>
                  <small>{lesson.duration}</small>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      <div className="course-map-reference">
        <span>References</span>
        <a href="/atlas">Architecture Atlas</a>
        <a href="/reference">Field notebook</a>
      </div>
    </details>
  );
}
