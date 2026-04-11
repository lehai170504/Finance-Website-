// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormValues } from "@/schemas/auth.schema";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

export default function LoginPage() {
  const { login, googleLogin, isLoading, error: apiError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await login({ username: data.email, password: data.password });
  };

  return (
    <div className="flex flex-col w-full">
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
            Đăng Nhập
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Nhập email của bạn để truy cập hệ thống
          </p>
        </div>
      </div>

      {apiError && (
        <div className="mb-6 p-4 bg-destructive/10 text-destructive text-xs rounded-xl font-bold uppercase tracking-wide">
          {apiError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-5"
      >
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1">
            Email của bạn
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
          <div className="flex justify-between items-center px-1">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              Mật khẩu
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] font-bold uppercase tracking-tight text-primary hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
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
          className="w-full rounded-xl shadow-xl shadow-primary/20"
        >
          {isLoading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
        </Button>
      </form>

      {/* DẢI PHÂN CÁCH */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
          <span className="bg-background px-3 text-muted-foreground">
            Hoặc đăng nhập với
          </span>
        </div>
      </div>

      {/* GOOGLE LOGIN */}
      <div className="flex justify-center w-full">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              googleLogin(credentialResponse.credential);
            }
          }}
          onError={() => toast.error("Đăng nhập Google thất bại!")}
          theme="outline"
          shape="circle"
          width="100%"
        />
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-primary font-black uppercase hover:underline ml-1"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
