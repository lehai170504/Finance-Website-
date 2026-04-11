export interface GroupMember {
  id: string;
  username: string;
  email: string;
}

export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  owner: GroupMember;
  members: GroupMember[];
}

export interface Transaction {
  id: string;
  amount: number;
  note: string;
  date: string;
  categoryName: string;
  categoryType: "INCOME" | "EXPENSE";
  receiptUrl?: string;
  walletName: string;
}

export interface TransactionResponse {
  content: Transaction[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

export interface GroupStats {
  totalExpense: number;
  statsByCategory: Record<string, number>;
  statsByUser: Record<string, number>;
}

export interface GroupDebt {
  id: string;
  debtorName: string; // Người mượn (Con nợ)
  creditorName: string; // Người cho mượn (Chủ nợ)
  amount: number;
}
