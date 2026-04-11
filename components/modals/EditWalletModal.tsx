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
import {
  Wallet as WalletIcon,
  Coins,
  Palette,
  Loader2,
  Settings2,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [color, setColor] = useState("#0088ff");

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
      <DialogContent className="w-[calc(100%-2rem)] md:max-w-md rounded-[2.5rem] border-none p-0 overflow-hidden bg-background shadow-2xl font-sans mx-auto transition-all outline-none">
        <div
          className="p-8 pb-12 transition-colors duration-500 relative"
          style={{ backgroundColor: `${color}15` }}
        >
          {/* Ambient Glow */}
          <div
            className="absolute top-0 right-0 w-40 h-40 blur-[80px] opacity-20 animate-pulse"
            style={{ backgroundColor: color }}
          />
          <div
            className="absolute bottom-0 left-0 w-24 h-24 blur-[60px] opacity-10"
            style={{ backgroundColor: color }}
          />

          <DialogHeader className="relative z-10">
            <DialogTitle className="text-2xl md:text-3xl font-black uppercase tracking-tighter flex items-center gap-3">
              <div
                className="p-2.5 rounded-xl text-white shadow-lg transition-all duration-500 shrink-0"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 8px 20px -4px ${color}60`,
                }}
              >
                <Settings2
                  size={24}
                  strokeWidth={3}
                  className="animate-[spin_4s_linear_infinite]"
                />
              </div>
              <span style={{ color: color }} className="truncate">
                Hiệu chỉnh ví
              </span>
            </DialogTitle>

            <div className="flex items-center gap-2 mt-2 opacity-50">
              <Sparkles size={12} style={{ color: color }} />
              <p
                className="text-[10px] font-black uppercase tracking-[0.2em] leading-none"
                style={{ color: color }}
              >
                Định danh: #{wallet?.id?.slice(-6).toUpperCase() || "N/A"}
              </p>
            </div>
          </DialogHeader>
        </div>

        {/* FORM AREA */}
        <div className="p-6 md:p-8 space-y-6 -mt-8 bg-background rounded-t-[2.5rem] relative z-20">
          {/* TÊN ĐỊNH DANH */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
              <WalletIcon size={12} className="text-primary" /> Tên định danh ví
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VÍ MOMO, TECHCOMBANK..."
              className="h-14 px-5 rounded-2xl border-2 border-border/50 bg-muted/20 font-bold uppercase focus:bg-background transition-all"
            />
          </div>

          {/* SỐ DƯ HIỆN HỮU */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
              <Coins size={12} className="text-primary" /> Số dư hiện hữu
            </label>
            <div className="relative group">
              <Input
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0"
                className="h-16 px-5 rounded-2xl border-2 border-border/50 bg-muted/20 font-money text-2xl md:text-3xl font-black tracking-tighter focus:bg-background transition-all pr-16"
                style={{ color: color }}
              />
              <div className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-[10px] opacity-30 border-l pl-3 border-border/50 uppercase tracking-widest">
                VNĐ
              </div>
            </div>
          </div>

          {/* MÀU SẮC NHẬN DIỆN */}
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
              <Palette size={12} className="text-primary" /> Màu sắc nhận diện
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
                  Mã màu thương hiệu
                </span>
              </div>
            </div>
          </div>

          {/* NÚT LƯU THAY ĐỔI */}
          <Button
            onClick={handleUpdate}
            disabled={updateWallet.isPending || !name || !balance}
            style={{
              backgroundColor: color,
              boxShadow: `0 10px 25px -5px ${color}40`,
            }}
            className={cn(
              "w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-sm text-white transition-all hover:brightness-110 active:scale-[0.98]",
              updateWallet.isPending && "opacity-70",
            )}
          >
            {updateWallet.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                <span>Đang đồng bộ...</span>
              </div>
            ) : (
              "Lưu thay đổi"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
