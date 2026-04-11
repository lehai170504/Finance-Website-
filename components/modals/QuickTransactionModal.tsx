"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  AlignLeft,
  Calendar,
  CreditCard,
  Loader2,
  Plus,
  Sparkles,
  Tag,
  Users,
  Wallet,
  ScanLine,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Hooks
import { useWallets } from "@/hooks/useWallets";
import { useCategories } from "@/hooks/useCategories";
import {
  useTransactions,
  useSuggestCategory,
  useOCR,
} from "@/hooks/useTransactions";
import { useGroups } from "@/hooks/useGroups";

interface QuickTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickTransactionModal({
  isOpen,
  onClose,
}: QuickTransactionModalProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hooks lấy dữ liệu
  const { wallets, isLoading: isWalletsLoading } = useWallets();
  const { categories, isLoading: isCatsLoading } = useCategories();
  const { groups, isLoading: isGroupsLoading } = useGroups();
  const { createTransaction } = useTransactions();
  const { mutate: suggest, isPending: isSuggesting } = useSuggestCategory();
  const { mutate: analyze, isPending: isAnalyzing } = useOCR();

  const isInitialLoading = isWalletsLoading || isCatsLoading;

  const [formData, setFormData] = useState({
    amount: "",
    note: "",
    walletId: "",
    categoryId: "",
    spaceType: "PERSONAL" as "PERSONAL" | "GROUP",
    groupId: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    if (formData.note.trim().length < 2 || isAnalyzing) return;

    const timer = setTimeout(() => {
      suggest(formData.note, {
        onSuccess: (res) => {
          if (res.data) {
            setFormData((prev) => ({ ...prev, categoryId: res.data }));
          }
        },
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [formData.note, suggest, isAnalyzing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ảnh bự quá (trên 5MB), AI đọc không nổi homie ơi!");
        return;
      }
      analyze(file, {
        onSuccess: (res) => {
          if (res.data) {
            setFormData((prev) => ({
              ...prev,
              amount: res.data.amount.toString(),
              note: res.data.suggestedNote,
            }));
            toast.success("AI đã đọc hóa đơn xong!");
          }
        },
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.walletId || !formData.categoryId) {
      toast.error("Thiếu thông tin rồi homie ơi!");
      return;
    }

    if (formData.spaceType === "GROUP" && !formData.groupId) {
      toast.error("Vui lòng chọn nhóm muốn ghi chép!");
      return;
    }

    createTransaction.mutate(
      {
        walletId: formData.walletId,
        categoryId: formData.categoryId,
        groupId: formData.spaceType === "GROUP" ? formData.groupId : undefined,
        data: {
          amount: parseFloat(formData.amount),
          note: formData.note,
          date: formData.date,
        },
      },
      {
        onSuccess: () => {
          toast.success("Ghi chép thành công! 🚀");
          const targetTab = formData.spaceType === "GROUP" ? "GROUP" : "LIST";
          router.push(`/transactions?tab=${targetTab}`);
          resetForm();
          onClose();
        },
      },
    );
  };

  const resetForm = () => {
    setFormData({
      amount: "",
      note: "",
      walletId: "",
      categoryId: "",
      spaceType: "PERSONAL",
      groupId: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] rounded-[2.5rem] border-none p-0 overflow-hidden shadow-2xl bg-background outline-none font-sans">
        {isInitialLoading ? (
          <div className="h-[500px] flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
              Đang chuẩn bị sổ chép...
            </p>
          </div>
        ) : (
          <>
            {/* HEADER CAO CẤP + NÚT OCR */}
            <div className="bg-primary p-8 pb-12 text-primary-foreground relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />

              <div className="flex justify-between items-start relative z-10">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 text-white">
                    <div className="bg-white text-primary rounded-xl p-1.5 shadow-xl">
                      <Plus size={24} strokeWidth={4} />
                    </div>
                    Ghi nhanh
                  </DialogTitle>
                </DialogHeader>

                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                    className="bg-white/20 hover:bg-white/30 text-white rounded-2xl gap-2 border border-white/20 shadow-lg backdrop-blur-md h-10 px-4 transition-all active:scale-95"
                  >
                    {isAnalyzing ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <ScanLine size={16} />
                    )}
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Quét Bill
                    </span>
                  </Button>
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-6 -mt-8 bg-background rounded-t-[2.5rem] relative z-20"
            >
              {/* SỐ TIỀN - FONT MONEY SIÊU BỰ */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
                  <CreditCard size={12} /> Giá trị giao dịch
                </label>
                <div className="relative group">
                  <Input
                    type="number"
                    required
                    autoFocus
                    placeholder="0"
                    className={cn(
                      "h-16 px-5 rounded-2xl border-2 border-border/50 bg-muted/20 font-money text-3xl font-black tracking-tighter focus:bg-background transition-all pr-16 text-primary",
                      isAnalyzing && "animate-pulse opacity-50",
                    )}
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-xs opacity-30 border-l pl-3 border-border/50">
                    VNĐ
                  </div>
                </div>
              </div>

              {/* GHI CHÚ */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
                  <AlignLeft size={12} /> Nội dung ghi chép
                </label>
                <div className="relative group">
                  <Input
                    type="text"
                    required
                    placeholder="Mua trà sữa, ăn trưa..."
                    className={cn(
                      "h-14 px-5 rounded-2xl border-2 border-border/50 bg-muted/20 font-bold focus:bg-background transition-all pr-12",
                      isAnalyzing && "animate-pulse opacity-50",
                    )}
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                  />
                  {isSuggesting && !isAnalyzing && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Loader2
                        size={18}
                        className="animate-spin text-primary"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* VÍ */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
                    <Wallet size={12} /> Nguồn tiền
                  </label>
                  <Select
                    value={formData.walletId}
                    onValueChange={(val) =>
                      setFormData({ ...formData, walletId: val })
                    }
                  >
                    <SelectTrigger className="h-14 rounded-2xl border-2 border-border/50 font-bold">
                      <SelectValue placeholder="Chọn ví" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {wallets?.map((w: any) => (
                        <SelectItem
                          key={w.id}
                          value={w.id}
                          className="rounded-xl"
                        >
                          {w.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* DANH MỤC */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
                    <Tag size={12} /> Phân loại
                    {formData.categoryId && !isSuggesting && !isAnalyzing && (
                      <Sparkles
                        size={12}
                        className="text-yellow-500 animate-pulse"
                      />
                    )}
                  </label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(val) =>
                      setFormData({ ...formData, categoryId: val })
                    }
                  >
                    <SelectTrigger
                      className={cn(
                        "h-14 rounded-2xl border-2 border-border/50 font-bold transition-all",
                        (isSuggesting || isAnalyzing) &&
                          "opacity-40 pointer-events-none",
                      )}
                    >
                      <SelectValue placeholder="Loại" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {categories?.map((c: any) => (
                        <SelectItem
                          key={c.id}
                          value={c.id}
                          className="rounded-xl"
                        >
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* KHÔNG GIAN */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
                    <Users size={12} /> Không gian
                  </label>
                  <Select
                    value={formData.spaceType}
                    onValueChange={(val: "PERSONAL" | "GROUP") =>
                      setFormData({ ...formData, spaceType: val })
                    }
                  >
                    <SelectTrigger className="h-14 rounded-2xl border-2 border-border/50 font-bold">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      <SelectItem value="PERSONAL" className="rounded-xl">
                        Cá nhân
                      </SelectItem>
                      <SelectItem value="GROUP" className="rounded-xl">
                        Nhóm chung
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* CHỌN NHÓM HOẶC NGÀY */}
                {formData.spaceType === "GROUP" ? (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
                      <Users size={12} />{" "}
                      {isGroupsLoading ? (
                        <Loader2 className="animate-spin" size={10} />
                      ) : (
                        "Nhóm"
                      )}
                    </label>
                    <Select
                      value={formData.groupId}
                      onValueChange={(val) =>
                        setFormData({ ...formData, groupId: val })
                      }
                    >
                      <SelectTrigger className="h-14 rounded-2xl border-2 border-border/50 font-bold">
                        <SelectValue placeholder="Nhóm nào?" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        {groups?.map((g: any) => (
                          <SelectItem
                            key={g.id}
                            value={g.id}
                            className="rounded-xl"
                          >
                            {g.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70 ml-1 flex items-center gap-2">
                      <Calendar size={12} /> Thời gian
                    </label>
                    <Input
                      type="date"
                      className="h-14 rounded-2xl border-2 border-border/50 bg-muted/10 font-bold focus:border-primary/50"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                    />
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={
                  createTransaction.isPending || isSuggesting || isAnalyzing
                }
                className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                {createTransaction.isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    <span>ĐANG GHI SỔ...</span>
                  </div>
                ) : (
                  "LƯU GIAO DỊCH"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
