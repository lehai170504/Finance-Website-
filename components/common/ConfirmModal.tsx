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
import { AlertTriangle, Loader2 } from "lucide-react";

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
      <AlertDialogContent className="rounded-[2rem] border-none p-8 max-w-md bg-background/95 backdrop-blur-2xl shadow-2xl outline-none font-sans">
        <AlertDialogHeader className="flex flex-col items-center text-center sm:text-left sm:items-start sm:flex-row gap-5">
          {/* ICON CẢNH BÁO CAO CẤP */}
          <div className="p-4 bg-destructive/10 text-destructive rounded-2xl shrink-0 shadow-inner flex items-center justify-center border border-destructive/10 animate-pulse">
            <AlertTriangle size={28} strokeWidth={2.5} />
          </div>

          <div className="space-y-2 flex-1 pt-1">
            <AlertDialogTitle className="text-2xl font-black uppercase tracking-tighter text-foreground leading-none">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm font-medium text-muted-foreground/80 leading-relaxed">
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-10 flex flex-col-reverse sm:flex-row gap-3">
          <AlertDialogCancel
            disabled={isLoading}
            className="mt-0 w-full sm:w-auto rounded-xl font-bold uppercase tracking-widest text-[10px] h-12 px-6 border-2 border-border/50 hover:bg-muted transition-all active:scale-95"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className="w-full sm:w-auto rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-8 bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-300 shadow-xl shadow-destructive/20 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={14} />
                <span>ĐANG XỬ LÝ</span>
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
