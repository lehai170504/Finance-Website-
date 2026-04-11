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
  ChevronRight,
  RefreshCcw,
  LayoutList,
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
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="font-black uppercase tracking-widest text-muted-foreground animate-pulse text-sm">
          Đang tải nhật ký...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-muted/5">
        <div className="w-20 h-20 bg-destructive/10 rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-destructive/10">
          <ShieldAlert size={40} className="text-destructive" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-3 text-foreground">
          Truy cập bị từ chối
        </h2>
        <p className="text-muted-foreground max-w-sm mx-auto mb-8 text-sm font-medium leading-relaxed">
          {(error as any)?.response?.data?.message ||
            "Hệ thống bảo mật: Chỉ Trưởng nhóm mới có quyền xem nhật ký này."}
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => router.back()}
            variant="outline"
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
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      {/* HEADER SECTION - THU GỌN */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card border-2 border-border/50 p-6 md:p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
          <Activity size={100} />
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
              <Activity className="text-primary" size={32} /> Hoạt động nhóm
            </h1>
          </div>
        </div>

        {/* Search Bar - Cân đối */}
        <div className="relative w-full lg:w-80 z-10">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={16}
          />
          <Input
            placeholder="Tìm nội dung, thành viên..."
            className="h-12 pl-10 pr-6 rounded-xl border-2 text-xs font-bold bg-background/50 focus-visible:ring-primary/10 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TIMELINE FEED */}
      <div className="grid gap-6">
        {filteredLogs?.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed rounded-[3rem] bg-muted/10">
            <LayoutList size={48} className="mb-4 opacity-10" />
            <p className="font-black uppercase tracking-widest text-xs text-muted-foreground">
              Không có dữ liệu trùng khớp
            </p>
          </div>
        ) : (
          <div className="space-y-6 relative">
            {/* Đường line chạy dọc - Nhỏ lại */}
            <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 via-border to-transparent hidden md:block" />

            {filteredLogs?.map((log: any) => {
              const logDate = parseISO(log.updatedAt);
              return (
                <div
                  key={log.id}
                  className="group relative flex gap-6 p-6 rounded-[2rem] bg-card border-2 border-border/50 hover:border-primary/20 hover:shadow-xl transition-all duration-300"
                >
                  {/* Icon bên trái - Gọn hơn */}
                  <div className="hidden md:flex flex-col items-center relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-foreground/60 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-md border-4 border-background">
                      <UserIcon size={18} />
                    </div>
                  </div>

                  {/* Nội dung Card */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-foreground tracking-tight">
                          {log.updatedBy}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest",
                            log.action.includes("CREATE")
                              ? "bg-emerald-500/10 text-emerald-600"
                              : log.action.includes("DELETE")
                                ? "bg-red-500/10 text-red-600"
                                : "bg-blue-500/10 text-blue-600",
                          )}
                        >
                          {log.action}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">
                        <Calendar size={12} />
                        {format(logDate, "HH:mm", { locale: vi })}
                        <span className="mx-1">•</span>
                        {format(logDate, "dd/MM/yyyy", { locale: vi })}
                      </div>
                    </div>

                    {/* Chữ chi tiết - Đã nhỏ lại và dễ đọc hơn */}
                    <div className="p-4 rounded-xl bg-muted/30 text-sm font-semibold text-foreground/70 leading-relaxed border-l-2 border-primary/20 group-hover:border-primary transition-all">
                      {log.details}
                    </div>

                    <div className="flex items-center justify-between opacity-30 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-tighter text-muted-foreground">
                        <span>
                          TX: {log.transactionId?.substring(0, 8) || "SYSTEM"}
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
      <div className="text-center py-12">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/20">
          End of stream
        </p>
      </div>
    </div>
  );
}
