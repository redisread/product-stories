'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { formatDateShort, getRelativeTime, cn } from '@/lib/utils';
import type { StoryPage } from '@/types/story';

interface StoryCardProps {
  story: StoryPage;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

/**
 * 故事卡片组件
 * 支持三种变体：默认、精选、紧凑
 */
export function StoryCard({
  story,
  variant = 'default',
  className,
}: StoryCardProps) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';

  return (
    <Link
      href={story.url}
      className={cn(
        'group block story-card',
        'bg-fd-card border border-fd-border rounded-xl',
        'overflow-hidden transition-all duration-300',
        'hover:shadow-lg hover:border-fd-primary/20',
        className
      )}
    >
      {/* 封面图片 */}
      {!isCompact && (
        <div
          className={cn(
            'relative overflow-hidden bg-fd-muted',
            isFeatured ? 'aspect-[16/9]' : 'aspect-[2/1]'
          )}
        >
          {story.data.cover ? (
            <Image
              src={story.data.cover}
              alt={story.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={isFeatured ? '(max-width: 768px) 100vw, 66vw' : '(max-width: 768px) 100vw, 33vw'}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-fd-primary/10 to-fd-accent/10">
              <span className="text-4xl font-bold text-fd-primary/20">
                {story.title.charAt(0)}
              </span>
            </div>
          )}

          {/* 精选标签 */}
          {story.data.featured && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500 text-white shadow-sm">
                精选
              </span>
            </div>
          )}

          {/* 产品标签 */}
          {story.data.products && story.data.products.length > 0 && (
            <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end max-w-[60%]">
              {story.data.products.slice(0, 2).map((product) => (
                <span
                  key={product}
                  className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm"
                >
                  {product}
                </span>
              ))}
              {story.data.products.length > 2 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
                  +{story.data.products.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* 内容区域 */}
      <div
        className={cn(
          'flex flex-col',
          isCompact ? 'p-4' : 'p-5'
        )}
      >
        {/* 标题 */}
        <h3
          className={cn(
            'font-semibold text-fd-foreground line-clamp-2 group-hover:text-fd-primary transition-colors',
            isFeatured ? 'text-xl md:text-2xl' : 'text-lg',
            isCompact && 'text-base'
          )}
        >
          {story.title}
        </h3>

        {/* 描述 */}
        {!isCompact && story.data.description && (
          <p className="mt-2 text-sm text-fd-muted-foreground line-clamp-2">
            {story.data.description}
          </p>
        )}

        {/* 元信息 */}
        <div className="mt-auto pt-4 flex items-center gap-4 text-xs text-fd-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <time dateTime={new Date(story.data.date).toISOString()} title={formatDateShort(story.data.date)}>
              {getRelativeTime(story.data.date)}
            </time>
          </div>

          {story.data.readingTime && (
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{story.data.readingTime}</span>
            </div>
          )}

          {story.data.author && (
            <div className="hidden sm:block">
              <span>by {story.data.author}</span>
            </div>
          )}
        </div>

        {/* 紧凑模式的产品标签 */}
        {isCompact && story.data.products && story.data.products.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {story.data.products.slice(0, 3).map((product) => (
              <span
                key={product}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-fd-muted text-fd-muted-foreground"
              >
                {product}
              </span>
            ))}
          </div>
        )}

        {/* 阅读更多 */}
        {!isCompact && (
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-fd-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <span>阅读全文</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </div>
        )}
      </div>
    </Link>
  );
}

/**
 * 故事卡片骨架屏
 */
export function StoryCardSkeleton({
  variant = 'default',
}: {
  variant?: 'default' | 'featured' | 'compact';
}) {
  const isFeatured = variant === 'featured';
  const isCompact = variant === 'compact';

  return (
    <div
      className={cn(
        'bg-fd-card border border-fd-border rounded-xl overflow-hidden',
        'animate-pulse'
      )}
    >
      {!isCompact && (
        <div
          className={cn(
            'bg-fd-muted',
            isFeatured ? 'aspect-[16/9]' : 'aspect-[2/1]'
          )}
        />
      )}
      <div className={cn('flex flex-col', isCompact ? 'p-4' : 'p-5')}>
        <div
          className={cn(
            'bg-fd-muted rounded',
            isFeatured ? 'h-8 w-3/4' : 'h-6 w-full'
          )}
        />
        {!isCompact && (
          <>
            <div className="mt-2 h-4 bg-fd-muted rounded w-full" />
            <div className="mt-1 h-4 bg-fd-muted rounded w-2/3" />
          </>
        )}
        <div className="mt-4 flex gap-4">
          <div className="h-3 bg-fd-muted rounded w-16" />
          <div className="h-3 bg-fd-muted rounded w-20" />
        </div>
      </div>
    </div>
  );
}
