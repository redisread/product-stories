'use client';

import { useTransition } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface TagSidebarProps {
  tags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
  counts: Record<string, number>;
  className?: string;
}

/**
 * 标签侧边栏组件
 * 以垂直列表形式展示所有标签，支持点击筛选
 */
export function TagSidebar({
  tags,
  selectedTags,
  onToggle,
  onClear,
  counts,
  className,
}: TagSidebarProps) {
  const [isPending, startTransition] = useTransition();

  // 处理标签选择
  const handleToggle = (tag: string) => {
    startTransition(() => {
      onToggle(tag);
    });
  };

  // 移除单个已选标签
  const removeTag = (tag: string) => {
    handleToggle(tag);
  };

  return (
    <aside
      className={cn(
        'flex flex-col w-full lg:w-[240px] shrink-0',
        className
      )}
    >
      {/* 已选标签区域 */}
      {selectedTags.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-fd-muted/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-fd-foreground">
              已选标签
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="h-6 px-2 text-xs text-fd-muted-foreground hover:text-fd-foreground"
            >
              <X className="w-3 h-3 mr-1" />
              清除
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className={cn(
                  'gap-1 pr-1 pl-2 py-0.5 text-xs cursor-pointer',
                  'hover:bg-fd-accent transition-colors'
                )}
              >
                <span>#{tag}</span>
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-0.5 p-0.5 rounded-sm hover:bg-fd-muted"
                  aria-label={`移除 ${tag}`}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 标签列表 */}
      <div className="flex-1 min-h-0">
        <div className="text-sm font-medium text-fd-foreground mb-2 px-1">
          全部标签
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-220px)] lg:max-h-[calc(100vh-180px)] pr-2">
          <div className="space-y-1">
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              const count = counts[tag] || 0;

              return (
                <button
                  key={tag}
                  onClick={() => handleToggle(tag)}
                  disabled={isPending}
                  className={cn(
                    'w-full flex items-center justify-between px-3 py-2 rounded-lg',
                    'text-sm transition-all duration-150',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    isSelected
                      ? 'bg-fd-primary/10 text-fd-primary border border-fd-primary/30'
                      : 'text-fd-muted-foreground hover:bg-fd-muted hover:text-fd-foreground border border-transparent'
                  )}
                >
                  <span className="font-medium">#{tag}</span>
                  <span
                    className={cn(
                      'text-xs px-1.5 py-0.5 rounded-full',
                      isSelected
                        ? 'bg-fd-primary/20 text-fd-primary'
                        : 'bg-fd-muted text-fd-muted-foreground'
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 清除筛选按钮 */}
      {selectedTags.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          className="mt-4 w-full"
        >
          <X className="w-4 h-4 mr-2" />
          清除所有筛选
        </Button>
      )}
    </aside>
  );
}