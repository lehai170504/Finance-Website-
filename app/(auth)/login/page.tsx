"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/schemas/auth.schema";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  User,
  Sparkles,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Cookies from "js-cookie";

export default function LoginPage() {
  const {
    login,
    googleLogin,
    verify2FA,
    isLoading,
    error: apiError,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [tempToken, setTempToken] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { loginId: "", password: "" },
  });

  // Khôi phục trạng thái khi user lỡ tay F5
  useEffect(() => {
    const isWaiting = Cookies.get("temp_2fa_valid");
    const savedToken = localStorage.getItem("temp_2fa_token");
    if (isWaiting && savedToken) {
      setRequires2FA(true);
      setTempToken(savedToken);
    }
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    const result = await login(data);

    // Nếu dính 2FA, chuyển sang form OTP và DỪNG LẠI NGAY
    if (result?.requires2FA && result.tempToken) {
      localStorage.setItem("temp_2fa_token", result.tempToken);
      setRequires2FA(true);
      setTempToken(result.tempToken);
      setOtpCode("");
      toast.info("Vui lòng nhập mã OTP!");
      return;
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      const result = await googleLogin(credentialResponse.credential);

      // Chặn tương tự cho Google Login
      if (result?.requires2FA && result.tempToken) {
        localStorage.setItem("temp_2fa_token", result.tempToken);
        setRequires2FA(true);
        setTempToken(result.tempToken);
        setOtpCode("");
        toast.info("Tài khoản Google yêu cầu xác minh 2 lớp!");
        return;
      }
    }
  };

  const onVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast.error("Vui lòng nhập đủ 6 chữ số homie!");
      return;
    }

    const success = await verify2FA({ tempToken, code: parseInt(otpCode) });

    if (success) {
      localStorage.removeItem("temp_2fa_token");
      Cookies.remove("temp_2fa_valid");
    } else {
      setOtpCode(""); // Nhập sai thì clear để nhập lại mã mới
    }
  };

  const handleBackToLogin = () => {
    setRequires2FA(false);
    setTempToken("");
    setOtpCode("");
    Cookies.remove("temp_2fa_valid");
    localStorage.removeItem("temp_2fa_token");
  };

  return (
    <div className="flex flex-col w-full max-w-sm mx-auto font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col items-center space-y-6 text-center mb-10">
        <Link
          href="/"
          className="relative group transition-transform duration-500 hover:scale-110"
        >
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Image
            src="/logo.png"
            alt="Homie Icon"
            width={160}
            height={160}
            className="object-contain relative z-10 drop-shadow-2xl"
            priority
          />
        </Link>

        <div className="space-y-2 relative">
          <div className="flex items-center justify-center gap-2 text-primary mb-1">
            <Sparkles size={16} fill="currentColor" className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              {requires2FA ? "Xác minh lớp bảo mật" : "Hệ thống định danh"}
            </span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground leading-none">
            {requires2FA ? (
              <span className="text-primary">Xác thực OTP</span>
            ) : (
              <>
                Chào <span className="text-primary">Homie!</span>
              </>
            )}
          </h1>
          <p className="text-muted-foreground font-medium text-sm tracking-tight">
            {requires2FA
              ? "Nhập mã 6 số từ ứng dụng Authenticator"
              : "Nhập thông tin để bắt đầu quản lý tài chính"}
          </p>
        </div>
      </div>

      {/* ERROR MESSAGE (Global) */}
      {apiError && typeof apiError === "string" && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-[11px] rounded-2xl font-black uppercase tracking-widest text-center animate-in zoom-in-95">
          ⚠️ {apiError}
        </div>
      )}

      {/* RENDER DỰA TRÊN TRẠNG THÁI 2FA */}
      {requires2FA ? (
        /* ========================================================= */
        /* GIAO DIỆN NHẬP MÃ 2FA                                     */
        /* ========================================================= */
        <form
          onSubmit={onVerify2FA}
          className="flex flex-col space-y-6 animate-in slide-in-from-right-4 duration-500"
        >
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
            <ShieldCheck className="text-amber-500 shrink-0" size={20} />
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-tight leading-tight">
              Vui lòng nhập mã 2FA từ ứng dụng Google Authenticator!
            </span>
          </div>

          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1 flex items-center gap-2">
              Mã bảo mật 6 số
            </label>
            <Input
              type="text"
              maxLength={6}
              value={otpCode}
              disabled={isLoading}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
              placeholder="000000"
              className="h-14 px-5 text-center text-2xl tracking-[0.5em] rounded-2xl border-2 transition-all font-bold focus:bg-background border-border/60 bg-muted/20 focus:border-primary/50"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading || otpCode.length !== 6}
            className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em]"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Xác nhận ngay"}
          </Button>

          <button
            type="button"
            onClick={handleBackToLogin}
            className="text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors text-center"
          >
            ← Quay lại đăng nhập
          </button>
        </form>
      ) : (
        /* ========================================================= */
        /* GIAO DIỆN ĐĂNG NHẬP THÔNG THƯỜNG                           */
        /* ========================================================= */
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-6 animate-in slide-in-from-left-4 duration-500"
          >
            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1 flex items-center gap-2">
                <User size={12} className="text-primary" /> Email hoặc Tên đăng
                nhập
              </label>
              <Input
                {...register("loginId")}
                type="text"
                disabled={isLoading}
                placeholder="homiedev hoặc homie@example.com"
                className={cn(
                  "h-14 px-5 rounded-2xl border-2 transition-all font-bold",
                  errors.loginId
                    ? "border-destructive/50"
                    : "border-border/60 bg-muted/20 focus:border-primary/50",
                )}
              />
              {errors.loginId && (
                <span className="text-destructive text-[10px] font-bold uppercase ml-1">
                  {errors.loginId.message}
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 flex items-center gap-2">
                  <LockKeyhole size={12} className="text-primary" /> Mật mã
                </label>
                <Link
                  href="/forgot-password"
                  className={cn(
                    "text-[10px] font-black uppercase text-muted-foreground hover:text-primary",
                    isLoading && "pointer-events-none opacity-50",
                  )}
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                  placeholder="••••••••"
                  className={cn(
                    "h-14 px-5 pr-14 rounded-2xl border-2 transition-all font-bold",
                    errors.password
                      ? "border-destructive/50"
                      : "border-border/60 bg-muted/20 focus:border-primary/50",
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary p-2"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <span className="text-destructive text-[10px] font-bold uppercase ml-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Đăng nhập ngay"
              )}
            </Button>
          </form>

          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-4 text-[9px] uppercase font-black text-muted-foreground/60 tracking-[0.3em]">
                Social Connect
              </span>
            </div>
          </div>

          <div className="flex justify-center w-full transform hover:scale-[1.02] transition-all">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => toast.error("Đăng nhập Google thất bại!")}
              theme="outline"
              shape="circle"
              width="350px"
            />
          </div>

          <div className="mt-12 text-center text-sm font-medium text-muted-foreground tracking-tight">
            Chưa là thành viên?{" "}
            <Link
              href="/register"
              className="text-primary font-black uppercase tracking-wider hover:underline ml-1.5 transition-all"
            >
              Gia nhập ngay
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
