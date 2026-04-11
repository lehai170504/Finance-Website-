import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/auth";
import { Category } from "@/types/category";

export const categoryService = {
  getCategories: async () => {
    const response = await axiosInstance.get<ApiResponse<Category[]>>("/categories");
    return response.data;
  },
};