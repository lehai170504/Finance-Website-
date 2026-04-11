import { SearchX } from "lucide-react";
import { TransactionCard } from "./TransactionCard";
import { TransactionPagination } from "./TransactionPagination";

interface PersonalTabProps {
  keyword: string;
  filterType: string;
  data: any;
  transactions: any[];
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  onEdit: (trans: any) => void;
  onDelete: (trans: any) => void;
}

export function PersonalTab({
  keyword,
  filterType,
  data,
  transactions,
  isLoading,
  page,
  setPage,
  onEdit,
  onDelete,
}: PersonalTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <h3 className="font-black uppercase tracking-widest text-sm text-muted-foreground">
          {keyword
            ? `Kết quả: "${keyword}"`
            : filterType !== "ALL"
              ? `Lọc: ${filterType}`
              : "Giao dịch cá nhân"}
        </h3>
        <span className="text-[10px] font-bold uppercase bg-primary/10 text-primary px-3 py-1 rounded-full">
          Tổng: {data?.totalElements || 0}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 bg-muted rounded-[2rem] animate-pulse"
            />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed rounded-[3rem] text-muted-foreground bg-card">
          <SearchX size={48} className="mb-4 opacity-20" />
          <span className="font-black uppercase tracking-widest text-xs">
            Không có dữ liệu
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((trans) => (
            <TransactionCard
              key={trans.id}
              trans={trans}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <TransactionPagination
          currentPage={page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
