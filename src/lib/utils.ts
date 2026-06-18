/**
 * 合并 CSS 类名
 */
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * 格式化日期为本地化字符串
 */
export function formatDate(date: Date | string, locale = 'zh-CN'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 格式化日期为 ISO 字符串（用于 meta 标签）
 */
export function formatDateISO(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

/**
 * 获取相对时间描述
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays}天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`;
  return `${Math.floor(diffDays / 365)}年前`;
}

/**
 * 阅读时间文字（已格式化）
 */
export function getReadingTimeText(readingTime?: string): string {
  return readingTime || '约5分钟阅读';
}

/**
 * 截断文本
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '…';
}

/**
 * 从 story id 获取产品名
 * story.id 格式：{product}/{slug}
 */
export function getProductFromId(id: string): string {
  return id.split('/')[0] || '';
}

/**
 * 统计 tags 出现次数
 */
export function countTags(stories: Array<{ data: { tags?: string[] } }>): Map<string, number> {
  const counts = new Map<string, number>();
  for (const story of stories) {
    for (const tag of story.data.tags || []) {
      counts.set(tag, (counts.get(tag) || 0) + 1);
    }
  }
  return counts;
}

/**
 * 获取所有唯一产品
 */
export function getUniqueProducts(stories: Array<{ data: { products?: string[] } }>): string[] {
  const set = new Set<string>();
  for (const story of stories) {
    for (const p of story.data.products || []) {
      set.add(p);
    }
  }
  return Array.from(set).sort();
}

/**
 * 将标签名转为 URL slug
 * 策略：替换斜杠/空格为连字符，保留中文和字母数字
 */
export function slugify(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[/\\]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9一-龥-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 解码 URL 参数（用于展示）
 */
export function unslugify(slug: string): string {
  return decodeURIComponent(slug);
}
