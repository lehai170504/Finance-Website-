export interface Transaction {
  id: string;
  amount: number;
  note: string;
  date: string;
  categoryName: string;
  categoryType: "INCOME" | "EXPENSE";
  receiptUrl: string | null;
  walletName: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

export interface TransactionRequest {
  amount: number;
  note: string;
  date: string;
}

export interface OCRResponse {
  amount: number;
  suggestedNote: string;
  receiptUrl: string;
}
