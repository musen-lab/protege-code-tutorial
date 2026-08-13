import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Protégé Code Tutorial home">
        <span className="protege-brand" aria-hidden="true">
          <Image src="/protege-icon.svg" alt="" width={34} height={34} priority />
          <span>Protégé</span>
        </span>
        <span className="brand-divider" aria-hidden="true" />
        <strong>Code Tutorial</strong>
      </a>
      <div className="header-actions">
        <a className="header-search-link" href="/search" aria-label="Search the Protégé Code Tutorial">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="10.75" cy="10.75" r="6.25" />
            <path d="m15.5 15.5 4.25 4.25" />
          </svg>
        </a>
        <nav className="top-nav" aria-label="Primary navigation">
          <a className="course-nav-link" href="/">Course</a>
          <a href="/atlas">Atlas</a>
          <a href="/reference">Field notebook</a>
        </nav>
      </div>
    </header>
  );
}
