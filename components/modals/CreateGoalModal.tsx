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
import { Target, PiggyBank, DollarSign } from "lucide-react";

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
      <DialogContent className="sm:max-w-[480px] rounded-[2rem] border-2 border-border/40 p-8">
        <DialogHeader className="space-y-4">
          <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-500/20 mx-auto">
            <PiggyBank size={32} strokeWidth={2.5} />
          </div>
          <DialogTitle className="text-3xl font-black uppercase tracking-tight text-center">
            Nuôi lợn đất mới
          </DialogTitle>
          <DialogDescription className="text-center font-medium">
            Thiết lập mục tiêu và bắt đầu hành trình tích lũy thôi homie!
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                Tên mục tiêu
              </label>
              <div className="relative group">
                <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-orange-500 transition-colors" size={18} />
                <Input
                  required
                  placeholder="Ví dụ: Mua xe máy mới, Du lịch Nhật Bản..."
                  className="pl-12 h-14 rounded-2xl border-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                Số tiền cần tiết kiệm (VNĐ)
              </label>
              <div className="relative group">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-orange-500 transition-colors" size={18} />
                <Input
                  required
                  type="number"
                  placeholder="Nhập số tiền mục tiêu..."
                  className="pl-12 h-14 rounded-2xl border-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 transition-all font-bold"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl font-black uppercase text-[11px] tracking-widest border-2"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={createGoal.isPending}
              className="flex-1 h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 font-black uppercase text-[11px] tracking-widest shadow-lg shadow-orange-500/20"
            >
              {createGoal.isPending ? "Đang tạo..." : "Xác nhận tạo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
