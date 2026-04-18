"use client";

import { useState } from "react";
import { useSavingsGoals } from "@/hooks/useSavingsGoals";
import { useWallets } from "@/hooks/useWallets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: "deposit" | "withdraw";
  goalId: string;
  goalName: string;
}

export function GoalActionModal({ isOpen, onClose, type, goalId, goalName }: Props) {
  const { deposit, withdraw } = useSavingsGoals();
  const { wallets } = useWallets();
  
  const [selectedWallet, setSelectedWallet] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      goalId,
      walletId: selectedWallet,
      amount: Number(amount),
    };

    const mutation = type === "deposit" ? deposit : withdraw;

    mutation.mutate(payload, {
      onSuccess: () => {
        onClose();
        setAmount("");
        setSelectedWallet("");
      },
    });
  };

  const isDeposit = type === "deposit";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-[2rem] border-2 border-border/40 p-8">
        <DialogHeader className="space-y-4">
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center border mx-auto transition-colors",
            isDeposit ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-red-500/10 border-red-500/20 text-red-500"
          )}>
            {isDeposit ? <ArrowUpRight size={32} strokeWidth={2.5} /> : <ArrowDownRight size={32} strokeWidth={2.5} />}
          </div>
          <DialogTitle className="text-3xl font-black uppercase tracking-tight text-center">
            {isDeposit ? "Nạp tiền vào lợn" : "Rút tiền khỏi lợn"}
          </DialogTitle>
          <DialogDescription className="text-center font-medium">
            Mục tiêu: <span className="font-black text-foreground">{goalName}</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                Chọn ví thực hiện
              </label>
              <Select value={selectedWallet} onValueChange={setSelectedWallet} required>
                <SelectTrigger className="h-14 rounded-2xl border-2 focus:ring-emerald-500/20 transition-all font-bold">
                  <SelectValue placeholder="Chọn ví của bạn..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2">
                  {wallets.map((w) => (
                    <SelectItem key={w.id} value={w.id} className="font-bold py-3 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Wallet size={16} className="text-muted-foreground" />
                        <span>{w.name}</span>
                        <span className="text-[10px] text-muted-foreground font-medium ml-2">
                          ({w.balance.toLocaleString()}đ)
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1">
                Số tiền {isDeposit ? "muốn bỏ vào" : "muốn rút ra"} (VNĐ)
              </label>
              <Input
                required
                type="number"
                placeholder="Nhập số tiền..."
                className="h-14 rounded-2xl border-2 focus-visible:ring-emerald-500/20 transition-all font-black text-lg"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl font-black uppercase text-[11px] tracking-widest border-2"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={deposit.isPending || withdraw.isPending}
              className={cn(
                "flex-1 h-14 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-lg transition-all",
                isDeposit 
                  ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" 
                  : "bg-red-500 hover:bg-red-600 shadow-red-500/20"
              )}
            >
              {isDeposit ? "Xác nhận nạp" : "Xác nhận rút"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
