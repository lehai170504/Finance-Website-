"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isLoading,
  confirmText = "XÁC NHẬN XÓA",
  cancelText = "HỦY BỎ",
}: ConfirmModalProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="rounded-[2.5rem] border-none p-6 sm:p-8 max-w-md bg-background/95 backdrop-blur-xl shadow-2xl outline-none">
        <AlertDialogHeader className="flex flex-col items-center text-center sm:text-left sm:items-start sm:flex-row gap-4 sm:gap-5">
          {/* CỤC ICON CẢNH BÁO */}
          <div className="p-3.5 bg-destructive/10 text-destructive rounded-2xl shrink-0 shadow-inner">
            <AlertTriangle size={28} strokeWidth={2.5} />
          </div>

          <div className="space-y-2 flex-1">
            <AlertDialogTitle className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-foreground">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] sm:text-sm font-medium text-muted-foreground leading-relaxed">
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:gap-2">
          <AlertDialogCancel
            disabled={isLoading}
            className="mt-0 sm:mt-0 w-full sm:w-auto rounded-2xl font-bold uppercase tracking-widest text-[11px] h-12 px-6 border-2 border-border/50 hover:bg-muted/50 transition-colors"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className="w-full sm:w-auto rounded-2xl font-black uppercase tracking-widest text-[11px] h-12 px-8 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-300 shadow-xl shadow-destructive/20 hover:scale-105 active:scale-95"
          >
            {isLoading ? "ĐANG XỬ LÝ..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
