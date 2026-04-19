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
  Calendar,
  RefreshCcw,
  LayoutList,
  History,
  Clock,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function GroupLogsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("ALL");

  const {
    data: logs,
    isLoading,
    isError,
    error,
    refetch,
  } = useGroupLogs(id as string);

  const getActionConfig = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("CREATE")) return { color: "emerald", label: "Tạo mới", icon: Plus };
    if (act.includes("UPDATE")) return { color: "amber", label: "Cập nhật", icon: RefreshCcw };
    if (act.includes("DELETE")) return { color: "rose", label: "Xóa bỏ", icon: ShieldAlert };
    return { color: "blue", label: "Hệ thống", icon: Activity };
  };

  const filteredLogs = logs?.filter(
    (log: any) =>
      (log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.updatedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (activeFilter === "ALL" || log.action.includes(activeFilter))
  );

  // Nhóm logs theo ngày
  const groupedLogs = filteredLogs?.reduce((groups: any, log: any) => {
    const date = format(parseISO(log.updatedAt), "yyyy-MM-dd");
    if (!groups[date]) groups[date] = [];
    groups[date].push(log);
    return groups;
  }, {});

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] font-sans">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <p className="font-black uppercase tracking-[0.3em] text-primary animate-pulse text-[10px]">
          Đang truy xuất dữ liệu forensic...
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
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none flex items-center gap-3">
              <History className="text-primary" size={40} strokeWidth={3} />
              Nhật ký nhóm
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] ml-1">
              Dữ liệu minh bạch • Đồng đội tin cậy
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto z-10">
          {/* Quick Filters */}
          <div className="flex bg-muted/50 p-1 rounded-xl border border-border/40 backdrop-blur-md">
             {["ALL", "CREATE", "DELETE"].map(f => (
               <button
                 key={f}
                 onClick={() => setActiveFilter(f)}
                 className={cn(
                   "px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                   activeFilter === f ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                 )}
               >
                 {f === "ALL" ? "Tất cả" : f === "CREATE" ? "Tạo" : "Xóa"}
               </button>
             ))}
          </div>

          {/* Search Bar */}
          <div className="relative group flex-1 sm:w-64">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-primary transition-colors"
              size={16}
            />
            <Input
              placeholder="Tìm kiếm..."
              className="h-12 pl-11 pr-6 rounded-xl border-2 border-border/40 text-xs font-bold bg-background/50 focus:bg-background transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TIMELINE FEED */}
      <div className="min-h-[500px]">
        {!groupedLogs || Object.keys(groupedLogs).length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed rounded-[3rem] border-border/40 bg-muted/10">
            <LayoutList size={48} className="mb-4 opacity-10" />
            <p className="font-black uppercase tracking-[0.2em] text-[10px] text-muted-foreground/60">
              Không tìm thấy hoạt động nào phù hợp
            </p>
          </div>
        ) : (
          <div className="space-y-16 relative">
            {/* Main Timeline Spine */}
            <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-border to-transparent hidden md:block" />

            {Object.keys(groupedLogs).sort((a, b) => b.localeCompare(a)).map((date) => (
              <div key={date} className="space-y-8">
                {/* STICKY DATE HEADER */}
                <div className="sticky top-24 z-20 flex items-center gap-4 bg-background/80 backdrop-blur-md py-2 px-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary shadow-inner">
                    <Calendar size={20} strokeWidth={3} />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-[0.3em] text-foreground/80">
                    {format(parseISO(date), "EEEE, dd 'tháng' MM", { locale: vi })}
                  </h3>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-border/50 to-transparent" />
                </div>

                <div className="space-y-10 pl-0 md:pl-2">
                  {groupedLogs[date].map((log: any, idx: number) => {
                    const config = getActionConfig(log.action);
                    const ActionIcon = config.icon;
                    const logTime = format(parseISO(log.updatedAt), "HH:mm");

                    return (
                      <div
                        key={log.id}
                        className="group relative flex gap-6 md:gap-10 animate-in fade-in slide-in-from-left-4"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        {/* ICON & SPINE POINT */}
                        <div className="hidden md:flex flex-col items-center">
                          <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 z-10 border-2 border-background",
                            config.color === "emerald" ? "bg-emerald-500 text-white shadow-emerald-500/20" :
                            config.color === "rose" ? "bg-rose-500 text-white shadow-rose-500/20" :
                            config.color === "amber" ? "bg-amber-500 text-white shadow-amber-500/20" :
                            "bg-blue-500 text-white shadow-blue-500/20"
                          )}>
                            <ActionIcon size={20} strokeWidth={2.5} />
                          </div>
                        </div>

                        {/* CONTENT CARD */}
                        <div className="flex-1 bg-card border border-border/50 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-500 group/card relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-[0.02] group-hover/card:scale-150 transition-transform duration-700">
                             <ActionIcon size={80} />
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 relative z-10">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-black text-xs text-muted-foreground border border-border/50">
                                {log.updatedBy.substring(0, 2).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-black text-sm uppercase tracking-tight">{log.updatedBy}</span>
                                <span className={cn(
                                  "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md w-fit mt-0.5",
                                  config.color === "emerald" ? "bg-emerald-500/10 text-emerald-600" :
                                  config.color === "rose" ? "bg-rose-500/10 text-rose-600" :
                                  config.color === "amber" ? "bg-amber-500/10 text-amber-600" :
                                  "bg-blue-500/10 text-blue-600"
                                )}>
                                  {config.label}
                                </span>
                              </div>
                            </div>
                            <div className="text-[10px] font-money font-bold text-muted-foreground/40 bg-muted/30 px-3 py-1.5 rounded-xl border border-border/20 flex items-center gap-2">
                               <Clock size={12} /> {logTime}
                            </div>
                          </div>

                          <div className="p-4 rounded-2xl bg-muted/30 border-l-4 border-primary/40 text-[13px] font-bold text-foreground/80 leading-relaxed group-hover/card:bg-muted/50 transition-colors">
                            {log.details}
                          </div>

                          <div className="mt-4 flex items-center gap-3">
                             <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/30 px-2 py-1 bg-muted/10 rounded-lg">
                               TRX: {log.transactionId?.substring(0, 8) || "SYSTEM"}
                             </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
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
