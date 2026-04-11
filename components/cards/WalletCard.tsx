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
      className="group p-7 border-2 rounded-[2.5rem] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col justify-between h-60 relative overflow-hidden backdrop-blur-[2px] font-sans"
    >
      {/* GLOW DECORATION */}
      <div
        className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-[60px] opacity-10 pointer-events-none transition-all duration-1000 group-hover:opacity-25"
        style={{ backgroundColor: wallet.color }}
      />

      <div className="flex justify-between items-start relative z-10">
        {/* AVATAR VÍ */}
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
          style={{
            backgroundColor: wallet.color,
            boxShadow: `0 8px 20px -4px ${wallet.color}60`,
          }}
        >
          {wallet.name.charAt(0).toUpperCase()}
        </div>

        {/* 🛠 ACTIONS: OPTIMIZED FOR PC & MOBILE */}
        <div
          className={cn(
            "flex gap-1.5 transition-all duration-500",
            "[@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:group-hover:translate-y-0",
            "[@media(hover:none)]:opacity-100 [@media(hover:none)]:translate-y-0",
          )}
        >
          <button
            onClick={onEdit}
            className="p-2.5 rounded-xl bg-background/60 backdrop-blur-md hover:bg-background text-muted-foreground hover:text-primary border border-border/40 transition-all active:scale-75 md:active:scale-90 shadow-sm"
            title="Cài đặt ví"
          >
            <Settings2 size={16} strokeWidth={2.5} />
          </button>
          <button
            onClick={onDelete}
            className="p-2.5 rounded-xl bg-background/60 backdrop-blur-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive border border-border/40 transition-all active:scale-75 md:active:scale-90 shadow-sm"
            title="Xóa ví"
          >
            <Trash2 size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* THÔNG TIN SỐ DƯ */}
      <div className="relative z-10">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 mb-1 ml-1 truncate pr-10">
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
