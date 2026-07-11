import { create } from "zustand";
import { devtools } from "zustand/middleware";
import Cookies from "js-cookie";
import type { AuthUser } from "@/types";
import { disconnectSocket } from "@/lib/socket";
import posthog from "posthog-js";

const identifyAnalytics = (user: AuthUser | null) => {
  // Best-effort — posthog auto-no-ops when not initialized.
  try {
    if (user) {
      posthog.identify(user.id, { email: user.email, name: user.name });
    } else {
      posthog.reset();
    }
  } catch {
    /* analytics never breaks the app */
  }
};

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => {
      identifyAnalytics(user);
      set({ user });
    },
    logOut: () => {
      identifyAnalytics(null);
      localStorage.removeItem("accessToken");
      Cookies.remove("accessToken", { path: "/" });
      disconnectSocket();
      set({ user: null });
      window.location.href = "/login";
    },
  })),
);
