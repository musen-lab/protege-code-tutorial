export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Inside Protégé home">
        <span className="brand-mark" aria-hidden="true">P</span>
        <span>
          <strong>Inside Protégé</strong>
          <small>A source-guided field course</small>
        </span>
      </a>
      <nav className="top-nav" aria-label="Primary navigation">
        <a className="course-nav-link" href="/">Course</a>
        <a href="/atlas">Atlas</a>
        <a href="/reference">Field notebook</a>
      </nav>
    </header>
  );
}
