# Cloudflare 部署指南

本文档详细说明如何将 Product Stories 项目部署到 Cloudflare Pages。

## 目录

- [前置要求](#前置要求)
- [快速开始](#快速开始)
- [详细配置](#详细配置)
- [CI/CD 集成](#cicd-集成)
- [故障排查](#故障排查)

---

## 前置要求

### 1. Cloudflare 账号

- 注册 [Cloudflare](https://dash.cloudflare.com/sign-up) 账号（免费）
- 验证邮箱

### 2. 安装 Wrangler CLI

```bash
# 使用 npm 安装
npm install -g wrangler

# 或使用 npx（推荐）
npx wrangler --version
```

### 3. 登录 Wrangler

```bash
npx wrangler login
```

浏览器会打开授权页面，点击"允许"完成授权。

### 4. 项目准备

确保项目可以正常构建：

```bash
npm install
npm run build
```

---

## 快速开始

### 方式一：使用 Wrangler CLI（推荐）

#### 1. 构建项目

```bash
npm run build
```

#### 2. 部署到 Cloudflare Pages

```bash
# 首次部署
npx wrangler pages deploy dist --project-name=product-stories

# 后续部署（使用相同配置）
npx wrangler pages deploy dist
```

#### 3. 访问网站

部署完成后，命令行会显示访问地址：
```
✨ Deployment complete!
🌐 View your site at: https://product-stories.pages.dev
```

### 方式二：Git 集成自动部署

#### 1. 推送代码到 GitHub

```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

#### 2. Cloudflare Dashboard 配置

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 点击左侧菜单 **Pages**
3. 点击 **Create a project**
4. 选择 **Connect to Git**
5. 选择 GitHub 仓库 `product-stories`
6. 配置构建设置：
   - **Framework preset**: Next.js
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
7. 点击 **Save and Deploy**

---

## 详细配置

### 1. Wrangler 配置

创建 `wrangler.toml` 文件：

```toml
name = "product-stories"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

# 构建配置
[build]
command = "npm run build"

# 静态资源
[site]
bucket = "./dist"

# 环境变量（生产环境）
[env.production]
vars = { ENVIRONMENT = "production" }

# 环境变量（预览环境）
[env.preview]
vars = { ENVIRONMENT = "preview" }
```

### 2. Next.js 配置适配

修改 `next.config.ts`：

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Cloudflare Pages 不支持 headers()，移除或注释掉
  // async headers() { ... }

  // 重定向配置保留
  async redirects() {
    return [
      {
        source: '/story/:slug*',
        destination: '/stories/:slug*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

### 3. 环境变量配置

创建 `.env.production`：

```env
NEXT_PUBLIC_SITE_URL=https://product-stories.pages.dev
```

**在 Cloudflare Dashboard 中设置环境变量：**

1. 进入 **Pages** > 你的项目
2. 点击 **Settings** > **Environment variables**
3. 添加变量：
   - `NEXT_PUBLIC_SITE_URL`: `https://your-domain.pages.dev`

### 4. 自定义域名（可选）

#### 方式一：Dashboard 配置

1. 进入 **Pages** > 你的项目 > **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入域名（如 `stories.yourdomain.com`）
4. 按提示添加 DNS 记录
5. 等待 SSL 证书自动签发

#### 方式二：Wrangler CLI

```bash
npx wrangler pages domain add product-stories stories.yourdomain.com
```

### 5. 构建输出目录

确保构建输出到 `dist` 目录：

```json
// package.json
{
  "scripts": {
    "build": "next build",
    "build:cf": "next build"
  }
}
```

```typescript
// next.config.ts
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  // ...
};
```

---

## CI/CD 集成

### GitHub Actions 自动部署

创建 `.github/workflows/deploy-cloudflare.yml`：

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_SITE_URL: ${{ secrets.NEXT_PUBLIC_SITE_URL }}

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: product-stories
          directory: dist
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
          wranglerVersion: '3'
```

### 配置 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

1. `CLOUDFLARE_ACCOUNT_ID`
   - 在 Cloudflare Dashboard 右侧找到 Account ID

2. `CLOUDFLARE_API_TOKEN`
   - 访问 [API Tokens](https://dash.cloudflare.com/profile/api-tokens)
   - 创建 Token，权限选择：
     - **Cloudflare Pages**: Edit
     - **Account**: Read

3. `NEXT_PUBLIC_SITE_URL`
   - 你的生产环境 URL

---

## 故障排查

### 常见问题

#### 1. 构建失败

**问题**：`Error: next build failed`

**解决**：
```bash
# 清除缓存重新构建
rm -rf .next dist
npm run build
```

#### 2. 图片不显示

**问题**：Next.js Image 组件在 Cloudflare 上无法优化

**解决**：
```typescript
// next.config.ts
images: {
  unoptimized: true,
}
```

#### 3. API 路由 404

**问题**：静态导出不支持 API 路由

**解决**：
- 方案一：改为 Edge Function
- 方案二：在客户端实现搜索功能
- 方案三：使用 Cloudflare Workers 单独部署 API

#### 4. OG 图片生成失败

**问题**：动态 OG 需要服务器运行时

**解决**：
- 方案一：使用 Edge Function
- 方案二：使用静态 OG 图片

#### 5. 环境变量不生效

**问题**：`process.env.XXX` 为 undefined

**解决**：
- 确保变量名以 `NEXT_PUBLIC_` 开头（客户端可用）
- 在 Cloudflare Dashboard 重新设置环境变量
- 重新部署

### 查看日志

```bash
# 查看部署日志
npx wrangler pages deployment tail

# 查看实时日志
npx wrangler pages deployment tail --project-name=product-stories
```

### 回滚部署

在 Cloudflare Dashboard：
1. 进入 **Pages** > 你的项目
2. 点击 **Deployments**
3. 找到要回滚的版本
4. 点击 **...** > **Rollback to this deployment**

或使用 Wrangler：
```bash
# 查看部署历史
npx wrangler pages deployment list

# 回滚到指定版本
npx wrangler pages deployment rollback <deployment-id>
```

### 性能优化

#### 1. 启用缓存

在 `_routes.json` 中添加缓存规则：

```json
{
  "version": 1,
  "routes": [
    {
      "src": "/images/(.*)",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/_next/static/(.*)",
      "headers": {
        "Cache-Control": "public, max-age=31536000, immutable"
      }
    }
  ]
}
```

#### 2. 压缩资源

确保 `next.config.ts` 中开启压缩：

```typescript
const nextConfig = {
  compress: true,
  // ...
};
```

#### 3. 图片优化

- 使用 WebP 格式
- 使用适当的图片尺寸
- 启用懒加载

---

## 生产环境检查清单

部署前确认：

- [ ] `next.config.ts` 已设置 `output: 'export'`
- [ ] `next.config.ts` 已设置 `images.unoptimized: true`
- [ ] `.env.production` 包含正确的 `NEXT_PUBLIC_SITE_URL`
- [ ] 所有 API 路由已适配 Edge Runtime 或改为客户端实现
- [ ] OG 图片生成已适配
- [ ] 本地构建测试通过 (`npm run build`)
- [ ] 所有页面可正常访问
- [ ] 图片加载正常
- [ ] 搜索功能正常
- [ ] RSS Feed 可访问

部署后确认：

- [ ] 生产环境 URL 可访问
- [ ] 自定义域名（如有）可访问
- [ ] HTTPS 证书正常
- [ ] 环境变量生效
- [ ] 性能测试通过

---

## 参考资源

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Next.js 静态导出](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)
- [Fumadocs 部署指南](https://fumadocs.vercel.app/docs/ui/manual-installation)

---

**提示：** 遇到问题请在项目中提交 Issue 或查阅 [Cloudflare 社区](https://community.cloudflare.com/)。
