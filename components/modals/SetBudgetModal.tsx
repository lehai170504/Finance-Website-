"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReports } from "@/hooks/useReports";
import { Tag, CalendarDays, Coins, Target, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories";

export function SetBudgetModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { categories } = useCategories();
  const { setBudget } = useReports();
  const [categoryId, setCategoryId] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [limitAmount, setLimitAmount] = useState("");

  const expenseCategories = categories.filter((c) => c.type === "EXPENSE");

  const handleSubmit = () => {
    if (!categoryId || !limitAmount) return;
    setBudget.mutate(
      { categoryId, month, year, limitAmount: Number(limitAmount) },
      {
        onSuccess: () => {
          onClose();
          setLimitAmount("");
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[2.5rem] border-none p-8 max-w-md bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-destructive/10 text-destructive rounded-2xl">
              <Target size={24} strokeWidth={2.5} />
            </div>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-foreground">
              Thiết lập hạn mức
            </DialogTitle>
          </div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest leading-relaxed">
            Đặt giới hạn chi tiêu để kiểm soát tài chính tốt hơn.
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* DANH MỤC */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
              <Tag size={12} /> Danh mục chi tiêu
            </label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="h-12 rounded-2xl bg-background border-2 font-bold">
                <SelectValue placeholder="CHỌN DANH MỤC" />
              </SelectTrigger>
              <SelectContent>
                {expenseCategories.map((c) => (
                  <SelectItem
                    key={c.id}
                    value={c.id}
                    className="font-bold uppercase text-[10px]"
                  >
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* THÁNG & NĂM */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                <CalendarDays size={12} /> Tháng
              </label>
              <Input
                type="number"
                min="1"
                max="12"
                className="h-12 font-bold rounded-2xl border-2"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                <CalendarDays size={12} /> Năm
              </label>
              <Input
                type="number"
                className="h-12 font-bold rounded-2xl border-2"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>
          </div>

          {/* SỐ TIỀN TỐI ĐA */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
              <Coins size={12} /> Ngân sách giới hạn (VNĐ)
            </label>
            <Input
              type="number"
              className="h-16 text-3xl font-black tracking-tighter text-destructive rounded-[1.5rem] border-2 border-destructive/20 focus:border-destructive focus:ring-destructive/10"
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
              placeholder="0"
            />
          </div>

          {/* NÚT SUBMIT */}
          <div className="pt-2">
            <Button
              onClick={handleSubmit}
              disabled={setBudget.isPending || !categoryId || !limitAmount}
              className={cn(
                "w-full rounded-[1.5rem] font-black uppercase h-14 tracking-[0.15em] transition-all duration-300 shadow-xl",
                "text-destructive-foreground hover:bg-destructive/90 shadow-destructive/20 hover:scale-[1.02] active:scale-95",
                "disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:scale-100 disabled:opacity-100",
              )}
            >
              {setBudget.isPending ? (
                "ĐANG THIẾT LẬP..."
              ) : (
                <span className="flex items-center gap-2">
                  KÍCH HOẠT HẠN MỨC <AlertCircle size={16} />
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
