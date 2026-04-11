import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/auth";
import { TransactionResponse } from "@/types/group";
import {
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
    const response = await axiosInstance.get<ApiResponse<TransactionResponse>>(
      `/transactions/group/${groupId}`,
      { params: { page, size } },
    );
    return response.data;
  },

  //Lấy Tổng Thu Nhập
  getTotalIncome: async () => {
    const response = await axiosInstance.get<ApiResponse<number>>(
      "/transactions/total-income",
    );
    return response.data;
  },

  //Lấy Tổng Chi Tiêu
  getTotalExpense: async () => {
    const response = await axiosInstance.get<ApiResponse<number>>(
      "/transactions/total-expense",
    );
    return response.data;
  },

  //Lấy danh sách Thùng rác (Chưa xóa vĩnh viễn)
  getTrash: async () => {
    const response = await axiosInstance.get<ApiResponse<Transaction[]>>(
      "/transactions/trash",
    );
    return response.data;
  },

  //Tìm kiếm giao dịch
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

  //Lọc giao dịch theo Thu/Chi
  filterTransactions: async (type: "INCOME" | "EXPENSE") => {
    const response = await axiosInstance.get<ApiResponse<Transaction[]>>(
      "/transactions/filter",
      { params: { type } },
    );
    return response.data;
  },

  // Sửa giao dịch
  updateTransaction: async (
    id: string,
    newWalletId: string,
    categoryId: string,
    data: { amount: number; note: string; date: string },
  ) => {
    const response = await axiosInstance.put<ApiResponse<any>>(
      `/transactions/${id}`,
      data,
      { params: { newWalletId, categoryId } },
    );
    return response.data;
  },

  // Xóa giao dịch (Vào thùng rác)
  deleteTransaction: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<any>>(
      `/transactions/${id}`,
    );
    return response.data;
  },

  // Phục hồi giao dịch từ thùng rác
  restoreTransaction: async (id: string) => {
    const response = await axiosInstance.put<ApiResponse<any>>(
      `/transactions/${id}/restore`,
    );
    return response.data;
  },

  // Xóa vĩnh viễn khỏi Database
  forceDeleteTransaction: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<any>>(
      `/transactions/${id}/force`,
    );
    return response.data;
  },

  // Tạo giao dịch mới
  createTransaction: async (
    walletId: string,
    categoryId: string,
    groupId: string | null,
    data: TransactionRequest,
  ) => {
    const response = await axiosInstance.post<ApiResponse<Transaction>>(
      "/transactions/create",
      data,
      {
        params: {
          walletId,
          categoryId,
          groupId: groupId || "",
        },
      },
    );
    return response.data;
  },

  // Upload ảnh hóa đơn
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
      { params: { note } }
    );
    return response.data; 
  },
};
