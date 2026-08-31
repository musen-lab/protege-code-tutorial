"use client";

import { sectionUnitId } from "@/app/lib/course";
import { useUnitComplete } from "./SectionCompletion";

export function SectionNav({
  slug,
  sections,
}: {
  slug: string;
  sections: { id: string; title: string; depth?: "foundation" | "core" }[];
}) {
  return (
    <nav className="section-nav" aria-label="On this page">
      <strong>On this page</strong>
      {sections.map((section) => (
        <SectionNavLink
          key={section.id}
          slug={slug}
          id={section.id}
          title={section.title}
          optional={section.depth === "foundation"}
        />
      ))}
      <a href="#sources">Source trail</a>
    </nav>
  );
}

function SectionNavLink({
  slug,
  id,
  title,
  optional,
}: {
  slug: string;
  id: string;
  title: string;
  optional: boolean;
}) {
  const complete = useUnitComplete(sectionUnitId(slug, id));
  return (
    <a href={`#${id}`} className={complete ? "is-complete" : undefined}>
      {title}
      {optional && <span className="section-nav-optional">optional</span>}
      {complete && (
        <>
          <span aria-hidden="true"> ✓</span>
          <span className="sr-only"> (complete)</span>
        </>
      )}
    </a>
  );
}
