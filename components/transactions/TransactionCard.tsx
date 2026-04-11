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
          "group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 border-2 border-border/40 rounded-3xl bg-card hover:shadow-xl hover:border-primary/30 transition-all duration-300 overflow-hidden",
          isTrash && "opacity-60 grayscale hover:grayscale-0 hover:opacity-100",
        )}
      >
        {/* VẠCH MÀU */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-1.5 transition-colors",
            isExpense ? "bg-red-500/80" : "bg-emerald-500/80",
          )}
        />

        <div className="flex items-center gap-4 w-full sm:w-auto pl-2">
          {/* ICON DANH MỤC */}
          <div
            className={cn(
              "w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-black text-lg shadow-sm border border-border/50 transition-transform group-hover:scale-105",
              isExpense
                ? "bg-red-500/5 text-red-500"
                : "bg-emerald-500/5 text-emerald-500",
            )}
          >
            {trans.categoryName?.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-col gap-1.5 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-bold tracking-tight p-2 text-foreground text-sm sm:text-base leading-none truncate max-w-37.5 sm:max-w-xs">
                {trans.note || trans.categoryName}
              </h4>

              {trans.receiptUrl && (
                <Button
                  onClick={() => setIsImageViewerOpen(true)}
                  variant="outline"
                  className="h-5 px-2 rounded-md border-primary/20 bg-primary/5 hover:bg-primary hover:text-white text-primary text-[9px] font-black uppercase tracking-tighter gap-1 transition-all"
                >
                  <Paperclip size={10} /> Bill
                </Button>
              )}
            </div>

            {/* BADGES THÔNG TIN - Typography nhỏ và tinh tế */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/40 px-2 py-1 rounded-lg">
                <CalendarDays size={10} /> {trans.date}
              </span>

              <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/40 px-2 py-1 rounded-lg">
                <Wallet size={10} /> {trans.walletName}
              </span>

              {!isPersonal && (
                <span className="flex items-center gap-1 text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded-lg border border-primary/10">
                  <Users size={10} /> {trans.groupName}
                </span>
              )}

              <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider bg-muted/40 px-2 py-1 rounded-lg">
                <Tag size={10} /> {trans.categoryName}
              </span>

              {!isPersonal && trans.userName && (
                <span className="text-[9px] font-bold text-muted-foreground/60 uppercase">
                  • {isOwner ? "BẠN" : trans.userName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* NỬA PHẢI: SỐ TIỀN + ACTIONS */}
        <div className="flex flex-row sm:flex-row-reverse w-full sm:w-auto items-center justify-between sm:justify-start gap-5 pl-[64px] sm:pl-0 pr-1">
          <div
            className={cn(
              "text-xl sm:text-2xl font-black tracking-tighter shrink-0 font-money",
              isExpense ? "text-red-500" : "text-emerald-500",
            )}
          >
            {isExpense ? "-" : "+"}
            {trans.amount?.toLocaleString()}
            <span className="text-xs ml-0.5 opacity-70">đ</span>
          </div>

          <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
            {isProfileLoading ? (
              <Loader2
                size={14}
                className="animate-spin text-muted-foreground mx-2"
              />
            ) : isTrash ? (
              isOwner && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRestore && onRestore(trans)}
                    className="w-8 h-8 rounded-xl bg-muted/50 hover:bg-emerald-500/10 hover:text-emerald-500"
                  >
                    <RotateCcw size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onForceDelete && onForceDelete(trans)}
                    className="w-8 h-8 rounded-xl bg-muted/50 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </Button>
                </>
              )
            ) : (
              isOwner && (
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
                    disabled={isUploading}
                    className="w-8 h-8 rounded-xl bg-muted/30 hover:bg-primary/10 hover:text-primary"
                    title="Đính kèm Bill"
                  >
                    {isUploading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <ImagePlus size={14} />
                    )}
                  </Button>

                  <Link href={`/transactions/${trans.id}/logs`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 rounded-xl bg-muted/30 hover:bg-primary/10 hover:text-primary"
                    >
                      <History size={14} />
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit && onEdit(trans)}
                    className="w-8 h-8 rounded-xl bg-muted/30 hover:bg-primary/10 hover:text-primary"
                  >
                    <Settings2 size={14} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete && onDelete(trans)}
                    className="w-8 h-8 rounded-xl bg-muted/30 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 size={14} />
                  </Button>
                </>
              )
            )}
          </div>
        </div>
      </div>

      <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
        <DialogContent className="max-w-3xl bg-transparent border-none p-0 flex justify-center items-center outline-none">
          <DialogTitle className="sr-only">Hình ảnh hóa đơn</DialogTitle>
          {trans.receiptUrl && (
            <img
              src={trans.receiptUrl}
              alt="Hóa đơn"
              className="max-h-[85vh] max-w-full object-contain rounded-3xl shadow-2xl border-4 border-white/10"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
