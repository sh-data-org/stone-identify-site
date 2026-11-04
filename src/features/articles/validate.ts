import { articleSchema } from './schema';

type ImageCredit = {
  path: string;
  reviewed: boolean;
  credit: string;
  license: string;
  sourceUrl: string;
};

export function validateArticles(value: unknown, assets: readonly ImageCredit[]) {
  const articles = articleSchema.array().parse(value);
  const uniqueFields = ['id', 'title', 'description', 'targetKeyword'] as const;
  for (const field of uniqueFields) {
    const values = articles.map((article) => article[field].trim().toLowerCase());
    if (new Set(values).size !== values.length) {
      throw new Error(`Article ${field} values must be unique.`);
    }
  }
  const paths = articles.map((article) => `/${article.category}/${article.slug}`);
  if (new Set(paths).size !== paths.length) throw new Error('Article URLs must be unique.');
  for (const article of articles) {
    const asset = assets.find((image) => image.path === article.image.path);
    if (!asset?.reviewed || !asset.credit.trim() || !asset.license.trim() || !asset.sourceUrl) {
      throw new Error(`Article ${article.slug} needs a reviewed, credited hero image.`);
    }
  }
  return articles;
}
