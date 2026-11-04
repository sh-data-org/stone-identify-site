import type { ArticleContent } from './schema';

export function relatedArticles(article: ArticleContent, articles: readonly ArticleContent[]) {
  const relevance = (candidate: ArticleContent) =>
    Number(candidate.cluster === article.cluster) * 2 +
    Number(candidate.category === article.category);
  return articles
    .filter((candidate) => candidate.id !== article.id)
    .sort((a, b) => relevance(b) - relevance(a) || a.slug.localeCompare(b.slug))
    .slice(0, 4);
}
