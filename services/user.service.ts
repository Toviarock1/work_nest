import axiosInstance from "@/lib/axiosInstance";

export const getMe = async () => {
  const response = await axiosInstance.get("/user/me");
  return response.data;
};

export const updateUserName = async (name: string) => {
  const response = await axiosInstance.patch("/user/me", { name: name });
  return response.data;
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);
  const response = await axiosInstance.post("/user/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const removeAvatar = async () => {
  const response = await axiosInstance.delete("/user/avatar");
  return response.data;
};
