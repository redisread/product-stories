# product-stories

## Project

Static Astro site for product story case studies. Content lives in YAML files under `content/products/` and is rendered into a searchable storytelling site deployed to Cloudflare Pages.

## Stack

- Astro 6, static output
- MDX integration for rich content
- Tailwind CSS v4 via Vite plugin
- Content collections in `src/content.config.ts`
- Playwright E2E tests
- Cloudflare Pages deployment, not Workers

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
npm run format:check
npm run test:e2e
npm run test:e2e:ui
```

Use Node from `package.json` engines: `>=22.12.0`.

## Deployment

- Canonical target: Cloudflare Pages project `product-stories`
- Production URL: `https://product-stories.pages.dev`
- Deploy workflow: `.github/workflows/deploy-cloudflare.yml`
- E2E workflow: `.github/workflows/e2e-tests.yml`
- Lighthouse workflow: `.github/workflows/lighthouse.yml`

Do not recreate a Worker service named `product-stories`. This project has been converged to Pages-only deployment.

## CI/CD 与部署约定

### 修改工作流的规则

修改 `.github/workflows/` 下的任何工作流前，必须说明：
- **影响范围**：哪些 PR 或部署会受影响
- **验证方式**：如何验证改动有效（本地测试、在功能分支测试）
- **回滚方式**：如果出问题，如何快速恢复

不要在工作流中引入不必要的复杂性。每个 step 都要有明确目的。

### 部署验证

部署到生产后，必须验证以下路径：
- 首页能正常加载（`curl -I https://product-stories.pages.dev`）
- 健康检查通过（`curl https://product-stories.pages.dev/health.json`）
- 至少一个产品详情页能正常访问
- 搜索 / 筛选功能正常（如果有）
- Cloudflare Web Analytics 数据正常上报

验证结果同步到对应的 PR 或 Issue。

### 环境管理

当前只有一个环境：
- **生产**：`https://product-stories.pages.dev`，由 `main` 分支自动部署

如果需要预发环境（preview deployments），使用 Cloudflare Pages 的 Pull Request 预览功能，不要创建额外的部署工作流。

### 监控与告警

- **部署状态**：GitHub Actions 工作流状态
- **站点可用性**：Cloudflare Dashboard → Pages 项目
- **Web Analytics**：Cloudflare Dashboard → Web Analytics（通过 Dashboard 注入，不要改代码）
- **构建性能**：GitHub Actions 工作流日志中的 build time

目前没有专门的告警系统。如果站点挂掉，依赖 Cloudflare 的状态监控或用户反馈。

## Content Model

- Product stories are YAML files in `content/products/`
- Schema and validation logic are in `src/content.config.ts`
- Content helper logic is in `src/lib/stories.ts`
- Content maintenance docs live in `docs/ADDING_STORIES.md`

When adding or changing stories, run the content validation scripts if present, then build the site.

## Verification

Before opening or merging a PR, run the relevant subset:

```bash
npm run build
npm run lint
npm run format:check
npm run test:e2e
```

For deployment or monitoring changes, also verify:

```bash
curl -I https://product-stories.pages.dev
curl -I https://product-stories.pages.dev/health.json
```

## 需求与功能规划

新功能、新需求、内容模型变更在进入开发前，必须走以下流程：

### 1. 需求澄清（product-manager Agent）

用 `product-manager` Agent 做需求澄清和功能规划，输出结构化 PRD。

### 2. UI/UX 设计（ui-ux-designer Agent）

PRD 确认后，用 `ui-ux-designer` Agent 做视觉和交互设计，输出：
- 视觉规范（色彩、字体、间距、圆角、阴影）
- 组件设计（状态、交互反馈、响应式适配）
- 页面布局（信息架构、网格系统、导航结构）
- 交互动效（转场、组件动效、参数）
- 可访问性（对比度、焦点、键盘导航）

该 Agent 拥有 `ui-ux-pro-max` 技能，提供 50+ 设计风格、161 色彩方案、57 字体组合、99 条 UX 准则。

### 3. 技术方案（fullstack-architect Agent）

PRD + 设计稿确认后，用 `fullstack-architect` Agent 做技术设计，输出：
- 技术架构与关键决策
- 模块划分与文件结构
- 接口设计（内容模型、组件 Props、页面路由、辅助函数）

### 4. 开发与交付

- PRD + 设计稿 + 技术设计都确认后，再拆开发任务
- 文档关联到对应的 PR 或 Issue，便于回溯

### 例外

以下情况不需要走这个流程：
- 临时 bug 修复
- 文案调整、样式微调
- 依赖升级、构建配置调整
- 重构范围局限在单文件内

### 技术优化与债务治理

技术优化和技术债务治理由 `fullstack-architect` Agent 主导：
- 每个大版本或重大功能前，做一轮债务评估
- 治理计划按短期 / 中期 / 长期分阶段
- 小债务顺手清，大债务排计划，不要把治理和交付对立

## PR / Review Rules

- Keep PRs small and reviewable.
- Include changed scope, commands run, CI status, and rollback notes.
- Do not bypass Lighthouse, E2E, format, or bundle-size checks to make CI pass.
- For Cloudflare changes, distinguish Pages config from Workers config.

## Known Gotchas

- Cloudflare Web Analytics is enabled through Dashboard injection. Validate with the beacon script or browser Network, not by probing `/cdn-cgi/rum` alone.
- Lighthouse PR comments should use the action output links; do not assume `.lighthouseci/results.json` exists.
- `npm audit --audit-level=high` is currently non-blocking in CI.
- Bundle size warning threshold is 5 MB and failure threshold is 10 MB in the deploy workflow.
- There may be dirty worktree changes from other agents. Do not revert unrelated edits.
