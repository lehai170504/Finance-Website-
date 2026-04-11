"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormValues } from "@/schemas/profile.schema";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";
import { User, Mail, Sparkles, AlertCircle, Save, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  user: any;
  updateMutation: any;
}

export function ProfileForm({ user, updateMutation }: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { 
      username: user?.username || "", 
      email: user?.email || "" 
    },
  });

  // Đồng bộ data khi user load xong
  useEffect(() => {
    if (user) {
      form.reset({ 
        username: user.username, 
        email: user.email 
      });
    }
  }, [user, form]);

  const onSubmit = (data: ProfileFormValues) => {
    if (data.username !== user?.username) {
      updateMutation.mutate(data.username);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 animate-in fade-in duration-700 font-sans"
    >
      <div className="space-y-6">
        {/* EMAIL (CHẾ ĐỘ CHỈ ĐỌC - HIỂN THỊ RÕ NÉT) */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/50 ml-1 flex items-center gap-2">
            <Mail size={12} /> Email định danh
          </label>
          <div className="relative">
            <Input
              {...form.register("email")}
              disabled
              className="h-12 bg-muted/30 border-2 border-dashed border-border/60 cursor-not-allowed font-bold opacity-60 rounded-xl px-4 text-foreground"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <AlertCircle size={14} className="text-muted-foreground/40" />
            </div>
          </div>
          <p className="text-[9px] text-muted-foreground/60 font-medium uppercase tracking-widest ml-1">
            * Email dùng để đồng bộ hóa dữ liệu toàn hệ thống
          </p>
        </div>

        {/* TÊN HIỂN THỊ - USERNAME */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground ml-1 flex items-center gap-2">
            <User size={12} className="text-primary" /> Tên hiển thị (Homie Name)
          </label>
          <div className="relative group">
            <Input
              {...form.register("username")}
              placeholder="Bạn muốn được gọi là gì?"
              className={cn(
                "h-14 px-4 rounded-xl border-2 transition-all font-bold text-base text-foreground",
                form.formState.errors.username
                  ? "border-destructive/50 bg-destructive/[0.02] focus:border-destructive"
                  : "border-border bg-muted/10 focus:border-primary/50 focus:bg-background"
              )}
            />
            {/* Hiệu ứng lấp lánh khi có thay đổi hợp lệ */}
            {form.formState.isDirty && !form.formState.errors.username && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-bounce">
                <Sparkles size={16} className="text-yellow-500" />
              </div>
            )}
          </div>
          
          {/* HIỂN THỊ LỖI RÕ RÀNG */}
          {form.formState.errors.username && (
            <p className="text-[10px] font-bold text-destructive ml-1 uppercase flex items-center gap-1 animate-in slide-in-from-top-1">
              <AlertCircle size={10} /> {form.formState.errors.username.message}
            </p>
          )}
        </div>
      </div>

      <div className="pt-6 flex justify-end border-t border-border/40">
        <Button
          type="submit"
          variant="default"
          size="lg"
          disabled={!form.formState.isDirty || updateMutation.isPending}
          className="w-full sm:w-auto font-black uppercase tracking-[0.2em] rounded-xl px-10 transition-all shadow-xl"
        >
          {updateMutation.isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>ĐANG LƯU...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Save className="size-4" />
              <span>XÁC NHẬN THAY ĐỔI</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
}