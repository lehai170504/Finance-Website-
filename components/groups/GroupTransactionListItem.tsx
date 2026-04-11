"use client";

import { CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupTransactionListItemProps {
  trans: any;
}

export function GroupTransactionListItem({
  trans,
}: GroupTransactionListItemProps) {
  const isExpense = trans.categoryType === "EXPENSE";

  return (
    <div className="flex items-center justify-between p-5 border-2 border-border/50 rounded-[2rem] bg-card hover:border-primary/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
      {/* VẠCH MÀU ĐỊNH DANH */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-2 transition-colors",
          isExpense ? "bg-red-500" : "bg-emerald-500",
        )}
      />

      <div className="flex items-center gap-4 pl-3">
        {/* ICON CATEGORY */}
        <div
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-inner transition-transform group-hover:scale-105 shrink-0",
            isExpense
              ? "bg-red-500/10 text-red-500"
              : "bg-emerald-500/10 text-emerald-500",
          )}
        >
          {trans.categoryName.charAt(0).toUpperCase()}
        </div>

        <div className="space-y-1.5 min-w-0">
          <h4 className="font-black uppercase tracking-tight text-sm text-foreground truncate max-w-[150px] sm:max-w-xs leading-none">
            {trans.note || trans.categoryName}
          </h4>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-widest bg-muted/60 px-2.5 py-1 rounded-lg border border-border/50">
              <CalendarDays size={10} /> {trans.date}
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-widest bg-muted/60 px-2.5 py-1 rounded-lg border border-border/50">
              <User size={10} className="text-primary" />{" "}
              {trans.createdBy || "Member"}
            </span>
          </div>
        </div>
      </div>

      {/* SỐ TIỀN HIỂN THỊ CỰC MẠNH */}
      <div
        className={cn(
          "text-xl sm:text-2xl font-black tracking-tighter pr-2",
          isExpense ? "text-red-500" : "text-emerald-500",
        )}
      >
        {isExpense ? "-" : "+"}
        {trans.amount.toLocaleString()}đ
      </div>
    </div>
  );
}
