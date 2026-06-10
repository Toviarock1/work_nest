import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { CopyPlus, MousePointerClick, X } from "lucide-react";
import { useState } from "react";
import { TasksType } from "@/types";
import TaskCard from "./TaskCard";

const TIP_KEY = "worknest:board:tipDismissed";

type Status = "todo" | "in_progress" | "done";

interface ColumnProps {
  status: Status;
  label: string;
  tasks: TasksType[];
  onViewTask: (taskId: string) => void;
}

const KanbanColumn = ({ status, label, tasks, onViewTask }: ColumnProps) => (
  <div
    role="region"
    aria-label={`${label} column, ${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`}
    className="kanban-column flex flex-col gap-3"
  >
    <div className="flex items-baseline justify-between px-1">
      <h3 className="font-bold text-xs uppercase tracking-widest text-[#678383] dark:text-zinc-400">
        {label}
        <span
          aria-hidden="true"
          className="ml-2 tabular-nums text-[#121717] dark:text-zinc-200"
        >
          {tasks.length}
        </span>
      </h3>
      <button
        type="button"
        aria-label={`Add task to ${label}`}
        className="text-[#678383] hover:text-primary2 transition-colors"
      >
        <CopyPlus className="size-4" />
      </button>
    </div>
    <Droppable droppableId={status}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex flex-col gap-4 flex-1 min-h-50 rounded-xl p-2 -m-2 transition-colors ${
            snapshot.isDraggingOver
              ? "bg-primary2/5 ring-2 ring-primary2/40 ring-dashed"
              : "bg-transparent ring-2 ring-transparent"
          }`}
        >
          {tasks?.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(dragProvided, snapshot) => (
                <div
                  ref={dragProvided.innerRef}
                  {...dragProvided.draggableProps}
                  {...dragProvided.dragHandleProps}
                  className={snapshot.isDragging ? "opacity-50" : "opacity-100"}
                >
                  <TaskCard
                    task={task}
                    onViewTask={() => onViewTask(task.id)}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
          {tasks.length === 0 && !snapshot.isDraggingOver && (
            <div className="flex items-center justify-center text-xs text-[#678383] py-6 border-2 border-dashed border-[#dde4e4] dark:border-zinc-800 rounded-lg">
              Drop tasks here
            </div>
          )}
        </div>
      )}
    </Droppable>
  </div>
);

interface TaskBoardProps {
  todos: TasksType[];
  inProgress: TasksType[];
  done: TasksType[];
  onDragEnd: (result: DropResult) => void;
  onViewTask: (taskId: string) => void;
}

const TaskBoard = ({
  todos,
  inProgress,
  done,
  onDragEnd,
  onViewTask,
}: TaskBoardProps) => {
  const isEmpty = todos.length + inProgress.length + done.length === 0;
  // Lazy initializer — runs once during the first render. Guarded for SSR.
  const [tipDismissed, setTipDismissed] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(TIP_KEY) === "1";
  });

  const dismissTip = () => {
    localStorage.setItem(TIP_KEY, "1");
    setTipDismissed(true);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex-1 p-8 overflow-x-auto overflow-y-visible custom-scrollbar flex flex-col gap-4 bg-background-light dark:bg-background-dark">
        {!tipDismissed && !isEmpty && (
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-primary2/5 border border-primary2/20 text-sm dark:bg-primary2/10">
            <MousePointerClick className="size-5 text-primary2 mt-0.5 shrink-0" />
            <div className="flex-1 text-[#121717] dark:text-zinc-200">
              <strong className="font-bold">Quick tip:</strong> click a card to
              open it, drag between columns to change status, and press{" "}
              <kbd className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-white dark:bg-zinc-800 border border-[#dde4e4] dark:border-zinc-700">
                Esc
              </kbd>{" "}
              to close any panel.
            </div>
            <button
              type="button"
              onClick={dismissTip}
              aria-label="Dismiss tip"
              className="p-1 -m-1 text-[#678383] hover:text-[#121717] dark:hover:text-white"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
        {isEmpty ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <div className="size-14 rounded-full bg-primary2/10 flex items-center justify-center text-primary2 mb-4">
              <CopyPlus className="size-6" />
            </div>
            <h3 className="text-lg font-bold mb-1 dark:text-zinc-100">
              No tasks yet
            </h3>
            <p className="text-sm text-[#678383] max-w-sm">
              Click <strong>+ Add Task</strong> at the top of the page to create
              your first one. You can drag cards between columns to track
              progress.
            </p>
          </div>
        ) : (
          <div className="flex gap-6 flex-1 items-stretch">
            <KanbanColumn
              status="todo"
              label="To Do"
              tasks={todos}
              onViewTask={onViewTask}
            />
            <KanbanColumn
              status="in_progress"
              label="In Progress"
              tasks={inProgress}
              onViewTask={onViewTask}
            />
            <KanbanColumn
              status="done"
              label="Done"
              tasks={done}
              onViewTask={onViewTask}
            />
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
