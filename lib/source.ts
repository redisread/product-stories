import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import type { StoriesStats, StoryPage } from '@/types/story';

const STORIES_DIR = join(process.cwd(), 'content/stories');

/**
 * 递归获取所有 MDX 文件
 */
async function getMdxFiles(dir: string): Promise<string[]> {
  try {
    const files: string[] = [];
    const entries = await readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await getMdxFiles(path)));
      } else if (entry.name.endsWith('.mdx')) {
        files.push(path);
      }
    }

    return files;
  } catch (error) {
    console.error('Error reading directory:', dir, error);
    return [];
  }
}

/**
 * 解析单个 MDX 文件
 */
async function parseMdxFile(filePath: string): Promise<StoryPage | null> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const { data } = matter(content);

    // 计算相对路径作为 slug
    const relativePath = filePath.replace(STORIES_DIR, '').replace(/\.mdx$/, '');
    const slugParts = relativePath.split('/').filter(Boolean);

    return {
      slug: slugParts.join('/'),
      url: `/stories/${slugParts.join('/')}`,
      title: data.title || 'Untitled',
      data: {
        title: data.title || 'Untitled',
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        products: data.products || [],
        cover: data.cover,
        readingTime: data.readingTime,
        description: data.description,
        author: data.author,
        tags: data.tags || [],
        featured: data.featured || false,
        draft: data.draft || false,
      },
      file: {
        path: filePath,
        stem: slugParts[slugParts.length - 1] || '',
      },
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

/**
 * 获取所有故事
 */
export async function getAllStories(): Promise<StoryPage[]> {
  const files = await getMdxFiles(STORIES_DIR);
  const stories = await Promise.all(files.map(parseMdxFile));
  return stories
    .filter((s): s is StoryPage => s !== null && !s.data.draft)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
}

/**
 * 获取所有产品
 */
export async function getAllProducts(): Promise<string[]> {
  const stories = await getAllStories();
  const productsSet = new Set<string>();
  stories.forEach((story) => {
    story.data.products?.forEach((p) => productsSet.add(p));
  });
  return Array.from(productsSet).sort();
}

/**
 * 获取所有标签
 */
export async function getAllTags(): Promise<string[]> {
  const stories = await getAllStories();
  const tagsSet = new Set<string>();
  stories.forEach((story) => {
    story.data.tags?.forEach((t) => tagsSet.add(t));
  });
  return Array.from(tagsSet).sort();
}

/**
 * 获取精选故事
 */
export async function getFeaturedStories(limit = 3): Promise<StoryPage[]> {
  const stories = await getAllStories();
  return stories.filter((s) => s.data.featured).slice(0, limit);
}

/**
 * 按产品筛选
 */
export async function getStoriesByProduct(product: string): Promise<StoryPage[]> {
  const stories = await getAllStories();
  return stories.filter((s) => s.data.products?.includes(product));
}

/**
 * 搜索故事
 */
export async function searchStories(query: string): Promise<StoryPage[]> {
  const stories = await getAllStories();
  if (!query.trim()) return stories;

  const lowerQuery = query.toLowerCase();
  return stories.filter(
    (s) =>
      s.title.toLowerCase().includes(lowerQuery) ||
      s.data.description?.toLowerCase().includes(lowerQuery) ||
      s.data.tags?.some((t) => t.toLowerCase().includes(lowerQuery))
  );
}

/**
 * 获取统计数据
 */
export async function getStoriesStats(): Promise<StoriesStats> {
  const stories = await getAllStories();
  const products = await getAllProducts();
  const featured = stories.filter((s) => s.data.featured);
  const authors = new Set(stories.map((s) => s.data.author).filter(Boolean));

  return {
    totalStories: stories.length,
    totalProducts: products.length,
    featuredStories: featured.length,
    authors: Array.from(authors) as string[],
  };
}

/**
 * 根据 slug 获取故事
 */
export async function getStoryBySlug(slug: string): Promise<StoryPage | null> {
  const stories = await getAllStories();
  return stories.find((s) => s.slug === slug) || null;
}

/**
 * 获取相关故事
 */
export async function getRelatedStories(
  currentSlug: string,
  limit = 3
): Promise<StoryPage[]> {
  const current = await getStoryBySlug(currentSlug);
  if (!current) return [];

  const stories = await getAllStories();
  return stories
    .filter(
      (s) =>
        s.slug !== currentSlug &&
        s.data.products?.some((p) => current.data.products?.includes(p))
    )
    .slice(0, limit);
}

/**
 * 按作者分组统计
 */
export async function getStoriesByAuthor(): Promise<Record<string, StoryPage[]>> {
  const stories = await getAllStories();
  return stories.reduce((acc, story) => {
    const author = story.data.author || '未知作者';
    if (!acc[author]) acc[author] = [];
    acc[author].push(story);
    return acc;
  }, {} as Record<string, StoryPage[]>);
}

// 虚拟 source 对象（兼容 Fumadocs UI）
export const source = {
  getPages: getAllStories,
  getPage: async (slug: string[]) => {
    const fullSlug = slug.join('/');
    return getStoryBySlug(fullSlug);
  },
  generateParams: async () => {
    const stories = await getAllStories();
    return stories.map((s) => ({ slug: s.slug.split('/') }));
  },
  pageTree: {},
};

// 搜索 API 兼容
export const searchAPI = null;
export const searchPages = async () => [];
