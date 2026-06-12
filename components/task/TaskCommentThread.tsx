"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import socket from "@/lib/socket";
import {
  createTaskComment,
  deleteTaskComment,
  fetchTaskComments,
} from "@/services/comment.service";
import { formatRelative } from "@/utils/formatData";
import UserAvatar from "../UserAvatar";
import BtnLoader from "../BtnLoader";
import { useAuthStore } from "@/store/useAuthStore";
import type { TaskComment } from "@/types";

interface ApiCommentsResponse {
  data?: TaskComment[];
}

interface CommentCreatedPayload {
  taskId: string;
  comment: TaskComment;
}

interface CommentDeletedPayload {
  taskId: string;
  commentId: string;
}

const TaskCommentThread = ({ taskId }: { taskId: string }) => {
  const queryClient = useQueryClient();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const queryKey = useMemo(() => ["task-comments", taskId], [taskId]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => fetchTaskComments(taskId),
    enabled: !!taskId,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<{ content: string }>({
    mode: "onChange",
  });

  const createMutation = useMutation({
    mutationFn: createTaskComment,
    onSuccess: () => {
      reset({ content: "" });
      // Socket will deliver the canonical row; this just keeps the UI
      // responsive when the user posts from the same tab.
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message || "Couldn't post comment, try again",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTaskComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message || "Couldn't delete comment, try again",
      );
    },
  });

  // Live updates from other tabs / users in the same project room.
  useEffect(() => {
    if (!taskId) return;

    const onCreated = (payload: CommentCreatedPayload) => {
      if (payload.taskId !== taskId) return;
      queryClient.setQueryData<ApiCommentsResponse>(queryKey, (old) => {
        const list = old?.data ?? [];
        if (list.some((c) => c.id === payload.comment.id)) return old;
        return { ...old, data: [...list, payload.comment] };
      });
    };

    const onDeleted = (payload: CommentDeletedPayload) => {
      if (payload.taskId !== taskId) return;
      queryClient.setQueryData<ApiCommentsResponse>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          data: (old.data ?? []).filter((c) => c.id !== payload.commentId),
        };
      });
    };

    socket.on("comment_created", onCreated);
    socket.on("comment_deleted", onDeleted);

    return () => {
      socket.off("comment_created", onCreated);
      socket.off("comment_deleted", onDeleted);
    };
  }, [taskId, queryClient, queryKey]);

  const onSubmit = (values: { content: string }) => {
    const trimmed = values.content.trim();
    if (!trimmed) return;
    createMutation.mutate({ taskId, content: trimmed });
  };

  const comments: TaskComment[] = data?.data ?? [];

  return (
    <section className="mb-10">
      <h3 className="text-sm font-bold text-[#313742] dark:text-zinc-100 mb-3">
        Comments
        {comments.length > 0 && (
          <span className="ml-2 font-normal text-[#6A717B] dark:text-zinc-400 tabular-nums">
            {comments.length}
          </span>
        )}
      </h3>

      {isLoading ? (
        <div className="space-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-3">
              <div className="skeleton size-9 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-32 rounded" />
                <div className="skeleton h-12 w-full rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-sm text-red-500 flex items-center gap-2">
          Couldn&rsquo;t load comments.
          <button
            type="button"
            onClick={() => refetch()}
            className="font-bold text-primary2 hover:underline"
          >
            Retry
          </button>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-[#6A717B] dark:text-zinc-400 italic">
          No comments yet — start the conversation.
        </p>
      ) : (
        <ul className="space-y-4">
          {comments.map((c) => {
            const isMine = c.authorId === currentUserId;
            return (
              <li key={c.id} className="flex gap-3 group">
                <UserAvatar customName={c.author?.name ?? "?"} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-bold dark:text-zinc-100">
                      {c.author?.name ?? "Unknown"}
                    </span>
                    <span
                      className="text-[11px] text-[#6A717B] dark:text-zinc-500"
                      title={new Date(c.createdAt).toLocaleString()}
                    >
                      {formatRelative(c.createdAt)}
                    </span>
                    {isMine && (
                      <button
                        type="button"
                        aria-label="Delete comment"
                        disabled={deleteMutation.isPending}
                        onClick={() => deleteMutation.mutate(c.id)}
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 -m-1 text-[#6A717B] hover:text-red-500"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-[#313742] dark:text-zinc-200 whitespace-pre-wrap wrap-break-word bg-background-light dark:bg-zinc-800 rounded-lg px-3 py-2">
                    {c.content}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex flex-col gap-2"
      >
        <textarea
          rows={3}
          placeholder="Add a comment…"
          {...register("content", {
            required: true,
            validate: (v) => v.trim().length > 0,
          })}
          className="w-full rounded-lg border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 dark:text-zinc-100 p-3 text-sm focus:border-primary2 focus:ring-1 focus:ring-primary2 outline-none resize-y placeholder:text-slate-400 dark:placeholder:text-zinc-500"
        />
        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={!isValid || createMutation.isPending}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-primary2 text-white disabled:opacity-50 hover:opacity-90 flex items-center gap-1.5"
          >
            {createMutation.isPending ? <BtnLoader /> : "Post comment"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default TaskCommentThread;
