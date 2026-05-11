import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/auth";
import { TransactionResponse } from "@/types/group";
import {
  BulkTransactionRequest,
  OCRResponse,
  PaginatedResponse,
  Transaction,
  TransactionRequest,
} from "@/types/transaction";

export const transactionService = {
  getTransactions: async (page: number = 0, size: number = 10) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Transaction>>
    >("/transactions", { params: { page, size } });
    return response.data;
  },

 getGroupTransactions: async (groupId: string, page = 0, size = 10) => {
  const response = await axiosInstance.get<ApiResponse<PaginatedResponse<Transaction>>>( 
    `/transactions/group/${groupId}`,
    { params: { page, size } },
  );
  return response.data;
},

  getTotalIncome: async () => {
    const response = await axiosInstance.get<ApiResponse<number>>(
      "/transactions/total-income",
    );
    return response.data;
  },

  getTotalExpense: async () => {
    const response = await axiosInstance.get<ApiResponse<number>>(
      "/transactions/total-expense",
    );
    return response.data;
  },

  getTrash: async () => {
    const response = await axiosInstance.get<ApiResponse<Transaction[]>>(
      "/transactions/trash",
    );
    return response.data;
  },

  searchTransactions: async (
    keyword: string,
    page: number = 0,
    size: number = 10,
  ) => {
    const response = await axiosInstance.get<
      ApiResponse<PaginatedResponse<Transaction>>
    >("/transactions/search", { params: { keyword, page, size } });
    return response.data;
  },

  filterTransactions: async (type: "INCOME" | "EXPENSE") => {
    const response = await axiosInstance.get<ApiResponse<Transaction[]>>(
      "/transactions/filter",
      { params: { type } },
    );
    return response.data;
  },

  // FIX 1: UPDATE TRANSACTION
  updateTransaction: async (
    id: string,
    data: TransactionRequest, 
  ) => {
    const response = await axiosInstance.put<ApiResponse<any>>(
      `/transactions/${id}`,
      data 
    );
    return response.data;
  },

  deleteTransaction: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<any>>(
      `/transactions/${id}`,
    );
    return response.data;
  },

  restoreTransaction: async (id: string) => {
    const response = await axiosInstance.put<ApiResponse<any>>(
      `/transactions/${id}/restore`,
    );
    return response.data;
  },

  forceDeleteTransaction: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<any>>(
      `/transactions/${id}/force`,
    );
    return response.data;
  },

  // CREATE TRANSACTION
  createTransaction: async (data: TransactionRequest) => {
    const response = await axiosInstance.post<ApiResponse<Transaction>>(
      "/transactions/create",
      data 
    );
    return response.data;
  },

  uploadReceipt: async (transactionId: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<ApiResponse<Transaction>>(
      `/transactions/${transactionId}/upload-receipt`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  suggestCategory: async (note: string) => {
    const response = await axiosInstance.get<ApiResponse<string>>(
      `/transactions/suggest-category`,
      { params: { note } },
    );
    return response.data;
  },

  analyzeReceipt: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosInstance.post<ApiResponse<OCRResponse>>(
      "/transactions/analyze-receipt",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  bulkCreate: async (data: BulkTransactionRequest) => {
    const response = await axiosInstance.post<ApiResponse<Transaction[]>>(
      "/transactions/bulk-create",
      data,
    );
    return response.data;
  },
};