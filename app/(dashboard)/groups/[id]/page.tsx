"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Hooks
import { useGroupById } from "@/hooks/useGroups";
import { useGroupTransactions } from "@/hooks/useTransactions";
import { useGroupDetails } from "@/hooks/useGroupDetails";

// Icons
import {
  ChevronLeft,
  ReceiptText,
  PieChart,
  HandCoins,
  Users,
  CalendarDays,
} from "lucide-react";

// Components & UI
import { GroupTransactionsTab } from "@/components/groups/GroupTransactionsTab";
import { GroupStatsTab } from "@/components/groups/GroupStatsTab";
import { GroupDebtsTab } from "@/components/groups/GroupDebtsTab";
import { cn } from "@/lib/utils";

type TabType = "TRANSACTIONS" | "STATS" | "DEBTS";

export default function GroupDetailPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("TRANSACTIONS");
  const [page, setPage] = useState(0);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: groupResponse, isLoading: isGroupLoading } = useGroupById(id);
  const currentGroup = groupResponse?.data;

  const { data: transData, isLoading: isTransLoading } = useGroupTransactions(
    id,
    page,
  );
  const transactions = transData?.data?.content || [];

  const { stats, isStatsLoading, debts, isDebtsLoading, settleDebt } =
    useGroupDetails(id, month, year);

  const visibleMembers = currentGroup?.members?.slice(0, 5) || [];
  const hiddenCount = (currentGroup?.members?.length || 0) - 5;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 mt-4 animate-in fade-in duration-500">
      {/* NÚT BACK SIÊU MƯỢT */}
      <div className="flex justify-between items-center mb-10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all group"
        >
          <div className="p-2 bg-muted/50 rounded-xl group-hover:bg-primary/10 transition-colors">
            <ChevronLeft
              size={14}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </div>
          Quay lại không gian chung
        </button>
      </div>

      {/* HEADER SECTION: TÊN NHÓM & THÀNH VIÊN */}
      <div className="mb-12 border-b border-border/50 pb-12">
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-[2rem] text-primary flex items-center justify-center shadow-inner shrink-0 transition-transform hover:rotate-3">
            <Users size={36} strokeWidth={2.5} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg uppercase tracking-widest border border-emerald-500/10">
                Active Group
              </span>
              <span className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                <CalendarDays size={12} /> {month}/{year}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-foreground">
              {isGroupLoading ? (
                <div className="h-16 w-64 bg-muted animate-pulse rounded-2xl" />
              ) : (
                currentGroup?.name
              )}
            </h1>
          </div>
        </div>

        {/* MEMBER CHIPS */}
        <div className="flex flex-wrap items-center gap-3">
          {isGroupLoading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-24 h-8 bg-muted animate-pulse rounded-full"
              />
            ))
          ) : (
            <>
              {visibleMembers.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2.5 bg-background border-2 border-border/50 px-3.5 py-1.5 rounded-2xl hover:border-primary/30 transition-all hover:shadow-md cursor-default group/member"
                >
                  <div className="w-6 h-6 rounded-lg bg-primary/20 text-primary text-[10px] flex items-center justify-center font-black transition-colors group-hover/member:bg-primary group-hover/member:text-white">
                    {member.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-tight text-foreground/80">
                    {member.username}
                  </span>
                </div>
              ))}
              {hiddenCount > 0 && (
                <div className="text-[10px] font-black text-primary bg-primary/10 border-2 border-primary/20 px-4 py-1.5 rounded-2xl tracking-widest uppercase">
                  + {hiddenCount} Homies
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-muted/40 backdrop-blur-md rounded-[2rem] border-2 border-border/50 w-fit mb-12 shadow-sm">
        {[
          { id: "TRANSACTIONS", label: "Sổ giao dịch", icon: ReceiptText },
          { id: "STATS", label: "Phân tích chi", icon: PieChart },
          { id: "DEBTS", label: "Quyết toán nợ", icon: HandCoins },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as TabType);
              if (tab.id !== "TRANSACTIONS") setPage(0);
            }}
            className={cn(
              "flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
              activeTab === tab.id
                ? "bg-background shadow-xl text-primary scale-105"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50",
            )}
          >
            <tab.icon size={16} strokeWidth={2.5} /> {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT AREA */}
      <div className="min-h-[500px] animate-in slide-in-from-bottom-4 duration-700">
        {activeTab === "TRANSACTIONS" && (
          <GroupTransactionsTab
            transactions={transactions}
            totalElements={transData?.data?.totalElements || 0}
            totalPages={transData?.data?.totalPages || 0}
            isLoading={isTransLoading}
            page={page}
            setPage={setPage}
          />
        )}
        {activeTab === "STATS" && (
          <GroupStatsTab
            stats={stats}
            isLoading={isStatsLoading}
            month={month}
            setMonth={setMonth}
            year={year}
            setYear={setYear}
          />
        )}
        {activeTab === "DEBTS" && (
          <GroupDebtsTab
            debts={debts}
            isLoading={isDebtsLoading}
            settleDebt={settleDebt}
          />
        )}
      </div>
    </div>
  );
}
