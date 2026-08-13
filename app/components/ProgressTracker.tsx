"use client";

import { useEffect, useState } from "react";
import { readProgress, saveLastPosition } from "@/app/lib/progress-client";

export function ProgressTracker({ number, slug, title }: { number: number; slug: string; title: string }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const path = `/lessons/${slug}`;
    let restored = false;
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

    const saveBeforeLeave = () => savePosition(false);

    const onScroll = () => {
      setSaved(false);
      window.clearTimeout(saveTimer);
      saveTimer = window.setTimeout(savePosition, 180);
    };

    // readProgress migrates a v1 record to v2 on first use.
    const previous = readProgress()?.lastPosition ?? null;
    const shouldResume = new URLSearchParams(window.location.search).get("resume") === "1";
    // Match on slug, not stored path, so scroll positions saved before the
    // /journeys -> /lessons rename still restore.
    if (shouldResume && previous?.slug === slug && previous.scrollY > 0) {
      restored = true;
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: previous.scrollY, behavior: "auto" });
      });
    }

    if (!restored) savePosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", saveBeforeLeave);

    return () => {
      window.clearTimeout(saveTimer);
      savePosition(false);
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
