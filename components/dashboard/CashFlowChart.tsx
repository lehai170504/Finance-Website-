import { useReports } from "@/hooks/useReports";
import { TrendingUp, Calendar, Zap } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function CashFlowChart() {
  const [days, setDays] = useState(30);
  const { cashFlow, isLoadingCashFlow } = useReports(undefined, undefined, days);

  if (isLoadingCashFlow || cashFlow.length === 0) return null;

  const maxVal = Math.max(...cashFlow.map(d => Math.max(d.income, d.expense)), 1000000);
  const width = 1000;
  const height = 300;
  const padding = 40;

  const pointsIncome = cashFlow.map((d, i) => ({
    x: (i / (cashFlow.length - 1)) * (width - padding * 2) + padding,
    y: height - (d.income / maxVal) * (height - padding * 2) - padding
  }));

  const pointsExpense = cashFlow.map((d, i) => ({
    x: (i / (cashFlow.length - 1)) * (width - padding * 2) + padding,
    y: height - (d.expense / maxVal) * (height - padding * 2) - padding
  }));

  // Tạo đường cong Cubic Bezier mượt mà
  const getCurvePath = (points: {x: number, y: number}[]) => {
    if (points.length < 2) return "";
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const cp1x = (points[i].x + points[i + 1].x) / 2;
      path += ` C ${cp1x},${points[i].y} ${cp1x},${points[i + 1].y} ${points[i + 1].x},${points[i + 1].y}`;
    }
    return path;
  };

  const pathIncome = getCurvePath(pointsIncome);
  const pathExpense = getCurvePath(pointsExpense);

  return (
    <div className="relative overflow-hidden p-8 md:p-10 border border-white/10 rounded-[2.5rem] bg-gradient-to-br from-card/90 via-card/50 to-card/30 backdrop-blur-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 bg-purple-500/5 blur-[120px] rounded-full" />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-2xl" />
            <div className="relative p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/20">
              <TrendingUp size={28} strokeWidth={2} />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground/90">Dòng tiền hệ thống</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Real-time</span>
              </div>
              <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Calendar size={12} />
                Cập nhật lần cuối: Vừa xong
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 self-start lg:self-center bg-white/5 p-1.5 rounded-2xl border border-white/5 backdrop-blur-md">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={cn(
                "relative px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300",
                days === d 
                  ? "text-white" 
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
              )}
            >
              {days === d && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/25 animate-in fade-in zoom-in-95 duration-300" />
              )}
              <span className="relative z-10">{d} Ngày</span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-emerald-500/5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Zap size={16} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tổng thu nhập</span>
          </div>
          <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]" />
        </div>
        <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-destructive/5 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
              <Zap size={16} />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tổng chi tiêu</span>
          </div>
          <div className="w-3 h-3 rounded-full bg-destructive shadow-[0_0_12px_rgba(244,63,94,0.5)]" />
        </div>
      </div>

      <div className="relative h-[350px] w-full group overflow-visible pt-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible preserve-3d">
          <defs>
            <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Lưới ngang */}
          {[0, 0.25, 0.5, 0.75, 1].map((p) => (
            <line 
              key={p} 
              x1={padding} 
              y1={padding + p * (height - padding * 2)} 
              x2={width - padding} 
              y2={padding + p * (height - padding * 2)} 
              stroke="currentColor" 
              strokeWidth="0.5" 
              strokeDasharray="8 8" 
              className="text-white/10" 
            />
          ))}

          {/* Vùng gradient phủ dưới đường cong */}
          <path d={`${pathIncome} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`} 
            fill="url(#gradIncome)" className="animate-in fade-in duration-1000" />
          <path d={`${pathExpense} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`} 
            fill="url(#gradExpense)" className="animate-in fade-in duration-1000" />

          {/* Đường chi tiêu */}
          <path 
            d={pathExpense} 
            fill="none" 
            stroke="#f43f5e" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="drop-shadow-[0_0_10px_rgba(244,63,94,0.3)] opacity-60 hover:opacity-100 transition-opacity duration-300" 
          />
          
          {/* Đường thu nhập */}
          <path 
            d={pathIncome} 
            fill="none" 
            stroke="#10b981" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            filter="url(#glow)"
            className="drop-shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-500" 
          />

          {/* Các điểm dữ liệu cuối cùng */}
          {pointsIncome.length > 0 && (
            <circle cx={pointsIncome[pointsIncome.length - 1].x} cy={pointsIncome[pointsIncome.length - 1].y} r="6" fill="#10b981" className="animate-pulse shadow-lg" />
          )}
        </svg>

        <div className="absolute inset-0 bg-gradient-to-t from-card/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

