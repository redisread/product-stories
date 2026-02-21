'use client';

import { StoryCard } from '@/components/story-card';
import { TagFilter } from '@/components/tag-filter';
import { StorySearch } from '@/components/story-search';
import { StorySort } from '@/components/story-sort';
import { EmptyState } from '@/components/empty-state';
import { useStoryFilters } from '@/hooks/use-story-filters';
import type { StoryPage } from '@/types/story';
import { cn } from '@/lib/utils';
import { Grid3X3, List, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface StoriesContentProps {
  stories: StoryPage[];
  tags: string[];
  totalCount: number;
}

type ViewMode = 'grid' | 'compact';

/**
 * 故事内容组件（客户端）
 * 包含筛选、搜索、排序功能
 */
export function StoriesContent({
  stories,
  tags,
  totalCount,
}: StoriesContentProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

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

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="sticky top-0 z-30 -mx-4 px-4 py-4 bg-fd-background/80 backdrop-blur-sm border-b border-fd-border sm:mx-0 sm:px-0 sm:static sm:bg-transparent sm:backdrop-blur-none sm:border-0">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
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
            {/* Tag Filter */}
            <TagFilter
              tags={tags}
              selectedTags={selectedTags}
              onToggle={toggleTag}
              onClear={clearFilters}
            />

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
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
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
  );
}
