// schemas/profile.schema.ts
import * as z from "zod";

// Khai báo luật kiểm duyệt form
export const profileSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Tên hiển thị phải có ít nhất 2 ký tự" }),
  email: z.string(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(1, { message: "Vui lòng nhập mật khẩu hiện tại" }),
    newPassword: z
      .string()
      .min(6, { message: "Mật khẩu mới phải có ít nhất 6 ký tự" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Vui lòng xác nhận mật khẩu mới" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp!",
    path: ["confirmPassword"],
  });

export type PasswordFormValues = z.infer<typeof passwordSchema>;
