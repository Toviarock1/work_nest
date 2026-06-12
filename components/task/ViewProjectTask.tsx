import { useUser } from "@/hooks/useUser";
import { deleteTask, updateTask } from "@/services/task.service";
import { assignTask, fetchProjectMembers } from "@/services/project.service";
import { ProjectMembersType, TasksType } from "@/types";
import { formatDate } from "@/utils/formatData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  X,
  LayoutGrid,
  Calendar,
  Trash2,
  ChevronDown,
  Check,
  Pencil,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";
import { toast } from "react-toastify";
import BtnLoader from "../BtnLoader";
import UserAvatar from "../UserAvatar";

type TaskStatus = "todo" | "in_progress" | "done";

const STATUS_OPTIONS: { value: TaskStatus; label: string; classes: string }[] =
  [
    {
      value: "todo",
      label: "To Do",
      classes:
        "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-200",
    },
    {
      value: "in_progress",
      label: "In Progress",
      classes:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    },
    {
      value: "done",
      label: "Done",
      classes:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    },
  ];

const ViewProjectTask = ({
  show,
  close,
  data,
  ownerId,
  projectId,
}: {
  show: boolean;
  close: () => void;
  onSubmit?: (data: { title: string; description: string }) => void;
  data: TasksType;
  ownerId: string;
  projectId: string;
}) => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const isOwner = ownerId === user?.id;

  const assigneePickerRef = useRef<HTMLDivElement>(null);
  const statusPickerRef = useRef<HTMLDivElement>(null);
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const [assigneeQuery, setAssigneeQuery] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(data?.title ?? "");
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionDraft, setDescriptionDraft] = useState(
    data?.description ?? "",
  );
  const [confirmDelete, setConfirmDelete] = useState(false);

  // ESC to close
  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show, close]);

  // Broadcast which task is being viewed so other members of the project see
  // a live indicator on the card.
  useEffect(() => {
    if (!show || !data?.id || !projectId) return;
    socket.emit("task:viewing", { projectId, taskId: data.id });
    return () => {
      socket.emit("task:viewing", { projectId, taskId: null });
    };
  }, [show, data?.id, projectId]);

  // click-outside for both pickers
  useEffect(() => {
    if (!assigneeOpen && !statusOpen) return;
    const onClick = (e: MouseEvent) => {
      if (
        assigneeOpen &&
        assigneePickerRef.current &&
        !assigneePickerRef.current.contains(e.target as Node)
      ) {
        setAssigneeOpen(false);
      }
      if (
        statusOpen &&
        statusPickerRef.current &&
        !statusPickerRef.current.contains(e.target as Node)
      ) {
        setStatusOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [assigneeOpen, statusOpen]);

  const { data: members } = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => fetchProjectMembers(projectId),
    enabled: !!projectId && isOwner,
  });

  const invalidateTodos = () =>
    queryClient.invalidateQueries({ queryKey: ["project-todos", projectId] });

  const { mutate: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast.success("Task deleted");
      invalidateTodos();
      close();
    },
    onError: () => toast.error("Something went wrong, try again"),
  });

  const { mutate: updateMutate, isPending: isUpdating } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      toast.success("Task updated");
      invalidateTodos();
      setEditingTitle(false);
      setEditingDescription(false);
      setStatusOpen(false);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(
        error?.response?.data?.message || "Couldn't update task, try again",
      );
    },
  });

  const { mutate: assignMutate, isPending: isAssigning } = useMutation({
    mutationFn: assignTask,
    onSuccess: () => {
      toast.success("Assignee updated");
      invalidateTodos();
      setAssigneeOpen(false);
    },
    onError: () => toast.error("Couldn't update assignee, try again"),
  });

  if (!show || !data) return null;

  const currentStatus =
    STATUS_OPTIONS.find((s) => s.value === (data.status as TaskStatus)) ??
    STATUS_OPTIONS[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 h-full soft-shadow flex flex-col border-l border-[#dde4e4] dark:border-zinc-800 animate-[slideInRight_200ms_ease-out]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-[#dde4e4] dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-[#6A717B] dark:text-zinc-400">
            <LayoutGrid className="size-4" />
            Task Overview
          </div>
          <div className="flex items-center gap-2">
            <div className="relative" ref={statusPickerRef}>
              <button
                type="button"
                disabled={!isOwner || isUpdating}
                onClick={() => setStatusOpen((p) => !p)}
                className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-lg transition-opacity ${currentStatus.classes} ${isOwner ? "hover:opacity-90 cursor-pointer" : "cursor-default"} disabled:opacity-60`}
              >
                {currentStatus.label}
                {isOwner && <ChevronDown className="size-3" />}
              </button>
              {statusOpen && (
                <div className="absolute right-0 z-10 mt-2 w-44 rounded-lg border border-[#dde4e4] dark:border-zinc-700 bg-white dark:bg-zinc-900 soft-shadow py-1">
                  {STATUS_OPTIONS.map((s) => {
                    const selected = s.value === data.status;
                    return (
                      <button
                        key={s.value}
                        type="button"
                        disabled={isUpdating || selected}
                        onClick={() =>
                          updateMutate({ taskId: data.id, status: s.value })
                        }
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-background-light dark:hover:bg-zinc-800 disabled:opacity-60 dark:text-zinc-200"
                      >
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded ${s.classes}`}
                        >
                          {s.label}
                        </span>
                        {selected && (
                          <Check className="ml-auto size-4 text-primary2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="p-2 text-[#6A717B] dark:text-zinc-400 hover:bg-background-light dark:hover:bg-zinc-800 rounded-lg"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-10 py-8">
          {/* Title */}
          <div className="mb-8">
            {isOwner && editingTitle ? (
              <div className="flex flex-col gap-3 mb-6">
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  className="w-full text-2xl font-extrabold text-[#313742] dark:text-zinc-100 bg-transparent border-b-2 border-primary2 focus:outline-none pb-1"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    disabled={isUpdating}
                    onClick={() => {
                      setEditingTitle(false);
                      setTitleDraft(data.title ?? "");
                    }}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg text-[#6A717B] dark:text-zinc-400 hover:bg-background-light dark:hover:bg-zinc-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={
                      isUpdating ||
                      titleDraft.trim().length < 3 ||
                      titleDraft.trim() === (data.title ?? "").trim()
                    }
                    onClick={() =>
                      updateMutate({
                        taskId: data.id,
                        title: titleDraft.trim(),
                      })
                    }
                    className="px-4 py-1.5 text-xs font-bold rounded-lg bg-primary2 text-white disabled:opacity-50 hover:opacity-90 flex items-center gap-1.5"
                  >
                    {isUpdating ? <BtnLoader /> : "Save"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="group flex items-start gap-3 mb-6">
                <h1 className="text-3xl font-extrabold text-[#313742] dark:text-zinc-100 leading-tight flex-1">
                  {data.title}
                </h1>
                {isOwner && (
                  <button
                    type="button"
                    onClick={() => {
                      setTitleDraft(data.title ?? "");
                      setEditingTitle(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-[#6A717B] dark:text-zinc-400 hover:bg-background-light dark:hover:bg-zinc-800 transition-opacity"
                    aria-label="Edit title"
                  >
                    <Pencil className="size-4" />
                  </button>
                )}
              </div>
            )}
            <div className="grid grid-cols-2 gap-y-6 gap-x-12 border-y border-[#f1f4f4] dark:border-zinc-800 py-6">
              {/* Assignee */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-bold text-[#6A717B] dark:text-zinc-400 tracking-wider">
                  Assignee
                </span>
                {isOwner ? (
                  <div className="relative" ref={assigneePickerRef}>
                    <button
                      type="button"
                      disabled={isAssigning}
                      onClick={() => {
                        setAssigneeOpen((p) => !p);
                        setAssigneeQuery("");
                      }}
                      className="flex items-center gap-3 w-full rounded-lg border border-transparent hover:border-[#dde4e4] dark:hover:border-zinc-700 hover:bg-background-light dark:hover:bg-zinc-800 px-2 py-1 -mx-2 transition-colors disabled:opacity-60"
                    >
                      <UserAvatar
                        customName={data.assignedTo?.name ?? "Unassigned"}
                      />
                      <span className="text-sm font-semibold dark:text-zinc-200 flex-1 text-left">
                        {isAssigning
                          ? "Updating…"
                          : (data.assignedTo?.name ?? "Unassigned")}
                      </span>
                      <ChevronDown className="size-4 text-[#6A717B] dark:text-zinc-400" />
                    </button>
                    {assigneeOpen &&
                      (() => {
                        const all = members?.data?.projectMembers ?? [];
                        const q = assigneeQuery.trim().toLowerCase();
                        const filtered = q
                          ? all.filter(
                              (m: ProjectMembersType) =>
                                m.user.name?.toLowerCase().includes(q) ||
                                m.user.email?.toLowerCase().includes(q),
                            )
                          : all;
                        return (
                          <div className="absolute z-10 mt-2 w-64 max-h-80 overflow-hidden rounded-lg border border-[#dde4e4] dark:border-zinc-700 bg-white dark:bg-zinc-900 soft-shadow flex flex-col">
                            {all.length > 5 && (
                              <div className="p-2 border-b border-[#f1f4f4] dark:border-zinc-800">
                                <input
                                  autoFocus
                                  type="text"
                                  value={assigneeQuery}
                                  onChange={(e) =>
                                    setAssigneeQuery(e.target.value)
                                  }
                                  placeholder="Search members…"
                                  className="w-full px-2 py-1.5 text-sm rounded-md bg-background-light dark:bg-zinc-800 border border-transparent focus:border-primary2 focus:ring-1 focus:ring-primary2 outline-none dark:text-zinc-100 dark:placeholder:text-zinc-500"
                                />
                              </div>
                            )}
                            <div className="overflow-y-auto py-1 flex-1">
                              {all.length === 0 ? (
                                <p className="px-3 py-2 text-xs text-[#6A717B] dark:text-zinc-400">
                                  No members available
                                </p>
                              ) : filtered.length === 0 ? (
                                <p className="px-3 py-2 text-xs text-[#6A717B] dark:text-zinc-400">
                                  No matches for &ldquo;{assigneeQuery}&rdquo;
                                </p>
                              ) : (
                                filtered.map((member: ProjectMembersType) => {
                                  const selected =
                                    data.assignedTo?.email ===
                                    member.user.email;
                                  return (
                                    <button
                                      type="button"
                                      key={member.id}
                                      disabled={isAssigning || selected}
                                      onClick={() =>
                                        assignMutate({
                                          taskId: data.id,
                                          projectId,
                                          assigneeEmail: member.user.email,
                                        })
                                      }
                                      className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-background-light dark:hover:bg-zinc-800 disabled:opacity-60"
                                    >
                                      <UserAvatar
                                        customName={member.user.name}
                                      />
                                      <span className="text-sm font-medium dark:text-zinc-200 flex-1 truncate">
                                        {member.user.name}
                                      </span>
                                      {selected && (
                                        <Check className="size-4 text-primary2" />
                                      )}
                                    </button>
                                  );
                                })
                              )}
                            </div>
                          </div>
                        );
                      })()}
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      customName={data.assignedTo?.name ?? "Unassigned"}
                    />
                    <span className="text-sm font-semibold dark:text-zinc-200">
                      {data.assignedTo?.name ?? "Unassigned"}
                    </span>
                  </div>
                )}
              </div>
              {/* Dates */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-bold text-[#6A717B] dark:text-zinc-400 tracking-wider">
                  Dates
                </span>
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-background-light dark:bg-zinc-800 flex items-center justify-center text-[#6A717B] dark:text-zinc-400">
                    <Calendar className="size-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold dark:text-zinc-200">
                      {formatDate(data.createdAt)}
                    </span>
                    {data.updatedAt && data.updatedAt !== data.createdAt && (
                      <span className="text-[11px] text-[#6A717B] dark:text-zinc-400">
                        Updated {formatDate(data.updatedAt)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <section className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#313742] dark:text-zinc-100">
                Description
              </h3>
              {isOwner && !editingDescription && (
                <button
                  type="button"
                  onClick={() => {
                    setDescriptionDraft(data.description ?? "");
                    setEditingDescription(true);
                  }}
                  className="text-xs font-bold text-primary2 flex items-center gap-1 hover:underline"
                >
                  <Pencil className="size-3.5" /> Edit
                </button>
              )}
            </div>
            <div className="text-[#313742] dark:text-zinc-300 text-sm leading-relaxed space-y-4">
              {isOwner && editingDescription ? (
                <div className="flex flex-col gap-3">
                  <textarea
                    autoFocus
                    rows={6}
                    value={descriptionDraft}
                    onChange={(e) => setDescriptionDraft(e.target.value)}
                    placeholder="Add some details about this task..."
                    className="w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-zinc-100 p-3 text-sm focus:border-primary2 focus:ring-1 focus:ring-primary2 outline-none resize-y placeholder:text-slate-400 dark:placeholder:text-zinc-500"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => {
                        setEditingDescription(false);
                        setDescriptionDraft(data.description ?? "");
                      }}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg text-[#6A717B] dark:text-zinc-400 hover:bg-background-light dark:hover:bg-zinc-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={
                        isUpdating ||
                        descriptionDraft.trim() ===
                          (data.description ?? "").trim()
                      }
                      onClick={() =>
                        updateMutate({
                          taskId: data.id,
                          description: descriptionDraft.trim(),
                        })
                      }
                      className="px-4 py-1.5 text-xs font-bold rounded-lg bg-primary2 text-white disabled:opacity-50 hover:opacity-90 flex items-center gap-1.5"
                    >
                      {isUpdating ? <BtnLoader /> : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <p className={data.description ? "" : "italic opacity-70"}>
                  {data.description || "No description yet."}
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        {isOwner && (
          <div className="p-6 border-t border-[#dde4e4] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between">
            {confirmDelete ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-[#313742] dark:text-zinc-200">
                  Delete this task?
                </span>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => deleteMutate(data.id)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-500 text-white hover:opacity-90 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isDeleting ? <BtnLoader /> : "Yes, delete"}
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg text-[#6A717B] dark:text-zinc-400 hover:bg-background-light dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-sm font-bold text-red-500 dark:text-red-400 flex items-center gap-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-lg transition-colors"
              >
                <Trash2 className="size-4" />
                Delete Task
              </button>
            )}
            <button
              type="button"
              onClick={close}
              disabled={isDeleting}
              className="px-5 py-2.5 text-sm font-bold text-[#6A717B] dark:text-zinc-400 hover:bg-background-light dark:hover:bg-zinc-800 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProjectTask;
