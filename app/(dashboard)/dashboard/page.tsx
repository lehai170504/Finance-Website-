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
  BrainCircuit,
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

    const total = totalIncome + totalExpense;
    const score = total > 0 ? (totalIncome / total) * 100 : 100;

    return { totalDebt: debt, healthScore: score };
  }, [wallets, totalIncome, totalExpense]);

  if (isProfileLoading || isWalletsLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-[70vh] gap-8">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-spin border-t-primary" />
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm font-black text-primary uppercase tracking-[0.6em] animate-pulse">
            Homie Finance
          </span>
          <span className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">
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
    <div className="relative flex-1 w-full max-w-7xl mx-auto p-4 md:p-10 flex flex-col space-y-16 font-sans mb-40 overflow-x-hidden">
      {/* Decorative Gradients */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none opacity-50" />
      <div className="fixed bottom-0 left-0 -z-10 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none opacity-50" />

      {/* HEADER SECTION */}
      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-10 animate-in fade-in slide-in-from-top-6 duration-1000 ease-out">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 shadow-sm shadow-primary/5">
              <Sparkles size={14} className="text-primary animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-wider text-primary">
                Smart Dashboard
              </span>
            </div>
            <div className="h-px w-12 bg-border/40" />
            <span className="text-[11px] font-bold text-muted-foreground/30 uppercase tracking-widest">
              v2.5 Release
            </span>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              Chào,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-emerald-500 animate-gradient-x">
                {user.username}
              </span>
            </h1>
            <p className="text-muted-foreground/60 font-medium text-lg md:text-xl max-w-2xl leading-relaxed">
              Phân tích tài chính cá nhân của bạn đã được cập nhật. Homie sẵn sàng hỗ trợ bạn tối ưu hóa chi tiêu!
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => setIsQuickCreateOpen(true)}
            size="lg"
            className="group relative overflow-hidden rounded-2xl font-black uppercase text-[12px] tracking-widest px-10 h-16 shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all bg-primary"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative flex items-center gap-3">
              Ghi chép mới <Plus size={20} strokeWidth={3} />
            </span>
          </Button>
          <Link href="/wallets">
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl font-black uppercase text-[12px] tracking-widest px-10 h-16 border-2 border-primary/10 bg-card/40 hover:bg-primary/5 hover:border-primary/20 transition-all active:scale-95 backdrop-blur-xl"
            >
              Xem ví <Wallet size={18} className="ml-2 opacity-70" />
            </Button>
          </Link>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200 ease-out">
        {[
          {
            title: "Tài sản hiện có",
            amount: totalBalance,
            icon: Wallet,
            gradient: "from-blue-500/10 to-primary/10",
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "group-hover:border-blue-500/40",
            link: "/wallets",
            text: "Quản lý dòng tiền",
          },
          {
            title: "Thu nhập tháng này",
            amount: totalIncome,
            icon: ArrowUpRight,
            gradient: "from-emerald-500/10 to-teal-500/10",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "group-hover:border-emerald-500/40",
            link: "/reports",
            text: "Lịch sử thu nhập",
          },
          {
            title: "Đã chi tháng này",
            amount: totalExpense,
            icon: ArrowDownRight,
            gradient: "from-rose-500/10 to-destructive/10",
            color: "text-rose-500",
            bg: "bg-rose-500/10",
            border: "group-hover:border-rose-500/40",
            link: "/reports",
            text: "Phân tích chi tiêu",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className={cn(
              "group relative p-8 border-2 border-white/5 rounded-[3rem] bg-card/30 backdrop-blur-2xl flex flex-col justify-between shadow-2xl transition-all duration-700 hover:-translate-y-2 overflow-hidden",
              card.border
            )}
          >
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700", card.gradient)} />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-10">
                <div className={cn("p-4 rounded-2xl border-2 border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-500", card.bg, card.color)}>
                  <card.icon size={26} strokeWidth={2.5} />
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground/40">
                    {card.title}
                  </span>
                  <div className={cn("w-8 h-1 rounded-full mt-2 ml-auto transition-all duration-500 group-hover:w-16", idx === 0 ? "bg-blue-500" : idx === 1 ? "bg-emerald-500" : "bg-rose-500")} />
                </div>
              </div>
              <p className="text-5xl font-black tracking-tighter flex items-baseline gap-2">
                {card.amount.toLocaleString()}
                <span className="text-lg font-bold opacity-20">đ</span>
              </p>
            </div>
            
            <Link
              href={card.link}
              className="relative z-10 mt-12 text-[11px] font-black uppercase tracking-widest text-muted-foreground/40 hover:text-foreground flex items-center gap-3 group/link transition-colors"
            >
              <span className="border-b-2 border-transparent group-hover/link:border-current transition-all pb-0.5">{card.text}</span>
              <ChevronRight
                size={14}
                strokeWidth={3}
                className="group-hover/link:translate-x-2 transition-transform"
              />
            </Link>
          </div>
        ))}
      </div>

      {/* ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 flex flex-col gap-10">
          <div className="animate-in fade-in slide-in-from-left-10 duration-1000 delay-300 ease-out">
            <CashFlowChart />
          </div>

          <div className="p-10 md:p-12 border-2 border-white/5 rounded-[3.5rem] bg-card/30 backdrop-blur-3xl shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 ease-out">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/10 blur-[120px] rounded-full" />
            
            <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-16">
              <div className="flex items-center gap-6">
                <div className="p-5 bg-primary/10 rounded-[1.5rem] text-primary border-2 border-primary/20 shadow-2xl shadow-primary/20">
                  <PieChart size={30} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-3xl font-black tracking-tight text-foreground/90 uppercase">
                    Cơ cấu chi tiêu
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Activity size={14} className="text-primary animate-pulse" />
                    <p className="text-[11px] font-black text-muted-foreground/40 uppercase tracking-[0.2em]">
                      Phân tích danh mục tháng này
                    </p>
                  </div>
                </div>
              </div>
              <Link href="/reports">
                <Button variant="ghost" className="rounded-2xl font-black uppercase text-[11px] tracking-widest px-6 h-12 bg-white/5 border border-white/10 hover:bg-primary hover:text-white transition-all group">
                  Xem báo cáo <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {isLoadingStats ? (
              <div className="py-32 text-center flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/30">
                  Đang xử lý dữ liệu...
                </span>
              </div>
            ) : expenseStats.length === 0 ? (
              <div className="py-24 text-center border-2 border-dashed rounded-[3rem] border-white/5 bg-white/5 flex flex-col items-center gap-8">
                <TrendingUp size={48} className="text-muted-foreground/10" strokeWidth={1} />
                <p className="text-sm font-bold text-muted-foreground/30 uppercase tracking-[0.2em] italic max-w-xs leading-relaxed">
                  Homie chưa có chi tiêu nào trong tháng này.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 items-center gap-16 lg:gap-24 relative z-10">
                {/* SVG DONUT CHART - LEFT/TOP */}
                <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full animate-pulse" />
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 relative z-10">
                    <defs>
                      <filter id="shadow-donut-v2" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="2" floodOpacity="0.4"/>
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
                          strokeWidth="11"
                          strokeDasharray={dashArray}
                          strokeDashoffset={dashOffset}
                          strokeLinecap="round"
                          filter="url(#shadow-donut-v2)"
                          className="transition-all duration-1000 ease-in-out hover:stroke-width-[14] cursor-pointer"
                        />
                      );
                    })}
                  </svg>

                  {/* Centered Text Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                    <div className="flex flex-col items-center justify-center bg-card/80 backdrop-blur-2xl w-40 h-40 rounded-full border-2 border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
                      <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">
                        Tổng chi
                      </span>
                      <span className="text-3xl md:text-4xl font-black tracking-tighter text-rose-500">
                        {totalExpense >= 1000000
                          ? `${(totalExpense / 1000000).toFixed(1)}M`
                          : `${(totalExpense / 1000).toFixed(0)}K`}
                      </span>
                    </div>
                  </div>
                </div>

                    {/* CATEGORY LIST - RIGHT/BOTTOM */}
                <div className="flex-1 w-full max-h-[420px] overflow-y-auto pr-2 custom-scrollbar-premium scroll-smooth">
                  <div className="grid grid-cols-1 gap-3">
                    {expenseStats.map((item: any, index: number) => {
                      const color = CHART_COLORS[index % CHART_COLORS.length];
                      const percent = ((item.totalAmount / totalExpense) * 100).toFixed(1);
                      return (
                        <div
                          key={index}
                          className="group flex items-center justify-between py-3 px-5 border border-white/5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/10 transition-all duration-500 hover:translate-x-1"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-3 h-3 rounded-full shadow-2xl transition-all duration-700 group-hover:scale-125"
                              style={{ backgroundColor: color, boxShadow: `0 0 15px ${color}80` }}
                            />
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-[12px] font-black text-foreground/70 tracking-tight uppercase group-hover:text-foreground transition-colors">
                                  {item.categoryName}
                                </span>
                                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-white/5 text-muted-foreground/60 group-hover:text-foreground transition-colors" style={{ color: `${color}cc` }}>
                                  {percent}%
                                </span>
                              </div>
                              <div className="h-0.5 w-16 bg-white/5 rounded-full mt-1 overflow-hidden">
                                <div className="h-full rounded-full transition-all duration-1000 delay-300" style={{ width: `${percent}%`, backgroundColor: color }} />
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[15px] font-black tracking-tighter text-foreground/90">
                              {item.totalAmount.toLocaleString()}đ
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 flex flex-col gap-10 animate-in fade-in slide-in-from-right-10 duration-1000 delay-400 ease-out">
          <SavingsGoalsCard />
          
          <div className="p-10 border-2 border-white/5 rounded-[3rem] bg-card/30 backdrop-blur-3xl shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-600 ease-out relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                <Activity size={120} strokeWidth={1} />
             </div>
             
             <div className="flex items-center gap-4 mb-10">
                <div className="p-3.5 bg-emerald-500/10 rounded-2xl text-emerald-500 border-2 border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                  <Activity size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-foreground/90">Sức khỏe tài chính</h3>
                  <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mt-1">Phân tích chuyên sâu</p>
                </div>
             </div>

             <div className="space-y-8 relative z-10">
                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <p className="text-[11px] font-black text-muted-foreground/30 uppercase tracking-widest">Dư nợ hiện tại</p>
                      <p className="text-3xl font-black tracking-tighter text-foreground">
                        {totalDebt.toLocaleString()}<span className="text-xs ml-1 opacity-20">đ</span>
                      </p>
                   </div>
                   <div className="text-right space-y-2">
                      <p className="text-[11px] font-black text-muted-foreground/30 uppercase tracking-widest">Chỉ số an toàn</p>
                      <p className={cn("text-3xl font-black tracking-tighter", healthScore > 50 ? "text-emerald-500" : "text-amber-500")}>
                        {healthScore.toFixed(0)}%
                      </p>
                   </div>
                </div>
                
                <div className="space-y-3">
                   <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
                      <span>Rủi ro</span>
                      <span>An toàn</span>
                   </div>
                   <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border-2 border-white/5 p-0.5 shadow-inner">
                      <div 
                        className={cn("h-full rounded-full transition-all duration-1500 cubic-bezier(0.34, 1.56, 0.64, 1)", healthScore > 50 ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]")}
                        style={{ width: `${healthScore}%` }} 
                      />
                   </div>
                </div>

                <div className="p-6 rounded-[2rem] bg-gradient-to-br from-white/5 to-transparent border-2 border-white/5 relative group/advice overflow-hidden">
                   <div className="absolute top-0 right-0 -mr-4 -mt-4 p-6 opacity-[0.05] group-hover/advice:scale-125 transition-transform duration-700">
                      <Sparkles size={40} className="text-primary" />
                   </div>
                   <div className="flex items-center gap-3 mb-4">
                      <BrainCircuit size={16} className="text-primary" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">Cố vấn AI nói rằng:</span>
                   </div>
                   <p className="text-[12px] font-bold text-muted-foreground/70 leading-relaxed italic line-clamp-4 group-hover/advice:line-clamp-none transition-all duration-500">
                      {aiAdvice?.data?.advice || "Đang kết nối với bộ não trung tâm để đưa ra lời khuyên phù hợp nhất cho homie..."}
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
