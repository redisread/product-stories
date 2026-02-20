'use client';

import { FileText, Package, Star, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { StoriesStats } from '@/types/story';

interface StoryStatsProps {
  stats: StoriesStats;
  className?: string;
}

/**
 * 故事统计卡片
 */
export function StoryStats({ stats, className }: StoryStatsProps) {
  const items = [
    {
      label: '故事总数',
      value: stats.totalStories,
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      label: '产品覆盖',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
    },
    {
      label: '精选故事',
      value: stats.featuredStories,
      icon: Star,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
    {
      label: '作者人数',
      value: stats.authors.length,
      icon: Users,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10',
    },
  ];

  return (
    <div
      className={cn(
        'grid grid-cols-2 md:grid-cols-4 gap-4',
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 p-4 rounded-xl bg-fd-card border border-fd-border"
        >
          <div
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-lg',
              item.bgColor,
              item.color
            )}
          >
            <item.icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-fd-foreground">
              {item.value}
            </div>
            <div className="text-xs text-fd-muted-foreground">
              {item.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
