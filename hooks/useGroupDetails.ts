// hooks/useGroupDetails.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupService } from "@/services/group.service";
import { toast } from "sonner";

export const useGroupDetails = (
  groupId: string,
  month: number,
  year: number,
) => {
  const queryClient = useQueryClient();

  // Query Thống kê
  const statsQuery = useQuery({
    queryKey: ["group_stats", groupId, month, year],
    queryFn: () => groupService.getGroupStats(groupId, month, year),
    enabled: !!groupId,
  });

  // Query Nợ nần
  const debtsQuery = useQuery({
    queryKey: ["group_debts", groupId],
    queryFn: () => groupService.getGroupDebts(groupId),
    enabled: !!groupId,
  });

  // Mutation Thanh toán nợ
  const settleMutation = useMutation({
    mutationFn: groupService.settleDebt,
    onSuccess: () => {
      toast.success("Đã xác nhận thanh toán khoản nợ!");
      queryClient.invalidateQueries({ queryKey: ["group_debts", groupId] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Lỗi khi thanh toán.");
    },
  });

  return {
    stats: statsQuery.data?.data,
    isStatsLoading: statsQuery.isLoading,

    debts: debtsQuery.data?.data || [],
    isDebtsLoading: debtsQuery.isLoading,

    settleDebt: settleMutation,
  };
};
