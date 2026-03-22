import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getStoryUrl } from '../lib/stories';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const stories = await getCollection('stories', ({ data }) => !data.draft);
  const sorted = stories.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  return rss({
    title: 'Product Stories',
    description: '探索改变世界的产品背后的故事',
    site: context.site ?? 'https://product-stories.pages.dev',
    items: sorted.map((story) => ({
      title: story.data.title,
      pubDate: story.data.date,
      description: story.data.description ?? '',
      link: getStoryUrl(story),
    })),
    customData: '<language>zh-cn</language>',
  });
}
