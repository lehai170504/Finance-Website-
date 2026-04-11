"use client";

import { useState, useEffect } from "react";
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
import { useWallets } from "@/hooks/useWallets";
import { useCategories } from "@/hooks/useCategories"; // Đổi sang hook categories chuẩn
import {
  Wallet as WalletIcon,
  Coins,
  AlignLeft,
  CalendarDays,
  Tag,
  Loader2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any;
  onUpdate: (payload: any) => void;
  isUpdating: boolean;
}

export function EditTransactionModal({
  isOpen,
  onClose,
  transaction,
  onUpdate,
  isUpdating,
}: EditTransactionModalProps) {
  const { wallets } = useWallets();
  const { categories } = useCategories();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [walletId, setWalletId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Điền dữ liệu cũ vào form khi mở modal
  useEffect(() => {
    if (transaction && isOpen) {
      setAmount(transaction.amount.toString());
      setNote(transaction.note || "");
      setDate(transaction.date || "");

      const matchedWallet = wallets.find(
        (w: any) => w.name === transaction.walletName,
      );
      if (matchedWallet) setWalletId(matchedWallet.id);

      const matchedCategory = categories.find(
        (c: any) => c.name === transaction.categoryName,
      );
      if (matchedCategory) setCategoryId(matchedCategory.id);
    }
  }, [transaction, isOpen, wallets, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !walletId || !categoryId) return;
    onUpdate({
      id: transaction.id,
      newWalletId: walletId,
      categoryId: categoryId,
      data: { amount: Number(amount), note, date },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[2.5rem] border-none p-0 overflow-hidden max-w-md bg-background shadow-2xl font-sans outline-none">
        {/* HEADER VỚI HIỆU ỨNG GRADIENT NHẸ */}
        <div className="bg-primary p-8 pb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />

          <DialogHeader className="relative z-10">
            <DialogTitle className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
                <Sparkles size={24} className="text-white" />
              </div>
              Hiệu chỉnh
            </DialogTitle>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1 ml-1">
              Mã GD: #{transaction?.id?.slice(-6).toUpperCase()}
            </p>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-6 -mt-6 bg-background rounded-t-[2.5rem] relative z-20"
        >
          {/* SỐ TIỀN - DÙNG FONT MONEY BỰ */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
              <Coins size={12} /> Giá trị giao dịch
            </label>
            <div className="relative group">
              <Input
                type="number"
                required
                className="h-16 px-5 rounded-2xl border-2 border-border/50 bg-muted/20 font-money text-3xl font-black tracking-tighter focus:bg-background transition-all pr-16 text-primary"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-xs opacity-30 border-l pl-3 border-border/50">
                VNĐ
              </div>
            </div>
          </div>

          {/* GHI CHÚ */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
              <AlignLeft size={12} /> Nội dung ghi chép
            </label>
            <Input
              type="text"
              className="h-14 px-5 rounded-2xl border-2 border-border/50 bg-muted/20 font-bold focus:bg-background transition-all"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Mua trà sữa, ăn cơm..."
            />
          </div>

          {/* NGÀY GIAO DỊCH */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
              <CalendarDays size={12} /> Thời gian ghi nhận
            </label>
            <div className="relative">
              <Input
                type="date"
                required
                className="h-14 px-5 rounded-2xl border-2 border-border/50 bg-muted/20 font-bold focus:bg-background transition-all"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {/* CHỌN VÍ & DANH MỤC */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
                <WalletIcon size={12} /> Nguồn tiền
              </label>
              <Select
                value={walletId || undefined}
                onValueChange={(val) => setWalletId(val)}
              >
                <SelectTrigger className="h-14 rounded-2xl border-2 border-border/50 font-bold">
                  <SelectValue placeholder="Chọn ví" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {wallets.map((w: any) => (
                    <SelectItem key={w.id} value={w.id} className="rounded-xl">
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
                <Tag size={12} /> Phân loại
              </label>
              <Select
                value={categoryId || undefined}
                onValueChange={(val) => setCategoryId(val)}
              >
                <SelectTrigger className="h-14 rounded-2xl border-2 border-border/50 font-bold">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {categories.map((c: any) => (
                    <SelectItem key={c.id} value={c.id} className="rounded-xl">
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* NÚT SUBMIT */}
          <Button
            type="submit"
            disabled={
              isUpdating || !amount || !date || !walletId || !categoryId
            }
            className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            {isUpdating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                <span>ĐANG LƯU...</span>
              </div>
            ) : (
              "LƯU THAY ĐỔI"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
