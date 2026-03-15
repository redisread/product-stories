import React from 'react';
import { readFile, readdir } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import type { StoriesStats, StoryPage } from '@/types/story';
import { cn } from '@/lib/utils';

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
 * 获取所有标签及其故事数量
 */
export async function getTagsWithCounts(): Promise<{ name: string; count: number }[]> {
  const stories = await getAllStories();
  const tagCounts: Record<string, number> = {};

  stories.forEach((story) => {
    story.data.tags?.forEach((tag) => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  return Object.entries(tagCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 获取精选故事
 */
export async function getFeaturedStories(limit = 3): Promise<StoryPage[]> {
  const stories = await getAllStories();
  return stories.filter((s) => s.data.featured).slice(0, limit);
}

/**
 * 按标签筛选
 */
export async function getStoriesByTag(tag: string): Promise<StoryPage[]> {
  const stories = await getAllStories();
  return stories.filter((s) => s.data.tags?.includes(tag));
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
  const tags = await getAllTags();
  const featured = stories.filter((s) => s.data.featured);
  const authors = new Set(stories.map((s) => s.data.author).filter(Boolean));

  return {
    totalStories: stories.length,
    totalTags: tags.length,
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
        s.data.tags?.some((t) => current.data.tags?.includes(t))
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

/**
 * MDX 组件映射
 * 在服务端定义，用于 compileMDX
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mdxComponents: Record<string, React.FC<any>> = {
  h1: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return React.createElement('h1', { className: cn('mt-8 mb-4 text-3xl font-bold tracking-tight text-fd-foreground', className), ...props });
  },
  h2: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return React.createElement('h2', { className: cn('mt-10 mb-4 text-2xl font-semibold tracking-tight text-fd-foreground', className), ...props });
  },
  h3: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return React.createElement('h3', { className: cn('mt-8 mb-3 text-xl font-semibold text-fd-foreground', className), ...props });
  },
  h4: ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return React.createElement('h4', { className: cn('mt-6 mb-2 text-lg font-semibold text-fd-foreground', className), ...props });
  },
  p: ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
    return React.createElement('p', { className: cn('mb-4 leading-7 text-fd-foreground', className), ...props });
  },
  a: ({ className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    return React.createElement('a', { className: cn('text-fd-primary underline underline-offset-4 hover:text-fd-primary/80', className), ...props });
  },
  ul: ({ className, ...props }: React.HTMLAttributes<HTMLUListElement>) => {
    return React.createElement('ul', { className: cn('my-6 ml-6 list-disc text-fd-foreground', className), ...props });
  },
  ol: ({ className, ...props }: React.HTMLAttributes<HTMLOListElement>) => {
    return React.createElement('ol', { className: cn('my-6 ml-6 list-decimal text-fd-foreground', className), ...props });
  },
  li: ({ className, ...props }: React.HTMLAttributes<HTMLLIElement>) => {
    return React.createElement('li', { className: cn('mt-2', className), ...props });
  },
  blockquote: ({ className, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => {
    return React.createElement('blockquote', { className: cn('mt-6 border-l-4 border-fd-primary pl-4 italic text-fd-muted-foreground', className), ...props });
  },
  img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    return React.createElement('img', { className: cn('rounded-lg border border-fd-border my-8', className), alt, ...props });
  },
  hr: ({ className, ...props }: React.HTMLAttributes<HTMLHRElement>) => {
    return React.createElement('hr', { className: cn('my-8 border-fd-border', className), ...props });
  },
  table: ({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) => {
    return React.createElement('div', { className: 'my-6 w-full overflow-x-auto' },
      React.createElement('table', { className: cn('w-full border-collapse text-sm border border-[#e5e5e5] dark:border-[#333]', className), ...props })
    );
  },
  tr: ({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => {
    return React.createElement('tr', { className: cn('border-b border-[#e5e5e5] dark:border-[#333] transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#1a1a1a]', className), ...props });
  },
  th: ({ className, ...props }: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) => {
    return React.createElement('th', { className: cn('border-b border-[#e5e5e5] dark:border-[#333] px-4 py-3 text-left font-semibold bg-[#f5f5f5] dark:bg-[#1a1a1a] text-[#333] dark:text-[#e5e5e5]', className), ...props });
  },
  td: ({ className, ...props }: React.TdHTMLAttributes<HTMLTableDataCellElement>) => {
    return React.createElement('td', { className: cn('border-b border-[#e5e5e5] dark:border-[#333] px-4 py-3 text-[#333] dark:text-[#e5e5e5]', className), ...props });
  },
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    return React.createElement('code', {
      className: cn(
        'rounded px-1.5 py-0.5 font-mono text-[0.85em]',
        'bg-[#e8e8e8] dark:bg-[#2a2a2a]',
        'text-[#333] dark:text-[#e5e5e5]',
        className
      ),
      ...props
    });
  },
  pre: ({ className, children, ...props }: React.HTMLAttributes<HTMLPreElement>) => {
    return React.createElement('pre', {
      className: cn(
        'my-6 p-4 overflow-x-auto rounded-lg',
        'bg-[#f5f5f5] dark:bg-[#1a1a1a]',
        'font-mono text-[13px] leading-relaxed',
        'text-[#333] dark:text-[#e5e5e5]',
        className
      ),
      ...props
    }, children);
  },
};

/**
 * 获取故事 MDX 内容（编译后）
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getStoryContent(slug: string): Promise<{
  story: StoryPage;
  content: React.ReactElement<any>;
} | null> {
  const story = await getStoryBySlug(slug);
  if (!story) return null;

  const filePath = join(STORIES_DIR, ...slug.split('/')) + '.mdx';

  try {
    const rawContent = await readFile(filePath, 'utf-8');
    const { content: mdxSource } = matter(rawContent);

    const { content } = await compileMDX({
      source: mdxSource,
      options: {
        parseFrontmatter: false,
        mdxOptions: {
          remarkPlugins: [remarkGfm],
        },
      },
      components: mdxComponents,
    });

    return { story, content };
  } catch (error) {
    console.error(`Error compiling MDX for ${slug}:`, error);
    return null;
  }
}
