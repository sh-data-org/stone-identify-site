import { Site } from '../components/Site';
import { AppDownloadCard } from '../components/AppDownloadCard';
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
          <p className="intro">{article.answer}</p>
          <p className="byline">
            <a href="/about/">Stone Identifier editorial team</a> · Updated {article.updated}
          </p>
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
            <AppDownloadCard placement="article" />
          </div>
          <aside className="download-aside">
            <AppDownloadCard placement="sidebar" compact />
          </aside>
        </div>
      </article>
    </Site>
  );
}
