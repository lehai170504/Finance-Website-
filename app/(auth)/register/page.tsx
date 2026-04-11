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
import { Eye, EyeOff } from "lucide-react";

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
    <div className="flex flex-col w-full">
      {/* LOGO & TIÊU ĐỀ */}
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
          <h1 className="text-2xl font-black uppercase tracking-tight">
            Tạo Tài Khoản
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Bắt đầu hành trình làm chủ tài chính cùng Homie
          </p>
        </div>
      </div>

      {/* THÔNG BÁO LỖI TỪ API */}
      {apiError && (
        <div className="mb-6 p-4 bg-destructive/10 text-destructive text-xs rounded-xl font-bold uppercase tracking-wide">
          {apiError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-5"
      >
        {/* Username Field */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            Tên hiển thị
          </label>
          <Input
            {...register("username")}
            type="text"
            placeholder="Ví dụ: Hoàng Hải"
            error={!!errors.username}
          />
          {errors.username && (
            <span className="text-[10px] font-bold text-destructive uppercase ml-1 tracking-tight">
              {errors.username.message}
            </span>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            Địa chỉ Email
          </label>
          <Input
            {...register("email")}
            type="email"
            placeholder="homie@example.com"
            error={!!errors.email}
          />
          {errors.email && (
            <span className="text-[10px] font-bold text-destructive uppercase ml-1 tracking-tight">
              {errors.email.message}
            </span>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            Mật khẩu
          </label>
          <div className="relative">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pr-12"
              error={!!errors.password}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <span className="text-[10px] font-bold text-destructive uppercase ml-1 tracking-tight">
              {errors.password.message}
            </span>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          size="lg"
          className="w-full mt-2 rounded-xl shadow-xl shadow-primary/20"
        >
          {isLoading ? "ĐANG TẠO TÀI KHOẢN..." : "ĐĂNG KÝ NGAY"}
        </Button>
      </form>

      {/* CHUYỂN SANG ĐĂNG NHẬP */}
      <div className="mt-10 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-primary font-black uppercase hover:underline ml-1"
          >
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
