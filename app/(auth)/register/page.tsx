"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormValues } from "@/schemas/auth.schema";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  LockKeyhole,
  Sparkles,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const { register: authRegister, isLoading, error: apiError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    await authRegister({
      username: data.username,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="flex flex-col w-full max-w-sm mx-auto font-sans animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* LOGO & TIÊU ĐỀ - REFINED */}
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
              Hành trình mới
            </span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-foreground leading-none">
            Tạo <span className="text-primary">Tài Khoản</span>
          </h1>
          <p className="text-muted-foreground font-medium text-sm tracking-tight px-4">
            Bắt đầu quản lý tài chính thông minh cùng cộng đồng Homie
          </p>
        </div>
      </div>

      {/* THÔNG BÁO LỖI TỪ API */}
      {apiError && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 text-destructive text-[11px] rounded-2xl font-black uppercase tracking-widest text-center animate-in zoom-in-95">
          ⚠️ {apiError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-6"
      >
        {/* Username Field */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1 flex items-center gap-2">
            <User size={12} className="text-primary" /> Tên của bạn
          </label>
          <div className="relative group">
            <Input
              {...register("username")}
              type="text"
              placeholder="Ví dụ: Hoàng Hải"
              className={cn(
                "h-14 px-5 rounded-2xl border-2 transition-all font-bold focus:bg-background",
                errors.username
                  ? "border-destructive/50 bg-destructive/[0.02]"
                  : "border-border/60 bg-muted/20 focus:border-primary/50",
              )}
            />
          </div>
          {errors.username && (
            <span className="text-[10px] font-bold text-destructive uppercase ml-1 tracking-tight animate-in slide-in-from-left-1">
              {errors.username.message}
            </span>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1 flex items-center gap-2">
            <Mail size={12} className="text-primary" /> Địa chỉ Email
          </label>
          <div className="relative group">
            <Input
              {...register("email")}
              type="email"
              placeholder="homie@example.com"
              className={cn(
                "h-14 px-5 rounded-2xl border-2 transition-all font-bold focus:bg-background",
                errors.email
                  ? "border-destructive/50 bg-destructive/[0.02]"
                  : "border-border/60 bg-muted/20 focus:border-primary/50",
              )}
            />
          </div>
          {errors.email && (
            <span className="text-[10px] font-bold text-destructive uppercase ml-1 tracking-tight animate-in slide-in-from-left-1">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1 flex items-center gap-2">
            <LockKeyhole size={12} className="text-primary" /> Mật mật mã
          </label>
          <div className="relative group">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn(
                "h-14 px-5 pr-14 rounded-2xl border-2 transition-all font-bold focus:bg-background",
                errors.password
                  ? "border-destructive/50 bg-destructive/[0.02]"
                  : "border-border/60 bg-muted/20 focus:border-primary/50",
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors p-2"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-[10px] font-bold text-destructive uppercase ml-1 tracking-tight animate-in slide-in-from-left-1">
              {errors.password.message}
            </span>
          )}
        </div>

        {/* NÚT SUBMIT - GIỮ NGUYÊN VARIANT LG VỚI SHADOW XỊN */}
        <Button
          type="submit"
          disabled={isLoading}
          variant="default"
          size="lg"
          className="w-full h-16 mt-2 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary/30 active:scale-[0.98] transition-all"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin size-5" />
              <span>Đang khởi tạo...</span>
            </div>
          ) : (
            "Gia nhập ngay"
          )}
        </Button>
      </form>

      {/* CHUYỂN SANG ĐĂNG NHẬP */}
      <div className="mt-12 text-center">
        <p className="text-sm font-medium text-muted-foreground tracking-tight">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-primary font-black uppercase tracking-wider hover:underline ml-1.5 transition-all hover:tracking-[0.15em]"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
