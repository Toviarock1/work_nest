/**
 * Runtime override for the API + Socket URLs. Lets the dev-only
 * BackendSwitcher widget point the app at a local backend without restarting
 * the dev server. Falls back to the env defaults whenever no override is set
 * or when running on the server (env vars are baked at build time anyway).
 */

import { useEffect, useState } from "react";
import { env } from "./env";

const STORAGE_KEY = "worknest:dev:backendTarget";
const CHANGE_EVENT = "worknest:dev:backendTargetChanged";

export interface BackendTarget {
  api: string;
  socket: string;
}

const isBrowser = () => typeof window !== "undefined";

const readOverride = (): BackendTarget | null => {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BackendTarget>;
    if (typeof parsed.api === "string" && typeof parsed.socket === "string") {
      return { api: parsed.api, socket: parsed.socket };
    }
    return null;
  } catch {
    return null;
  }
};

export const getApiBase = (): string => {
  const override = readOverride();
  const base = override?.api ?? env.NEXT_PUBLIC_API_URL;
  return `${base}/api/v1`;
};

export const getSocketUrl = (): string => {
  const override = readOverride();
  return override?.socket ?? env.NEXT_PUBLIC_SOCKET_URL;
};

export const setBackendTarget = (target: BackendTarget | null): void => {
  if (!isBrowser()) return;
  if (target === null) {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(target));
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

export type BackendSource = "env" | "local" | "custom";

const LOCAL_API = "http://localhost:5050";

const classify = (override: BackendTarget | null): BackendSource => {
  if (!override) return "env";
  if (override.api === LOCAL_API && override.socket === LOCAL_API)
    return "local";
  return "custom";
};

export const LOCAL_TARGET: BackendTarget = {
  api: LOCAL_API,
  socket: LOCAL_API,
};

export const ENV_TARGET: BackendTarget = {
  api: env.NEXT_PUBLIC_API_URL,
  socket: env.NEXT_PUBLIC_SOCKET_URL,
};

/**
 * Subscribes to override changes so a widget can re-render after switching
 * (including changes made in another tab via the `storage` event).
 */
export function useBackendTarget(): {
  source: BackendSource;
  target: BackendTarget;
} {
  const [override, setOverride] = useState<BackendTarget | null>(() =>
    readOverride(),
  );

  useEffect(() => {
    const sync = () => setOverride(readOverride());
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return {
    source: classify(override),
    target: override ?? ENV_TARGET,
  };
}
