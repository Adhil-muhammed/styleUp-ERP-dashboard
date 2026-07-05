# Installed Package Versions

Generated from `pnpm list --depth 0` on scaffold completion.

## CalendarKit Basic + React 19

- **calendarkit-basic@1.1.0** peer range includes React 19 (`^18.0.0 || ^19.0.0`)
- Replaced FullCalendar 6.1.21 (removed July 2026)

## shadcn/ui

- **Style:** `radix-nova` (CLI default via `-p nova` preset)
- **Base color:** neutral
- **Tailwind:** v4 CSS-first (`@tailwindcss/vite`, no `tailwind.config.ts`)
- **Animation:** `tw-animate-css` (not deprecated `tailwindcss-animate`)

## Production dependencies

| Package | Version |
|---------|---------|
| @casl/ability | 7.0.0 |
| @casl/react | 7.0.0 |
| @fontsource-variable/geist | 5.2.9 |
| calendarkit-basic | 1.1.0 |
| @hookform/resolvers | 5.4.0 |
| @sentry/react | 10.63.0 |
| @tailwindcss/vite | 4.3.2 |
| @tanstack/react-query | 5.101.2 |
| @tanstack/react-table | 8.21.3 |
| @tanstack/react-virtual | 3.14.5 |
| axios | 1.18.1 |
| browser-image-compression | 2.0.2 |
| class-variance-authority | 0.7.1 |
| clsx | 2.1.1 |
| cmdk | 1.1.1 |
| date-fns | 4.4.0 |
| i18next | 26.3.4 |
| i18next-browser-languagedetector | 8.2.1 |
| lucide-react | 1.23.0 |
| radix-ui | 1.6.1 |
| react | 19.2.7 |
| react-dom | 19.2.7 |
| react-dropzone | 15.0.0 |
| react-hook-form | 7.80.0 |
| react-i18next | 17.0.8 |
| react-router-dom | 7.18.1 |
| recharts | 3.9.1 |
| shadcn | 4.13.0 |
| socket.io-client | 4.8.3 |
| tailwind-merge | 3.6.0 |
| tailwindcss | 4.3.2 |
| zod | 4.4.3 |
| zustand | 5.0.14 |

## Dev dependencies

| Package | Version |
|---------|---------|
| @eslint/js | 10.0.1 |
| @tanstack/react-query-devtools | 5.101.2 |
| @types/node | 24.13.2 |
| @types/react | 19.2.17 |
| @types/react-dom | 19.2.3 |
| @vitejs/plugin-react | 6.0.3 |
| eslint | 10.6.0 |
| eslint-config-prettier | 10.1.8 |
| eslint-plugin-react-hooks | 7.1.1 |
| eslint-plugin-react-refresh | 0.5.3 |
| globals | 17.7.0 |
| prettier | 3.9.4 |
| tw-animate-css | 1.4.0 |
| typescript | 6.0.3 |
| typescript-eslint | 8.62.1 |
| vite | 8.1.3 |
| vite-plugin-svgr | 5.2.0 |
| vite-tsconfig-paths | 6.1.1 |

## Peer dependency notes

- `vite-tsconfig-paths` → `tsconfck` expects TypeScript ^5; project uses TypeScript 6.0.3 (warning only, build passes)
