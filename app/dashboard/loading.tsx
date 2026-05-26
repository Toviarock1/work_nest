import ProjectCardSkeleton from "@/components/skeleton/ProjectCardSkeleton";

// Route-transition fallback for /dashboard/*. Mirrors the dashboard layout so
// the user sees the eventual shape, not a spinner.
export default function DashboardLoading() {
  return (
    <div className="animate-pulse">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded bg-[#f1f4f4] dark:bg-[#2d3238]" />
          <div className="h-4 w-80 rounded bg-[#f1f4f4] dark:bg-[#2d3238]" />
        </div>
        <div className="h-10 w-36 rounded-lg bg-[#f1f4f4] dark:bg-[#2d3238]" />
      </div>
      <div className="h-14 w-full rounded-xl bg-white dark:bg-background-dark border border-[#f1f4f4] dark:border-[#2d3238] mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} variant="grid" />
        ))}
      </div>
    </div>
  );
}
