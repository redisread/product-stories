import type { Metadata } from 'next';
import { RootProvider } from 'fumadocs-ui/provider';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Product Stories - 产品故事集',
    template: '%s | Product Stories',
  },
  description: '探索产品背后的故事，从设计决策到用户旅程的完整记录',
  keywords: ['产品故事', 'case study', '用户故事', '产品设计', '产品案例'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'Product Stories',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Product Stories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className="font-sans"
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen antialiased">
        <RootProvider
          theme={{
            defaultTheme: 'system',
            enableSystem: true,
          }}
          search={{
            enabled: true,
          }}
        >
          <NuqsAdapter>
            {children}
          </NuqsAdapter>
        </RootProvider>
      </body>
    </html>
  );
}
