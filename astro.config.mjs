// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import sentry from '@sentry/astro';

// https://astro.build/config
export default defineConfig({
  site: 'https://product-stories.pages.dev',
  output: 'static',

  integrations: [
    sentry({
      dsn: import.meta.env.SENTRY_DSN,
      environment: import.meta.env.MODE || 'production',
      enabled: !!import.meta.env.SENTRY_DSN,
    }),
    mdx({
      syntaxHighlight: 'shiki',
      shikiConfig: {
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
        wrap: true,
      },
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      ],
      gfm: true,
    }),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  image: {
    domains: ['images.unsplash.com'],
  },
});
