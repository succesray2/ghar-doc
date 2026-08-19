import axios from 'axios';
import { getStoredRefreshToken, useAuthStore } from './auth-store';

const baseURL = `${process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000'}/api`;

export const apiClient = axios.create({
  baseURL,
  headers: { 'X-Client-Type': 'mobile' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

// Mirrors apps/web/src/lib/api-client.ts's 401-retry-once/de-dupe interceptor.
// The only real difference: web's refresh call rides on an httpOnly cookie the
// browser attaches automatically; here we explicitly read the refresh token
// from SecureStore and send it in the body, since RN has no cookie jar for it.
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
    const refreshToken = await getStoredRefreshToken();
    if (!refreshToken) return null;
    const { data } = await axios.post(
      `${baseURL}/auth/refresh`,
      { refreshToken },
      { headers: { 'X-Client-Type': 'mobile' } },
    );
    if (data.accessToken && data.user) {
      useAuthStore.getState().setSession(data.accessToken, data.user, data.refreshToken);
      return data.accessToken;
    }
    return null;
  } catch {
    return null;
  }
}
