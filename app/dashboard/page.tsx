"use client";
import { useEffect, useMemo, useState } from "react";
import ProjectCard from "@/components/project/ProjectCard";
import ProjectCardSkeleton from "@/components/skeleton/ProjectCardSkeleton";
import QueryError from "@/components/ui/QueryError";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Clock,
  FolderPlus,
  LayoutGrid,
  List,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyProjects } from "@/services/project.service";
import { ProjectsType } from "@/types";
import AddNewProject from "@/components/project/AddNewProject";

type ViewMode = "grid" | "list";
type SortMode = "newest" | "oldest" | "name";

const VIEW_KEY = "worknest:projects:viewMode";
const SORT_KEY = "worknest:projects:sortBy";

export default function DashboardPage() {
  const [modal, setModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortMode>("newest");

  // Hydrate persisted preferences (client only, after mount → no SSR mismatch)
  useEffect(() => {
    const v = localStorage.getItem(VIEW_KEY);
    if (v === "grid" || v === "list") setViewMode(v);
    const s = localStorage.getItem(SORT_KEY);
    if (s === "newest" || s === "oldest" || s === "name") setSortBy(s);
  }, []);

  useEffect(() => {
    localStorage.setItem(VIEW_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem(SORT_KEY, sortBy);
  }, [sortBy]);

  const {
    data: projects,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchMyProjects,
  });

  const filteredProjects = useMemo(() => {
    const list: ProjectsType[] = projects?.data ?? [];
    const q = searchQuery.trim().toLowerCase();

    const filtered = q
      ? list.filter((p) => {
          const name = p.project?.name?.toLowerCase() ?? "";
          const description = p.project?.description?.toLowerCase() ?? "";
          return name.includes(q) || description.includes(q);
        })
      : list;

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "name") {
        return (a.project?.name ?? "").localeCompare(b.project?.name ?? "");
      }
      const aT = new Date(a.project?.createdAt ?? 0).getTime();
      const bT = new Date(b.project?.createdAt ?? 0).getTime();
      return sortBy === "newest" ? bT - aT : aT - bT;
    });

    return sorted;
  }, [projects, searchQuery, sortBy]);

  const totalCount = projects?.data?.length ?? 0;
  const visibleCount = filteredProjects.length;
  const isSearching = searchQuery.trim().length > 0;
  const isEmptyAccount = !isLoading && !isError && totalCount === 0;

  return (
    <>
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">
            Project Directory
          </h2>
          <p className="text-[#678383]">
            Overview of all current engagements, status, and team performance.
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary2 text-white rounded-lg font-bold shadow-lg shadow-primary2/20 hover:bg-primary2/90 transition-all active:scale-95"
        >
          <Plus className="size-5" />
          New Project
        </button>
      </div>

      {/* Filters & Search (hidden when empty account so the welcome state is the focal point) */}
      {!isEmptyAccount && !isError && (
        <div className="bg-white dark:bg-background-dark p-3 rounded-xl shadow-soft border border-[#f1f4f4] dark:border-[#2d3238] mb-8 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-75 relative">
            <Search className="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-[#678383] pointer-events-none" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-background-light dark:bg-[#2d3238] border-none rounded-lg focus:ring-2 focus:ring-primary2/50 focus:outline-none"
              placeholder="Search projects by name or description..."
              type="text"
              aria-label="Search projects"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#678383] hover:text-[#121717] dark:hover:text-white transition-colors"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Sort */}
            <label className="relative">
              <span className="sr-only">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortMode)}
                className="appearance-none bg-background-light dark:bg-[#2d3238] rounded-lg pl-9 pr-8 py-2.5 text-sm font-medium cursor-pointer focus:ring-2 focus:ring-primary2/50 focus:outline-none border-none"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name">Name A–Z</option>
              </select>
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#678383] pointer-events-none">
                {sortBy === "name" ? (
                  <ArrowDownAZ className="size-4" />
                ) : sortBy === "oldest" ? (
                  <ArrowUpAZ className="size-4" />
                ) : (
                  <Clock className="size-4" />
                )}
              </span>
            </label>

            {/* View toggle */}
            <div className="flex bg-background-light dark:bg-[#2d3238] p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "grid"
                    ? "bg-white dark:bg-background-dark shadow-sm text-primary2"
                    : "text-[#678383] hover:text-primary2"
                }`}
              >
                <LayoutGrid className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-background-dark shadow-sm text-primary2"
                    : "text-[#678383] hover:text-primary2"
                }`}
              >
                <List className="size-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Result count */}
      {!isLoading && !isEmptyAccount && !isError && (
        <div className="mb-4 flex items-center gap-2 text-sm text-[#678383]">
          {isSearching ? (
            <span>
              Showing{" "}
              <strong className="text-[#121717] dark:text-white">
                {visibleCount}
              </strong>{" "}
              of {totalCount} project{totalCount === 1 ? "" : "s"} matching{" "}
              <span className="font-semibold text-[#121717] dark:text-white">
                &ldquo;{searchQuery}&rdquo;
              </span>
            </span>
          ) : (
            <span>
              <strong className="text-[#121717] dark:text-white">
                {totalCount}
              </strong>{" "}
              project{totalCount === 1 ? "" : "s"}
            </span>
          )}
        </div>
      )}

      {/* Loading: skeleton grid matching the chosen layout */}
      {!isLoading && isError && (
        <QueryError
          message="We couldn't load your projects. Check your connection and try again."
          onRetry={() => refetch()}
        />
      )}

      {isLoading && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} variant={viewMode} />
          ))}
        </div>
      )}

      {/* Empty account (no projects exist yet) */}
      {isEmptyAccount && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-background-dark rounded-xl border border-[#f1f4f4] dark:border-[#2d3238] shadow-soft">
          <div className="size-16 rounded-full bg-primary2/10 flex items-center justify-center text-primary2 mb-5">
            <FolderPlus className="size-8" />
          </div>
          <h3 className="text-xl font-bold mb-2">Your workspace is empty</h3>
          <p className="text-sm text-[#678383] mb-6 max-w-md">
            Projects are how you organize work, files, and conversations. Create
            your first one to get started.
          </p>
          <button
            onClick={() => setModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary2 text-white rounded-lg font-bold shadow-lg shadow-primary2/20 hover:bg-primary2/90 transition-all active:scale-95"
          >
            <Plus className="size-5" />
            Create your first project
          </button>
        </div>
      )}

      {/* Empty search */}
      {!isLoading && !isEmptyAccount && isSearching && visibleCount === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="size-14 rounded-full bg-[#f1f4f4] dark:bg-[#2d3238] flex items-center justify-center text-[#678383] mb-4">
            <Search className="size-6" />
          </div>
          <h3 className="text-lg font-bold mb-1">No projects found</h3>
          <p className="text-sm text-[#678383] mb-4">
            Nothing matched &ldquo;{searchQuery}&rdquo;. Try a different search.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="px-4 py-2 text-sm font-bold text-primary2 hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Project Grid / List */}
      {!isLoading && !isEmptyAccount && !(isSearching && visibleCount === 0) && (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }
        >
          {filteredProjects.map((p) => (
            <ProjectCard
              id={p.project.id}
              name={p.project.name}
              description={
                p.project.description
                  ? p.project.description
                  : "Give this project a description. what do you think?"
              }
              createdAt={p.project.createdAt}
              key={p.project.id}
            />
          ))}

          {!isSearching && (
            <button
              onClick={() => setModal(true)}
              className={`group border-2 border-dashed border-[#f1f4f4] dark:border-[#2d3238] rounded-xl flex ${
                viewMode === "grid"
                  ? "flex-col items-center justify-center p-6"
                  : "flex-row items-center gap-4 p-4"
              } hover:border-primary2/50 hover:bg-white dark:hover:bg-background-dark transition-all duration-300`}
            >
              <div
                className={`${
                  viewMode === "grid" ? "w-12 h-12 mb-4" : "w-10 h-10"
                } rounded-full bg-[#f1f4f4] dark:bg-[#2d3238] flex items-center justify-center text-[#678383] group-hover:bg-primary2/10 group-hover:text-primary2 transition-colors`}
              >
                <Plus className="size-5" />
              </div>
              <div className={viewMode === "list" ? "text-left" : ""}>
                <h3 className="text-base font-bold text-[#678383] group-hover:text-primary2 transition-colors">
                  Create Project
                </h3>
                <p className="text-xs text-[#678383] mt-1">
                  Start a new engagement
                </p>
              </div>
            </button>
          )}
        </div>
      )}

      <AddNewProject close={() => setModal(false)} show={modal} />
    </>
  );
}
