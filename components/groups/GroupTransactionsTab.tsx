"use client";

import { Button } from "@/components/ui/button";
import { GroupTransactionListItem } from "./GroupTransactionListItem";
import { ChevronLeft, ChevronRight, History, Layers, Sparkles } from "lucide-react";

export function GroupTransactionsTab({
  transactions,
  members,
  totalElements,
  totalPages,
  isLoading,
  page,
  setPage,
}: any) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-10">
      
      {/* HEADER - LIST METADATA */}
      <div className="flex justify-between items-center bg-muted/20 p-5 rounded-[2rem] border-2 border-border/40 backdrop-blur-sm shadow-inner">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
            <History size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/80">
              Dòng thời gian nhóm
            </h2>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
              Tất cả biến động tài chính
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-xl border border-border/40 shadow-sm">
           <Sparkles size={12} className="text-amber-500" />
           <span className="font-money text-[10px] font-black text-primary uppercase tracking-widest">
            {totalElements || 0} Giao dịch
          </span>
        </div>
      </div>

      {/* TRANSACTION LIST */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 w-full bg-muted/10 animate-pulse rounded-[2.5rem] border-2 border-dashed border-border/20"
              />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed rounded-[3.5rem] border-border/40 bg-muted/5 flex flex-col items-center gap-6">
            <div className="p-8 bg-muted/20 rounded-full text-muted-foreground/10">
               <Layers size={64} strokeWidth={1} />
            </div>
            <div className="space-y-2">
               <p className="text-xl font-black uppercase tracking-tighter text-muted-foreground/50">Chưa có giao dịch nào</p>
               <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">
                  Hãy bắt đầu ghi chép để theo dõi dòng tiền homie nhé!
               </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {transactions.map((trans: any, index: number) => (
              <div 
                key={trans.id} 
                className="animate-in fade-in slide-in-from-left-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <GroupTransactionListItem trans={trans} members={members} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAGINATION - PREMIUM CONTROLS */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-16 pt-8 border-t border-border/20">
          <Button
            variant="ghost"
            disabled={page === 0}
            onClick={() => setPage((p: any) => p - 1)}
            className="w-14 h-14 rounded-2xl border-2 border-border/40 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90"
          >
            <ChevronLeft size={24} strokeWidth={3} />
          </Button>

          <div className="flex items-center gap-3 font-money text-sm px-6 py-3 bg-muted/40 rounded-2xl border-2 border-border/40 shadow-inner">
            <span className="font-black text-primary text-lg">{page + 1}</span>
            <span className="text-muted-foreground/30 font-black text-lg">/</span>
            <span className="font-bold text-muted-foreground/60 text-lg">
              {totalPages}
            </span>
          </div>

          <Button
            variant="ghost"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p: any) => p + 1)}
            className="w-14 h-14 rounded-2xl border-2 border-border/40 hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-90"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </Button>
        </div>
      )}
    </div>
  );
}
