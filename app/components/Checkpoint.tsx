"use client";

import { markUnit } from "@/app/lib/progress-client";

export function Checkpoint({
  prompt,
  answer,
  unitId,
  completesSection = false,
}: {
  prompt: string;
  answer: string;
  unitId?: string;
  completesSection?: boolean;
}) {
  return (
    <details
      className="checkpoint"
      onToggle={(event) => {
        if (completesSection && unitId && event.currentTarget.open) {
          markUnit(unitId, true, "Checkpoint answer revealed. Section recorded as complete.");
        }
      }}
    >
      <summary>
        <span>Prediction checkpoint</span>
        <strong>{prompt}</strong>
      </summary>
      <div>
        <span>Answer</span>
        <p>{answer}</p>
        {completesSection && (
          <small className="checkpoint-progress-note">
            Revealing this answer records the section as complete.
          </small>
        )}
      </div>
    </details>
  );
}
