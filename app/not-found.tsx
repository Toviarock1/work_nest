import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background-dark px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto size-16 rounded-full bg-primary2/10 text-primary2 flex items-center justify-center mb-6">
          <Compass className="size-8" />
        </div>
        <p className="text-sm font-bold uppercase tracking-widest text-primary2 mb-2">
          404
        </p>
        <h1 className="text-3xl font-extrabold text-[#121717] dark:text-white mb-2">
          Page not found
        </h1>
        <p className="text-[#678383] dark:text-gray-400 mb-8">
          The page you're looking for has moved or doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary2 text-white text-sm font-bold hover:bg-primary2/90 active:scale-95 transition-all"
        >
          <Home className="size-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
