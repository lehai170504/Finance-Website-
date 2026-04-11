"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { toast } from "sonner";

export function useAuthSync() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // Chỉ quan tâm đến key "auth_sync" mà homie đã setup
      if (e.key === "auth_sync" && e.newValue) {
        // e.newValue sẽ có dạng "login_1712... " hoặc "logout_1712..."
        const action = e.newValue.split("_")[0];

        // 1. NẾU TAB KHÁC ĐĂNG XUẤT
        if (action === "logout") {
          // Xóa cookie và cache ở tab hiện tại cho chắc ăn
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          queryClient.clear();

          // Nếu đang không ở trang login thì đá văng ra
          if (pathname !== "/login" && pathname !== "/register") {
            toast.error("Tài khoản đã đăng xuất ở một tab khác!");
            router.push("/login");
          }
        }

        // 2. NẾU TAB KHÁC ĐĂNG NHẬP
        if (action === "login") {
          // Nếu đang ở trang login/register thì tự động bay vào trang chủ
          if (pathname === "/login" || pathname === "/register") {
            toast.success("Đã đăng nhập ở tab khác, tự động vào hệ thống!");
            queryClient.invalidateQueries({ queryKey: ["user_profile"] });
            router.push("/dashboard");
          }
        }
      }
    };

    // Bật máy nghe lén
    window.addEventListener("storage", handleStorageChange);

    // Tắt máy nghe lén khi unmount
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router, pathname, queryClient]);
}
