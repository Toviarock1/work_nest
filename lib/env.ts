import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url().default("http://localhost:5050"), // 🚀 Add defaults for build safety
  NEXT_PUBLIC_SOCKET_URL: z.url().default("http://localhost:5050"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  // Observability (all optional — features no-op when keys are missing).
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().default("https://us.i.posthog.com"),
});

const _env = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
});

if (!_env.success) {
  // 💡 Check if we are currently building (Prerendering)
  const isBuild =
    process.env.NEXT_PHASE === "phase-production-build" ||
    process.env.NODE_ENV === "production";

  console.error(
    `❌ Invalid Environment Variables: ${JSON.stringify(_env.error.format(), null, 2)}`,
  );

  // 🚀 ONLY throw the error if we are NOT building.
  // This allows the Next.js build to finish successfully.
  if (!isBuild) {
    throw new Error("Invalid environment variables");
  }
}

// Fallback to parsed data or a safe empty object if build is running
export const env = _env.success
  ? _env.data
  : (envSchema.parse({}) as z.infer<typeof envSchema>);
