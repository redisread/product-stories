import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const healthData = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: import.meta.env?.npm_package_version || '0.0.1',
    buildTime: new Date().toISOString(),
  };

  return new Response(JSON.stringify(healthData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
};
