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
import { DatePickerInput } from "@/components/ui/date-picker-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWallets } from "@/hooks/useWallets";
import { useReports } from "@/hooks/useReports";
import {
  Wallet as WalletIcon,
  Coins,
  AlignLeft,
  CalendarDays,
  Tag,
} from "lucide-react";

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
  const { categories } = useReports();

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [walletId, setWalletId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Điền dữ liệu cũ vào form
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

  const handleSubmit = () => {
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
      <DialogContent className="rounded-[2.5rem] border-none p-8 max-w-md bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-primary">
            Sửa giao dịch
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* SỐ TIỀN */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
              <Coins size={12} /> Số tiền (VNĐ)
            </label>
            <Input
              type="number"
              className="h-14 text-2xl font-black tracking-tighter text-primary"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
          </div>

          {/* GHI CHÚ */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
              <AlignLeft size={12} /> Ghi chú
            </label>
            <Input
              type="text"
              className="font-medium"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú..."
            />
          </div>

          {/* 🆕 NGÀY GIAO DỊCH (GỌI COMPONENT REUSABLE) */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
              <CalendarDays size={12} /> Ngày giao dịch
            </label>
            <DatePickerInput
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* CHỌN VÍ & DANH MỤC */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                <WalletIcon size={12} /> Từ Ví
              </label>
              <Select
                value={walletId || undefined}
                onValueChange={(val) => setWalletId(val)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Chọn ví" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((w: any) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                <Tag size={12} /> Danh mục
              </label>
              <Select
                value={categoryId || undefined}
                onValueChange={(val) => setCategoryId(val)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Chọn loại" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* NÚT SUBMIT */}
          <Button
            onClick={handleSubmit}
            disabled={
              isUpdating || !amount || !date || !walletId || !categoryId
            }
            size="lg"
            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20"
          >
            {isUpdating ? "ĐANG LƯU..." : "CẬP NHẬT"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
