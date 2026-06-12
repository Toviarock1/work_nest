import axiosInstance from "@/lib/axiosInstance";

export const fetchTaskComments = async (taskId: string) => {
  const response = await axiosInstance.get(`/comments/task/${taskId}`);
  return response.data;
};

export const createTaskComment = async (payload: {
  taskId: string;
  content: string;
}) => {
  const response = await axiosInstance.post(
    `/comments/task/${payload.taskId}`,
    { content: payload.content },
  );
  return response.data;
};

export const deleteTaskComment = async (commentId: string) => {
  const response = await axiosInstance.delete(`/comments/${commentId}`);
  return response.data;
};
