import { useQuery } from "@tanstack/react-query";
import { categoryService } from "@/services/category.service";

export const useCategories = () => {

  // 1. Lấy danh sách danh mục
  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: categoryService.getCategories,
  });


  return {
    categories: categoriesQuery.data?.data || [],
    isLoading: categoriesQuery.isLoading,
    isError: categoriesQuery.isError,
    refetch: categoriesQuery.refetch,
  };
};