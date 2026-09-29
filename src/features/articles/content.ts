import rawArticles from '../../../content/articles.json';
import { articleSchema } from './schema';

export const articles = articleSchema.array().parse(rawArticles);
const paths = articles.map((article) => `/${article.category}/${article.slug}`);
if (new Set(paths).size !== paths.length) throw new Error('Article URLs must be unique.');
