// hooks/useProfile.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import Cookies from "js-cookie";
import { toast } from "sonner";

export const useProfile = () => {
  const token = Cookies.get("access_token");

  return useQuery({
    queryKey: ["user_profile"],
    queryFn: async () => {
      const res = await authService.getProfile();
      return res.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newUsername: string) =>
      authService.updateProfile({ username: newUsername }),
    onSuccess: () => {
      toast.success("Đã cập nhật thông tin thành công!");

      queryClient.invalidateQueries({ queryKey: ["user_profile"] });
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.",
      );
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (payload: any) => authService.changePassword(payload),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới nhé.");
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message ||
          "Mật khẩu hiện tại không đúng hoặc có lỗi xảy ra.",
      );
    },
  });
};
