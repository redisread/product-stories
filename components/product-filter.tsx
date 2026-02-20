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

interface ProductFilterProps {
  products: string[];
  selectedProducts: string[];
  onToggle: (product: string) => void;
  onClear: () => void;
}

/**
 * 产品筛选组件
 * 支持多选，使用 Combobox + Badge 展示
 */
export function ProductFilter({
  products,
  selectedProducts,
  onToggle,
  onClear,
}: ProductFilterProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 产品颜色映射（使用标准化名称）
  const productColors: Record<string, string> = {
    'design-system': 'bg-violet-500',
    'web-platform': 'bg-blue-500',
    'mobile-app': 'bg-emerald-500',
    'api-service': 'bg-amber-500',
    ios: 'bg-indigo-500',
    android: 'bg-green-500',
  };

  // 获取产品显示名称（从标准化名称）
  const getDisplayName = (product: string) => {
    return product
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // 标准化产品名
  const normalize = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

  // 处理选择
  const handleSelect = (product: string) => {
    startTransition(() => {
      onToggle(product);
    });
  };

  // 移除已选项
  const removeProduct = (product: string) => {
    startTransition(() => {
      onToggle(product);
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
                selectedProducts.length > 0 && 'border-fd-primary'
              )}
              disabled={isPending}
            >
              <Filter className="w-4 h-4" />
              <span>筛选产品</span>
              {selectedProducts.length > 0 && (
                <span className="ml-1 px-1.5 py-0 text-xs bg-fd-primary text-fd-primary-foreground rounded-full">
                  {selectedProducts.length}
                </span>
              )}
              <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[260px] p-0" align="start">
            <Command>
              <CommandInput placeholder="搜索产品..." className="h-9" />
              <CommandList>
                <CommandEmpty>未找到产品</CommandEmpty>
                <CommandGroup>
                  {products.map((product) => {
                    const normalized = normalize(product);
                    const isSelected = selectedProducts.includes(normalized);
                    return (
                      <CommandItem
                        key={product}
                        value={product}
                        onSelect={() => handleSelect(product)}
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
                        <span
                          className={cn(
                            'w-3 h-3 rounded-full mr-2',
                            productColors[normalized] || 'bg-gray-400'
                          )}
                        />
                        <span className="flex-1">{getDisplayName(product)}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* 已选产品标签 */}
        {selectedProducts.map((product) => (
          <Badge
            key={product}
            variant="secondary"
            className={cn(
              'gap-1 pr-1 pl-2 py-1 font-normal cursor-pointer',
              'hover:bg-fd-accent transition-colors'
            )}
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                productColors[product] || 'bg-gray-400'
              )}
            />
            <span>{getDisplayName(product)}</span>
            <button
              onClick={() => removeProduct(product)}
              className="ml-1 p-0.5 rounded-sm hover:bg-fd-muted"
              aria-label={`移除 ${product}`}
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}

        {/* 清除按钮 */}
        {selectedProducts.length > 0 && (
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
 * 产品标签云
 * 用于快速选择热门产品
 */
export function ProductTagCloud({
  products,
  selectedProducts,
  onToggle,
  counts,
}: ProductFilterProps & { counts?: Record<string, number> }) {
  const [isPending, startTransition] = useTransition();

  const productColors: Record<string, string> = {
    'design-system': 'bg-violet-500/10 text-violet-600 border-violet-200 hover:bg-violet-500/20',
    'web-platform': 'bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20',
    'mobile-app': 'bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20',
    'api-service': 'bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20',
    ios: 'bg-indigo-500/10 text-indigo-600 border-indigo-200 hover:bg-indigo-500/20',
    android: 'bg-green-500/10 text-green-600 border-green-200 hover:bg-green-500/20',
  };

  const normalize = (name: string) => name.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-wrap gap-2">
      {products.map((product) => {
        const normalized = normalize(product);
        const isSelected = selectedProducts.includes(normalized);
        const count = counts?.[product];

        return (
          <button
            key={product}
            onClick={() => {
              startTransition(() => onToggle(product));
            }}
            disabled={isPending}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              'text-sm font-medium border transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              isSelected
                ? productColors[normalized] ||
                    'bg-fd-primary/10 text-fd-primary border-fd-primary/30'
                : 'bg-fd-muted text-fd-muted-foreground border-transparent hover:bg-fd-accent'
            )}
          >
            <span
              className={cn(
                'w-2 h-2 rounded-full',
                isSelected
                  ? productColors[normalized]?.match(/bg-[^/]+/)?.[0] || 'bg-fd-primary'
                  : 'bg-fd-muted-foreground/50'
              )}
            />
            <span>{product}</span>
            {count !== undefined && (
              <span className="text-xs opacity-70">({count})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
