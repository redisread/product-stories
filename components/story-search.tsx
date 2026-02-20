'use client';

import { useState, useTransition, useCallback } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { debounce } from '@/lib/utils';

interface StorySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/**
 * 故事搜索组件
 * 带防抖功能
 */
export function StorySearch({
  value,
  onChange,
  placeholder = '搜索故事标题、内容...',
  className,
}: StorySearchProps) {
  const [localValue, setLocalValue] = useState(value);
  const [isPending, startTransition] = useTransition();

  // 防抖处理搜索
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      startTransition(() => {
        onChange(query);
      });
    }, 300),
    [onChange]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    debouncedSearch(newValue);
  };

  const handleClear = () => {
    setLocalValue('');
    startTransition(() => {
      onChange('');
    });
  };

  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-fd-muted-foreground" />
      <Input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          'pl-10 pr-10 h-10',
          'bg-fd-background border-fd-border',
          'focus-visible:ring-fd-primary',
          isPending && 'opacity-70'
        )}
      />
      {localValue && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 text-fd-muted-foreground hover:text-fd-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
