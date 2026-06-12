import { getCollection, type CollectionEntry } from 'astro:content';

export type Story = CollectionEntry<'stories'>;

/** 获取全部非草稿故事，按日期倒序 */
export async function getAllStories(): Promise<Story[]> {
  const stories = await getCollection('stories', ({ data }) => !data.draft);
  return stories.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** 获取精选故事 */
export async function getFeaturedStories(limit = 3): Promise<Story[]> {
  const stories = await getAllStories();
  return stories.filter((s) => s.data.featured).slice(0, limit);
}

/** 按标签筛选 */
export async function getStoriesByTag(tag: string): Promise<Story[]> {
  const stories = await getAllStories();
  return stories.filter((s) => s.data.tags?.includes(tag));
}

/** 获取所有标签及出现次数 */
export async function getTagsWithCounts(): Promise<{ name: string; count: number }[]> {
  const stories = await getAllStories();
  const counts: Record<string, number> = {};
  stories.forEach((s) => {
    (s.data.tags ?? []).forEach((tag) => {
      counts[tag] = (counts[tag] ?? 0) + 1;
    });
  });
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/** 获取所有产品目录名（用于导航） */
export async function getAllProducts(): Promise<string[]> {
  const stories = await getAllStories();
  const set = new Set(stories.flatMap((s) => s.data.products));
  return [...set].sort();
}

/** 获取相关故事（同标签，排除当前） */
export async function getRelatedStories(current: Story, limit = 3): Promise<Story[]> {
  const stories = await getAllStories();
  return stories
    .filter((s) => s.id !== current.id && s.data.tags?.some((t) => current.data.tags?.includes(t)))
    .slice(0, limit);
}

/** 从 story.id 解析 product 和 slug
 *  story.id 格式：discord/game-voice-accident
 */
export function parseStoryId(id: string): { product: string; slug: string } {
  const parts = id.replace(/\.mdx$/, '').split('/');
  return {
    product: parts[0],
    slug: parts.slice(1).join('/'),
  };
}

/** 构建故事详情 URL */
export function getStoryUrl(story: Story): string {
  const { product, slug } = parseStoryId(story.id);
  return `/stories/${product}/${slug}`;
}
