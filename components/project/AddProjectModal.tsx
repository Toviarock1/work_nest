import { X, Mail, UserPlus } from "lucide-react";
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
      <section className="bg-background-light dark:bg-background-dark font-display text-[#121717] dark:text-white transition-colors duration-200">
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl shadow-2xl border border-[#dde4e4] dark:border-zinc-800 overflow-hidden">
            <div className="px-6 py-5 border-b border-[#dde4e4] dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black tracking-tight">
                  Add Project Member
                </h3>
                <p className="text-xs text-[#678383] font-medium">
                  Inviting people to{" "}
                  <span className="text-primary2 font-bold">{projectName}</span>
                </p>
              </div>
              <button
                onClick={close}
                disabled={isLoading}
                className="text-[#678383]  hover:text-[#121717] dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined">
                  <X />
                </span>
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <label
                    className="block text-xs font-black uppercase tracking-widest text-[#678383] mb-2"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <div className="relative flex items-center">
                    <span className="material-symbols-outlined absolute left-3 text-[#678383] text-[20px]">
                      <Mail />
                    </span>
                    <input
                      className="w-full h-11 pl-10 pr-4 bg-background-light dark:bg-zinc-800 border-none rounded-xl text-sm placeholder:text-[#678383] focus:ring-2 focus:ring-primary2/20"
                      id="email"
                      placeholder="jane@example.com"
                      type="email"
                      {...register("email", { required: "Email required" })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500">
                      {errors.email.message as string}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6 bg-background-light dark:bg-zinc-800/50 flex items-center justify-end gap-3">
              <button
                disabled={isLoading}
                onClick={close}
                className="btn px-6 h-11 rounded-xl text-sm font-bold text-[#678383] hover:text-[#121717] dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isLoading}
                onClick={handleSubmit(onSubmit)}
                className="btn px-8 h-11 rounded-xl bg-primary2 text-white text-sm font-bold shadow-lg shadow-primary2/20 hover:brightness-110 transition-all flex items-center"
              >
                {isLoading ? (
                  <span className="loading loading-dots loading-xl"></span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px] mr-2">
                      <UserPlus />
                    </span>
                    Add
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  );
};

export default AddProjectMemberModal;
