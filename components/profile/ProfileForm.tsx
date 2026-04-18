"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, ProfileFormValues } from "@/schemas/profile.schema";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";
import { User, Mail, Sparkles, AlertCircle, Save, Loader2, Camera } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth"; 

interface ProfileFormProps {
  user: any;
  updateMutation: any;
}

export function ProfileForm({ user, updateMutation }: ProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { uploadAvatar } = useAuth(); 

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { 
      username: user?.username || "", 
      email: user?.email || "" 
    },
  });

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    uploadAvatar.mutate(file);
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-8 animate-in fade-in duration-700 font-sans"
    >
      <div className="flex flex-col items-center justify-center space-y-4 mb-8">
        <div 
          className="relative group cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {/* Avatar Circle */}
          <div className="w-28 h-28 rounded-full border-4 border-primary/20 p-1 bg-background overflow-hidden relative shadow-2xl transition-transform group-hover:scale-105">
            <img 
              src={preview || user?.avatarUrl || "/default-avatar.png"} 
              alt="Avatar" 
              className={cn(
                "w-full h-full object-cover rounded-full transition-all",
                uploadAvatar.isPending && "blur-[2px] opacity-50"
              )}
            />
            
            {/* Overlay khi hover */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="text-white size-7" />
            </div>

            {/* Loading Spinner khi đang upload */}
            {uploadAvatar.isPending && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary size-8" />
              </div>
            )}
          </div>

          {/* Badge icon nhỏ xinh bên góc */}
          <div className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg border-2 border-background">
            <Camera size={12} />
          </div>
        </div>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">Ảnh đại diện</p>
          <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tight mt-1">
            Chấp nhận JPG, PNG (Max 5MB)
          </p>
        </div>

        {/* Input ẩn */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <div className="space-y-6">
        {/* EMAIL (READ-ONLY) */}
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
        </div>

        {/* USERNAME */}
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
            {form.formState.isDirty && !form.formState.errors.username && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-bounce">
                <Sparkles size={16} className="text-yellow-500" />
              </div>
            )}
          </div>
          
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