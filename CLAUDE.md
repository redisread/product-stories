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
