import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// 搜索索引类型
interface SearchIndexItem {
  slug: string;
  title: string;
  description: string;
  url: string;
  date: string;
  products: string[];
  tags: string[];
  author: string;
}

/**
 * 从搜索索引获取故事数据
 * Edge Runtime 兼容
 */
async function getStoryFromIndex(slug: string): Promise<SearchIndexItem | null> {
  try {
    // 在 Edge Runtime 中使用 fetch 读取静态文件
    const response = await fetch(new URL('/search-index.json', 'http://localhost'));
    if (!response.ok) return null;

    const index: SearchIndexItem[] = await response.json();
    return index.find((item) => item.slug === slug) || null;
  } catch {
    // 如果无法读取索引，返回 null
    return null;
  }
}

/**
 * OG 图片生成路由 - Edge Runtime 版本
 * 支持 Cloudflare Pages Edge Functions
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await params;
  const storySlug = slug.join('/');

  let title = 'Product Stories';
  let description = '探索产品背后的故事';
  let products: string[] = [];

  // 尝试从搜索索引获取故事数据
  const story = await getStoryFromIndex(storySlug);
  if (story) {
    title = story.title;
    description = story.description;
    products = story.products;
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '60px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: 'white', fontSize: '24px' }}>✦</span>
          </div>
          <span style={{ color: '#94a3b8', fontSize: '24px', fontWeight: 500 }}>
            Product Stories
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: '64px',
            fontWeight: 700,
            color: '#f8fafc',
            marginTop: '48px',
            marginBottom: '24px',
            lineHeight: 1.2,
            maxWidth: '900px',
          }}
        >
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p
            style={{
              fontSize: '32px',
              color: '#cbd5e1',
              maxWidth: '800px',
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}

        {/* Products */}
        {products.length > 0 && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '40px' }}>
            {products.map((product) => (
              <span
                key={product}
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  color: '#60a5fa',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  fontSize: '20px',
                  fontWeight: 500,
                }}
              >
                {product}
              </span>
            ))}
          </div>
        )}

        {/* Bottom decoration */}
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '4px',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              borderRadius: '2px',
            }}
          />
          <span style={{ color: '#64748b', fontSize: '20px' }}>产品故事集</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

