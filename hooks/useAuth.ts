// hooks/useAuth.ts
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { LoginPayload, RegisterPayload, Verify2FaPayload } from "@/types/auth";

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- HÀM XỬ LÝ CHUNG KHI AUTH THÀNH CÔNG ---
  const handleAuthSuccess = useCallback(
    async (accessToken: string, refreshToken: string) => {
      // 1. Dọn dẹp trạng thái chờ 2FA ngay lập tức
      Cookies.remove("temp_2fa_valid", { path: "/" });
      localStorage.removeItem("temp_2fa_token");

      // 2. Thiết lập Token chính thức
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

      // 3. Sync login giữa các tab
      localStorage.setItem("auth_sync", "login_" + Date.now());

      // 4. Ép React Query fetch lại data user mới nhất
      await queryClient.invalidateQueries({ queryKey: ["user_profile"] });

      // 5. Chuyển trang
      router.push("/dashboard");
    },
    [router, queryClient],
  );

  // Trong hooks/useAuth.ts

  // --- LOGIN EMAIL HOẶC USERNAME ---
  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.login(payload);

      if (res.status === 200 && res.data) {
        const needs2FA =
          !!res.data.tempToken ||
          res.data.is2faRequired ||
          (res.data as any)["2faRequired"];

        if (needs2FA) {
          Cookies.set("temp_2fa_valid", "true", {
            expires: 1 / 144,
            path: "/",
            sameSite: "lax",
          });

          setIsLoading(false);
          return { requires2FA: true, tempToken: res.data.tempToken };
        }

        if (res.data.accessToken) {
          await handleAuthSuccess(res.data.accessToken, res.data.refreshToken);
          toast.success("Chào mừng homie trở lại!");
          return { requires2FA: false };
        }
      }

      setError(res.message || "Sai thông tin đăng nhập.");
      return null;
    } catch (err: any) {
      const msg =
        err.response?.data?.message || "Thông tin đăng nhập không hợp lệ.";
      setError(msg);
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

      if (res.status === 200 && res.data) {
        const needs2FA =
          !!res.data.tempToken ||
          res.data.is2faRequired ||
          (res.data as any)["2faRequired"];

        if (needs2FA) {
          Cookies.set("temp_2fa_valid", "true", {
            expires: 1 / 144,
            path: "/",
            sameSite: "lax",
          });
          setIsLoading(false);
          return { requires2FA: true, tempToken: res.data.tempToken };
        }

        await handleAuthSuccess(res.data.accessToken, res.data.refreshToken);
        toast.success("Đăng nhập Google thành công!");
        return { requires2FA: false };
      }
      return null;
    } catch (err: any) {
      setError(err.response?.data?.message || "Lỗi xác thực Google.");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // --- VERIFY 2FA (Đổi Token tạm lấy Token thật) ---
  const verify2FA = async (payload: Verify2FaPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authService.verify2FA(payload);
      if (res.status === 200 && res.data?.accessToken) {
        await handleAuthSuccess(res.data.accessToken, res.data.refreshToken);
        toast.success("Xác thực 2FA thành công!");
        return true;
      }
      return false;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Mã xác thực không chính xác.";
      setError(msg);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGOUT ---
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      Cookies.remove("access_token", { path: "/" });
      Cookies.remove("refresh_token", { path: "/" });
      Cookies.remove("temp_2fa_valid", { path: "/" });
      localStorage.removeItem("temp_2fa_token");
      queryClient.clear();
      localStorage.setItem("auth_sync", "logout_" + Date.now());
      setIsLoading(false);
      router.push("/login");
      toast.success("Đã đăng xuất.");
    }
  }, [router, queryClient]);

  // --- CÁC MUTATION PHỤ TRỢ ---
  const uploadAvatar = useMutation({
    mutationFn: (file: File) => authService.uploadAvatar(file),
    onSuccess: (res) => {
      toast.success("Cập nhật ảnh đại diện thành công!");
      queryClient.invalidateQueries({ queryKey: ["user_profile"] });
    },
  });

  const setup2FA = useMutation({
    mutationFn: () => authService.setup2FA(),
  });

  const confirm2FA = useMutation({
    mutationFn: (code: number) => authService.confirm2FA(code),
    onSuccess: () => {
      toast.success("Kích hoạt 2FA thành công!");
      queryClient.invalidateQueries({ queryKey: ["user_profile"] });
    },
  });

  const disable2FA = useMutation({
    mutationFn: (password: string) => authService.disable2FA(password),
    onSuccess: () => {
      toast.success("Đã tắt 2FA.");
      queryClient.invalidateQueries({ queryKey: ["user_profile"] });
    },
  });

  return {
    login,
    googleLogin,
    verify2FA,
    logout,
    isLoading,
    error,
    uploadAvatar,
    setup2FA,
    confirm2FA,
    disable2FA,
    register: async (payload: RegisterPayload) => {
      setIsLoading(true);
      try {
        const res = await authService.register(payload);
        if (res.status === 201) {
          toast.success("Đăng ký thành công!");
          router.push("/login");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Đăng ký thất bại.");
      } finally {
        setIsLoading(false);
      }
    },
  };
};
