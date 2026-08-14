"use client";

import { useEffect, useState } from "react";
import { readProgress, saveLastPosition, subscribeToAnnouncements } from "@/app/lib/progress-client";

export function ProgressTracker({ number, slug, title }: { number: number; slug: string; title: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const path = `/lessons/${slug}`;
    // The engagement rule: the stored bookmark only moves once the learner
    // engages with this page, by scrolling it or marking something complete
    // on it. An unengaged visit writes nothing, so a drive-by click can
    // neither create a bookmark nor destroy an earned one.
    let engaged = false;
    let saveTimer: ReturnType<typeof window.setTimeout> | undefined;

    const savePosition = (announce = true) => {
      const ok = saveLastPosition({
        number,
        path,
        scrollY: Math.round(window.scrollY),
        slug,
        title,
        updatedAt: new Date().toISOString(),
      });
      if (announce) setSaved(ok);
    };

    const saveBeforeLeave = () => {
      if (engaged) savePosition(false);
    };

    const onScroll = () => {
      engaged = true;
      setSaved(false);
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(savePosition, 180);
    };

    // Completion marks are announced; a mark on this page counts as
    // engagement and moves the bookmark here even without scrolling.
    // Position saves themselves are unannounced, so this cannot loop.
    const unsubscribeMarks = subscribeToAnnouncements(() => {
      engaged = true;
      savePosition();
    });

    // readProgress migrates a v1 record to v2 on first use.
    const previous = readProgress()?.lastPosition ?? null;
    const shouldResume = new URLSearchParams(window.location.search).get("resume") === "1";
    // Match on slug, not stored path, so scroll positions saved before the
    // /journeys -> /lessons rename still restore.
    if (shouldResume && previous?.slug === slug && previous.scrollY > 0) {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: previous.scrollY, behavior: "auto" });
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", saveBeforeLeave);

    return () => {
      window.clearTimeout(saveTimer);
      if (engaged) savePosition(false);
      unsubscribeMarks();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", saveBeforeLeave);
    };
  }, [number, slug, title]);

  return (
    <div className="progress-tracker" role="status">
      <span aria-hidden="true">●</span>
      {saved ? "Your place is saved in this browser." : "Your place saves as you read."}
    </div>
  );
}
