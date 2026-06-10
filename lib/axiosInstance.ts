import axios from "axios";
import { env } from "./env";
import { disconnectSocket } from "./socket";

const TOKEN_COOKIE = "accessToken";

function readTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${TOKEN_COOKIE}=([^;]+)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

const axiosInstance = axios.create({
  baseURL: `${env.NEXT_PUBLIC_API_URL}/api/v1`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the JWT from the cookie. (We used to read from localStorage — moved
// to a single source of truth so the token is one place instead of two.)
axiosInstance.interceptors.request.use((config) => {
  const token = readTokenFromCookie();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 401 handler — clears the session and redirects to /login. Skipped for the
// auth endpoints themselves so a bad password just toasts instead of redirecting.
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register"];

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url: string = error?.config?.url ?? "";
    const isAuthCall = AUTH_ENDPOINTS.some((p) => url.includes(p));

    if (status === 401 && !isAuthCall && typeof window !== "undefined") {
      // Clear cookie + legacy localStorage so the next page render is unambiguous.
      document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
      try {
        localStorage.removeItem("accessToken");
      } catch {
        /* localStorage blocked, ignore */
      }
      // Tear down the realtime connection so the stale token can't keep
      // receiving project events.
      disconnectSocket();
      // Avoid a loop if we're already on /login.
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
