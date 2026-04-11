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
  RefreshCw,
  Coins,
  ArrowRightLeft,
  Loader2,
  TrendingUp,
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
      <DialogContent className="w-[calc(100%-2rem)] md:max-w-md rounded-[2.5rem] border-none p-0 overflow-hidden bg-background shadow-2xl font-sans outline-none mx-auto transition-all">
        {/* HEADER */}
        <div className="bg-primary/5 p-8 pb-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />

          <DialogHeader className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-primary text-white rounded-2xl shadow-xl">
                <RefreshCw
                  size={24}
                  strokeWidth={3}
                  className="animate-[spin_6s_linear_infinite]"
                />
              </div>
              <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-foreground leading-none">
                Điều chuyển
              </DialogTitle>
            </div>
            <p className="text-[10px] font-black uppercase text-muted-foreground/60 tracking-[0.3em] ml-1">
              Internal Liquidity Transfer
            </p>
          </DialogHeader>
        </div>

        <div className="p-6 md:p-8 space-y-8 -mt-8 bg-background rounded-t-[2.5rem] relative z-20">
          {/* KHU VỰC CHỌN VÍ - RESPONSIVE HOVER */}
          <div className="group relative flex flex-col gap-3 p-2 bg-muted/20 rounded-[2.2rem] border-2 border-border/40">
            {/* VÍ GỬI */}
            <div
              className={cn(
                "flex-1 p-4 rounded-2xl transition-all border-2",
                fromId
                  ? "bg-background border-red-500/20 shadow-sm"
                  : "bg-transparent border-transparent",
              )}
            >
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                Nguồn tiền ra
              </label>
              <Select value={fromId || undefined} onValueChange={setFromId}>
                <SelectTrigger className="h-10 p-0 border-none bg-transparent shadow-none font-black text-sm uppercase focus:ring-0">
                  <SelectValue placeholder="Chọn ví nguồn" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 border-border/40 shadow-2xl">
                  {wallets.map((w) => (
                    <SelectItem
                      key={w.id}
                      value={w.id}
                      className="rounded-xl font-bold uppercase text-[10px] py-3 focus:bg-primary/10"
                    >
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ICON CHUYỂN ĐỔI - CHỈ HOVER XOAY TRÊN PC */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none md:pointer-events-auto">
              <div
                className="flex items-center justify-center rounded-2xl bg-foreground text-background p-3 shadow-2xl border-[6px] border-background 
                                transition-transform duration-500 
                                [@media(hover:hover)]:group-hover:rotate-180 
                                active:scale-90 md:active:scale-100"
              >
                <ArrowRightLeft
                  size={18}
                  strokeWidth={3}
                  className="text-primary"
                />
              </div>
            </div>

            {/* VÍ NHẬN */}
            <div
              className={cn(
                "flex-1 p-4 rounded-2xl transition-all border-2",
                toId
                  ? "bg-background border-emerald-500/20 shadow-sm"
                  : "bg-transparent border-transparent",
              )}
            >
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2 flex items-center justify-end gap-2 text-right">
                Đích đến vào
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </label>
              <Select value={toId || undefined} onValueChange={setToId}>
                <SelectTrigger className="h-10 p-0 border-none bg-transparent shadow-none font-black text-sm uppercase text-right focus:ring-0">
                  <SelectValue placeholder="Chọn ví đích" />
                </SelectTrigger>
                <SelectContent
                  className="rounded-2xl border-2 border-border/40 shadow-2xl"
                  align="end"
                >
                  {wallets.map((w) => (
                    <SelectItem
                      key={w.id}
                      value={w.id}
                      className="rounded-xl font-bold uppercase text-[10px] py-3 focus:bg-primary/10"
                    >
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SỐ TIỀN */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
              <Coins size={12} className="text-primary" /> Giá trị luân chuyển
            </label>
            <div className="relative group">
              <Input
                type="number"
                required
                className="h-16 px-6 rounded-2xl border-2 border-border/50 bg-muted/20 font-money text-3xl font-black tracking-tighter focus:bg-background transition-all pr-20 text-primary"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-[10px] opacity-30 border-l pl-4 border-border/50 tracking-widest uppercase">
                VNĐ
              </div>
            </div>

            {fromId === toId && fromId !== "" && (
              <div className="flex items-center gap-2 p-3 bg-destructive/5 rounded-xl border border-destructive/20 animate-in zoom-in-95">
                <div className="w-1 h-1 rounded-full bg-destructive animate-ping" />
                <p className="text-[10px] font-black text-destructive uppercase tracking-widest">
                  Lỗi: Hai ví không được trùng nhau
                </p>
              </div>
            )}
          </div>

          {/* NÚT SUBMIT - OPTIMIZED FOR PC & MOBILE */}
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
              "w-full h-16 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-2xl transition-all",
              "bg-primary text-white shadow-primary/30",
              // Hiệu ứng hover chỉ dành cho PC
              "[@media(hover:hover)]:hover:brightness-110 [@media(hover:hover)]:hover:scale-[1.02]",
              // Hiệu ứng bấm dành cho Mobile
              "active:scale-[0.96] md:active:scale-100",
              "disabled:bg-muted disabled:text-muted-foreground/50 disabled:shadow-none disabled:scale-100",
            )}
          >
            {transferWallet.isPending ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <div className="flex items-center gap-2">
                <span>Xác nhận điều chuyển</span>
                <TrendingUp size={16} />
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
