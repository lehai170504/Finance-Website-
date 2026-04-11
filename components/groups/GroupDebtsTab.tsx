"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ArrowRightLeft,
  HandCoins,
  CircleDollarSign,
} from "lucide-react";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { cn } from "@/lib/utils";

interface GroupDebtsTabProps {
  debts: any[];
  isLoading: boolean;
  settleDebt: any;
}

export function GroupDebtsTab({
  debts,
  isLoading,
  settleDebt,
}: GroupDebtsTabProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedDebtId, setSelectedDebtId] = useState<string | null>(null);

  const handleSettleClick = (id: string) => {
    setSelectedDebtId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmSettle = () => {
    if (selectedDebtId) {
      settleDebt.mutate(selectedDebtId, {
        onSuccess: () => setIsConfirmOpen(false),
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex justify-between items-center bg-muted/30 p-4 rounded-3xl border border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/10">
            <HandCoins size={18} />
          </div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80">
            Đối soát công nợ
          </h2>
        </div>
        <span className="font-money text-[10px] font-bold text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
          {debts.length} KHOẢN NỢ
        </span>
      </div>

      {isLoading ? (
        <div className="py-32 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">
            Đang tính toán nợ nần...
          </span>
        </div>
      ) : debts.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed rounded-[3rem] border-emerald-500/20 bg-emerald-500/[0.02] backdrop-blur-sm">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/10">
            <CheckCircle2 size={40} className="text-emerald-500" />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">
            Tuyệt vời! Nhóm không có nợ xấu
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {debts.map((debt) => (
            <div
              key={debt.id}
              className="group p-7 border-2 border-border/40 rounded-3xl bg-card hover:border-primary/30 hover:shadow-2xl transition-all duration-500 flex flex-col gap-6 relative overflow-hidden"
            >
              <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />

              <div className="relative z-10 flex flex-col gap-5">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      Người nợ
                    </p>
                    <span className="text-base font-black uppercase tracking-tight text-foreground">
                      {debt.debtorName}
                    </span>
                  </div>
                  <div className="p-2.5 bg-muted/50 rounded-xl text-muted-foreground group-hover:text-primary group-hover:rotate-180 transition-all duration-500">
                    <ArrowRightLeft size={16} />
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      Chủ nợ
                    </p>
                    <span className="text-base font-black uppercase tracking-tight text-foreground">
                      {debt.creditorName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 bg-destructive/[0.03] rounded-2xl border border-destructive/10">
                  <div className="flex items-center gap-2 text-destructive/70 font-black">
                    <CircleDollarSign size={16} />
                    <span className="text-[10px] uppercase tracking-widest">
                      DƯ NỢ
                    </span>
                  </div>
                  <span className="text-3xl font-black tracking-tighter text-destructive font-money">
                    {debt.amount.toLocaleString()}đ
                  </span>
                </div>
              </div>

              <Button
                onClick={() => handleSettleClick(debt.id)}
                disabled={settleDebt.isPending}
                className="relative z-10 w-full rounded-xl font-black uppercase text-[10px] tracking-widest h-12 shadow-lg shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {settleDebt.isPending ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐÃ TRẢ"}
              </Button>
            </div>
          ))}
        </div>
      )}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSettle}
        title="Quyết toán nợ?"
        description="Xác nhận khoản nợ này đã được trả sòng phẳng? Hệ thống sẽ gạch tên khoản nợ này ngay lập tức."
        confirmText="XÁC NHẬN"
        isLoading={settleDebt.isPending}
      />
    </div>
  );
}
