import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StoryCard } from '@/components/story-card';
import { StoryStats } from '@/components/story-stats';
import { HomeTagCloud } from '@/components/home-tag-cloud';
import {
  getAllStories,
  getFeaturedStories,
  getStoriesStats,
  getTagsWithCounts,
} from '@/lib/source';
import { cn } from '@/lib/utils';

export default async function HomePage() {
  const stories = await getAllStories();
  const featuredStories = await getFeaturedStories(3);
  const stats = await getStoriesStats();
  const tags = await getTagsWithCounts();

  return (
    <div className="min-h-screen">
      {/* Recent Stories - 最新发布在最顶端 */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-fd-foreground">
                最新发布
              </h2>
              <p className="mt-2 text-fd-muted-foreground">
                最近更新的产品故事和案例研究
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex gap-1">
              <Link href="/stories">
                查看全部
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.slice(0, 6).map((story) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-fd-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <StoryStats stats={stats} />
        </div>
      </section>

      {/* Tags Grid */}
      {tags.length > 0 && (
        <section className="py-16 md:py-24 bg-fd-muted/30 border-y border-fd-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-fd-foreground mb-4">
                按标签浏览
              </h2>
              <p className="text-fd-muted-foreground max-w-2xl mx-auto">
                选择你感兴趣的标签，探索与之相关的所有故事
              </p>
            </div>
            <HomeTagCloud tags={tags} />
          </div>
        </section>
      )}

      {/* Featured Stories */}
      {featuredStories.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-fd-foreground">
                  精选故事
                </h2>
                <p className="mt-2 text-fd-muted-foreground">
                  值得深入阅读的产品案例和深度思考
                </p>
              </div>
              <Button asChild variant="ghost" className="hidden sm:flex gap-1">
                <Link href="/stories">
                  查看全部
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredStories.map((story, index) => (
                <StoryCard
                  key={story.slug}
                  story={story}
                  variant={index === 0 ? 'featured' : 'default'}
                  className={cn(index === 0 && 'md:col-span-2 lg:col-span-1')}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - 移到底端，包含描述文字 */}
      <section className="py-20 bg-fd-primary text-fd-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            阅读更多产品故事
          </h2>
          <p className="text-fd-primary-foreground/80 max-w-2xl mx-auto mb-6">
            从设计决策到用户旅程，记录产品成长的每一个重要时刻。
            发现案例研究、用户故事和幕后开发花絮。
          </p>
          <p className="text-fd-primary-foreground/80 max-w-2xl mx-auto mb-8">
            浏览全部 {stories.length} 个产品故事，按产品、标签或日期筛选你感兴趣的内容
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="gap-2"
          >
            <Link href="/stories">
              开始探索
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
