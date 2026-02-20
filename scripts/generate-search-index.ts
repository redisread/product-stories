/**
 * 搜索索引生成脚本
 * 在构建时生成静态搜索索引，供 Edge Functions 使用
 */
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { getAllStories } from '../lib/source';

async function generateSearchIndex() {
  const stories = await getAllStories();

  // 构建搜索索引
  const searchIndex = stories.map((story) => ({
    slug: story.slug,
    title: story.title,
    description: story.data.description || '',
    url: story.url,
    date: story.data.date,
    products: story.data.products || [],
    tags: story.data.tags || [],
    author: story.data.author || '',
  }));

  // 写入 public 目录，构建时会复制到 dist
  const outputPath = join(process.cwd(), 'public', 'search-index.json');
  await writeFile(outputPath, JSON.stringify(searchIndex, null, 2), 'utf-8');
  console.log('✅ Search index generated at:', outputPath);
  console.log(`   Indexed ${searchIndex.length} stories`);
}

generateSearchIndex().catch((error) => {
  console.error('Failed to generate search index:', error);
  process.exit(1);
});
