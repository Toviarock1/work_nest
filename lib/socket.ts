import { io } from "socket.io-client";
import { env } from "./env";

const TOKEN_COOKIE = "accessToken";

function readTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${TOKEN_COOKIE}=([^;]+)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

const socket = io(env.NEXT_PUBLIC_SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

export const connectSocket = () => {
  const token = readTokenFromCookie();
  if (!token) return;
  // Pass the JWT via the auth payload (not the query string) so it doesn't
  // leak into URLs / proxy logs / browser history.
  socket.auth = { token };
  socket.connect();
};

export const disconnectSocket = () => {
  if (socket.connected) socket.disconnect();
};

export default socket;
