"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  getProgressSnapshot,
  isUnitComplete,
  markUnit,
  readProgress,
  subscribeToAnnouncements,
  subscribeToProgress,
} from "@/app/lib/progress-client";

export function useUnitComplete(unitId: string): boolean {
  const snapshot = useSyncExternalStore(subscribeToProgress, getProgressSnapshot, () => null);
  return useMemo(() => {
    if (snapshot === null) return false;
    return isUnitComplete(readProgress(), unitId);
  }, [snapshot, unitId]);
}

/** The generic completion control for sections without a checkpoint or exercise. */
export function SectionCompletion({ unitId }: { unitId: string }) {
  const complete = useUnitComplete(unitId);
  return (
    <div className="section-completion">
      <button
        type="button"
        aria-pressed={complete}
        onClick={() =>
          markUnit(
            unitId,
            !complete,
            complete ? "Section marked not complete." : "Section marked complete.",
          )
        }
      >
        <span aria-hidden="true">{complete ? "✓" : "○"}</span>
        {complete ? "Section complete" : "Mark section complete"}
      </button>
    </div>
  );
}

/** The purpose-specific completion control for hands-on exercises. */
export function ExerciseCompletion({ unitId }: { unitId: string }) {
  const complete = useUnitComplete(unitId);
  return (
    <label className="exercise-completion">
      <input
        type="checkbox"
        checked={complete}
        onChange={(event) =>
          markUnit(
            unitId,
            event.target.checked,
            event.target.checked
              ? "Exercise marked complete."
              : "Exercise marked not complete.",
          )
        }
      />
      I completed this exercise
    </label>
  );
}

/** One polite live region per lesson page announces completion changes. */
export function ProgressLiveRegion() {
  const message = useSyncExternalStore(subscribeToLastAnnouncement, getLastAnnouncement, () => "");
  return (
    <div className="sr-only" role="status" aria-live="polite">
      {message}
    </div>
  );
}

let lastAnnouncement = "";

function subscribeToLastAnnouncement(onChange: () => void) {
  return subscribeToAnnouncements((announcement) => {
    lastAnnouncement = announcement;
    onChange();
  });
}

function getLastAnnouncement() {
  return lastAnnouncement;
}
