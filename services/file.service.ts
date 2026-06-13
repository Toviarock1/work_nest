import axiosInstance from "@/lib/axiosInstance";
interface UploadChatFilePayload {
  projectId: string;
  file: File;
  /** When provided, the file is attached to a task instead of the chat feed. */
  taskId?: string;
}

export const uploadChatFile = async (payload: UploadChatFilePayload) => {
  const formData = new FormData();

  formData.append("file", payload.file);
  formData.append("projectId", payload.projectId);
  if (payload.taskId) formData.append("taskId", payload.taskId);

  const response = await axiosInstance.post("/file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const fetchFileHistory = async (projectId: string) => {
  const response = await axiosInstance.get(`/file/${projectId}`);
  return response.data;
};

export const deleteFile = async (fileId: string) => {
  const response = await axiosInstance.delete(`/file/${fileId}`);
  return response.data;
};
