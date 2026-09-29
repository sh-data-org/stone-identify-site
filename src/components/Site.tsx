import type { ReactNode } from 'react';
import { Download } from './Download';
import { AnalyticsConsent } from './AnalyticsConsent';

export interface PageProps {
  noindex?: boolean;
  children: ReactNode;
}

export function Site({ children, noindex }: PageProps) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <a className="brand" href="/">
          <img className="app-icon" src="/images/app-icon.jpg" alt="" width="36" height="36" />
          Stone Identifier
        </a>
        <nav aria-label="Main navigation">
          <a href="/guides/">Guides</a>
          <a href="/comparisons/">Compare stones</a>
          <a href="/app/">The app</a>
          <a href="/about/">About</a>
        </nav>
        <Download placement="header" />
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div>
          <a className="brand" href="/">
            Stone Identifier
          </a>
          <p>Practical guides to rocks and minerals.</p>
        </div>
        <nav aria-label="Footer">
          <a href="/guides/">Guides</a>
          <a href="/comparisons/">Compare stones</a>
          <a href="/app/">The app</a>
          <a href="/about/">About</a>
          <a href="/privacy/">Privacy</a>
          <a href="/terms/">Terms</a>
          <a href="/credits/">Photo credits</a>
        </nav>
        <div className="footer-bottom">© {new Date().getFullYear()} Stone Identifier</div>
      </footer>
      {!noindex && <AnalyticsConsent />}
    </>
  );
}
