import { Site } from '../components/Site';
import { Download } from '../components/Download';
import { renderArticle } from '../features/articles/render';
import { categories, type ArticleContent } from '../features/articles/schema';
import { articles } from '../features/articles/content';

export function ArticlePage({ article }: { article: ArticleContent }) {
  const { html, headings } = renderArticle(article.body);
  return (
    <Site>
      <article className="article-page">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a> /{' '}
          <a href={`/${article.category}/`}>{categories[article.category]}</a>
        </nav>
        <header className="article-heading">
          <h1>{article.title}</h1>
          <p className="intro">{article.description}</p>
          <p className="byline">
            <a href="/about/">Stone Identifier editorial team</a> · Updated {article.updated}
          </p>
          <p className="article-answer">{article.answer}</p>
        </header>
        <div className="reading-layout">
          <div>
            <figure className="article-hero">
              <img src={article.image.path} alt={article.image.alt} width="960" height="640" />
              <figcaption>
                {article.image.alt} · <a href="/credits/">Photo credit and license</a>
              </figcaption>
            </figure>
            <details className="article-toc" open>
              <summary>In this guide</summary>
              <ol>
                {headings.map((heading) => (
                  <li key={heading.id}>
                    <a href={`#${heading.id}`}>{heading.title}</a>
                  </li>
                ))}
              </ol>
            </details>
            <div className="article-reading prose" dangerouslySetInnerHTML={{ __html: html }} />
            <section className="sources">
              <h2>Sources</h2>
              <ul>
                {article.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url}>{source.title}</a>
                  </li>
                ))}
              </ul>
            </section>
            <section className="related">
              <h2>Keep exploring</h2>
              {articles
                .filter((item) => item.slug !== article.slug)
                .map((item) => (
                  <p key={item.slug}>
                    <a href={`/${item.category}/${item.slug}/`}>{item.title}</a>
                  </p>
                ))}
              <a href="/identification-checklist/">Printable observation sheet</a>
            </section>
            <section className="article-download" aria-labelledby="article-download-title">
              <img
                className="app-icon"
                src="/images/app-icon.jpg"
                alt="Rock Scan app icon"
                width="72"
                height="72"
                loading="lazy"
              />
              <p className="app-cta-label">ROCK SCAN FOR IPHONE</p>
              <h2 id="article-download-title">Have a stone of your own?</h2>
              <p>
                Take a photo or choose one from your library. Explore possible matches in Rock Scan,
                then compare the details with what you learned in this guide.
              </p>
              <Download label="Download Rock Scan on the App Store" />
              <p className="app-cta-note">Requires iOS 18 or later. Offers in-app purchases.</p>
              <p className="app-cta-note">
                Photo suggestions help you explore; they do not replace a professional
                identification.
              </p>
            </section>
          </div>
          <aside className="download-aside">
            <img className="app-icon" src="/images/app-icon.jpg" alt="" width="64" height="64" />
            <h2>A stone you can’t quite place?</h2>
            <p>Explore possible matches with Rock Scan for iPhone.</p>
            <Download placement="sidebar" badge />
            <p className="small">
              A photo suggestion is a starting point, not a laboratory identification.
            </p>
          </aside>
        </div>
      </article>
    </Site>
  );
}
