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
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center bg-muted/20 p-4 rounded-3xl border border-border/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <HandCoins size={18} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
            Đối soát công nợ
          </h2>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-background rounded-full border border-border/50 shadow-sm">
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
            {debts.length} Khoản nợ hiện tại
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-32 text-center flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">
            Đang tính toán nợ nần...
          </span>
        </div>
      ) : debts.length === 0 ? (
        <div className="py-24 text-center border-4 border-dashed rounded-[3.5rem] border-emerald-500/20 bg-emerald-500/5 transition-all">
          <div className="p-5 bg-emerald-500/10 rounded-full w-fit mx-auto mb-6">
            <CheckCircle2 size={48} className="text-emerald-500" />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
            Tuyệt vời! Nhóm không có nợ xấu.
          </p>
          <p className="text-[10px] font-bold text-muted-foreground uppercase mt-2">
            Mọi khoản chi tiêu đã được sòng phẳng.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {debts.map((debt) => (
            <div
              key={debt.id}
              className="group p-6 border-2 border-border/50 rounded-[2.5rem] bg-card hover:border-primary/20 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between gap-6 relative overflow-hidden"
            >
              {/* Hiệu ứng tia sáng chìm */}
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />

              <div className="relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Người nợ
                    </p>
                    <span className="text-xl font-black uppercase tracking-tight text-foreground">
                      {debt.debtorName}
                    </span>
                  </div>
                  <div className="p-2 bg-muted/50 rounded-xl text-muted-foreground group-hover:text-primary transition-colors">
                    <ArrowRightLeft size={16} />
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Chủ nợ
                    </p>
                    <span className="text-xl font-black uppercase tracking-tight text-foreground">
                      {debt.creditorName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-border/50">
                  <div className="flex items-center gap-2 text-destructive font-black">
                    <CircleDollarSign size={18} />
                    <span className="text-xs uppercase tracking-widest">
                      Số tiền
                    </span>
                  </div>
                  <span className="text-3xl font-black tracking-tighter text-destructive">
                    {debt.amount.toLocaleString()}đ
                  </span>
                </div>
              </div>

              <Button
                onClick={() => handleSettleClick(debt.id)}
                disabled={settleDebt.isPending}
                className="relative z-10 w-full rounded-2xl font-black uppercase text-[11px] tracking-widest h-12 shadow-xl shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all"
              >
                {settleDebt.isPending ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐÃ TRẢ"}
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL XÁC NHẬN TRẢ NỢ */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSettle}
        title="Quyết toán khoản nợ?"
        description="Bạn xác nhận rằng khoản nợ này đã được thanh toán ngoài đời thực? Sau khi xác nhận, số dư nợ trong nhóm sẽ được cập nhật lại."
        confirmText="XÁC NHẬN TRẢ"
        isLoading={settleDebt.isPending}
      />
    </div>
  );
}
