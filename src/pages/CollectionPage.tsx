import { Site } from '../components/Site';
import { ArticleCard } from '../components/ArticleCard';
import { articles } from '../features/articles/content';
import { categories } from '../features/articles/schema';

export function CollectionPage({ category }: { category: keyof typeof categories }) {
  return (
    <Site>
      <section className="section collection">
        <h1>{categories[category]}</h1>
        <p className="intro">
          Look closely, compare the clues, and keep possible matches provisional.
        </p>
        <div className="article-grid">
          {articles
            .filter((article) => article.category === category)
            .map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
        </div>
      </section>
    </Site>
  );
}
