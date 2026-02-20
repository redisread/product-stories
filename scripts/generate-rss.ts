/**
 * RSS Feed 生成脚本
 * 在构建时生成静态 RSS 文件
 */
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getAllStories } from '../lib/source';

async function generateRSS() {
  const stories = await getAllStories();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://product-stories.pages.dev';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Product Stories - 产品故事集</title>
    <link>${siteUrl}</link>
    <description>探索产品背后的故事，从设计决策到用户旅程的完整记录</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${stories
      .map(
        (story) => `
    <item>
      <title><![CDATA[${story.title}]]></title>
      <link>${siteUrl}${story.url}</link>
      <guid isPermaLink="true">${siteUrl}${story.url}</guid>
      <pubDate>${new Date(story.data.date).toUTCString()}</pubDate>
      <author>${story.data.author || 'Product Stories'}</author>
      <category>${(story.data.products || []).join(', ')}</category>
      <description><![CDATA[${story.data.description || ''}]]></description>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  // 写入 public 目录，构建时会复制到 dist
  const outputPath = join(process.cwd(), 'public', 'feed.xml');
  await writeFile(outputPath, rss, 'utf-8');
  console.log('✅ RSS feed generated at:', outputPath);
}

generateRSS().catch((error) => {
  console.error('Failed to generate RSS:', error);
  process.exit(1);
});
