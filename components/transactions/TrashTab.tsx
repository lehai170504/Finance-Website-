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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <h3 className="font-black uppercase tracking-widest text-sm text-destructive">
          Đã xóa
        </h3>
        <span className="text-[10px] font-bold uppercase bg-destructive/10 text-destructive px-3 py-1 rounded-full">
          Tổng: {trash.length}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-28 bg-muted rounded-[2rem] animate-pulse"
            />
          ))}
        </div>
      ) : trash.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/30 rounded-[3rem] text-emerald-600 bg-emerald-500/5">
          <Trash2 size={48} className="mb-4 opacity-50" />
          <span className="font-black uppercase tracking-widest text-xs">
            Thùng rác trống!
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
