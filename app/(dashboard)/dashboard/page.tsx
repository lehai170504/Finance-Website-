"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const CHART_COLORS = [
  "#0088ff", // Azure
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#6366f1", // Blue
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#f43f5e", // Rose
];

export default function DashboardPage() {
  const router = useRouter();
  const { data: user, isLoading: isProfileLoading } = useProfile();
  const { totalBalance, isLoading: isWalletsLoading } = useWallets();

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
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  if (isProfileLoading || isWalletsLoading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-[60vh] gap-4 font-sans">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <span className="text-[10px] font-black text-primary tracking-[0.3em] uppercase animate-pulse">
          Đang đồng bộ dữ liệu...
        </span>
      </div>
    );
  }

  if (!user) return null;

  const expenseStats =
    stats?.filter((s: any) => s.categoryType === "EXPENSE") || [];
  const incomeStats =
    stats?.filter((s: any) => s.categoryType === "INCOME") || [];

  const totalExpense = expenseStats.reduce(
    (sum: number, item: any) => sum + item.totalAmount,
    0,
  );
  const totalIncome = incomeStats.reduce(
    (sum: number, item: any) => sum + item.totalAmount,
    0,
  );

  let cumulativePercent = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 mt-6 md:mt-10 flex flex-col space-y-14 font-sans mb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles size={20} strokeWidth={2.5} />
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">
              Hệ thống đã sẵn sàng
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-tight">
            Chào,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-emerald-500 animate-gradient-x">
              {user.username}
            </span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg md:text-xl">
            Tài chính của homie hôm nay có biến động gì không?
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={() => setIsQuickCreateOpen(true)}
            size="lg"
            className="rounded-2xl font-black uppercase text-[11px] tracking-widest px-8 h-14 shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
          >
            Ghi chép nhanh <Plus size={18} strokeWidth={3} className="ml-2" />
          </Button>
          <Link href="/wallets">
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl font-black uppercase text-[11px] tracking-widest px-8 h-14 border-2 border-border/50 hover:bg-muted/50 transition-all active:scale-95"
            >
              Ví cá nhân <Wallet size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
        {/* CARD TỔNG SỐ DƯ */}
        <div className="p-8 border-2 border-border/40 rounded-[2.5rem] bg-card/50 backdrop-blur-md flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-2xl hover:border-primary/30 transition-all duration-500 hover:-translate-y-2">
          <div className="absolute -top-24 -right-24 w-56 h-56 bg-primary/10 rounded-full blur-[80px] group-hover:bg-primary/20 transition-all duration-700" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/10 shadow-inner">
                <Wallet size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">
                Tổng số dư ví
              </span>
            </div>
            <p className="text-4xl md:text-5xl font-black tracking-tighter font-money">
              {totalBalance.toLocaleString()}
              <span className="text-lg ml-1 opacity-40">đ</span>
            </p>
          </div>
          <Link
            href="/wallets"
            className="relative z-10 mt-10 text-[10px] font-black uppercase text-primary tracking-widest hover:underline flex items-center gap-2 group/link"
          >
            Quản lý dòng tiền{" "}
            <ArrowRight
              size={14}
              strokeWidth={3}
              className="group-hover/link:translate-x-1.5 transition-transform"
            />
          </Link>
        </div>

        {/* CARD THU NHẬP */}
        <div className="p-8 border-2 border-border/40 rounded-[2.5rem] bg-card/50 backdrop-blur-md flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-2xl hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2">
          <div className="absolute -top-24 -right-24 w-56 h-56 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-700" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/10 shadow-inner">
                <ArrowUpRight size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">
                Thu nhập tháng này
              </span>
            </div>
            <p className="text-4xl md:text-5xl font-black tracking-tighter text-emerald-600 font-money">
              {totalIncome.toLocaleString()}
              <span className="text-lg ml-1 opacity-40 italic">đ</span>
            </p>
          </div>
          <Link
            href="/reports"
            className="relative z-10 mt-10 text-[10px] font-black text-muted-foreground/60 hover:text-foreground uppercase tracking-widest flex items-center gap-2 transition-all group/link"
          >
            Lịch sử thu nhập{" "}
            <ArrowRight
              size={14}
              strokeWidth={3}
              className="group-hover/link:translate-x-1.5 transition-transform"
            />
          </Link>
        </div>

        {/* CARD CHI TIÊU */}
        <div className="p-8 border-2 border-border/40 rounded-[2.5rem] bg-card/50 backdrop-blur-md flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-2xl hover:border-destructive/30 transition-all duration-500 hover:-translate-y-2">
          <div className="absolute -top-24 -right-24 w-56 h-56 bg-destructive/10 rounded-full blur-[80px] group-hover:bg-destructive/20 transition-all duration-700" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-destructive/10 rounded-2xl text-destructive border border-destructive/10 shadow-inner">
                <ArrowDownRight size={20} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/80">
                Chi tiêu tháng này
              </span>
            </div>
            <p className="text-4xl md:text-5xl font-black tracking-tighter text-destructive font-money">
              {totalExpense.toLocaleString()}
              <span className="text-lg ml-1 opacity-40 italic">đ</span>
            </p>
          </div>
          <Link
            href="/reports"
            className="relative z-10 mt-10 text-[10px] font-black text-muted-foreground/60 hover:text-foreground uppercase tracking-widest flex items-center gap-2 transition-all group/link"
          >
            Phân tích chi tiêu{" "}
            <ArrowRight
              size={14}
              strokeWidth={3}
              className="group-hover/link:translate-x-1.5 transition-transform"
            />
          </Link>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="p-8 md:p-12 border-2 border-border/40 rounded-[3rem] bg-card shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-border/40 pb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-primary/10 rounded-2xl text-primary border border-primary/20">
              <PieChart size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                Cơ cấu tài chính
              </h2>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
                Phân tích danh mục tháng này
              </p>
            </div>
          </div>
          <Link
            href="/reports"
            className="text-[11px] font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2 group border-2 border-primary/10 px-5 py-2.5 rounded-full hover:bg-primary hover:text-white transition-all"
          >
            Báo cáo chi tiết{" "}
            <ArrowRight
              size={14}
              strokeWidth={3}
              className="group-hover:translate-x-1.5 transition-transform"
            />
          </Link>
        </div>

        {isLoadingStats ? (
          <div className="py-32 text-center flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
              Đang tổng hợp dữ liệu...
            </span>
          </div>
        ) : expenseStats.length === 0 ? (
          <div className="py-24 text-center border-4 border-dashed rounded-[2.5rem] border-muted/20 bg-muted/5 flex flex-col items-center gap-4">
            <TrendingUp
              size={48}
              className="text-muted-foreground/20"
              strokeWidth={1.5}
            />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 italic px-6 text-center leading-relaxed">
              "Sạch bóng quân thù" - Tháng này homie chưa có dữ liệu chi tiêu.
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center gap-16 justify-center relative z-10 px-4">
            {/* SVG DONUT CHART */}
            <div className="relative w-64 h-64 md:w-72 md:h-72 shrink-0 drop-shadow-2xl">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full transform -rotate-90"
              >
                {expenseStats.map((item: any, index: number) => {
                  const percent = (item.totalAmount / totalExpense) * 100;
                  const dashArray = `${(percent * circumference) / 100} ${circumference}`;
                  const dashOffset = -(
                    (cumulativePercent * circumference) /
                    100
                  );
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
                      strokeWidth="14"
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-in-out hover:stroke-width-[16] cursor-pointer"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-background/20 rounded-full backdrop-blur-[1px]">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                  Tổng chi
                </span>
                <span className="text-3xl font-black tracking-tighter text-destructive mt-1 font-money">
                  {totalExpense >= 1000000
                    ? `${(totalExpense / 1000000).toFixed(1)}M`
                    : `${(totalExpense / 1000).toFixed(0)}K`}
                </span>
              </div>
            </div>

            {/* LIST CHÚ THÍCH */}
            <div className="flex-1 w-full max-w-md space-y-4">
              {expenseStats.map((item: any, index: number) => {
                const color = CHART_COLORS[index % CHART_COLORS.length];
                const percent = (
                  (item.totalAmount / totalExpense) *
                  100
                ).toFixed(1);
                return (
                  <div
                    key={index}
                    className="group flex items-center justify-between p-4 border border-border/40 rounded-2xl bg-muted/10 hover:bg-muted/30 transition-all hover:scale-[1.02] cursor-default shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className="w-4 h-4 rounded-lg shadow-sm transition-transform group-hover:scale-125"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-black uppercase tracking-tight text-foreground/80">
                        {item.categoryName}
                      </span>
                    </div>
                    <div className="text-right flex flex-col leading-none">
                      <span className="text-base font-black font-money">
                        {item.totalAmount.toLocaleString()}đ
                      </span>
                      <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest mt-1.5">
                        {percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* FLOATING ACTION BUTTON */}
      <Button
        onClick={() => setIsQuickCreateOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/50 hover:scale-110 hover:-rotate-6 active:scale-95 transition-all duration-500 z-50 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <Plus size={32} strokeWidth={3} className="relative z-10" />
        <span className="absolute right-20 bg-foreground text-background text-[11px] font-black px-5 py-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-2xl border border-border/20 backdrop-blur-xl">
          Ghi chép siêu tốc 🚀
        </span>
      </Button>

      {/* MODAL */}
      <QuickTransactionModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
      />
    </div>
  );
}
