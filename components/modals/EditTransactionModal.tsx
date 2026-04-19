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
import { useCategories } from "@/hooks/useCategories";
import {
  Wallet as WalletIcon,
  Coins,
  AlignLeft,
  CalendarDays,
  Tag,
  Loader2,
  Sparkles,
  PencilLine,
  X,
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
  const [receiptUrl, setReceiptUrl] = useState("");

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
      
      setReceiptUrl(transaction.receiptUrl || "");
    }
  }, [transaction, isOpen, wallets, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !date || !walletId || !categoryId) return;
    onUpdate({
      id: transaction.id,
      newWalletId: walletId,
      categoryId: categoryId,
      data: { amount: Number(amount), note, date, receiptUrl: receiptUrl || undefined },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[calc(100%-2rem)] md:max-w-md rounded-[2.5rem] border-none p-0 overflow-hidden bg-background shadow-2xl font-sans outline-none mx-auto transition-all">
        <div className="bg-gradient-to-br from-primary via-primary/90 to-blue-600 p-8 pb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl -ml-12 -mb-12" />

          <DialogHeader className="relative z-10">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl md:text-3xl font-black uppercase tracking-tighter flex items-center gap-3 text-white leading-none">
                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl shadow-lg border border-white/20 shrink-0">
                  <PencilLine
                    size={24}
                    className="text-white"
                    strokeWidth={2.5}
                  />
                </div>
                <span>Hiệu chỉnh</span>
              </DialogTitle>
            </div>
            <div className="flex items-center gap-2 mt-3 opacity-80">
              <Sparkles size={12} className="text-blue-200" />
              <p className="text-white text-[9px] font-black uppercase tracking-[0.2em]">
                Mã GD: #{transaction?.id?.slice(-6).toUpperCase() || "N/A"}
              </p>
            </div>
          </DialogHeader>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 md:p-8 space-y-6 -mt-8 bg-background rounded-t-[2.5rem] relative z-20"
        >
          {/* SỐ TIỀN */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
              <Coins size={12} className="text-primary" /> Giá trị giao dịch
            </label>
            <div className="relative group">
              <Input
                type="number"
                required
                className="h-16 px-5 rounded-2xl border-2 border-border/50 bg-muted/20 font-money text-2xl md:text-3xl font-black tracking-tighter focus:bg-background transition-all pr-16 text-primary"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-[10px] opacity-30 border-l pl-3 border-border/50 uppercase tracking-widest">
                VNĐ
              </div>
            </div>
          </div>

          {/* GHI CHÚ */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
              <AlignLeft size={12} className="text-primary" /> Nội dung ghi chép
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
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
              <CalendarDays size={12} className="text-primary" /> Thời gian ghi
              nhận
            </label>
            <Input
              type="date"
              required
              className="h-14 px-5 rounded-2xl border-2 border-border/50 bg-muted/20 font-bold focus:bg-background transition-all"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* HIỂN THỊ BILL HIỆN TẠI (NẾU CÓ) */}
          {receiptUrl && (
            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
                <PencilLine size={12} className="text-primary" /> Hóa đơn đính kèm
              </label>
              <div className="relative w-24 h-24 group/bill">
                <img 
                  src={receiptUrl} 
                  alt="Current receipt" 
                  className="w-full h-full rounded-2xl object-cover border-2 border-border/50 shadow-md cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => window.open(receiptUrl, '_blank')}
                />
                <button 
                  type="button"
                  onClick={() => setReceiptUrl("")}
                  className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover/bill:opacity-100 transition-opacity"
                >
                  <X size={10} strokeWidth={4} />
                </button>
              </div>
            </div>
          )}

          {/* CHỌN VÍ & DANH MỤC */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
                <WalletIcon size={12} className="text-primary" /> Nguồn tiền
              </label>
              <Select
                value={walletId || undefined}
                onValueChange={(val) => setWalletId(val)}
              >
                <SelectTrigger className="h-14 rounded-2xl border-2 border-border/50 font-bold bg-muted/20">
                  <SelectValue placeholder="Chọn ví" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl">
                  {wallets.map((w: any) => (
                    <SelectItem key={w.id} value={w.id} className="rounded-xl">
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
                <Tag size={12} className="text-primary" /> Phân loại
              </label>
              <Select
                value={categoryId || undefined}
                onValueChange={(val) => setCategoryId(val)}
              >
                <SelectTrigger className="h-14 rounded-2xl border-2 border-border/50 font-bold bg-muted/20">
                  <SelectValue placeholder="Danh mục" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl shadow-2xl">
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
            className="w-full h-16 mt-2 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary"
          >
            {isUpdating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                <span>Đang lưu...</span>
              </div>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
