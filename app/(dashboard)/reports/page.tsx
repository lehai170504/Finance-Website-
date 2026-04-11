"use client";

import { useState } from "react";
import { useReports } from "@/hooks/useReports";
import { Button } from "@/components/ui/button";
import {
  Download,
  Target,
  PieChart,
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
  CalendarDays,
  ChevronRight,
  TrendingUp,
  Lightbulb,
  Sparkles,
  Loader2,
} from "lucide-react";
import { SetBudgetModal } from "@/components/modals/SetBudgetModal";
import { SummaryCard } from "@/components/common/SummaryCard";
import { DatePickerInput } from "@/components/ui/date-picker-input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString()
      .split("T")[0],
  );

  const { stats, isLoadingStats, downloadExcel } = useReports(
    startDate,
    endDate,
  );
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  // Tính toán dữ liệu tổng quát
  const totalIncome = stats
    .filter((i: any) => i.categoryType === "INCOME")
    .reduce((sum: number, item: any) => sum + item.totalAmount, 0);

  const totalExpense = stats
    .filter((i: any) => i.categoryType === "EXPENSE")
    .reduce((sum: number, item: any) => sum + item.totalAmount, 0);

  const handleDownload = async () => {
    try {
      toast.info("Đang chuẩn bị dữ liệu Excel...");
      await downloadExcel();
      toast.success("Đã tải báo cáo thành công! 🔥");
    } catch (error) {
      toast.error("Không thể tải file, vui lòng thử lại!");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-12 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700 mb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 pb-10 border-b border-border/40 relative">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles size={20} strokeWidth={2.5} />
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">
              Báo cáo chi tiết
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
            PHÂN TÍCH <span className="text-primary">TÀI CHÍNH</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl">
            Toàn cảnh về dòng tiền và thói quen chi tiêu của homie.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <Button
            onClick={handleDownload}
            variant="outline"
            size="lg"
            className="flex-1 xl:flex-none rounded-2xl font-black text-[11px] uppercase border-2 h-14 px-8 tracking-widest hover:bg-primary/5 active:scale-95 transition-all"
          >
            <Download size={18} className="mr-2.5" /> Xuất dữ liệu
          </Button>
          <Button
            onClick={() => setIsBudgetOpen(true)}
            size="lg"
            className="flex-1 xl:flex-none rounded-2xl font-black text-[11px] uppercase h-14 px-8 tracking-widest shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Target size={18} className="mr-2.5" /> Thiết lập hạn mức
          </Button>
        </div>
      </div>

      {/* SUMMARY CARDS - CẬP NHẬT FONT MONEY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SummaryCard
          title="Tổng Thu Nhập"
          amount={totalIncome}
          icon={<ArrowUpCircle size={32} className="text-emerald-500" />}
          className="bg-emerald-500/[0.03] border-emerald-500/20"
        />
        <SummaryCard
          title="Tổng Chi Tiêu"
          amount={totalExpense}
          icon={<ArrowDownCircle size={32} className="text-destructive" />}
          className="bg-destructive/[0.03] border-destructive/20"
        />
        <SummaryCard
          title="Số dư ròng"
          amount={totalIncome - totalExpense}
          icon={<Wallet size={32} className="text-primary" />}
          className="bg-primary/[0.03] border-primary/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: CHI TIẾT CƠ CẤU */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-8 border-2 border-border/40 rounded-[3rem] bg-card shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20 shadow-inner">
                  <PieChart size={24} strokeWidth={3} />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                    Cơ cấu dòng tiền
                  </h2>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
                    Phân bổ theo hạng mục
                  </p>
                </div>
              </div>

              {/* FILTER NGÀY - PREMIUM DESIGN */}
              <div className="flex items-center gap-3 bg-muted/40 p-2 rounded-2xl border border-border/50 backdrop-blur-md w-full sm:w-auto shadow-inner">
                <DatePickerInput
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-10 text-[11px] font-money font-bold border-none bg-background shadow-sm rounded-xl focus-visible:ring-primary/20 transition-all"
                />
                <ChevronRight
                  size={16}
                  className="text-muted-foreground/40 shrink-0"
                />
                <DatePickerInput
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-10 text-[11px] font-money font-bold border-none bg-background shadow-sm rounded-xl focus-visible:ring-primary/20 transition-all"
                />
              </div>
            </div>

            {isLoadingStats ? (
              <div className="py-40 text-center flex flex-col items-center gap-6">
                <div className="relative">
                  <Loader2
                    className="w-12 h-12 animate-spin text-primary"
                    strokeWidth={3}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-primary rounded-full animate-ping" />
                  </div>
                </div>
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary animate-pulse">
                  Đang xử lý dữ liệu...
                </span>
              </div>
            ) : stats.length === 0 ? (
              <div className="py-32 text-center border-2 border-dashed rounded-[2.5rem] border-border/40 bg-muted/10">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">
                  Không có dữ liệu trong khoảng này
                </p>
              </div>
            ) : (
              <div className="space-y-10 relative z-10 px-2">
                {stats.map((item: any, index: number) => {
                  const isExpense = item.categoryType === "EXPENSE";
                  const baseAmount = isExpense ? totalExpense : totalIncome;
                  const percent =
                    baseAmount > 0 ? (item.totalAmount / baseAmount) * 100 : 0;

                  return (
                    <div
                      key={index}
                      className="group cursor-default animate-in fade-in slide-in-from-left-4 duration-500"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex justify-between items-end mb-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-[1.25rem] flex items-center justify-center text-lg font-black shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 border-2 border-background",
                              isExpense
                                ? "bg-red-500/10 text-red-500"
                                : "bg-emerald-500/10 text-emerald-500",
                            )}
                          >
                            {item.categoryName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col leading-tight">
                            <span className="text-base font-black uppercase tracking-tight text-foreground/90">
                              {item.categoryName}
                            </span>
                            <span
                              className={cn(
                                "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md w-fit mt-1",
                                isExpense
                                  ? "bg-red-500/5 text-red-500/70"
                                  : "bg-emerald-500/5 text-emerald-500/70",
                              )}
                            >
                              {isExpense ? "Chi tiêu" : "Thu nhập"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={cn(
                              "text-xl font-black block leading-none tracking-tighter font-money",
                              isExpense
                                ? "text-destructive"
                                : "text-emerald-600",
                            )}
                          >
                            {isExpense ? "-" : "+"}
                            {item.totalAmount.toLocaleString()}đ
                          </span>
                          <span className="text-[10px] font-money font-bold text-muted-foreground/60 uppercase mt-1.5 inline-block">
                            Tỷ trọng: {percent.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* PROGRESS BAR - HIGH CONTRAST */}
                      <div className="w-full h-3 bg-muted/50 rounded-full overflow-hidden border border-border/20 shadow-inner">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-1000 ease-in-out shadow-[0_0_12px] group-hover:brightness-110",
                            isExpense
                              ? "bg-gradient-to-r from-red-500 via-rose-500 to-orange-400 shadow-red-500/20"
                              : "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 shadow-emerald-500/20",
                          )}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: INSIGHTS & TIPS */}
        <div className="lg:col-span-4 space-y-8">
          {/* INSIGHT CARD */}
          <div className="p-8 border-2 border-border/40 rounded-[2.5rem] bg-card/50 backdrop-blur-md shadow-sm relative overflow-hidden group hover:border-primary/30 transition-all duration-500">
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-all" />

            <div className="flex items-center gap-4 mb-8">
              <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/20 group-hover:rotate-12 transition-transform">
                <Lightbulb size={20} strokeWidth={3} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/80">
                Gợi ý tài chính
              </h3>
            </div>

            <div className="space-y-8 relative z-10">
              <div className="p-5 bg-muted/40 rounded-2xl border border-border/50 shadow-inner">
                <p className="text-sm text-foreground/80 font-bold leading-relaxed">
                  Homie đã sử dụng khoảng{" "}
                  <span className="text-destructive font-black font-money text-lg tracking-tighter">
                    {totalExpense.toLocaleString()}đ
                  </span>{" "}
                  cho các nhu cầu tháng này.
                </p>
                <div className="mt-4 pt-4 border-t border-border/40">
                  <p className="text-[11px] text-muted-foreground font-medium leading-relaxed italic">
                    👉 Mẹo từ chuyên gia: Cân nhắc tối ưu hóa 15% các khoản chi
                    không thiết yếu để gia tăng tích lũy homie nhé!
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                className="w-full h-16 justify-between text-[11px] font-black uppercase tracking-[0.2em] hover:bg-primary/5 rounded-2xl border-2 border-dashed border-border/60 hover:border-primary/30 transition-all group/btn"
                onClick={() => setIsBudgetOpen(true)}
              >
                <span>Tối ưu hóa hạn mức</span>
                <ChevronRight
                  size={18}
                  strokeWidth={3}
                  className="group-hover/btn:translate-x-1.5 transition-transform text-primary"
                />
              </Button>
            </div>
          </div>

          {/* DECORATIVE TIPS CARD */}
          <div className="p-10 rounded-[3rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/30 relative overflow-hidden group min-h-[250px] flex flex-col justify-between">
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-[60px] group-hover:bg-white/20 transition-all duration-700" />
            <div className="absolute bottom-0 right-0 p-8 opacity-[0.07] transform rotate-12 scale-150 transition-transform duration-1000 group-hover:rotate-0">
              <TrendingUp size={120} strokeWidth={3} />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp size={28} strokeWidth={3} />
                <h3 className="text-2xl font-black leading-tight uppercase tracking-tighter">
                  Financial Ninja
                </h3>
              </div>
              <p className="text-[15px] opacity-90 font-bold leading-relaxed tracking-tight max-w-[200px]">
                "Làm chủ dòng tiền là bước đi đầu tiên của sự tự do thực sự."
              </p>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-white/20 flex justify-between items-center">
              <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-60">
                Homie Core Protocol v4.0
              </p>
              <div className="h-2 w-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]" />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <SetBudgetModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
      />
    </div>
  );
}
