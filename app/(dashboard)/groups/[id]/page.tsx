"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

// Hooks
import { useGroupById } from "@/hooks/useGroups";
import { useGroupTransactions } from "@/hooks/useTransactions";
import { useGroupDetails } from "@/hooks/useGroupDetails";
import { useProfile } from "@/hooks/useProfile";

// Icons
import {
  ChevronLeft,
  ReceiptText,
  PieChart,
  HandCoins,
  Users,
  CalendarDays,
  Sparkles,
  Loader2,
  Copy,
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

  const { data: user } = useProfile();

  const { data: groupResponse, isLoading: isGroupLoading } = useGroupById(id);
  const currentGroup = groupResponse?.data;

  const { data: transData, isLoading: isTransLoading } = useGroupTransactions(
    id,
    page,
  );
  const transactions = transData?.data?.content || [];

  const { stats, isStatsLoading, debts, isDebtsLoading, settleDebt } =
    useGroupDetails(id, month, year);

  const visibleMembers = currentGroup?.members?.slice(0, 6) || [];
  const hiddenCount = (currentGroup?.members?.length || 0) - 6;

  const handleCopyCode = () => {
    if (currentGroup?.inviteCode) {
      navigator.clipboard.writeText(currentGroup.inviteCode);
      toast.success("Đã sao chép mã nhóm! Gửi cho đồng đội ngay nhé");
    }
  };

  if (isGroupLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] font-sans">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
        <p className="font-black uppercase tracking-[0.3em] text-primary animate-pulse text-[10px]">
          Đang kết nối không gian nhóm...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-12 font-sans mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECTION - PREMIUM HUB */}
      <div className="relative p-8 md:p-12 border-2 border-border/40 rounded-[3.5rem] bg-card shadow-2xl shadow-black/5 overflow-hidden group/header">
        {/* Glow nền mờ ảo */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-10 relative z-10">
          <div className="space-y-8 w-full xl:w-auto">
            <button
              onClick={() => router.push("/groups")}
              className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-all group/back"
            >
              <div className="p-2 bg-muted/40 rounded-xl border border-border/40 group-hover/back:bg-primary/10 group-hover/back:border-primary/20 transition-all">
                <ChevronLeft size={14} strokeWidth={3} className="group-hover/back:-translate-x-1 transition-transform" />
              </div>
              Về không gian chung
            </button>

            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 text-[9px] font-black bg-primary text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">
                  <Sparkles size={10} /> Group Hub v3.0
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-money font-bold text-muted-foreground/80 bg-muted/50 px-3 py-1 rounded-full border border-border/40 uppercase tracking-tighter">
                  <CalendarDays size={12} /> {month.toString().padStart(2, "0")}/{year}
                </span>
              </div>

              <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none text-foreground">
                {currentGroup?.name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                {/* Join Code Badge */}
                <div 
                  onClick={handleCopyCode}
                  className="flex items-center gap-3 bg-primary/5 hover:bg-primary/10 transition-all cursor-pointer px-5 py-2.5 rounded-2xl border-2 border-dashed border-primary/20 group/code"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">Mã mời:</span>
                  <span className="font-money font-bold text-xl text-primary tracking-widest">{currentGroup?.inviteCode}</span>
                  <Copy size={14} className="text-primary/40 group-hover/code:text-primary transition-colors" />
                </div>

                {/* Member Avatars */}
                <div className="flex items-center gap-3 bg-muted/30 px-4 py-2 rounded-2xl border border-border/40 backdrop-blur-sm">
                  <div className="flex -space-x-3">
                    {visibleMembers.map((m: any, i: number) => {
                       const avatar = m.email === user?.email ? user?.avatarUrl : m.avatarUrl;
                       return (
                        <div 
                          key={i} 
                          className="w-9 h-9 rounded-full border-2 border-card bg-muted flex items-center justify-center overflow-hidden shadow-lg transition-transform hover:scale-110 hover:z-20 group/avatar"
                        >
                           {avatar ? (
                             <Image src={avatar} alt={m.username} width={36} height={36} className="object-cover" />
                           ) : (
                             <span className="text-[10px] font-black uppercase text-muted-foreground/60">{m.username.charAt(0)}</span>
                           )}
                        </div>
                       )
                    })}
                  </div>
                  {hiddenCount > 0 && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">
                      + {hiddenCount} Homies
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* NAVIGATION TABS - GLASS STYLE */}
          <div className="flex flex-wrap p-2 bg-muted/40 backdrop-blur-xl rounded-[2.5rem] border border-border/40 shadow-inner w-full xl:w-auto">
            {[
              { id: "TRANSACTIONS", label: "Sổ giao dịch", icon: ReceiptText },
              { id: "STATS", label: "Phân tích", icon: PieChart },
              { id: "DEBTS", label: "Quyết toán", icon: HandCoins },
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
                    "flex-1 xl:flex-none flex items-center justify-center gap-3 px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                    isActive
                      ? "bg-background shadow-2xl shadow-black/10 text-primary scale-105 border border-border/50"
                      : "text-muted-foreground/60 hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <tab.icon size={16} strokeWidth={isActive ? 3 : 2} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TAB CONTENT AREA */}
      <main className="min-h-[500px]">
        <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
          {activeTab === "TRANSACTIONS" && (
            <GroupTransactionsTab
              transactions={transactions}
              members={currentGroup?.members || []}
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
