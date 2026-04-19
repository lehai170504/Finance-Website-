import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/auth";

export interface AiAdviceResponse {
  advice: string;
}

export const aiService = {
  getFinancialAdvice: async (): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.get<ApiResponse<string>>("/ai/advice");
    return response.data;
  },
  chat: async (message: string, history?: any[]): Promise<ApiResponse<string>> => {
    const response = await axiosInstance.post<ApiResponse<string>>("/ai/chat", { 
      message, 
      history 
    });
    return response.data;
  },
};
