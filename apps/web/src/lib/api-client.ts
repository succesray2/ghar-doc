import axios from 'axios';
import { useAuthStore } from './auth-store';

const baseURL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:4000'}/api`;

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      refreshPromise ??= refreshSession();
      const newToken = await refreshPromise;
      refreshPromise = null;
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      }
      useAuthStore.getState().clearSession();
    }
    return Promise.reject(error);
  },
);

async function refreshSession(): Promise<string | null> {
  try {
    const { data } = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
    if (data.accessToken && data.user) {
      useAuthStore.getState().setSession(data.accessToken, data.user);
      return data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}
