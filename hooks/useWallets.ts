// hooks/useWallets.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { walletService } from "@/services/wallet.service";
import { toast } from "sonner";
import { Wallet } from "@/types/wallet";

export const useWallets = () => {
  const queryClient = useQueryClient();

  // 1. Lấy danh sách ví
  const walletsQuery = useQuery({
    queryKey: ["wallets"],
    queryFn: walletService.getWallets,
  });

  // 2. Lấy tổng số dư
  const totalBalanceQuery = useQuery({
    queryKey: ["total-balance"],
    queryFn: walletService.getTotalBalance,
  });

  // 3. Tạo ví mới
  const createMutation = useMutation({
    mutationFn: walletService.createWallet,
    onSuccess: () => {
      toast.success("Đã tạo ví mới!");
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["total-balance"] });
    },
  });

  // 4. Cập nhật ví
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Wallet> }) =>
      walletService.updateWallet(id, data),
    onSuccess: () => {
      toast.success("Cập nhật ví thành công!");
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["total-balance"] });
    },
  });

  // 5. Xóa ví
  const deleteMutation = useMutation({
    // Đảm bảo homie đã khai báo deleteWallet trong walletService
    mutationFn: (id: string) => walletService.deleteWallet(id),
    onSuccess: () => {
      toast.success("Đã xóa ví!");
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      queryClient.invalidateQueries({ queryKey: ["total-balance"] });
    },
  });

  // 6. Chuyển tiền nội bộ
  const transferMutation = useMutation({
    mutationFn: ({
      fromId,
      toId,
      amount,
    }: {
      fromId: string;
      toId: string;
      amount: number;
    }) => walletService.transfer(fromId, toId, amount),
    onSuccess: () => {
      toast.success("Dịch chuyển số dư thành công!");
      queryClient.invalidateQueries({ queryKey: ["wallets"] }); // Chỉ cần load lại list ví là tiền tự nhảy
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Lỗi khi chuyển tiền.");
    },
  });

  return {
    wallets: walletsQuery.data?.data || [],
    totalBalance: totalBalanceQuery.data?.data || 0,
    isLoading: walletsQuery.isLoading,
    createWallet: createMutation,
    updateWallet: updateMutation,
    deleteWallet: deleteMutation,
    transferWallet: transferMutation,
  };
};
