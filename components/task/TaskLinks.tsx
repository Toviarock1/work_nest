"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Link2, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import { createTaskLink, deleteTaskLink } from "@/services/taskLink.service";
import type { TaskLinkRow, TaskLinkType, TasksType } from "@/types";

interface Props {
  task: TasksType;
  outgoing: TaskLinkRow[];
  incoming: TaskLinkRow[];
  /** All tasks in the project (top-level + subtasks). The current task is filtered out. */
  candidates: TasksType[];
  canManage: boolean;
}

const TYPE_LABEL: Record<TaskLinkType, string> = {
  blocks: "Blocks",
  blocked_by: "Blocked by",
  related_to: "Related to",
};

const INVERSE_LABEL: Record<TaskLinkType, string> = {
  blocks: "Blocked by",
  blocked_by: "Blocks",
  related_to: "Related to",
};

const TaskLinks = ({
  task,
  outgoing,
  incoming,
  candidates,
  canManage,
}: Props) => {
  const queryClient = useQueryClient();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TaskLinkType>("blocks");

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["project-todos", task.projectId],
    });

  const errorToast =
    (fallback: string) => (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message || fallback);
    };

  const createMutation = useMutation({
    mutationFn: createTaskLink,
    onSuccess: () => {
      setQuery("");
      setPickerOpen(false);
      invalidate();
    },
    onError: errorToast("Couldn't add link"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTaskLink,
    onSuccess: invalidate,
    onError: errorToast("Couldn't remove link"),
  });

  const filteredCandidates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return candidates
      .filter((t) => t.id !== task.id)
      .filter((t) =>
        q.length === 0 ? true : t.title.toLowerCase().includes(q),
      )
      .slice(0, 8);
  }, [candidates, query, task.id]);

  const totalLinks = outgoing.length + incoming.length;

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#313742] dark:text-zinc-100">
          Links
          {totalLinks > 0 && (
            <span className="ml-2 font-normal text-[#6A717B] dark:text-zinc-400 tabular-nums">
              {totalLinks}
            </span>
          )}
        </h3>
        {canManage && (
          <button
            type="button"
            onClick={() => setPickerOpen((p) => !p)}
            className="text-xs font-bold text-primary2 flex items-center gap-1 hover:underline"
          >
            <Plus className="size-3.5" />
            Add link
          </button>
        )}
      </div>

      {totalLinks === 0 && !pickerOpen && (
        <p className="text-sm text-[#6A717B] dark:text-zinc-400 italic">
          No links yet.
        </p>
      )}

      {totalLinks > 0 && (
        <ul className="space-y-1.5 mb-3">
          {outgoing.map((l) => (
            <li
              key={l.id}
              className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-background-light dark:bg-zinc-800 group"
            >
              <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary2/10 text-primary2 shrink-0">
                {TYPE_LABEL[l.type]}
              </span>
              <Link2 className="size-3.5 text-[#6A717B] dark:text-zinc-400 shrink-0" />
              <span className="flex-1 text-sm dark:text-zinc-200 truncate">
                {l.toTask?.title ?? "Unknown"}
              </span>
              {canManage && (
                <button
                  type="button"
                  aria-label="Remove link"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(l.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 -m-1 text-[#6A717B] hover:text-red-500"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </li>
          ))}
          {incoming.map((l) => (
            <li
              key={l.id}
              className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-background-light/60 dark:bg-zinc-800/60"
            >
              <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#dde4e4] dark:bg-zinc-700 text-[#121717] dark:text-zinc-200 shrink-0">
                {INVERSE_LABEL[l.type]}
              </span>
              <Link2 className="size-3.5 text-[#6A717B] dark:text-zinc-400 shrink-0" />
              <span className="flex-1 text-sm dark:text-zinc-300 truncate">
                {l.fromTask?.title ?? "Unknown"}
              </span>
            </li>
          ))}
        </ul>
      )}

      {pickerOpen && canManage && (
        <div className="border border-[#dde4e4] dark:border-zinc-700 rounded-lg p-3 space-y-2 bg-white dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as TaskLinkType)}
              className="px-2 py-1.5 rounded-md text-xs font-bold bg-background-light dark:bg-zinc-800 dark:text-zinc-100 border border-transparent focus:border-primary2 outline-none"
            >
              <option value="blocks">Blocks</option>
              <option value="blocked_by">Blocked by</option>
              <option value="related_to">Related to</option>
            </select>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks…"
              className="flex-1 px-2 py-1.5 rounded-md text-sm bg-background-light dark:bg-zinc-800 dark:text-zinc-100 border border-transparent focus:border-primary2 outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-500"
            />
          </div>
          {filteredCandidates.length === 0 ? (
            <p className="text-xs text-[#6A717B] dark:text-zinc-400 px-1">
              No matching tasks.
            </p>
          ) : (
            <ul className="max-h-48 overflow-y-auto rounded-md border border-[#f1f4f4] dark:border-zinc-800">
              {filteredCandidates.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    disabled={createMutation.isPending}
                    onClick={() => {
                      // For "blocked_by" we flip the direction so the relation
                      // is stored consistently (source blocks target).
                      const flip = type === "blocked_by";
                      createMutation.mutate({
                        taskId: flip ? t.id : task.id,
                        targetTaskId: flip ? task.id : t.id,
                        type: flip ? "blocks" : type,
                      });
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-background-light dark:hover:bg-zinc-800 disabled:opacity-60 dark:text-zinc-200"
                  >
                    <Link2 className="size-3.5 text-[#6A717B] dark:text-zinc-400" />
                    <span className="flex-1 truncate">{t.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
};

export default TaskLinks;
