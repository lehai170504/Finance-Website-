// services/auth.service.ts
import { axiosInstance } from "@/lib/axios";
import {
  LoginPayload,
  RegisterPayload,
  ApiResponse,
  AuthResponse,
  UserProfile,
  ChangePasswordPayload,
  Verify2FaPayload,
} from "@/types/auth";

export const authService = {
  login: async (payload: LoginPayload) => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/login",
      payload,
    );
    return response.data;
  },

  googleLogin: async (idToken: string) => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/google",
      {
        idToken,
      },
    );
    return response.data;
  },

  register: async (payload: RegisterPayload) => {
    const response = await axiosInstance.post<ApiResponse<null>>(
      "/auth/register",
      payload,
    );
    return response.data;
  },

  getProfile: async () => {
    const response =
      await axiosInstance.get<ApiResponse<UserProfile>>("/auth/me");
    return response.data;
  },

  updateProfile: async (payload: { username: string }) => {
    const response = await axiosInstance.put<ApiResponse<UserProfile>>(
      "/auth/profile",
      null,
      {
        params: { newUsername: payload.username },
      },
    );
    return response.data;
  },

  logout: async () => {
    const response =
      await axiosInstance.post<ApiResponse<null>>("/auth/logout");
    return response.data;
  },

  changePassword: async (payload: ChangePasswordPayload) => {
    const response = await axiosInstance.post<ApiResponse<null>>(
      "/auth/change-password",
      {
        oldPass: payload.oldPassword,
        newPass: payload.newPassword,
      },
    );
    return response.data;
  },

  sendOtp: async (email: string) => {
    const response = await axiosInstance.post("/auth/forgot-password", null, {
      params: { email },
    });
    return response.data;
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    const response = await axiosInstance.post<ApiResponse<null>>(
      "/auth/reset-password",
      null,
      {
        params: { email, otp, newPassword },
      },
    );
    return response.data;
  },

  verify2FA: async (payload: Verify2FaPayload) => {
    const response = await axiosInstance.post<ApiResponse<AuthResponse>>(
      "/auth/verify-2fa",
      payload,
    );
    return response.data;
  },

  setup2FA: async () => {
    const response =
      await axiosInstance.post<ApiResponse<string>>("/auth/2fa/setup");
    return response.data;
  },

  confirm2FA: async (code: number) => {
    const response = await axiosInstance.post<ApiResponse<null>>(
      "/auth/2fa/confirm",
      { code },
    );
    return response.data;
  },

  disable2FA: async (password: string) => {
    const response = await axiosInstance.post<ApiResponse<null>>(
      "/auth/2fa/disable",
      { password },
    );
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<ApiResponse<UserProfile>>(
      "/auth/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};
