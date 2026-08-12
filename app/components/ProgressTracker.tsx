"use client";

import { useEffect, useState } from "react";
import { COURSE_PROGRESS_KEY, type CourseProgress } from "./ResumeCourse";

export function ProgressTracker({ number, slug, title }: { number: number; slug: string; title: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const path = `/journeys/${slug}`;
    let restored = false;
    let saveTimer: ReturnType<typeof window.setTimeout> | undefined;

    const readProgress = () => {
      try {
        const value = window.localStorage.getItem(COURSE_PROGRESS_KEY);
        return value ? (JSON.parse(value) as CourseProgress) : null;
      } catch {
        return null;
      }
    };

    const saveProgress = (announce = true) => {
      try {
        const progress: CourseProgress = {
          number,
          path,
          scrollY: Math.round(window.scrollY),
          slug,
          title,
          updatedAt: new Date().toISOString(),
        };
        window.localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(progress));
        if (announce) setSaved(true);
      } catch {
        if (announce) setSaved(false);
      }
    };

    const saveBeforeLeave = () => saveProgress(false);

    const onScroll = () => {
      setSaved(false);
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(saveProgress, 180);
    };

    const previous = readProgress();
    const shouldResume = new URLSearchParams(window.location.search).get("resume") === "1";
    if (shouldResume && previous?.path === path && previous.scrollY > 0) {
      restored = true;
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: previous.scrollY, behavior: "auto" });
      });
    }

    if (!restored) saveProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", saveBeforeLeave);

    return () => {
      window.clearTimeout(saveTimer);
      saveProgress(false);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", saveBeforeLeave);
    };
  }, [number, slug, title]);

  return (
    <div className="progress-tracker" role="status">
      <span aria-hidden="true">●</span>
      {saved ? "Your place is saved in this browser." : "Saving your place…"}
    </div>
  );
}
