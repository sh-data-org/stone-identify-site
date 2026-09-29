import type { ArticleContent } from './schema';
// Only approved public content belongs here. Drafts live in the private CMS.
export function visibleArticles(): { id: string; content: ArticleContent }[] {
  return [];
}
