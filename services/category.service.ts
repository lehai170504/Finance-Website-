import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/auth";
import { Category } from "@/types/category";

export const categoryService = {
  getCategories: async () => {
    const response =
      await axiosInstance.get<ApiResponse<Category[]>>("/categories");
    return response.data;
  },

  createCategory: async (data: Partial<Category>) => {
    const response = await axiosInstance.post<ApiResponse<Category>>(
      "/categories",
      data,
    );
    return response.data;
  },

  updateCategory: async (id: string, data: Partial<Category>) => {
    const response = await axiosInstance.put<ApiResponse<Category>>(
      `/categories/${id}`,
      data,
    );
    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<void>>(
      `/categories/${id}`,
    );
    return response.data;
  },
};
