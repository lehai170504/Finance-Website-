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
} from "lucide-react";

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
      <div className="flex-1 flex flex-col justify-center items-center mt-20 gap-4">
        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
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
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 mt-4 md:mt-8 flex flex-col space-y-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none">
            CHÀO,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-500">
              {user.username}
            </span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg flex items-center gap-2">
            Hôm nay tình hình tài chính của homie thế nào?
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setIsQuickCreateOpen(true)}
            className="rounded-xl font-black uppercase text-[11px] tracking-widest px-6 h-12 shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
          >
            Tạo nhanh <Plus size={16} className="ml-2" />
          </Button>
          <Link href="/wallets">
            <Button
              variant="outline"
              className="rounded-xl font-black uppercase text-[11px] tracking-widest px-6 h-12 border-2 hover:bg-primary/5"
            >
              Ví của tôi <Wallet size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* CÁC THẺ THỐNG KÊ */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        {/* THẺ TỔNG SỐ DƯ */}
        <div className="p-8 border-2 rounded-[2.5rem] bg-card flex flex-col justify-between shadow-sm border-primary/20 relative overflow-hidden group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <Wallet size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Tổng số dư ví
              </span>
            </div>
            <p className="text-4xl font-black tracking-tighter">
              {totalBalance.toLocaleString()}đ
            </p>
          </div>
          <Link
            href="/wallets"
            className="relative z-10 mt-8 text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1 group/link"
          >
            Chi tiết các ví{" "}
            <ArrowRight
              size={12}
              className="group-hover/link:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* THẺ THU NHẬP */}
        <div className="p-8 border-2 rounded-[2.5rem] bg-card flex flex-col justify-between shadow-sm border-emerald-500/20 relative overflow-hidden group hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-colors" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-500">
                <ArrowUpRight size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Tổng thu tháng này
              </span>
            </div>
            <p className="text-4xl font-black tracking-tighter text-emerald-600 dark:text-emerald-400">
              {totalIncome.toLocaleString()}đ
            </p>
          </div>
          <Link
            href="/reports"
            className="relative z-10 mt-8 text-[10px] font-bold text-muted-foreground hover:text-foreground uppercase flex items-center gap-1 transition-colors group/link"
          >
            Xem báo cáo thu{" "}
            <ArrowRight
              size={12}
              className="group-hover/link:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {/* THẺ CHI TIÊU */}
        <div className="p-8 border-2 rounded-[2.5rem] bg-card flex flex-col justify-between shadow-sm border-destructive/20 relative overflow-hidden group hover:shadow-xl hover:shadow-destructive/10 transition-all duration-300 hover:-translate-y-1">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-destructive/20 rounded-full blur-3xl group-hover:bg-destructive/30 transition-colors" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2.5 bg-destructive/10 rounded-xl text-destructive">
                <ArrowDownRight size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                Tổng chi tháng này
              </span>
            </div>
            <p className="text-4xl font-black tracking-tighter text-destructive">
              {totalExpense.toLocaleString()}đ
            </p>
          </div>
          <Link
            href="/reports"
            className="relative z-10 mt-8 text-[10px] font-bold text-muted-foreground hover:text-foreground uppercase flex items-center gap-1 transition-colors group/link"
          >
            Xem phân tích chi{" "}
            <ArrowRight
              size={12}
              className="group-hover/link:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>

      {/* KHU VỰC BIỂU ĐỒ - DONUT CHART */}
      <div className="p-8 border-2 rounded-[2.5rem] bg-card shadow-sm relative overflow-hidden">
        <div className="flex items-center justify-between mb-8 border-b pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <PieChart size={20} />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight">
              Cơ cấu chi tiêu tháng này
            </h2>
          </div>
          <Link
            href="/reports"
            className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-1 group"
          >
            Xem chi tiết{" "}
            <ArrowRight
              size={12}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>

        {isLoadingStats ? (
          <div className="py-20 text-center text-muted-foreground animate-pulse text-xs font-bold uppercase tracking-widest">
            Đang vẽ biểu đồ...
          </div>
        ) : expenseStats.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed rounded-[2rem] text-muted-foreground text-xs font-bold uppercase tracking-widest bg-muted/20">
            Tháng này homie chưa tiêu đồng nào!
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center gap-12 justify-center relative z-10">
            {/* SVG DONUT CHART */}
            <div className="relative w-64 h-64 shrink-0 drop-shadow-xl">
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
                      strokeWidth="15"
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-1000 ease-out hover:opacity-80 hover:stroke-width-[18] cursor-pointer"
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Tổng chi
                </span>
                <span className="text-2xl font-black tracking-tighter text-destructive mt-1">
                  {totalExpense >= 1000000
                    ? `${(totalExpense / 1000000).toFixed(1)}M`
                    : `${(totalExpense / 1000).toFixed(0)}K`}
                </span>
              </div>
            </div>

            {/* LIST CHÚ THÍCH */}
            <div className="flex-1 w-full max-w-sm space-y-3">
              {expenseStats.map((item: any, index: number) => {
                const color = CHART_COLORS[index % CHART_COLORS.length];
                const percent = (
                  (item.totalAmount / totalExpense) *
                  100
                ).toFixed(1);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3.5 border-2 rounded-2xl hover:bg-muted/30 transition-all hover:scale-[1.02] cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs font-bold uppercase tracking-wide">
                        {item.categoryName}
                      </span>
                    </div>
                    <div className="text-right flex flex-col">
                      <span className="text-sm font-black">
                        {item.totalAmount.toLocaleString()}đ
                      </span>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
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

      {/* FLOATING ACTION BUTTON (Nút tạo nhanh nổi góc màn hình) */}
      <Button
        onClick={() => setIsQuickCreateOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-[0_10px_40px_-10px_rgba(0,136,255,0.7)] hover:scale-110 active:scale-95 transition-all duration-300 z-50 group"
      >
        <Plus size={32} strokeWidth={3} />
        <span className="absolute right-20 bg-foreground text-background text-[10px] font-black px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 whitespace-nowrap pointer-events-none uppercase tracking-widest shadow-xl">
          Ghi chép nhanh
        </span>
      </Button>

      {/* MODAL TẠO NHANH */}
      <QuickTransactionModal
        isOpen={isQuickCreateOpen}
        onClose={() => setIsQuickCreateOpen(false)}
      />
    </div>
  );
}
