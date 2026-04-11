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
}: GroupTransactionsTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* HEADER CHI TIẾT */}
      <div className="flex justify-between items-center bg-muted/20 p-4 rounded-2xl border border-border/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <History size={18} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
            Lịch sử thu chi nhóm
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-full border border-border/50 shadow-sm">
          <Layers size={12} className="text-primary" />
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-tighter">
            {totalElements || 0} GIAO DỊCH
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 w-full bg-muted/50 animate-pulse rounded-[2rem]"
            />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-24 text-center border-4 border-dashed rounded-[3rem] border-muted/20 bg-muted/5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">
            Chưa có giao dịch nào được ghi chép.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((trans) => (
            <GroupTransactionListItem key={trans.id} trans={trans} />
          ))}
        </div>
      )}

      {/* PHÂN TRANG (PAGINATION) */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12 pb-6">
          <Button
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl font-black uppercase text-[10px] tracking-widest h-10 px-4 border-2 hover:bg-primary/5 transition-all"
          >
            <ChevronLeft size={14} className="mr-1" /> Trước
          </Button>

          <div className="flex items-center gap-2 px-4 py-2 bg-muted/40 rounded-xl border border-border/50">
            <span className="text-[11px] font-black text-primary">
              {page + 1}
            </span>
            <span className="text-[11px] font-bold text-muted-foreground">
              /
            </span>
            <span className="text-[11px] font-bold text-muted-foreground">
              {totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl font-black uppercase text-[10px] tracking-widest h-10 px-4 border-2 hover:bg-primary/5 transition-all"
          >
            Sau <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
