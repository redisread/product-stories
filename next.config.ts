import type { NextConfig } from 'next';

const isCloudflare = process.env.CLOUDFLARE_DEPLOYMENT === 'true';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Cloudflare Pages 静态导出配置
  output: isCloudflare ? 'export' : undefined,
  distDir: isCloudflare ? 'dist' : '.next',
  images: {
    unoptimized: isCloudflare, // Cloudflare 不支持图片优化
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // 优化构建输出
  compress: true,
  poweredByHeader: false,
  // 缓存优化（仅非 Cloudflare 环境）
  ...(!isCloudflare && {
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on',
            },
          ],
        },
        {
          source: '/feed.xml',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=3600, stale-while-revalidate=86400',
            },
          ],
        },
        {
          source: '/og/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=86400, stale-while-revalidate=604800',
            },
          ],
        },
      ];
    },
  }),
  // 重定向配置（仅非 Cloudflare 环境）
  ...(!isCloudflare && {
    async redirects() {
      return [
        // 旧 URL 兼容
        {
          source: '/story/:slug*',
          destination: '/stories/:slug*',
          permanent: true,
        },
      ];
    },
  }),
};

export default nextConfig;
