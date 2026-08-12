"use client";

import { useMemo, useSyncExternalStore } from "react";

export const COURSE_PROGRESS_KEY = "inside-protege-progress-v1";

export type CourseProgress = {
  number: number;
  path: string;
  scrollY: number;
  slug: string;
  title: string;
  updatedAt: string;
};

export function ResumeCourse() {
  const saved = useSyncExternalStore(subscribeToProgress, readProgress, () => null);
  const progress = useMemo(() => {
    if (!saved) return null;
    try {
      return JSON.parse(saved) as CourseProgress;
    } catch {
      return null;
    }
  }, [saved]);

  const destination = progress ? `${progress.path}?resume=1` : "/journeys/landscape";

  return (
    <div className="resume-course">
      <span>{progress ? "Continue where you stopped" : "Your recommended starting point"}</span>
      <strong>
        {progress ? `Journey ${progress.number}: ${progress.title}` : "Journey 1: Survey the landscape"}
      </strong>
      <p>
        {progress
          ? "Your last journey and reading position were saved in this browser."
          : "Follow the eight journeys in order. Your place will be saved automatically in this browser."}
      </p>
      <div className="resume-actions">
        <a className="primary-action" href={destination}>
          {progress ? "Resume the course" : "Start Journey 1"}
        </a>
        {progress && (
          <a
            className="restart-action"
            href="/journeys/landscape"
            onClick={restartCourse}
          >
            Restart from Journey 1
          </a>
        )}
      </div>
      <div className="resume-progress" aria-label={progress ? `Journey ${progress.number} of 8` : "Course not started"}>
        <span style={{ width: `${progress ? Math.max(6, (progress.number / 8) * 100) : 0}%` }} />
      </div>
    </div>
  );
}

function subscribeToProgress(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function readProgress() {
  try {
    return window.localStorage.getItem(COURSE_PROGRESS_KEY);
  } catch {
    return null;
  }
}

function restartCourse() {
  try {
    window.localStorage.removeItem(COURSE_PROGRESS_KEY);
  } catch {
    // Navigation still restarts the course if browser storage is unavailable.
  }
}
