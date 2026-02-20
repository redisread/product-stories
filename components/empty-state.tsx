'use client';

import { FileX, SearchX, FilterX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type?: 'no-results' | 'no-data' | 'error';
  title?: string;
  description?: string;
  onReset?: () => void;
  className?: string;
}

/**
 * 空状态组件
 */
export function EmptyState({
  type = 'no-results',
  title,
  description,
  onReset,
  className,
}: EmptyStateProps) {
  const config = {
    'no-results': {
      icon: SearchX,
      defaultTitle: '没有找到匹配的故事',
      defaultDescription: '尝试调整筛选条件或搜索关键词',
    },
    'no-data': {
      icon: FileX,
      defaultTitle: '暂无故事',
      defaultDescription: '还没有发布任何故事，敬请期待',
    },
    error: {
      icon: FilterX,
      defaultTitle: '出错了',
      defaultDescription: '加载数据时发生错误，请稍后重试',
    },
  };

  const { icon: Icon, defaultTitle, defaultDescription } = config[type];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-16 px-4 text-center',
        className
      )}
    >
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-fd-muted mb-4">
        <Icon className="w-8 h-8 text-fd-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-fd-foreground mb-2">
        {title || defaultTitle}
      </h3>
      <p className="text-sm text-fd-muted-foreground max-w-sm mb-6">
        {description || defaultDescription}
      </p>
      {onReset && (
        <Button onClick={onReset} variant="outline">
          清除筛选条件
        </Button>
      )}
    </div>
  );
}
