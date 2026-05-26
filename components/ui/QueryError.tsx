"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface QueryErrorProps {
  message?: string;
  onRetry?: () => void;
  /** Compact variant — single row, no large icon. Use inside dense lists. */
  compact?: boolean;
  className?: string;
}

export default function QueryError({
  message = "We couldn't load this. Check your connection and try again.",
  onRetry,
  compact = false,
  className = "",
}: QueryErrorProps) {
  if (compact) {
    return (
      <div
        role="alert"
        className={`flex items-center gap-3 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/15 p-3 text-sm text-red-700 dark:text-red-300 ${className}`}
      >
        <AlertTriangle className="size-4 shrink-0" />
        <span className="flex-1">{message}</span>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <RefreshCw className="size-3" />
            Retry
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center text-center rounded-xl border border-[#f1f4f4] dark:border-[#2d3238] bg-white dark:bg-background-dark p-10 ${className}`}
    >
      <div className="size-14 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
        <AlertTriangle className="size-6" />
      </div>
      <h3 className="text-lg font-bold text-[#121717] dark:text-white mb-1">
        Something went wrong
      </h3>
      <p className="text-sm text-[#678383] max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary2 text-white text-sm font-bold hover:bg-primary2/90 active:scale-95 transition-all"
        >
          <RefreshCw className="size-4" />
          Try again
        </button>
      )}
    </div>
  );
}
