import { useReports } from "@/hooks/useReports";
import { TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CashFlowChart() {
  const [days, setDays] = useState(30);
  const { cashFlow, isLoadingCashFlow } = useReports(undefined, undefined, days);

  if (isLoadingCashFlow || cashFlow.length === 0) return null;

  // Logic vẽ biểu đồ SVG đơn giản
  const maxVal = Math.max(...cashFlow.map(d => Math.max(d.income, d.expense)), 1000000);
  const width = 800;
  const height = 200;
  const padding = 20;

  const pointsIncome = cashFlow.map((d, i) => ({
    x: (i / (cashFlow.length - 1)) * (width - padding * 2) + padding,
    y: height - (d.income / maxVal) * (height - padding * 2) - padding
  }));

  const pointsExpense = cashFlow.map((d, i) => ({
    x: (i / (cashFlow.length - 1)) * (width - padding * 2) + padding,
    y: height - (d.expense / maxVal) * (height - padding * 2) - padding
  }));

  const pathIncome = `M ${pointsIncome.map(p => `${p.x},${p.y}`).join(" L ")}`;
  const pathExpense = `M ${pointsExpense.map(p => `${p.x},${p.y}`).join(" L ")}`;

  return (
    <div className="p-8 md:p-12 border-2 border-border/40 rounded-[3rem] bg-card shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-blue-500/10 rounded-2xl text-blue-500 border border-blue-500/20">
            <TrendingUp size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Dòng tiền hệ thống</h2>
            <div className="flex items-center gap-2 mt-1">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={cn(
                    "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border transition-all",
                    days === d 
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                      : "bg-muted/50 text-muted-foreground border-border/40 hover:bg-muted"
                  )}
                >
                  {d} Ngày
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Thu nhập</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive shadow-lg shadow-destructive/50" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Chi tiêu</span>
          </div>
        </div>
      </div>

      <div className="relative h-[250px] w-full group">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Lưới ngang */}
          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <line key={p} x1={padding} y1={padding + p * (height - padding * 2)} x2={width - padding} y2={padding + p * (height - padding * 2)} 
              stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="text-border/30" />
          ))}

          {/* Đường thu nhập */}
          <path d={pathIncome} fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" 
            className="drop-shadow-[0_0_8px_rgba(16,185,129,0.3)] transition-all duration-500" />
          
          {/* Đường chi tiêu */}
          <path d={pathExpense} fill="none" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" 
            className="drop-shadow-[0_0_8px_rgba(244,63,94,0.3)] transition-all duration-500" />

          {/* Gradient thu nhập */}
          <path d={`${pathIncome} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`} 
            fill="url(#gradIncome)" className="opacity-10" />

          <defs>
            <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {/* Tooltip ảo/Overlay cho đẹp */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/5 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
