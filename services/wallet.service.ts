import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/auth";
import { Wallet } from "@/types/wallet";

export const walletService = {
  // GET /api/wallets - Lấy danh sách ví
  getWallets: async () => {
    const response = await axiosInstance.get<ApiResponse<Wallet[]>>("/wallets");
    return response.data;
  },

  // GET /api/wallets/total-balance - Lấy tổng số dư
  getTotalBalance: async () => {
    const response = await axiosInstance.get<ApiResponse<number>>(
      "/wallets/total-balance",
    );
    return response.data;
  },

  // POST /api/wallets - Tạo ví mới
  createWallet: async (data: {
    name: string;
    balance: number;
    color: string;
  }) => {
    const response = await axiosInstance.post<ApiResponse<Wallet>>(
      "/wallets",
      data,
    );
    return response.data;
  },

  // POST /api/wallets/transfer - Chuyển tiền (Sử dụng Query Params theo ảnh)
  transfer: async (fromId: string, toId: string, amount: number) => {
    const response = await axiosInstance.post<ApiResponse<string>>(
      "/wallets/transfer",
      null,
      { params: { fromId, toId, amount } },
    );
    return response.data;
  },

  // PUT /api/wallets/{id} - Cập nhật ví
  updateWallet: async (id: string, data: Partial<Wallet>) => {
    const response = await axiosInstance.put<ApiResponse<Wallet>>(
      `/wallets/${id}`,
      data,
    );
    return response.data;
  },

  // DELETE /api/wallets/{id} - Xóa ví
  deleteWallet: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `/wallets/${id}`,
    );
    return response.data;
  },
};
