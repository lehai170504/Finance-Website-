"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordSchema, PasswordFormValues } from "@/schemas/profile.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, ShieldCheck, Lock, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="space-y-2.5">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/70 ml-1 flex items-center gap-2">
        <Lock
          size={12}
          className={cn(
            form.formState.errors[id]
              ? "text-destructive"
              : "text-muted-foreground",
          )}
        />
        {label}
      </label>
      <div className="relative group">
        <Input
          {...register}
          type={show ? "text" : "password"}
          placeholder="••••••••"
          className={cn(
            "h-12 px-4 rounded-xl border-2 transition-all font-mono tracking-widest",
            form.formState.errors[id]
              ? "border-destructive/50 bg-destructive/[0.02] focus:border-destructive"
              : "border-border/60 bg-muted/20 focus:border-primary/50 focus:bg-background",
          )}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors p-1.5"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {form.formState.errors[id] && (
        <p className="text-[10px] font-bold text-destructive ml-1 uppercase flex items-center gap-1 animate-in fade-in slide-in-from-left-1">
          <ShieldAlert size={10} /> {form.formState.errors[id]?.message}
        </p>
      )}
    </div>
  );

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 animate-in fade-in duration-700"
    >
      <div className="p-6 bg-muted/20 rounded-[2rem] border border-border/40 space-y-6">
        <PasswordInput
          id="oldPassword"
          label="Mật khẩu hiện tại"
          show={showOld}
          setShow={setShowOld}
          register={form.register("oldPassword")}
        />

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-dashed border-border/60" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background px-3 text-[9px] font-black uppercase text-muted-foreground tracking-[0.3em]">
              Cấp mật khẩu mới
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <PasswordInput
            id="newPassword"
            label="Mật khẩu mới"
            show={showNew}
            setShow={setShowNew}
            register={form.register("newPassword")}
          />
          <PasswordInput
            id="confirmPassword"
            label="Xác nhận lại"
            show={showConfirm}
            setShow={setShowConfirm}
            register={form.register("confirmPassword")}
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <Button
          type="submit"
          disabled={passwordMutation.isPending}
          className="w-full sm:w-auto rounded-xl font-black uppercase tracking-[0.2em] px-10 h-14 bg-destructive text-white shadow-xl shadow-destructive/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <ShieldCheck size={18} className="mr-2" />
          {passwordMutation.isPending ? "ĐANG XỬ LÝ..." : "CẬP NHẬT BẢO MẬT"}
        </Button>
      </div>
    </form>
  );
}
