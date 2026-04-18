// lib/axios.ts
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner"; // Import thư viện thông báo

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

// XỬ LÝ REQUEST: Gắn Token tự động
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");

    const publicApis = [
      "/auth/login",
      "/auth/register",
      "/auth/forgot-password",
      "/auth/google",
    ];
    const isPublicApi = publicApis.some((api) => config.url?.includes(api));

    if (token && config.headers && !isPublicApi) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// XỬ LÝ RESPONSE: Bắt lỗi và Thông báo toàn cục
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isBrowser = typeof window !== "undefined";

    if (error.response) {
      const isAuthApi = error.config.url?.includes("/auth/");

      if (error.response.status === 401 && isBrowser && !isAuthApi) {
        toast.error("Phiên đăng nhập hết hạn!");
        Cookies.remove("access_token");
        window.location.href = "/login";
      }
      if (!isAuthApi && isBrowser) {
        const errorMessage =
          error.response.data?.message || "Đã có lỗi xảy ra!";
        toast.error(errorMessage);
      }
    }
    return Promise.reject(error);
  },
);
