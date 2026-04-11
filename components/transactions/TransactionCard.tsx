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
  Users, // Import thêm icon Users cho đẹp
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
          "group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 sm:p-6 border-2 border-border/50 rounded-[2.5rem] bg-card hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden",
          isTrash && "opacity-60 grayscale hover:grayscale-0 hover:opacity-100",
        )}
      >
        {/* VẠCH MÀU ĐỊNH DANH BÊN TRÁI */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-2 transition-colors",
            isExpense ? "bg-red-500" : "bg-emerald-500",
          )}
        />

        {/* NỬA TRÁI: ICON + THÔNG TIN CHI TIẾT */}
        <div className="flex items-center gap-4 w-full sm:w-auto pl-2 sm:pl-3">
          {/* ICON DANH MỤC */}
          <div
            className={cn(
              "w-14 h-14 shrink-0 rounded-[1.25rem] flex items-center justify-center font-black text-xl shadow-inner transition-transform group-hover:scale-105",
              isExpense
                ? "bg-red-500/10 text-red-500"
                : "bg-emerald-500/10 text-emerald-500",
            )}
          >
            {trans.categoryName?.charAt(0).toUpperCase()}
          </div>

          <div className="flex flex-col gap-2 flex-1">
            {/* DÒNG 1: TIÊU ĐỀ VÀ NÚT XEM ẢNH */}
            <div className="flex items-center gap-3">
              <h4 className="font-black uppercase tracking-tight text-foreground text-base sm:text-lg leading-none truncate max-w-[180px] sm:max-w-md">
                {trans.note || trans.categoryName}
              </h4>

              {/* NÚT XEM HÓA ĐƠN DẠNG BADGE */}
              {trans.receiptUrl && (
                <Button
                  onClick={() => setIsImageViewerOpen(true)}
                  variant="outline"
                  className="h-6 px-2.5 rounded-lg border-primary/20 bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary text-[10px] font-black uppercase tracking-widest gap-1.5 transition-colors shadow-none"
                  title="Xem hóa đơn đính kèm"
                >
                  <Paperclip size={12} /> Bill
                </Button>
              )}
            </div>

            {/* DÒNG 2: BADGES THÔNG TIN */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/60 px-2.5 py-1.5 rounded-lg border border-border/50">
                <CalendarDays size={12} /> {trans.date}
              </span>

              {/* 🔥 HIỂN THỊ VÍ */}
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/60 px-2.5 py-1.5 rounded-lg border border-border/50">
                <Wallet size={12} /> {trans.walletName}
              </span>

              {/* 🔥 HIỂN THỊ TÊN NHÓM NẾU CÓ */}
              {!isPersonal && (
                <span className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-2.5 py-1.5 rounded-lg border border-primary/10">
                  <Users size={12} /> {trans.groupName}
                </span>
              )}

              <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/60 px-2.5 py-1.5 rounded-lg border border-border/50">
                <Tag size={12} /> {trans.categoryName}
              </span>

              {/* HIỂN THỊ NGƯỜI TẠO */}
              {!isPersonal && trans.userName && (
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest bg-muted/60 px-2.5 py-1.5 rounded-lg border border-border/50">
                  Bởi: {trans.userName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* NỬA PHẢI: SỐ TIỀN + CÁC NÚT HÀNH ĐỘNG */}
        <div className="flex flex-row sm:flex-row-reverse w-full sm:w-auto items-center justify-between sm:justify-start gap-4 pl-[72px] sm:pl-0 pr-2">
          {/* SỐ TIỀN */}
          <div
            className={cn(
              "text-2xl sm:text-3xl font-black tracking-tighter shrink-0",
              isExpense ? "text-red-500" : "text-emerald-500",
            )}
          >
            {isExpense ? "-" : "+"}
            {trans.amount?.toLocaleString()}đ
          </div>

          {/* NHÓM NÚT ACTION */}
          <div className="flex items-center gap-1.5 sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
            {isProfileLoading ? (
              <Button
                variant="ghost"
                size="icon"
                disabled
                className="rounded-xl bg-transparent border-transparent"
              >
                <Loader2
                  size={16}
                  className="animate-spin text-muted-foreground"
                />
              </Button>
            ) : isTrash ? (
              isOwner && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRestore && onRestore(trans)}
                    className="rounded-xl bg-muted/50 hover:bg-emerald-500/10 hover:text-emerald-500 text-muted-foreground border border-transparent hover:border-emerald-500/20"
                    title="Khôi phục"
                  >
                    <RotateCcw size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onForceDelete && onForceDelete(trans)}
                    className="rounded-xl bg-muted/50 hover:bg-destructive/10 hover:text-destructive text-muted-foreground border border-transparent hover:border-destructive/20"
                    title="Xóa vĩnh viễn"
                  >
                    <Trash2 size={16} />
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
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleFileChange}
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary text-muted-foreground border border-transparent hover:border-primary/20"
                    title={
                      trans.receiptUrl ? "Đổi hóa đơn khác" : "Đính kèm hóa đơn"
                    }
                  >
                    {isUploading ? (
                      <Loader2
                        size={16}
                        className="animate-spin text-primary"
                      />
                    ) : (
                      <ImagePlus size={16} />
                    )}
                  </Button>

                  <Link href={`/transactions/${trans.id}/logs`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary text-muted-foreground border border-transparent hover:border-primary/20"
                      title="Xem chi tiết lịch sử"
                    >
                      <History size={16} />
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit && onEdit(trans)}
                    className="rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary text-muted-foreground border border-transparent hover:border-primary/20"
                    title="Sửa giao dịch"
                  >
                    <Settings2 size={16} />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete && onDelete(trans)}
                    className="rounded-xl bg-muted/50 hover:bg-destructive/10 hover:text-destructive text-muted-foreground border border-transparent hover:border-destructive/20"
                    title="Xóa giao dịch"
                  >
                    <Trash2 size={16} />
                  </Button>
                </>
              )
            )}
          </div>
        </div>
      </div>

      {/* POPUP PHÓNG TO HÓA ĐƠN */}
      <Dialog open={isImageViewerOpen} onOpenChange={setIsImageViewerOpen}>
        <DialogContent className="max-w-3xl bg-transparent border-none shadow-none p-0 flex justify-center items-center outline-none">
          <DialogTitle className="sr-only">Hình ảnh hóa đơn</DialogTitle>
          {trans.receiptUrl && (
            <img
              src={trans.receiptUrl}
              alt="Hóa đơn giao dịch"
              className="max-h-[85vh] max-w-full object-contain rounded-[2rem] shadow-2xl border-4 border-white/20"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
