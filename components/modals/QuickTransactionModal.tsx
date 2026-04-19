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
  const { createTransaction, bulkCreate } = useTransactions();
  const { mutate: suggest, isPending: isSuggesting } = useSuggestCategory();
  const { mutate: analyze, isPending: isAnalyzing } = useOCR();

  const [ocrItems, setOcrItems] = useState<any[]>([]);

  const isInitialLoading = isWalletsLoading || isCatsLoading;

  const [formData, setFormData] = useState({
    amount: "",
    note: "",
    walletId: "",
    categoryId: "",
    spaceType: "PERSONAL" as "PERSONAL" | "GROUP",
    groupId: "",
    date: new Date().toISOString().split("T")[0],
    receiptUrl: "",
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
              amount: res.data.totalAmount ? res.data.totalAmount.toString() : "0",
              note: res.data.suggestedNote || "",
              receiptUrl: res.data.receiptUrl || "",
            }));
            setOcrItems(res.data.items || []);
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
          receiptUrl: formData.receiptUrl || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Ghi chép thành công! 🚀");

          if (formData.spaceType === "GROUP" && formData.groupId) {
            router.push(`/transactions?tab=GROUP&groupId=${formData.groupId}`);
          } else {
            router.push(`/transactions?tab=LIST`);
          }

          resetForm();
          onClose();
        },
      },
    );
  };

  const handleSplitTransactions = async () => {
    if (!formData.walletId) {
      toast.error("Chọn ví trước đã homie!");
      return;
    }

    try {
      const bulkData = {
        walletId: formData.walletId,
        groupId: formData.spaceType === "GROUP" ? formData.groupId : undefined,
        date: formData.date,
        receiptUrl: formData.receiptUrl,
        items: ocrItems.map(item => ({
          // Tìm ID danh mục khớp nhất với gợi ý của AI
          categoryId: categories?.find(c => 
            c.name.toLowerCase().includes(item.categorySuggestion?.toLowerCase())
          )?.id || formData.categoryId || categories?.[0]?.id,
          amount: item.amount,
          note: item.name
        }))
      };

      await bulkCreate.mutateAsync(bulkData);
      onClose();
      router.push("/transactions?tab=LIST");
    } catch (error) {
      console.error("Split error:", error);
    }
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
      receiptUrl: "",
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
              {/* BILL PREVIEW SECTION - TO RÕ RÀNG */}
              {formData.receiptUrl && (
                <div className="relative animate-in zoom-in-95 duration-500 -mt-2">
                  <div className="relative h-44 w-full rounded-[2rem] overflow-hidden border-2 border-primary/20 shadow-2xl group/bill">
                    <img 
                      src={formData.receiptUrl} 
                      alt="Bill" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/bill:scale-110"
                    />
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Badge Info */}
                    <div className="absolute bottom-4 left-6 flex items-center gap-2.5">
                       <div className="p-1.5 bg-white/20 backdrop-blur-md rounded-lg">
                          <ScanLine size={14} className="text-white" />
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black text-white/60 uppercase tracking-widest">Hóa đơn đã quét</span>
                          <span className="text-[11px] font-bold text-white uppercase tracking-tight">Chứng từ đính kèm</span>
                       </div>
                    </div>

                    {/* Nút Xóa */}
                    <button 
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, receiptUrl: "" }))}
                      className="absolute top-4 right-4 bg-black/20 backdrop-blur-xl hover:bg-rose-500 text-white rounded-full p-2.5 shadow-lg transition-all active:scale-90"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              )}

              {/* DANH SÁCH MÓN HÀNG CHI TIẾT (NẾU CÓ) */}
              {ocrItems.length > 0 && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary ml-1 flex items-center gap-2">
                      <Sparkles size={12} className="animate-pulse" /> Chi tiết từng món
                    </label>
                    <button 
                      type="button"
                      onClick={() => setOcrItems([])}
                      className="text-[9px] font-bold text-muted-foreground hover:text-rose-500 uppercase tracking-widest transition-colors"
                    >
                      Bỏ qua
                    </button>
                  </div>
                  
                  <div className="bg-muted/30 rounded-3xl p-4 border border-border/40 max-h-[180px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20">
                    <div className="space-y-3">
                      {ocrItems.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-3 p-2.5 bg-background rounded-2xl border border-border/20 shadow-sm group/item hover:border-primary/30 transition-all">
                          <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-xs font-bold truncate uppercase">{item.name}</span>
                            <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest">{item.categorySuggestion}</span>
                          </div>
                          <div className="text-sm font-money font-black text-primary bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10">
                            {item.amount?.toLocaleString()}đ
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p className="text-[9px] font-bold text-muted-foreground/50 italic px-2">
                    * Homie có thể chọn Tách hóa đơn bên dưới để lưu từng món vào từng danh mục khác nhau.
                  </p>
                </div>
              )}

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

                <div className="flex gap-4">
                  {ocrItems.length > 1 && (
                    <Button
                      type="button"
                      disabled={bulkCreate.isPending || createTransaction.isPending}
                      onClick={handleSplitTransactions}
                      className="flex-1 h-16 rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] border-2 border-primary/20 bg-background text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group"
                    >
                      {bulkCreate.isPending ? (
                        <Loader2 className="animate-spin" size={16} />
                      ) : (
                        <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                      )}
                      TÁCH HÓA ĐƠN
                    </Button>
                  )}
                  
                  <Button
                    type="submit"
                    disabled={
                      createTransaction.isPending || bulkCreate.isPending || isSuggesting || isAnalyzing
                    }
                    className={cn(
                      "h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95",
                      ocrItems.length > 1 ? "flex-[1.5]" : "w-full"
                    )}
                  >
                    {createTransaction.isPending ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={18} />
                        <span>ĐANG GHI...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus size={18} />
                        <span>{ocrItems.length > 1 ? "GOM CHUNG 1 MÓN" : "LƯU GIAO DỊCH"}</span>
                      </div>
                    )}
                  </Button>
                </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
