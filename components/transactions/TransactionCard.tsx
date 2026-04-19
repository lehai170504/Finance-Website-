"use client";

import { useState, useRef } from "react";
import {
  Paperclip,
  CalendarDays,
  Wallet,
  Tag,
  RotateCcw,
  Trash2,
  ImagePlus,
  Loader2,
  Settings2,
  History,
  Users,
  MoreVertical,
  Utensils,
  Car,
  Home,
  ShoppingBag,
  Banknote,
  Gift,
  ArrowDownLeft,
  ArrowUpRight,
  Gamepad2,
  HeartPulse,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/hooks/useTransactions";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useProfile } from "@/hooks/useProfile";
import Link from "next/link";

interface TransactionCardProps {
  trans: any;
  isTrash?: boolean;
  onEdit?: (trans: any) => void;
  onDelete?: (trans: any) => void;
  onRestore?: (trans: any) => void;
  onForceDelete?: (trans: any) => void;
}

export function TransactionCard({
  trans,
  isTrash = false,
  onEdit,
  onDelete,
  onRestore,
  onForceDelete,
}: TransactionCardProps) {
  const isExpense = trans.categoryType === "EXPENSE";
  const { data: user, isLoading: isProfileLoading } = useProfile();

  const isPersonal = !trans.groupName;
  const isOwner = isPersonal || user?.username === trans.userName;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadReceipt } = useTransactions();

  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  const isUploading =
    uploadReceipt.isPending && uploadReceipt.variables?.id === trans.id;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File ảnh quá nặng! Vui lòng chọn ảnh dưới 5MB.");
        return;
      }
      uploadReceipt.mutate({ id: trans.id, file });
    }
  };

  // HÀM HELPER LẤY ICON THEO DANH MỤC
  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName?.toLowerCase() || "";
    if (name.includes("ăn") || name.includes("uống") || name.includes("food")) return <Utensils size={20} />;
    if (name.includes("xe") || name.includes("đi lại") || name.includes("di chuyển") || name.includes("transport")) return <Car size={20} />;
    if (name.includes("nhà") || name.includes("ở") || name.includes("rent")) return <Home size={20} />;
    if (name.includes("mua") || name.includes("sắm") || name.includes("shop")) return <ShoppingBag size={20} />;
    if (name.includes("lương") || name.includes("thu nhập") || name.includes("salary")) return <Banknote size={20} />;
    if (name.includes("quà") || name.includes("tặng") || name.includes("gift")) return <Gift size={20} />;
    if (name.includes("game") || name.includes("giải trí") || name.includes("play")) return <Gamepad2 size={20} />;
    if (name.includes("sức khỏe") || name.includes("y tế") || name.includes("health")) return <HeartPulse size={20} />;
    
    return isExpense ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />;
  };

  return (
    <>
      <div
        className={cn(
          "group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-2 border-border/40 rounded-[2rem] bg-card hover:shadow-2xl hover:border-primary/30 transition-all duration-500 overflow-hidden font-sans",
          isTrash && "opacity-60 grayscale hover:grayscale-0 hover:opacity-100",
        )}
      >
        {/* VẠCH MÀU CHỈ ĐỊNH LOẠI GIAO DỊCH */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1.5 transition-colors duration-500",
            isExpense ? "bg-red-500" : "bg-emerald-500",
          )}
        />

        <div className="flex items-center gap-4 w-full sm:w-auto pl-2 relative z-10">
          {/* ICON DANH MỤC */}
          <div
            className={cn(
              "w-12 h-12 shrink-0 rounded-[1.25rem] flex items-center justify-center shadow-lg border-2 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
              isExpense
                ? "bg-red-500/10 text-red-500 border-red-500/20"
                : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
            )}
          >
            {getCategoryIcon(trans.categoryName)}
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-black tracking-tight text-foreground text-sm sm:text-base leading-none truncate max-w-[140px] sm:max-w-xs uppercase p-2">
                {trans.note || trans.categoryName}
              </h4>

              {trans.receiptUrl && (
                <Button
                  onClick={() => setIsImageViewerOpen(true)}
                  variant="outline"
                  className="h-6 px-2 rounded-lg border-primary/20 bg-primary/5 hover:bg-primary hover:text-white text-primary text-[9px] font-black uppercase tracking-widest gap-1 transition-all active:scale-90 shrink-0"
                >
                  <Paperclip size={10} strokeWidth={3} /> Bill
                </Button>
              )}
            </div>

            {/* BADGES THÔNG TIN */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground/70 uppercase tracking-widest bg-muted/30 px-2 py-1 rounded-md border border-border/20">
                <CalendarDays size={10} /> {trans.date}
              </span>

              <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground/70 uppercase tracking-widest bg-muted/30 px-2 py-1 rounded-md border border-border/20">
                <Wallet size={10} /> {trans.walletName}
              </span>

              {!isPersonal && (
                <span className="flex items-center gap-1 text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-md border border-primary/20">
                  <Users size={10} strokeWidth={3} /> {trans.groupName}
                </span>
              )}

              {!isPersonal && trans.userName && (
                <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-tighter">
                  • {isOwner ? "BẠN" : trans.userName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* NỬA PHẢI: SỐ TIỀN + ACTIONS */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-6 ml-auto pr-1 relative z-10">
          {/* SỐ TIỀN: Cho nó luôn nằm trên cùng hoặc bên trái */}
          <div
            className={cn(
              "text-xl sm:text-2xl font-black tracking-tighter shrink-0 font-money leading-none",
              isExpense ? "text-red-500" : "text-emerald-600",
            )}
          >
            {isExpense ? "-" : "+"}
            {trans.amount?.toLocaleString()}
            <span className="text-[10px] ml-1 opacity-40 font-sans tracking-normal uppercase">
              vnđ
            </span>
          </div>

          {/* DÀN NÚT BẤM: Tinh chỉnh lại để không bao giờ bị lệch */}
          <div className="flex items-center gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-500">
            {isProfileLoading ? (
              <Loader2
                size={14}
                className="animate-spin text-muted-foreground/30 mx-2"
              />
            ) : (
              isOwner && (
                <div className="flex items-center gap-2">
                  {!isTrash ? (
                    <>
                      <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      
                      {/* NÚT SỬA LÀ NÚT CHÍNH */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit && onEdit(trans)}
                        className="w-9 h-9 rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                      >
                        <Settings2 size={16} strokeWidth={2.5} />
                      </Button>

                      {/* MENU CÁC TÁC VỤ KHÁC */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-9 h-9 rounded-xl bg-muted/20 hover:bg-muted text-muted-foreground transition-all"
                          >
                            <MoreVertical size={16} strokeWidth={2.5} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 shadow-2xl border-border/40 backdrop-blur-xl">
                          <DropdownMenuItem 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-primary/5 text-xs font-bold uppercase tracking-tight"
                          >
                            <ImagePlus size={14} className="text-primary" /> Đính kèm hóa đơn
                          </DropdownMenuItem>
                          
                          <Link href={`/transactions/${trans.id}/logs`}>
                            <DropdownMenuItem className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-primary/5 text-xs font-bold uppercase tracking-tight">
                              <History size={14} className="text-primary" /> Lịch sử thay đổi
                            </DropdownMenuItem>
                          </Link>

                          <DropdownMenuSeparator className="my-1 bg-border/40" />
                          
                          <DropdownMenuItem 
                            onClick={() => onDelete && onDelete(trans)}
                            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer text-destructive hover:bg-destructive/5 text-xs font-bold uppercase tracking-tight"
                          >
                            <Trash2 size={14} /> Chuyển vào thùng rác
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRestore && onRestore(trans)}
                        className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                      >
                        <RotateCcw size={16} strokeWidth={2.5} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onForceDelete && onForceDelete(trans)}
                        className="w-9 h-9 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm"
                      >
                        <Trash2 size={16} strokeWidth={2.5} />
                      </Button>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
        <DialogContent className="max-w-4xl bg-black/90 border-none p-0 overflow-hidden flex justify-center items-center outline-none rounded-[2rem]">
          <DialogTitle className="sr-only">Hình ảnh hóa đơn</DialogTitle>
          {trans.receiptUrl && (
            <img
              src={trans.receiptUrl}
              alt="Hóa đơn"
              className="max-h-[90vh] w-auto object-contain animate-in zoom-in-95 duration-300"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
