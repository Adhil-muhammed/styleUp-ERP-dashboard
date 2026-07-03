---
name: tailwind-shadcn
description: Tailwind CSS v4 CSS-first theming and shadcn/ui radix-nova workflow for StyleUp ERP
---

# Tailwind v4 + shadcn/ui

> Verify against https://tailwindcss.com/docs and https://ui.shadcn.com/ before relying on this for a new minor/major upgrade — last verified against **tailwindcss@4.3.2**, **tw-animate-css@1.4.0**, **shadcn@4.13.0** on 2026-07-04.

## Version pinned

| Package | Version |
|---------|---------|
| `tailwindcss` | 4.3.2 |
| `@tailwindcss/vite` | 4.3.2 |
| `tw-animate-css` | 1.4.0 |
| `shadcn` (CLI) | 4.13.0 |
| Style preset | `radix-nova` (neutral base) |

## Tailwind v4 CSS-first

**No `tailwind.config.ts`** — `components.json` sets `"config": ""`.

Entry: [`src/styles/globals.css`](../../src/styles/globals.css):

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";
@import "@fontsource-variable/geist";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* maps CSS variables → Tailwind utilities */
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... shadcn neutral tokens (OKLCH) */
}

.dark {
  --background: oklch(0.145 0 0);
  /* ... dark overrides */
}
```

Vite plugin in [`vite.config.ts`](../../vite.config.ts): `@tailwindcss/vite` — **not** PostCSS + `autoprefixer`.

## Design tokens

- Add/modify tokens in `:root` / `.dark` and map in `@theme inline`
- Use semantic utilities: `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`
- White-label prep: commented `--merchant-*` block under `[data-merchant-theme]` (structure only)

## Animation

Use **`tw-animate-css`** — `@import "tw-animate-css"` in globals.css.
**Do not** install deprecated `tailwindcss-animate`.

## shadcn/ui workflow

Config: [`components.json`](../../components.json)

```json
{
  "style": "radix-nova",
  "tailwind": { "config": "", "css": "src/styles/globals.css", "baseColor": "neutral" },
  "aliases": {
    "ui": "@/shared/components/ui",
    "utils": "@/shared/lib/utils"
  }
}
```

Add components:

```bash
pnpm dlx shadcn@latest add button input dialog form
```

Generated files land in **`src/shared/components/ui/`**.

Merge classes with `cn()` from [`src/shared/lib/utils.ts`](../../src/shared/lib/utils.ts):

```tsx
import { cn } from '@/shared/lib/utils';
<div className={cn('flex gap-2', className)} />
```

## Dark mode

Class strategy: `.dark` on `<html>` via [`theme-provider.tsx`](../../src/shared/lib/theme-provider.tsx).

```css
@custom-variant dark (&:is(.dark *));
```

Use `dark:` variant utilities — no separate dark-only component variants.

## Check before creating primitives

Existing UI in `src/shared/components/ui/` (e.g. `button.tsx`). Run shadcn add before hand-rolling Input, Dialog, Select, etc.

## Common mistakes

- Creating `tailwind.config.ts` for theme tokens (v4 uses CSS)
- Installing `tailwindcss-animate` instead of `tw-animate-css`
- Arbitrary values (`w-[137px]`) when semantic token exists
- PostCSS pipeline alongside `@tailwindcss/vite` (redundant)
- Hand-rolling Button/Input when shadcn component exists
- Editing generated shadcn files heavily — prefer composition/wrappers

## Breaking changes (Tailwind 3 → 4)

- CSS-first config (`@import "tailwindcss"`) replaces `@tailwind` directives
- `@theme` / `@theme inline` replaces JS theme extension
- Vite plugin preferred over PostCSS plugin for this stack

## Official docs

- https://tailwindcss.com/docs/installation/using-vite
- https://tailwindcss.com/docs/theme
- https://ui.shadcn.com/docs/installation/vite
- https://ui.shadcn.com/docs/components
