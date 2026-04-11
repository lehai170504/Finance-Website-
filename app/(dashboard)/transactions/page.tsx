"use client";

import { useState, useEffect, Suspense } from "react";
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
  Loader2,
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

// 2. Tách toàn bộ logic cũ vào component này
function TransactionsContent() {
  const searchParams = useSearchParams();

  const [page, setPage] = useState(0);
  const [groupPage, setGroupPage] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>("LIST");

  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("ALL");
  const size = 10;

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

  const [transToEdit, setTransToEdit] = useState<any>(null);
  const [transToDelete, setTransToDelete] = useState<any>(null);
  const [transToForceDelete, setTransToForceDelete] = useState<any>(null);

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
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 mt-6 space-y-10 font-sans">
      {/* HEADER & SUMMARY CARDS */}
      <div className="flex flex-col space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none flex items-center gap-4 text-foreground">
            <div className="p-3 bg-primary/10 rounded-2xl shadow-inner">
              <ReceiptText
                className="text-primary"
                size={40}
                strokeWidth={2.5}
              />
            </div>
            Sổ giao dịch
          </h1>
          <p className="text-muted-foreground font-medium text-sm md:text-base ml-1">
            Quản lý và tra cứu dòng tiền cá nhân & nhóm chung.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SummaryCard
            title="Tổng Thu Nhập"
            amount={totalIncome}
            icon={<ArrowUpCircle size={32} className="text-emerald-500" />}
            className="bg-emerald-500/[0.03] border-emerald-500/20 rounded-3xl"
          />
          <SummaryCard
            title="Tổng Chi Tiêu"
            amount={totalExpense}
            icon={<ArrowDownCircle size={32} className="text-destructive" />}
            className="bg-destructive/[0.03] border-destructive/20 rounded-3xl"
          />
        </div>
      </div>

      {/* TABS & CONTROLS BARS */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 p-2 bg-muted/30 rounded-[2.5rem] border border-border/40 shadow-sm backdrop-blur-lg sticky top-4 z-40">
        <div className="flex bg-muted/50 p-1.5 rounded-[2rem] border border-border/20">
          <button
            onClick={() => {
              setActiveTab("LIST");
              setPage(0);
            }}
            className={cn(
              "flex-1 md:flex-none flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300",
              activeTab === "LIST"
                ? "bg-background shadow-xl text-primary border border-border/50"
                : "text-muted-foreground hover:text-foreground",
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
              "flex-1 md:flex-none flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300",
              activeTab === "GROUP"
                ? "bg-background shadow-xl text-primary border border-border/50"
                : "text-muted-foreground hover:text-foreground",
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
              "flex-1 md:flex-none flex items-center justify-center gap-2.5 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300",
              activeTab === "TRASH"
                ? "bg-destructive/10 text-destructive shadow-lg"
                : "text-muted-foreground hover:text-destructive",
            )}
          >
            <Trash2 size={16} /> Đã xóa
          </button>
        </div>

        <div className="flex flex-row items-center gap-3 px-2">
          {activeTab === "LIST" && (
            <>
              <div className="relative flex-1 sm:w-60 group">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary"
                  size={15}
                />
                <Input
                  type="text"
                  placeholder="Tìm giao dịch..."
                  value={searchInput}
                  onChange={handleSearchChange}
                  className="w-full h-11 pl-10 rounded-2xl bg-background border-border/50 text-xs font-bold"
                />
              </div>
              <Select
                value={filterType}
                onValueChange={(val) => handleFilterChange(val as FilterType)}
              >
                <SelectTrigger className="w-36 h-11 rounded-2xl bg-background border-border/50 text-[10px] font-black uppercase tracking-widest">
                  <Filter size={14} className="mr-2" />
                  <SelectValue placeholder="Bộ lọc" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="ALL">TẤT CẢ</SelectItem>
                  <SelectItem value="INCOME">THU NHẬP</SelectItem>
                  <SelectItem value="EXPENSE">CHI TIÊU</SelectItem>
                </SelectContent>
              </Select>
            </>
          )}

          {activeTab === "GROUP" && (
            <Select
              value={selectedGroupId}
              onValueChange={(val) => {
                setSelectedGroupId(val);
                setGroupPage(0);
              }}
            >
              <SelectTrigger className="w-full sm:w-64 h-11 rounded-2xl bg-background border-border/50 text-[10px] font-black uppercase tracking-widest">
                <Users size={14} className="mr-2" />
                <SelectValue placeholder="Chọn nhóm" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl">
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      <main className="min-h-[400px] pb-20">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
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
              groupId={selectedGroupId}
              groupsLength={groups.length}
              groupData={groupData?.data}
              groupTransactions={groupTransactions}
              isLoading={isGroupLoading}
              groupPage={groupPage}
              setGroupPage={setGroupPage}
              onEdit={setTransToEdit}
              onDelete={setTransToDelete}
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
      </main>

      {/* MODALS */}
      <EditTransactionModal
        isOpen={!!transToEdit}
        onClose={() => setTransToEdit(null)}
        transaction={transToEdit}
        onUpdate={handleUpdate}
        isUpdating={updateTransaction.isPending}
      />
      <ConfirmModal
        isOpen={!!transToDelete}
        onClose={() => setTransToDelete(null)}
        onConfirm={confirmDelete}
        title="Chuyển vào thùng rác?"
        description={`Khoản giao dịch sẽ được dọn dẹp khỏi sổ chính.`}
        isLoading={deleteTransaction.isPending}
      />
      <ConfirmModal
        isOpen={!!transToForceDelete}
        onClose={() => setTransToForceDelete(null)}
        onConfirm={confirmForceDelete}
        title="Xóa vĩnh viễn!"
        description={`Hành động này không thể khôi phục.`}
        isLoading={forceDeleteTransaction.isPending}
      />
    </div>
  );
}

// 3. Export mặc định bọc trong Suspense để fix lỗi Build
export default function TransactionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
            Đang tải dữ liệu giao dịch...
          </p>
        </div>
      }
    >
      <TransactionsContent />
    </Suspense>
  );
}
