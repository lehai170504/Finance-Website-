// schemas/auth.schema.ts
import * as z from "zod";

// 1. Schema Đăng nhập
export const loginSchema = z.object({
  loginId: z
    .string()
    .min(1, { message: "Vui lòng nhập Email hoặc Tên đăng nhập" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// 2. Schema Đăng ký
export const registerSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Tên hiển thị phải có ít nhất 2 ký tự" }),
  email: z
    .string()
    .min(1, { message: "Vui lòng nhập email" })
    .email({ message: "Định dạng email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Vui lòng nhập email" })
    .email({ message: "Định dạng email không hợp lệ" }),
});
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

// Schema Bước 2: Xác nhận OTP và đặt pass mới
export const resetPasswordSchema = z
  .object({
    otp: z.string().min(1, { message: "Vui lòng nhập mã OTP" }),
    newPassword: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Vui lòng xác nhận mật khẩu mới" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp!",
    path: ["confirmPassword"],
  });
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
