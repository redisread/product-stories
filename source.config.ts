import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { rehypeCode } from 'fumadocs-core/mdx-plugins';
import * as z from 'zod';

// 定义 frontmatter schema
const frontmatterSchema = z.object({
  title: z.string(),
  date: z.union([z.string(), z.date()]),
  products: z.array(z.string()),
  cover: z.string().optional(),
  readingTime: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  draft: z.boolean().optional(),
});

export const { docs: stories, meta } = defineDocs({
  dir: 'content/stories',
  docs: {
    async: true,
    schema: frontmatterSchema,
  },
});

export default defineConfig({
  lastModifiedTime: 'git',
  mdxOptions: {
    rehypePlugins: [
      [rehypeCode, { themes: { light: 'github-light', dark: 'github-dark' } }],
    ],
  },
});
