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
import { Eye, EyeOff, ChevronLeft } from "lucide-react";

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
      toast.success("Mã OTP đã được gửi đến email của bạn!");
      setSavedEmail(variables);
      setStep("OTP");
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message || "Không thể gửi email. Vui lòng kiểm tra lại.",
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
      toast.success("Khôi phục mật khẩu thành công! Hãy đăng nhập lại.");
      router.push("/login");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn.");
    },
  });

  const onResetSubmit = (data: ResetPasswordFormValues) => {
    resetMutation.mutate(data);
  };

  return (
    <div className="flex flex-col w-full">
      {/* 🆕 LOGO & TIÊU ĐỀ */}
      <div className="flex flex-col items-center space-y-6 text-center mb-8">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-transform hover:scale-105"
        >
          <Image
            src="/logo.png"
            alt="Homie Icon"
            width={240}
            height={240}
            className="object-contain drop-shadow-md"
            priority
          />
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-black uppercase tracking-tight">Khôi phục mật khẩu</h1>
          <p className="text-sm text-muted-foreground font-medium px-4">
            {step === "EMAIL"
              ? "Nhập email của bạn để nhận mã xác thực (OTP)."
              : `Mã xác thực đã được gửi tới ${savedEmail}`}
          </p>
        </div>
      </div>

      {step === "EMAIL" ? (
        // GIAO DIỆN BƯỚC 1: NHẬP EMAIL
        <form
          onSubmit={emailForm.handleSubmit(onEmailSubmit)}
          className="flex flex-col space-y-5"
        >
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Email đăng ký
            </label>
            <Input
              {...emailForm.register("email")}
              type="email"
              placeholder="homie@example.com"
              error={!!emailForm.formState.errors.email}
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
            size="lg"
            className="w-full mt-2 rounded-xl shadow-xl shadow-primary/20"
          >
            {sendOtpMutation.isPending ? "ĐANG GỬI..." : "GỬI MÃ OTP"}
          </Button>
        </form>
      ) : (
        // GIAO DIỆN BƯỚC 2: NHẬP OTP VÀ PASS MỚI
        <form
          onSubmit={resetForm.handleSubmit(onResetSubmit)}
          className="flex flex-col space-y-5"
        >
          {/* Ô Nhập OTP */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Mã xác thực OTP
            </label>
            <Input
              {...resetForm.register("otp")}
              type="text"
              placeholder="Gồm 6 chữ số"
              className="text-center tracking-[0.5em] font-black text-lg"
              maxLength={6}
              error={!!resetForm.formState.errors.otp}
            />
            {resetForm.formState.errors.otp && (
              <span className="text-[10px] font-bold text-destructive uppercase ml-1 tracking-tight">
                {resetForm.formState.errors.otp.message}
              </span>
            )}
          </div>

          {/* Ô Mật khẩu mới */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Mật khẩu mới
            </label>
            <div className="relative">
              <Input
                {...resetForm.register("newPassword")}
                type={showNewPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-12"
                error={!!resetForm.formState.errors.newPassword}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {resetForm.formState.errors.newPassword && (
              <span className="text-[10px] font-bold text-destructive uppercase ml-1 tracking-tight">
                {resetForm.formState.errors.newPassword.message}
              </span>
            )}
          </div>

          {/* Ô Xác nhận mật khẩu */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Xác nhận mật khẩu
            </label>
            <div className="relative">
              <Input
                {...resetForm.register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pr-12"
                error={!!resetForm.formState.errors.confirmPassword}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {resetForm.formState.errors.confirmPassword && (
              <span className="text-[10px] font-bold text-destructive uppercase ml-1 tracking-tight">
                {resetForm.formState.errors.confirmPassword.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            disabled={resetMutation.isPending}
            size="lg"
            className="w-full mt-2 rounded-xl shadow-xl shadow-primary/20"
          >
            {resetMutation.isPending ? "ĐANG XỬ LÝ..." : "ĐẶT LẠI MẬT KHẨU"}
          </Button>
        </form>
      )}

      {/* FOOTER: QUAY LẠI */}
      <div className="mt-10 text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors group"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
}