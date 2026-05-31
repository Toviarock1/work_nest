import axiosInstance from "@/lib/axiosInstance";
import type { ApiResponse, AuthUser } from "@/types";

// REGISTER
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (
  payload: RegisterPayload,
): Promise<ApiResponse<AuthUser>> => {
  const { data } = await axiosInstance.post<ApiResponse<AuthUser>>(
    "/auth/register",
    payload,
  );
  return data;
};

// LOGIN
export interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = async (
  payload: LoginPayload,
): Promise<ApiResponse<AuthUser>> => {
  const { data } = await axiosInstance.post<ApiResponse<AuthUser>>(
    "/auth/login",
    payload,
  );
  return data;
};
