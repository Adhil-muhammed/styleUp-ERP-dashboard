import { z } from 'zod';

const envSchema = z.object({
  VITE_API_URL: z.string().default('http://localhost:3000'),
  VITE_SOCKET_URL: z.string().default('http://localhost:3000'),
  VITE_SENTRY_DSN: z.union([z.string().url(), z.literal('')]).default(''),
  VITE_APP_ENV: z.enum(['development', 'staging', 'production']).default('development'),
});

export const env = envSchema.parse(import.meta.env);

export type Env = z.infer<typeof envSchema>;
