"use client";

import { useState } from "react";
import { atlasLenses } from "@/app/lib/course";
import { RelationshipDiagram } from "./RelationshipDiagram";

const lensLabels = {
  modules: "Modules",
  runtime: "Runtime",
  extensions: "Extensions",
  events: "Edit flow",
} as const;

export function AtlasExplorer() {
  const [lens, setLens] = useState<keyof typeof lensLabels>("modules");
  return (
    <div className="atlas-explorer">
      <div className="atlas-lenses" role="group" aria-label="Architecture lens">
        {Object.entries(lensLabels).map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={lens === key}
            onClick={() => setLens(key as keyof typeof lensLabels)}
          >
            {label}
          </button>
        ))}
      </div>
      <RelationshipDiagram key={lens} diagram={atlasLenses[lens]} />
    </div>
  );
}
