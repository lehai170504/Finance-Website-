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
import { Wallet as WalletIcon, Coins, ArrowRightLeft } from "lucide-react";

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
      <DialogContent className="rounded-[2.5rem] border-none p-8 max-w-md bg-background/95 backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-primary">
            Chuyển tiền nội bộ
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* KHU VỰC CHỌN VÍ  */}
          <div className="flex items-center gap-2 sm:gap-4 rounded-2xl bg-muted/30 p-4 border-2 border-border/50">
            {/* TỪ VÍ */}
            <div className="flex-1 space-y-2 min-w-0">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
                <WalletIcon size={12} /> Từ ví
              </label>
              <Select
                value={fromId || undefined}
                onValueChange={(val) => setFromId(val)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Chọn ví" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ICON MŨI TÊN CHÉO Ở GIỮA */}
            <div className="mt-6 flex shrink-0 items-center justify-center rounded-full bg-background p-2.5 border-2 border-border/50 shadow-sm text-primary">
              <ArrowRightLeft size={16} />
            </div>

            {/* ĐẾN VÍ */}
            <div className="flex-1 space-y-2 min-w-0">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-1 flex items-center justify-end gap-1.5">
                Đến ví <WalletIcon size={12} />
              </label>
              <Select
                value={toId || undefined}
                onValueChange={(val) => setToId(val)}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Chọn ví" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((w) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* SỐ TIỀN CHUYỂN */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-1.5">
              <Coins size={12} /> Số tiền chuyển (VNĐ)
            </label>
            <Input
              type="number"
              className="h-14 text-2xl font-black tracking-tighter text-primary"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
            />
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
            size="lg"
            className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-primary/20"
          >
            {transferWallet.isPending ? "ĐANG XỬ LÝ..." : "XÁC NHẬN CHUYỂN"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
