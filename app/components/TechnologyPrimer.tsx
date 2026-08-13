import { sourceRefUrl } from "@/app/lib/course";
import { technologyPrimers, type TechnologyPrimerId } from "@/app/lib/technologies";

export function TechnologyPrimerGroup({ ids }: { ids: TechnologyPrimerId[] }) {
  return (
    <div className="technology-primer-group" role="group" aria-label="Technology primers">
      {ids.map((id) => {
        const primer = technologyPrimers[id];
        return (
          <aside className="technology-primer" id={`technology-${primer.id}`} key={primer.id}>
            <div className="technology-primer-heading">
              <span>Technology primer</span>
              <h3>{primer.name}</h3>
              <p>{primer.description}</p>
            </div>
            <div className="technology-primer-copy">
              {primer.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <div className="technology-primer-links">
              <div>
                <strong>Source of record</strong>
                {primer.officialLinks.map((link) => (
                  <a href={link.url} key={link.url} target="_blank" rel="noreferrer">{link.label} ↗</a>
                ))}
              </div>
              <div>
                <strong>Where Protégé uses it</strong>
                {primer.protegeSources.map((source) => (
                  <a href={sourceRefUrl(source)} key={`${source.path}-${source.line}`} target="_blank" rel="noreferrer">
                    {source.path}:{source.line} ↗
                  </a>
                ))}
              </div>
            </div>
          </aside>
        );
      })}
    </div>
  );
}
