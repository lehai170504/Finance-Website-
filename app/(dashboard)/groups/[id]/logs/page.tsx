"use client";

import { useParams, useRouter } from "next/navigation";
import { useGroupLogs } from "@/hooks/useLogs";
import { format, parseISO } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Loader2,
  ArrowLeft,
  Activity,
  ShieldAlert,
  Search,
  User as UserIcon,
  Calendar,
  RefreshCcw,
  LayoutList,
  History,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function GroupLogsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: logs,
    isLoading,
    isError,
    error,
    refetch,
  } = useGroupLogs(id as string);

  const filteredLogs = logs?.filter(
    (log: any) =>
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.updatedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] font-sans">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <p className="font-black uppercase tracking-[0.3em] text-primary animate-pulse text-xs">
          Đang truy xuất dữ liệu...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center font-sans">
        <div className="w-24 h-24 bg-destructive/10 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-destructive/10 border border-destructive/20 animate-in zoom-in duration-500">
          <ShieldAlert size={48} className="text-destructive" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 text-foreground">
          Quyền hạn hạn chế
        </h2>
        <p className="text-muted-foreground max-w-sm mx-auto mb-10 text-sm font-medium leading-relaxed">
          {(error as any)?.response?.data?.message ||
            "Khu vực này chỉ dành cho Quản trị viên (Trưởng nhóm). Vui lòng liên hệ chủ nhóm để được cấp quyền."}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.back()}
            variant="outline"
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
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-12 font-sans mb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 bg-card/50 backdrop-blur-xl border-2 border-border/40 p-8 md:p-10 rounded-[3rem] shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -top-10 opacity-[0.03] text-primary rotate-12">
          <History size={200} />
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
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter leading-none flex items-center gap-3">
              <Activity className="text-primary" size={32} strokeWidth={3} />
              Nhật ký nhóm
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
              Kiểm soát mọi biến động dữ liệu
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full xl:w-96 z-10 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
            size={18}
          />
          <Input
            placeholder="Lọc thành viên, hành động..."
            className="h-14 pl-12 pr-6 rounded-2xl border-2 border-border/60 text-xs font-bold bg-background focus:bg-background transition-all shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TIMELINE FEED */}
      <div className="min-h-[400px]">
        {filteredLogs?.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed rounded-[3rem] border-border/40 bg-muted/10">
            <LayoutList size={48} className="mb-4 opacity-10" />
            <p className="font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground/60">
              Không tìm thấy hoạt động nào phù hợp
            </p>
          </div>
        ) : (
          <div className="space-y-10 relative px-2">
            {/* Đường Timeline chạy dọc */}
            <div className="absolute left-[31px] top-4 bottom-4 w-1 bg-gradient-to-b from-primary/40 via-border/50 to-transparent hidden md:block rounded-full" />

            {filteredLogs?.map((log: any, index: number) => {
              const logDate = parseISO(log.updatedAt);
              const isDelete = log.action.includes("DELETE");
              const isCreate = log.action.includes("CREATE");

              return (
                <div
                  key={log.id}
                  className="group relative flex gap-8 animate-in fade-in slide-in-from-left-4 duration-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Icon Timeline Point */}
                  <div className="hidden md:flex flex-col items-center relative z-10">
                    <div
                      className={cn(
                        "w-16 h-16 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 shadow-lg border-4 border-background group-hover:scale-110",
                        isDelete
                          ? "bg-red-500 text-white shadow-red-500/20"
                          : isCreate
                            ? "bg-emerald-500 text-white shadow-emerald-500/20"
                            : "bg-blue-500 text-white shadow-blue-500/20",
                      )}
                    >
                      {isDelete ? (
                        <ShieldAlert size={20} />
                      ) : (
                        <UserIcon size={20} />
                      )}
                    </div>
                  </div>

                  {/* Nội dung Card */}
                  <div className="flex-1 space-y-4 p-7 rounded-[2.5rem] bg-card border-2 border-border/40 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 relative overflow-hidden group/card">
                    {/* Hành động tag nổi bật */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="font-black text-lg text-foreground tracking-tighter uppercase">
                          {log.updatedBy}
                        </span>
                        <span
                          className={cn(
                            "px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm",
                            isCreate
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                              : isDelete
                                ? "bg-red-500/10 text-red-600 border-red-500/20"
                                : "bg-blue-500/10 text-blue-600 border-blue-500/20",
                          )}
                        >
                          {log.action}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-money font-bold text-muted-foreground/60 uppercase tracking-tighter bg-muted/40 px-3 py-1.5 rounded-lg border border-border/40">
                        <Clock size={12} />
                        {format(logDate, "HH:mm", { locale: vi })}
                        <span className="mx-1 opacity-30">|</span>
                        <Calendar size={12} />
                        {format(logDate, "dd/MM/yyyy", { locale: vi })}
                      </div>
                    </div>

                    {/* Hộp chi tiết nội dung */}
                    <div className="p-5 rounded-2xl bg-muted/20 text-[13px] font-semibold text-foreground/80 leading-relaxed border-l-4 border-primary transition-all group-hover/card:bg-muted/30">
                      {log.details}
                    </div>

                    {/* Metadata TX ID */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2 text-[9px] font-money font-black uppercase tracking-widest text-muted-foreground/40">
                        <span className="bg-muted/50 px-2 py-0.5 rounded">
                          ID:{" "}
                          {log.transactionId?.substring(0, 12) ||
                            "SYSTEM_EVENT"}
                        </span>
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
          --- End of Activity Feed ---
        </p>
      </div>
    </div>
  );
}
