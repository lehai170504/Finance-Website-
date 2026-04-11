"use client";

import { Button } from "@/components/ui/button";
import { GroupTransactionListItem } from "./GroupTransactionListItem";
import { ChevronLeft, ChevronRight, History, Layers } from "lucide-react";

interface GroupTransactionsTabProps {
  transactions: any[];
  totalElements: number;
  totalPages: number;
  isLoading: boolean;
  page: number;
  setPage: (page: number | ((p: number) => number)) => void;
}

export function GroupTransactionsTab({
  transactions,
  totalElements,
  totalPages,
  isLoading,
  page,
  setPage,
}: any) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-muted/30 p-4 rounded-3xl border border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/10">
            <History size={18} />
          </div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80">
            Lịch sử nhóm
          </h2>
        </div>
        <span className="font-money text-[10px] font-bold text-muted-foreground bg-background px-3 py-1 rounded-full border border-border/50 shadow-sm uppercase">
          {totalElements || 0} GIAO DỊCH
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 w-full bg-muted/40 animate-pulse rounded-3xl border border-border/20"
            />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed rounded-[3rem] border-muted/20 bg-muted/[0.02]">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic">
            Chưa có giao dịch
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((trans: any) => (
            <GroupTransactionListItem key={trans.id} trans={trans} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-5 mt-12 pb-6">
          <Button
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p: any) => p - 1)}
            className="rounded-xl font-black uppercase text-[9px] tracking-[0.2em] h-10 px-5 border-border/50 hover:bg-muted/50 transition-all"
          >
            Trước
          </Button>
          <div className="flex items-center gap-2.5 font-money text-xs px-4 py-2 bg-muted/40 rounded-xl border border-border/50">
            <span className="font-black text-primary">{page + 1}</span>
            <span className="opacity-30">/</span>
            <span className="font-bold text-muted-foreground">
              {totalPages}
            </span>
          </div>
          <Button
            variant="outline"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p: any) => p + 1)}
            className="rounded-xl font-black uppercase text-[9px] tracking-[0.2em] h-10 px-5 border-border/50 hover:bg-muted/50 transition-all"
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
}
