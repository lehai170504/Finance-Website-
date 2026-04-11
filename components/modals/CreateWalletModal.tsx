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
import { useWallets } from "@/hooks/useWallets";
import {
  Wallet as WalletIcon,
  Coins,
  Palette,
  Loader2,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function CreateWalletModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { createWallet } = useWallets();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [color, setColor] = useState("#0088ff");

  const handleCreate = () => {
    if (!name || !balance) return;
    createWallet.mutate(
      { name, balance: Number(balance), color },
      {
        onSuccess: () => {
          onClose();
          setName("");
          setBalance("");
          setColor("#0088ff");
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* CẬP NHẬT: Thêm w-[calc(100%-2rem)] để tạo khoảng cách với viền mobile */}
      <DialogContent className="w-[calc(100%-2rem)] md:max-w-md rounded-[2.5rem] border-none p-0 overflow-hidden bg-background shadow-2xl font-sans mx-auto transition-all">
        {/* HEADER AREA */}
        <div
          className="p-8 pb-10 transition-colors duration-500 relative"
          style={{ backgroundColor: `${color}15` }}
        >
          <div
            className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20"
            style={{ backgroundColor: color }}
          />

          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl md:text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
              <div
                className="p-2.5 rounded-xl text-white shadow-lg transition-colors duration-500 shrink-0"
                style={{ backgroundColor: color }}
              >
                <Plus size={24} strokeWidth={3} />
              </div>
              <span style={{ color: color }} className="truncate">
                Tạo ví mới
              </span>
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* CONTENT AREA */}
        <div className="p-6 md:p-8 space-y-6 -mt-6 bg-background rounded-t-[2.5rem] relative z-20">
          {/* TÊN VÍ */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
              <WalletIcon size={12} /> Tên định danh ví
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VÍ MOMO, TECHCOMBANK..."
              className="h-14 px-5 rounded-2xl border-2 border-border/50 bg-muted/20 font-bold uppercase focus:bg-background transition-all"
            />
          </div>

          {/* SỐ DƯ */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
              <Coins size={12} /> Số dư hiện tại
            </label>
            <div className="relative group">
              <Input
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0"
                className="h-16 px-5 rounded-2xl border-2 border-border/50 bg-muted/20 font-money text-2xl md:text-3xl font-black tracking-tighter focus:bg-background transition-all pr-16"
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-xs opacity-30 border-l pl-3 border-border/50">
                VNĐ
              </div>
            </div>
          </div>

          {/* MÀU SẮC */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
              <Palette size={12} /> Màu sắc thương hiệu
            </label>
            <div className="flex items-center gap-4 p-3 bg-muted/20 rounded-2xl border border-border/50">
              <div className="relative h-12 w-20 md:w-24 overflow-hidden rounded-xl border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-105 active:scale-95 shrink-0">
                <input
                  type="color"
                  className="absolute -inset-4 h-24 w-32 cursor-pointer bg-transparent outline-none border-none"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <div className="flex flex-col leading-none min-w-0">
                <span className="font-money text-sm font-black uppercase tracking-widest truncate">
                  {color}
                </span>
                <span className="text-[9px] font-bold text-muted-foreground uppercase mt-1">
                  Màu thẻ hiển thị
                </span>
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <Button
            onClick={handleCreate}
            disabled={createWallet.isPending || !name || !balance}
            style={{
              backgroundColor: color,
              boxShadow: `0 10px 25px -5px ${color}40`,
            }}
            className={cn(
              "w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-sm text-white transition-all hover:brightness-110 active:scale-[0.98]",
              createWallet.isPending && "opacity-70",
            )}
          >
            {createWallet.isPending ? "ĐANG KHỞI TẠO..." : "XÁC NHẬN TẠO VÍ"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
