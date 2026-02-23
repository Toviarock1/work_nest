import { useRef } from "react";
import { createProject } from "@/services/project.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CircleX } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import BtnLoader from "../BtnLoader";

const AddNewProject = ({
  show,
  close,
}: {
  show: boolean;
  close: () => void;
}) => {
  const btnRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutate, isPending } = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      toast.success("Project created");
      btnRef?.current?.click();
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.success("Somthing went wrong. try again");
    },
  });

  const onSubmitHandler = (data: any) => {
    mutate({ ...data });
  };

  return (
    show && (
      <body className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
        {/* <!-- Backdrop for Modal --> */}
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          {/* <!-- Modal Container --> */}
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl soft-shadow overflow-hidden flex flex-col max-h-[90vh]">
            {/* <!-- Header --> */}
            <div className="px-8 pt-8 pb-4 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  Create New Project
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                  Set up your workspace and start collaborating with your team.
                </p>
              </div>
              <button
                ref={btnRef}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors btn"
                onClick={close}
                disabled={isPending}
              >
                <span className="material-symbols-outlined">
                  <CircleX />
                </span>
              </button>
            </div>
            {/* <!-- Modal Body (Scrollable) --> */}
            <div className="px-8 py-4 overflow-y-auto space-y-6">
              {/* <!-- Project Name --> */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Project Name
                </label>
                <input
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary2/20 focus:border-primary2 transition-all outline-none"
                  placeholder="e.g. Q4 Marketing Campaign"
                  type="text"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">
                    {errors.name.message as string}
                  </p>
                )}
              </div>
              {/* <!-- Project Description --> */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary2/20 focus:border-primary2 transition-all outline-none resize-none"
                  placeholder="Briefly describe the goals and key deliverables..."
                  rows={3}
                  {...register("description", { required: true })}
                ></textarea>
                {errors.description && (
                  <p className="text-xs text-red-500">
                    {errors.description.message as string}
                  </p>
                )}
              </div>
              {/* <!-- Dates Grid --> */}
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Start Date
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                    calendar_today
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary2/20 focus:border-primary2 transition-all outline-none"
                    type="date"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  End Date
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                    event_upcoming
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary2/20 focus:border-primary2 transition-all outline-none"
                    type="date"
                  />
                </div>
              </div>
            </div> */}
              {/* <!-- Invite Members Section --> */}
              {/* <div className="space-y-3 pt-2"> */}
              {/* <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Invite Team Members
              </label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">
                    search
                  </span>
                  <input
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary2/20 focus:border-primary2 transition-all outline-none"
                    placeholder="Search by name or email..."
                    type="text"
                  />
                </div>
                <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  Add
                </button>
              </div> */}
              {/* <!-- Selected Members (Preview) --> */}
              {/* <div className="flex flex-wrap gap-2 mt-3">
                <div className="flex items-center gap-2 bg-primary2/10 border border-primary2/20 px-3 py-1.5 rounded-full">
                  <img
                    alt=""
                    className="w-6 h-6 rounded-full border border-white"
                    data-alt="User avatar of a team member"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqS0Z9th9OLhDq1edVdEQRWoheJGUmmBLsPJ9weNhq4mbacL6xQxdh9ndIYFb9Om0-JLDGgfJMHphgnt5nP-qXUM2oQduDnVGZQ1NdqWxasjgctcKqhYmY4dOLTN1KI8mnJXtkmbultr3cWOsqZTdLV_is1Uy7XtgCbaWi8Wi6YhxmTomlUROHFce34SEEJoD3KHQtJq4FIk5ppRDzk7VtxSnXmrkuNupB5rrGSix99NWAB1dvNOg7cwHYlx19J7Dwsil9f548YjGa"
                  />
                  <span className="text-xs font-medium text-primary2">
                    Alex Rivera
                  </span>
                  <button className="text-primary2 hover:text-slate-700 transition-colors flex items-center">
                    <span className="material-symbols-outlined text-sm">
                      close
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-2 bg-primary2/10 border border-primary2/20 px-3 py-1.5 rounded-full">
                  <img
                    alt=""
                    className="w-6 h-6 rounded-full border border-white"
                    data-alt="User avatar of a team member"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuyso6KIvaOVkWuvtEzd3NQF6X2RRvEkE68HtscJRIf4cDqx_D_apeH__GQSDQjoMNVT0I8hK05WtkW3NYB9kzANxjb1g3YyCMO0N0tqvT1diDgEdBaLe1jXfIreZGFgXygNXpAIlcaAm79pauk_6y8z1zhMp0_3vMJ-0Vrb-wJPep2U7Ge-3V8cmCTsa49Ln4qki9G5Gw0eyW-ABQ7Eipw973exd-AVsPTHUu4J0O31Qn-fVVHAw0TKFeYgDD2RBYpbMyahWPXje7"
                  />
                  <span className="text-xs font-medium text-primary2">
                    Sarah Chen
                  </span>
                  <button className="text-primary2 hover:text-slate-700 transition-colors flex items-center">
                    <span className="material-symbols-outlined text-sm">
                      close
                    </span>
                  </button>
                </div>
              </div> */}
              {/* </div> */}
            </div>
            {/* <!-- Footer / Action Buttons --> */}
            <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row justify-end gap-3 mt-auto border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={close}
                disabled={isPending}
                className="px-6 py-2.5 rounded-lg font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit(onSubmitHandler)}
                disabled={isPending}
                className="px-8 py-2.5 bg-primary2 text-white rounded-lg font-semibold shadow-md hover:bg-opacity-90 active:scale-[0.98] transition-all"
              >
                {isPending ? <BtnLoader /> : "Create Project"}
              </button>
            </div>
          </div>
        </div>
        {/* <!-- Background Content (Simulated Dashboard) --> */}
        <div className="p-10 opacity-20 pointer-events-none select-none">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="flex justify-between items-center">
              <div className="h-8 w-48 bg-slate-300 rounded"></div>
              <div className="h-10 w-10 bg-slate-300 rounded-full"></div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="h-64 bg-slate-200 rounded-xl"></div>
              <div className="h-64 bg-slate-200 rounded-xl"></div>
              <div className="h-64 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-1/4 bg-slate-300 rounded"></div>
              <div className="h-20 w-full bg-slate-200 rounded-lg"></div>
              <div className="h-20 w-full bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </body>
    )
  );
};

export default AddNewProject;
