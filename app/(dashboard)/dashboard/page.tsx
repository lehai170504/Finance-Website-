"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useProfile } from "@/hooks/useProfile";
import { useWallets } from "@/hooks/useWallets";
import { useReports } from "@/hooks/useReports";
import { Button } from "@/components/ui/button";
import { QuickTransactionModal } from "@/components/modals/QuickTransactionModal";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  PieChart,
  Plus,
  Sparkles,
  TrendingUp,
  Activity,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SavingsGoalsCard } from "@/components/dashboard/SavingsGoalsCard";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { useAi } from "@/hooks/useAi";

const CHART_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f43f5e", // rose
];

export default function DashboardPage() {
  const router = useRouter();
  const { data: user, isLoading: isProfileLoading } = useProfile();
  const { wallets, totalBalance, isLoading: isWalletsLoading } = useWallets();
  const { data: aiAdvice } = useAi();
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);

  const [startDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
  );
  const [endDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
      .toISOString()
      .split("T")[0],
  );

  const { stats, isLoadingStats } = useReports(startDate, endDate);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) router.push("/login");
  }, [router]);

  const { expenseStats, totalExpense, totalIncome } = useMemo(() => {
    const expenses =
      stats?.filter((s: any) => s.categoryType === "EXPENSE") || [];
    const incomes =
      stats?.filter((s: any) => s.categoryType === "INCOME") || [];

    return {
      expenseStats: expenses,
      totalExpense: expenses.reduce(
        (sum: number, item: any) => sum + item.totalAmount,
        0,
      ),
      totalIncome: incomes.reduce(
        (sum: number, item: any) => sum + item.totalAmount,
        0,
      ),
    };
  }, [stats]);

  const { totalDebt, healthScore } = useMemo(() => {
    const debt = wallets.reduce(
      (acc: number, w: any) => acc + (w.balance < 0 ? Math.abs(w.balance) : 0),
      0,
    );

    // Calculate a simple health score: (Income / (Income + Expense)) * 100
    const total = totalIncome + totalExpense;
    const score = total > 0 ? (totalIncome / total) * 100 : 100;

    return { totalDebt: debt, healthScore: score };
  }, [wallets, totalIncome, totalExpense]);

  if (isProfileLoading || isWalletsLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-[60vh] gap-6">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
          <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-primary uppercase tracking-[0.4em] animate-pulse">
            Homie Finance
          </span>
          <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-widest">
            Đang đồng bộ dữ liệu...
          </span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div className="relative flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 mt-4 md:mt-6 flex flex-col space-y-12 font-sans mb-32">
      {/* Decorative Background Elements */}
      <div className="fixed top-20 right-0 -mr-40 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-20 left-0 -ml-40 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles size={14} className="text-primary animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Hệ thống đã sẵn sàng
              </span>
            </div>
            <div className="h-px w-10 bg-border/40" />
            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
              Dash v2.0
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-none">
            Chào,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-emerald-500 animate-gradient-x">
              {user.username}
            </span>
          </h1>
          <p className="text-muted-foreground/80 font-medium text-lg md:text-xl max-w-2xl">
            Tài chính của homie hôm nay có biến động gì không? Bắt đầu ghi chép nhé!
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => setIsQuickCreateOpen(true)}
            size="lg"
            className="group relative overflow-hidden rounded-2xl font-bold uppercase text-[11px] tracking-widest px-8 h-14 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all bg-primary"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative flex items-center gap-2">
              Ghi chép nhanh <Plus size={18} strokeWidth={2.5} />
            </span>
          </Button>
          <Link href="/wallets">
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl font-bold uppercase text-[11px] tracking-widest px-8 h-14 border border-white/10 bg-white/5 hover:bg-white/10 transition-all active:scale-95 backdrop-blur-md"
            >
              Ví cá nhân <Wallet size={16} className="ml-2 opacity-60" />
            </Button>
          </Link>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        {[
          {
            title: "Tổng số dư ví",
            amount: totalBalance,
            icon: Wallet,
            gradient: "from-blue-500/20 to-primary/20",
            accent: "blue-500",
            link: "/wallets",
            text: "Quản lý dòng tiền",
          },
          {
            title: "Thu nhập tháng này",
            amount: totalIncome,
            icon: ArrowUpRight,
            gradient: "from-emerald-500/20 to-teal-500/20",
            accent: "emerald-500",
            link: "/reports",
            text: "Lịch sử thu nhập",
          },
          {
            title: "Chi tiêu tháng này",
            amount: totalExpense,
            icon: ArrowDownRight,
            gradient: "from-rose-500/20 to-destructive/20",
            accent: "destructive",
            link: "/reports",
            text: "Phân tích chi tiêu",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={cn(
              "group relative p-8 border border-white/10 rounded-[2.5rem] bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl flex flex-col justify-between shadow-xl transition-all duration-500 hover:-translate-y-1.5",
              idx === 0 ? "hover:border-blue-500/30" : idx === 1 ? "hover:border-emerald-500/30" : "hover:border-rose-500/30"
            )}
          >
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2.5rem]", card.gradient)} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className={cn("p-4 rounded-2xl bg-white/5 border border-white/5 text-foreground/80 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-500", 
                  idx === 0 ? "text-blue-500" : idx === 1 ? "text-emerald-500" : "text-rose-500"
                )}>
                  <card.icon size={22} strokeWidth={2} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                    {card.title}
                  </span>
                  <div className={cn("w-6 h-1 rounded-full mt-2 transition-all duration-500 group-hover:w-12", 
                    idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-emerald-500" : "bg-rose-500"
                  )} />
                </div>
              </div>
              <p className="text-4xl font-bold tracking-tighter flex items-baseline gap-1">
                {card.amount.toLocaleString()}
                <span className="text-sm font-medium opacity-30">đ</span>
              </p>
            </div>
            
            <Link
              href={card.link}
              className="relative z-10 mt-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 hover:text-foreground flex items-center gap-2 group/link transition-colors"
            >
              <span className="border-b border-transparent group-hover/link:border-current transition-all">{card.text}</span>
              <ChevronRight
                size={12}
                strokeWidth={3}
                className="group-hover/link:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* MAIN CONTENT GRID - 2:1 BALANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN - MAIN ANALYTICS */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="animate-in fade-in slide-in-from-left-8 duration-1000 delay-300">
            <CashFlowChart />
          </div>

          <div className="p-8 md:p-10 border border-white/10 rounded-[3rem] bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
            
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-primary/10 rounded-2xl text-primary border border-primary/20 shadow-lg shadow-primary/10">
                  <PieChart size={24} strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-foreground/90">
                    Cơ cấu tài chính
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Activity size={12} className="text-primary animate-pulse" />
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      Danh mục chi tiêu tháng
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/reports"
                className="text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 flex items-center gap-2 group shadow-lg shadow-black/5"
              >
                Báo cáo chi tiết{" "}
                <ArrowRight
                  size={14}
                  strokeWidth={2.5}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            {isLoadingStats ? (
              <div className="py-24 text-center flex flex-col items-center gap-6">
                <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                  Đang phân tích...
                </span>
              </div>
            ) : expenseStats.length === 0 ? (
              <div className="py-20 text-center border-2 border-dashed rounded-[2.5rem] border-white/5 bg-white/5 flex flex-col items-center gap-6">
                <TrendingUp size={40} className="text-muted-foreground/20" strokeWidth={1} />
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/40 italic max-w-xs mx-auto leading-relaxed px-6">
                  Tháng này homie chưa có dữ liệu chi tiêu để phân tích.
                </p>
              </div>
            ) : (
              <div className="flex flex-col xl:flex-row items-center justify-center gap-12 lg:gap-20 relative z-10">
                {/* SVG DONUT CHART */}
                <div className="relative w-64 h-64 md:w-72 md:h-72 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full" />
                  
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full transform -rotate-90 relative z-10"
                  >
                    <defs>
                      <filter id="shadow-donut" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodOpacity="0.3"/>
                      </filter>
                    </defs>
                    {expenseStats.map((item: any, index: number) => {
                      const percent = (item.totalAmount / totalExpense) * 100;
                      const dashArray = `${(percent * circumference) / 100} ${circumference}`;
                      const dashOffset = -((cumulativePercent * circumference) / 100);
                      cumulativePercent += percent;
                      const color = CHART_COLORS[index % CHART_COLORS.length];

                      return (
                        <circle
                          key={index}
                          cx="50"
                          cy="50"
                          r={radius}
                          fill="transparent"
                          stroke={color}
                          strokeWidth="12"
                          strokeDasharray={dashArray}
                          strokeDashoffset={dashOffset}
                          strokeLinecap="round"
                          filter="url(#shadow-donut)"
                          className="transition-all duration-700 ease-out hover:stroke-width-[15] cursor-pointer"
                        />
                      );
                    })}
                  </svg>

                  {/* Centered Text Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                    <div className="flex flex-col items-center justify-center bg-card/60 backdrop-blur-xl w-32 h-32 md:w-36 md:h-36 rounded-full border border-white/10 shadow-2xl shadow-black/20">
                      <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 text-center">
                        Tổng chi
                      </span>
                      <span className="text-2xl md:text-3xl font-bold tracking-tighter text-rose-500 mt-1">
                        {totalExpense >= 1000000
                          ? `${(totalExpense / 1000000).toFixed(1)}M`
                          : `${(totalExpense / 1000).toFixed(0)}K`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* LIST CHÚ THÍCH */}
                <div className="flex-1 w-full space-y-3.5 max-h-[350px] overflow-y-auto pr-4 custom-scrollbar">
                  {expenseStats.map((item: any, index: number) => {
                    const color = CHART_COLORS[index % CHART_COLORS.length];
                    const percent = ((item.totalAmount / totalExpense) * 100).toFixed(1);
                    return (
                      <div
                        key={index}
                        className="group flex items-center justify-between p-4 border border-white/5 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-[1.01] cursor-default shadow-md shadow-black/5"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-4 h-4 rounded-lg shadow-lg transition-transform group-hover:rotate-45"
                            style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}40` }}
                          />
                          <span className="text-[13px] font-bold text-foreground/80 group-hover:text-foreground">
                            {item.categoryName}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-[15px] font-bold tracking-tight">
                            {item.totalAmount.toLocaleString()}đ
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-1">
                            {percent}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            )}
          </div>
        </div>

        {/* RIGHT COLUMN - GOALS & ACTIONS */}
        <div className="lg:col-span-4 flex flex-col gap-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-400">
          <SavingsGoalsCard />
          
          <div className="p-8 border border-white/10 rounded-[2.5rem] bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl shadow-xl animate-in fade-in slide-in-from-right-8 duration-1000 delay-600">
             <div className="flex items-center gap-3 mb-6 text-primary">
                <Activity size={20} strokeWidth={2.5} />
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground/90">Sức khỏe tài chính</h3>
             </div>
             <div className="space-y-6">
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">Dư nợ hiện tại</p>
                      <p className="text-2xl font-bold tracking-tighter text-foreground">
                        {totalDebt.toLocaleString()}<span className="text-xs ml-0.5 opacity-40">đ</span>
                      </p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-1">Chỉ số an toàn</p>
                      <p className={cn("text-xl font-bold tracking-tighter", healthScore > 50 ? "text-emerald-500" : "text-amber-500")}>
                        {healthScore.toFixed(0)}%
                      </p>
                   </div>
                </div>
                
                <div className="space-y-2">
                   <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
                      <span>Rủi ro</span>
                      <span>An toàn</span>
                   </div>
                   <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className={cn("h-full transition-all duration-1000", healthScore > 50 ? "bg-emerald-500" : "bg-amber-500")}
                        style={{ width: `${healthScore}%` }} 
                      />
                   </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 relative group/advice">
                   <Sparkles size={14} className="absolute -top-2 -right-2 text-primary animate-pulse" />
                   <p className="text-[11px] text-muted-foreground/80 leading-relaxed italic line-clamp-3 group-hover:line-clamp-none transition-all">
                      {aiAdvice?.advice || "Đang lấy lời khuyên từ cố vấn AI..."}
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      <QuickTransactionModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
      />
    </div>
  );
}
