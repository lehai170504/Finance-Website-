"use client";

import { 
  CalendarDays, 
  User, 
  ArrowUpRight, 
  ArrowDownLeft,
  Utensils,
  Car,
  Home,
  ShoppingBag,
  Banknote,
  Gift,
  Gamepad2,
  HeartPulse,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface GroupTransactionListItemProps {
  trans: any;
  members: any[];
}

export function GroupTransactionListItem({ trans, members = [] }: GroupTransactionListItemProps) {
  const isExpense = trans.categoryType === "EXPENSE";
  
  // Lấy tên người tạo (Khớp với TransactionResponse.java: userName)
  const creatorName = trans.userName || trans.createdBy || "Thành viên";

  // Tìm thông tin người tạo trong danh sách members để lấy Avatar
  const creator = members.find(m => m.username === creatorName);
  const avatarUrl = creator?.avatarUrl;

  // HÀM HELPER LẤY ICON THEO DANH MỤC
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName?.toLowerCase() || "";
    const size = 22;
    const strokeWidth = 2.5;

    if (name.includes("ăn") || name.includes("uống") || name.includes("food")) return <Utensils size={size} strokeWidth={strokeWidth} />;
    if (name.includes("xe") || name.includes("đi lại") || name.includes("di chuyển") || name.includes("transport")) return <Car size={size} strokeWidth={strokeWidth} />;
    if (name.includes("nhà") || name.includes("ở") || name.includes("rent")) return <Home size={size} strokeWidth={strokeWidth} />;
    if (name.includes("mua") || name.includes("sắm") || name.includes("shop")) return <ShoppingBag size={size} strokeWidth={strokeWidth} />;
    if (name.includes("lương") || name.includes("thu nhập") || name.includes("salary")) return <Banknote size={size} strokeWidth={strokeWidth} />;
    if (name.includes("quà") || name.includes("tặng") || name.includes("gift")) return <Gift size={size} strokeWidth={strokeWidth} />;
    if (name.includes("game") || name.includes("giải trí") || name.includes("play")) return <Gamepad2 size={size} strokeWidth={strokeWidth} />;
    if (name.includes("sức khỏe") || name.includes("y tế") || name.includes("health")) return <HeartPulse size={size} strokeWidth={strokeWidth} />;
    
    return isExpense ? <ArrowDownLeft size={size} strokeWidth={strokeWidth} /> : <ArrowUpRight size={size} strokeWidth={strokeWidth} />;
  };

  return (
    <div className="group relative flex items-center justify-between p-6 md:p-8 border-2 border-border/40 rounded-[2.5rem] bg-card hover:bg-muted/5 hover:border-primary/30 transition-all duration-500 shadow-xl shadow-black/5 hover:shadow-primary/5 relative overflow-hidden font-sans">
      
      {/* Indicative Bar */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-2 transition-all duration-500 group-hover:w-3",
          isExpense ? "bg-rose-500" : "bg-emerald-500",
        )}
      />

      <div className="flex items-center gap-6 md:gap-10 pl-2 w-full">
        {/* CATEGORY ICON HUB */}
        <div className="relative shrink-0">
          <div
            className={cn(
              "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 border-2 border-background",
              isExpense
                ? "bg-rose-500 text-white shadow-rose-500/20"
                : "bg-emerald-500 text-white shadow-emerald-500/20",
            )}
          >
            {getCategoryIcon(trans.categoryName)}
          </div>
          <div className={cn(
             "absolute -bottom-1 -right-1 w-7 h-7 rounded-xl border-2 border-card flex items-center justify-center shadow-lg",
             isExpense ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
          )}>
             {isExpense ? <ArrowDownLeft size={14} strokeWidth={3} /> : <ArrowUpRight size={14} strokeWidth={3} />}
          </div>
        </div>

        {/* DETAILS HUB */}
        <div className="flex-1 space-y-4 min-w-0">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h4 className="font-black tracking-tighter text-xl text-foreground/90 truncate max-w-[300px] leading-tight uppercase group-hover:text-primary transition-colors p-1">
              {trans.note || trans.categoryName}
            </h4>
            <div className="flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-xl border border-border/40 w-fit">
               <Tag size={12} className="text-muted-foreground/40" />
               <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                 {trans.categoryName}
               </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Date Badge */}
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-tighter bg-muted/30 px-4 py-2 rounded-2xl border border-border/20 shadow-inner">
              <CalendarDays size={14} className="opacity-40 text-primary" /> 
              <span className="font-money">{trans.date}</span>
            </div>
            
            {/* CREATOR HUB - FIXED FIELD NAME */}
            <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-3 py-2 rounded-2xl border border-primary/20 hover:bg-primary/10 transition-all cursor-default shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-background shadow-lg">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={creatorName} width={32} height={32} className="object-cover" />
                ) : (
                  <User size={14} strokeWidth={3} />
                )}
              </div>
              <div className="flex flex-col items-start leading-tight pr-1">
                 <span className="text-[7px] text-muted-foreground/60 mb-0.5 uppercase tracking-[0.2em]">Tạo bởi</span>
                 <span className="text-foreground/80">{creatorName}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AMOUNT HUB */}
        <div className="text-right flex flex-col items-end shrink-0">
          <div
            className={cn(
              "text-3xl md:text-5xl font-black tracking-tighter font-money flex items-center gap-1.5",
              isExpense ? "text-rose-600" : "text-emerald-600",
            )}
          >
            <span className="text-xl opacity-30">{isExpense ? "-" : "+"}</span>
            {trans.amount.toLocaleString()}
            <span className="text-sm ml-0.5 opacity-30 font-black">VNĐ</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-border/40" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
                Giao dịch nhóm
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
