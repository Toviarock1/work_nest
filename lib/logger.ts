/**
 * Tiny logger wrapper so we have one place to wire up structured logging /
 * Sentry / Datadog later without a codebase-wide rewrite.
 *
 * Rules of thumb:
 *   - `logger.info` / `logger.debug` are dev-only — silenced in production.
 *   - `logger.warn` / `logger.error` always log so genuine problems surface
 *     in production logs and (eventually) error trackers.
 *
 * Replace `console.log` with `logger.info` / `logger.debug` in product code.
 */

const isProd = process.env.NODE_ENV === "production";

type LogArgs = unknown[];

export const logger = {
  debug: (...args: LogArgs) => {
    if (isProd) return;
    // eslint-disable-next-line no-console
    console.debug(...args);
  },
  info: (...args: LogArgs) => {
    if (isProd) return;
    // eslint-disable-next-line no-console
    console.info(...args);
  },
  warn: (...args: LogArgs) => {
    console.warn(...args);
  },
  error: (...args: LogArgs) => {
    console.error(...args);
    // TODO: forward to Sentry / Datadog once configured.
  },
};
