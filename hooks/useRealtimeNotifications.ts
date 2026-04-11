import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "sonner";
// Nếu không dùng polyfill thì dùng EventSource mặc định của trình duyệt
// import { EventSourcePolyfill } from 'event-source-polyfill';

export const useRealtimeNotifications = () => {
  const queryClient = useQueryClient();
  const token = Cookies.get("access_token");

  useEffect(() => {
    if (!token) return;

    // 💡 TRUYỀN TOKEN QUA QUERY PARAM ĐỂ TRÁNH LỖI 403/401
    // Backend của homie cần lấy token từ param này nếu Header trống
    const sseUrl = `${process.env.NEXT_PUBLIC_API_URL}/notifications/subscribe?token=${token}`;

    const eventSource = new EventSource(sseUrl);

    // 1. Lắng nghe sự kiện "init" (Chào hỏi từ BE)
    eventSource.addEventListener("init", (event) => {
      console.log("SSE Connected:", event.data);
    });

    // 2. Lắng nghe sự kiện "notification" (TIN NHẮN THẬT 🚀)
    eventSource.addEventListener("notification", (event) => {
      const newNotify = JSON.parse(event.data);

      // ✅ THÔNG BÁO CHO USER THẤY NGAY
      toast.info(newNotify.message, {
        description: "Thông báo mới từ Homie Finance",
      });

      // ✅ CẬP NHẬT CACHE CỦA REACT QUERY (Không cần gọi API lại)
      // Cập nhật danh sách thông báo
      queryClient.setQueryData(["notifications"], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: [newNotify, ...oldData.data], // Đẩy thông báo mới lên đầu
        };
      });

      // Cập nhật số lượng chưa đọc (+1)
      queryClient.setQueryData(["notifications_count"], (oldCount: any) => {
        if (typeof oldCount?.data === "number") {
          return { ...oldCount, data: oldCount.data + 1 };
        }
        return oldCount;
      });
    });

    // 3. Lắng nghe tín hiệu cập nhật (Update Signal)
    eventSource.addEventListener("update_signal", (event) => {
      // Nếu nhận được tín hiệu "Đã đọc hết" từ tab khác, load lại count
      queryClient.invalidateQueries({ queryKey: ["notifications_count"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close(); // Đóng kết nối khi component unmount
    };
  }, [token, queryClient]);
};
