'use client';

import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { useMemo, useTransition } from 'react';
import type { StoryPage, SortOption } from '@/types/story';

interface UseStoryFiltersResult {
  // 筛选状态
  selectedProducts: string[];
  searchQuery: string;
  sortBy: SortOption;

  // 操作函数
  setSelectedProducts: (products: string[]) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: SortOption) => void;
  toggleProduct: (product: string) => void;
  clearFilters: () => void;

  // 过滤后的结果
  filteredStories: StoryPage[];
  isPending: boolean;
  hasActiveFilters: boolean;
}

interface UseStoryFiltersOptions {
  stories: StoryPage[];
}

/**
 * 故事筛选 Hook
 * 使用 nuqs 管理 URL 查询参数状态
 */
export function useStoryFilters(
  options: UseStoryFiltersOptions
): UseStoryFiltersResult {
  const { stories } = options;
  const [isPending, startTransition] = useTransition();

  // URL 状态管理
  const [selectedProducts, setSelectedProducts] = useQueryState(
    'products',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [searchQuery, setSearchQuery] = useQueryState(
    'search',
    parseAsString.withDefault('')
  );

  const [sortBy, setSortBy] = useQueryState<SortOption>(
    'sort',
    parseAsString.withDefault('newest')
  );

  // 切换产品选择
  const toggleProduct = (product: string) => {
    startTransition(() => {
      setSelectedProducts((prev) => {
        const normalized = product.toLowerCase().replace(/\s+/g, '-');
        if (prev.includes(normalized)) {
          return prev.filter((p) => p !== normalized);
        }
        return [...prev, normalized];
      });
    });
  };

  // 清除所有筛选
  const clearFilters = () => {
    startTransition(() => {
      setSelectedProducts([]);
      setSearchQuery('');
      setSortBy('newest');
    });
  };

  // 过滤和排序结果
  const filteredStories = useMemo(() => {
    let result = [...stories];

    // 产品筛选
    if (selectedProducts.length > 0) {
      result = result.filter((story) =>
        story.data.products?.some((p) => {
          const normalized = p.toLowerCase().replace(/\s+/g, '-');
          return selectedProducts.includes(normalized);
        })
      );
    }

    // 搜索筛选
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (story) =>
          story.title.toLowerCase().includes(query) ||
          story.data.description?.toLowerCase().includes(query) ||
          story.data.tags?.some((t) => t.toLowerCase().includes(query))
      );
    }

    // 排序
    result.sort((a, b) => {
      const dateA = new Date(a.data.date).getTime();
      const dateB = new Date(b.data.date).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [stories, selectedProducts, searchQuery, sortBy]);

  // 是否有活跃的筛选条件
  const hasActiveFilters =
    selectedProducts.length > 0 || searchQuery.length > 0 || sortBy !== 'newest';

  return {
    selectedProducts,
    searchQuery,
    sortBy,
    setSelectedProducts,
    setSearchQuery,
    setSortBy,
    toggleProduct,
    clearFilters,
    filteredStories,
    isPending,
    hasActiveFilters,
  };
}
