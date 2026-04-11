// app/(dashboard)/profile/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { UserCog, ShieldAlert, Loader2 } from "lucide-react";

import {
  useProfile,
  useUpdateProfile,
  useResetPassword,
} from "@/hooks/useProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordForm } from "@/components/profile/PasswordForm";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const router = useRouter();
  const { data: user, isLoading: isFetchingProfile } = useProfile();
  const updateMutation = useUpdateProfile();
  const passwordMutation = useResetPassword();

  useEffect(() => {
    if (!Cookies.get("access_token")) router.push("/login");
  }, [router]);

  if (isFetchingProfile) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">
          Đang truy xuất hồ sơ...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER */}
      <div className="flex flex-col space-y-3 mb-10 border-b border-border/50 pb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-3 justify-center sm:justify-start">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <UserCog size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
            CÀI ĐẶT <span className="text-primary">TÀI KHOẢN</span>
          </h1>
        </div>
        <p className="text-muted-foreground font-medium text-sm">
          Tùy chỉnh thông tin cá nhân và thiết lập hàng rào bảo mật homie nhé.
        </p>
      </div>

      {/* TABS CONTAINER */}
      <Tabs defaultValue="info" className="w-full">
        {/* TABS LIST - PILL DESIGN CÂN ĐỐI */}
        <TabsList className="grid w-full grid-cols-2 mb-10 h-[60px] rounded-full bg-muted/40 p-1.5 border-2 border-border/50 backdrop-blur-sm shadow-inner relative overflow-hidden">
          <TabsTrigger
            value="info"
            className={cn(
              "rounded-full uppercase tracking-[0.2em] font-black text-[10px] h-full transition-all duration-300 z-10",
              "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md",
              "data-[state=inactive]:hover:bg-muted/60 data-[state=active]:scale-[0.98]",
            )}
          >
            Hồ sơ cá nhân
          </TabsTrigger>

          <TabsTrigger
            value="security"
            className={cn(
              "rounded-full uppercase tracking-[0.2em] font-black text-[10px] h-full transition-all duration-300 z-10",
              "data-[state=active]:bg-background data-[state=active]:text-destructive data-[state=active]:shadow-md",
              "data-[state=inactive]:hover:bg-muted/60 data-[state=active]:scale-[0.98]",
            )}
          >
            Bảo mật & Mật khẩu
          </TabsTrigger>
        </TabsList>

        {/* MAIN CONTENT CARD - CENTER FOCUSED LAYOUT */}
        <div className="bg-card/40 backdrop-blur-xl p-8 md:p-14 rounded-[3.5rem] border-2 border-border/50 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] relative overflow-hidden">
          {/* Decorative Ambient Light (Lớp sáng mờ trang trí góc) */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none opacity-50" />

          {/* Giới hạn độ rộng nội dung (max-w-md) để các input không bị giãn quá dài, tạo sự cân đối */}
          <div className="max-w-md mx-auto relative z-10">
            {/* CONTENT: THÔNG TIN CÁ NHÂN */}
            <TabsContent
              value="info"
              className="mt-0 outline-none focus-visible:ring-0"
            >
              <ProfileForm user={user} updateMutation={updateMutation} />
            </TabsContent>

            {/* CONTENT: BẢO MẬT */}
            <TabsContent
              value="security"
              className="mt-0 outline-none focus-visible:ring-0"
            >
              {/* Banner cảnh báo bảo mật được thiết kế lại cho cực gọn */}
              <div className="mb-8 p-4 bg-destructive/5 rounded-2xl border border-destructive/10 flex items-center gap-4 transition-all hover:bg-destructive/10">
                <div className="p-2 bg-destructive/10 rounded-xl text-destructive shrink-0">
                  <ShieldAlert size={20} strokeWidth={2.5} />
                </div>
                <p className="text-[10px] font-black text-destructive/80 leading-snug uppercase tracking-tight">
                  Ghi nhớ: Đừng chia sẻ mật khẩu cho bất kỳ ai, kể cả Admin
                  homie nhé!
                </p>
              </div>

              <PasswordForm passwordMutation={passwordMutation} />
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
