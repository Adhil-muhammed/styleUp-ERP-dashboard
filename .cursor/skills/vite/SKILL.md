---
name: vite
description: Vite 8 build tooling reference for StyleUp ERP — Rolldown, plugins, env vars, and project vite.config.ts
---

# Vite

> Verify against https://vite.dev/ before relying on this for a new minor/major upgrade — last verified against **vite@8.1.3** on 2026-07-04.

## Version pinned

| Package | Version |
|---------|---------|
| `vite` | 8.1.3 |
| `@vitejs/plugin-react` | 6.0.3 |
| `vite-tsconfig-paths` | 6.1.1 |
| `vite-plugin-svgr` | 5.2.0 |
| `@tailwindcss/vite` | 4.3.2 |

## Core concepts (Vite 8)

- **Rolldown bundler:** Vite 8 uses a single Rust-based Rolldown bundler for dev and production (replaces the Vite 7 esbuild-dev + Rollup-prod split). Builds are significantly faster; most Rollup-compatible plugins still work via a compatibility layer.
- **Native tsconfig paths:** Vite 8 adds opt-in `resolve.tsconfigPaths: true` in `vite.config.ts`. It reads `compilerOptions.paths` from tsconfig (not top-level `paths`). Small performance cost; not enabled by default.
- **This project uses both:** `vite-tsconfig-paths` plugin **and** could migrate to native `resolve.tsconfigPaths`. Dev server may log a notice suggesting removal of the plugin — both work today.
- **ESM-only:** `"type": "module"` in package.json; config is `vite.config.ts` with ESM imports.
- **Node requirement:** 20.19+ or 22.12+.

## Project config

Actual [`vite.config.ts`](../../vite.config.ts):

```ts
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgr(), tailwindcss()],
});
```

| Plugin | Purpose |
|--------|---------|
| `@vitejs/plugin-react` 6.x | JSX/TSX, React Refresh (Oxc-based in v6), automatic JSX runtime |
| `vite-tsconfig-paths` | Resolves `@/*` → `src/*` from tsconfig |
| `vite-plugin-svgr` | Import SVGs as React components; types via `src/vite-env.d.ts` |
| `@tailwindcss/vite` | Tailwind v4 CSS-first — **not** PostCSS |

## Environment variables

- Only vars prefixed `VITE_` are exposed to client code via `import.meta.env`.
- Runtime validation: [`src/shared/config/env.ts`](../../src/shared/config/env.ts) parses with Zod 4.
- Do **not** read secrets without `VITE_` prefix in client bundles.

```ts
import { env } from '@/shared/config/env';
// env.VITE_API_URL — typed, validated at startup
```

Copy [`.env.example`](../../.env.example) → `.env` for local dev.

## Dev vs build

| Concern | Dev (`pnpm dev`) | Build (`pnpm build`) |
|---------|------------------|----------------------|
| Bundler | Rolldown (HMR) | Rolldown (production) |
| Assets in `public/` | Served at `/` root | Copied to `dist/` as-is |
| Assets in `src/` | Processed on import | Hashed filenames in `dist/assets/` |
| TypeScript | `tsc -b` runs separately before `vite build` | Same |
| Config changes | **Restart dev server required** | N/A |

Scripts: `"dev": "vite"`, `"build": "tsc -b && vite build"`, `"preview": "vite preview"`.

## Optional native paths migration

Future simplification (not applied yet):

```ts
export default defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [react(), svgr(), tailwindcss()], // drop vite-tsconfig-paths
});
```

Requires `paths` inside `compilerOptions` in `tsconfig.app.json` (already configured).

## Common mistakes

- Forgetting `VITE_` prefix on new env vars
- Importing Node-only modules (`fs`, `path`) into client code
- Editing `vite.config.ts` without restarting dev server
- Putting `paths` at tsconfig root without `compilerOptions` (ignored by native resolver)
- Adding PostCSS + `tailwindcss` CLI when `@tailwindcss/vite` already handles Tailwind

## Breaking changes (Vite 7 → 8)

- Rolldown replaces Rollup for production builds
- Built-in `resolve.tsconfigPaths` available (plugin no longer strictly required)
- `@vitejs/plugin-react` v6 uses Oxc for refresh (smaller install, no Babel by default)

## Official docs

- https://vite.dev/
- https://vite.dev/config/
- https://vite.dev/blog/announcing-vite8
- https://vite.dev/config/shared-options#resolve-tsconfigpaths
