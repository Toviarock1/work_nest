import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { logger } from "./logger";

describe("logger", () => {
  const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
  const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});

  beforeEach(() => {
    warnSpy.mockClear();
    errorSpy.mockClear();
    infoSpy.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("always forwards warn", () => {
    logger.warn("hello");
    expect(warnSpy).toHaveBeenCalledWith("hello");
  });

  it("always forwards error", () => {
    logger.error("boom", new Error("x"));
    expect(errorSpy).toHaveBeenCalled();
  });

  it("forwards info in non-production", () => {
    // jsdom defaults NODE_ENV to test; logger treats anything other than
    // "production" as dev-visible.
    logger.info("hi");
    expect(infoSpy).toHaveBeenCalledWith("hi");
  });
});
