import { z } from 'zod';

export const categories = {
  guides: 'Identification guides',
  comparisons: 'Stone comparisons',
} as const;

export const articleSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  category: z.enum(['guides', 'comparisons']),
  title: z.string().min(5).max(90),
  description: z.string().min(50).max(180),
  answer: z.string().min(50).max(600),
  body: z.string().min(500),
  image: z.object({ path: z.string().startsWith('/images/'), alt: z.string().min(5) }),
  sources: z
    .array(z.object({ title: z.string().min(1), url: z.url().startsWith('https://') }))
    .min(1),
  updated: z.iso.date(),
});
export type ArticleContent = z.infer<typeof articleSchema>;
