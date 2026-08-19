import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { UserDto } from '@ghar-doc/shared';

const REFRESH_TOKEN_KEY = 'refreshToken';

interface AuthState {
  accessToken: string | null;
  user: UserDto | null;
  setSession: (accessToken: string, user: UserDto, refreshToken?: string) => void;
  clearSession: () => void;
}

// Mirrors apps/web/src/lib/auth-store.ts: access token stays in memory only.
// The difference is the refresh token — web relies on an httpOnly cookie it
// never touches directly; here we hold it explicitly in SecureStore, since a
// native app has no browser cookie jar to do that for us.
export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setSession: (accessToken, user, refreshToken) => {
    if (refreshToken) {
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken).catch(() => {});
    }
    set({ accessToken, user });
  },
  clearSession: () => {
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY).catch(() => {});
    set({ accessToken: null, user: null });
  },
}));

export async function getStoredRefreshToken(): Promise<string | null> {
  return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}
