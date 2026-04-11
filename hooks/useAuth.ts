// hooks/useAuth.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { LoginPayload, RegisterPayload } from "@/types/auth";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login(payload);
      if (res.status === 200 && res.data) {
        Cookies.set("access_token", res.data.accessToken, { expires: 7 });
        Cookies.set("refresh_token", res.data.refreshToken, { expires: 30 });

        queryClient.invalidateQueries({ queryKey: ["user_profile"] });

        localStorage.setItem("auth_sync", "login_" + Date.now());

        toast.success("Đăng nhập thành công!");
        router.push("/dashboard");
      } else {
        setError(res.message || "Sai thông tin đăng nhập.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Máy chủ không phản hồi. Vui lòng thử lại.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async (idToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.googleLogin(idToken);
      if (res.status === 200 && res.data) {
        Cookies.set("access_token", res.data.accessToken, { expires: 7 });
        Cookies.set("refresh_token", res.data.refreshToken, { expires: 30 });
        queryClient.invalidateQueries({ queryKey: ["user_profile"] });
        localStorage.setItem("auth_sync", "login_" + Date.now());

        toast.success("Đăng nhập Google thành công!");
        router.push("/dashboard");
      } else {
        setError(res.message || "Đăng nhập thất bại.");
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Lỗi kết nối đến máy chủ. Vui lòng thử lại.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.register(payload);
      if (res.status === 201) {
        toast.success("Tạo tài khoản thành công! Đang chuyển hướng...");
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setError(res.message || "Đăng ký thất bại.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Đăng ký thất bại. Email có thể đã tồn tại.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error("Lỗi API logout:", err);
    } finally {
      Cookies.remove("access_token");
      Cookies.remove("refresh_token");

      queryClient.clear();
      localStorage.setItem("auth_sync", "logout_" + Date.now());
      setIsLoading(false);

      toast.success("Đã đăng xuất hệ thống.");
      router.push("/login");
    }
  };

  return { login, googleLogin, register, logout, isLoading, error };
};
