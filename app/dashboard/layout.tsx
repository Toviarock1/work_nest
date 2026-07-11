"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import SearchPalette from "@/components/ui/SearchPalette";
import UserAvatar from "@/components/UserAvatar";
import { fetchMyProjectsTask } from "@/services/task.service";
import { useAuthStore } from "@/store/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import { LogOut, Menu, Settings, X, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

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
    enabled: !!projectId,
    staleTime: 1000 * 60 * 5,
  });

  const logout = useAuthStore((state) => state.logOut);
  const user = useAuthStore((state) => state.user);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  const navItems = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard className="size-4" />,
      label: "Dashboard",
    },
    {
      href: "/dashboard/settings",
      icon: <Settings className="size-4" />,
      label: "Settings",
    },
  ];

  return (
    <AuthGuard>
      <section className="bg-background-light dark:bg-background-dark text-[#121717] dark:text-white font-display">
        <div className="flex min-h-screen">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 md:hidden"
              onClick={closeSidebar}
              aria-hidden
            />
          )}

          {/* Sidebar */}
          <aside
            className={`
              fixed inset-y-0 left-0 z-40 w-64
              bg-white dark:bg-zinc-950
              border-r border-[#f1f4f4] dark:border-zinc-800
              flex flex-col
              transition-transform duration-200 ease-in-out
              ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
              md:relative md:translate-x-0 md:flex
            `}
          >
            {/* Logo */}
            <div className="flex items-center justify-between px-5 h-16 border-b border-[#f1f4f4] dark:border-zinc-800 shrink-0">
              <div className="flex items-center gap-2.5">
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
                    />
                  </svg>
                </div>
                <span className="text-base font-extrabold tracking-tight text-[#121717] dark:text-white">
                  WorkNest
                </span>
              </div>
              <button
                className="md:hidden p-1.5 rounded-lg text-[#678383] hover:text-[#121717] dark:hover:text-white transition-colors"
                onClick={closeSidebar}
                aria-label="Close menu"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* User profile card */}
            <div className="mx-3 mt-4 p-3 rounded-xl bg-background-light dark:bg-zinc-900 flex items-center gap-3">
              <UserAvatar />
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#121717] dark:text-white truncate">
                  {user?.name ?? "—"}
                </p>
                <p className="text-[11px] text-[#678383] truncate">
                  {user?.email ?? ""}
                </p>
              </div>
            </div>

            {/* Nav */}
            <div className="flex-1 overflow-y-auto px-3 pt-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#678383] px-3 mb-2">
                Menu
              </p>
              <nav className="flex flex-col gap-0.5">
                {navItems.map(({ href, icon, label }) => {
                  const active =
                    pathname === href ||
                    (href !== "/dashboard" && pathname.startsWith(href));
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeSidebar}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                        active
                          ? "bg-primary2/10 text-primary2 font-bold"
                          : "text-[#678383] hover:bg-[#f1f4f4] dark:hover:bg-zinc-800 hover:text-[#121717] dark:hover:text-white"
                      }`}
                    >
                      <span className={active ? "text-primary2" : ""}>
                        {icon}
                      </span>
                      {label}
                      {active && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary2" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-[#f1f4f4] dark:border-zinc-800">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#678383] hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 transition-colors"
              >
                <LogOut className="size-4" />
                <span>Log out</span>
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 flex flex-col min-w-0">
            {/* Top navbar */}
            <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-white dark:bg-background-dark border-b border-[#f1f4f4] dark:border-[#2d3238] sticky top-0 z-10">
              <div className="flex items-center gap-3 flex-1">
                {/* Hamburger */}
                <button
                  className="md:hidden p-2 rounded-lg text-[#678383] hover:text-[#121717] dark:hover:text-white hover:bg-[#f1f4f4] dark:hover:bg-[#2d3238] transition-colors"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open menu"
                >
                  <Menu className="size-5" />
                </button>

                <div className="flex items-center gap-2 text-sm text-[#678383]">
                  <div className="breadcrumbs text-sm">
                    {pathname !== "/dashboard" &&
                      pathname !== "/dashboard/settings" && (
                        <ul>
                          <li>
                            <Link href="/dashboard">
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
                                />
                              </svg>
                              <span className="hidden sm:inline">Projects</span>
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
                                />
                              </svg>
                              <span className="hidden sm:inline">
                                {project?.data?.name}
                              </span>
                            </a>
                          </li>
                        </ul>
                      )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 md:gap-4">
                <button
                  type="button"
                  onClick={() => {
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
                  <Settings className="size-5" />
                </button>
                <div className="hidden sm:block h-8 w-px bg-[#f1f4f4] dark:bg-[#2d3238]" />
                <UserAvatar />
              </div>
            </header>

            {/* Page body */}
            <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
        <SearchPalette />
      </section>
    </AuthGuard>
  );
}
