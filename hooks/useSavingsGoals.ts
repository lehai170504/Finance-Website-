import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { savingsGoalService } from "@/services/savings-goal.service";
import { toast } from "sonner";
import { SavingsGoalRequest } from "@/types/savings-goal";

export const useSavingsGoals = () => {
  const queryClient = useQueryClient();

  // 1. Lấy danh sách mục tiêu
  const goalsQuery = useQuery({
    queryKey: ["savings_goals"],
    queryFn: () => savingsGoalService.getMyGoals(),
  });

  // 2. Tạo mục tiêu mới
  const createGoalMutation = useMutation({
    mutationFn: (data: SavingsGoalRequest) => savingsGoalService.createGoal(data),
    onSuccess: () => {
      toast.success("Đã tạo lợn đất mới! Bắt đầu tiết kiệm thôi homie 🐷");
      queryClient.invalidateQueries({ queryKey: ["savings_goals"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi khi tạo mục tiêu"),
  });

  // 3. Nạp tiền vào lợn
  const depositMutation = useMutation({
    mutationFn: ({
      goalId,
      walletId,
      amount,
    }: {
      goalId: string;
      walletId: string;
      amount: number;
    }) => savingsGoalService.deposit(goalId, walletId, amount),
    onSuccess: () => {
      toast.success("Đã bỏ tiền vào heo! 💰");
      queryClient.invalidateQueries({ queryKey: ["savings_goals"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi khi nạp tiền"),
  });

  // 4. Rút tiền ra
  const withdrawMutation = useMutation({
    mutationFn: ({
      goalId,
      walletId,
      amount,
    }: {
      goalId: string;
      walletId: string;
      amount: number;
    }) => savingsGoalService.withdraw(goalId, walletId, amount),
    onSuccess: () => {
      toast.success("Đã rút tiền từ lợn đất! 💸");
      queryClient.invalidateQueries({ queryKey: ["savings_goals"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi khi rút tiền"),
  });

  // 5. Xóa lợn đất
  const deleteGoalMutation = useMutation({
    mutationFn: ({ goalId, walletId }: { goalId: string; walletId?: string }) =>
      savingsGoalService.deleteGoal(goalId, walletId),
    onSuccess: () => {
      toast.success("Đã đập lợn đất thành công!");
      queryClient.invalidateQueries({ queryKey: ["savings_goals"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi khi xóa lợn đất"),
  });

  return {
    goals: goalsQuery.data?.data || [],
    isLoadingGoals: goalsQuery.isLoading,
    createGoal: createGoalMutation,
    deposit: depositMutation,
    withdraw: withdrawMutation,
    deleteGoal: deleteGoalMutation,
  };
};
