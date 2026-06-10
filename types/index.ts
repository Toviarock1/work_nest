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

export interface TasksType {
  assignedToId: string | null;
  createdAt: string;
  description: string | null;
  id: string;
  projectId: string;
  status: TaskStatus;
  title: string;
  assignedTo: {
    name: string;
    email: string;
    id: string;
  };
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
