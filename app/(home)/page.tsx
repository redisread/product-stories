import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StoryCard } from '@/components/story-card';
import { StoryStats } from '@/components/story-stats';
import {
  getAllStories,
  getFeaturedStories,
  getStoriesStats,
  getAllProducts,
} from '@/lib/source';
import { cn } from '@/lib/utils';

export default async function HomePage() {
  const stories = await getAllStories();
  const featuredStories = await getFeaturedStories(3);
  const stats = await getStoriesStats();
  const products = await getAllProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-fd-border">
        <div className="absolute inset-0 bg-gradient-to-br from-fd-primary/5 via-transparent to-fd-accent/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="py-20 md:py-32 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fd-primary/10 text-fd-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>探索产品背后的故事</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-fd-foreground mb-6">
              Product Stories
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/stories">
                  <BookOpen className="w-4 h-4" />
                  浏览全部故事
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/stories">
                  按产品筛选
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories - 移到 Hero 后面 */}
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

      {/* Stats Section */}
      <section className="py-12 bg-fd-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <StoryStats stats={stats} />
        </div>
      </section>

      {/* Products Grid */}
      {products.length > 0 && (
        <section className="py-16 md:py-24 bg-fd-muted/30 border-y border-fd-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-fd-foreground mb-4">
                按产品浏览
              </h2>
              <p className="text-fd-muted-foreground max-w-2xl mx-auto">
                选择你感兴趣的产品，探索与之相关的所有故事
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product} name={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Stories */}
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

/**
 * 产品卡片组件
 */
function ProductCard({ name }: { name: string }) {
  const productColors: Record<string, string> = {
    'design-system': 'from-violet-500/20 to-purple-500/20 border-violet-200',
    'web-platform': 'from-blue-500/20 to-cyan-500/20 border-blue-200',
    'mobile-app': 'from-emerald-500/20 to-teal-500/20 border-emerald-200',
    'api-service': 'from-amber-500/20 to-orange-500/20 border-amber-200',
    ios: 'from-indigo-500/20 to-blue-500/20 border-indigo-200',
    android: 'from-green-500/20 to-emerald-500/20 border-green-200',
  };

  const normalized = name.toLowerCase().replace(/\s+/g, '-');
  const gradient = productColors[normalized] || 'from-gray-500/20 to-slate-500/20 border-gray-200';

  return (
    <Link
      href={`/stories?products=${encodeURIComponent(normalized)}`}
      className={cn(
        'group block p-6 rounded-xl border bg-gradient-to-br',
        'transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-1',
        gradient
      )}
    >
      <h3 className="font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors">
        {name}
      </h3>
      <p className="mt-2 text-sm text-fd-muted-foreground">
        查看相关故事
        <ArrowRight className="inline-block w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
      </p>
    </Link>
  );
}
