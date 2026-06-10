import { useRef } from "react";
import { createProject } from "@/services/project.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleX } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import BtnLoader from "../BtnLoader";

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
  const btnRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProjectFormValues>();

  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Project created");
      btnRef?.current?.click();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Something went wrong. Try again");
    },
  });

  const onSubmitHandler = (data: CreateProjectFormValues) => {
    mutate(data);
  };

  return (
    show && (
      <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl soft-shadow overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-8 pt-8 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  Create New Project
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Set up your workspace and start collaborating with your team.
                </p>
              </div>
              <button
                ref={btnRef}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors btn"
                onClick={close}
                disabled={isPending}
                aria-label="Close"
              >
                <CircleX />
              </button>
            </div>
            <div className="px-8 py-4 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Project Name
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary2/20 focus:border-primary2 transition-all outline-none"
                  placeholder="e.g. Q4 Marketing Campaign"
                  type="text"
                  {...register("name", {
                    required: "Project name is required",
                  })}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">
                    {errors.name.message as string}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary2/20 focus:border-primary2 transition-all outline-none resize-none"
                  placeholder="Briefly describe the goals and key deliverables..."
                  rows={3}
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">
                    {errors.description.message as string}
                  </p>
                )}
              </div>
            </div>
            <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-end gap-3 mt-auto border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={close}
                disabled={isPending}
                className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmitHandler)}
                disabled={isPending}
                className="px-8 py-2.5 bg-primary2 text-white rounded-lg font-semibold shadow-md hover:bg-opacity-90 active:scale-[0.98] transition-all"
              >
                {isPending ? <BtnLoader /> : "Create Project"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default AddNewProject;
