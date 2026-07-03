---
name: typescript
description: TypeScript 6 strict config, path aliases, and typing patterns for StyleUp ERP
---

# TypeScript

> Verify against https://www.typescriptlang.org/docs/ before relying on this for a new minor/major upgrade — last verified against **typescript@6.0.3** on 2026-07-04.

## Version pinned

| Package | Version |
|---------|---------|
| `typescript` | 6.0.3 |

## Strict flags enabled ([`tsconfig.app.json`](../../tsconfig.app.json))

| Flag | Effect |
|------|--------|
| `strict: true` | Enables `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, etc. |
| `noUnusedLocals` | Error on unused local variables |
| `noUnusedParameters` | Error on unused parameters |
| `noFallthroughCasesInSwitch` | Error on switch fallthrough |
| `verbatimModuleSyntax` | Type-only imports must use `import type` |
| `erasableSyntaxOnly` | Restricts TS syntax that doesn't erase cleanly |
| `moduleResolution: bundler` | Matches Vite/bundler resolution |
| `jsx: react-jsx` | Automatic JSX runtime |
| `noEmit: true` | Typecheck only; Vite emits JS |

Project references: root [`tsconfig.json`](../../tsconfig.json) → `tsconfig.app.json` + `tsconfig.node.json`.

## TS 6 specifics

- `baseUrl` + `paths` for `@/*` alias with `"ignoreDeprecations": "6.0"` (baseUrl deprecated in TS 6, still functional).
- Global `JSX` namespace not available when `types` array is omitted — use `React.ReactElement` or `import type { ReactElement } from 'react'`.

## Path alias `@/`

```json
// tsconfig.app.json
"baseUrl": ".",
"paths": { "@/*": ["./src/*"] }
```

Resolved at build time by `vite-tsconfig-paths` (and optionally native Vite 8 `resolve.tsconfigPaths`).

```ts
import { cn } from '@/shared/lib/utils';
```

## Discriminated unions for state

Prefer single `status` field over parallel booleans:

```ts
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: T };
```

TanStack Query already models this via `isPending`, `isError`, `data` — use Query states rather than duplicating.

## Zod → type inference

Standard pattern (see [`env.ts`](../../src/shared/config/env.ts)):

```ts
const envSchema = z.object({ VITE_API_URL: z.string().default('http://localhost:3000') });
export type Env = z.infer<typeof envSchema>;
export const env = envSchema.parse(import.meta.env);
```

Do not hand-write a separate interface mirroring the schema.

## `satisfies` operator

Preserve literal types while checking against a wider type:

```ts
const ROUTES = { dashboard: '/dashboard', bookings: '/bookings' } as const satisfies Record<string, string>;
```

## Common mistakes

- Using `any` instead of `unknown` + narrowing
- Type assertions (`as Foo`) instead of type guards or schema parse
- Duplicating types that Zod schemas already define
- Default exports on non-page modules (see rules)
- Non-null assertion (`!`) without inline justification

## Breaking changes (TS 5 → 6)

- `baseUrl` deprecation (use `ignoreDeprecations: "6.0"` or migrate to subpath imports)
- `erasableSyntaxOnly` enforcement option

## Official docs

- https://www.typescriptlang.org/tsconfig/
- https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html
