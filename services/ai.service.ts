import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/auth";

export interface AiAdviceResponse {
  advice: string;
}

export const aiService = {
  getFinancialAdvice: async (): Promise<ApiResponse<AiAdviceResponse>> => {
    const response = await axiosInstance.get<ApiResponse<AiAdviceResponse>>("/ai/financial-advice", {
      headers: {
        "X-User-ID": "d9e74471-a2e3-4c06-a05d-60c1344f13b4"
      }
    });
    return response.data;
  },
  chat: async (message: string): Promise<ApiResponse<{ response: string }>> => {
    const response = await axiosInstance.post<ApiResponse<{ response: string }>>("/ai/chat", { message }, {
      headers: {
        "X-User-ID": "d9e74471-a2e3-4c06-a05d-60c1344f13b4"
      }
    });
    return response.data;
  },
};
