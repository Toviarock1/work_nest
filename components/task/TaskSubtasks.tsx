"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { createTask, deleteTask, updateTask } from "@/services/task.service";
import type { TaskSubtaskRow, TasksType } from "@/types";

interface Props {
  parent: TasksType;
  subtasks: TaskSubtaskRow[];
  canManage: boolean;
}

const TaskSubtasks = ({ parent, subtasks, canManage }: Props) => {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["project-todos", parent.projectId],
    });

  const errorToast =
    (fallback: string) => (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message || fallback);
    };

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      setDraft("");
      invalidate();
    },
    onError: errorToast("Couldn't add subtask"),
  });

  const updateMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: invalidate,
    onError: errorToast("Couldn't update subtask"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: invalidate,
    onError: errorToast("Couldn't delete subtask"),
  });

  const onAdd = () => {
    const title = draft.trim();
    if (title.length < 3) return;
    createMutation.mutate({
      title,
      projectId: parent.projectId,
      parentId: parent.id,
    });
  };

  const total = subtasks.length;
  const completed = subtasks.filter((s) => s.status === "done").length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#313742] dark:text-zinc-100">
          Subtasks
          {total > 0 && (
            <span className="ml-2 font-normal text-[#6A717B] dark:text-zinc-400 tabular-nums">
              {completed}/{total}
            </span>
          )}
        </h3>
      </div>

      {total > 0 && (
        <div className="h-1.5 rounded-full bg-background-light dark:bg-zinc-800 mb-3 overflow-hidden">
          <div
            className="h-full bg-primary2 transition-[width] duration-200"
            style={{ width: `${pct}%` }}
            aria-hidden="true"
          />
        </div>
      )}

      {total === 0 && !canManage && (
        <p className="text-sm text-[#6A717B] dark:text-zinc-400 italic">
          No subtasks yet.
        </p>
      )}

      {total > 0 && (
        <ul className="space-y-2 mb-3">
          {subtasks.map((s) => {
            const done = s.status === "done";
            return (
              <li
                key={s.id}
                className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-background-light dark:hover:bg-zinc-800 group"
              >
                <input
                  type="checkbox"
                  checked={done}
                  disabled={!canManage || updateMutation.isPending}
                  onChange={() =>
                    updateMutation.mutate({
                      taskId: s.id,
                      status: done ? "todo" : "done",
                    })
                  }
                  aria-label={`Mark "${s.title}" ${done ? "incomplete" : "complete"}`}
                  className="size-4 accent-primary2"
                />
                <span
                  className={`flex-1 text-sm dark:text-zinc-200 ${done ? "line-through opacity-60" : ""}`}
                >
                  {s.title}
                </span>
                {canManage && (
                  <button
                    type="button"
                    aria-label={`Delete subtask "${s.title}"`}
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(s.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 -m-1 text-[#6A717B] hover:text-red-500"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {canManage && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onAdd();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a subtask…"
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-zinc-100 text-sm focus:border-primary2 focus:ring-1 focus:ring-primary2 outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-500"
          />
          <button
            type="submit"
            disabled={draft.trim().length < 3 || createMutation.isPending}
            className="px-3 py-2 rounded-lg bg-primary2 text-white text-xs font-bold disabled:opacity-50 hover:opacity-90 flex items-center gap-1"
          >
            <Plus className="size-3.5" />
            Add
          </button>
        </form>
      )}
    </section>
  );
};

export default TaskSubtasks;
