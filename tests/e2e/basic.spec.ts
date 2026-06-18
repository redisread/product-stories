import { test, expect } from '@playwright/test';

test.describe('首页', () => {
  test('应该正常加载', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Product Stories/);
  });

  test('应该显示文章列表', async ({ page }) => {
    await page.goto('/');
    // 检查是否有文章卡片
    const articles = page.locator('article, .story-card, [class*="story"], [class*="card"]');
    await expect(articles.first()).toBeVisible({ timeout: 10000 });
  });

  // 健康检查端点测试
  test('健康检查端点应该返回正确状态', async ({ request }) => {
    const response = await request.get('/health.json');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe('healthy');
  });
});

test.describe('文章详情页', () => {
  test('应该能点击文章进入详情页', async ({ page }) => {
    await page.goto('/');
    // 找到第一个文章链接并点击
    const firstArticleLink = page.locator('a[href*="/stories/"]').first();
    await firstArticleLink.click();
    await page.waitForLoadState('networkidle');
    // 检查页面是否正常显示 - 使用更具体的选择器
    await expect(page.locator('article h1').first()).toBeVisible();
  });
});

// 标签页是动态路由 /tags/[tag]，没有 /tags 索引页
// 暂不测试标签页
