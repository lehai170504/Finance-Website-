import { Trash2 } from "lucide-react";
import { TransactionCard } from "./TransactionCard";

interface TrashTabProps {
  trash: any[];
  isLoading: boolean;
  onRestore: (trans: any) => void;
  onForceDelete: (trans: any) => void;
}

export function TrashTab({
  trash,
  isLoading,
  onRestore,
  onForceDelete,
}: TrashTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end px-1">
        <h3 className="font-black uppercase tracking-[0.15em] text-[11px] text-destructive/80">
          Lịch sử đã xóa
        </h3>
        <span className="font-money text-[10px] font-bold uppercase bg-destructive/10 text-destructive px-3 py-1 rounded-full border border-destructive/10">
          Tổng: {trash.length}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-24 bg-muted/40 rounded-3xl animate-pulse border border-border/50"
            />
          ))}
        </div>
      ) : trash.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/20 rounded-[2.5rem] text-emerald-600/60 bg-emerald-500/2 backdrop-blur-sm">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
            <Trash2 size={32} className="opacity-40" />
          </div>
          <span className="font-black uppercase tracking-[0.2em] text-[10px]">
            Thùng rác trống sạch!
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {trash.map((trans) => (
            <TransactionCard
              key={trans.id}
              trans={trans}
              isTrash
              onRestore={onRestore}
              onForceDelete={onForceDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
