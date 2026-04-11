import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  className?: string;
}

export function SummaryCard({
  title,
  amount,
  icon,
  className,
}: SummaryCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden p-6 border-2 border-border/40 rounded-3xl bg-card flex items-center gap-5 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5",
        className,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

      <div className="relative z-10 p-4 bg-background/80 backdrop-blur-xl rounded-2xl shadow-sm border border-border/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
        {icon}
      </div>

      <div className="relative z-10 flex flex-col justify-center">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/80 leading-none mb-2">
          {title}
        </p>
        <p className="text-3xl font-black tracking-tighter text-foreground font-money flex items-baseline gap-1">
          {amount.toLocaleString()}
          <span className="text-sm font-black opacity-40">đ</span>
        </p>
      </div>
    </div>
  );
}
