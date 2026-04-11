"use client";

import { useState, useEffect } from "react";
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
  X,
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

import { useWallets } from "@/hooks/useWallets";
import { useCategories } from "@/hooks/useCategories";
import { useTransactions, useSuggestCategory } from "@/hooks/useTransactions";
import { useGroups } from "@/hooks/useGroups";

interface QuickTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickTransactionModal({
  isOpen,
  onClose,
}: QuickTransactionModalProps) {
  const { wallets, isLoading: isWalletsLoading } = useWallets();
  const { categories, isLoading: isCatsLoading } = useCategories();
  const { groups, isLoading: isGroupsLoading } = useGroups();
  const { createTransaction } = useTransactions();
  const { mutate: suggest, isPending: isSuggesting } = useSuggestCategory();

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
    if (formData.note.trim().length < 2) return;

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
  }, [formData.note, suggest]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.walletId || !formData.categoryId) {
      toast.error("Thiếu thông tin rồi homie ơi!");
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
      <DialogContent className="sm:max-w-125 rounded-[3rem] border-none p-0 overflow-hidden shadow-2xl bg-background outline-none">
        {/* TRẠNG THÁI LOADING TOÀN MODAL KHI MỞ LÊN LẦN ĐẦU */}
        {isInitialLoading ? (
          <div className="h-125 flex flex-col items-center justify-center gap-4 bg-background">
            <div className="relative flex items-center justify-center">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <Plus
                className="absolute text-primary"
                size={16}
                strokeWidth={3}
              />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
              Đang thiết lập ví tiền...
            </p>
          </div>
        ) : (
          <>
            {/* HEADER CUSTOM */}
            <div className="bg-primary p-8 text-primary-foreground relative shadow-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full hover:bg-white/20 text-white"
              >
                <X size={20} />
              </Button>
              <DialogHeader>
                <DialogTitle className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 text-white">
                  <div className="bg-white text-primary rounded-xl p-1.5 shadow-xl shadow-black/10">
                    <Plus size={24} strokeWidth={4} />
                  </div>
                  Ghi chép nhanh
                </DialogTitle>
              </DialogHeader>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2">
                  <CreditCard size={12} /> Số tiền giao dịch
                </label>
                <div className="relative group">
                  <Input
                    type="number"
                    required
                    autoFocus
                    placeholder="0"
                    className="h-14 px-5 rounded-2xl border-2 border-border/50 bg-muted/20 font-black text-xl focus:bg-background transition-all pr-16 focus:border-primary/50"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 font-black text-xs text-muted-foreground/50 border-l pl-3 border-border/50">
                    VNĐ
                  </div>
                </div>
              </div>
              {/* GHI CHÚ */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2">
                  <AlignLeft size={12} /> Ghi chú giao dịch
                </label>
                <div className="relative group">
                  <Input
                    type="text"
                    required
                    placeholder="Trà sữa, cơm trưa, mua đồ..."
                    className="h-14 px-5 rounded-2xl border-2 border-border/50 bg-muted/20 font-bold focus:bg-background transition-all pr-12 focus:border-primary/50"
                    value={formData.note}
                    onChange={(e) =>
                      setFormData({ ...formData, note: e.target.value })
                    }
                  />
                  {/* LOADING GỢI Ý */}
                  {isSuggesting && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
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
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2">
                    <Wallet size={12} /> Nguồn tiền
                  </label>
                  <Select
                    value={formData.walletId}
                    onValueChange={(val) =>
                      setFormData({ ...formData, walletId: val })
                    }
                  >
                    <SelectTrigger className="h-14 rounded-2xl border-2 border-border/50 font-bold hover:bg-muted/10 transition-colors">
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
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2">
                    <Tag size={12} /> Danh mục
                    {formData.categoryId && !isSuggesting && (
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
                        isSuggesting && "opacity-40 pointer-events-none",
                      )}
                    >
                      <SelectValue placeholder="Loại chi tiêu" />
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
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2">
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

                {/* CHỌN NHÓM HOẶC NGÀY THÁNG */}
                {formData.spaceType === "GROUP" ? (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2">
                      <Users size={12} />{" "}
                      {isGroupsLoading ? (
                        <Loader2 className="animate-spin" size={10} />
                      ) : (
                        "Chọn nhóm"
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
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1 flex items-center gap-2">
                      <Calendar size={12} /> Thời gian
                    </label>
                    <Input
                      type="date"
                      className="h-14 rounded-2xl border-2 border-border/50 font-bold focus:border-primary/50"
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
                disabled={createTransaction.isPending || isSuggesting}
                className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-lg shadow-xl shadow-primary/30 transition-all active:scale-[0.98]"
              >
                {createTransaction.isPending ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="animate-spin" size={20} />
                    <span>Đang ghi sổ...</span>
                  </div>
                ) : (
                  "Lưu giao dịch"
                )}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
