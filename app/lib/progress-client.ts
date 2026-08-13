// Browser storage layer for the completion-based progress model. Only client
// components may import this module. The pure parsing, migration, and
// completion math lives in progress.mjs so node tests can exercise it.

import {
  PROGRESS_V1_KEY,
  PROGRESS_V2_KEY,
  completionSummary,
  isResumablePosition,
  isUnitComplete,
  parseStoredProgress,
  withLastPosition,
  withUnit,
} from "./progress.mjs";

export type LastPosition = {
  number: number;
  path: string;
  scrollY: number;
  slug: string;
  title: string;
  updatedAt: string;
};

export type CourseProgressV2 = {
  version: 2;
  lastPosition: LastPosition | null;
  completedUnitIds: string[];
  updatedAt: string;
};

const PROGRESS_EVENT = "inside-protege-progress";

/**
 * Read the stored progress, migrating a v1 record on first use. v1 is removed
 * only after the v2 write succeeds; if the write fails, v1 stays in place and
 * the parsed value still serves this render.
 */
export function readProgress(): CourseProgressV2 | null {
  try {
    const { progress, migratedFromV1 } = parseStoredProgress(
      window.localStorage.getItem(PROGRESS_V2_KEY),
      window.localStorage.getItem(PROGRESS_V1_KEY),
      new Date().toISOString(),
    ) as { progress: CourseProgressV2 | null; migratedFromV1: boolean };
    if (migratedFromV1 && progress) {
      try {
        window.localStorage.setItem(PROGRESS_V2_KEY, JSON.stringify(progress));
        window.localStorage.removeItem(PROGRESS_V1_KEY);
      } catch {
        // Keep v1 untouched; resume still works from the parsed value.
      }
    }
    return progress;
  } catch {
    return null;
  }
}

function writeProgress(progress: CourseProgressV2, announcement?: string): boolean {
  try {
    window.localStorage.setItem(PROGRESS_V2_KEY, JSON.stringify(progress));
  } catch {
    return false;
  }
  notify(announcement);
  return true;
}

function notify(announcement?: string) {
  try {
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: { announcement } }));
  } catch {
    // Subscribers refresh on the next storage event instead.
  }
}

export function markUnit(unitId: string, complete: boolean, announcement?: string): boolean {
  const next = withUnit(readProgress(), unitId, complete, new Date().toISOString()) as CourseProgressV2;
  return writeProgress(next, announcement);
}

export function saveLastPosition(position: LastPosition): boolean {
  const next = withLastPosition(readProgress(), position, position.updatedAt) as CourseProgressV2;
  return writeProgress(next);
}

/** Clears both completion and the saved reading position, v2 and legacy v1. */
export function clearProgress() {
  try {
    window.localStorage.removeItem(PROGRESS_V2_KEY);
    window.localStorage.removeItem(PROGRESS_V1_KEY);
  } catch {
    // Navigation still restarts the course if browser storage is unavailable.
  }
  notify();
}

export function subscribeToProgress(onChange: () => void) {
  const handler = () => onChange();
  window.addEventListener("storage", handler);
  window.addEventListener(PROGRESS_EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(PROGRESS_EVENT, handler);
  };
}

/** Raw snapshot for useSyncExternalStore; parsing happens in useMemo. */
export function getProgressSnapshot(): string | null {
  try {
    return window.localStorage.getItem(PROGRESS_V2_KEY) ?? window.localStorage.getItem(PROGRESS_V1_KEY);
  } catch {
    return null;
  }
}

export function subscribeToAnnouncements(onAnnouncement: (message: string) => void) {
  const handler = (event: Event) => {
    const detail = (event as CustomEvent<{ announcement?: string }>).detail;
    if (detail?.announcement) onAnnouncement(detail.announcement);
  };
  window.addEventListener(PROGRESS_EVENT, handler);
  return () => window.removeEventListener(PROGRESS_EVENT, handler);
}

export { completionSummary, isResumablePosition, isUnitComplete };
