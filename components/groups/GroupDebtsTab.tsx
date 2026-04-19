"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ArrowRightLeft,
  HandCoins,
  CircleDollarSign,
  User,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Info,
  Loader2
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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center bg-muted/20 p-5 rounded-[2rem] border-2 border-border/40 backdrop-blur-sm shadow-inner">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600 border border-amber-500/20">
            <HandCoins size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/80">
              Đối soát công nợ
            </h2>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
              Quyết toán sòng phẳng • Kết nối bền lâu
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 shadow-sm">
           <span className="font-money text-[10px] font-black text-amber-600 uppercase tracking-widest">
            {debts.length} Khoản nợ
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="py-40 flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/70 animate-pulse">
            Đang đối soát công nợ...
          </span>
        </div>
      ) : debts.length === 0 ? (
        <div className="py-32 text-center border-2 border-dashed rounded-[4rem] border-emerald-500/20 bg-emerald-500/[0.02] backdrop-blur-md flex flex-col items-center gap-8 group">
          <div className="relative">
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border-2 border-emerald-500/20 shadow-2xl shadow-emerald-500/10 transition-transform group-hover:scale-110 duration-700">
              <ShieldCheck size={48} className="text-emerald-500" />
            </div>
            <div className="absolute -top-2 -right-2">
               <Sparkles className="text-amber-500 animate-bounce" size={24} />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-black uppercase tracking-tighter text-emerald-600">Tuyệt vời! Nhóm sạch nợ</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600/40 italic">
              Sòng phẳng là nền tảng của mọi cuộc vui
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {debts.map((debt, index) => (
            <div
              key={debt.id}
              className="group p-8 md:p-10 border-2 border-border/40 rounded-[3rem] bg-card hover:border-amber-500/30 hover:shadow-2xl transition-all duration-500 flex flex-col gap-8 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Decorative background glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/5 rounded-full blur-[80px] group-hover:bg-amber-500/10 transition-colors" />

              <div className="relative z-10 flex flex-col gap-8">
                {/* DEBTOR & CREDITOR FLOW */}
                <div className="flex justify-between items-center relative">
                  {/* Debtor */}
                  <div className="flex flex-col items-center gap-3 group/person">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-muted/50 border-2 border-border/40 flex items-center justify-center text-muted-foreground transition-all group-hover/person:border-rose-500/40 group-hover/person:bg-rose-500/5">
                       <User size={28} />
                    </div>
                    <div className="text-center">
                       <p className="text-[8px] font-black uppercase tracking-widest text-rose-500/60 mb-1">Người nợ</p>
                       <span className="text-sm font-black uppercase tracking-tight text-foreground">{debt.debtorName}</span>
                    </div>
                  </div>

                  {/* Flow Arrow */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-1">
                       <div className="h-0.5 w-6 bg-gradient-to-r from-rose-500/20 to-amber-500/40 rounded-full" />
                       <div className="p-3 bg-muted/40 rounded-2xl border border-border/40 text-muted-foreground group-hover:rotate-12 transition-transform duration-500">
                          <ArrowRight size={20} strokeWidth={3} className="text-amber-500" />
                       </div>
                       <div className="h-0.5 w-6 bg-gradient-to-r from-amber-500/40 to-emerald-500/20 rounded-full" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 italic">Payback flow</span>
                  </div>

                  {/* Creditor */}
                  <div className="flex flex-col items-center gap-3 group/person">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-muted/50 border-2 border-border/40 flex items-center justify-center text-muted-foreground transition-all group-hover/person:border-emerald-500/40 group-hover/person:bg-emerald-500/5">
                       <User size={28} />
                    </div>
                    <div className="text-center">
                       <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mb-1">Chủ nợ</p>
                       <span className="text-sm font-black uppercase tracking-tight text-foreground">{debt.creditorName}</span>
                    </div>
                  </div>
                </div>

                {/* DEBT AMOUNT CARD */}
                <div className="relative p-6 bg-amber-500/5 rounded-[2.5rem] border border-amber-500/10 shadow-inner group-hover:bg-amber-500/[0.08] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-amber-500/20 rounded-lg text-amber-600">
                          <CircleDollarSign size={18} strokeWidth={3} />
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700/60">DƯ NỢ CÒN LẠI</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl md:text-5xl font-black tracking-tighter text-amber-600 font-money">
                        {debt.amount.toLocaleString()}
                      </span>
                      <span className="text-lg font-black text-amber-600/30 font-money">đ</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <Button
                onClick={() => handleSettleClick(debt.id)}
                disabled={settleDebt.isPending}
                className="relative z-10 w-full rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] h-14 bg-amber-500 hover:bg-amber-600 text-white shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all group/btn"
              >
                {settleDebt.isPending ? (
                  <Loader2 className="animate-spin mr-2" size={16} />
                ) : (
                  <CheckCircle2 className="mr-2 group-hover:rotate-12 transition-transform" size={16} />
                )}
                {settleDebt.isPending ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐÃ TRẢ XONG"}
              </Button>

              <div className="flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Info size={10} />
                 <span>Chỉ xác nhận khi đã nhận được tiền</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmSettle}
        title="Quyết toán nợ?"
        description="Bạn có chắc chắn khoản nợ này đã được thanh toán sòng phẳng không? Hành động này sẽ gạch tên khoản nợ khỏi hệ thống vĩnh viễn."
        confirmText="XÁC NHẬN ĐÃ TRẢ"
        isLoading={settleDebt.isPending}
      />
    </div>
  );
}
