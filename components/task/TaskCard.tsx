import { Calendar, Eye } from "lucide-react";
import { TasksType } from "@/types";
import { formatDate } from "@/utils/formatData";
import UserAvatar from "../UserAvatar";
import type { PresenceUser } from "@/hooks/useProjectPresence";

const STATUS_PILL: Record<
  "todo" | "in_progress" | "done",
  { label: string; classes: string }
> = {
  todo: {
    label: "To Do",
    classes: "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-300",
  },
  in_progress: {
    label: "In Progress",
    classes:
      "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
  },
  done: {
    label: "Done",
    classes:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300",
  },
};

const TaskCard = ({
  task,
  onViewTask,
  showStatusPill = false,
  viewers,
}: {
  task: TasksType;
  onViewTask: () => void;
  /** Show a status pill — useful when a card appears outside its native column. */
  showStatusPill?: boolean;
  /** Other users currently viewing this task. */
  viewers?: PresenceUser[];
}) => {
  const status = STATUS_PILL[task.status as keyof typeof STATUS_PILL];

  const watchers = viewers ?? [];
  const watcherTitle =
    watchers.length > 0
      ? `Viewing now: ${watchers.map((v) => v.name ?? "Member").join(", ")}`
      : undefined;

  return (
    <div
      className="relative bg-white dark:bg-zinc-900 p-4 rounded-xl border border-[#dde4e4] dark:border-zinc-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group cursor-grab active:cursor-grabbing"
      onClick={onViewTask}
    >
      {watchers.length > 0 && (
        <div
          title={watcherTitle}
          aria-label={watcherTitle}
          className="absolute -top-1 -right-1 flex items-center gap-1 pl-1.5 pr-2 py-0.5 rounded-full bg-primary2 text-white text-[10px] font-bold shadow ring-2 ring-white dark:ring-zinc-900 animate-pulse"
        >
          <Eye className="size-3" />
          {watchers.length}
        </div>
      )}
      {showStatusPill && status && (
        <div className="mb-2">
          <span
            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${status.classes}`}
          >
            {status.label}
          </span>
        </div>
      )}
      <h4 className="text-sm font-bold leading-snug mb-3 dark:text-zinc-100 line-clamp-2">
        {task.title}
      </h4>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center text-[#678383] dark:text-zinc-400 text-xs font-medium tabular-nums">
          <Calendar className="size-3.5 mr-1.5" />
          {formatDate(task.createdAt)}
        </div>
        <div
          title={task.assignedTo?.name ?? "Unassigned"}
          className="shrink-0 ring-2 ring-white dark:ring-zinc-900 rounded-xl"
        >
          <UserAvatar
            size="sm"
            customName={task.assignedTo?.name ?? "Unassigned"}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
