# Product Stories

> 探索改变世界的产品背后的故事

Product Stories 是一个静态网站，讲述知名科技产品（如 Stripe、GitHub、Notion、Discord 等）的创建故事、关键决策和幕后轶事。

**线上地址：** <https://product-stories.pages.dev>

---

## ✨ 特性

- 🚀 **静态生成** - 使用 Astro 框架，构建为纯静态站点
- 📱 **响应式设计** - 适配桌面、平板、手机
-  **全文搜索** - 基于 Fuse.js 的客户端搜索
- 📰 **RSS 订阅** - 支持 RSS/Atom 订阅
- ️ **标签系统** - 按产品和主题分类浏览
- ⚡ **高性能** - Cloudflare Pages 全球 CDN 加速
- 🧪 **自动化测试** - Playwright E2E 测试 + Lighthouse CI

---

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Astro 6.x |
| 样式 | Tailwind CSS 4.x |
| 内容 | MDX (Markdown + JSX) |
| 搜索 | Fuse.js |
| 图标 | Lucide |
| 部署 | Cloudflare Pages |
| CI/CD | GitHub Actions |
| 测试 | Playwright |
| 质量 | ESLint + Prettier |

---

## 📦 快速开始

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
npm run dev
```

访问 <http://localhost:4321>

### 构建生产版本

```bash
npm run build
```

输出目录：`./dist`

### 预览构建结果

```bash
npm run preview
```

---

## 🧞 命令参考

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动本地开发服务器 |
| `npm run build` | 构建生产版本到 `./dist` |
| `npm run preview` | 本地预览构建结果 |
| `npm run lint` | ESLint 代码检查 |
| `npm run lint:fix` | 自动修复 ESLint 问题 |
| `npm run format` | Prettier 格式化代码 |
| `npm run format:check` | 检查代码格式 |
| `npm run test:e2e` | 运行 E2E 测试 |
| `npm run test:e2e:ui` | UI 模式运行 E2E 测试 |
| `npm run lighthouse` | 运行 Lighthouse 性能测试 |

---

## 📁 项目结构

```
product-stories/
├── .github/workflows/       # CI/CD 配置
│   ├── deploy-cloudflare.yml
│   ├── lighthouse.yml
│   └── e2e-tests.yml
├── public/                  # 静态资源
├── src/
│   ├── content/stories/     # 故事内容 (MDX)
│   ├── components/          # Astro 组件
│   ├── layouts/             # 页面布局
│   ├── pages/               # 页面路由
│   ├── styles/              # 全局样式
│   └── utils/               # 工具函数
├── tests/e2e/               # E2E 测试
├── astro.config.mjs         # Astro 配置
├── package.json
├── playwright.config.ts     # Playwright 配置
└── wrangler.toml            # Cloudflare 配置
```

---

## ✍️ 新增故事

详见 [docs/ADDING_STORIES.md](docs/ADDING_STORIES.md)

快速示例：

```bash
# 创建新产品目录
mkdir -p src/content/stories/new-product

# 创建故事文件
# src/content/stories/new-product/my-story.mdx
```

Frontmatter 模板：

```mdx
---
title: "产品名：故事标题"
date: 2026-01-01
products: ["Product Name"]
cover: "https://images.unsplash.com/photo-xxx?w=800&q=80"
readingTime: "12 min read"
description: "一句话描述，包含核心冲突或转折。"
author: "Claude"
tags: ["产品名", "关键词1", "关键词2"]
featured: false
---
```

---

##  部署

### Cloudflare Pages（推荐）

项目已配置 GitHub Actions 自动部署：

1. 推送代码到 `main` 分支
2. GitHub Actions 自动运行：
   - 代码质量检查（ESLint、TypeScript）
   - 安全扫描（npm audit）
   - 构建项目
   - 部署到 Cloudflare Pages

### 手动部署

```bash
npm run build
wrangler pages deploy dist --project-name=product-stories
```

---

## 🧪 测试

### E2E 测试

```bash
# 运行所有测试
npm run test:e2e

# UI 模式（可调试）
npm run test:e2e:ui
```

### Lighthouse 性能测试

```bash
npm run lighthouse
```

性能预算：
- Performance >= 80
- Accessibility >= 90
- SEO >= 90
- Best Practices >= 90

---

## 📊 监控

### Cloudflare-first 监控体系

本项目采用 Cloudflare 原生监控方案：

**1. Cloudflare Web Analytics（自动注入）**
- 在 Cloudflare Pages Dashboard 启用
- 自动收集页面浏览、性能指标
- 无需手动添加代码

**2. GitHub Actions 质量门禁**
- 每次 PR 自动运行：
  - ESLint 代码检查
  - TypeScript 类型检查
  - Lighthouse 性能测试
  - Playwright E2E 测试
  - 依赖安全审计（npm audit）
  - Bundle 大小检查

**3. 健康检查端点**

访问 `/health.json` 查看站点状态：

```json
{
  "status": "healthy",
  "buildTime": "2026-06-14T00:00:00Z",
  "version": "1.0.0"
}
```

**4. 部署观测**

- Cloudflare Pages Dashboard 查看部署历史
- GitHub Actions 查看 CI/CD 运行状态
- 部署失败自动通知（可配置 webhook）

**5. 未来升级路径**

如需更高级监控（边缘计算、API 监控），可迁移到：
- Cloudflare Workers Observability
- Cloudflare RUM（Real User Monitoring）

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

---

## 📄 许可证

MIT License

---

## 🔗 相关链接

- [Astro 文档](https://docs.astro.build)
- [Cloudflare Pages](https://pages.cloudflare.com)
- [Playwright](https://playwright.dev)
