import axiosInstance from "@/lib/axiosInstance";
import type { TaskLinkType } from "@/types";

export const createTaskLink = async (payload: {
  taskId: string;
  targetTaskId: string;
  type: TaskLinkType;
}) => {
  const { taskId, ...body } = payload;
  const response = await axiosInstance.post(`/task-links/task/${taskId}`, body);
  return response.data;
};

export const deleteTaskLink = async (linkId: string) => {
  const response = await axiosInstance.delete(`/task-links/${linkId}`);
  return response.data;
};
