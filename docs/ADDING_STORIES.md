# 新增产品故事指南

本文档详细说明如何在 Product Stories 项目中发布新的产品故事。

## 快速开始（5 分钟上手）

```bash
# 1. 创建故事文件
vim content/stories/your-product/story-name.mdx

# 2. 编写内容（参考模板）
# ...

# 3. 本地预览
npm run dev

# 4. 访问 http://localhost:3000/stories 查看效果
```

---

## 前置准备

### 目录结构

```
content/
├── stories/                    # 故事内容目录
│   ├── product-a/             # 产品 A 的故事
│   │   ├── story-1.mdx
│   │   └── story-2.mdx
│   └── product-b/             # 产品 B 的故事
│       └── story-3.mdx
└── products/                   # 产品元数据（可选）
    ├── product-a.yml
    └── product-b.yml
```

### 如果是新产品

如果是首次为该产品的创建故事，需要先创建产品目录：

```bash
mkdir -p content/stories/your-product-name
```

**命名规范：**
- 使用小写字母
- 单词间用连字符分隔（kebab-case）
- 简短且具有识别性

**示例：**
- ✅ `design-system`（推荐）
- ✅ `mobile-app`
- ❌ `Design System`（不要大写）
- ❌ `mobile_app`（不要用下划线）

---

## 创建故事文件

### 文件名规范

```
content/stories/{product-name}/{story-slug}.mdx
```

**示例：**
```
content/stories/design-system/introducing-tokens.mdx
content/stories/mobile-app/launch-journey.mdx
```

### 文件模板

```mdx
---
title: "文章标题"
date: 2025-02-20
products: ["Product Name"]
cover: "https://images.unsplash.com/photo-xxx?w=800&q=80"
readingTime: "8 min read"
description: "一句话描述文章核心内容"
author: "作者名"
tags: ["tag1", "tag2"]
featured: true
---

# 文章标题

开篇段落，简要介绍文章主题和背景。

## 第一部分

正文内容...

## 第二部分

正文内容...

## 总结

总结全文要点。

---

*作者：作者名 | 发布于 2025-02-20*
```

---

## Frontmatter 字段说明

> 校验由 Astro Content Collections + Zod 实现，违规会在 `npm run build` / `astro check` 阶段直接报错。

### 必填字段

| 字段 | 类型 | 校验规则 | 示例 |
|------|------|------|------|
| `title` | string | 1–80 字符 | `"Design Tokens 实践"` |
| `date` | string | `YYYY-MM-DD`，2000-01-01 ≤ date ≤ 今日 + 1 天容差 | `"2025-02-20"` |
| `products` | array | 至少 1 个，每项非空字符串 | `["Design System", "Web"]` |

### 可选字段

| 字段 | 类型 | 校验规则 | 示例 |
|------|------|------|------|
| `cover` | string | 必须是合法 URL | Unsplash 图片链接 |
| `readingTime` | string | — | `"8 min read"` |
| `description` | string | — | `"一句话描述..."` |
| `author` | string | — | `"张三"` |
| `tags` | array | 最多 8 个，每项非空字符串 | `["design", "css"]` |
| `featured` | boolean | 默认 false | `true` / `false` |
| `draft` | boolean | 默认 false | `true` / `false` |

### 字段详解

#### title
- 文章标题，显示在卡片和详情页
- 建议控制在 30 字以内（schema 上限 80 字符）

#### date
- 发布日期，格式：`YYYY-MM-DD`
- 影响文章排序（最新优先）
- 校验区间：2000-01-01 ≤ date ≤ 今日 + 1 天（防止误填未来或过早日期）

#### products
- 关联的产品列表，支持多个
- 用于产品筛选功能
- 产品名称会显示在文章卡片上

```yaml
# 单个产品
products: ["Design System"]

# 多个产品
products: ["Web Platform", "Mobile App"]
```

#### cover
- 封面图片 URL
- **必须是合法 URL**（不支持本地相对路径，如需本地图请用 `/images/...` 形式的绝对路径）
- **推荐：** 使用 Unsplash 图片（免费、高质量）
- 图片比例建议 2:1 或 16:9
- 尺寸建议 800px 宽度

```yaml
# Unsplash 图片（推荐）
cover: 'https://images.unsplash.com/photo-xxx?w=800&q=80'
```

#### readingTime
- 预估阅读时长
- 格式：`"X min read"`

#### description
- 文章摘要，显示在卡片和 SEO 元数据中
- 建议 100-150 字（schema 不强制，但偏短的会单独治理）

#### author
- 作者名，显示在文章头部

#### tags
- 文章标签，用于内容分类
- 建议 2-5 个标签（schema 上限 8 个）

#### featured
- 设为 `true` 会在首页精选区域展示
- 建议最多 3 篇精选文章

#### draft
- 设为 `true` 文章不会显示在列表中
- 适用于未完成的内容

---

## 内容编写

### Markdown 语法支持

标准 Markdown 语法全部支持：

```mdx
# 一级标题
## 二级标题
### 三级标题

**粗体** *斜体* ~~删除线~~

- 无序列表
- 列表项
  - 嵌套列表

1. 有序列表
2. 列表项

> 引用块
> 引用内容

[链接文本](https://example.com)

![图片描述](https://example.com/image.jpg)

| 表头1 | 表头2 |
|-------|-------|
| 内容1 | 内容2 |
```

### 代码块

````mdx
```javascript
// JavaScript 代码
const greeting = "Hello World";
console.log(greeting);
```

```css
/* CSS 代码 */
.card {
  padding: 1rem;
  border-radius: 0.5rem;
}
```
````

