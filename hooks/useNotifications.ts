import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import { toast } from "sonner";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  // 1. Query lấy danh sách (tắt tự động gọi lại để tiết kiệm)
  const { data: listRes, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationService.getAll,
  });

  // 2. Query lấy số lượng (tự động check mỗi 30s)
  const { data: countRes } = useQuery({
    queryKey: ["notifications_count"],
    queryFn: notificationService.getUnreadCount,
    refetchInterval: 30000,
  });

  // 3. Mutation: Đọc tất cả
  const readAllMutation = useMutation({
    mutationFn: notificationService.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications_count"] });
    },
  });

  // 4. Mutation: Đọc lẻ hoặc nhiều
  const readMutation = useMutation({
    mutationFn: notificationService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications_count"] });
    },
  });

  // 5. Mutation: Xóa
  const deleteMutation = useMutation({
    mutationFn: notificationService.deleteNotifications,
    onSuccess: () => {
      toast.success("Đã xóa thông báo");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications_count"] });
    },
  });

  return {
    notifications: listRes?.data || [],
    unreadCount: countRes?.data || 0,
    isLoading,
    markReadAll: readAllMutation.mutate,
    markRead: readMutation.mutate,
    deleteNotes: deleteMutation.mutate,
  };
};
