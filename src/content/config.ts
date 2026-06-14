import { defineCollection, z } from 'astro:content';

// 用于 date 校验：未来日期上限（含一天容差，覆盖时区差异）
const oneDayMs = 24 * 60 * 60 * 1000;
const earliestDate = new Date('2000-01-01');

const storiesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().min(1).max(80),
    date: z.coerce.date().refine((d) => d >= earliestDate && d.getTime() <= Date.now() + oneDayMs, {
      message: 'date 必须在 2000-01-01 之后且不晚于今天（含 1 天时区容差）；防止误填未来或过早日期',
    }),
    products: z.array(z.string().min(1)).min(1),
    cover: z.string().url().optional(),
    readingTime: z.string().optional(),
    description: z.string().optional(),
    author: z.string().optional(),
    tags: z.array(z.string().min(1)).max(8).optional().default([]),
    featured: z.boolean().optional().default(false),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  stories: storiesCollection,
};
