/**
 * 故事文章类型定义
 */

export interface StoryFrontmatter {
  /** 文章标题 */
  title: string;
  /** 发布日期 */
  date: string | Date;
  /** 关联产品列表 */
  products: string[];
  /** 封面图片路径 */
  cover?: string;
  /** 阅读时长 */
  readingTime?: string;
  /** 文章描述/摘要 */
  description?: string;
  /** 作者 */
  author?: string;
  /** 标签 */
  tags?: string[];
  /** 是否精选 */
  featured?: boolean;
  /** 是否草稿 */
  draft?: boolean;
}

export interface Story {
  /** 文章 slug */
  slug: string;
  /** 文章路径 */
  url: string;
  /** 文章元数据 */
  data: StoryFrontmatter;
  /** 文章内容 MDX */
  body?: string;
}

export interface Product {
  /** 产品标识 */
  id: string;
  /** 产品显示名称 */
  name: string;
  /** 产品描述 */
  description?: string;
  /** 产品图标 */
  icon?: string;
  /** 产品颜色 */
  color?: string;
  /** 产品排序 */
  order?: number;
  /** 故事数量 */
  storyCount?: number;
}

export interface FilterState {
  /** 筛选的产品 */
  products: string[];
  /** 搜索关键词 */
  search: string;
  /** 排序方式 */
  sort: 'newest' | 'oldest' | 'popular';
}

// Fumadocs Page 扩展类型
export interface StoryPage {
  slug: string;
  url: string;
  title: string;
  data: StoryFrontmatter;
  file: {
    path: string;
    stem: string;
  };
}

// 排序选项
export type SortOption = 'newest' | 'oldest';

export interface SortConfig {
  value: SortOption;
  label: string;
  icon?: string;
}

// 搜索结果
export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url: string;
  products: string[];
  date: string;
}

// 统计信息
export interface StoriesStats {
  totalStories: number;
  totalTags: number;
  featuredStories: number;
  authors: string[];
}
