"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";
import { env } from "@/lib/env";

let initialized = false;

const initPostHog = () => {
  if (initialized) return;
  if (typeof window === "undefined") return;
  if (!env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false, // manual — React Router/App Router doesn't fire the events PostHog auto-captures
    capture_pageleave: true,
    disable_session_recording: env.NODE_ENV !== "production",
  });
  initialized = true;
};

/** Tracks `$pageview` on every route change. */
const PageViewTracker = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!env.NEXT_PUBLIC_POSTHOG_KEY) return;
    if (!pathname) return;
    const search = searchParams?.toString();
    const url = `${window.location.origin}${pathname}${search ? `?${search}` : ""}`;
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams]);

  return null;
};

const PostHogProvider = ({ children }: { children: React.ReactNode }) => {
  if (typeof window !== "undefined") initPostHog();
  return (
    <>
      <PageViewTracker />
      {children}
    </>
  );
};

export default PostHogProvider;

// Re-export the configured singleton so other modules (e.g. auth store) can
// call `identify` / `reset` directly without importing posthog-js everywhere.
export { posthog };
