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
      toast.success("Đã tải báo cáo thành công!");
    } catch (error) {
      toast.error("Không thể tải file, vui lòng thử lại!");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-500">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 pb-8 border-b border-border/50">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
            PHÂN TÍCH <span className="text-primary">BÁO CÁO</span>
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Cái nhìn toàn cảnh về sức khỏe tài chính của homie.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <Button
            onClick={handleDownload}
            variant="outline"
            className="flex-1 lg:flex-none rounded-2xl font-black text-[11px] uppercase border-2 h-12 px-6 tracking-widest hover:bg-primary/5"
          >
            <Download size={16} className="mr-2" /> Xuất Excel
          </Button>
          <Button
            onClick={() => setIsBudgetOpen(true)}
            className="flex-1 lg:flex-none rounded-2xl font-black text-[11px] uppercase h-12 px-6 tracking-widest shadow-xl shadow-primary/20 hover:scale-105 transition-all"
          >
            <Target size={16} className="mr-2" /> Đặt Hạn Mức
          </Button>
        </div>
      </div>

      {/* QUICK SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Tổng Thu Nhập"
          amount={totalIncome}
          icon={<ArrowUpCircle size={28} className="text-emerald-500" />}
          className="bg-emerald-500/5 border-emerald-500/20"
        />
        <SummaryCard
          title="Tổng Chi Tiêu"
          amount={totalExpense}
          icon={<ArrowDownCircle size={28} className="text-destructive" />}
          className="bg-destructive/5 border-destructive/20"
        />
        <SummaryCard
          title="Số dư khả dụng"
          amount={totalIncome - totalExpense}
          icon={<Wallet size={28} className="text-primary" />}
          className="bg-primary/5 border-primary/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: CHI TIẾT CƠ CẤU (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-8 border-2 border-border/50 rounded-[2.5rem] bg-card shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                  <PieChart size={20} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
                  Cơ cấu dòng tiền
                </h2>
              </div>

              {/* FILTER NGÀY - DÙNG COMPONENT DATEPICKER ĐÃ CUSTOM */}
              <div className="flex items-center gap-2 bg-muted/40 p-1.5 rounded-2xl border border-border/50 backdrop-blur-sm w-full sm:w-auto">
                <DatePickerInput
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-9 text-[10px] border-none bg-transparent shadow-none focus-visible:ring-0"
                />
                <ChevronRight
                  size={14}
                  className="text-muted-foreground shrink-0"
                />
                <DatePickerInput
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-9 text-[10px] border-none bg-transparent shadow-none focus-visible:ring-0"
                />
              </div>
            </div>

            {isLoadingStats ? (
              <div className="py-32 text-center flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">
                  Đang xử lý dữ liệu...
                </span>
              </div>
            ) : stats.length === 0 ? (
              <div className="py-32 text-center border-4 border-dashed rounded-[3rem] border-muted/30 bg-muted/5">
                <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
                  Chưa có dữ liệu giao dịch phát sinh.
                </p>
              </div>
            ) : (
              <div className="space-y-8 relative z-10">
                {stats.map((item: any, index: number) => {
                  const isExpense = item.categoryType === "EXPENSE";
                  const baseAmount = isExpense ? totalExpense : totalIncome;
                  const percent =
                    baseAmount > 0 ? (item.totalAmount / baseAmount) * 100 : 0;

                  return (
                    <div key={index} className="group cursor-default">
                      <div className="flex justify-between items-end mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shadow-inner transition-transform group-hover:scale-110",
                              isExpense
                                ? "bg-red-500/10 text-red-500"
                                : "bg-emerald-500/10 text-emerald-500",
                            )}
                          >
                            {item.categoryName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black uppercase tracking-tight text-foreground/90">
                              {item.categoryName}
                            </span>
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                              {isExpense ? "Chi phí" : "Thu nhập"}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={cn(
                              "text-lg font-black block leading-none tracking-tighter",
                              isExpense
                                ? "text-destructive"
                                : "text-emerald-600",
                            )}
                          >
                            {isExpense ? "-" : "+"}
                            {item.totalAmount.toLocaleString()}đ
                          </span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">
                            Tỷ trọng: {percent.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      {/* PROGRESS BAR XỊN */}
                      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden border border-border/20 shadow-inner">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-1000 ease-out",
                            isExpense
                              ? "bg-gradient-to-r from-red-500 to-rose-400"
                              : "bg-gradient-to-r from-emerald-500 to-teal-400",
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

        {/* RIGHT COLUMN: INSIGHTS & TIPS (4 columns) */}
        <div className="lg:col-span-4 space-y-6">
          {/* INSIGHT CARD */}
          <div className="p-8 border-2 border-border/50 rounded-[2.5rem] bg-card shadow-sm hover:border-primary/20 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                <Lightbulb size={20} strokeWidth={2.5} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-foreground">
                Gợi ý từ Homie
              </h3>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-muted/30 rounded-2xl border border-border/50">
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                  Tháng này homie đã "đốt" hết{" "}
                  <span className="text-destructive font-black text-sm tracking-tight">
                    {totalExpense.toLocaleString()}đ
                  </span>
                  .
                </p>
                <p className="text-[11px] text-muted-foreground mt-2 italic">
                  👉 Mẹo: Hãy thử cắt giảm 10% chi phí ăn uống để có quỹ du lịch
                  cuối năm nhé!
                </p>
              </div>

              <Button
                variant="ghost"
                className="w-full h-14 justify-between text-[11px] font-black uppercase tracking-widest hover:bg-primary/10 rounded-2xl border-2 border-dashed border-border hover:border-primary/30 group transition-all"
                onClick={() => setIsBudgetOpen(true)}
              >
                Tối ưu hạn mức
                <ChevronRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform text-primary"
                />
              </Button>
            </div>
          </div>

          {/* DECORATIVE TIPS CARD */}
          <div className="p-8 rounded-[2.5rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/20 relative overflow-hidden group min-h-[220px] flex flex-col justify-between">
            {/* Background Glow */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={24} strokeWidth={3} />
                <h3 className="text-xl font-black leading-tight uppercase tracking-tighter">
                  Homie Pro Tips
                </h3>
              </div>
              <p className="text-sm opacity-90 font-bold leading-relaxed tracking-tight">
                "Kỷ luật tài chính không phải là bóp nghẹt chi tiêu, mà là chi
                tiêu có mục đích."
              </p>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/20">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">
                Level: Financial Ninja
              </p>
            </div>

            <PieChart
              size={140}
              className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* MODAL ĐẶT HẠN MỨC */}
      <SetBudgetModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
      />
    </div>
  );
}
