import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface AuthState {
  user: any | null;
  setUser: (user: any) => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logOut: () => set({ user: null }),
  })),
);
