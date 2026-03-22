# Agent 操作指南：新增产品故事

本文档供 AI agent 参考，用于快速、规范地新增产品故事文章。

---

## 文件路径规则

```
src/content/stories/{product-name}/{story-slug}.mdx
```

- `{product-name}`：产品名目录，小写 kebab-case，例如 `stripe`、`github-copilot`
- `{story-slug}`：故事文件名，小写 kebab-case，描述故事核心，例如 `young-brothers-redefine-payments`

**如果是新产品，先创建目录：**
```bash
mkdir -p src/content/stories/{product-name}
```

---

## Frontmatter 模板

```mdx
---
title: "标题：副标题"
date: YYYY-MM-DD
products: ["产品名"]
cover: "https://images.unsplash.com/photo-{id}?w=800&q=80"
readingTime: "12 min read"
description: "一句话描述，包含核心冲突或转折，100字以内。"
author: "Claude"
tags: ["产品名", "关键词1", "关键词2", "创始人故事", "产品决策"]
featured: false
---
```

### 字段说明

| 字段 | 必填 | 规范 |
|------|------|------|
| `title` | ✅ | 格式：`"产品名：故事标题"`，含冒号分隔 |
| `date` | ✅ | 格式 `YYYY-MM-DD`，使用今天日期 |
| `products` | ✅ | 产品官方英文名，如 `["Stripe"]`、`["GitHub Copilot"]` |
| `cover` | ✅ | Unsplash 图片，加 `?w=800&q=80` 参数 |
| `readingTime` | ✅ | 固定填 `"12 min read"` |
| `description` | ✅ | 含具体数据或冲突，吸引点击 |
| `author` | ✅ | 固定填 `"Claude"` |
| `tags` | ✅ | 3-6个，首个为产品名，其余为主题关键词（中文） |
| `featured` | ✅ | 默认 `false` |

---

## 内容质量标准

### 结构要求

1. **H1 标题**：与 frontmatter `title` 保持一致
2. **开篇段落**：具体场景或数据切入，不能是泛泛介绍
3. **H2 章节**：3-5个，每章节有独立主题
4. **字数**：1000字以上（中文）

### 内容要求（高分文章的特征）

- **具体数据**：时间节点、金额、用户数、增长率
- **决策背后**：为什么做这个选择，有哪些备选方案被放弃
- **冲突与转折**：失败、争议、意外发现
- **鲜为人知**：不是维基百科能查到的表面信息

### 禁止的写法

- ❌ 嵌套列表结构（用散文叙述代替）
- ❌ 泛泛而谈（"这是一个伟大的产品"）
- ❌ 维基百科式罗列（成立时间、融资轮次堆砌）
- ❌ 无来源的具体数字（如无把握，用模糊表述）

---

## 完整示例

参考现有高质量文章：
- `src/content/stories/stripe/young-brothers-redefine-payments.mdx`（叙事结构）
- `src/content/stories/discord/game-voice-accident.mdx`（转折叙事）
- `src/content/stories/github-copilot/`（技术产品写法）

---

## 新增流程

```
1. 确认产品目录是否存在
   └─ 不存在 → mkdir -p src/content/stories/{product-name}

2. 确认文章文件名不与现有文件重复
   └─ ls src/content/stories/{product-name}/

3. 用 Write 工具创建 .mdx 文件

4. 检查 frontmatter 所有必填字段

5. 确认正文字数 ≥ 1000 字
```

---

## 常见错误

| 错误 | 正确做法 |
|------|----------|
| 路径用 `content/` | 应为 `src/content/stories/` |
| `date` 用引号包裹 | 直接写 `date: 2026-03-23`，不加引号 |
| `products` 用中文 | 必须用英文官方名，如 `["Notion"]` |
| 正文只有列表 | 改为叙事散文 |
| 标题与 H1 不一致 | frontmatter `title` 和正文 `# 标题` 保持相同 |
