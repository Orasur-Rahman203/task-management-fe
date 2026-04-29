import { apiClient } from "@/lib/api-client";
import type { LoginInput, RegisterInput, LoginResponse, RegisterResponse } from "@/lib/schemas";

export const authApi = {
  login: async (data: LoginInput): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>("/auth/signin", data);
    return res.data;
  },

  register: async (
    data: Omit<RegisterInput, "confirmPassword">
  ): Promise<RegisterResponse> => {
    const res = await apiClient.post<RegisterResponse>("/auth/signup", data);
    return res.data;
  },

  me: async () => {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },
};
