import { useQuery, useMutation } from "@tanstack/react-query";
import { reportService } from "@/services/report.service";
import { toast } from "sonner";

export const useReports = (startDate?: string, endDate?: string) => {
  // Hook lấy danh mục
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: reportService.getCategories,
  });

  // Hook thống kê
  const statsQuery = useQuery({
    queryKey: ["category_stats", startDate, endDate],
    queryFn: () => reportService.getCategoryStats(startDate!, endDate!),
    enabled: !!startDate && !!endDate, // Chỉ chạy khi có đủ ngày
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
    categories: categoriesQuery.data?.data || [],
    stats: statsQuery.data?.data || [],
    isLoadingStats: statsQuery.isLoading,
    downloadExcel: reportService.downloadExcel,
    setBudget: setBudgetMutation,
  };
};
