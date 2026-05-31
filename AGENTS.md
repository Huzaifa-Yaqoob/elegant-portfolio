# AGENTS.md

## Commands

```
bun dev          # start dev server
bun build        # production build
bun preview      # preview production build
bun run lint     # eslint
bun run format   # prettier (ts, tsx, astro)
bun run typecheck  # astro check
bun run deploy     # build + deploy to Cloudflare Workers
```

Run `format` then `lint` then `typecheck` before committing. No test framework is configured.

## Architecture

Single-page Astro site (`src/pages/index.astro`) that composes section components. Each section (hero, services, portfolio, tech stack, testimonials, contact) lives in its own `src/components/<section>/` directory.

- `src/components/ui/` — shadcn/ui primitives (style: base-sera). Add new ones with `bunx shadcn@latest add <name>`.
- `src/content/` — content-driven data loaded via Astro content collections (see `src/content.config.ts`).
  - `config/*.toml` — nav, site, contact-form config (TOML)
  - `section/*.md` — section content (Markdown)
  - `services/*.md` — service entries (Markdown)
  - `portfolio/*.md` — portfolio items (Markdown)
  - `testimonials/*.md` — testimonial entries (Markdown)
- `src/config/*.config.ts` — Zod schemas that validate each content collection.
- `src/lib/gsap.ts` — GSAP entry point. Imports `gsap`, `ScrollTrigger`, `ScrollToPlugin` and registers them. Import from this file, not directly from `gsap`, to ensure plugins are registered.
- `src/lib/utils.ts` — `cn()` helper (clsx + tailwind-merge). Used by all shadcn components.
- `DESIGN.md` — full design system (colors, typography, spacing, layout rules). Refer to this for design decisions.

## Key Conventions

- **Tailwind v4** — configured via `@tailwindcss/vite` plugin. No `tailwind.config.js`. Styles live in `src/styles/global.css`.
- **Prettier** — no semicolons, double quotes, 80 char line width, LF endings. Plugins: `prettier-plugin-astro`, `prettier-plugin-tailwindcss`.
- **Path alias** — `@/*` maps to `./src/*`.
- **Zero radius** — all corners are strictly `0px` per design system.
- **React components** — `.tsx` files in `src/components/ui/`. Astro components use `.astro`.
- **Markdown reviewer required** — whenever creating a new page in `src/pages/`, check if it needs a corresponding markdown reviewer doc at `src/pages/docs/<page-name>.ts`. If none exists, create one that reads from the relevant content collection and returns `Content-Type: text/markdown`. Add it to the Docs section in `src/pages/llms.txt.ts`.

## Gotchas

- Do not import GSAP directly from `"gsap"` — use `@/lib/gsap` to ensure ScrollTrigger/ScrollToPlugin are registered.
- Content collections require schema changes in `src/config/` AND a matching update in `src/content.config.ts`.
- No `.env` files are committed. If env vars are needed, create `.env` locally (gitignored).

## References

- [`PRODUCT.md`](./PRODUCT.md) — Brand identity, content voice, SEO/AEO guidelines, and content templates for AI-assisted content generation.
