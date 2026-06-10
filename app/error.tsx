"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto size-16 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-6">
          <AlertTriangle className="size-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-[#121717] dark:text-white mb-2">
          Something went wrong
        </h1>
        <p className="text-[#678383] dark:text-gray-400 mb-8">
          An unexpected error stopped this page from rendering. Try again, or
          head back home.
        </p>
        {error.digest && (
          <p className="text-xs text-[#678383] dark:text-gray-500 mb-6 font-mono">
            ref: {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary2 text-white text-sm font-bold hover:bg-primary2/90 active:scale-95 transition-all"
          >
            <RefreshCw className="size-4" />
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#dde4e4] dark:border-gray-700 text-[#121717] dark:text-white text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Home className="size-4" />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
