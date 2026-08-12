import type { SourceRef } from "@/app/lib/course";
import { sourceUrl } from "@/app/lib/course";

export function SourceLink({ source }: { source: SourceRef }) {
  return (
    <a className="source-link" href={sourceUrl(source.path, source.line)} target="_blank" rel="noreferrer">
      <span>
        <strong>{source.label}</strong>
        <small>{source.note}</small>
      </span>
      <code>{source.path}{source.line ? `:${source.line}` : ""}</code>
    </a>
  );
}
