"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import type { ProjectsType } from "@/types";

interface ProjectListResponse {
  data?: ProjectsType[];
}

const SearchPalette = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // Cmd/Ctrl+K toggles. Esc closes (only when open).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((p) => !p);
        return;
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Reset query + autofocus when opening.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveIndex(0);
    const id = requestAnimationFrame(() => inputRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  // Re-read the projects cache each time the palette opens so the list is
  // fresh after dashboard activity. `open` belongs in the deps for that reason.
  const projects = useMemo(() => {
    const cached = queryClient.getQueryData<ProjectListResponse>(["projects"]);
    return cached?.data ?? [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects.slice(0, 8);
    return projects
      .filter(
        (p) =>
          p.project?.name?.toLowerCase().includes(q) ||
          p.project?.description?.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [projects, query]);

  const navigateTo = (id: string) => {
    setOpen(false);
    router.push(`/dashboard/project/${id}`);
  };

  const onKeyDownInList = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = results[activeIndex];
      if (pick) navigateTo(pick.project.id);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search"
      className="fixed inset-0 z-100 flex items-start justify-center px-4 pt-24 bg-black/40 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="w-full max-w-xl bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-[#dde4e4] dark:border-zinc-800 overflow-hidden animate-[slideInRight_150ms_ease-out]">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#f1f4f4] dark:border-zinc-800">
          <Search className="size-4 text-[#678383] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDownInList}
            placeholder="Search projects…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-[#678383] dark:text-zinc-100"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f1f4f4] dark:bg-zinc-800 text-[#678383]">
            Esc
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-1">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-[#678383]">
              {projects.length === 0
                ? "No projects yet. Create one to get started."
                : `No projects match “${query}”.`}
            </p>
          ) : (
            results.map((p, i) => (
              <button
                key={p.project.id}
                type="button"
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => navigateTo(p.project.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left ${
                  i === activeIndex
                    ? "bg-primary2/10"
                    : "hover:bg-background-light dark:hover:bg-zinc-800"
                }`}
              >
                <div className="size-7 rounded-lg bg-primary2/10 flex items-center justify-center text-primary2 text-xs font-bold shrink-0">
                  {p.project.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold truncate dark:text-zinc-100">
                    {p.project.name}
                  </p>
                  {p.project.description && (
                    <p className="text-xs text-[#678383] truncate">
                      {p.project.description}
                    </p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
        <div className="px-4 py-2 border-t border-[#f1f4f4] dark:border-zinc-800 flex items-center gap-4 text-[11px] text-[#678383] tabular-nums">
          <span>
            <kbd className="font-bold">↑↓</kbd> navigate
          </span>
          <span>
            <kbd className="font-bold">↵</kbd> open
          </span>
          <span className="ml-auto">
            <kbd className="font-bold">⌘K</kbd> toggle
          </span>
        </div>
      </div>
    </div>
  );
};

export default SearchPalette;
