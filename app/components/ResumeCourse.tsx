"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { lessons, requiredUnitIds } from "@/app/lib/course";
import {
  clearProgress,
  completionSummary,
  getProgressSnapshot,
  isResumablePosition,
  readProgress,
  subscribeToProgress,
} from "@/app/lib/progress-client";

export function ResumeCourse() {
  const snapshot = useSyncExternalStore(subscribeToProgress, getProgressSnapshot, () => null);
  const progress = useMemo(() => {
    if (snapshot === null) return null;
    return readProgress();
  }, [snapshot]);

  // Migrate any v1 record eagerly so the first paint after hydration already
  // reflects the v2 shape.
  useEffect(() => {
    readProgress();
  }, []);

  const position = progress?.lastPosition ?? null;
  const summary = completionSummary(progress?.completedUnitIds ?? [], requiredUnitIds);
  // Sitting at the top of Lesson 1 with nothing completed is a pristine
  // start, not something to resume: right after a restart, offer Start.
  const started = isResumablePosition(position) || summary.completed > 0;

  // Derive the destination from the slug rather than the stored path, so
  // progress saved before the /journeys -> /lessons rename still resumes.
  const destination = started && position ? `/lessons/${position.slug}?resume=1` : "/lessons/landscape";

  return (
    <div className="resume-course">
      <span>{started ? "Continue where you stopped" : "Your recommended starting point"}</span>
      <strong>
        {started && position
          ? `Lesson ${position.number}: ${position.title}`
          : "Lesson 1: Survey the landscape"}
      </strong>
      <p>
        {started
          ? "Resume returns to your saved reading position. Completion below counts only sections you marked complete."
          : `Follow the ${lessons.length} lessons in order. Your place will be saved automatically in this browser.`}
      </p>
      <div className="resume-actions">
        <a className="primary-action" href={destination}>
          {started ? "Resume the course" : "Start Lesson 1"}
        </a>
        {started && <RestartControl />}
      </div>
      <div className="resume-completion">
        <span>Course completion</span>
        <strong>{summary.completed} of {summary.total} sections</strong>
      </div>
      <div
        className="resume-progress"
        role="img"
        aria-label={`Course completion: ${summary.completed} of ${summary.total} sections complete`}
      >
        <span style={{ width: `${summary.completed > 0 ? Math.max(2, summary.percent) : 0}%` }} />
      </div>
    </div>
  );
}

const RESTART_WARNING =
  "This clears your course completion and your saved reading position in this browser.";

/** The confirmation opens in place, inside the resume card. */
function RestartControl() {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <a
        className="restart-action"
        href="/lessons/landscape"
        onClick={(event) => {
          event.preventDefault();
          setConfirming(true);
        }}
      >
        Restart from Lesson 1
      </a>
    );
  }
  return (
    <div
      className="restart-confirm"
      role="group"
      aria-label="Confirm restart"
    >
      <p>{RESTART_WARNING}</p>
      <div>
        <a href="/lessons/landscape" onClick={() => clearProgress()}>
          Yes, restart
        </a>
        <button type="button" onClick={() => setConfirming(false)}>
          Keep my progress
        </button>
      </div>
    </div>
  );
}
