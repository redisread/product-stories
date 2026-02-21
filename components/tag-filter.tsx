'use client';

import { useState, useTransition } from 'react';
import { Check, ChevronDown, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
  onClear: () => void;
}

/**
 * 标签筛选组件
 * 支持多选，使用 Combobox + Badge 展示
 */
export function TagFilter({
  tags,
  selectedTags,
  onToggle,
  onClear,
}: TagFilterProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 处理选择
  const handleSelect = (tag: string) => {
    startTransition(() => {
      onToggle(tag);
    });
  };

  // 移除已选项
  const removeTag = (tag: string) => {
    startTransition(() => {
      onToggle(tag);
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* 筛选按钮 + 已选标签 */}
      <div className="flex flex-wrap items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                'justify-between gap-2 min-w-[140px]',
                selectedTags.length > 0 && 'border-fd-primary'
              )}
              disabled={isPending}
            >
              <Filter className="w-4 h-4" />
              <span>筛选标签</span>
              {selectedTags.length > 0 && (
                <span className="ml-1 px-1.5 py-0 text-xs bg-fd-primary text-fd-primary-foreground rounded-full">
                  {selectedTags.length}
                </span>
              )}
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[260px] p-0" align="start">
            <Command>
              <CommandInput placeholder="搜索标签..." className="h-9" />
              <CommandList>
                <CommandEmpty>未找到标签</CommandEmpty>
                <CommandGroup>
                  {tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <CommandItem
                        key={tag}
                        value={tag}
                        onSelect={() => handleSelect(tag)}
                        className="cursor-pointer"
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                            isSelected
                              ? 'bg-fd-primary border-fd-primary'
                              : 'border-fd-border'
                          )}
                        >
                          {isSelected && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <span className="flex-1">#{tag}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* 已选标签 */}
        {selectedTags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className={cn(
              'gap-1 pr-1 pl-2 py-1 font-normal cursor-pointer',
              'hover:bg-fd-accent transition-colors'
            )}
          >
            <span>#{tag}</span>
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 p-0.5 rounded-sm hover:bg-fd-muted"
              aria-label={`移除 ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}

        {/* 清除按钮 */}
        {selectedTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-8 text-fd-muted-foreground hover:text-fd-foreground"
          >
            <X className="w-3.5 h-3.5 mr-1" />
            清除
          </Button>
        )}
      </div>

      {/* 加载指示器 */}
      {isPending && (
        <div className="h-0.5 w-full bg-fd-muted overflow-hidden">
          <div className="h-full w-1/3 bg-fd-primary animate-[shimmer_1s_infinite]" />
        </div>
      )}
    </div>
  );
}

/**
 * 标签云
 * 用于快速选择热门标签
 */
export function TagCloud({
  tags,
  selectedTags,
  onToggle,
  counts,
}: TagFilterProps & { counts?: Record<string, number> }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        const count = counts?.[tag];

        return (
          <button
            key={tag}
            onClick={() => {
              startTransition(() => onToggle(tag));
            }}
            disabled={isPending}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              'text-sm font-medium border transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isSelected
                ? 'bg-fd-primary/10 text-fd-primary border-fd-primary/30'
                : 'bg-fd-muted text-fd-muted-foreground border-transparent hover:bg-fd-accent'
            )}
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                isSelected ? 'bg-fd-primary' : 'bg-fd-muted-foreground/50'
              )}
            />
            <span>#{tag}</span>
            {count !== undefined && (
              <span className="text-xs opacity-70">({count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
