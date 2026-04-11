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
import { useWallets } from "@/hooks/useWallets";
import { Wallet } from "@/types/wallet";
import {
  Wallet as WalletIcon,
  Coins,
  ArrowRightLeft,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function TransferWalletModal({
  isOpen,
  onClose,
  wallets,
}: {
  isOpen: boolean;
  onClose: () => void;
  wallets: Wallet[];
}) {
  const { transferWallet } = useWallets();
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");

  const handleTransfer = () => {
    if (!fromId || !toId || !amount || fromId === toId) return;
    transferWallet.mutate(
      { fromId, toId, amount: Number(amount) },
      {
        onSuccess: () => {
          onClose();
          setFromId("");
          setToId("");
          setAmount("");
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[2.5rem] border-none p-0 overflow-hidden max-w-md bg-background shadow-2xl font-sans outline-none">
        {/* HEADER VỚI HIỆU ỨNG CHUYỂN ĐỘNG */}
        <div className="bg-primary/5 p-8 pb-10 relative">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-primary text-white rounded-xl shadow-lg shadow-primary/20">
                <RefreshCw
                  size={24}
                  strokeWidth={3}
                  className="animate-[spin_4s_linear_infinite]"
                />
              </div>
              <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-foreground">
                Điều chuyển
              </DialogTitle>
            </div>
            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em] ml-1">
              Luân chuyển dòng tiền nội bộ
            </p>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-6 -mt-6 bg-background rounded-t-[2.5rem] relative z-20">
          {/* KHU VỰC CHỌN VÍ NGUỒN & ĐÍCH */}
          <div className="relative flex items-center gap-3 p-1 bg-muted/20 rounded-[2rem] border-2 border-border/40">
            {/* VÍ GỬI */}
            <div className="flex-1 space-y-1.5 p-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400" /> Nguồn
                tiền
              </label>
              <Select value={fromId || undefined} onValueChange={setFromId}>
                <SelectTrigger className="h-12 rounded-xl bg-background border-none shadow-sm font-bold transition-all focus:ring-red-400/20">
                  <SelectValue placeholder="Từ ví" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {wallets.map((w) => (
                    <SelectItem
                      key={w.id}
                      value={w.id}
                      className="rounded-xl font-bold uppercase text-[10px]"
                    >
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ICON CHUYỂN ĐỔI Ở GIỮA */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 shrink-0 flex items-center justify-center rounded-xl bg-primary text-white p-2.5 shadow-xl shadow-primary/30 border-4 border-background group hover:rotate-180 transition-transform duration-500">
              <ArrowRightLeft size={16} strokeWidth={3} />
            </div>

            {/* VÍ NHẬN */}
            <div className="flex-1 space-y-1.5 p-3">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/70 mr-1 flex items-center justify-end gap-1.5">
                Đích đến{" "}
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </label>
              <Select value={toId || undefined} onValueChange={setToId}>
                <SelectTrigger className="h-12 rounded-xl bg-background border-none shadow-sm font-bold text-right transition-all focus:ring-emerald-400/20">
                  <SelectValue placeholder="Đến ví" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl" align="end">
                  {wallets.map((w) => (
                    <SelectItem
                      key={w.id}
                      value={w.id}
                      className="rounded-xl font-bold uppercase text-[10px]"
                    >
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SỐ TIỀN CHUYỂN */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
              <Coins size={12} /> Giá trị điều chuyển
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
            {fromId === toId && fromId !== "" && (
              <p className="text-[10px] font-bold text-destructive flex items-center gap-1 mt-1 ml-1">
                Hai ví không được trùng nhau homie ơi!
              </p>
            )}
          </div>

          {/* NÚT SUBMIT */}
          <Button
            onClick={handleTransfer}
            disabled={
              transferWallet.isPending ||
              !fromId ||
              !toId ||
              !amount ||
              fromId === toId
            }
            className={cn(
              "w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl transition-all active:scale-95",
              "bg-primary text-white shadow-primary/30 hover:brightness-110",
              "disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none disabled:scale-100",
            )}
          >
            {transferWallet.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                <span>ĐANG XỬ LÝ...</span>
              </div>
            ) : (
              "XÁC NHẬN ĐIỀU CHUYỂN"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
