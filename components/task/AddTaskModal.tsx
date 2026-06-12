import { fetchProjectMembers } from "@/services/project.service";
import { ProjectMembersType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import BtnLoader from "../BtnLoader";

type CreateTaskFormValues = {
  title: string;
  description: string;
  assignee: string;
  status: "todo" | "in_progress" | "done";
};

const AddTaskModal = ({
  show,
  close,
  onSubmit,
  projectId,
  isLoading = false,
}: {
  show: boolean;
  close: () => void;
  onSubmit: (data: CreateTaskFormValues) => void;
  projectId: string;
  isLoading?: boolean;
}) => {
  const { data: members } = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => fetchProjectMembers(projectId),
    enabled: !!projectId,
  });

  const memberOptions: ProjectMembersType[] =
    members?.data?.projectMembers ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskFormValues>({
    defaultValues: {
      title: "",
      description: "",
      assignee: "",
      status: "todo",
    },
  });

  useEffect(() => {
    if (!show) reset();
  }, [show, reset]);

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show, close]);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end max-w-full bg-black/30 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-screen max-w-xl flex flex-col bg-white dark:bg-zinc-900 shadow-2xl h-full border-l border-slate-200 dark:border-zinc-800 animate-[slideInRight_200ms_ease-out]"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 p-6">
          <div>
            <h2 className="text-xl font-bold text-[#121717] dark:text-zinc-100">
              Add New Task
            </h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              Define the details for your new project objective.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-500 dark:text-zinc-400"
          >
            <X />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#121717] dark:text-zinc-200">
              Task Title
            </label>
            <input
              autoFocus
              className="w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-zinc-100 h-12 px-4 text-base focus:border-primary2 focus:ring-1 focus:ring-primary2 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-zinc-500"
              placeholder="e.g., Design Homepage Hero Section"
              type="text"
              {...register("title", {
                required: "Give this task a short title",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              })}
            />
            {errors.title && (
              <p className="text-xs text-red-500">
                {errors.title.message as string}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#121717] dark:text-zinc-200">
              Description
              <span className="ml-2 font-normal text-xs text-slate-400 dark:text-zinc-500">
                Optional
              </span>
            </label>
            <div className="rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 overflow-hidden focus-within:border-primary2 focus-within:ring-1 focus-within:ring-primary2 transition-all">
              <textarea
                className="w-full border-none focus:ring-0 p-4 min-h-40 text-base bg-transparent dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 resize-none"
                placeholder="Add some details about this task..."
                {...register("description")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#121717] dark:text-zinc-200">
                Assignee
              </label>
              <select
                defaultValue=""
                disabled={memberOptions.length === 0}
                className="w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-zinc-100 h-12 px-3 text-sm focus:border-primary2 focus:ring-1 focus:ring-primary2 outline-none transition-all disabled:opacity-60"
                {...register("assignee", {
                  required: "Please assign this task to a team member",
                })}
              >
                <option disabled value="">
                  Select assignee
                </option>
                {memberOptions.map((member) => (
                  <option key={member.id} value={member.user.email}>
                    {member.user.name}
                  </option>
                ))}
              </select>
              {memberOptions.length === 0 ? (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  No project members yet. Add a member first to assign tasks.
                </p>
              ) : (
                errors.assignee && (
                  <p className="text-xs text-red-500">
                    {errors.assignee.message as string}
                  </p>
                )
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#121717] dark:text-zinc-200">
                Status
              </label>
              <select
                className="w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-zinc-100 h-12 px-3 text-sm focus:border-primary2 focus:ring-1 focus:ring-primary2 outline-none transition-all"
                {...register("status")}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end gap-3 bg-white dark:bg-zinc-900">
          <button
            type="button"
            onClick={close}
            disabled={isLoading}
            className="flex min-w-25 h-11 items-center justify-center rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 font-bold text-sm transition-all hover:bg-slate-50 dark:hover:bg-zinc-700 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || memberOptions.length === 0}
            className="flex min-w-35 h-11 items-center justify-center rounded-lg bg-primary2 text-white font-bold text-sm transition-all hover:opacity-90 shadow-lg shadow-primary/20 disabled:opacity-60 gap-2"
          >
            {isLoading ? <BtnLoader /> : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTaskModal;
