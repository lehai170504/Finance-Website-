"use client";

import { CalendarDays, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface GroupTransactionListItemProps {
  trans: any;
}

// ListItem
export function GroupTransactionListItem({ trans }: any) {
  const isExpense = trans.categoryType === "EXPENSE";
  return (
    <div className="flex items-center justify-between p-5 border border-border/40 rounded-3xl bg-card hover:border-primary/30 hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1.5 transition-colors",
          isExpense ? "bg-red-500/80" : "bg-emerald-500/80",
        )}
      />
      <div className="flex items-center gap-4 pl-2">
        <div
          className={cn(
            "w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base shadow-sm border border-border/20 group-hover:scale-110 transition-transform",
            isExpense
              ? "bg-red-500/5 text-red-500"
              : "bg-emerald-500/5 text-emerald-500",
          )}
        >
          {trans.categoryName.charAt(0).toUpperCase()}
        </div>
        <div className="space-y-1.5 min-w-0">
          <h4 className="font-bold tracking-tight p-2 text-sm text-foreground truncate max-w-[150px] leading-none uppercase">
            {trans.note || trans.categoryName}
          </h4>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/40 px-2.5 py-1 rounded-lg border border-border/50">
              <CalendarDays size={10} /> {trans.date}
            </span>
            <span className="flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1 rounded-lg border border-primary/10">
              <User size={10} /> {trans.createdBy}
            </span>
          </div>
        </div>
      </div>
      <div
        className={cn(
          "text-xl sm:text-2xl font-black tracking-tighter font-money pr-2",
          isExpense ? "text-red-500" : "text-emerald-500",
        )}
      >
        {isExpense ? "-" : "+"}
        {trans.amount.toLocaleString()}
        <span className="text-xs ml-0.5 opacity-60 font-black">đ</span>
      </div>
    </div>
  );
}
