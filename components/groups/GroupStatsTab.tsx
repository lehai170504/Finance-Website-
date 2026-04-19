"use client";

import { PieChart, Calendar, User, Tag, TrendingDown, Sparkles, Activity } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function GroupStatsTab({
  stats,
  isLoading,
  month,
  setMonth,
  year,
  setYear,
}: any) {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-20">
      
      {/* FILTER BAR - PREMIUM GLASS */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-6 p-6 rounded-[2.5rem] bg-muted/20 border-2 border-border/40 backdrop-blur-md shadow-inner">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
            <PieChart size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/80">
              Phân tích chi tiêu
            </h2>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
              Dữ liệu nhóm định kỳ
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={month.toString()}
            onValueChange={(val) => setMonth(Number(val))}
          >
            <SelectTrigger className="h-12 sm:w-40 rounded-2xl bg-background border-2 border-border/60 font-black text-[11px] uppercase tracking-widest shadow-sm">
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-2">
              {[...Array(12)].map((_, i) => (
                <SelectItem
                  key={i + 1}
                  value={(i + 1).toString()}
                  className="text-[10px] font-black uppercase py-3"
                >
                  Tháng {i + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative sm:w-32">
            <Input
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="h-12 pl-10 font-money text-[12px] font-bold uppercase rounded-2xl border-2 border-border/60 bg-background shadow-sm"
            />
            <Calendar
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-40 flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity size={20} className="text-primary animate-pulse" />
            </div>
          </div>
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary/70 animate-pulse">
            Đang phân tích dữ liệu...
          </span>
        </div>
      ) : !stats || stats.totalExpense === 0 ? (
        <div className="py-32 text-center border-2 border-dashed rounded-[3.5rem] border-border/40 bg-muted/5 flex flex-col items-center gap-6 group hover:border-primary/20 transition-all duration-500">
           <div className="p-8 bg-muted/20 rounded-full text-muted-foreground/10 group-hover:text-primary/10 transition-colors">
              <PieChart size={64} strokeWidth={1} />
           </div>
           <div className="space-y-2">
              <p className="text-xl font-black uppercase tracking-tighter text-muted-foreground/60">"Sạch bóng quân thù"</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 italic">
                Chưa có bất kỳ khoản chi nào trong thời gian này
              </p>
           </div>
        </div>
      ) : (
        <>
          {/* TOTAL EXPENSE HERO - MEGA CARD */}
          <div className="relative group overflow-hidden p-12 md:p-16 border-2 rounded-[4rem] bg-card border-rose-500/10 text-center shadow-2xl shadow-rose-500/5 transition-all duration-500 hover:border-rose-500/20">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-rose-500/[0.03] rounded-full blur-[100px] transition-all group-hover:scale-125 pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/[0.03] rounded-full blur-[100px] transition-all group-hover:scale-125 pointer-events-none" />
            
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-rose-500/5 border border-rose-500/10">
                <TrendingDown size={16} className="text-rose-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-600/70">
                   Tổng chi tiêu nhóm • Tháng {month}
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <p className="text-6xl md:text-9xl font-black text-rose-600 tracking-tighter font-money drop-shadow-sm">
                  {stats.totalExpense.toLocaleString()}
                </p>
                <span className="text-3xl md:text-5xl font-black text-rose-600/20 font-money">VNĐ</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                 <Sparkles size={12} className="text-amber-500" />
                 <span>Mọi khoản chi đều được minh bạch</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* CATEGORY BREAKDOWN */}
            <div className="p-8 md:p-10 border-2 border-border/40 rounded-[3rem] bg-card/40 backdrop-blur-md shadow-xl shadow-black/5 relative overflow-hidden group/cat">
              <div className="flex items-center justify-between mb-10 border-b border-border/40 pb-6 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                      <Tag size={20} strokeWidth={2.5} />
                   </div>
                   <h3 className="text-base font-black uppercase tracking-tight text-foreground">
                      Phân rã danh mục
                   </h3>
                </div>
                <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                   Top Chi
                </div>
              </div>

              <div className="space-y-10 relative z-10">
                {Object.entries(stats.statsByCategory || {}).map(
                  ([cat, amount]: any, index) => {
                    const percent = (amount / stats.totalExpense) * 100;
                    return (
                      <div key={cat} className="group cursor-default">
                        <div className="flex justify-between items-end mb-4 px-1">
                          <div className="flex flex-col">
                             <span className="text-sm font-black uppercase tracking-tight text-foreground/80 group-hover:text-primary transition-colors">
                               {cat}
                             </span>
                          </div>
                          <div className="text-right">
                             <span className="text-base font-black font-money text-rose-600 tracking-tighter">
                               {amount.toLocaleString()}đ
                             </span>
                             <span className="text-[9px] font-money font-bold text-muted-foreground/40 ml-2">
                               {percent.toFixed(1)}%
                             </span>
                          </div>
                        </div>
                        <div className="h-4 w-full bg-muted/50 rounded-full overflow-hidden p-1 border border-border/20 shadow-inner">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-1000 ease-out shadow-lg",
                              index === 0 ? "bg-gradient-to-r from-rose-600 via-rose-500 to-rose-400" :
                              index === 1 ? "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400" :
                              "bg-gradient-to-r from-primary via-blue-500 to-cyan-400"
                            )}
                            style={{
                              width: `${percent}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {/* USER CONTRIBUTION */}
            <div className="p-8 md:p-10 border-2 border-border/40 rounded-[3rem] bg-card/40 backdrop-blur-md shadow-xl shadow-black/5 relative overflow-hidden group/users">
              <div className="flex items-center justify-between mb-10 border-b border-border/40 pb-6 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-600 border border-amber-500/20">
                      <User size={20} strokeWidth={2.5} />
                   </div>
                   <h3 className="text-base font-black uppercase tracking-tight text-foreground">
                      Bảng xếp hạng chi
                   </h3>
                </div>
                <div className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                   {Object.keys(stats.statsByUser || {}).length} Homies
                </div>
              </div>

              <div className="space-y-5 relative z-10">
                {Object.entries(stats.statsByUser || {}).map(
                  ([user, amount]: any, index) => {
                    const userPercent = (amount / stats.totalExpense) * 100;
                    return (
                      <div
                        key={user}
                        className="group flex justify-between items-center p-5 border-2 border-border/30 hover:border-primary/40 hover:bg-background/80 rounded-[2rem] transition-all duration-500 hover:shadow-2xl hover:shadow-black/5"
                      >
                        <div className="flex items-center gap-5">
                          <div className={cn(
                             "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border-2 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg",
                             index === 0 ? "bg-amber-500 text-white border-amber-400 shadow-amber-500/20" : 
                             "bg-muted/50 text-muted-foreground border-border/40"
                          )}>
                            {index === 0 ? "🏆" : user.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-black uppercase tracking-widest text-foreground/80 group-hover:text-primary transition-colors">
                               {user}
                             </span>
                             <div className="flex items-center gap-2 mt-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
                                <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-tighter">
                                   Chiếm {userPercent.toFixed(1)}% hóa đơn
                                </span>
                             </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-black text-rose-600 font-money tracking-tighter">
                            {amount.toLocaleString()}đ
                          </p>
                        </div>
                      </div>
                    )
                  },
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
