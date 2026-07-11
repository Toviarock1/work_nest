"use client";

import { useState } from "react";
import * as Sentry from "@sentry/nextjs";

export default function SentryTestPage() {
  const [lastResult, setLastResult] = useState<string>("");

  const sendCaptured = () => {
    const id = `frontend-captured-${Date.now()}`;
    Sentry.captureException(new Error(id));
    setLastResult(`Sent captured exception: ${id}`);
  };

  const sendMessage = () => {
    const id = `frontend-message-${Date.now()}`;
    Sentry.captureMessage(id, "error");
    setLastResult(`Sent message: ${id}`);
  };

  const throwUncaught = () => {
    const id = `frontend-uncaught-${Date.now()}`;
    setTimeout(() => {
      throw new Error(id);
    }, 0);
    setLastResult(`Threw uncaught: ${id}`);
  };

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  const dsnHost = dsn ? new URL(dsn).host : "no DSN";

  return (
    <main className="max-w-2xl mx-auto p-10 font-sans">
      <h1 className="text-2xl font-bold mb-4">Sentry frontend test</h1>
      <p className="text-sm text-zinc-600 mb-6">
        DSN host: <code className="bg-zinc-100 px-1 rounded">{dsnHost}</code>
      </p>

      <div className="space-y-3">
        <button
          onClick={sendCaptured}
          className="block w-full px-4 py-2 rounded bg-primary2 text-white font-bold"
        >
          1. Send Sentry.captureException
        </button>
        <button
          onClick={sendMessage}
          className="block w-full px-4 py-2 rounded bg-amber-500 text-white font-bold"
        >
          2. Send Sentry.captureMessage
        </button>
        <button
          onClick={throwUncaught}
          className="block w-full px-4 py-2 rounded bg-red-500 text-white font-bold"
        >
          3. Throw uncaught (global handler)
        </button>
      </div>

      {lastResult && (
        <p className="mt-6 text-sm bg-emerald-50 border border-emerald-200 text-emerald-900 rounded p-3">
          {lastResult}
        </p>
      )}

      <ol className="mt-8 text-sm text-zinc-600 space-y-2 list-decimal pl-5">
        <li>
          Open DevTools → <strong>Network</strong> tab. Type <code>ingest</code>{" "}
          in the filter.
        </li>
        <li>Click button 1 above.</li>
        <li>
          Look for a <code>POST</code> to{" "}
          <code>{dsnHost}/api/&lt;id&gt;/envelope/</code>
        </li>
        <li>
          If status is <strong>200</strong> → check{" "}
          <a
            className="text-primary2 underline"
            href="https://worknest.sentry.io/issues/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Sentry Issues
          </a>{" "}
          and look for the unique id shown above.
        </li>
        <li>
          If status is <strong>red / blocked</strong> → an ad blocker is
          stopping it. Disable uBlock / Brave Shield / Privacy Badger for{" "}
          <code>localhost</code>.
        </li>
        <li>
          If <strong>no POST appears at all</strong> → Sentry isn&apos;t
          initialized in this page&apos;s bundle; reload with a hard refresh (
          <code>Cmd+Shift+R</code>) after clearing cache.
        </li>
      </ol>
    </main>
  );
}
