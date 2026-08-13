import type { SourceRef } from "@/app/lib/course";
import { sourceRefUrl } from "@/app/lib/course";

export function SourceLink({ source }: { source: SourceRef }) {
  return (
    <a className="source-link" href={sourceRefUrl(source)} target="_blank" rel="noreferrer">
      <span>
        <strong>{source.label}</strong>
        <small>{source.note}</small>
      </span>
      <code>{source.path}{source.line ? `:${source.line}` : ""}</code>
    </a>
  );
}
