"use client";

import { useState } from "react";
import { useSavingsGoals } from "@/hooks/useSavingsGoals";
import { useWallets } from "@/hooks/useWallets";
import { Button } from "@/components/ui/button";
import { 
  PiggyBank, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Trash2, 
  Target,
  Sparkles,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CreateGoalModal } from "@/components/modals/CreateGoalModal";
import { GoalActionModal } from "@/components/modals/GoalActionModal";

export default function SavingsPage() {
  const { goals, isLoadingGoals, deleteGoal } = useSavingsGoals();
  const { wallets } = useWallets();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: "deposit" | "withdraw";
    goalId: string;
    goalName: string;
  }>({
    isOpen: false,
    type: "deposit",
    goalId: "",
    goalName: ""
  });

  if (isLoadingGoals) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
        <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Đang chuẩn bị lợn đất...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 mt-6 md:mt-10 flex flex-col space-y-12 font-sans mb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-orange-500">
            <PiggyBank size={24} strokeWidth={2.5} />
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">Hành trình tích lũy</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase">
            Mục tiêu <span className="text-orange-500">Tiết kiệm</span>
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Mỗi đồng homie bỏ vào lợn là một bước gần hơn tới ước mơ.
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="rounded-2xl bg-orange-500 hover:bg-orange-600 h-14 px-8 font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-orange-500/20"
        >
          Nuôi lợn mới <Plus className="ml-2" size={18} strokeWidth={3} />
        </Button>
      </div>

      {/* GOALS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {goals.map((goal) => (
          <div 
            key={goal.id} 
            className={cn(
              "group p-8 border-2 border-border/40 rounded-[2.5rem] bg-card/50 backdrop-blur-md flex flex-col relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2",
              goal.completed && "border-emerald-500/30 bg-emerald-500/[0.02]"
            )}
          >
            {/* Background Icon Decor */}
            <div className="absolute -right-8 -top-8 text-muted/5 group-hover:text-orange-500/5 transition-colors duration-700">
              <PiggyBank size={160} />
            </div>

            <div className="relative z-10 flex-1">
              <div className="flex items-start justify-between mb-8">
                <div className={cn(
                  "p-4 rounded-2xl border transition-all duration-500",
                  goal.completed ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-orange-500/10 border-orange-500/20 text-orange-500"
                )}>
                  <Target size={24} strokeWidth={2.5} />
                </div>
                {goal.completed && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                    <Sparkles size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Hoàn thành</span>
                  </div>
                )}
              </div>

              <h3 className="text-2xl font-black uppercase tracking-tight mb-2 group-hover:text-orange-500 transition-colors">
                {goal.name}
              </h3>
              
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-black tracking-tighter font-money">
                  {goal.savedAmount.toLocaleString()}
                </span>
                <span className="text-muted-foreground text-sm font-bold uppercase">/ {goal.targetAmount.toLocaleString()} đ</span>
              </div>

              <div className="space-y-2 mb-8">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  <span>Tiến độ</span>
                  <span>{goal.progressPercent}%</span>
                </div>
                <Progress 
                  value={goal.progressPercent} 
                  className="h-3 bg-muted/20"
                  indicatorClassName={cn(
                    "bg-orange-500",
                    goal.completed && "bg-emerald-500"
                  )}
                />
              </div>
            </div>

            <div className="relative z-10 flex gap-3 pt-6 border-t border-border/40">
              <Button 
                disabled={goal.completed}
                onClick={() => setActionModal({ isOpen: true, type: "deposit", goalId: goal.id, goalName: goal.name })}
                className="flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[10px] tracking-widest"
              >
                Nạp <ArrowUpRight size={14} className="ml-1" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => setActionModal({ isOpen: true, type: "withdraw", goalId: goal.id, goalName: goal.name })}
                className="flex-1 rounded-xl border-2 font-black uppercase text-[10px] tracking-widest"
              >
                Rút <ArrowDownRight size={14} className="ml-1" />
              </Button>
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => {
                  if(confirm("Bạn có chắc muốn đập lợn này? Tiền sẽ được hoàn về ví mặc định.")) {
                    const defaultWallet = wallets[0]?.id;
                    deleteGoal.mutate({ goalId: goal.id, walletId: defaultWallet });
                  }
                }}
                className="rounded-xl text-destructive hover:bg-destructive/10"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>
        ))}

        {goals.length === 0 && (
          <div className="col-span-full py-32 flex flex-col items-center gap-6 border-4 border-dashed border-muted/20 rounded-[3rem] bg-muted/5">
            <PiggyBank size={80} className="text-muted-foreground/20" strokeWidth={1} />
            <div className="text-center">
              <p className="text-xl font-black uppercase tracking-tight text-muted-foreground/40 mb-2">Chưa có lợn đất nào</p>
              <p className="text-sm text-muted-foreground/40 font-medium">Hãy tạo mục tiêu đầu tiên để bắt đầu tiết kiệm nhé homie!</p>
            </div>
            <Button 
              onClick={() => setIsCreateOpen(true)}
              variant="outline"
              className="rounded-2xl border-2 font-black uppercase text-[11px] tracking-widest px-8"
            >
              Tạo mục tiêu ngay
            </Button>
          </div>
        )}
      </div>

      {/* MODALS */}
      <CreateGoalModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
      />
      <GoalActionModal 
        isOpen={actionModal.isOpen}
        onClose={() => setActionModal(prev => ({ ...prev, isOpen: false }))}
        type={actionModal.type}
        goalId={actionModal.goalId}
        goalName={actionModal.goalName}
      />
    </div>
  );
}
