import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const stories = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/stories' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    products: z.array(z.string()),
    cover: z.string().optional(),
    readingTime: z.string().optional(),
    description: z.string().optional(),
    author: z.string().optional(),
    tags: z.array(z.string()).optional().default([]),
    featured: z.boolean().optional().default(false),
    draft: z.boolean().optional().default(false),
    // P0: 关键转折点
    turningPoints: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          date: z.string().optional(),
        })
      )
      .optional()
      .default([]),
    // P1: 时间轴
    timeline: z
      .array(
        z.object({
          date: z.string(),
          title: z.string(),
          description: z.string().optional(),
          type: z.enum(['milestone', 'launch', 'pivot', 'growth', 'other']).optional().default('milestone'),
        })
      )
      .optional()
      .default([]),
  }),
});

export const collections = { stories };
