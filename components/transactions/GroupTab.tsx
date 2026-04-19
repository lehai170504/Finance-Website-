import { Activity, SearchX, Users } from "lucide-react";
import { TransactionCard } from "./TransactionCard";
import { TransactionPagination } from "./TransactionPagination";
import { Button } from "../ui/button";
import Link from "next/link";

interface GroupTabProps {
  groupId: string;
  groupsLength: number;
  groupData: any;
  groupTransactions: any[];
  isLoading: boolean;
  groupPage: number;
  setGroupPage: (page: number) => void;
  onEdit: (trans: any) => void;
  onDelete: (trans: any) => void;
}

export function GroupTab({
  groupId,
  groupsLength,
  groupData,
  groupTransactions,
  isLoading,
  groupPage,
  setGroupPage,
  onEdit,
  onDelete,
}: GroupTabProps) {
  return (
    <div className="flex flex-col min-h-125">
      {/* HEADER */}
      <div className="flex justify-between items-end px-1 min-h-9 mb-6">
        <h3 className="font-black uppercase tracking-[0.15em] text-[11px] text-muted-foreground/80">
          Giao dịch nhóm chung
        </h3>
        <div className="flex items-center justify-end gap-2 min-w-40">
          {groupId && groupsLength > 0 ? (
            <Link href={`/groups/${groupId}/logs`}>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 rounded-xl bg-primary/5 border-primary/20 hover:bg-primary hover:text-white text-primary text-[9px] font-black uppercase tracking-widest transition-all"
              >
                <Activity size={12} className="mr-1.5" /> Nhật ký
              </Button>
            </Link>
          ) : (
            <div className="w-21 h-7" />
          )}

          <span className="font-money text-[10px] font-bold uppercase bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/10 shrink-0">
            Tổng: {groupData?.totalElements || 0}
          </span>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 space-y-4">
        {groupsLength === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-[2.5rem] text-muted-foreground bg-card/30">
            <Users size={48} className="mb-4 opacity-10" />
            <span className="font-black uppercase tracking-[0.2em] text-[10px] opacity-60">
              Bạn chưa tham gia nhóm nào
            </span>
          </div>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-muted/40 rounded-3xl animate-pulse border border-border/50"
              />
            ))}
          </div>
        ) : groupTransactions.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed border-border/60 rounded-[2.5rem] text-muted-foreground bg-card/30">
            <SearchX size={48} className="mb-4 opacity-10" />
            <span className="font-black uppercase tracking-[0.2em] text-[10px] opacity-60">
              Chưa có giao dịch trong nhóm này
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {groupTransactions.map((trans) => (
              <TransactionCard
                key={trans.id}
                trans={trans}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* PAGINATION */}
      {groupData && groupData.totalPages > 1 && (
        <div className="pt-4 mt-auto border-t border-border/40">
          <TransactionPagination
            currentPage={groupPage}
            totalPages={groupData.totalPages}
            onPageChange={setGroupPage}
          />
        </div>
      )}
    </div>
  );
}
