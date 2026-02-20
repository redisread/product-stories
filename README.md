# Product Stories - 产品故事集

基于 [Fumadocs](https://fumadocs.vercel.app) + [Next.js](https://nextjs.org) 构建的现代产品故事/案例研究网站。

## 特性

- **现代设计**：参考 Linear、Vercel、Raycast 的审美，干净简洁
- **产品筛选**：支持多产品筛选、搜索、排序
- **响应式布局**：手机 1 列 / 平板 2 列 / 桌面 3 列
- **文章详情**：Fumadocs MDX 渲染，支持目录、代码高亮
- **深色模式**：自动切换，持久化存储
- **搜索功能**：基于 Orama 的全文搜索
- **RSS Feed**：自动生成的 RSS 订阅
- **OG 图片**：动态生成的社交分享图片
- **类型安全**：TypeScript 全程支持

## 技术栈

- **框架**: Next.js 15 (App Router)
- **UI**: Fumadocs UI + Tailwind CSS 4
- **内容**: MDX (Fumadocs MDX)
- **搜索**: Orama (Fumadocs Search)
- **状态**: nuqs (URL 同步)
- **图标**: Lucide React

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 4. 构建

```bash
npm run build
npm start
```

## 项目结构

```
├── app/
│   ├── (docs)/              # 文档/详情路由组
│   │   ├── layout.tsx
│   │   └── stories/[...slug]/
│   ├── (home)/              # 首页路由组
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── stories/             # 列表页
│   ├── api/search/          # 搜索 API
│   ├── feed.xml/            # RSS Feed
│   ├── og/                  # OG 图片生成
│   └── layout.tsx           # 根布局
├── components/
│   ├── story-card.tsx       # 故事卡片
│   ├── product-filter.tsx   # 产品筛选
│   ├── story-search.tsx     # 搜索组件
│   └── ui/                  # shadcn/ui 组件
├── content/
│   ├── stories/             # MDX 故事内容
│   └── products/            # 产品元数据 (YAML)
├── lib/
│   ├── source.ts            # Fumadocs 数据源
│   ├── products.ts          # 产品数据加载
│   └── utils.ts             # 工具函数
├── hooks/
│   └── use-story-filters.ts # 筛选状态管理
└── types/
    └── story.ts             # TypeScript 类型
```

## 添加新故事

> 📖 **[详细指南](docs/ADDING_STORIES.md)** - 包含完整的流程说明、最佳实践和常见问题

### 快速开始

1. 在 `content/stories/` 下创建目录和 `.mdx` 文件

2. 添加 frontmatter:

```mdx
---
title: "故事标题"
date: 2025-02-20
products: ["Product A", "Product B"]
cover: "/images/stories/cover.jpg"      # 可选
readingTime: "8 min read"              # 可选
description: "一句话描述"              # 可选
author: "作者名"                       # 可选
tags: ["tag1", "tag2"]                 # 可选
featured: true                         # 是否精选
draft: false                           # 是否草稿
---

# 故事内容

正文支持 Markdown 语法：

- **粗体**、*斜体*
- 列表、引用、代码块
- 表格、图片
```

3. 重新构建或刷新页面即可看到新故事

## 添加新产品

1. 在 `content/products/` 下创建 `.yml` 文件:

```yaml
id: product-id
name: Product Name
description: 产品描述
color: "#3b82f6"
icon: IconName
order: 1
```

2. 在故事的 frontmatter 中引用产品名称即可

## 自定义配置

### 修改主题色

编辑 `app/globals.css`:

```css
:root {
  --fd-primary: 你的主色;
  --fd-primary-foreground: 你的前景色;
}
```

### 修改导航

编辑 `app/layout.config.ts`:

```ts
export const baseOptions: BaseLayoutProps = {
  nav: {
    title: '你的品牌名',
  },
  links: [
    { text: '链接名', url: '/url' },
  ],
};
```

## 部署

### Vercel（推荐）

```bash
npm i -g vercel
vercel
```

### 静态导出

修改 `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: 'export',
  // ...
}
```

然后构建:

```bash
npm run build
# 输出在 dist/ 目录
```

## 许可证

MIT
