import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/auth";
import { Category } from "@/types/category";

export const reportService = {
  // 1. Lấy danh sách Categories
  getCategories: async () => {
    const response =
      await axiosInstance.get<ApiResponse<Category[]>>("/categories");
    return response.data;
  },

  // 2. Thống kê theo Categories (Pie Chart)
  getCategoryStats: async (startDate: string, endDate: string) => {
    const response = await axiosInstance.get<ApiResponse<any[]>>(
      "/reports/categories",
      { params: { startDate, endDate } },
    );
    return response.data;
  },

  // 3. Tải Excel
  downloadExcel: async () => {
    const response = await axiosInstance.get("/reports/download-excel", {
      responseType: "blob", // BẮT BUỘC ĐỂ TẢI FILE
    });

    // Logic tải file tự động trình duyệt
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Lich_su_chi_tieu_${new Date().getTime()}.xlsx`,
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  // 4. Đặt ngân sách (Chú ý: truyền qua Query Params theo Swagger)
  setBudget: async (
    categoryId: string,
    month: number,
    year: number,
    limitAmount: number,
  ) => {
    const response = await axiosInstance.post<ApiResponse<any>>(
      "/budgets/set",
      null,
      { params: { categoryId, month, year, limitAmount } },
    );
    return response.data;
  },
};
