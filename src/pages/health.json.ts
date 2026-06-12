import type { APIRoute } from 'astro';

// 健康检查端点
export const GET: APIRoute = () => {
  return new Response(
    JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      uptime: process.uptime(),
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
