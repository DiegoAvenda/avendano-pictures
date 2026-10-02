import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { IUser } from '@/types';

interface AuthState {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        setUser: (user) => set({ user }),
        clearUser: () => set({ user: null }),
      }),
      { name: 'auth-storage' }
    )
  )
);
