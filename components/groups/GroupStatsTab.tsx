"use client";

import { PieChart, Calendar, User, Tag, TrendingDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface GroupStatsTabProps {
  stats: any;
  isLoading: boolean;
  month: number;
  setMonth: (month: number) => void;
  year: number;
  setYear: (year: number) => void;
}

export function GroupStatsTab({
  stats,
  isLoading,
  month,
  setMonth,
  year,
  setYear,
}: GroupStatsTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* HEADER & FILTER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/20 p-4 rounded-3xl border border-border/50">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <PieChart size={18} />
          </div>
          <h2 className="text-sm font-black uppercase tracking-widest text-foreground">
            Phân tích chi tiêu nhóm
          </h2>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={month.toString()}
            onValueChange={(val) => setMonth(Number(val))}
          >
            <SelectTrigger className="h-10 w-full sm:w-32 rounded-xl bg-background font-black text-[10px] uppercase tracking-widest border-2">
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent>
              {[...Array(12)].map((_, i) => (
                <SelectItem
                  key={i + 1}
                  value={(i + 1).toString()}
                  className="text-[10px] font-bold uppercase"
                >
                  Tháng {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full sm:w-28">
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="h-10 pl-8 font-black text-[10px] uppercase tracking-widest rounded-xl border-2"
            />
            <Calendar
              size={12}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-32 text-center flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">
            Đang tổng hợp dữ liệu...
          </span>
        </div>
      ) : !stats || stats.totalExpense === 0 ? (
        <div className="py-32 text-center border-4 border-dashed rounded-[3rem] border-muted/20 bg-muted/5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground italic">
            "Sạch bóng quân thù" - Tháng này chưa có chi tiêu nào.
          </p>
        </div>
      ) : (
        <>
          {/* TỔNG CHI TIÊU CARD */}
          <div className="relative group overflow-hidden p-10 border-2 rounded-[2.5rem] bg-card border-destructive/20 text-center shadow-xl shadow-destructive/5 transition-all hover:shadow-destructive/10">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-destructive/5 rounded-full blur-3xl group-hover:bg-destructive/10 transition-colors" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
                <TrendingDown size={14} className="text-destructive" />
                Tổng chi tiêu tháng {month}
              </span>
              <p className="text-5xl md:text-7xl font-black text-destructive tracking-tighter drop-shadow-sm">
                {stats.totalExpense.toLocaleString()}
                <span className="text-2xl ml-1 opacity-80 font-black">đ</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* CHI THEO DANH MỤC */}
            <div className="p-8 border-2 border-border/50 rounded-[2.5rem] bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-8 border-b border-border/50 pb-4">
                <Tag size={16} className="text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground">
                  Phân rã theo hạng mục
                </h3>
              </div>

              <div className="space-y-6">
                {Object.entries(stats.statsByCategory || {}).map(
                  ([cat, amount], index) => {
                    const percent =
                      ((amount as number) / stats.totalExpense) * 100;
                    return (
                      <div key={cat} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-[11px] font-black uppercase tracking-tight text-foreground">
                            {cat}
                          </span>
                          <span className="text-sm font-black text-destructive">
                            {(amount as number).toLocaleString()}đ
                          </span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary transition-all duration-1000 ease-out"
                            style={{
                              width: `${percent}%`,
                              opacity: 1 - index * 0.15,
                            }}
                          />
                        </div>
                        <p className="text-[9px] font-black text-muted-foreground uppercase text-right tracking-widest">
                          {percent.toFixed(1)}%
                        </p>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* CHI THEO THÀNH VIÊN */}
            <div className="p-8 border-2 border-border/50 rounded-[2.5rem] bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-8 border-b border-border/50 pb-4">
                <User size={16} className="text-primary" />
                <h3 className="text-xs font-black uppercase tracking-widest text-foreground">
                  Đóng góp của homies
                </h3>
              </div>

              <div className="space-y-4">
                {Object.entries(stats.statsByUser || {}).map(
                  ([user, amount]) => (
                    <div
                      key={user}
                      className="group flex justify-between items-center p-4 border-2 border-transparent hover:border-primary/20 hover:bg-background rounded-2xl transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs border border-primary/10">
                          {user.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-foreground/80 group-hover:text-primary transition-colors">
                          {user}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-destructive">
                          {(amount as number).toLocaleString()}đ
                        </p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">
                          Đã chi tháng này
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
