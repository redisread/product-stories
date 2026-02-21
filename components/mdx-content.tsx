'use client';

import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

// MDX 组件映射
const components = {
  h1: ({ className, ...props }: ComponentPropsWithoutRef<'h1'>) => (
    <h1
      className={cn(
        'mt-8 mb-4 text-3xl font-bold tracking-tight text-fd-foreground',
        className
      )}
      {...props}
    />
  ),
  h2: ({ className, ...props }: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      className={cn(
        'mt-10 mb-4 text-2xl font-semibold tracking-tight text-fd-foreground',
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentPropsWithoutRef<'h3'>) => (
    <h3
      className={cn(
        'mt-8 mb-3 text-xl font-semibold text-fd-foreground',
        className
      )}
      {...props}
    />
  ),
  h4: ({ className, ...props }: ComponentPropsWithoutRef<'h4'>) => (
    <h4
      className={cn(
        'mt-6 mb-2 text-lg font-semibold text-fd-foreground',
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
    <p
      className={cn(
        'mb-4 leading-7 text-fd-foreground',
        className
      )}
      {...props}
    />
  ),
  a: ({ className, ...props }: ComponentPropsWithoutRef<'a'>) => (
    <a
      className={cn(
        'text-fd-primary underline underline-offset-4 hover:text-fd-primary/80',
        className
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: ComponentPropsWithoutRef<'ul'>) => (
    <ul
      className={cn(
        'my-6 ml-6 list-disc text-fd-foreground',
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: ComponentPropsWithoutRef<'ol'>) => (
    <ol
      className={cn(
        'my-6 ml-6 list-decimal text-fd-foreground',
        className
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: ComponentPropsWithoutRef<'li'>) => (
    <li
      className={cn('mt-2', className)}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className={cn(
        'mt-6 border-l-4 border-fd-primary pl-4 italic text-fd-muted-foreground',
        className
      )}
      {...props}
    />
  ),
  img: ({ className, alt, ...props }: ComponentPropsWithoutRef<'img'>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={cn('rounded-lg border border-fd-border my-8', className)}
      alt={alt}
      {...props}
    />
  ),
  hr: ({ className, ...props }: ComponentPropsWithoutRef<'hr'>) => (
    <hr
      className={cn('my-8 border-fd-border', className)}
      {...props}
    />
  ),
  table: ({ className, ...props }: ComponentPropsWithoutRef<'table'>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table
        className={cn(
          'w-full border-collapse text-sm',
          className
        )}
        {...props}
      />
    </div>
  ),
  tr: ({ className, ...props }: ComponentPropsWithoutRef<'tr'>) => (
    <tr
      className={cn(
        'border-b border-fd-border transition-colors hover:bg-fd-muted/50',
        className
      )}
      {...props}
    />
  ),
  th: ({ className, ...props }: ComponentPropsWithoutRef<'th'>) => (
    <th
      className={cn(
        'border-b border-fd-border px-4 py-2 text-left font-semibold text-fd-foreground',
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: ComponentPropsWithoutRef<'td'>) => (
    <td
      className={cn('px-4 py-2 text-fd-foreground', className)}
      {...props}
    />
  ),
  code: ({ className, ...props }: ComponentPropsWithoutRef<'code'>) => (
    <code
      className={cn(
        'rounded bg-fd-muted px-1.5 py-0.5 font-mono text-sm text-fd-foreground',
        className
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      className={cn(
        'mb-4 mt-6 overflow-x-auto rounded-xl bg-fd-muted p-4 font-mono text-sm',
        className
      )}
      {...props}
    />
  ),
};

interface MdxContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: React.ReactElement<any>;
}

/**
 * MDX 内容渲染组件
 * 使用 MDXProvider 包装来应用自定义组件样式
 */
export function MdxContent({ content }: MdxContentProps) {
  // 直接返回已编译的 MDX 内容
  // 注意：next-mdx-remote 的 compileMDX 返回的 ReactElement 已经包含了渲染逻辑
  // 自定义组件样式需要通过其他方式应用
  return content;
}
