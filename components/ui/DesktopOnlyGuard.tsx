import { Monitor, Info } from "lucide-react";

const DesktopOnlyGuard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex md:hidden min-h-screen w-full flex-col items-center justify-center text-center">
        {/* <!-- Main Content Area --> */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-xl soft-shadow p-8 md:p-12 text-center border border-slate-100 dark:border-slate-800">
            {/* <!-- Illustration / Icon Container --> */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 bg-primary2/5 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary2 text-6xl">
                    <Monitor />
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm">
                  <span className="material-symbols-outlined text-amber-500 text-2xl">
                    <Info />
                  </span>
                </div>
              </div>
            </div>
            {/* <!-- Text Content --> */}
            <div className="space-y-4 mb-10">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
                Experience the full power on Desktop
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg leading-relaxed max-w-md mx-auto">
                Our dashboard is optimized for larger screens to provide you
                with the best management and collaboration tools. Please log in
                from a laptop or desktop computer.
              </p>
            </div>

            {/* <!-- Supplemental Image/Visual --> */}
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
                Optimized for Productivity
              </p>
              <div className="grid grid-cols-3 gap-4 opacity-50">
                <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                <div className="h-1 bg-primary2/40 rounded-full"></div>
                <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              </div>
            </div>
          </div>
        </main>
        {/* <!-- Footer Area --> */}

        {/* <!-- Abstract Background Elements --> */}
        <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden opacity-30 dark:opacity-10">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary2/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-primary2/5 rounded-full blur-[100px]"></div>
        </div>
      </div>
      <div className="hidden md:block">{children}</div>
    </>
  );
};

export default DesktopOnlyGuard;
