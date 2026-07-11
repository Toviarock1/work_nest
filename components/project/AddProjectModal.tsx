import { X, Mail, UserPlus, Users } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  email: string;
}

const AddProjectMemberModal = ({
  projectName,
  show,
  close,
  onSubmit,
  isLoading,
}: {
  projectName: string;
  show: boolean;
  close: () => void;
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show, close]);

  return (
    show && (
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
              disabled={isLoading}
              aria-label="Close"
              className="size-9 flex items-center justify-center rounded-full text-[#678383] hover:text-[#121717] dark:hover:text-white hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Hero section */}
          <div className="flex flex-col items-center text-center gap-4 px-8 pt-2 pb-7">
            <div className="size-16 rounded-2xl bg-primary2/10 flex items-center justify-center text-primary2">
              <Users className="size-8" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-2xl font-black tracking-tight">
                Need more hands?
              </h3>
              <p className="text-sm text-[#678383] font-medium leading-relaxed max-w-xs mx-auto">
                Invite external freelancers or clients by their email to
                collaborate on{" "}
                <span className="text-primary2 font-bold">{projectName}</span>.
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="px-6 sm:px-8 flex flex-col gap-2">
            <label
              className="text-sm font-bold text-[#121717] dark:text-white"
              htmlFor="email"
            >
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#678383]" />
              <input
                className="w-full h-14 pl-12 pr-4 bg-background-light dark:bg-zinc-800 border border-[#dde4e4] dark:border-zinc-700 rounded-2xl text-base placeholder:text-[#678383] focus:outline-none focus:ring-2 focus:ring-primary2/30 focus:border-primary2 transition"
                id="email"
                placeholder="colleague@company.com"
                type="email"
                autoComplete="email"
                {...register("email", {
                  required: "Enter the member's email address",
                })}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 font-medium">
                {errors.email.message as string}
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 sm:px-8 pt-5 pb-8 sm:pb-6 flex flex-col sm:flex-row-reverse gap-3">
            <button
              disabled={isLoading}
              onClick={handleSubmit(onSubmit)}
              className="flex-1 h-14 sm:h-12 rounded-2xl bg-primary2 text-white text-base font-bold shadow-lg shadow-primary2/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="loading loading-dots loading-sm" />
              ) : (
                <>
                  <UserPlus className="size-5" />
                  <span>Send Invitation</span>
                </>
              )}
            </button>
            <button
              disabled={isLoading}
              onClick={close}
              className="flex-1 h-14 sm:h-12 rounded-2xl text-base font-bold text-[#678383] bg-[#f1f4f4] dark:bg-zinc-800 hover:text-[#121717] dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AddProjectMemberModal;
