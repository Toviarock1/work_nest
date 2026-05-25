interface Props {
  variant?: "grid" | "list";
}

const ProjectCardSkeleton = ({ variant = "grid" }: Props) => {
  if (variant === "list") {
    return (
      <div className="bg-white dark:bg-background-dark rounded-xl border border-[#f1f4f4] dark:border-[#2d3238] shadow-soft p-6 flex items-center gap-6">
        <div className="flex-1 flex flex-col gap-2">
          <div className="skeleton h-5 w-44" />
          <div className="skeleton h-4 w-72" />
        </div>
        <div className="flex items-center gap-2">
          <div className="skeleton size-7 rounded-full" />
          <div className="skeleton size-7 rounded-full" />
          <div className="skeleton size-7 rounded-full" />
        </div>
        <div className="skeleton h-4 w-20" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-background-dark rounded-xl border border-[#f1f4f4] dark:border-[#2d3238] shadow-soft p-6">
      <div className="flex justify-end items-start mb-4">
        <div className="skeleton size-7 rounded" />
      </div>
      <div className="mb-6">
        <div className="skeleton h-5 w-40 mb-2" />
        <div className="skeleton h-4 w-full mb-1.5" />
        <div className="skeleton h-4 w-3/4" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-[#f1f4f4] dark:border-[#2d3238]">
        <div className="flex -space-x-2">
          <div className="skeleton size-8 rounded-full ring-2 ring-white dark:ring-background-dark" />
          <div className="skeleton size-8 rounded-full ring-2 ring-white dark:ring-background-dark" />
          <div className="skeleton size-8 rounded-full ring-2 ring-white dark:ring-background-dark" />
        </div>
        <div className="skeleton h-4 w-16" />
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;
