# StyleUp ERP Dashboard

Admin dashboard for **StyleQuest** — the salon and beauty booking platform. This frontend is scaffolding only: feature folders, routing, providers, and shared UI primitives are in place; business logic and API integration are not implemented yet.

## Prerequisites

- Node.js 20.19+ or 22.12+
- [pnpm](https://pnpm.io/) (package manager)

## Setup

```bash
pnpm install
cp .env.example .env
```

Edit `.env` with your environment values (API URL, socket URL, optional Sentry DSN).

## Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | Type-check and production build |
| `pnpm lint` | Run ESLint |
| `pnpm preview` | Preview production build |
| `pnpm format` | Format with Prettier |

## Folder structure

```
src/
├── app/                  # App shell, router, providers
├── features/             # 19 feature modules (feature-based)
│   └── <module>/
│       ├── components/
│       ├── hooks/
│       ├── api/
│       ├── types/
│       └── index.ts
├── shared/
│   ├── components/       # UI (shadcn), layout, data-table, charts, etc.
│   ├── hooks/
│   ├── lib/              # axios, query-client, casl, merchant context, utils
│   ├── config/           # env, routes, permissions, feature-flags
│   └── types/
├── locales/              # en/ and ml/ i18n namespaces
├── styles/               # Tailwind v4 globals.css
└── assets/
```

## Architecture notes

- **Routing:** React Router with lazy-loaded feature pages behind `AppShell` layout
- **State:** TanStack Query (server state) + Zustand (client state, e.g. merchant scope)
- **UI:** shadcn/ui (radix-nova preset, neutral theme) + Tailwind CSS v4
- **Auth/permissions:** CASL ability stubs (not wired)
- **Multi-tenancy prep:** `MerchantProvider` + Zustand merchant store (empty logic)

The backend is a separate service — this repo contains no API wiring beyond an axios instance placeholder.

## Pinned versions

See [VERSIONS.md](./VERSIONS.md) for exact dependency versions.
