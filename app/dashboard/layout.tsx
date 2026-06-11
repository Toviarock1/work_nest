"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import DesktopOnlyGuard from "@/components/ui/DesktopOnlyGuard";
import SearchPalette from "@/components/ui/SearchPalette";
import UserAvatar from "@/components/UserAvatar";
import { fetchMyProjectsTask } from "@/services/task.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  const { data: project } = useQuery({
    queryKey: ["project-todos", projectId],
    queryFn: () => fetchMyProjectsTask(projectId),
    enabled: !!projectId, // Only run if we are in a project route
    staleTime: 1000 * 60 * 5, // Consider data "fresh" for 5 mins
  });

  const logout = useAuthStore((state) => state.logOut);

  // const logout = () => {
  //   localStorage.clear();
  //   queryClient.clear();
  //   router.push("/login");
  // };
  return (
    <AuthGuard>
      <DesktopOnlyGuard>
        <section className="bg-background-light dark:bg-background-dark text-[#121717] dark:text-white font-display">
          <div className="flex min-h-screen">
            {/* <!-- Sidebar Navigation --> */}
            <aside className="w-64 border-r border-[#f1f4f4] dark:border-[#2d3238] bg-white dark:bg-background-dark flex flex-col justify-between sticky top-0 h-screen">
              <div className="flex flex-col gap-8 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <div className="size-8 text-primary2">
                      <svg
                        fill="none"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z"
                          fill="currentColor"
                          fillRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <h1 className="text-[#121717] dark:text-white text-base font-bold leading-tight">
                      WorkNest
                    </h1>
                  </div>
                </div>
                <nav className="flex flex-col gap-1">
                  <Link
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#f1f4f4] dark:bg-[#2d3238] border-r-4 border-primary2"
                    href="/dashboard"
                  >
                    <span className="material-symbols-outlined text-primary2">
                      <Briefcase />
                    </span>
                    <p className="text-sm font-bold text-primary2">Projects</p>
                  </Link>
                </nav>
              </div>
              <div className="p-6">
                <button
                  className="btn w-full flex items-center justify-center gap-2 rounded-lg h-10 bg-primary2 text-white text-sm font-bold tracking-wide"
                  onClick={logout}
                >
                  <span className="material-symbols-outlined text-sm">
                    <LogOut />
                  </span>
                  <span>Logout</span>
                </button>
              </div>
            </aside>
            {/* <!-- Main Content Area --> */}
            <main className="flex-1 flex flex-col min-w-0">
              {/* <!-- Top Navbar --> */}
              <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-background-dark border-b border-[#f1f4f4] dark:border-[#2d3238] sticky top-0 z-10">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-2 text-sm text-[#678383]">
                    <div className="breadcrumbs text-sm">
                      {pathname !== "/dashboard" &&
                        pathname !== "/dashboard/settings" && (
                          <ul>
                            <li>
                              <Link href={"/dashboard"}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4 stroke-current"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                  ></path>
                                </svg>
                                Projects
                              </Link>
                            </li>
                            <li>
                              <a>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  className="h-4 w-4 stroke-current"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                                  ></path>
                                </svg>
                                {project?.data?.name}
                              </a>
                            </li>
                          </ul>
                        )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      // Dispatch a synthetic Cmd+K so the palette opens via its own listener.
                      window.dispatchEvent(
                        new KeyboardEvent("keydown", {
                          key: "k",
                          metaKey: true,
                          ctrlKey: true,
                        }),
                      );
                    }}
                    aria-label="Open search"
                    className="hidden md:flex items-center gap-2 px-3 h-9 rounded-lg bg-[#f1f4f4] dark:bg-[#2d3238] text-sm text-[#678383] hover:text-[#121717] dark:hover:text-white transition-colors"
                  >
                    <span>Search projects…</span>
                    <kbd className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white dark:bg-zinc-700">
                      ⌘K
                    </kbd>
                  </button>
                  <button
                    onClick={() => router.push("/dashboard/settings")}
                    className="p-2 rounded-lg bg-[#f1f4f4] dark:bg-[#2d3238] text-[#121717] dark:text-white"
                  >
                    <span className="material-symbols-outlined text-xl">
                      <Settings />
                    </span>
                  </button>
                  <div className="h-8 w-px bg-[#f1f4f4] dark:bg-[#2d3238] mx-2"></div>
                  <div className="flex items-center gap-3">
                    <UserAvatar />
                  </div>
                </div>
              </header>
              {/* <!-- Page Body --> */}
              <div className="p-8 max-w-7xl mx-auto w-full">{children}</div>
            </main>
          </div>
          <SearchPalette />
        </section>
      </DesktopOnlyGuard>
    </AuthGuard>
  );
}
