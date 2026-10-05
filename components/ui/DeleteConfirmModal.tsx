import { Trash2, X } from "lucide-react";
import { useEffect } from "react";

interface DeleteConfirmModalProps {
  show: boolean;
  close: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  confirmLabel?: string;
  isLoading?: boolean;
}

const DeleteConfirmModal = ({
  show,
  close,
  onConfirm,
  title = "Delete this item?",
  message = "This action cannot be undone.",
  itemName,
  confirmLabel = "Delete",
  isLoading = false,
}: DeleteConfirmModalProps) => {
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
      aria-label={title}
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm"
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
            disabled={isLoading}
            aria-label="Close"
            className="size-9 flex items-center justify-center rounded-full text-[#678383] hover:text-[#121717] dark:hover:text-white hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 transition-colors disabled:opacity-60"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Hero section */}
        <div className="flex flex-col items-center text-center gap-4 px-8 pt-2 pb-7">
          <div className="size-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
            <Trash2 className="size-8" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-black tracking-tight">{title}</h3>
            <p className="text-sm text-[#678383] font-medium leading-relaxed max-w-xs mx-auto">
              {itemName ? (
                <>
                  <span className="text-[#121717] dark:text-white font-bold break-words">
                    &ldquo;{itemName}&rdquo;
                  </span>{" "}
                  will be permanently removed.{" "}
                </>
              ) : null}
              {message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 pt-1 pb-8 sm:pb-6 flex flex-col sm:flex-row-reverse gap-3">
          <button
            disabled={isLoading}
            onClick={onConfirm}
            className="flex-1 h-14 sm:h-12 rounded-2xl bg-red-500 text-white text-base font-bold shadow-lg shadow-red-500/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? (
              <span className="loading loading-dots loading-sm" />
            ) : (
              <>
                <Trash2 className="size-5" />
                <span>{confirmLabel}</span>
              </>
            )}
          </button>
          <button
            disabled={isLoading}
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

export default DeleteConfirmModal;
