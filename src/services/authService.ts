import { apiClient } from "./apiClient";
import { LoginDto, RegisterDto, AuthResponse, User } from "@/types/api";

export const authService = {
  register: (data: RegisterDto): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/auth/register", data, {
      useAuth: false,
    });
  },

  login: (data: LoginDto): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>("/auth/login", data, {
      useAuth: false,
    });
  },

  getProfile: (): Promise<User> => {
    return apiClient.get<User>("/auth/profile");
  },
};
