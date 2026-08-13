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
      <nav className="top-nav" aria-label="Primary navigation">
        <a className="course-nav-link" href="/">Course</a>
        <a href="/search">Search</a>
        <a href="/atlas">Atlas</a>
        <a href="/reference">Field notebook</a>
      </nav>
    </header>
  );
}
