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

export function GroupStatsTab({
  stats,
  isLoading,
  month,
  setMonth,
  year,
  setYear,
}: any) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-muted/30 p-4 rounded-3xl border border-border/50 backdrop-blur-sm">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-primary/10 rounded-xl text-primary border border-primary/10">
            <PieChart size={18} />
          </div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground/80">
            Phân tích nhóm
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={month.toString()}
            onValueChange={(val) => setMonth(Number(val))}
          >
            <SelectTrigger className="h-10 sm:w-32 rounded-xl bg-background font-black text-[10px] uppercase tracking-widest border-2">
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
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

          <div className="relative sm:w-28">
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="h-10 pl-8 font-money text-[11px] font-bold uppercase rounded-xl border-2"
            />
            <Calendar
              size={12}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-32 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : !stats || stats.totalExpense === 0 ? (
        <div className="py-32 text-center border-2 border-dashed rounded-[3rem] border-muted/20 bg-muted/[0.02]">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 italic">
            "Sạch bóng quân thù" - Không có dữ liệu
          </p>
        </div>
      ) : (
        <>
          <div className="relative group overflow-hidden p-12 border-2 rounded-[3rem] bg-card border-destructive/10 text-center shadow-2xl shadow-destructive/5 transition-all">
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-destructive/[0.03] rounded-full blur-3xl transition-all group-hover:scale-110" />
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                <TrendingDown size={14} className="text-destructive" /> TỔNG CHI
                TIÊU THÁNG {month}
              </span>
              <p className="text-6xl md:text-8xl font-black text-destructive tracking-tighter font-money">
                {stats.totalExpense.toLocaleString()}
                <span className="text-2xl ml-2 opacity-40">đ</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-8 border-2 border-border/40 rounded-3xl bg-card/40 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-8 border-b border-border/40 pb-4">
                <Tag size={16} className="text-primary/70" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/70">
                  Phân rã danh mục
                </h3>
              </div>
              <div className="space-y-7">
                {Object.entries(stats.statsByCategory || {}).map(
                  ([cat, amount]: any, index) => {
                    const percent = (amount / stats.totalExpense) * 100;
                    return (
                      <div key={cat} className="space-y-2.5">
                        <div className="flex justify-between items-end px-1">
                          <span className="text-[10px] font-black uppercase text-foreground/80">
                            {cat}
                          </span>
                          <span className="text-xs font-bold font-money text-destructive">
                            {amount.toLocaleString()}đ
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-muted/50 rounded-full overflow-hidden border border-border/20">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-1000"
                            style={{
                              width: `${percent}%`,
                              opacity: 1 - index * 0.15,
                            }}
                          />
                        </div>
                        <p className="text-[9px] font-money font-bold text-muted-foreground/60 text-right">
                          {percent.toFixed(1)}%
                        </p>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            <div className="p-8 border-2 border-border/40 rounded-3xl bg-card/40 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-8 border-b border-border/40 pb-4">
                <User size={16} className="text-primary/70" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/70">
                  Homies đóng góp
                </h3>
              </div>
              <div className="space-y-4">
                {Object.entries(stats.statsByUser || {}).map(
                  ([user, amount]: any) => (
                    <div
                      key={user}
                      className="group flex justify-between items-center p-4 border border-border/40 hover:border-primary/30 hover:bg-background/80 rounded-2xl transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center font-black text-xs border border-primary/10 group-hover:scale-110 transition-transform">
                          {user.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-widest text-foreground/70 group-hover:text-primary">
                          {user}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-destructive font-money">
                          {amount.toLocaleString()}đ
                        </p>
                        <p className="text-[8px] font-black text-muted-foreground/50 uppercase tracking-tighter">
                          Đã chi
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
