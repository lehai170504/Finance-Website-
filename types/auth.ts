// types/auth.ts

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  username: string;
  is2faRequired?: boolean;
  tempToken?: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface LoginPayload {
  loginId: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: string;
  avatarUrl?: string;
  is2faEnabled?: boolean;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Verify2FaPayload {
  tempToken: string;
  code: number;
}
