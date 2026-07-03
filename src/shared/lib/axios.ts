import axios from 'axios';

import { env } from '@/shared/config/env';

export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => config,
  (error: unknown) =>
    Promise.reject(error instanceof Error ? error : new Error('Request failed')),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) =>
    Promise.reject(error instanceof Error ? error : new Error('Response failed')),
);
