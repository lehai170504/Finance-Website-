import { useQuery, useMutation } from "@tanstack/react-query";
import { reportService } from "@/services/report.service";
import { toast } from "sonner";

export const useReports = (startDate?: string, endDate?: string, days: number = 30) => {
  // Hook thống kê
  const statsQuery = useQuery({
    queryKey: ["category_stats", startDate, endDate],
    queryFn: () => reportService.getCategoryStats(startDate!, endDate!),
    enabled: !!startDate && !!endDate,
  });

  // Hook thống kê Cash Flow
  const cashFlowQuery = useQuery({
    queryKey: ["cash_flow", days],
    queryFn: () => reportService.getCashFlowStatistics(days),
  });

  // Hook set ngân sách
  const setBudgetMutation = useMutation({
    mutationFn: ({ categoryId, month, year, limitAmount }: any) =>
      reportService.setBudget(categoryId, month, year, limitAmount),
    onSuccess: () => toast.success("Đã đặt hạn mức ngân sách thành công!"),
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi khi đặt ngân sách"),
  });

  return {
    stats: statsQuery.data?.data || [],
    isLoadingStats: statsQuery.isLoading,
    cashFlow: cashFlowQuery.data?.data || [],
    isLoadingCashFlow: cashFlowQuery.isLoading,
    downloadExcel: reportService.downloadExcel,
    setBudget: setBudgetMutation,
  };
};
