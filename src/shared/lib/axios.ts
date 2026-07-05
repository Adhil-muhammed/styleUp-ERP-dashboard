import axios from 'axios';

import { env } from '@/shared/config/env';
import { useAuthStore } from '@/shared/lib/auth-store';
import { signOut } from '@/shared/lib/sign-out';

export const apiClient = axios.create({
  baseURL: env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) =>
    Promise.reject(error instanceof Error ? error : new Error('Request failed')),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      signOut();
    }

    return Promise.reject(error instanceof Error ? error : new Error('Response failed'));
  },
);
