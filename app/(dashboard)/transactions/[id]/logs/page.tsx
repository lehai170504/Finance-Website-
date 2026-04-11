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
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

  // 1. LOADING STATE - NHỎ GỌN
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="font-black uppercase tracking-widest text-muted-foreground animate-pulse text-sm">
          Đang truy xuất hệ thống...
        </p>
      </div>
    );
  }

  // 2. ERROR STATE - TINH TẾ
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
        <div className="w-20 h-20 bg-destructive/10 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-destructive/10">
          <ShieldAlert size={40} className="text-destructive" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-3">
          Lỗi truy xuất
        </h2>
        <p className="text-muted-foreground max-w-sm mx-auto mb-8 text-sm font-medium leading-relaxed">
          {(error as any)?.response?.data?.message ||
            "Không thể tìm thấy lịch sử cho giao dịch này."}
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-xl px-6 h-11 font-black uppercase tracking-widest text-[10px] border-2"
          >
            QUAY LẠI
          </Button>
          <Button
            onClick={() => refetch()}
            className="rounded-xl px-6 h-11 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
          >
            <RefreshCcw size={14} className="mr-2" /> THỬ LẠI
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-10">
      {/* HEADER SECTION - COMPACT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card border-2 border-border/50 p-6 md:p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
          <History size={100} />
        </div>

        <div className="flex items-center gap-5 relative z-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="w-12 h-12 rounded-full bg-muted/50 hover:bg-primary hover:text-white transition-all duration-300"
          >
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none flex items-center gap-3">
              <History className="text-primary" size={32} /> Biến động
            </h1>
            <p className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.2em] mt-2 flex items-center gap-2">
              Mã giao dịch <ChevronRight size={12} className="text-primary" />
              <span className="text-foreground/60 select-all">
                {id?.slice(0, 18)}...
              </span>
            </p>
          </div>
        </div>

        <div className="hidden lg:block text-right relative z-10">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground block mb-1">
            Trạng thái
          </span>
          <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            Đang hoạt động
          </span>
        </div>
      </div>

      {/* TIMELINE SECTION */}
      <div className="grid gap-6 relative">
        {logs?.length === 0 ? (
          <div className="bg-muted/10 border-2 border-dashed rounded-[3rem] py-24 text-center">
            <Info className="mx-auto mb-4 opacity-10" size={48} />
            <p className="font-black uppercase tracking-widest text-xs text-muted-foreground">
              Bản ghi hiện đang trống
            </p>
          </div>
        ) : (
          <div className="relative space-y-6">
            {/* Đường line dọc mảnh mai */}
            <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-border to-transparent hidden md:block" />

            {logs?.map((log: any) => {
              const logDate = parseISO(log.updatedAt);
              return (
                <div key={log.id} className="relative pl-0 md:pl-14 group">
                  {/* Dot timeline gọn gàng */}
                  <div className="absolute left-0 w-12 h-12 hidden md:flex items-center justify-center rounded-2xl border-4 border-background bg-muted group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-md z-10">
                    <Clock size={18} />
                  </div>

                  {/* Card nội dung - text nhỏ lại cho đều */}
                  <div className="bg-card border-2 border-border/50 p-6 rounded-[2rem] shadow-sm hover:border-primary/20 hover:shadow-xl transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                          {log.action}
                        </span>
                        <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                          Audit Trail
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground uppercase tracking-widest bg-muted/50 px-3 py-1.5 rounded-lg">
                        <Clock size={12} className="text-primary" />
                        {format(logDate, "HH:mm", { locale: vi })}
                        <span className="mx-1 opacity-30">•</span>
                        {format(logDate, "dd/MM/yyyy", { locale: vi })}
                      </div>
                    </div>

                    <div className="relative mb-6">
                      <p className="text-sm md:text-base font-semibold leading-relaxed text-foreground/70 pl-4 border-l-2 border-primary/20">
                        {log.details}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/30 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <UserIcon size={14} />
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-tight text-primary">
                            {log.updatedBy}
                          </span>
                        </div>
                      </div>

                      <div className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-tighter">
                        ID: {log.id.substring(0, 8)}
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
      <div className="text-center py-10">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20">
          End of records
        </p>
      </div>
    </div>
  );
}
