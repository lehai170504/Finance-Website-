"use client";

import { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function ReportsPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) {
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

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

  const [activeTab, setActiveTab] = useState<"EXPENSE" | "INCOME">("EXPENSE");
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);

  // Hàm chọn nhanh ngày
  const setQuickDate = (type: "THIS_MONTH" | "LAST_MONTH" | "THIS_YEAR") => {
    const now = new Date();
    let start, end;
    if (type === "THIS_MONTH") {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (type === "LAST_MONTH") {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
    } else {
      start = new Date(now.getFullYear(), 0, 1);
      end = new Date(now.getFullYear(), 11, 31);
    }
    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(end.toISOString().split("T")[0]);
  };

  const { stats, isLoadingStats, downloadExcel } = useReports(
    startDate,
    endDate,
  );

  // Lọc stats theo Tab
  const filteredStats = stats.filter((s: any) => s.categoryType === activeTab);

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

  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

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
          className="bg-emerald-500/[0.03] border-emerald-500/20 shadow-[0_20px_40px_-15px_rgba(16,185,129,0.1)]"
        />
        <SummaryCard
          title="Tổng Chi Tiêu"
          amount={totalExpense}
          icon={<ArrowDownCircle size={32} className="text-rose-500" />}
          className="bg-rose-500/[0.03] border-rose-500/20 shadow-[0_20px_40px_-15px_rgba(244,63,94,0.1)]"
        />
        <SummaryCard
          title="Số dư ròng"
          amount={totalIncome - totalExpense}
          icon={<Wallet size={32} className="text-primary" />}
          className="bg-primary/[0.03] border-primary/20 shadow-[0_20px_40px_-15px_rgba(59,130,246,0.1)]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT COLUMN: CHI TIẾT CƠ CẤU */}
        <div className="lg:col-span-8 space-y-8">
          <div className="p-8 md:p-12 border-2 border-border/40 rounded-[3.5rem] bg-card shadow-2xl shadow-black/5 relative overflow-hidden">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-16 relative z-10">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20">
                  <PieChart size={28} strokeWidth={3} />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-foreground">
                    Cơ cấu dòng tiền
                  </h2>
                  <div className="flex gap-4 mt-2">
                    <button 
                      onClick={() => setActiveTab("EXPENSE")}
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all",
                        activeTab === "EXPENSE" ? "border-rose-500 text-rose-500" : "border-transparent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Chi tiêu
                    </button>
                    <button 
                      onClick={() => setActiveTab("INCOME")}
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest pb-1 border-b-2 transition-all",
                        activeTab === "INCOME" ? "border-emerald-500 text-emerald-500" : "border-transparent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Thu nhập
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full xl:w-auto">
                {/* QUICK FILTERS */}
                <div className="flex gap-2">
                  {["THIS_MONTH", "LAST_MONTH", "THIS_YEAR"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setQuickDate(t as any)}
                      className="px-3 py-1.5 rounded-lg bg-muted/50 text-[9px] font-black uppercase tracking-wider hover:bg-primary hover:text-white transition-all"
                    >
                      {t === "THIS_MONTH" ? "Tháng này" : t === "LAST_MONTH" ? "Tháng trước" : "Năm nay"}
                    </button>
                  ))}
                </div>
                {/* DATE RANGE */}
                <div className="flex items-center gap-3 bg-muted/40 p-2 rounded-2xl border border-border/50 backdrop-blur-md shadow-inner">
                  <DatePickerInput
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-10 text-[11px] font-money font-bold border-none bg-background shadow-sm rounded-xl"
                  />
                  <ChevronRight size={16} className="text-muted-foreground/30" />
                  <DatePickerInput
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-10 text-[11px] font-money font-bold border-none bg-background shadow-sm rounded-xl"
                  />
                </div>
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
            ) : filteredStats.length === 0 ? (
              <div className="py-32 text-center border-2 border-dashed rounded-[3rem] border-border/40 bg-muted/5 flex flex-col items-center gap-4">
                <div className="p-4 bg-muted/20 rounded-full">
                   <CalendarDays size={32} className="text-muted-foreground/30" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-50">
                  Không có dữ liệu {activeTab === "EXPENSE" ? "chi tiêu" : "thu nhập"}
                </p>
              </div>
            ) : (
              <div className="space-y-12 relative z-10 px-2">
                {filteredStats.map((item: any, index: number) => {
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
                      <div className="flex justify-between items-end mb-5">
                        <div className="flex items-center gap-5">
                          <div
                            className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 border-2 border-background",
                              isExpense
                                ? "bg-rose-500 text-white shadow-rose-500/20"
                                : "bg-emerald-500 text-white shadow-emerald-500/20",
                            )}
                          >
                            {item.categoryName.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-lg font-black uppercase tracking-tight text-foreground/90 group-hover:text-primary transition-colors">
                              {item.categoryName}
                            </span>
                            <div className="flex items-center gap-2">
                               <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isExpense ? "bg-rose-500" : "bg-emerald-500")} />
                               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                                 {percent.toFixed(1)}% Tổng {isExpense ? "Chi" : "Thu"}
                               </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={cn(
                              "text-2xl font-black block leading-none tracking-tighter font-money",
                              isExpense
                                ? "text-rose-600"
                                : "text-emerald-600",
                            )}
                          >
                            {isExpense ? "-" : "+"}
                            {item.totalAmount.toLocaleString()}đ
                          </span>
                        </div>
                      </div>

                      {/* PROGRESS BAR - PREMIUM GRADIENT */}
                      <div className="w-full h-4 bg-muted/50 rounded-full overflow-hidden p-1 border border-border/20 shadow-inner">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-1000 ease-out shadow-lg group-hover:brightness-110",
                            isExpense
                              ? "bg-gradient-to-r from-rose-600 via-pink-500 to-rose-400"
                              : "bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400",
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
