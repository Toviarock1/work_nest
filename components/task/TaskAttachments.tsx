"use client";

import { useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Paperclip, Trash2, Upload } from "lucide-react";
import { toast } from "react-toastify";
import { deleteFile, uploadChatFile } from "@/services/file.service";
import type { TaskFileRow } from "@/types";

interface Props {
  taskId: string;
  projectId: string;
  files: TaskFileRow[];
  canManage: boolean;
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const isImage = (name: string) => /\.(jpe?g|gif|png|webp|svg)$/i.test(name);

const TaskAttachments = ({ taskId, projectId, files, canManage }: Props) => {
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["project-todos", projectId] });

  const errorToast =
    (fallback: string) => (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message || fallback);
    };

  const uploadMutation = useMutation({
    mutationFn: ({ file }: { file: File }) =>
      uploadChatFile({ projectId, file, taskId }),
    onSuccess: () => {
      invalidate();
      toast.success("Attachment uploaded");
    },
    onError: errorToast("Couldn't upload attachment"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFile,
    onSuccess: invalidate,
    onError: errorToast("Couldn't delete attachment"),
  });

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadMutation.mutate({ file });
    e.target.value = "";
  };

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-[#313742] dark:text-zinc-100">
          Attachments
          {files.length > 0 && (
            <span className="ml-2 font-normal text-[#6A717B] dark:text-zinc-400 tabular-nums">
              {files.length}
            </span>
          )}
        </h3>
        {canManage && (
          <>
            <input
              ref={inputRef}
              type="file"
              hidden
              onChange={onPick}
              disabled={uploadMutation.isPending}
            />
            <button
              type="button"
              disabled={uploadMutation.isPending}
              onClick={() => inputRef.current?.click()}
              className="text-xs font-bold text-primary2 flex items-center gap-1 hover:underline disabled:opacity-50"
            >
              <Upload className="size-3.5" />
              Upload
            </button>
          </>
        )}
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-[#6A717B] dark:text-zinc-400 italic">
          No attachments yet.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {files.map((f) => (
            <li
              key={f.id}
              className="flex items-center gap-3 px-3 py-2 rounded-lg border border-[#dde4e4] dark:border-zinc-700 bg-background-light dark:bg-zinc-800 hover:border-primary2/40 transition-colors group"
            >
              <Paperclip className="size-4 text-[#6A717B] dark:text-zinc-400 shrink-0" />
              <a
                href={f.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-bold truncate dark:text-zinc-100">
                  {f.name}
                </p>
                <p className="text-[11px] text-[#6A717B] dark:text-zinc-400 tabular-nums">
                  {formatBytes(f.size)} {isImage(f.name) ? "· image" : ""}
                </p>
              </a>
              {canManage && (
                <button
                  type="button"
                  aria-label={`Delete attachment "${f.name}"`}
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(f.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 -m-1 text-[#6A717B] hover:text-red-500"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default TaskAttachments;
