/** Standard envelope every WorkNest API endpoint returns. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/** Logged-in user shape — what the auth store + /user/me serve. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  token?: string;
}

/** Generic error shape we get back from the API. Used for typing catch blocks. */
export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      [key: string]: unknown;
    };
  };
  message?: string;
}

export interface LoginFormInput {
  email: string;
  password: string;
}

export interface RegisterFormInput {
  name: string;
  email: string;
  password: string;
}

export interface ProjectsType {
  project: {
    id: string;
    name: string;
    ownerId: string;
    description: string;
    createdAt: string;
  };
}

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskLinkType = "blocks" | "blocked_by" | "related_to";

export interface TaskSubtaskRow {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface TaskFileRow {
  id: string;
  name: string;
  url: string;
  size: number;
}

export interface TaskLinkRow {
  id: string;
  type: TaskLinkType;
  toTask?: { id: string; title: string; status: TaskStatus };
  fromTask?: { id: string; title: string; status: TaskStatus };
}

export interface TasksType {
  assignedToId: string | null;
  createdAt: string;
  updatedAt?: string;
  description: string | null;
  id: string;
  projectId: string;
  parentId?: string | null;
  status: TaskStatus;
  title: string;
  assignedTo: {
    name: string;
    email: string;
    id: string;
  };
  subtasks?: TaskSubtaskRow[];
  files?: TaskFileRow[];
  outgoingLinks?: TaskLinkRow[];
  incomingLinks?: TaskLinkRow[];
}

export interface MessageReactionRow {
  emoji: string;
  userId: string;
}

export interface Message {
  id: string;
  content: string;
  projectId: string;
  senderId: string;
  createdAt: Date;
  sender: {
    name: string;
  };
  reactions?: MessageReactionRow[];
}

export interface GetFileHistorry {
  id: string;
  name: string;
  url: string;
  size: number;
  projectId: string;
  uploaderId: string;
  createdAt: string;
  uploader: {
    name: string;
  };
}

export interface ProjectMembersType {
  id: string;
  userId: string;
  projectId: string;
  role: string;
  joinedAt: string;
  user: { name: string; email: string };
}

export interface AssignTaskPayload {
  taskId: string;
  projectId: string;
  assigneeEmail: string;
}

export interface TaskComment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  createdAt: string;
  updatedAt?: string;
  author: {
    id: string;
    name: string | null;
    email: string;
  };
}
