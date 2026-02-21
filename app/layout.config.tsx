import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { BookOpen, Home, Sparkles, Github } from 'lucide-react';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Sparkles className="w-5 h-5 text-fd-primary" />
        <span className="font-semibold">Product Stories</span>
      </>
    ),
    transparentMode: 'none',
  },
  links: [
    {
      icon: <Home className="w-4 h-4" />,
      text: '首页',
      url: '/',
      active: 'url',
    },
    {
      icon: <BookOpen className="w-4 h-4" />,
      text: '全部故事',
      url: '/stories',
      active: 'nested-url',
    },
  ],
  githubUrl: 'https://github.com/redisread/product-stories',
};
