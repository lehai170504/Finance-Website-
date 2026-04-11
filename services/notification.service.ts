import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/auth";
import { Notification } from "@/types/notification";

export const notificationService = {
  // 1. Lấy danh sách thông báo
  getAll: async () => {
    const response =
      await axiosInstance.get<ApiResponse<Notification[]>>("/notifications");
    return response.data;
  },

  // 2. Lấy số lượng chưa đọc (API siêu nhẹ trả về Long bên BE)
  getUnreadCount: async () => {
    const response = await axiosInstance.get<ApiResponse<number>>(
      "/notifications/unread-count",
    );
    return response.data;
  },

  // 3. Đánh dấu đã đọc (Truyền mảng ID)
  markAsRead: async (ids: string[]) => {
    const response = await axiosInstance.put<ApiResponse<string>>(
      "/notifications/read",
      ids,
    );
    return response.data;
  },

  // 4. Đánh dấu đọc tất cả
  markAllAsRead: async () => {
    const response = await axiosInstance.put<ApiResponse<string>>(
      "/notifications/read-all",
    );
    return response.data;
  },

  // 5. Xóa 1 hoặc nhiều thông báo (Truyền mảng ID vào data)
  deleteNotifications: async (ids: string[]) => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      "/notifications/delete",
      { data: ids },
    );
    return response.data;
  },
};
