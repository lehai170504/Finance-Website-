import { axiosInstance } from "@/lib/axios";

export interface AiAdviceResponse {
  advice: string;
}

export const aiService = {
  getFinancialAdvice: async (): Promise<AiAdviceResponse> => {
    const response = await axiosInstance.get<AiAdviceResponse>("/ai/financial-advice");
    return response.data;
  },
  chat: async (message: string): Promise<{ response: string }> => {
    const response = await axiosInstance.post<{ response: string }>("/ai/chat", { message });
    return response.data;
  },
};
