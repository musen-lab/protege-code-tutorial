export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Protégé Code Tutorial home">
        <span className="brand-mark" aria-hidden="true">P</span>
        <span className="brand-copy">
          <strong><span>Protégé</span><em>Code Tutorial</em></strong>
          <small>Inside Protégé</small>
        </span>
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
