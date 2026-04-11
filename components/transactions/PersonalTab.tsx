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
      <div className="flex justify-between items-end px-1">
        <h3 className="font-black uppercase tracking-[0.15em] text-[11px] text-muted-foreground/80">
          {keyword
            ? `Kết quả: "${keyword}"`
            : filterType !== "ALL"
              ? `Lọc: ${filterType}`
              : "Giao dịch cá nhân"}
        </h3>
        <span className="font-money text-[10px] font-bold uppercase bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/10">
          Tổng: {data?.totalElements || 0}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-muted/40 rounded-3xl animate-pulse border border-border/50"
            />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-[2.5rem] text-muted-foreground bg-card/30 backdrop-blur-sm">
          <SearchX size={48} className="mb-4 opacity-10" />
          <span className="font-black uppercase tracking-[0.2em] text-[10px] opacity-60">
            Không tìm thấy dữ liệu
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
        <div className="pt-4 border-t border-border/40">
           <TransactionPagination
            currentPage={page}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}