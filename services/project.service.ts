import axiosInstance from "@/lib/axiosInstance";
import { AssignTaskPayload } from "@/types";

interface createProjectPayload {
  name: string;
  description: string;
}

export const createProject = async (payload: createProjectPayload) => {
  const response = await axiosInstance.post("/project", payload);
  return response.data;
};

export const fetchMyProjects = async () => {
  const response = await axiosInstance.get("/project");
  return response.data;
};

export const fetchProjectMembers = async (id: string) => {
  const response = await axiosInstance.get(`/project/${id}/members`);
  return response.data;
};

interface ProjectMemberPayload {
  projectId: string;
  userEmail: string;
}
export const addProjectMembers = async (payload: ProjectMemberPayload) => {
  const response = await axiosInstance.post(`/project/add-member`, payload);
  return response.data;
};

export const removeProjectMembers = async (payload: ProjectMemberPayload) => {
  const response = await axiosInstance.post(`/project/remove-member`, payload);
  return response.data;
};

interface DeleteProjectPayload {
  id: string;
}

export const removeProject = async (payload: DeleteProjectPayload) => {
  const response = await axiosInstance.delete(`/project/${payload.id}`);
  return response.data;
};

export const assignTask = async (payload: AssignTaskPayload) => {
  const response = await axiosInstance.patch(
    `/tasks/${payload.taskId}/assign`,
    { projectId: payload.projectId, assigneeEmail: payload.assigneeEmail },
  );
  return response.data;
};
