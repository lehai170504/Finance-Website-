"use client";

import { useParams, useRouter } from "next/navigation";
import { useTransactionLogs } from "@/hooks/useLogs";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Loader2,
  ArrowLeft,
  History,
  Clock,
  User as UserIcon,
  Info,
  ChevronRight,
  ShieldAlert,
  RefreshCcw,
  Fingerprint,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TransactionLogsPage() {
  const { id } = useParams();
  const router = useRouter();

  const {
    data: logs,
    isLoading,
    isError,
    error,
    refetch,
  } = useTransactionLogs(id as string);

  // 1. LOADING STATE
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] font-sans">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <p className="font-black uppercase tracking-[0.3em] text-primary animate-pulse text-xs">
          Đang truy xuất hệ thống...
        </p>
      </div>
    );
  }

  // 2. ERROR STATE
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center font-sans">
        <div className="w-24 h-24 bg-destructive/10 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-destructive/10 border border-destructive/20 animate-in zoom-in duration-500">
          <ShieldAlert size={48} className="text-destructive" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-foreground">
          Lỗi truy xuất
        </h2>
        <p className="text-muted-foreground max-w-sm mx-auto mb-10 text-sm font-medium leading-relaxed">
          {(error as any)?.response?.data?.message ||
            "Hệ thống không tìm thấy lịch sử cho giao dịch này hoặc bạn không có quyền truy cập."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px] border-2 active:scale-95 transition-all"
          >
            QUAY LẠI
          </Button>
          <Button
            onClick={() => refetch()}
            className="rounded-xl px-8 h-12 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 active:scale-95 transition-all"
          >
            <RefreshCcw size={14} className="mr-2" /> THỬ LẠI
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-12 font-sans mb-20 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-card/50 backdrop-blur-xl border-2 border-border/40 p-8 md:p-10 rounded-[3rem] shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-[0.03] text-primary rotate-12 pointer-events-none">
          <History size={250} />
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="w-12 h-12 rounded-2xl bg-background shadow-sm border border-border/50 hover:bg-primary hover:text-white transition-all active:scale-90"
          >
            <ArrowLeft size={24} strokeWidth={3} />
          </Button>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none flex items-center gap-3 text-foreground">
              <History className="text-primary" size={32} strokeWidth={3} />{" "}
              Biến động
            </h1>
            <div className="flex items-center gap-2 bg-muted/40 px-3 py-1.5 rounded-lg border border-border/40 w-fit">
              <Fingerprint size={14} className="text-primary/60" />
              <p className="text-muted-foreground text-[10px] font-money font-bold uppercase tracking-tight">
                Mã định danh:{" "}
                <span className="text-foreground/80 select-all">{id}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col items-end relative z-10">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-2">
            Hệ thống ghi nhận
          </span>
          <span className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-sm animate-pulse">
            Active Audit
          </span>
        </div>
      </div>

      {/* TIMELINE SECTION */}
      <div className="min-h-[400px]">
        {logs?.length === 0 ? (
          <div className="bg-muted/[0.02] border-2 border-dashed border-border/40 rounded-[3rem] py-32 text-center animate-in zoom-in duration-500">
            <Info
              className="mx-auto mb-6 opacity-10 text-primary"
              size={64}
              strokeWidth={1}
            />
            <p className="font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground/50">
              Hiện chưa có bản ghi lịch sử cho giao dịch này
            </p>
          </div>
        ) : (
          <div className="relative space-y-10 px-2">
            {/* Timeline Line Vertical */}
            <div className="absolute left-[31px] top-4 bottom-4 w-1 bg-gradient-to-b from-primary/40 via-border/50 to-transparent hidden md:block rounded-full" />

            {logs?.map((log: any, index: number) => {
              const logDate = parseISO(log.updatedAt);
              return (
                <div
                  key={log.id}
                  className="group relative flex gap-8 animate-in fade-in slide-in-from-left-4 duration-500"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  {/* Dot timeline Point */}
                  <div className="hidden md:flex flex-col items-center relative z-10">
                    <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center bg-background border-4 border-muted/20 text-muted-foreground/60 group-hover:bg-primary group-hover:text-white group-hover:border-primary/20 group-hover:scale-110 transition-all duration-500 shadow-xl">
                      <Clock size={22} strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="flex-1 bg-card border-2 border-border/40 p-7 rounded-[2.5rem] shadow-sm hover:border-primary/30 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group/card">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.15em] border border-primary/10">
                          {log.action}
                        </span>
                        <span className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-[0.2em] border-l pl-3 border-border">
                          Financial Audit Trail
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-money font-bold text-muted-foreground/60 uppercase tracking-tighter bg-muted/40 px-3 py-1.5 rounded-lg border border-border/40">
                        <Clock size={12} className="text-primary/60" />
                        {format(logDate, "HH:mm", { locale: vi })}
                        <span className="mx-1 opacity-30">|</span>
                        <Calendar size={12} />
                        {format(logDate, "dd/MM/yyyy", { locale: vi })}
                      </div>
                    </div>

                    <div className="relative mb-8">
                      <p className="text-[15px] md:text-base font-semibold leading-relaxed text-foreground/80 pl-5 border-l-4 border-primary transition-all group-hover/card:border-primary/100">
                        {log.details}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/30 pt-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center border border-primary/10 group-hover/card:scale-110 transition-all duration-500">
                          <UserIcon size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 leading-none mb-1">
                            Thực hiện bởi
                          </span>
                          <span className="text-sm font-black uppercase tracking-tight text-primary leading-none">
                            {log.updatedBy}
                          </span>
                        </div>
                      </div>

                      <div className="text-[9px] font-money font-black text-muted-foreground/20 uppercase tracking-widest bg-muted/20 px-2 py-0.5 rounded">
                        LOG_SIG: {log.id.substring(0, 12).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="text-center py-20 border-t border-border/20">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/20 italic">
          --- End of Transaction Audit ---
        </p>
      </div>
    </div>
  );
}
