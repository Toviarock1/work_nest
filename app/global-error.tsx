"use client";

import { useEffect } from "react";

// Renders only when the root layout itself errors — must include <html>/<body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error boundary:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f9fafb",
          color: "#121717",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, sans-serif",
          padding: "1rem",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: 800,
              marginBottom: "0.5rem",
            }}
          >
            Something went very wrong
          </h1>
          <p style={{ color: "#678383", marginBottom: "2rem" }}>
            The page failed to load. Refresh to try again.
          </p>
          {error.digest && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "#94a3b8",
                marginBottom: "1.5rem",
                fontFamily: "ui-monospace, monospace",
              }}
            >
              ref: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              padding: "0.625rem 1.25rem",
              borderRadius: "0.5rem",
              background: "#1d6d6b",
              color: "white",
              border: "none",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
