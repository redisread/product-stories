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
 * 将标签名转为 URL slug
 * 策略：替换斜杠/空格为连字符，保留中文和字母数字
 */
export function slugify(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[/\\]/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\u4e00-\u9fa5-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 解码 URL 参数（用于展示）
 */
export function unslugify(slug: string): string {
  return decodeURIComponent(slug);
}
