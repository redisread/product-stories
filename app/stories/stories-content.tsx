'use client';

import { StoryCard } from '@/components/story-card';
import { TagFilter, TagCloud } from '@/components/tag-filter';
import { TagSidebar } from '@/components/tag-sidebar';
import { StorySearch } from '@/components/story-search';
import { StorySort } from '@/components/story-sort';
import { EmptyState } from '@/components/empty-state';
import { useStoryFilters } from '@/hooks/use-story-filters';
import type { StoryPage } from '@/types/story';
import { cn } from '@/lib/utils';
import { Grid3X3, List, LayoutGrid, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useMemo } from 'react';

interface StoriesContentProps {
  stories: StoryPage[];
  tags: string[];
  totalCount: number;
}

type ViewMode = 'grid' | 'compact';

/**
 * 故事内容组件（客户端）
 * 包含筛选、搜索、排序功能
 * 桌面端使用侧边栏标签筛选，移动端使用下拉选择
 */
export function StoriesContent({
  stories,
  tags,
  totalCount,
}: StoriesContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const {
    selectedTags,
    searchQuery,
    sortBy,
    setSearchQuery,
    setSortBy,
    toggleTag,
    clearFilters,
    filteredStories,
    isPending,
    hasActiveFilters,
  } = useStoryFilters({ stories });

  // 计算每个标签的故事数量
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    stories.forEach((story) => {
      story.data.tags?.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, [stories]);

  return (
    <div className="flex gap-6">
      {/* 桌面端侧边栏 */}
      <div
        className={cn(
          'hidden lg:block shrink-0 transition-all duration-300',
          sidebarOpen ? 'w-[260px]' : 'w-0 overflow-hidden'
        )}
      >
        <div className="sticky top-20">
          <TagSidebar
            tags={tags}
            selectedTags={selectedTags}
            onToggle={toggleTag}
            onClear={clearFilters}
            counts={tagCounts}
          />
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 min-w-0">
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="sticky top-0 z-30 -mx-4 px-4 py-4 bg-fd-background/80 backdrop-blur-sm border-b border-fd-border sm:mx-0 sm:px-0 sm:static sm:bg-transparent sm:backdrop-blur-none sm:border-0">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Sidebar Toggle (Desktop) */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex h-9 w-9"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? '收起侧边栏' : '展开侧边栏'}
              >
                {sidebarOpen ? (
                  <PanelLeftClose className="w-4 h-4" />
                ) : (
                  <PanelLeftOpen className="w-4 h-4" />
                )}
              </Button>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden flex items-center gap-2"
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>筛选标签</span>
                {selectedTags.length > 0 && (
                  <span className="ml-1 px-1.5 py-0 text-xs bg-fd-primary text-fd-primary-foreground rounded-full">
                    {selectedTags.length}
                  </span>
                )}
              </Button>

              {/* Search */}
              <div className="flex-1 max-w-md">
                <StorySearch
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="搜索故事标题、描述或标签..."
                />
              </div>

              {/* Filters Row */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Tag Filter (Mobile) */}
                <div className={cn('hidden', mobileFilterOpen && 'block')}>
                  <TagFilter
                    tags={tags}
                    selectedTags={selectedTags}
                    onToggle={toggleTag}
                    onClear={clearFilters}
                  />
                </div>

                {/* Sort */}
                <StorySort value={sortBy} onChange={setSortBy} />

                {/* View Mode Toggle */}
                <div className="flex items-center border border-fd-border rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-8 w-8',
                      viewMode === 'grid' && 'bg-fd-muted'
                    )}
                    onClick={() => setViewMode('grid')}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'h-8 w-8',
                      viewMode === 'compact' && 'bg-fd-muted'
                    )}
                    onClick={() => setViewMode('compact')}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center gap-2 text-sm text-fd-muted-foreground">
              <Grid3X3 className="w-4 h-4" />
              <span>
                显示{' '}
                <strong className="text-fd-foreground">
                  {filteredStories.length}
                </strong>{' '}
                个故事
                {hasActiveFilters && (
                  <span>
                    {' '}
                    (共 {totalCount} 个)
                  </span>
                )}
              </span>
              {isPending && (
                <span className="inline-flex items-center gap-1 text-fd-primary">
                  <span className="w-1.5 h-1.5 rounded-full bg-fd-primary animate-pulse" />
                  更新中...
                </span>
              )}
            </div>
          </div>

          {/* Stories Grid */}
          {filteredStories.length > 0 ? (
            <div
              className={cn(
                'grid gap-6 transition-opacity duration-200',
                viewMode === 'grid'
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
                  : 'grid-cols-1',
                isPending && 'opacity-50'
              )}
            >
              {filteredStories.map((story) => (
                <StoryCard
                  key={story.slug}
                  story={story}
                  variant={viewMode === 'compact' ? 'compact' : 'default'}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              type={hasActiveFilters ? 'no-results' : 'no-data'}
              onReset={hasActiveFilters ? clearFilters : undefined}
            />
          )}

          {/* Load More / End Message */}
          {filteredStories.length > 0 && filteredStories.length >= 12 && (
            <div className="py-12 text-center">
              <p className="text-sm text-fd-muted-foreground">
                已显示全部 {filteredStories.length} 个故事
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
