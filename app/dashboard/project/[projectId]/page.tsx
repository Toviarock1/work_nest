"use client";
import { useEffect, useState } from "react";
import TaskSkeleton from "@/components/skeleton/TaskSkeleton";
import QueryError from "@/components/ui/QueryError";
import AddTaskModal from "@/components/task/AddTaskModal";
import TaskBoard from "@/components/task/TaskBoard";
import FilesView from "@/components/file/Files";
import { type DropResult } from "@hello-pangea/dnd";
import { AxiosError } from "axios";
import { useProjectSocket } from "@/hooks/useProjectSocket";
import { useProjectAwareness } from "@/hooks/useProjectAwareness";
import { useAuthStore } from "@/store/useAuthStore";
import {
  createTask,
  fetchMyProjectsTask,
  updateTask,
} from "@/services/task.service";
import { TasksType } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BadgeCheck,
  ChevronLeft,
  MessagesSquare,
  Folder,
  Plus,
  Users,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "react-toastify";
import ProjectMembers from "@/components/project/ProjectMembers";
import {
  addProjectMembers,
  assignTask,
  fetchProjectMembers,
  removeProjectMembers,
} from "@/services/project.service";
import AddProjectMemberModal from "@/components/project/AddProjectModal";
import ChatPanel from "@/components/project/ChatPanel";
import PresenceStack from "@/components/project/PresenceStack";
import ViewProjectTask from "@/components/task/ViewProjectTask";
import { useProjectPresence } from "@/hooks/useProjectPresence";

