import { StoryCardSkeleton } from '@/components/story-card';

/**
 * 故事列表骨架屏
 */
export function StoriesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filter Bar Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex-1 max-w-md">
          <div className="h-10 bg-fd-muted rounded-lg animate-pulse" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-10 w-32 bg-fd-muted rounded-lg animate-pulse" />
          <div className="h-10 w-40 bg-fd-muted rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Results Count Skeleton */}
      <div className="h-5 w-48 bg-fd-muted rounded animate-pulse" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <StoryCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
