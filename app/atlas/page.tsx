import type { Metadata } from "next";
import { AtlasExplorer } from "@/app/components/AtlasExplorer";
import { SiteHeader } from "@/app/components/SiteHeader";
import { lessons } from "@/app/lib/course";

export const metadata: Metadata = {
  title: "Architecture Atlas",
  description: "Explore Protégé through module, runtime, extension, and ontology-change lenses.",
};

export default function AtlasPage() {
  return (
    <div className="site-shell">
      <SiteHeader />
      <main className="atlas-page">
        <header className="atlas-hero">
          <span className="eyebrow">Architecture Atlas</span>
          <h1>One system, four relationship lenses.</h1>
          <p>Switch lenses to change the question you ask of the same system: who imports it, when it starts, how it is discovered, or what events flow through it.</p>
        </header>
        <AtlasExplorer />

        <section className="atlas-landmarks">
          <div className="home-section-heading">
            <span className="eyebrow">Landmark index</span>
            <h2>Return to the journey that teaches each mechanism</h2>
          </div>
          <div className="landmark-grid">
            {lessons.map((lesson) => (
              <a href={`/journeys/${lesson.slug}`} key={lesson.slug}>
                <span>{String(lesson.number).padStart(2, "0")}</span>
                <strong>{lesson.title}</strong>
                <small>{lesson.capability}</small>
              </a>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
