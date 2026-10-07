import { useEffect } from "react";
import { createProject } from "@/services/project.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderKanban, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

interface CreateProjectFormValues {
  name: string;
  description: string;
}

const AddNewProject = ({
  show,
  close,
}: {
  show: boolean;
  close: () => void;
}) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateProjectFormValues>();

  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Project created");
      reset();
      close();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Something went wrong. Try again");
    },
  });

  const onSubmitHandler = (data: CreateProjectFormValues) => {
    mutate(data);
  };

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show, close]);

  useEffect(() => {
    if (!show) reset();
  }, [show, reset]);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="bg-white dark:bg-zinc-900 w-full sm:max-w-md mx-0 sm:mx-4 rounded-t-4xl sm:rounded-2xl shadow-2xl border-t border-[#dde4e4] dark:border-zinc-800 sm:border font-display text-[#121717] dark:text-white">
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-4 sm:hidden">
          <div className="w-12 h-1.5 rounded-full bg-[#dde4e4] dark:bg-zinc-700" />
        </div>

        {/* Close button */}
        <div className="flex justify-end px-6 pt-5 sm:px-8 sm:pt-6">
          <button
            onClick={close}
            disabled={isPending}
            aria-label="Close"
            className="size-9 flex items-center justify-center rounded-full text-[#678383] hover:text-[#121717] dark:hover:text-white hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 transition-colors disabled:opacity-60"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Hero section */}
        <div className="flex flex-col items-center text-center gap-4 px-8 pt-2 pb-7">
          <div className="size-16 rounded-2xl bg-primary2/10 flex items-center justify-center text-primary2">
            <FolderKanban className="size-8" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-black tracking-tight">
              Create New Project
            </h3>
            <p className="text-sm text-[#678383] font-medium leading-relaxed max-w-xs mx-auto">
              Set up your workspace and start collaborating with your team.
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="px-6 sm:px-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-bold text-[#121717] dark:text-white"
              htmlFor="project-name"
            >
              Project Name
            </label>
            <input
              className="w-full h-14 px-4 bg-background-light dark:bg-zinc-800 border border-[#dde4e4] dark:border-zinc-700 rounded-2xl text-base placeholder:text-[#678383] focus:outline-none focus:ring-2 focus:ring-primary2/30 focus:border-primary2 transition"
              id="project-name"
              placeholder="e.g. Q4 Marketing Campaign"
              type="text"
              {...register("name", {
                required: "Give your project a name",
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-500 font-medium">
                {errors.name.message as string}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-bold text-[#121717] dark:text-white"
              htmlFor="project-description"
            >
              Description
            </label>
            <textarea
              className="w-full px-4 py-4 bg-background-light dark:bg-zinc-800 border border-[#dde4e4] dark:border-zinc-700 rounded-2xl text-base placeholder:text-[#678383] focus:outline-none focus:ring-2 focus:ring-primary2/30 focus:border-primary2 transition resize-none"
              id="project-description"
              placeholder="Briefly describe the goals and key deliverables..."
              rows={3}
              {...register("description", {
                required:
                  "Add a short description so the team knows what this is",
              })}
            />
            {errors.description && (
              <p className="text-sm text-red-500 font-medium">
                {errors.description.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 pt-5 pb-8 sm:pb-6 flex flex-col sm:flex-row-reverse gap-3">
          <button
            disabled={isPending}
            onClick={handleSubmit(onSubmitHandler)}
            className="flex-1 h-14 sm:h-12 rounded-2xl bg-primary2 text-white text-base font-bold shadow-lg shadow-primary2/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isPending ? (
              <span className="loading loading-dots loading-sm" />
            ) : (
              <>
                <Plus className="size-5" />
                <span>Create Project</span>
              </>
            )}
          </button>
          <button
            disabled={isPending}
            onClick={close}
            className="flex-1 h-14 sm:h-12 rounded-2xl text-base font-bold text-[#678383] bg-[#f1f4f4] dark:bg-zinc-800 hover:text-[#121717] dark:hover:text-white transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewProject;
