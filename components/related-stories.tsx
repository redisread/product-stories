import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getRelatedStories } from '@/lib/source';
import { formatDateShort } from '@/lib/utils';

interface RelatedStoriesProps {
  currentSlug: string;
}

/**
 * 相关故事组件
 */
export async function RelatedStories({ currentSlug }: RelatedStoriesProps) {
  const related = await getRelatedStories(currentSlug, 3);

  if (related.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-fd-border pt-8">
      <h3 className="text-lg font-semibold text-fd-foreground mb-4">
        相关故事
      </h3>
      <div className="grid gap-4">
        {related.map((story) => (
          <Link
            key={story.slug}
            href={story.url}
            className="group flex items-start gap-4 p-4 rounded-lg border border-fd-border bg-fd-card hover:border-fd-primary/30 hover:shadow-sm transition-all"
          >
            {/* 封面缩略图或占位符 */}
            <div className="flex-shrink-0 w-16 h-16 rounded-md bg-fd-muted overflow-hidden">
              {story.data.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={story.data.cover}
                  alt={story.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-fd-muted-foreground text-lg font-bold">
                  {story.title.charAt(0)}
                </div>
              )}
            </div>

            {/* 内容 */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-fd-foreground group-hover:text-fd-primary transition-colors line-clamp-1">
                {story.title}
              </h4>
              {story.data.description && (
                <p className="mt-1 text-sm text-fd-muted-foreground line-clamp-1">
                  {story.data.description}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2 text-xs text-fd-muted-foreground">
                <time dateTime={new Date(story.data.date).toISOString()}>
                  {formatDateShort(story.data.date)}
                </time>
                {story.data.products && story.data.products.length > 0 && (
                  <>
                    <span>·</span>
                    <span className="line-clamp-1">
                      {story.data.products.join(', ')}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* 箭头 */}
            <ArrowRight className="flex-shrink-0 w-5 h-5 text-fd-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>
    </div>
  );
}
