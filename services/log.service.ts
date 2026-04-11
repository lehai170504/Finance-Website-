// services/log.service.ts
import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/auth"; 
import { TransactionLog } from "@/types/log"; 

export const logService = {
  getTransactionLogs: async (transactionId: string) => {
    const response = await axiosInstance.get<ApiResponse<TransactionLog[]>>(
      `/logs/transaction/${transactionId}`
    );
    return response.data;
  },

  getGroupLogs: async (groupId: string) => {
    const response = await axiosInstance.get<ApiResponse<TransactionLog[]>>(
      `/logs/group/${groupId}`
    );
    return response.data;
  },
};