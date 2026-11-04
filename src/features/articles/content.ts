import rawArticles from '../../../content/articles.json';
import assets from '../../../content/assets.json';
import { validateArticles } from './validate';

export const articles = validateArticles(rawArticles, assets);
