// components/common/SummaryCard.tsx
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
        "group relative overflow-hidden p-6 border-2 rounded-[2rem] flex items-center gap-5 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        className,
      )}
    >
      <div className="relative z-10 p-3.5 bg-background/60 backdrop-blur-md rounded-2xl shadow-sm border border-border/50 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      <div className="relative z-10 flex flex-col justify-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-1.5">
          {title}
        </p>
        <p className="text-3xl font-black tracking-tighter drop-shadow-sm text-foreground">
          {amount.toLocaleString()}đ
        </p>
      </div>
    </div>
  );
}
