export interface CashFlowResponse {
  date: string;
  income: number;
  expense: number;
}

export interface CategoryStats {
  categoryName: string;
  totalAmount: number;
  percentage: number;
  type: "INCOME" | "EXPENSE";
}
