// components/profile/ProfileForm.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormValues } from "@/schemas/profile.schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail } from "lucide-react";
import { useEffect } from "react";

interface ProfileFormProps {
  user: any;
  updateMutation: any;
}

export function ProfileForm({ user, updateMutation }: ProfileFormProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { username: user?.username || "", email: user?.email || "" },
  });

  useEffect(() => {
    if (user) form.reset({ username: user.username, email: user.email });
  }, [user, form]);

  const onSubmit = (data: ProfileFormValues) => {
    if (data.username !== user?.username) {
      updateMutation.mutate(data.username);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 animate-in fade-in duration-500"
    >
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2">
          <Mail size={12} /> Địa chỉ Email
        </label>
        <Input
          {...form.register("email")}
          disabled
          className="bg-muted/50 border-dashed cursor-not-allowed font-bold opacity-70"
        />
        <p className="text-[10px] text-muted-foreground italic ml-1">
          * Email định danh không thể thay đổi
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground ml-1 flex items-center gap-2">
          <User size={12} /> Tên hiển thị (Username)
        </label>
        <Input
          {...form.register("username")}
          placeholder="Nhập tên mới..."
          className={form.formState.errors.username ? "border-destructive" : ""}
        />
        {form.formState.errors.username && (
          <p className="text-[10px] font-bold text-destructive ml-1 uppercase">
            {form.formState.errors.username.message}
          </p>
        )}
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          type="submit"
          disabled={!form.formState.isDirty || updateMutation.isPending}
          className="rounded-2xl font-black uppercase tracking-widest px-8 h-12 shadow-xl shadow-primary/20"
        >
          {updateMutation.isPending ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
        </Button>
      </div>
    </form>
  );
}
