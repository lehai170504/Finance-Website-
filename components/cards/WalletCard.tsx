// components/cards/WalletCard.tsx
"use client";

import { Wallet } from "@/types/wallet";
import { Settings2, Trash2 } from "lucide-react";

interface WalletCardProps {
  wallet: Wallet;
  onEdit: () => void;
  onDelete: () => void;
}

export function WalletCard({ wallet, onEdit, onDelete }: WalletCardProps) {
  return (
    <div
      style={{
        backgroundColor: wallet.color + "08",
        borderColor: wallet.color + "30",
      }}
      className="group p-8 border-2 rounded-[2.5rem] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col justify-between h-56 relative overflow-hidden"
    >
      {/* Hiệu ứng gradient hắt sáng từ góc */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
        style={{ backgroundColor: wallet.color }}
      />

      <div className="flex justify-between items-start relative z-10">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-black/10"
          style={{ backgroundColor: wallet.color }}
        >
          {wallet.name.charAt(0).toUpperCase()}
        </div>

        {/* NHÓM NÚT SỬA & XÓA */}
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={onEdit}
            className="p-2.5 rounded-xl bg-background/60 backdrop-blur-md hover:bg-background text-muted-foreground hover:text-primary shadow-sm border border-border/50 transition-all hover:scale-110"
            title="Cài đặt ví"
          >
            <Settings2 size={16} />
          </button>
          <button
            onClick={onDelete}
            className="p-2.5 rounded-xl bg-background/60 backdrop-blur-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive shadow-sm border border-border/50 transition-all hover:scale-110"
            title="Xóa ví"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-1.5">
          {wallet.name}
        </h3>
        <p
          className="text-3xl font-black tracking-tighter drop-shadow-sm"
          style={{ color: wallet.color }}
        >
          {wallet.balance.toLocaleString()}đ
        </p>
      </div>
    </div>
  );
}
