'use client';

import { ArrowDown, ArrowUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { SortOption } from '@/types/story';

interface StorySortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

/**
 * 故事排序组件
 * 支持最新/最旧排序
 */
export function StorySort({ value, onChange, className }: StorySortProps) {
  const options: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    {
      value: 'newest',
      label: '最新优先',
      icon: <ArrowDown className="w-4 h-4" />,
    },
    {
      value: 'oldest',
      label: '最早优先',
      icon: <ArrowUp className="w-4 h-4" />,
    },
  ];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Calendar className="w-4 h-4 text-fd-muted-foreground" />
      <div className="flex items-center rounded-lg border border-fd-border bg-fd-background p-1">
        {options.map((option) => (
          <Button
            key={option.value}
            variant="ghost"
            size="sm"
            onClick={() => onChange(option.value)}
            className={cn(
              'h-7 px-3 text-xs font-medium transition-all',
              value === option.value
                ? 'bg-fd-primary text-fd-primary-foreground hover:bg-fd-primary/90'
                : 'text-fd-muted-foreground hover:text-fd-foreground'
            )}
          >
            <span className="flex items-center gap-1.5">
              {option.icon}
              {option.label}
            </span>
          </Button>
        ))}
      </div>
    </div>
  );
}
