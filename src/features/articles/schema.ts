import { z } from 'zod';

export const categories = {
  guides: 'Identification guides',
  comparisons: 'Stone comparisons',
} as const;

export const articleSchema = z
  .object({
    id: z.uuid(),
    published: z.iso.date(),
    cluster: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    targetKeyword: z.string().trim().min(3).max(120),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    category: z.enum(['guides', 'comparisons']),
    title: z.string().min(5).max(90),
    description: z.string().min(50).max(180),
    answer: z.string().min(50).max(600),
    body: z.string().min(500),
    image: z.object({
      path: z.string().regex(/^\/images\/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp)$/),
      alt: z.string().min(5),
    }),
    sources: z
      .array(z.object({ title: z.string().min(1), url: z.url().startsWith('https://') }))
      .min(1),
    updated: z.iso.date(),
  })
  .strict()
  .refine((article) => article.published <= article.updated, {
    message: 'Publication date must not be later than the updated date.',
    path: ['published'],
  });
export type ArticleContent = z.infer<typeof articleSchema>;
