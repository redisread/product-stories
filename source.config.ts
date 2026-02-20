import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { rehypeCode } from 'fumadocs-core/mdx-plugins';

export const { docs: stories, meta } = defineDocs({
  dir: 'content/stories',
  docs: {
    async: true,
    schema: {
      frontmatter: {
        // 使用更宽松的验证
        validate: (data: Record<string, unknown>) => {
          const errors: string[] = [];

          if (!data.title || typeof data.title !== 'string') {
            errors.push('title is required and must be a string');
          }
          if (!data.date) {
            errors.push('date is required');
          }
          if (!Array.isArray(data.products)) {
            errors.push('products must be an array');
          }

          return {
            title: data.title as string,
            date: data.date as string | Date,
            products: data.products as string[],
            cover: data.cover as string | undefined,
            readingTime: data.readingTime as string | undefined,
            description: data.description as string | undefined,
            author: data.author as string | undefined,
            tags: data.tags as string[] | undefined,
            featured: data.featured as boolean | undefined,
            draft: data.draft as boolean | undefined,
            errors: errors.length > 0 ? errors : undefined,
          };
        },
      },
    },
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
