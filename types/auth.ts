// types/auth.ts

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType?: string;
  username: string;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface LoginPayload {
  username: string; // Backend Spring Boot của chúng ta dùng trường này cho email
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
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
