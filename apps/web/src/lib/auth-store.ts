import { create } from 'zustand';
import type { UserDto } from '@ghar-doc/shared';

interface AuthState {
  accessToken: string | null;
  user: UserDto | null;
  setSession: (accessToken: string, user: UserDto) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setSession: (accessToken, user) => set({ accessToken, user }),
  clearSession: () => set({ accessToken: null, user: null }),
}));
