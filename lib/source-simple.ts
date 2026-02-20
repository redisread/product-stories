import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import type { StoriesStats, StoryPage, StoryFrontmatter } from '@/types/story';

const STORIES_DIR = join(process.cwd(), 'content/stories');

/**
 * 递归获取所有 MDX 文件
 */
async function getMdxFiles(dir: string): Promise<string[]> {
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
}

/**
 * 解析单个 MDX 文件
 */
async function parseMdxFile(filePath: string): Promise<StoryPage | null> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const { data, content: body } = matter(content);

    // 计算相对路径作为 slug
    const relativePath = filePath.replace(STORIES_DIR, '').replace(/\.mdx$/, '');
    const slug = relativePath.split('/').filter(Boolean);

    return {
      slug: slug.join('/'),
      url: `/stories/${slug.join('/')}`,
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
        stem: slug[slug.length - 1] || '',
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

// 同步版本（用于客户端组件）
let storiesCache: StoryPage[] | null = null;

export function getAllStoriesSync(): StoryPage[] {
  if (storiesCache) return storiesCache;
  // 首次调用返回空数组，异步加载后会更新
  return [];
}
