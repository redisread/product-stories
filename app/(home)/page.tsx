import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StoryCard } from '@/components/story-card';
import { StoryStats } from '@/components/story-stats';
import {
  getAllStories,
  getFeaturedStories,
  getStoriesStats,
  getAllTags,
} from '@/lib/source';
import { cn } from '@/lib/utils';

export default async function HomePage() {
  const stories = await getAllStories();
  const featuredStories = await getFeaturedStories(3);
  const stats = await getStoriesStats();
  const tags = await getAllTags();

  return (
    <div className="min-h-screen">
      {/* Featured Stories - 最顶端 */}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {tags.map((tag) => (
                <TagCard key={tag} name={tag} />
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
 * 标签卡片组件
 */
function TagCard({ name }: { name: string }) {
  const tagColors: Record<string, string> = {
    '苹果': 'from-gray-500/20 to-slate-500/20 border-gray-200',
    '设计': 'from-violet-500/20 to-purple-500/20 border-violet-200',
    '用户体验': 'from-blue-500/20 to-cyan-500/20 border-blue-200',
    '简洁': 'from-emerald-500/20 to-teal-500/20 border-emerald-200',
    '谷歌': 'from-blue-600/20 to-indigo-500/20 border-blue-300',
    '数据驱动': 'from-amber-500/20 to-orange-500/20 border-amber-200',
    'ab测试': 'from-red-500/20 to-pink-500/20 border-red-200',
    '产品决策': 'from-cyan-500/20 to-blue-500/20 border-cyan-200',
    'notion': 'from-gray-600/20 to-slate-400/20 border-gray-300',
    '知识管理': 'from-green-500/20 to-emerald-500/20 border-green-200',
    '效率工具': 'from-yellow-500/20 to-amber-500/20 border-yellow-200',
    '第二大脑': 'from-indigo-500/20 to-purple-500/20 border-indigo-200',
  };

  const gradient = tagColors[name] || 'from-gray-500/20 to-slate-500/20 border-gray-200';

  return (
    <Link
      href={`/stories?tag=${encodeURIComponent(name)}`}
      className={cn(
        'group block p-6 rounded-xl border bg-gradient-to-br',
        'transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-1',
        gradient
      )}
    >
      <h3 className="font-semibold text-fd-foreground group-hover:text-fd-primary transition-colors">
        #{name}
      </h3>
      <p className="mt-2 text-sm text-fd-muted-foreground">
        查看相关故事
        <ArrowRight className="inline-block w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
      </p>
    </Link>
  );
}
