"use client";

import { useSavingsGoals } from "@/hooks/useSavingsGoals";
import { PiggyBank, Plus, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { CreateGoalModal } from "@/components/modals/CreateGoalModal";

export function SavingsGoalsCard() {
  const { goals, isLoadingGoals } = useSavingsGoals();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isLoadingGoals) return null;

  return (
    <div className="p-8 border-2 border-border/40 rounded-[2.5rem] bg-card/50 backdrop-blur-md shadow-sm animate-in fade-in slide-in-from-right-8 duration-1000 delay-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-500 border border-orange-500/20">
            <PiggyBank size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight">Mục tiêu tiết kiệm</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.1em]">Lợn đất của homie</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCreateOpen(true)}
          className="rounded-full hover:bg-orange-500/10 text-orange-500"
        >
          <Plus size={20} strokeWidth={3} />
        </Button>
      </div>

      <div className="space-y-6">
        {goals.length === 0 ? (
          <div className="py-8 text-center border-2 border-dashed border-muted/20 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Chưa có mục tiêu nào</p>
          </div>
        ) : (
          goals.slice(0, 3).map((goal) => (
            <div key={goal.id} className="space-y-3 group cursor-default">
              <div className="flex justify-between items-end">
                <span className="text-sm font-black uppercase tracking-tight group-hover:text-orange-500 transition-colors">
                  {goal.name}
                </span>
                <span className="text-xs font-bold text-muted-foreground">
                  {goal.savedAmount.toLocaleString()} / {goal.targetAmount.toLocaleString()} đ
                </span>
              </div>
              <div className="relative">
                <Progress value={goal.progressPercent} className="h-2.5 bg-muted/20" 
                  indicatorClassName={cn(
                    "bg-orange-500 transition-all duration-1000",
                    goal.completed && "bg-emerald-500"
                  )} 
                />
                {goal.completed && (
                  <span className="absolute -right-1 -top-6 text-[10px] font-black text-emerald-500 uppercase tracking-tighter animate-bounce">
                    Hoàn thành! 🎉
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Link href="/savings" className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between group/link">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover/link:text-foreground transition-colors">
          Xem tất cả mục tiêu
        </span>
        <ArrowRight size={14} strokeWidth={3} className="text-muted-foreground group-hover/link:translate-x-1 group-hover/link:text-orange-500 transition-all" />
      </Link>

      <CreateGoalModal 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}
