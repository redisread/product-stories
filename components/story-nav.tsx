'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowLeft, Home, BookOpen, Grid3X3 } from 'lucide-react';

export function StoryNav() {
  const pathname = usePathname();
  const isStoryDetail = pathname.startsWith('/stories/') && pathname.split('/').length > 2;

  return (
    <nav className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        {isStoryDetail && (
          <Link
            href="/stories"
            className="flex items-center gap-1.5 text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回列表</span>
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <NavLink href="/" icon={<Home className="w-4 h-4" />}>
          首页
        </NavLink>
        <NavLink href="/stories" icon={<BookOpen className="w-4 h-4" />}>
          全部故事
        </NavLink>
        <NavLink href="/stories?filter=all" icon={<Grid3X3 className="w-4 h-4" />}>
          按产品浏览
        </NavLink>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg text-sm
        transition-colors duration-200
        ${
          isActive
            ? 'bg-fd-primary/10 text-fd-primary font-medium'
            : 'text-fd-muted-foreground hover:text-fd-foreground hover:bg-fd-muted'
        }
      `}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