export default function ProjectsPage() {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectMemberModal, setShowProjectMemberModal] = useState(false);
  const [currentPath, setCurrentPath] = useState("tasks");
  const [currentTask, setCurrentTask] = useState("");
  const [viewTask, setViewTask] = useState(false);
  const queryClient = useQueryClient();
  const params = useParams();
  const projectId = params.projectId as string;

  useProjectSocket(projectId);
  const currentUserId = useAuthStore((s) => s.user?.id);

  const { unreadMessages } = useProjectAwareness({
    projectId,
    currentUserId,
    isMessagesTabActive: currentPath === "messages",
  });
  const { users: presentUsers, taskViewers } = useProjectPresence(projectId);

  // Press `n` to open the New Task modal while on the Tasks tab. Ignored when
  // the user is typing in a form field or any modal is already open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "n") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        target?.isContentEditable ||
        showTaskModal ||
        showProjectMemberModal ||
        viewTask ||
        currentPath !== "tasks"
      ) {
        return;
      }
      e.preventDefault();
      setShowTaskModal(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [currentPath, showTaskModal, showProjectMemberModal, viewTask]);

  const {
    data: todos,
    isLoading: todosLoading,
    isError: todosError,
    refetch: refetchTodos,
  } = useQuery({
    queryKey: ["project-todos", projectId],
    queryFn: () => fetchMyProjectsTask(projectId),
    enabled: !!projectId,
  });

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: () => fetchProjectMembers(projectId),
    enabled: !!projectId,
  });

  // Keep the browser tab title in sync with the current project. Restore the
  // previous title on unmount so a return to /dashboard doesn't carry a stale name.
  useEffect(() => {
    const previous = document.title;
    return () => {
      document.title = previous;
    };
  }, []);

  useEffect(() => {
    const name = (todos as { data?: { name?: string } } | undefined)?.data
      ?.name;
    if (name) document.title = `${name} · WorkNest`;
  }, [todos]);

  // Errors for these three are handled inside addNewTaskHandler's try/catch and
  // by updateTaskMutation's own onError. The no-op onError stops the global
  // mutationCache toast from double-firing alongside the catch.
  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onError: () => {},
  });

  const assignMutation = useMutation({
    mutationFn: assignTask,
    onError: () => {},
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    // Optimistic: update the cached task list immediately so cards don't
    // snap back during the network round trip. We snapshot the previous
    // state and roll back inside onError if the request fails.
    onMutate: async (variables) => {
      const key = ["project-todos", projectId];
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key);
      queryClient.setQueryData(key, (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const root = old as { data?: { tasks?: TasksType[] } };
        const tasks = root.data?.tasks;
        if (!Array.isArray(tasks)) return old;
        return {
          ...root,
          data: {
            ...root.data,
            tasks: tasks.map((t) =>
              t.id === variables.taskId
                ? {
                    ...t,
                    ...(variables.status !== undefined && {
                      status: variables.status,
                    }),
                    ...(variables.title !== undefined && {
                      title: variables.title,
                    }),
                    ...(variables.description !== undefined && {
                      description: variables.description,
                    }),
                  }
                : t,
            ),
          },
        };
      });
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-todos", projectId] });
    },
    onError: (err: AxiosError<{ message?: string }>, _vars, ctx) => {
      // Roll back to the snapshot we took before the optimistic write.
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData(["project-todos", projectId], ctx.previous);
      }
      toast.error(err.response?.data?.message || "Couldn't update task");
    },
  });

  const {
    mutate: membersMutation,
    isPending: addMemberLoading,
    variables,
  } = useMutation({
    mutationFn: async (data: {
      projectId: string;
      userEmail: string;
      type: "add" | "remove";
    }) => {
      const payload = { projectId: data.projectId, userEmail: data.userEmail };
      return data.type === "add"
        ? addProjectMembers(payload)
        : removeProjectMembers(payload);
    },
    onSuccess: (_, data) => {
      if (data.type === "add") {
        setShowProjectMemberModal(false);
      }
      toast.success(`Successfully ${data.type}ed member`);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to add member");
    },
  });

  const todosData = todos?.data?.tasks?.filter(
    (task: TasksType) => task.status === "todo",
  );
  const inProgressData = todos?.data?.tasks?.filter(
    (task: TasksType) => task.status === "in_progress",
  );
  const doneData = todos?.data?.tasks?.filter(
    (task: TasksType) => task.status === "done",
  );
  // console.log(todosData);

  const STATUS_LABELS: Record<"todo" | "in_progress" | "done", string> = {
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    const fromStatus = source.droppableId as "todo" | "in_progress" | "done";
    const toStatus = destination.droppableId as "todo" | "in_progress" | "done";

    updateTaskMutation.mutate(
      { taskId: draggableId, status: toStatus },
      {
        onSuccess: () => {
          toast.info(
            ({ closeToast }) => (
              <div className="flex items-center justify-between gap-3 w-full">
                <span>Moved to {STATUS_LABELS[toStatus]}</span>
                <button
                  type="button"
                  onClick={() => {
                    updateTaskMutation.mutate({
                      taskId: draggableId,
                      status: fromStatus,
                    });
                    closeToast?.();
                  }}
                  className="font-bold text-primary2 hover:underline"
                >
                  Undo
                </button>
              </div>
            ),
            { autoClose: 5000 },
          );
        },
      },
    );
  };

  const addNewTaskHandler = async (data: {
    title: string;
    description: string;
    assignee: string;
    status: "todo" | "in_progress" | "done";
  }) => {
    try {
      const newTask = await createTaskMutation.mutateAsync({
        title: data.title,
        description: data.description,
        projectId,
      });

      if (data.assignee && newTask.data.id) {
        await assignMutation.mutateAsync({
          taskId: newTask.data.id,
          assigneeEmail: data.assignee,
          projectId,
        });
      }

      if (data.status && data.status !== "todo" && newTask.data.id) {
        await updateTaskMutation.mutateAsync({
          taskId: newTask.data.id,
          status: data.status,
        });
      }

      setShowTaskModal(false);
      toast.success("Task created!");
      queryClient.invalidateQueries({ queryKey: ["project-todos", projectId] });
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Failed to create task");
    }
  };
  const addMemberHandler = (data: { email: string }) => {
    membersMutation({ userEmail: data.email, projectId, type: "add" });
  };
  const removeMemberHandler = (email: string) => {
    membersMutation({ userEmail: email, projectId, type: "remove" });
  };

  const viewTaskHandler = (taskId: string) => {
    setCurrentTask(taskId);
    setViewTask(true);
  };

  return todosLoading ? (
    <TaskSkeleton />
  ) : todosError ? (
    <div className="p-8">
      <QueryError
        message="We couldn't load this project. Check your connection and try again."
        onRetry={() => refetchTodos()}
      />
    </div>
  ) : (
    <section className="bg-background-light dark:bg-background-dark font-display text-[#121717] dark:text-white transition-colors duration-200">
      <div className="flex h-screen overflow-hidden">
        {/* <!-- Main Content Area --> */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col">
            {/* <!-- PageHeading & Tabs --> */}
            <div className="bg-white dark:bg-zinc-950 pt-6 px-8 border-b border-[#dde4e4] dark:border-zinc-800">
              <div className="flex items-end justify-between mb-6">
                <div className="min-w-0">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#678383] hover:text-primary2 transition-colors mb-2"
                  >
                    <ChevronLeft className="size-3.5" />
                    All projects
                  </Link>
                  <h2 className="text-xl font-extrabold tracking-tight dark:text-white truncate">
                    {todos.data.name}
                  </h2>
                  <p className="text-[#678383] text-sm mt-0.5 whitespace-pre-wrap">
                    {todos.data.description
                      ? todos.data.description
                      : "No description yet."}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <PresenceStack
                    users={presentUsers}
                    currentUserId={currentUserId}
                  />
                  {currentPath === "tasks" && (
                    <button
                      onClick={() => setShowTaskModal(true)}
                      className="btn flex items-center px-4 h-10 rounded-lg bg-primary2 text-white text-sm font-bold shadow-md shadow-primary2/20 hover:brightness-110"
                    >
                      <span className="material-symbols-outlined text-[20px] mr-2">
                        <Plus />
                      </span>
                      <span>New Task</span>
                    </button>
                  )}
                  {currentPath === "members" && (
                    <button
                      onClick={() => setShowProjectMemberModal(true)}
                      className="btn flex items-center px-4 h-10 rounded-lg bg-primary2 text-white text-sm font-bold shadow-md shadow-primary2/20 hover:brightness-110"
                    >
                      <span className="material-symbols-outlined text-[20px] mr-2">
                        <UserPlus />
                      </span>
                      <span>Add Member</span>
                    </button>
                  )}
                </div>
              </div>
              {/* Tabs */}
              <div className="flex gap-8">
                {[
                  {
                    key: "tasks" as const,
                    label: "Tasks",
                    icon: <BadgeCheck />,
                    count: todos?.data?.tasks?.length as number | undefined,
                    isUnread: false,
                  },
                  {
                    key: "messages" as const,
                    label: "Messages",
                    icon: <MessagesSquare />,
                    count:
                      unreadMessages > 0
                        ? unreadMessages
                        : (undefined as number | undefined),
                    isUnread: unreadMessages > 0,
                  },
                  {
                    key: "files" as const,
                    label: "Files",
                    icon: <Folder />,
                    count: undefined as number | undefined,
                    isUnread: false,
                  },
                  {
                    key: "members" as const,
                    label: "Members",
                    icon: <Users />,
                    count: members?.data?.projectMembers?.length as
                      | number
                      | undefined,
                    isUnread: false,
                  },
                ].map((tab) => {
                  const isActive = currentPath === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setCurrentPath(tab.key)}
                      className={`${isActive ? "border-primary2 text-primary2 border-b-2" : "text-[#678383]"} flex cursor-pointer items-center justify-center pb-3 px-1 font-bold text-sm hover:text-primary2 transition-colors`}
                    >
                      <span className="text-[20px] mr-2">{tab.icon}</span>
                      {tab.label}
                      {typeof tab.count === "number" && (
                        <span
                          className={`ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded tabular-nums ${
                            tab.isUnread
                              ? "bg-primary2 text-white animate-pulse"
                              : isActive
                                ? "bg-primary2/10 text-primary2"
                                : "bg-[#dde4e4] dark:bg-zinc-800 text-[#121717] dark:text-zinc-300"
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            {/* <!-- Kanban Board Section --> */}
            {currentPath === "tasks" && (
              <TaskBoard
                todos={todosData ?? []}
                inProgress={inProgressData ?? []}
                done={doneData ?? []}
                onDragEnd={onDragEnd}
                onViewTask={viewTaskHandler}
                taskViewers={taskViewers}
              />
            )}
            {currentPath === "members" && (
              <ProjectMembers
                data={members?.data?.projectMembers}
                isLoading={membersLoading}
                onRemove={removeMemberHandler}
                type={variables?.type}
              />
            )}
            {currentPath === "messages" && <ChatPanel projectId={projectId} />}
            {currentPath === "files" && <FilesView projectId={projectId} />}
          </div>
        </main>
      </div>
      <AddTaskModal
        show={showTaskModal}
        close={() => setShowTaskModal(false)}
        onSubmit={addNewTaskHandler}
        projectId={projectId}
        isLoading={
          createTaskMutation.isPending ||
          assignMutation.isPending ||
          updateTaskMutation.isPending
        }
      />
      <AddProjectMemberModal
        projectName={todos.data.name}
        show={showProjectMemberModal}
        close={() => setShowProjectMemberModal(false)}
        onSubmit={addMemberHandler}
        isLoading={addMemberLoading}
      />
      <ViewProjectTask
        key={currentTask}
        show={viewTask}
        close={() => setViewTask((prev) => !prev)}
        onSubmit={() => {}}
        data={todos?.data?.tasks?.find(
          (task: TasksType) => task.id === currentTask,
        )}
        ownerId={todos?.data?.ownerId}
        projectId={projectId}
      />
    </section>
  );
}
