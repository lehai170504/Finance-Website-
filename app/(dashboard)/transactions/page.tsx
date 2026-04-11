"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTransactions, useGroupTransactions } from "@/hooks/useTransactions";
import { useGroups } from "@/hooks/useGroups";
import {
  ReceiptText,
  List,
  Trash2,
  ArrowUpCircle,
  ArrowDownCircle,
  Search,
  Filter,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Import Components & UI
import { SummaryCard } from "@/components/common/SummaryCard";
import { PersonalTab } from "@/components/transactions/PersonalTab";
import { GroupTab } from "@/components/transactions/GroupTab";
import { TrashTab } from "@/components/transactions/TrashTab";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import Modals
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { EditTransactionModal } from "@/components/modals/EditTransactionModal";

type TabType = "LIST" | "GROUP" | "TRASH";
type FilterType = "ALL" | "INCOME" | "EXPENSE";

export default function TransactionsPage() {
  const searchParams = useSearchParams();

  const [page, setPage] = useState(0);
  const [groupPage, setGroupPage] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>("LIST");

  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const size = 10;

  // 💡 LẮNG NGHE URL ĐỂ TỰ ĐỘNG CHUYỂN TAB
  useEffect(() => {
    const tabQuery = searchParams.get("tab");
    if (tabQuery === "GROUP" || tabQuery === "LIST" || tabQuery === "TRASH") {
      setActiveTab(tabQuery as TabType);
    }
  }, [searchParams]);

  const {
    data,
    transactions,
    isLoading,
    totalIncome,
    totalExpense,
    trash,
    isTrashLoading,
    updateTransaction,
    deleteTransaction,
    restoreTransaction,
    forceDeleteTransaction,
  } = useTransactions(page, size, keyword, filterType);

  const { groups } = useGroups();
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  useEffect(() => {
    if (groups.length > 0 && !selectedGroupId) setSelectedGroupId(groups[0].id);
  }, [groups, selectedGroupId]);

  const { data: groupData, isLoading: isGroupLoading } = useGroupTransactions(
    selectedGroupId,
    groupPage,
  );
  const groupTransactions = groupData?.data?.content || [];

  // STATE QUẢN LÝ MODAL
  const [transToEdit, setTransToEdit] = useState<any>(null);
  const [transToDelete, setTransToDelete] = useState<any>(null);
  const [transToForceDelete, setTransToForceDelete] = useState<any>(null);

  // HÀM XỬ LÝ SỬA/XÓA
  const handleUpdate = (payload: any) => {
    updateTransaction.mutate(payload, {
      onSuccess: () => setTransToEdit(null),
    });
  };

  const confirmDelete = () => {
    if (transToDelete) {
      deleteTransaction.mutate(transToDelete.id, {
        onSuccess: () => setTransToDelete(null),
      });
    }
  };

  const confirmForceDelete = () => {
    if (transToForceDelete) {
      forceDeleteTransaction.mutate(transToForceDelete.id, {
        onSuccess: () => setTransToForceDelete(null),
      });
    }
  };

  // HÀM KHÔI PHỤC TRỰC TIẾP
  const handleRestore = (trans: any) => {
    restoreTransaction.mutate(trans.id);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setKeyword(searchInput);
      setPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleFilterChange = (type: FilterType) => {
    setFilterType(type);
    setSearchInput("");
    setKeyword("");
    setPage(0);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    if (filterType !== "ALL") setFilterType("ALL");
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 mt-4 space-y-8">
      {/* HEADER & SUMMARY CARDS */}
      <div className="flex flex-col space-y-6 mb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase leading-none flex items-center gap-3 text-foreground">
            <ReceiptText className="text-primary" size={36} /> Sổ giao dịch
          </h1>
          <p className="text-muted-foreground font-medium mt-2">
            Quản lý và tra cứu mọi luồng tiền ra vào của bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SummaryCard
            title="Tổng Thu Nhập"
            amount={totalIncome}
            icon={<ArrowUpCircle size={32} className="text-emerald-500" />}
            className="bg-emerald-500/5 border-emerald-500/20"
          />
          <SummaryCard
            title="Tổng Chi Tiêu"
            amount={totalExpense}
            icon={<ArrowDownCircle size={32} className="text-destructive" />}
            className="bg-destructive/5 border-destructive/20"
          />
        </div>
      </div>

      {/* TABS & CONTROLS BARS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-1.5 bg-muted/40 rounded-[2rem] border-2 border-border/50 shadow-sm backdrop-blur-md">
        {/* TAB NAVIGATION */}
        <div className="flex w-full md:w-auto bg-muted/50 p-1 rounded-[1.5rem]">
          <button
            onClick={() => {
              setActiveTab("LIST");
              setPage(0);
            }}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
              activeTab === "LIST"
                ? "bg-background shadow-md text-primary scale-100"
                : "text-muted-foreground hover:text-foreground scale-95 hover:scale-100",
            )}
          >
            <List size={16} /> Cá nhân
          </button>
          <button
            onClick={() => {
              setActiveTab("GROUP");
              setPage(0);
            }}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
              activeTab === "GROUP"
                ? "bg-background shadow-md text-primary scale-100"
                : "text-muted-foreground hover:text-foreground scale-95 hover:scale-100",
            )}
          >
            <Users size={16} /> Nhóm
          </button>
          <button
            onClick={() => {
              setActiveTab("TRASH");
              setPage(0);
            }}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
              activeTab === "TRASH"
                ? "bg-destructive/10 text-destructive shadow-md scale-100"
                : "text-muted-foreground hover:text-destructive scale-95 hover:scale-100",
            )}
          >
            <Trash2 size={16} /> Đã xóa
          </button>
        </div>

        {/* CONTROLS (Search/Filter cho LIST) */}
        {activeTab === "LIST" && (
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto p-1 px-2">
            <div className="relative w-full sm:w-56">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={14}
              />
              <Input
                type="text"
                placeholder="Tìm ghi chú..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full h-10 pl-9 rounded-xl bg-background text-xs font-bold"
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <Filter
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none"
                size={14}
              />
              <Select
                value={filterType}
                onValueChange={(val) => handleFilterChange(val as FilterType)}
              >
                <SelectTrigger className="w-full sm:w-36 h-10 pl-9 rounded-xl bg-background text-[10px] font-black uppercase tracking-widest">
                  <SelectValue placeholder="Bộ lọc" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">TẤT CẢ</SelectItem>
                  <SelectItem value="INCOME">THU NHẬP</SelectItem>
                  <SelectItem value="EXPENSE">CHI TIÊU</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* CONTROLS (Dropdown Nhóm cho GROUP) */}
        {activeTab === "GROUP" && (
          <div className="flex items-center gap-2 w-full md:w-auto p-1 px-2">
            <div className="relative w-full sm:w-64">
              <Users
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none"
                size={14}
              />
              <Select
                value={selectedGroupId}
                onValueChange={(val) => {
                  setSelectedGroupId(val);
                  setGroupPage(0);
                }}
              >
                <SelectTrigger className="w-full h-10 pl-9 rounded-xl bg-background text-[10px] font-black uppercase tracking-widest">
                  <SelectValue placeholder="Chọn nhóm" />
                </SelectTrigger>
                <SelectContent>
                  {groups.length === 0 ? (
                    <SelectItem value="empty" disabled>
                      CHƯA CÓ NHÓM NÀO
                    </SelectItem>
                  ) : (
                    groups.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* RENDER CONTENT DỰA TRÊN TAB */}
      <div className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
        {activeTab === "LIST" && (
          <PersonalTab
            keyword={keyword}
            filterType={filterType}
            data={data}
            transactions={transactions}
            isLoading={isLoading}
            page={page}
            setPage={setPage}
            onEdit={setTransToEdit}
            onDelete={setTransToDelete}
          />
        )}
        {activeTab === "GROUP" && (
          <GroupTab
            groupsLength={groups.length}
            groupData={groupData?.data}
            groupTransactions={groupTransactions}
            isLoading={isGroupLoading}
            groupPage={groupPage}
            setGroupPage={setGroupPage}
            onEdit={setTransToEdit}
            onDelete={setTransToDelete}
            groupId={selectedGroupId}
          />
        )}
        {activeTab === "TRASH" && (
          <TrashTab
            trash={trash}
            isLoading={isTrashLoading}
            onRestore={handleRestore}
            onForceDelete={setTransToForceDelete}
          />
        )}
      </div>

      {/* HIỂN THỊ MODALS */}
      <EditTransactionModal
        isOpen={!!transToEdit}
        onClose={() => setTransToEdit(null)}
        transaction={transToEdit}
        onUpdate={handleUpdate}
        isUpdating={updateTransaction.isPending}
      />

      {/* Modal Xóa mềm (Vào thùng rác) */}
      <ConfirmModal
        isOpen={!!transToDelete}
        onClose={() => setTransToDelete(null)}
        onConfirm={confirmDelete}
        title="Chuyển vào thùng rác?"
        description={`Bạn có chắc chắn muốn xóa khoản ${transToDelete?.categoryType === "INCOME" ? "thu" : "chi"} "${transToDelete?.note || transToDelete?.categoryName}" (${transToDelete?.amount?.toLocaleString()}đ)? Số tiền này sẽ tự động được hoàn lại vào ví của bạn.`}
        isLoading={deleteTransaction.isPending}
      />

      {/* Modal Xóa vĩnh viễn */}
      <ConfirmModal
        isOpen={!!transToForceDelete}
        onClose={() => setTransToForceDelete(null)}
        onConfirm={confirmForceDelete}
        title="Xóa vĩnh viễn!"
        description={`CẢNH BÁO: Hành động này sẽ xóa hoàn toàn giao dịch "${transToForceDelete?.note || transToForceDelete?.categoryName}" khỏi hệ thống và KHÔNG THỂ khôi phục lại. Bạn có chắc chắn?`}
        isLoading={forceDeleteTransaction.isPending}
      />
    </div>
  );
}
