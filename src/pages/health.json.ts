import type { APIRoute } from 'astro';

// 构建时间（从环境变量注入）
const buildTime = import.meta.env.BUILD_TIME || new Date().toISOString();

// 健康检查端点
export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      buildTime,
      version: '1.0.0',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    }
  );
};
