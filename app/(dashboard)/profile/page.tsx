"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { UserCog, ShieldAlert, Loader2, Sparkles } from "lucide-react";

import {
  useProfile,
  useUpdateProfile,
  useResetPassword,
} from "@/hooks/useProfile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordForm } from "@/components/profile/PasswordForm";
import { TwoFactorForm } from "@/components/profile/TwoFactorForm";
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
      <div className="flex-1 flex flex-col justify-center items-center h-[60vh] gap-6 font-sans">
        <div className="relative">
          <Loader2
            className="animate-spin text-primary"
            size={48}
            strokeWidth={2.5}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
          </div>
        </div>
        <span className="text-[11px] font-black text-primary uppercase tracking-[0.4em] animate-pulse">
          Đang xác thực hồ sơ...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:p-8 mt-6 font-sans animate-in fade-in slide-in-from-bottom-6 duration-1000 mb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col space-y-4 mb-12 text-center sm:text-left relative">
        <div className="inline-flex items-center gap-4 justify-center sm:justify-start">
          <div className="p-3.5 bg-primary/10 rounded-2xl text-primary border border-primary/20 shadow-inner group transition-all hover:rotate-3">
            <UserCog
              size={36}
              strokeWidth={2.5}
              className="group-hover:scale-110 transition-transform"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 text-primary mb-1 justify-center sm:justify-start">
              <Sparkles size={14} fill="currentColor" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                Thiết lập cá nhân
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl p-2 font-black tracking-tighter uppercase leading-none text-foreground">
              CÀI ĐẶT <span className="text-primary">TÀI KHOẢN</span>
            </h1>
          </div>
        </div>
        <p className="text-muted-foreground font-medium text-base max-w-lg">
          Tùy chỉnh danh tính của bạn trên Homie Finance và nâng cấp hàng rào
          bảo mật.
        </p>
      </div>

      {/* TABS CONTAINER */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-12 h-16 rounded-full bg-muted/30 p-1 border border-border/40 backdrop-blur-md shadow-2xl shadow-black/5 relative overflow-hidden">
          <TabsTrigger
            value="info"
            className={cn(
              "rounded-full uppercase tracking-[0.1em] font-black text-[9px] md:text-[10px] h-full transition-all duration-500 z-10",
              "data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-xl border border-transparent data-[state=active]:border-border/50",
              "data-[state=inactive]:text-muted-foreground/60 data-[state=inactive]:hover:text-foreground data-[state=active]:scale-[0.97]",
            )}
          >
            Hồ sơ
          </TabsTrigger>

          <TabsTrigger
            value="security"
            className={cn(
              "rounded-full uppercase tracking-[0.1em] font-black text-[9px] md:text-[10px] h-full transition-all duration-500 z-10",
              "data-[state=active]:bg-background data-[state=active]:text-destructive data-[state=active]:shadow-xl border border-transparent data-[state=active]:border-border/50",
              "data-[state=inactive]:text-muted-foreground/60 data-[state=inactive]:hover:text-foreground data-[state=active]:scale-[0.97]",
            )}
          >
            Mật khẩu
          </TabsTrigger>

          <TabsTrigger
            value="2fa"
            className={cn(
              "rounded-full uppercase tracking-[0.1em] font-black text-[9px] md:text-[10px] h-full transition-all duration-500 z-10",
              "data-[state=active]:bg-background data-[state=active]:text-emerald-500 data-[state=active]:shadow-xl border border-transparent data-[state=active]:border-border/50",
              "data-[state=inactive]:text-muted-foreground/60 data-[state=inactive]:hover:text-foreground data-[state=active]:scale-[0.97]",
            )}
          >
            Bảo mật 2FA
          </TabsTrigger>
        </TabsList>

        {/* MAIN CONTENT CARD */}
        <div className="bg-card/40 backdrop-blur-2xl p-6 md:p-14 rounded-[3.5rem] border-2 border-border/40 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden group">
          {/* Decorative Elements */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none group-hover:bg-primary/20 transition-all duration-1000" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-md mx-auto relative z-10">
            {/* CONTENT: HỒ SƠ */}
            <TabsContent
              value="info"
              className="mt-0 outline-none focus-visible:ring-0 animate-in fade-in slide-in-from-right-4 duration-500"
            >
              <ProfileForm user={user} updateMutation={updateMutation} />
            </TabsContent>

            {/* CONTENT: MẬT KHẨU */}
            <TabsContent
              value="security"
              className="mt-0 outline-none focus-visible:ring-0 animate-in fade-in slide-in-from-left-4 duration-500"
            >
              {/* Security Alert Banner */}
              <div className="mb-10 p-5 bg-destructive/[0.03] rounded-2xl border border-destructive/10 flex items-start gap-4 transition-all hover:bg-destructive/[0.06] group/alert">
                <div className="p-2.5 bg-destructive text-blue-500 rounded-xl shadow-lg shadow-destructive/20 shrink-0 group-hover/alert:scale-110 transition-transform">
                  <ShieldAlert size={20} strokeWidth={2.5} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-[11px] font-black text-destructive uppercase tracking-widest">
                    Cảnh báo an toàn
                  </h4>
                  <p className="text-[10px] font-bold text-destructive/60 leading-relaxed uppercase tracking-tight">
                    Tuyệt đối không chia sẻ mật khẩu cho bất kỳ ai, kể cả Admin
                    homie nhé. Chúng tôi không bao giờ hỏi mật khẩu của bạn qua
                    chat.
                  </p>
                </div>
              </div>

              <PasswordForm passwordMutation={passwordMutation} />
            </TabsContent>

            <TabsContent
              value="2fa"
              className="mt-0 outline-none focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-4 duration-500"
            >
              <TwoFactorForm user={user} />
            </TabsContent>
          </div>
        </div>
      </Tabs>

      {/* FOOTER INFO */}
      <div className="mt-12 text-center">
        <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.5em]">
          Homie Finance Security Protocol v4.0
        </p>
      </div>
    </div>
  );
}
