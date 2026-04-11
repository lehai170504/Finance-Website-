"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  forgotPasswordSchema,
  ForgotPasswordFormValues,
  resetPasswordSchema,
  ResetPasswordFormValues,
} from "@/schemas/auth.schema";
import {
  Eye,
  EyeOff,
  ChevronLeft,
  Mail,
  ShieldCheck,
  LockKeyhole,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [savedEmail, setSavedEmail] = useState("");

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ===================== FORM 1: NHẬP EMAIL =====================
  const emailForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const sendOtpMutation = useMutation({
    mutationFn: (email: string) => authService.sendOtp(email),
    onSuccess: (_, variables) => {
      toast.success("Mã OTP đã hạ cánh xuống email của bạn! 🔥");
      setSavedEmail(variables);
      setStep("OTP");
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message ||
          "Không thể gửi email. Thử lại nhé homie!",
      );
    },
  });

  const onEmailSubmit = (data: ForgotPasswordFormValues) => {
    sendOtpMutation.mutate(data.email);
  };

  // ===================== FORM 2: NHẬP OTP & ĐẶT LẠI PASS =====================
  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: "", newPassword: "", confirmPassword: "" },
  });

  const resetMutation = useMutation({
    mutationFn: (data: ResetPasswordFormValues) =>
      authService.resetPassword(savedEmail, data.otp, data.newPassword),
    onSuccess: () => {
      toast.success("Mật khẩu mới đã sẵn sàng! Đăng nhập thôi.");
      router.push("/login");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Mã OTP không chính xác.");
    },
  });

  const onResetSubmit = (data: ResetPasswordFormValues) => {
    resetMutation.mutate(data);
  };

  return (
    <div className="flex flex-col w-full max-w-sm mx-auto font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* LOGO & HEADER */}
      <div className="flex flex-col items-center space-y-6 text-center mb-10">
        <Link
          href="/"
          className="group transition-transform duration-500 hover:scale-110"
        >
          <Image
            src="/logo.png"
            alt="Homie Icon"
            width={160}
            height={160}
            className="object-contain drop-shadow-2xl"
            priority
          />
        </Link>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-primary mb-1">
            <Sparkles size={16} fill="currentColor" className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Cấp lại mật mã
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase p-2 tracking-tighter text-foreground leading-none">
            {step === "EMAIL" ? "Quên mật khẩu?" : "Xác thực OTP"}
          </h1>
          <p className="text-muted-foreground font-medium text-sm px-4">
            {step === "EMAIL"
              ? "Đừng lo, nhập email để lấy lại quyền truy cập."
              : `Mã 6 số đã được gửi tới email của homie.`}
          </p>
        </div>
      </div>

      {step === "EMAIL" ? (
        // GIAO DIỆN BƯỚC 1: NHẬP EMAIL
        <form
          onSubmit={emailForm.handleSubmit(onEmailSubmit)}
          className="flex flex-col space-y-6 animate-in fade-in slide-in-from-left-4 duration-500"
        >
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1 flex items-center gap-2">
              <Mail size={12} className="text-primary" /> Email đăng ký
            </label>
            <Input
              {...emailForm.register("email")}
              type="email"
              placeholder="homie@example.com"
              className={cn(
                "h-14 px-5 rounded-2xl border-2 transition-all font-bold focus:bg-background",
                emailForm.formState.errors.email
                  ? "border-destructive/50 bg-destructive/[0.02]"
                  : "border-border/60 bg-muted/20 focus:border-primary/50",
              )}
            />
            {emailForm.formState.errors.email && (
              <span className="text-[10px] font-bold text-destructive uppercase ml-1 tracking-tight">
                {emailForm.formState.errors.email.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            disabled={sendOtpMutation.isPending}
            variant="default"
            size="lg"
            className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary/30 transition-all active:scale-95"
          >
            {sendOtpMutation.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin size-5" />
                <span>Đang xử lý...</span>
              </div>
            ) : (
              "Gửi mã xác thực"
            )}
          </Button>
        </form>
      ) : (
        // GIAO DIỆN BƯỚC 2: NHẬP OTP VÀ PASS MỚI
        <form
          onSubmit={resetForm.handleSubmit(onResetSubmit)}
          className="flex flex-col space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
        >
          {/* Ô Nhập OTP */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1 flex items-center gap-2">
              <ShieldCheck size={12} className="text-primary" /> Mã xác thực
              (OTP)
            </label>
            <Input
              {...resetForm.register("otp")}
              type="text"
              placeholder="000000"
              className={cn(
                "h-16 px-5 rounded-2xl border-2 transition-all text-center font-money font-black text-2xl tracking-[0.5em] focus:bg-background",
                resetForm.formState.errors.otp
                  ? "border-destructive/50 bg-destructive/[0.02]"
                  : "border-border/60 bg-muted/20 focus:border-primary/50",
              )}
              maxLength={6}
            />
            {resetForm.formState.errors.otp && (
              <span className="text-[10px] font-bold text-destructive uppercase ml-1 tracking-tight">
                {resetForm.formState.errors.otp.message}
              </span>
            )}
          </div>

          {/* Ô Mật khẩu mới */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1 flex items-center gap-2">
              <LockKeyhole size={12} className="text-primary" /> Mật mật mã mới
            </label>
            <div className="relative group">
              <Input
                {...resetForm.register("newPassword")}
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••"
                className={cn(
                  "h-14 px-5 pr-14 rounded-2xl border-2 transition-all font-bold focus:bg-background",
                  resetForm.formState.errors.newPassword
                    ? "border-destructive/50 bg-destructive/[0.02]"
                    : "border-border/60 bg-muted/20 focus:border-primary/50",
                )}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors p-2"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Ô Xác nhận mật khẩu */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1 flex items-center gap-2">
              <LockKeyhole size={12} className="text-primary" /> Nhập lại mật mã
            </label>
            <div className="relative group">
              <Input
                {...resetForm.register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className={cn(
                  "h-14 px-5 pr-14 rounded-2xl border-2 transition-all font-bold focus:bg-background",
                  resetForm.formState.errors.confirmPassword
                    ? "border-destructive/50 bg-destructive/[0.02]"
                    : "border-border/60 bg-muted/20 focus:border-primary/50",
                )}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors p-2"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={resetMutation.isPending}
            variant="default"
            size="lg"
            className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary/30 transition-all active:scale-[0.98]"
          >
            {resetMutation.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin size-5" />
                <span>Đang xử lý...</span>
              </div>
            ) : (
              "Kích hoạt mật mã mới"
            )}
          </Button>
        </form>
      )}

      {/* FOOTER: QUAY LẠI */}
      <div className="mt-12 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2.5 text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/60 hover:text-primary transition-all group"
        >
          <ChevronLeft
            size={16}
            strokeWidth={3}
            className="group-hover:-translate-x-1.5 transition-transform"
          />
          Quay lại hệ thống
        </Link>
      </div>
    </div>
  );
}
