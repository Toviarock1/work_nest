"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

// Mounted inside the dashboard layout — sidebar/header stay visible.
export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error boundary:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="size-14 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
        <AlertTriangle className="size-6" />
      </div>
      <h2 className="text-xl font-bold text-[#121717] dark:text-white mb-1">
        This page couldn't load
      </h2>
      <p className="text-sm text-[#678383] dark:text-gray-400 max-w-md mb-6">
        Try again, or jump back to your project list.
      </p>
      {error.digest && (
        <p className="text-xs text-[#678383] dark:text-gray-500 mb-5 font-mono">
          ref: {error.digest}
        </p>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary2 text-white text-sm font-bold hover:bg-primary2/90 active:scale-95 transition-all"
        >
          <RefreshCw className="size-4" />
          Try again
        </button>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#dde4e4] dark:border-gray-700 text-[#121717] dark:text-white text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Home className="size-4" />
          Dashboard
        </Link>
      </div>
    </div>
  );
}
