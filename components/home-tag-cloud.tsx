import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TagWithCount {
  name: string;
  count: number;
}

interface HomeTagCloudProps {
  tags: TagWithCount[];
}

export function HomeTagCloud({ tags }: HomeTagCloudProps) {
  // 计算字体大小
  const maxCount = Math.max(...tags.map((t) => t.count));
  const minCount = Math.min(...tags.map((t) => t.count));

  const getFontSize = (count: number) => {
    if (maxCount === minCount) return 'text-base';
    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.75) return 'text-xl';
    if (ratio > 0.5) return 'text-lg';
    if (ratio > 0.25) return 'text-base';
    return 'text-sm';
  };

  // 预定义颜色池
  const colors = [
    'bg-violet-500/10 text-violet-600 border-violet-200 hover:bg-violet-500/20',
    'bg-blue-500/10 text-blue-600 border-blue-200 hover:bg-blue-500/20',
    'bg-emerald-500/10 text-emerald-600 border-emerald-200 hover:bg-emerald-500/20',
    'bg-amber-500/10 text-amber-600 border-amber-200 hover:bg-amber-500/20',
    'bg-rose-500/10 text-rose-600 border-rose-200 hover:bg-rose-500/20',
    'bg-cyan-500/10 text-cyan-600 border-cyan-200 hover:bg-cyan-500/20',
    'bg-indigo-500/10 text-indigo-600 border-indigo-200 hover:bg-indigo-500/20',
    'bg-pink-500/10 text-pink-600 border-pink-200 hover:bg-pink-500/20',
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {tags.map((tag, index) => {
        const color = colors[index % colors.length];
        return (
          <Link
            key={tag.name}
            href={`/stories?tag=${encodeURIComponent(tag.name)}`}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
              'font-medium border transition-all duration-200',
              'hover:scale-105',
              color
            )}
          >
            <span className={getFontSize(tag.count)}>#{tag.name}</span>
            <span className="text-xs opacity-70">({tag.count})</span>
          </Link>
        );
      })}
    </div>
  );
}