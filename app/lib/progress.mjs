// Pure progress-model core. Plain JavaScript so the node test runner can unit
// test migration and corruption handling directly, without a TS build step.
// Browser storage access lives in progress-client.ts; nothing here may touch
// window or localStorage.

export const PROGRESS_V1_KEY = "inside-protege-progress-v1";
export const PROGRESS_V2_KEY = "inside-protege-progress-v2";

/**
 * @typedef {{ number: number, path: string, scrollY: number, slug: string,
 *             title: string, updatedAt: string }} LastPosition
 * @typedef {{ version: 2, lastPosition: LastPosition | null,
 *             completedUnitIds: string[], updatedAt: string }} CourseProgressV2
 */

/** A valid reading position, in either the v1 or the v2 `lastPosition` shape. */
export function isValidPosition(value) {
  return Boolean(
    value &&
    typeof value === "object" &&
    typeof value.number === "number" && Number.isFinite(value.number) &&
    typeof value.path === "string" &&
    typeof value.scrollY === "number" && Number.isFinite(value.scrollY) &&
    typeof value.slug === "string" && value.slug.length > 0 &&
    typeof value.title === "string" &&
    typeof value.updatedAt === "string",
  );
}

/** @returns {CourseProgressV2} */
export function emptyProgress(now) {
  return { version: 2, lastPosition: null, completedUnitIds: [], updatedAt: now };
}

function parseJson(raw) {
  if (typeof raw !== "string" || raw === "") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Interpret raw localStorage values. Prefers a valid v2 record; otherwise
 * migrates a valid v1 record into `lastPosition` with an empty completion set,
 * because a historical visit is not evidence of completion. Returns
 * `progress: null` when neither value is usable.
 *
 * @returns {{ progress: CourseProgressV2 | null, migratedFromV1: boolean }}
 */
export function parseStoredProgress(v2Raw, v1Raw, now) {
  const v2 = parseJson(v2Raw);
  if (v2 && typeof v2 === "object" && v2.version === 2 && Array.isArray(v2.completedUnitIds)) {
    return {
      progress: {
        version: 2,
        lastPosition: isValidPosition(v2.lastPosition) ? v2.lastPosition : null,
        completedUnitIds: v2.completedUnitIds.filter((id) => typeof id === "string"),
        updatedAt: typeof v2.updatedAt === "string" ? v2.updatedAt : now,
      },
      migratedFromV1: false,
    };
  }
  const v1 = parseJson(v1Raw);
  if (isValidPosition(v1)) {
    return {
      progress: {
        version: 2,
        lastPosition: {
          number: v1.number,
          path: v1.path,
          scrollY: v1.scrollY,
          slug: v1.slug,
          title: v1.title,
          updatedAt: v1.updatedAt,
        },
        completedUnitIds: [],
        updatedAt: now,
      },
      migratedFromV1: true,
    };
  }
  return { progress: null, migratedFromV1: false };
}

/**
 * Completion over the required units only. Unknown and duplicate stored ids
 * are ignored, so renamed or removed sections can never break the math.
 */
export function completionSummary(completedUnitIds, requiredUnitIds) {
  const required = new Set(requiredUnitIds);
  const counted = new Set();
  for (const id of completedUnitIds ?? []) {
    if (required.has(id)) counted.add(id);
  }
  const total = required.size;
  const completed = counted.size;
  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

/** @returns {CourseProgressV2} a new record with the unit added or removed. */
export function withUnit(progress, unitId, complete, now) {
  const base = progress ?? emptyProgress(now);
  const has = base.completedUnitIds.includes(unitId);
  if (complete === has) return base;
  return {
    ...base,
    completedUnitIds: complete
      ? [...base.completedUnitIds, unitId]
      : base.completedUnitIds.filter((id) => id !== unitId),
    updatedAt: now,
  };
}

/** @returns {CourseProgressV2} a new record with the reading position replaced. */
export function withLastPosition(progress, position, now) {
  const base = progress ?? emptyProgress(now);
  return { ...base, lastPosition: position, updatedAt: now };
}

export function isUnitComplete(progress, unitId) {
  return Boolean(progress && progress.completedUnitIds.includes(unitId));
}
