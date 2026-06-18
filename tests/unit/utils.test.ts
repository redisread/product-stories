import { describe, it, expect } from 'vitest';
import {
  cn,
  formatDate,
  formatDateISO,
  slugify,
  unslugify,
  truncate,
  getRelativeTime,
  getProductFromId,
  countTags,
  getUniqueProducts,
} from '../../src/lib/utils';

describe('cn', () => {
  it('应该合并类名', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c');
  });

  it('应该过滤 falsy 值', () => {
    expect(cn('a', undefined, 'b', false, 'c', null)).toBe('a b c');
  });

  it('空参数返回空字符串', () => {
    expect(cn()).toBe('');
  });
});

describe('formatDate', () => {
  it('应该格式化 Date 对象', () => {
    const date = new Date('2024-01-15');
    const result = formatDate(date, 'en-US');
    expect(result).toContain('2024');
    expect(result).toContain('January');
  });

  it('应该格式化字符串日期', () => {
    const result = formatDate('2024-06-18', 'en-US');
    expect(result).toContain('2024');
    expect(result).toContain('June');
  });

  it('默认使用中文格式', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('2024');
    expect(result).toContain('月');
  });
});

describe('formatDateISO', () => {
  it('应该返回 ISO 格式', () => {
    const result = formatDateISO('2024-01-15T12:00:00Z');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});

describe('slugify', () => {
  it('应该转换为小写', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('应该替换空格为连字符', () => {
    expect(slugify('hello world')).toBe('hello-world');
  });

  it('应该保留中文', () => {
    expect(slugify('测试用例')).toBe('测试用例');
  });

  it('应该移除特殊字符', () => {
    expect(slugify('hello!@#world')).toBe('helloworld');
  });

  it('应该替换斜杠为连字符', () => {
    expect(slugify('path/to/something')).toBe('path-to-something');
  });
});

describe('unslugify', () => {
  it('应该解码 URL 参数', () => {
    expect(unslugify('hello%20world')).toBe('hello world');
  });

  it('应该解码中文字符', () => {
    expect(unslugify('%E6%B5%8B%E8%AF%95')).toBe('测试');
  });
});

describe('truncate', () => {
  it('短文本不截断', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('长文本截断并添加省略号', () => {
    expect(truncate('hello world', 5)).toBe('hello…');
  });

  it('精确长度不截断', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });
});

describe('getRelativeTime', () => {
  it('今天', () => {
    const now = new Date();
    expect(getRelativeTime(now)).toBe('今天');
  });

  it('昨天', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(getRelativeTime(yesterday)).toBe('昨天');
  });

  it('几天前', () => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - 5);
    expect(getRelativeTime(daysAgo)).toBe('5天前');
  });

  it('几周前', () => {
    const weeksAgo = new Date();
    weeksAgo.setDate(weeksAgo.getDate() - 14);
    expect(getRelativeTime(weeksAgo)).toBe('2周前');
  });
});

describe('getProductFromId', () => {
  it('应该提取产品名', () => {
    expect(getProductFromId('netflix/story-1')).toBe('netflix');
  });

  it('空 id 返回空字符串', () => {
    expect(getProductFromId('')).toBe('');
  });

  it('无斜杠返回原字符串', () => {
    expect(getProductFromId('single')).toBe('single');
  });
});

describe('countTags', () => {
  it('应该统计标签出现次数', () => {
    const stories = [
      { data: { tags: ['a', 'b'] } },
      { data: { tags: ['a', 'c'] } },
      { data: { tags: ['b'] } },
    ];
    const result = countTags(stories);
    expect(result.get('a')).toBe(2);
    expect(result.get('b')).toBe(2);
    expect(result.get('c')).toBe(1);
  });

  it('应该处理空标签', () => {
    const stories = [{ data: { tags: [] } }, { data: {} }];
    const result = countTags(stories);
    expect(result.size).toBe(0);
  });
});

describe('getUniqueProducts', () => {
  it('应该返回唯一产品列表', () => {
    const stories = [
      { data: { products: ['a', 'b'] } },
      { data: { products: ['b', 'c'] } },
    ];
    const result = getUniqueProducts(stories);
    expect(result).toEqual(['a', 'b', 'c']);
  });

  it('应该排序', () => {
    const stories = [{ data: { products: ['c', 'a', 'b'] } }];
    const result = getUniqueProducts(stories);
    expect(result).toEqual(['a', 'b', 'c']);
  });
});
