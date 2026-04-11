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
  Sparkles,
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
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 mt-6 font-sans mb-20 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex justify-between items-center mb-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-all group"
        >
          <div className="p-2.5 bg-muted/40 rounded-xl border border-border/40 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all shadow-sm">
            <ChevronLeft
              size={14}
              strokeWidth={3}
              className="group-hover:-translate-x-1 transition-transform"
            />
          </div>
          Trở về không gian chung
        </button>
      </div>

      {/* HEADER SECTION: TỔNG QUAN NHÓM */}
      <div className="mb-14 space-y-10 border-b border-border/40 pb-14 relative overflow-hidden">
        {/* Glow nền mờ ảo */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div className="flex flex-col md:flex-row md:items-center gap-8 relative z-10">
            <div className="w-24 h-24 bg-primary/10 rounded-[2.5rem] text-primary flex items-center justify-center shadow-inner border border-primary/20 transition-all hover:scale-105 hover:rotate-3 group">
              <Users
                size={42}
                strokeWidth={2.5}
                className="group-hover:animate-pulse"
              />
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-[9px] font-black bg-primary text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20 border border-primary/20">
                  <Sparkles size={10} /> Không gian hoạt động
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-money font-bold text-muted-foreground/80 bg-muted/50 px-3 py-1 rounded-full border border-border/40 uppercase tracking-tighter">
                  <CalendarDays size={12} /> {month.toString().padStart(2, "0")}
                  /{year}
                </span>
              </div>
              <h1 className="text-5xl md:text-8xl font-black p-2 tracking-tighter uppercase leading-[0.85] text-foreground">
                {isGroupLoading ? (
                  <div className="h-16 w-80 bg-muted/60 animate-pulse rounded-2xl" />
                ) : (
                  currentGroup?.name
                )}
              </h1>
            </div>
          </div>

          {/* MEMBER CHIPS - Thiết kế lại gọn và sang hơn */}
          <div className="flex flex-wrap items-center gap-2 relative z-10">
            {isGroupLoading ? (
              [1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-24 h-9 bg-muted/60 animate-pulse rounded-xl"
                />
              ))
            ) : (
              <>
                {visibleMembers.map((member: any) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2.5 bg-background/40 backdrop-blur-sm border border-border/60 px-3.5 py-2 rounded-xl hover:border-primary/40 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-default group/member"
                  >
                    <div className="w-6 h-6 rounded-lg bg-primary/10 text-primary text-[10px] flex items-center justify-center font-black transition-all group-hover/member:bg-primary group-hover/member:text-white group-hover/member:scale-110">
                      {member.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-tight text-foreground/70">
                      {member.username}
                    </span>
                  </div>
                ))}
                {hiddenCount > 0 && (
                  <div className="text-[10px] font-black text-primary bg-primary/5 border border-primary/20 px-4 py-2 rounded-xl tracking-widest uppercase shadow-sm">
                    + {hiddenCount} Homies
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS: DẠNG GLASSMORPHISM */}
      <div className="sticky top-20 z-40 mb-12">
        <div className="flex p-1.5 bg-muted/40 backdrop-blur-xl rounded-[2rem] border border-border/40 w-fit mx-auto md:mx-0 shadow-2xl shadow-black/5">
          {[
            { id: "TRANSACTIONS", label: "Sổ giao dịch", icon: ReceiptText },
            { id: "STATS", label: "Phân tích chi", icon: PieChart },
            { id: "DEBTS", label: "Quyết toán nợ", icon: HandCoins },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  if (tab.id !== "TRANSACTIONS") setPage(0);
                }}
                className={cn(
                  "flex items-center gap-2.5 px-6 py-3.5 rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-500",
                  isActive
                    ? "bg-background shadow-xl text-primary scale-105 border border-border/50"
                    : "text-muted-foreground/60 hover:text-foreground hover:bg-background/40",
                )}
              >
                <tab.icon size={16} strokeWidth={isActive ? 3 : 2} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB CONTENT AREA */}
      <main className="min-h-[500px]">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
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
      </main>
    </div>
  );
}
