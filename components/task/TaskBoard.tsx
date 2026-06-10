import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { CopyPlus } from "lucide-react";
import { TasksType } from "@/types";
import TaskCard from "./TaskCard";

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
    className="kanban-column flex flex-col gap-4"
  >
    <div className="flex items-center justify-between px-1">
      <div className="flex items-center gap-2">
        <h3 className="font-black text-sm uppercase tracking-widest text-[#678383]">
          {label}
        </h3>
        <span
          aria-hidden="true"
          className="bg-[#dde4e4] dark:bg-zinc-800 text-[#121717] dark:text-white text-[10px] font-bold px-1.5 py-0.5 rounded"
        >
          {tasks.length}
        </span>
      </div>
      <button
        type="button"
        aria-label={`Add task to ${label}`}
        className="material-symbols-outlined text-[#678383] hover:text-primary2"
      >
        <CopyPlus />
      </button>
    </div>
    <Droppable droppableId={status}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex flex-col gap-4"
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
                    onViewTask={() => onViewTask(task.id)}
                    title={task.title}
                  />
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
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
}: TaskBoardProps) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <div className="flex-1 p-8 overflow-x-auto overflow-y-visible custom-scrollbar flex gap-6 bg-background-light dark:bg-background-dark">
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
  </DragDropContext>
);

export default TaskBoard;
