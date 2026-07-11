// Browser-side Sentry init. Auto-loaded by Next.js 15+/Sentry v8+.
// No-ops cleanly when NEXT_PUBLIC_SENTRY_DSN is unset.
import * as Sentry from "@sentry/nextjs";

// Temporary diagnostic — prove this file is reached and the DSN is visible.
// Safe to remove once Sentry is confirmed working in the browser.
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
// eslint-disable-next-line no-console
console.log(
  "[Sentry] instrumentation-client loaded. DSN set?",
  Boolean(dsn),
  dsn
    ? `host=${(() => {
        try {
          return new URL(dsn).host;
        } catch {
          return "invalid";
        }
      })()}`
    : "",
);

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    integrations: [Sentry.replayIntegration({ maskAllText: false })],
    debug: process.env.NODE_ENV === "development",
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
