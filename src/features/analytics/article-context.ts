export const downloadContextKey = 'stone-download-context';
const maxContextAge = 30 * 60 * 1000;

export type ArticleContext = {
  article_id: string;
  article_cluster: string;
};

export function downloadArticleContext(
  stored: string | null,
  currentUrl: URL,
  referrer: string,
  now = Date.now(),
): (ArticleContext & { source_page_path: string }) | null {
  if (!stored || currentUrl.pathname !== '/go/') return null;
  try {
    const value: unknown = JSON.parse(stored);
    if (typeof value !== 'object' || value === null) return null;
    if (
      !('article_id' in value) ||
      typeof value.article_id !== 'string' ||
      !/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(value.article_id) ||
      !('article_cluster' in value) ||
      typeof value.article_cluster !== 'string' ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.article_cluster) ||
      !('source_page_path' in value) ||
      typeof value.source_page_path !== 'string' ||
      !/^\/(guides|comparisons)\/[a-z0-9-]+\/$/.test(value.source_page_path) ||
      !('createdAt' in value) ||
      typeof value.createdAt !== 'number' ||
      !Number.isFinite(value.createdAt) ||
      now < value.createdAt ||
      now - value.createdAt > maxContextAge
    )
      return null;
    const source = new URL(referrer);
    if (source.origin !== currentUrl.origin || source.pathname !== value.source_page_path)
      return null;
    return {
      article_id: value.article_id,
      article_cluster: value.article_cluster,
      source_page_path: value.source_page_path,
    };
  } catch {
    // Missing, malformed or stale context must never create a guessed attribution.
    return null;
  }
}
