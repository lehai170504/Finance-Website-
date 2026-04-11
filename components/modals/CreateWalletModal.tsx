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
import { Wallet as WalletIcon, Coins, Palette } from "lucide-react";

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
      <DialogContent className="rounded-[2.5rem] border-none p-8 max-w-md bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-primary">
            Tạo ví mới
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* TÊN VÍ */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
              <WalletIcon size={12} /> Tên ví
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: MOMO, TECHCOMBANK..."
              className="font-bold uppercase"
            />
          </div>

          {/* SỐ DƯ BAN ĐẦU */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
              <Coins size={12} /> Số dư ban đầu (VNĐ)
            </label>
            <Input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="0"
              className="h-14 text-2xl font-black tracking-tighter text-primary"
            />
          </div>

          {/* MÀU ĐỊNH DANH */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
              <Palette size={12} /> Màu định danh
            </label>
            <div className="flex items-center gap-4">
              <div className="relative h-11 w-20 overflow-hidden rounded-xl border-2 border-border focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-sm cursor-pointer">
                <input
                  type="color"
                  className="absolute -inset-4 h-24 w-32 cursor-pointer bg-transparent outline-none"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                {color}
              </span>
            </div>
          </div>

          {/* NÚT SUBMIT */}
          <Button
            onClick={handleCreate}
            disabled={createWallet.isPending || !name || !balance}
            size="lg"
            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20"
          >
            {createWallet.isPending ? "ĐANG LƯU..." : "XÁC NHẬN TẠO VÍ"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
