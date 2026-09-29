import { categories, type ArticleContent } from '../features/articles/schema';

export function ArticleCard({ article }: { article: ArticleContent }) {
  return (
    <a className="article-card" href={`/${article.category}/${article.slug}/`}>
      <div className="card-image">
        <img
          src={article.image.path}
          alt={article.image.alt}
          width="640"
          height="480"
          loading="lazy"
        />
      </div>
      <div className="card-copy">
        <span className="eyebrow">{categories[article.category]}</span>
        <h2>{article.title}</h2>
        <p>{article.description}</p>
        <span className="text-link">Read the guide ↗</span>
      </div>
    </a>
  );
}
