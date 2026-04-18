"use client";

import { useSavingsGoals } from "@/hooks/useSavingsGoals";
import { PiggyBank, Plus, ArrowRight, Target, TrendingUp } from "lucide-react";
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
    <div className="relative overflow-hidden p-8 border border-white/10 rounded-[2.5rem] bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full" />
      
      <div className="relative flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-xl rounded-2xl" />
            <div className="relative p-3 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl text-white shadow-lg shadow-orange-500/20">
              <PiggyBank size={24} strokeWidth={2} />
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight text-foreground/90">Mục tiêu tiết kiệm</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">Lợn đất của homie</p>
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsCreateOpen(true)}
          className="rounded-2xl border-white/10 bg-white/5 hover:bg-orange-500 hover:text-white transition-all duration-300 group shadow-lg"
        >
          <Plus size={20} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
        </Button>
      </div>

      <div className="relative space-y-6">
        {goals.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/5">
            <div className="p-4 bg-muted/10 rounded-full mb-4">
              <Target className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <p className="text-sm font-medium text-muted-foreground/50">Chưa có mục tiêu nào được tạo</p>
            <Button 
              variant="link" 
              onClick={() => setIsCreateOpen(true)}
              className="mt-2 text-orange-500 text-xs font-bold uppercase tracking-tighter"
            >
              Tạo ngay mục tiêu đầu tiên
            </Button>
          </div>
        ) : (
          goals.slice(0, 3).map((goal) => (
            <div key={goal.id} className="group space-y-3 p-4 rounded-2xl hover:bg-white/5 transition-all duration-300">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    goal.completed ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                  )} />
                  <span className="text-[13px] font-bold uppercase tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">
                    {goal.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                  <TrendingUp size={12} className="text-orange-500/70" />
                  <span>{Math.round(goal.progressPercent)}%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="relative h-2.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={cn(
                      "h-full transition-all duration-1000 ease-out rounded-full",
                      goal.completed 
                        ? "bg-gradient-to-r from-emerald-400 to-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.3)]" 
                        : "bg-gradient-to-r from-orange-400 to-orange-600 shadow-[0_0_12px_rgba(249,115,22,0.3)]"
                    )}
                    style={{ width: `${Math.min(goal.progressPercent, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center px-0.5">
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Hiện có: <span className="text-foreground/70">{goal.savedAmount.toLocaleString()}đ</span></span>
                  <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Mục tiêu: <span className="text-foreground/70">{goal.targetAmount.toLocaleString()}đ</span></span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="relative mt-8 pt-6 border-t border-white/5">
        <Link 
          href="/savings" 
          className="flex items-center justify-between group/link px-4 py-3 rounded-xl hover:bg-white/5 transition-all"
        >
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-muted-foreground group-hover/link:text-orange-500 transition-colors">
            Khám phá thêm mục tiêu
          </span>
          <div className="p-1.5 rounded-lg bg-orange-500/0 group-hover/link:bg-orange-500/10 transition-all">
            <ArrowRight size={16} strokeWidth={2.5} className="text-muted-foreground group-hover/link:translate-x-1 group-hover/link:text-orange-500 transition-all" />
          </div>
        </Link>
      </div>

      <CreateGoalModal 
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}

