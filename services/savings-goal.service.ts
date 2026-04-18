import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/auth";
import { SavingsGoal, SavingsGoalRequest } from "@/types/savings-goal";

export const savingsGoalService = {
  // Lấy danh sách mục tiêu tiết kiệm
  getMyGoals: async () => {
    const response = await axiosInstance.get<ApiResponse<SavingsGoal[]>>(
      "/savings-goals",
    );
    return response.data;
  },

  // Tạo mục tiêu mới
  createGoal: async (data: SavingsGoalRequest) => {
    const response = await axiosInstance.post<ApiResponse<SavingsGoal>>(
      "/savings-goals",
      data,
    );
    return response.data;
  },

  // Nạp tiền vào lợn đất
  deposit: async (goalId: string, walletId: string, amount: number) => {
    const response = await axiosInstance.post<ApiResponse<SavingsGoal>>(
      `/savings-goals/${goalId}/deposit`,
      null,
      { params: { walletId, amount } },
    );
    return response.data;
  },

  // Rút tiền ra khỏi lợn đất
  withdraw: async (goalId: string, walletId: string, amount: number) => {
    const response = await axiosInstance.post<ApiResponse<SavingsGoal>>(
      `/savings-goals/${goalId}/withdraw`,
      null,
      { params: { walletId, amount } },
    );
    return response.data;
  },

  // Xóa mục tiêu tiết kiệm
  deleteGoal: async (goalId: string, walletId?: string) => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `/savings-goals/${goalId}`,
      { params: { walletId } },
    );
    return response.data;
  },
};
