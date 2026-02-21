import { Suspense } from 'react';
import { Metadata } from 'next';
import { StoriesContent } from './stories-content';
import { StoriesSkeleton } from './stories-skeleton';
import { getAllStories, getAllTags, getStoriesStats } from '@/lib/source';

export const metadata: Metadata = {
  title: '全部故事',
  description: '浏览所有产品故事，按标签筛选、搜索关键词、按时间排序',
};

/**
 * 故事列表页面（服务器组件）
 */
export default async function StoriesPage() {
  const stories = await getAllStories();
  const tags = await getAllTags();
  const stats = await getStoriesStats();

  return (
    <div className="min-h-screen bg-fd-background">
      {/* Header */}
      <header className="border-b border-fd-border bg-fd-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-fd-foreground mb-3">
              全部故事
            </h1>
            <p className="text-fd-muted-foreground text-lg">
              共 {stats.totalStories} 个产品故事，按标签筛选你感兴趣的内容
            </p>
          </div>
        </div>
      </header>

      {/* Main Content with Filters */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<StoriesSkeleton />}>
          <StoriesContent
            stories={stories}
            tags={tags}
            totalCount={stats.totalStories}
          />
        </Suspense>
      </main>
    </div>
  );
}
