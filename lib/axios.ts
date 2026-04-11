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
  (response) => {
    return response;
  },
  (error) => {
    const isBrowser = typeof window !== "undefined";

    if (error.response) {
      const errorMessage =
        error.response.data?.message || "Đã có lỗi xảy ra. Vui lòng thử lại!";

      if (error.response.status === 401) {
        if (isBrowser) {
          toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");

          setTimeout(() => {
            window.location.href = "/login";
          }, 1500);
        }
      } else {
        if (isBrowser) {
          toast.error(errorMessage);
        }
      }
    } else {
      if (isBrowser) {
        toast.error(
          "Không thể kết nối đến máy chủ! Kiểm tra lại đường truyền.",
        );
      }
    }

    return Promise.reject(error);
  },
);
