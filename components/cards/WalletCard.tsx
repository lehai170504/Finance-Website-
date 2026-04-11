"use client";

import { Wallet } from "@/types/wallet";
import { Settings2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletCardProps {
  wallet: Wallet;
  onEdit: () => void;
  onDelete: () => void;
}

export function WalletCard({ wallet, onEdit, onDelete }: WalletCardProps) {
  return (
    <div
      style={{
        backgroundColor: wallet.color + "05",
        borderColor: wallet.color + "25",
      }}
      className="group p-7 border-2 rounded-3xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col justify-between h-60 relative overflow-hidden backdrop-blur-[2px]"
    >
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[60px] opacity-10 pointer-events-none transition-all duration-1000 group-hover:opacity-25"
        style={{ backgroundColor: wallet.color }}
      />

      <div className="flex justify-between items-start relative z-10">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl"
          style={{
            backgroundColor: wallet.color,
            boxShadow: `0 8px 20px -4px ${wallet.color}60`,
          }}
        >
          {wallet.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-1 group-hover:translate-y-0">
          <button
            onClick={onEdit}
            className="p-2 rounded-xl bg-background/40 backdrop-blur-md hover:bg-background text-muted-foreground hover:text-primary border border-border/40 transition-all active:scale-90"
            title="Cài đặt ví"
          >
            <Settings2 size={15} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-xl bg-background/40 backdrop-blur-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-border/40 transition-all active:scale-90"
            title="Xóa ví"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 mb-1 ml-1">
          {wallet.name}
        </h3>
        <p
          className="text-3xl font-black tracking-tighter font-money flex items-baseline gap-1"
          style={{ color: wallet.color }}
        >
          {wallet.balance.toLocaleString()}
          <span className="text-xs font-black opacity-60">đ</span>
        </p>
      </div>
    </div>
  );
}
