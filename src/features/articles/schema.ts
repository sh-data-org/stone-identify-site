import { z } from 'zod';
export const categories = {
  guides: 'Identification guides',
  comparisons: 'Stone comparisons',
  jewelry: 'Jewelry guides',
  apps: 'App comparisons',
} as const;
export const categorySchema = z.enum(['guides', 'comparisons', 'jewelry', 'apps']);
const httpsUrl = z
  .url()
  .refine((value) => new URL(value).protocol === 'https:', 'Use an HTTPS URL.');
export const sourceSchema = z.object({ title: z.string().min(1).max(200), url: httpsUrl });
export const imageSchema = z.object({
  path: z.string().regex(/^\/(images|media)\/[a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp)$/),
  alt: z.string().min(3).max(300),
  credit: z.string().min(1).max(500),
  license: z.string().min(1).max(150),
  sourceUrl: httpsUrl,
  reviewed: z.boolean(),
});
export const articleSchema = z.object({
  title: z.string().min(5).max(150),
  slug: z
    .string()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(120),
  category: categorySchema,
  description: z.string().min(30).max(200),
  body: z.string().max(80000),
  image: imageSchema.nullable(),
  sources: z.array(sourceSchema).max(30),
  author: z.string().min(1).max(120),
  reviewed: z.boolean(),
  competitorTested: z.boolean(),
  unresolved: z.array(z.string().max(500)).max(30),
});
export type ArticleContent = z.infer<typeof articleSchema>;
export interface ArticleRow {
  id: string;
  slug: string;
  category: keyof typeof categories;
  draft: string;
  published: string | null;
  version: number;
  updated_at: string;
  published_at: string | null;
  initial_batch: number;
}
export interface Article {
  id: string;
  draft: ArticleContent;
  published: ArticleContent | null;
  version: number;
  updatedAt: string;
  publishedAt: string | null;
  initialBatch: boolean;
}
export function parseArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    draft: articleSchema.parse(JSON.parse(row.draft)),
    published: row.published ? articleSchema.parse(JSON.parse(row.published)) : null,
    version: row.version,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
    initialBatch: row.initial_batch === 1,
  };
}
export function publishIssues(content: ArticleContent): string[] {
  const issues = [...content.unresolved];
  if (!content.reviewed) issues.push('Editorial/source review is required.');
  if (!content.image?.reviewed) issues.push('A reviewed image and its usage rights are required.');
  if (content.sources.length < 1) issues.push('At least one supporting source is required.');
  if (content.body.trim().split(/\s+/).length < 180)
    issues.push('The article needs a complete, useful answer.');
  if (content.category === 'apps' && !content.competitorTested)
    issues.push('Complete and record hands-on app testing.');
  return issues;
}
export const articleViewSchema = z.object({
  id: z.string(),
  draft: articleSchema,
  published: articleSchema.nullable(),
  version: z.number(),
  updatedAt: z.string(),
  publishedAt: z.string().nullable(),
  initialBatch: z.boolean(),
});
