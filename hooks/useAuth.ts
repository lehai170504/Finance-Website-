import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { LoginPayload, RegisterPayload, AuthResponse } from "@/types/auth";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- HÀM XỬ LÝ KHI ĐĂNG NHẬP THÀNH CÔNG ---
  const handleAuthSuccess = useCallback(
    async (accessToken: string, refreshToken: string) => {
      // Dọn dẹp các trạng thái tạm thời của 2FA
      Cookies.remove("temp_2fa_valid", { path: "/" });
      localStorage.removeItem("temp_2fa_token");

      // Thiết lập Cookies chính thức
      Cookies.set("access_token", accessToken, {
        expires: 7,
        path: "/",
        sameSite: "lax",
      });
      Cookies.set("refresh_token", refreshToken, {
        expires: 30,
        path: "/",
        sameSite: "lax",
      });

      // Đồng bộ giữa các tab và cập nhật lại thông tin user
      localStorage.setItem("auth_sync", "login_" + Date.now());
      await queryClient.invalidateQueries({ queryKey: ["user_profile"] });

      router.push("/dashboard");
    },
    [router, queryClient],
  );

  // --- LOGIN EMAIL/USERNAME ---
  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login(payload);
      const data = res.data as AuthResponse;

      if (data) {
        // Kiểm tra xem có yêu cầu 2FA không
        if (data.is2faRequired || data.tempToken) {
          Cookies.set("temp_2fa_valid", "true", {
            expires: 1 / 144,
            path: "/",
          });
          localStorage.setItem("temp_2fa_token", data.tempToken || "");
          setIsLoading(false);
          return { requires2FA: true, tempToken: data.tempToken };
        }

        // Nếu login thẳng (không 2FA)
        if (data.accessToken && data.refreshToken) {
          await handleAuthSuccess(data.accessToken, data.refreshToken);
          toast.success("Chào mừng homie trở lại!");
          return { requires2FA: false };
        }
      }
      return null;
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Sai thông tin đăng nhập rồi homie.";
      setError(msg);
      toast.error(msg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // --- GOOGLE LOGIN ---
  const googleLogin = async (idToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.googleLogin(idToken);
      const data = res.data as AuthResponse;

      if (data) {
        if (data.is2faRequired || data.tempToken) {
          Cookies.set("temp_2fa_valid", "true", {
            expires: 1 / 144,
            path: "/",
          });
          localStorage.setItem("temp_2fa_token", data.tempToken || "");
          setIsLoading(false);
          return { requires2FA: true, tempToken: data.tempToken };
        }

        if (data.accessToken && data.refreshToken) {
          await handleAuthSuccess(data.accessToken, data.refreshToken);
          toast.success("Đăng nhập Google thành công!");
          return { requires2FA: false };
        }
      }
      return null;
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi xác thực Google.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // --- XÁC THỰC 2FA ---
  const verify2FA = async (code: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const tempToken = localStorage.getItem("temp_2fa_token");
      if (!tempToken) {
        toast.error("Phiên làm việc hết hạn, đăng nhập lại nhé!");
        return false;
      }

      const res = await authService.verify2FA({ tempToken, code });
      const data = res.data as AuthResponse;

      if (data?.accessToken && data?.refreshToken) {
        await handleAuthSuccess(data.accessToken, data.refreshToken);
        toast.success("Xác thực 2FA thành công!");
        return true;
      }
      return false;
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Mã OTP không đúng hoặc hết hạn.";
      setError(msg);
      toast.error(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // --- ĐĂNG XUẤT ---
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      // Xóa mọi dấu vết
      Cookies.remove("access_token", { path: "/" });
      Cookies.remove("refresh_token", { path: "/" });
      Cookies.remove("temp_2fa_valid", { path: "/" });
      localStorage.removeItem("temp_2fa_token");

      queryClient.clear();
      localStorage.setItem("auth_sync", "logout_" + Date.now());

      setIsLoading(false);
      router.push("/login");
      toast.success("Đã đăng xuất, hẹn gặp lại homie!");
    }
  }, [router, queryClient]);

  return {
    login,
    googleLogin,
    verify2FA,
    logout,
    isLoading,
    error,
    uploadAvatar: useMutation({
      mutationFn: (file: File) => authService.uploadAvatar(file),
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ["user_profile"] }),
    }),
    setup2FA: useMutation({ mutationFn: () => authService.setup2FA() }),
    confirm2FA: useMutation({
      mutationFn: (code: number) => authService.confirm2FA(code),
      onSuccess: () => {
        toast.success("Đã kích hoạt 2FA thành công!");
        queryClient.invalidateQueries({ queryKey: ["user_profile"] });
      },
    }),
    disable2FA: useMutation({
      mutationFn: (password: string) => authService.disable2FA(password),
      onSuccess: () => {
        toast.success("Đã tắt bảo mật 2FA.");
        queryClient.invalidateQueries({ queryKey: ["user_profile"] });
      },
    }),
    register: async (payload: RegisterPayload) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await authService.register(payload);
        if (res.status === 201 || res.status === 200) {
          toast.success("Đăng ký thành công! Đăng nhập thôi homie.");
          router.push("/login");
        }
      } catch (err: any) {
        const msg = err.response?.data?.message || "Đăng ký không thành công.";
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    },
  };
};
