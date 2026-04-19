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
  receiptUrl?: string;
}

export interface OCRResponse {
  totalAmount: number;
  suggestedNote: string;
  receiptUrl: string;
  items: OCRItem[];
}

export interface OCRItem {
  name: string;
  amount: number;
  categorySuggestion: string;
}

export interface BulkTransactionRequest {
  walletId: string;
  groupId?: string;
  date: string;
  receiptUrl: string;
  items: {
    categoryId: string;
    amount: number;
    note: string;
  }[];
}
