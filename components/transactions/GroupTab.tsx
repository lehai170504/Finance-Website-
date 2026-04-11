import { Activity, Link, SearchX, Users } from "lucide-react";
import { TransactionCard } from "./TransactionCard";
import { TransactionPagination } from "./TransactionPagination";
import { Button } from "../ui/button";

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <h3 className="font-black uppercase tracking-widest text-sm text-muted-foreground">
          Giao dịch nhóm
        </h3>
        <div className="flex items-center gap-2">
          {groupId && groupsLength > 0 && (
            <Link href={`/groups/${groupId}/logs`}>
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-3 rounded-full bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest"
              >
                <Activity size={12} className="mr-1.5" /> Nhật ký nhóm
              </Button>
            </Link>
          )}
          <span className="text-[10px] font-bold uppercase bg-primary/10 text-primary px-3 py-1.5 rounded-full">
            Tổng: {groupData?.totalElements || 0}
          </span>
        </div>
      </div>

      {groupsLength === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed rounded-[3rem] text-muted-foreground bg-card">
          <Users size={48} className="mb-4 opacity-20" />
          <span className="font-black uppercase tracking-widest text-xs">
            Chưa tham gia nhóm
          </span>
        </div>
      ) : isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 bg-muted rounded-[2rem] animate-pulse"
            />
          ))}
        </div>
      ) : groupTransactions.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center border-2 border-dashed rounded-[3rem] text-muted-foreground bg-card">
          <SearchX size={48} className="mb-4 opacity-20" />
          <span className="font-black uppercase tracking-widest text-xs">
            Nhóm trống
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

      {groupData && groupData.totalPages > 1 && (
        <TransactionPagination
          currentPage={groupPage}
          totalPages={groupData.totalPages}
          onPageChange={setGroupPage}
        />
      )}
    </div>
  );
}
