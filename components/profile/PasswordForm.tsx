// components/profile/PasswordForm.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, PasswordFormValues } from "@/schemas/profile.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";

export function PasswordForm({ passwordMutation }: { passwordMutation: any }) {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = (data: PasswordFormValues) => {
    passwordMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        setShowOld(false);
        setShowNew(false);
        setShowConfirm(false);
      },
    });
  };

  const PasswordInput = ({
    id,
    label,
    show,
    setShow,
    register,
  }: {
    id: keyof PasswordFormValues;
    label: string;
    show: boolean;
    setShow: (val: boolean) => void;
    register: any;
  }) => (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground ml-1 flex items-center gap-2">
        <Lock size={12} /> {label}
      </label>
      <div className="relative group">
        <Input
          {...register}
          type={show ? "text" : "password"}
          className={
            form.formState.errors[id] ? "border-destructive pr-10" : "pr-10"
          }
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {/* 🆕 Fix lỗi truy cập message */}
      {form.formState.errors[id] && (
        <p className="text-[10px] font-bold text-destructive ml-1 uppercase">
          {form.formState.errors[id]?.message}
        </p>
      )}
    </div>
  );

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 animate-in fade-in duration-500"
    >
      <PasswordInput
        id="oldPassword"
        label="Mật khẩu hiện tại"
        show={showOld}
        setShow={setShowOld}
        register={form.register("oldPassword")}
      />
      <div className="h-px bg-border/50 my-2" />
      <PasswordInput
        id="newPassword"
        label="Mật khẩu mới"
        show={showNew}
        setShow={setShowNew}
        register={form.register("newPassword")}
      />
      <PasswordInput
        id="confirmPassword"
        label="Xác nhận mật khẩu mới"
        show={showConfirm}
        setShow={setShowConfirm}
        register={form.register("confirmPassword")}
      />

      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          variant="destructive"
          disabled={passwordMutation.isPending}
          className="rounded-2xl font-black uppercase tracking-widest px-8 h-12 shadow-xl shadow-destructive/20"
        >
          <ShieldCheck size={16} className="mr-2" />
          {passwordMutation.isPending ? "ĐANG ĐỔI..." : "CẬP NHẬT BẢO MẬT"}
        </Button>
      </div>
    </form>
  );
}
