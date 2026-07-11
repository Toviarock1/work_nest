// Server-side / edge Sentry registration. Next.js calls `register()` once
// per runtime at boot. Each branch imports the matching config file.
import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

// Routes errors from Next.js's nested request handlers to Sentry.
export const onRequestError = Sentry.captureRequestError;
