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
import { useWallets } from "@/hooks/useWallets";
import { Wallet as WalletType } from "@/types/wallet";
import { Wallet as WalletIcon, Coins, Palette } from "lucide-react";

interface EditWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletType | null;
}

export function EditWalletModal({
  isOpen,
  onClose,
  wallet,
}: EditWalletModalProps) {
  const { updateWallet } = useWallets();
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    if (wallet && isOpen) {
      setName(wallet.name);
      setBalance(wallet.balance.toString());
      setColor(wallet.color || "#0088ff");
    }
  }, [wallet, isOpen]);

  const handleUpdate = () => {
    if (!wallet || !name || !balance) return;

    updateWallet.mutate(
      {
        id: wallet.id,
        data: { name, balance: Number(balance), color },
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-[2.5rem] border-none p-8 max-w-md bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-primary">
            Chỉnh sửa ví
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* TÊN VÍ */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
              <WalletIcon size={12} /> Tên ví
            </label>
            <Input
              className="font-bold uppercase"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VÍ MOMO, TECHCOMBANK..."
            />
          </div>

          {/* SỐ DƯ HIỆN TẠI */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
              <Coins size={12} /> Số dư hiện tại (VNĐ)
            </label>
            <Input
              type="number"
              className="h-14 text-2xl font-black tracking-tighter text-primary"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="0"
            />
          </div>

          {/* MÀU ĐỊNH DANH*/}
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
            onClick={handleUpdate}
            disabled={updateWallet.isPending || !name || !balance}
            size="lg"
            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20"
          >
            {updateWallet.isPending ? "ĐANG LƯU..." : "CẬP NHẬT VÍ"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
