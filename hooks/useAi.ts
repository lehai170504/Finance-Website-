import { useQuery } from "@tanstack/react-query";
import { aiService } from "@/services/ai.service";
import { toast } from "sonner";

export const useAi = () => {
  return useQuery({
    queryKey: ["ai_advice"],
    queryFn: async () => {
      try {
        return await aiService.getFinancialAdvice();
      } catch (error) {
        toast.error("Không thể kết nối với Cố vấn AI. Vui lòng thử lại sau!");
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // Giữ lời khuyên trong 1 giờ
    retry: false,
    refetchOnWindowFocus: false,
  });
};
