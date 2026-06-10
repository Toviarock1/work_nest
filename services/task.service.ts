import axiosInstance from "@/lib/axiosInstance";

export const fetchMyProjectsTask = async (id: string) => {
  const response = await axiosInstance.get(`/tasks/${id}`);
  return response.data;
};

interface createTaskPayload {
  title: string;
  description: string;
  projectId: string;
}
export const createTask = async (payload: createTaskPayload) => {
  const response = await axiosInstance.post("/tasks", payload);
  return response.data;
};

interface UpdateTaskPayload {
  taskId: string;
  title?: string;
  description?: string;
  status?: "todo" | "in_progress" | "done";
}
export const updateTask = async (payload: UpdateTaskPayload) => {
  const { taskId, ...body } = payload;
  const response = await axiosInstance.patch(`/tasks/${taskId}`, body);
  return response.data;
};

export const deleteTask = async (taskId: string) => {
  const response = await axiosInstance.delete(`/tasks/${taskId}`);
  return response.data;
};
