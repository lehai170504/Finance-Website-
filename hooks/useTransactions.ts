import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { transactionService } from "@/services/transaction.service";
import { toast } from "sonner"; // Thêm import toast

// 1. Hook lấy giao dịch của Nhóm (Group)
export const useGroupTransactions = (groupId: string, page = 0) => {
  return useQuery({
    queryKey: ["group_transactions", groupId, page],
    queryFn: () => transactionService.getGroupTransactions(groupId, page),
    enabled: !!groupId,
    retry: false,
  });
};

// 2. Hook lấy giao dịch Cá nhân (Có hỗ trợ Phân trang, Tìm kiếm, Lọc)
export const useTransactions = (
  page: number = 0,
  size: number = 10,
  keyword: string = "",
  filterType: "ALL" | "INCOME" | "EXPENSE" = "ALL",
) => {
  const queryClient = useQueryClient();

  // Lấy danh sách chính
  const listQuery = useQuery({
    queryKey: ["transactions", page, size, keyword, filterType],
    queryFn: async () => {
      if (keyword.trim() !== "") {
        return transactionService.searchTransactions(keyword, page, size);
      } else if (filterType !== "ALL") {
        const res = await transactionService.filterTransactions(filterType);
        return {
          status: res.status,
          message: res.message,
          data: {
            content: res.data,
            currentPage: 0,
            totalPages: 1,
            totalElements: res.data.length,
          },
        };
      } else {
        return transactionService.getTransactions(page, size);
      }
    },
  });

  // Lấy tổng thu
  const totalIncomeQuery = useQuery({
    queryKey: ["transactions", "total-income"],
    queryFn: transactionService.getTotalIncome,
  });

  // Lấy tổng chi
  const totalExpenseQuery = useQuery({
    queryKey: ["transactions", "total-expense"],
    queryFn: transactionService.getTotalExpense,
  });

  // Lấy thùng rác
  const trashQuery = useQuery({
    queryKey: ["transactions", "trash"],
    queryFn: transactionService.getTrash,
  });

  // MUTATION SỬA GIAO DỊCH
  const updateMutation = useMutation({
    mutationFn: ({ id, newWalletId, categoryId, data }: any) =>
      transactionService.updateTransaction(id, newWalletId, categoryId, data),
    onSuccess: () => {
      toast.success("Cập nhật giao dịch thành công!");
      // Fix lỗi chữ "QueryClient" thành "queryClient"
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["group_transactions"] });
      queryClient.invalidateQueries({ queryKey: ["total-balance"] });
    },
  });

  // MUTATION XÓA GIAO DỊCH
  const deleteMutation = useMutation({
    mutationFn: transactionService.deleteTransaction,
    onSuccess: () => {
      toast.success("Đã chuyển giao dịch vào thùng rác!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["group_transactions"] });
      queryClient.invalidateQueries({ queryKey: ["total-balance"] });
    },
  });

  // MUTATION KHÔI PHỤC GIAO DỊCH
  const restoreMutation = useMutation({
    mutationFn: transactionService.restoreTransaction,
    onSuccess: () => {
      toast.success("Đã khôi phục giao dịch thành công!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["group_transactions"] });
      queryClient.invalidateQueries({ queryKey: ["total-balance"] });
      queryClient.invalidateQueries({ queryKey: ["total-income"] });
      queryClient.invalidateQueries({ queryKey: ["total-expense"] });
      queryClient.invalidateQueries({ queryKey: ["trash"] });
    },
  });

  // MUTATION XÓA VĨNH VIỄN
  const forceDeleteMutation = useMutation({
    mutationFn: transactionService.forceDeleteTransaction,
    onSuccess: () => {
      toast.success("Đã xóa vĩnh viễn giao dịch!");
      queryClient.invalidateQueries({ queryKey: ["trash"] });
    },
  });

  // Mutation tạo giao dịch
  const createMutation = useMutation({
    mutationFn: ({ walletId, categoryId, groupId, data }: any) =>
      transactionService.createTransaction(walletId, categoryId, groupId, data),
    onSuccess: () => {
      toast.success("Đã ghi chép giao dịch thành công!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể tạo giao dịch");
    },
  });

  // Mutation Upload hóa đơn
  const uploadReceiptMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      transactionService.uploadReceipt(id, file),
    onSuccess: () => {
      toast.success("Đã tải hóa đơn thành công!");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["group_transactions"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Lỗi khi upload ảnh");
    },
  });

  return {
    // Data cho danh sách chính
    data: listQuery.data?.data,
    transactions: listQuery.data?.data?.content || [],
    isLoading: listQuery.isLoading,

    // Data thống kê & thùng rác
    totalIncome: totalIncomeQuery.data?.data || 0,
    totalExpense: totalExpenseQuery.data?.data || 0,
    trash: trashQuery.data?.data || [],
    isTrashLoading: trashQuery.isLoading,

    // Trả ra các hàm mutations để giao diện gọi
    updateTransaction: updateMutation,
    deleteTransaction: deleteMutation,
    restoreTransaction: restoreMutation,
    forceDeleteTransaction: forceDeleteMutation,
    createTransaction: createMutation,
    uploadReceipt: uploadReceiptMutation,

    // Hàm gọi lại API nếu cần
    refetch: listQuery.refetch,
  };
};

export const useSuggestCategory = () => {
  return useMutation({
    mutationKey: ["suggest_category"],
    mutationFn: (note: string) => transactionService.suggestCategory(note),
    onError: (err) => console.error("Suggest category error:", err),
  });
};
