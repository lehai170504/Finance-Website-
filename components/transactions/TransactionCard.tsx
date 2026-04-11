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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTransactions } from "@/hooks/useTransactions";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
              "w-12 h-12 shrink-0 rounded-xl flex items-center justify-center font-black text-lg shadow-inner border border-border/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
              isExpense
                ? "bg-red-500/10 text-red-500"
                : "bg-emerald-500/10 text-emerald-500",
            )}
          >
            {trans.categoryName?.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-black tracking-tight text-foreground text-sm sm:text-base leading-none truncate max-w-[140px] sm:max-w-xs uppercase">
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
          <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-500 bg-muted/5 sm:bg-transparent p-1 sm:p-0 rounded-xl">
            {isProfileLoading ? (
              <Loader2
                size={14}
                className="animate-spin text-muted-foreground/30 mx-2"
              />
            ) : (
              isOwner && (
                <div className="flex items-center gap-1">
                  {/* Group các nút lại để đảm bảo chúng đi cùng nhau */}
                  {!isTrash ? (
                    <>
                      <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-8 h-8 rounded-lg bg-muted/20 hover:bg-primary/10 hover:text-primary"
                      >
                        <ImagePlus size={14} strokeWidth={2.5} />
                      </Button>
                      <Link href={`/transactions/${trans.id}/logs`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 rounded-lg bg-muted/20 hover:bg-primary/10 hover:text-primary"
                        >
                          <History size={14} strokeWidth={2.5} />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit && onEdit(trans)}
                        className="w-8 h-8 rounded-lg bg-muted/20 hover:bg-primary/10 hover:text-primary"
                      >
                        <Settings2 size={14} strokeWidth={2.5} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete && onDelete(trans)}
                        className="w-8 h-8 rounded-lg bg-muted/20 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 size={14} strokeWidth={2.5} />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRestore && onRestore(trans)}
                        className="w-8 h-8 rounded-lg bg-muted/20 hover:bg-emerald-500/10 hover:text-emerald-500"
                      >
                        <RotateCcw size={14} strokeWidth={2.5} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onForceDelete && onForceDelete(trans)}
                        className="w-8 h-8 rounded-lg bg-muted/20 hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 size={14} strokeWidth={2.5} />
                      </Button>
                    </>
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
