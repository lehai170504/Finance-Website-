"use client";

import { useAi } from "@/hooks/useAi";
import { 
  Sparkles, 
  BrainCircuit, 
  Quote, 
  RefreshCw, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle2,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function AiAdvisorCard() {
  const { data, isLoading, refetch, isFetching, error } = useAi();

  if (error) return null;

  // Hàm phát hiện "Mood" của AI để hiển thị Badge phù hợp
  const getBadges = (text: string = "") => {
    const badges = [];
    if (text.includes("⚠️") || text.includes("CẢNH BÁO")) {
      badges.push({ label: "Cảnh báo chi tiêu", color: "text-amber-500 bg-amber-500/10 border-amber-500/20", icon: AlertCircle });
    }
    if (text.includes("✅") || text.includes("🌟") || text.includes("PHONG ĐỘ")) {
      badges.push({ label: "Tài chính ổn định", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20", icon: CheckCircle2 });
    }
    if (text.includes("💡") || text.includes("GỢI Ý")) {
      badges.push({ label: "Mẹo tiết kiệm", color: "text-blue-500 bg-blue-500/10 border-blue-500/20", icon: Lightbulb });
    }
    return badges;
  };

  const badges = getBadges(data?.data?.advice);

  return (
    <div className="lg:col-span-3 p-8 md:p-12 border-2 border-primary/20 rounded-[3rem] bg-gradient-to-br from-primary/5 via-background to-blue-500/5 shadow-2xl shadow-primary/10 relative overflow-hidden group animate-in fade-in slide-in-from-bottom-10 duration-1000">
      {/* Background Decor - Brain Circuit lặn phía sau */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none">
        <BrainCircuit size={220} strokeWidth={1} />
      </div>

      <div className="flex flex-col md:flex-row gap-12 relative z-10">
        <div className="flex-1 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-primary text-white rounded-2xl shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform">
                <Sparkles size={24} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight">Cố vấn tài chính AI</h2>
                <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Hỗ trợ bởi Homie Intelligence</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => refetch()}
              disabled={isFetching || isLoading}
              className="rounded-full hover:bg-primary/10 text-primary font-black uppercase text-[9px] tracking-widest px-5 h-10 border border-primary/20 backdrop-blur-sm"
            >
              Làm mới <RefreshCw size={12} className={cn("ml-2", isFetching && "animate-spin")} />
            </Button>
          </div>

          <div className="relative">
            <Quote className="absolute -left-6 -top-4 text-primary/10" size={56} />
            <div className="min-h-[140px] flex items-center">
              {isLoading ? (
                <div className="space-y-4 w-full">
                  <div className="h-4 bg-primary/10 animate-pulse rounded-full w-[85%]" />
                  <div className="h-4 bg-primary/10 animate-pulse rounded-full w-full" />
                  <div className="h-4 bg-primary/10 animate-pulse rounded-full w-[60%]" />
                </div>
              ) : (
                <div className="space-y-6">
                  <p className="text-lg md:text-xl font-medium leading-relaxed text-foreground/90 whitespace-pre-line italic">
                    {data?.data?.advice}
                  </p>
                  
                  {/* Badges linh hoạt */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {badges.map((badge, idx) => (
                      <span key={idx} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border animate-in zoom-in duration-500", badge.color)}>
                        <badge.icon size={12} /> {badge.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Orbiting Graphic */}
        <div className="hidden xl:flex w-64 items-center justify-center">
          <div className="relative w-48 h-48">
             <div className="absolute inset-0 bg-primary/20 rounded-full blur-[60px] animate-pulse" />
             <div className="relative w-full h-full bg-background/80 backdrop-blur-md border-4 border-primary/30 rounded-full flex items-center justify-center shadow-2xl overflow-hidden group-hover:border-primary transition-colors duration-500">
                <BrainCircuit size={80} className="text-primary group-hover:scale-110 transition-transform duration-700" strokeWidth={1.5} />
                {/* Orbiting circles */}
                <div className="absolute inset-2 border border-dashed border-primary/30 rounded-full animate-[spin_15s_linear_infinite]" />
                <div className="absolute inset-6 border border-dotted border-primary/20 rounded-full animate-[spin_10s_linear_infinite_reverse]" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
