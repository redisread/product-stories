import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { getStoryBySlug, getAllStories, getStoryContent } from '@/lib/source';
import { formatDate } from '@/lib/utils';
import { RelatedStories } from '@/components/related-stories';
import { MdxContent } from '@/components/mdx-content';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

/**
 * 生成页面元数据
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getStoryBySlug(slug.join('/'));

  if (!page) {
    return {
      title: 'Not Found',
    };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    title: page.title,
    description: page.data.description,
    openGraph: {
      title: page.title,
      description: page.data.description,
      type: 'article',
      publishedTime: new Date(page.data.date).toISOString(),
      authors: page.data.author ? [page.data.author] : undefined,
      images: [`${siteUrl}/og?slug=${encodeURIComponent(page.slug)}`],
    },
  };
}

/**
 * 生成静态参数
 */
export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  const stories = await getAllStories();
  return stories.map((s) => ({ slug: s.slug.split('/') }));
}

/**
 * 故事详情页
 */
export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getStoryContent(slug.join('/'));

  if (!result) {
    notFound();
  }

  const { story: page, content } = result;
  const { title, data } = page;
  const { description, date, readingTime, author, cover, tags } = data;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 返回导航 */}
      <div className="mb-6">
        <Link
          href="/stories"
          className="inline-flex items-center gap-1.5 text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回故事列表</span>
        </Link>
      </div>

      {/* 文章头部 */}
      <header className="mb-10">
        {/* 标签 */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.slice(0, 5).map((tag: string) => (
              <Link
                key={tag}
                href={`/stories?tag=${encodeURIComponent(tag)}`}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-fd-primary/10 text-fd-primary hover:bg-fd-primary/20 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* 标题 */}
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-fd-foreground">
          {title}
        </h1>

        {/* 描述 */}
        {description && (
          <p className="mt-4 text-lg text-fd-muted-foreground">
            {description}
          </p>
        )}

        {/* 元信息 */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-fd-muted-foreground">
          {date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <time dateTime={new Date(date).toISOString()}>{formatDate(date)}</time>
            </div>
          )}
          {readingTime && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              <span>{readingTime}</span>
            </div>
          )}
          {author && (
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              <span>{author}</span>
            </div>
          )}
        </div>

        {/* 封面图 */}
        {cover && (
          <div className="mt-8 relative aspect-[2/1] rounded-xl overflow-hidden bg-fd-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </header>

      {/* 文章内容 */}
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <MdxContent content={content} />
      </article>

      {/* 文章底部 */}
      <footer className="mt-16 pt-8 border-t border-fd-border">
        {/* 标签 */}
        {tags && tags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-fd-muted-foreground mb-3">
              标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-lg text-sm bg-fd-muted text-fd-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 相关文章 */}
        <RelatedStories currentSlug={page.slug} />

        {/* 底部导航 */}
        <div className="mt-10 pt-6 border-t border-fd-border">
          <Link
            href="/stories"
            className="inline-flex items-center gap-2 text-sm font-medium text-fd-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            返回全部故事
          </Link>
        </div>
      </footer>
    </div>
  );
}
