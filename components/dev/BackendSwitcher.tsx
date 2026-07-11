"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronUp,
  Globe,
  Laptop,
  Server,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  ENV_TARGET,
  LOCAL_TARGET,
  setBackendTarget,
  useBackendTarget,
  type BackendTarget,
} from "@/lib/backendTarget";
import { disconnectSocket } from "@/lib/socket";

const hostOf = (url: string): string => {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
};

const sourceMeta: Record<
  "env" | "local" | "custom",
  { label: string; Icon: LucideIcon; dot: string }
> = {
  env: { label: "Remote", Icon: Server, dot: "bg-emerald-500" },
  local: { label: "Local", Icon: Laptop, dot: "bg-amber-500" },
  custom: { label: "Custom", Icon: Globe, dot: "bg-amber-500" },
};

const BackendSwitcher = () => {
  const { source, target } = useBackendTarget();
  const [open, setOpen] = useState(false);
  const [customUrl, setCustomUrl] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  // The override lives in localStorage, which the server can't see. Defer
  // rendering until after mount so the first client paint matches SSR.
  // This is the canonical hydration-skip pattern; the setState-in-effect
  // rule is intentionally disabled here.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Cmd/Ctrl + Shift + B toggles. Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "b"
      ) {
        e.preventDefault();
        setOpen((p) => !p);
        return;
      }
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Click outside closes the popover.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const apply = (next: BackendTarget | null) => {
    setBackendTarget(next);
    // Belt — kill the live socket so the reload doesn't print a noisy disconnect.
    try {
      disconnectSocket();
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  const applyCustom = () => {
    const trimmed = customUrl.trim().replace(/\/$/, "");
    if (!trimmed) return;
    try {
      // Throws if not a valid URL.
      new URL(trimmed);
    } catch {
      return;
    }
    apply({ api: trimmed, socket: trimmed });
  };

  const meta = sourceMeta[source];
  const label =
    source === "custom" ? `Custom · ${hostOf(target.api)}` : meta.label;

  // Skip the first SSR render — there's nothing meaningful to show without
  // window.localStorage, and rendering env defaults here would mismatch
  // whatever the client decides after reading the override.
  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      className="fixed bottom-4 right-4 z-[60] font-sans text-sm select-none"
    >
      {open && (
        <div className="mb-2 w-80 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xl p-3 space-y-2">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Backend target
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="p-1 -m-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              <X className="size-3.5" />
            </button>
          </div>

          {/* Remote (env) */}
          <button
            type="button"
            onClick={() => apply(null)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              source === "env"
                ? "bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-500/40"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Server className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-zinc-900 dark:text-zinc-100">
                Remote (env default)
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                {hostOf(ENV_TARGET.api)}
              </p>
            </div>
          </button>

          {/* Local */}
          <button
            type="button"
            onClick={() => apply(LOCAL_TARGET)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              source === "local"
                ? "bg-amber-50 dark:bg-amber-900/20 ring-1 ring-amber-500/40"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            <Laptop className="size-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-zinc-900 dark:text-zinc-100">
                Local
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                {hostOf(LOCAL_TARGET.api)}
              </p>
            </div>
          </button>

          {/* Custom */}
          <div
            className={`p-3 rounded-lg ${
              source === "custom"
                ? "bg-amber-50 dark:bg-amber-900/20 ring-1 ring-amber-500/40"
                : "bg-zinc-50 dark:bg-zinc-800/60"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Globe className="size-4 text-zinc-500 dark:text-zinc-400 shrink-0" />
              <p className="font-bold text-zinc-900 dark:text-zinc-100">
                Custom URL
              </p>
            </div>
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyCustom();
              }}
              placeholder="https://staging.example.com"
              className="w-full px-2 py-1.5 rounded-md text-xs bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:border-primary2 focus:ring-1 focus:ring-primary2 outline-none dark:text-zinc-100"
            />
            <button
              type="button"
              onClick={applyCustom}
              disabled={!customUrl.trim()}
              className="mt-2 w-full px-3 py-1.5 rounded-md text-xs font-bold bg-primary2 text-white disabled:opacity-50 hover:opacity-90"
            >
              Apply
            </button>
          </div>

          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 pt-1 text-center">
            <kbd className="px-1 rounded bg-zinc-100 dark:bg-zinc-800">⌘⇧B</kbd>{" "}
            to toggle
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-zinc-900 dark:bg-zinc-800 text-white shadow-lg border border-zinc-700 hover:bg-zinc-800"
        aria-label="Backend target switcher"
        title={`API: ${target.api}`}
      >
        <span
          className={`size-2 rounded-full ${meta.dot}`}
          aria-hidden="true"
        />
        <meta.Icon className="size-3.5" />
        <span className="text-xs font-bold truncate max-w-[140px]">
          {label}
        </span>
        <ChevronUp
          className={`size-3 transition-transform ${open ? "" : "rotate-180"}`}
        />
      </button>
    </div>
  );
};

export default BackendSwitcher;
