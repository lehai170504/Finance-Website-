"use client";

import { useState } from "react";
import { useSavingsGoals } from "@/hooks/useSavingsGoals";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Target, PiggyBank, DollarSign, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateGoalModal({ isOpen, onClose }: Props) {
  const { createGoal } = useSavingsGoals();
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createGoal.mutate(
      {
        name: formData.name,
        targetAmount: Number(formData.targetAmount),
      },
      {
        onSuccess: () => {
          onClose();
          setFormData({ name: "", targetAmount: "" });
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-card via-card/98 to-card/95 backdrop-blur-2xl p-0 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full" />

        <div className="relative p-10">
          <DialogHeader className="space-y-6">
            <div className="relative mx-auto w-20 h-20">
              <div className="absolute inset-0 bg-orange-500/20 blur-2xl rounded-3xl" />
              <div className="relative w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                <PiggyBank size={40} strokeWidth={2} />
              </div>
            </div>
            <div className="space-y-2 text-center">
              <DialogTitle className="text-3xl font-bold tracking-tight text-foreground/90">
                Nuôi lợn đất mới
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-muted-foreground max-w-[280px] mx-auto leading-relaxed">
                Thiết lập mục tiêu và bắt đầu hành trình tích lũy thôi homie!
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-8 mt-10">
            <div className="space-y-6">
              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1 flex items-center gap-2">
                  <Target size={12} className="text-orange-500" />
                  Tên mục tiêu
                </label>
                <div className="relative group">
                  <Input
                    required
                    placeholder="Ví dụ: Mua xe máy mới, Du lịch Nhật Bản..."
                    className="h-14 rounded-2xl border-white/10 bg-white/5 focus-visible:ring-orange-500/20 focus-visible:border-orange-500/50 transition-all font-medium text-[15px] placeholder:text-muted-foreground/30 px-6"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 ml-1 flex items-center gap-2">
                  <DollarSign size={12} className="text-orange-500" />
                  Số tiền cần tiết kiệm (VNĐ)
                </label>
                <div className="relative group">
                  <Input
                    required
                    type="number"
                    placeholder="Nhập số tiền mục tiêu..."
                    className="h-14 rounded-2xl border-white/10 bg-white/5 focus-visible:ring-orange-500/20 focus-visible:border-orange-500/50 transition-all font-bold text-[15px] placeholder:text-muted-foreground/30 px-6"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-14 rounded-2xl font-bold uppercase text-[11px] tracking-widest border-white/10 bg-white/5 hover:bg-white/10 transition-all"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={createGoal.isPending}
                className={cn(
                  "flex-1 h-14 rounded-2xl font-bold uppercase text-[11px] tracking-widest transition-all duration-300",
                  "bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 shadow-lg shadow-orange-500/20 text-white"
                )}
              >
                {createGoal.isPending ? (
                  <span className="flex items-center gap-2">
                    <Sparkles size={16} className="animate-spin" />
                    Đang tạo...
                  </span>
                ) : (
                  "Xác nhận tạo"
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

