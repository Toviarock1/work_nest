"use client";
import { useState } from "react";
import TaskSkeleton from "@/components/skeleton/TaskSkeleton";
import QueryError from "@/components/ui/QueryError";
import AddTaskModal from "@/components/task/AddTaskModal";
import TaskBoard from "@/components/task/TaskBoard";
import FilesView from "@/components/file/Files";
import { type DropResult } from "@hello-pangea/dnd";
import { AxiosError } from "axios";
import { useProjectSocket } from "@/hooks/useProjectSocket";
import {
  createTask,
  fetchMyProjectsTask,
  updateTask,
} from "@/services/task.service";
import { TasksType } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BadgeCheck,
  MessagesSquare,
  Folder,
  Plus,
  Users,
  UserPlus,
} from "lucide-react";
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
import ViewProjectTask from "@/components/task/ViewProjectTask";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-todos", projectId] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
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

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;

    updateTaskMutation.mutate({
      taskId: draggableId,
      status: destination.droppableId as "todo" | "in_progress" | "done",
    });
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
            <div className="bg-white dark:bg-zinc-950 pt-8 px-8 border-b border-[#dde4e4] dark:border-zinc-800">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-3xl font-black tracking-tight dark:text-white">
                      {todos.data.name}
                    </h2>
                  </div>
                  <p className="text-[#678383] text-sm">
                    {todos.data.description
                      ? todos.data.description
                      : "Add a description to this project. don't get people confused will ya?"}
                  </p>
                </div>

                <div className="flex gap-3">
                  {/* <button className="flex items-center px-4 h-10 rounded-lg border border-[#dde4e4] dark:border-zinc-700 text-[#121717] dark:text-white text-sm font-bold hover:bg-background-light dark:hover:bg-zinc-900">
                    <span className="material-symbols-outlined text-[20px] mr-2">
                      <ListFilter />
                    </span>
                    <span>Filter</span>
                  </button> */}
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
              {/* <!-- Tabs --> */}
              <div className="flex gap-8">
                <button
                  onClick={() => setCurrentPath("tasks")}
                  className={` ${currentPath === "tasks" && "border-primary2 text-primary2 border-b-2"} flex cursor-pointer items-center justify-center pb-3 px-1 font-bold text-sm hover:text-primary2 text-[#678383] transition-colors`}
                >
                  <span className="material-symbols-outlined text-[20px] mr-2">
                    <BadgeCheck />
                  </span>
                  Tasks
                </button>
                <button
                  onClick={() => setCurrentPath("messages")}
                  className={` ${currentPath === "messages" && "border-primary2 text-primary2 border-b-2"} flex cursor-pointer items-center justify-center pb-3 px-1 font-bold text-sm hover:text-primary2 text-[#678383] transition-colors`}
                >
                  <span className="material-symbols-outlined text-[20px] mr-2">
                    <MessagesSquare />
                  </span>
                  Messages
                </button>
                <button
                  onClick={() => setCurrentPath("files")}
                  className={` ${currentPath === "files" && "border-primary2 text-primary2 border-b-2"} flex cursor-pointer items-center justify-center pb-3 px-1 font-bold text-sm hover:text-primary2 text-[#678383] transition-colors`}
                >
                  <span className="material-symbols-outlined text-[20px] mr-2">
                    <Folder />
                  </span>
                  Files
                </button>
                <button
                  onClick={() => setCurrentPath("members")}
                  className={` ${currentPath === "members" && "border-primary2 text-primary2 border-b-2"} flex cursor-pointer items-center justify-center pb-3 px-1 font-bold text-sm hover:text-primary2 text-[#678383] transition-colors`}
                >
                  <span className="material-symbols-outlined text-[20px] mr-2">
                    <Users />
                  </span>
                  Members
                </button>
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
