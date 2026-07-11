import { io } from "socket.io-client";
import { getSocketUrl } from "./backendTarget";

const TOKEN_COOKIE = "accessToken";

function readTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${TOKEN_COOKIE}=([^;]+)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

// URL is read via the runtime override layer; the socket is autoConnect=false
// so the first connect() after a target switch (followed by a reload) picks
// up the new endpoint cleanly.
const socket = io(getSocketUrl(), {
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
