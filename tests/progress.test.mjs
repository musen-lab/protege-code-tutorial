import assert from "node:assert/strict";
import test from "node:test";
import {
  completionSummary,
  isResumablePosition,
  isUnitComplete,
  isValidPosition,
  parseStoredProgress,
  withLastPosition,
  withUnit,
} from "../app/lib/progress.mjs";

const NOW = "2026-08-12T21:00:00.000Z";

const V1 = {
  number: 4,
  path: "/lessons/screen",
  scrollY: 1860,
  slug: "screen",
  title: "Build the screen",
  updatedAt: "2026-08-12T20:00:00.000Z",
};

const V2 = {
  version: 2,
  lastPosition: V1,
  completedUnitIds: ["screen:containment"],
  updatedAt: "2026-08-12T20:30:00.000Z",
};

test("prefers a valid v2 record over any v1 record", () => {
  const { progress, migratedFromV1 } = parseStoredProgress(
    JSON.stringify(V2),
    JSON.stringify({ ...V1, slug: "other" }),
    NOW,
  );
  assert.equal(migratedFromV1, false);
  assert.equal(progress.lastPosition.slug, "screen");
  assert.deepEqual(progress.completedUnitIds, ["screen:containment"]);
});

test("migrates a valid v1 record with an empty completion set", () => {
  const { progress, migratedFromV1 } = parseStoredProgress(null, JSON.stringify(V1), NOW);
  assert.equal(migratedFromV1, true);
  assert.equal(progress.version, 2);
  assert.deepEqual(progress.lastPosition, V1);
  assert.deepEqual(progress.completedUnitIds, []);
  assert.equal(progress.updatedAt, NOW);
});

test("falls back to v1 when the v2 record is corrupt", () => {
  const { progress, migratedFromV1 } = parseStoredProgress("{not json", JSON.stringify(V1), NOW);
  assert.equal(migratedFromV1, true);
  assert.deepEqual(progress.lastPosition, V1);
});

test("returns null when both records are corrupt or missing", () => {
  assert.equal(parseStoredProgress("{bad", "also bad", NOW).progress, null);
  assert.equal(parseStoredProgress(null, null, NOW).progress, null);
  assert.equal(parseStoredProgress(JSON.stringify({ version: 3 }), JSON.stringify({ slug: 7 }), NOW).progress, null);
});

test("sanitizes a v2 record with junk fields instead of rejecting it", () => {
  const raw = JSON.stringify({
    version: 2,
    lastPosition: { slug: "" },
    completedUnitIds: ["a", 5, null, "b"],
  });
  const { progress } = parseStoredProgress(raw, null, NOW);
  assert.equal(progress.lastPosition, null);
  assert.deepEqual(progress.completedUnitIds, ["a", "b"]);
  assert.equal(progress.updatedAt, NOW);
});

test("isValidPosition rejects incomplete shapes", () => {
  assert.equal(isValidPosition(V1), true);
  assert.equal(isValidPosition(null), false);
  assert.equal(isValidPosition({ ...V1, scrollY: "high" }), false);
  assert.equal(isValidPosition({ ...V1, slug: "" }), false);
});

test("only a scrolled position is resumable; drive-by visits are not", () => {
  const lessonOneTop = { ...V1, number: 1, slug: "landscape", scrollY: 0 };
  assert.equal(isResumablePosition(lessonOneTop), false);
  assert.equal(isResumablePosition({ ...lessonOneTop, scrollY: 400 }), true);
  assert.equal(isResumablePosition({ ...lessonOneTop, number: 3 }), false);
  assert.equal(isResumablePosition({ ...lessonOneTop, number: 3, scrollY: 200 }), true);
  assert.equal(isResumablePosition(null), false);
});

test("completionSummary ignores unknown and duplicate unit ids", () => {
  const required = ["a:1", "a:2", "b:1", "b:2"];
  const summary = completionSummary(["a:1", "a:1", "removed:section", "b:2"], required);
  assert.deepEqual(summary, { completed: 2, total: 4, percent: 50 });
  assert.deepEqual(completionSummary([], []), { completed: 0, total: 0, percent: 0 });
});

test("withUnit adds and removes units immutably and idempotently", () => {
  const started = withUnit(null, "a:1", true, NOW);
  assert.deepEqual(started.completedUnitIds, ["a:1"]);
  assert.equal(withUnit(started, "a:1", true, "later"), started);
  const removed = withUnit(started, "a:1", false, NOW);
  assert.deepEqual(removed.completedUnitIds, []);
  assert.equal(isUnitComplete(started, "a:1"), true);
  assert.equal(isUnitComplete(removed, "a:1"), false);
});

test("withLastPosition preserves completion state", () => {
  const withUnits = withUnit(null, "a:1", true, NOW);
  const moved = withLastPosition(withUnits, V1, NOW);
  assert.deepEqual(moved.completedUnitIds, ["a:1"]);
  assert.deepEqual(moved.lastPosition, V1);
});