### 注意事项

1. **图片路径**
   - 外部图片：直接使用完整 URL
   - 本地图片：放入 `public/images/` 目录，使用相对路径 `/images/xxx.jpg`

2. **标题层级**
   - 文章标题使用 `#`（h1）
   - 章节标题使用 `##`（h2）
   - 小节标题使用 `###`（h3）

3. **特殊字符**
   - YAML frontmatter 中使用双引号包裹包含特殊字符的字符串

---

## 本地预览

### 启动开发服务器

```bash
npm run dev
```

### 访问页面

| 页面 | URL |
|------|-----|
| 首页 | http://localhost:3000 |
| 故事列表 | http://localhost:3000/stories |
| 你的故事 | http://localhost:3000/stories/{product}/{slug} |

### 实时热更新

修改 `.mdx` 文件后，页面会自动刷新，无需重启服务器。

---

## 发布部署

### 本地构建测试

```bash
npm run build
```

确保没有错误后再部署。

### 部署方式

#### Vercel（推荐）

1. 推送代码到 GitHub
2. Vercel 自动触发构建部署
3. 访问生产环境 URL 查看

```bash
git add .
git commit -m "add: 新增产品故事 - 故事标题"
git push
```

#### 静态导出

如需静态托管：

```bash
# 修改 next.config.ts 添加 output: 'export'
npm run build
# 输出在 dist/ 目录
```

---

## 最佳实践

### 命名规范

**目录名：**
- 小写字母
- 连字符分隔
- 简短有意义

**文件名：**
- 小写字母
- 连字符分隔
- 描述性强
- 使用 `.mdx` 扩展名

**示例：**
```
content/stories/
├── design-system/
│   ├── introducing-tokens.mdx
│   ├── color-palette-guide.mdx
│   └── typography-system.mdx
├── mobile-app/
│   ├── ios-redesign.mdx
│   └── android-performance.mdx
└── platform/
    └── api-v2-migration.mdx
```

### 封面图片选择

1. **使用 Unsplash（推荐）**
   - 免费商用
   - 高质量图片
   - 访问 https://unsplash.com 搜索关键词
   - 复制图片 URL，添加 `?w=800&q=80` 参数

2. **使用本地图片**
   - 放入 `public/images/stories/`
   - 引用路径：`/images/stories/filename.jpg`
   - 建议尺寸：1200x600 像素
   - 建议格式：JPG 或 WebP

### SEO 优化

1. **标题**：包含关键词，吸引点击
2. **描述**：准确概括内容，150 字以内
3. **标签**：使用相关关键词标签
4. **日期**：保持更新，旧内容可更新日期

### 内容质量

1. **开篇**：第一段点明主题和价值
2. **结构**：使用小标题分段，层次分明
3. **图片**：适当插入图片增强可读性
4. **代码**：技术文章包含代码示例
5. **总结**：末尾总结要点

---

## 常见问题

### Q: 文章没有显示在列表中？

检查：
1. `draft` 字段是否设为 `true`
2. 文件是否在 `content/stories/` 目录下
3. 文件扩展名是否为 `.mdx`
4. 重新运行 `npm run dev`

### Q: 封面图片不显示？

检查：
1. 图片 URL 是否可访问
2. 本地图片是否在 `public/` 目录下
3. 路径是否正确（以 `/` 开头表示 public 目录）

### Q: 如何修改已发布的故事？

直接编辑 `.mdx` 文件，保存后自动更新。

### Q: 可以删除故事吗？

删除 `.mdx` 文件，重新部署即可。

### Q: 如何调整文章排序？

修改 `date` 字段，日期越新排序越靠前。

### Q: 支持哪些 Markdown 扩展？

- GitHub Flavored Markdown
- 表格
- 任务列表 `- [ ]`
- 代码块语法高亮

---

## 示例：完整的故事文件

```mdx
---
title: "Design Tokens 实践：从混乱到统一"
date: 2025-02-15
products: ["Design System", "Web Platform"]
cover: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80"
readingTime: "12 min read"
description: "如何通过 Design Tokens 实现跨平台设计一致性，并大幅提升开发效率。本文分享了从引入到落地的完整实践。"
author: "张明"
tags: ["design-system", "tokens", "css"]
featured: true
---

# Design Tokens 实践：从混乱到统一

在我们的产品生态中，曾经面临一个严重的问题：**设计不一致**。不同的产品、不同的平台，甚至同一个产品的不同页面，都可能使用略有差异的颜色、间距或字体大小。

## 问题的起源

随着产品线的扩展，我们的设计债务逐渐累积...

## 解决方案

### 什么是 Design Tokens？

Design Tokens 是设计系统中的原子化变量...

```css
/* Primitive Tokens */
--color-blue-500: #3b82f6;

/* Semantic Tokens */
--color-primary: var(--color-blue-500);
```

### 实施步骤

1. 定义 Primitive 层
2. 建立 Semantic 层
3. 组件层应用

## 成果与收益

实施三个月后，我们看到了显著的改进：

| 指标 | 改进前 | 改进后 | 提升 |
|------|--------|--------|------|
| 设计一致性 | 60% | 95% | +58% |
| 开发效率 | - | - | +40% |

## 总结

Design Tokens 不仅解决了设计一致性问题...

---

*作者：张明 | 发布于 2025-02-15*
```

---

## 相关文档

- [项目 README](../README.md)
- [Fumadocs 文档](https://fumadocs.vercel.app)
- [MDX 文档](https://mdxjs.com)

---

**提示：** 有任何问题请在项目中提交 Issue 或联系维护者。
