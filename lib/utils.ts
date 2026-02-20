import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind 类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化日期
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 格式化日期（简短）
 */
export function formatDateShort(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * 获取相对时间描述
 */
export function getRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays} 天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} 个月前`;
  return `${Math.floor(diffDays / 365)} 年前`;
}

/**
 * 计算阅读时长（基于字数）
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200; // 中文阅读速度
  const wordCount = content.replace(/\s/g, '').length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} 分钟阅读`;
}

/**
 * 生成文章摘要
 */
export function generateExcerpt(content: string, maxLength = 150): string {
  // 移除 Markdown 语法
  const plainText = content
    .replace(/#+ /g, '')
    .replace(/\*\*/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\n+/g, ' ')
    .trim();

  if (plainText.length <= maxLength) return plainText;
  return plainText.slice(0, maxLength) + '...';
}

/**
 * 生成 slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

/**
 * 防抖函数
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), wait);
  };
}

/**
 * 产品名称标准化
 */
export function normalizeProductName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * 产品显示名称
 */
export function getProductDisplayName(name: string): string {
  const displayNames: Record<string, string> = {
    'design-system': 'Design System',
    'web-platform': 'Web Platform',
    'mobile-app': 'Mobile App',
    'api-service': 'API Service',
    ios: 'iOS',
    android: 'Android',
  };
  return displayNames[name] || name;
}

/**
 * 产品颜色映射
 */
export function getProductColor(name: string): string {
  const colors: Record<string, string> = {
    'design-system': '#8b5cf6',
    'web-platform': '#3b82f6',
    'mobile-app': '#10b981',
    'api-service': '#f59e0b',
    ios: '#6366f1',
    android: '#22c55e',
  };
  return colors[normalizeProductName(name)] || '#6b7280';
}

/**
 * 产品图标映射
 */
export function getProductIcon(name: string): string {
  const icons: Record<string, string> = {
    'design-system': 'Palette',
    'web-platform': 'Globe',
    'mobile-app': 'Smartphone',
    'api-service': 'Server',
    ios: 'Apple',
    android: 'Smartphone',
  };
  return icons[normalizeProductName(name)] || 'Box';
}
