"use client";

import { useState } from "react";
import { useWallets } from "@/hooks/useWallets";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRightLeft, Sparkles, Loader2, Wallet2 } from "lucide-react";

// Import các Modals và Components
import { CreateWalletModal } from "@/components/modals/CreateWalletModal";
import { TransferWalletModal } from "@/components/modals/TransferWalletModal";
import { EditWalletModal } from "@/components/modals/EditWalletModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { WalletCard } from "@/components/cards/WalletCard";
import { Wallet } from "@/types/wallet";

export default function WalletsPage() {
  const { wallets, totalBalance, isLoading, deleteWallet } = useWallets();

  // State quản lý Modal Tạo và Chuyển tiền
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  // State quản lý Modal Edit
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [walletToEdit, setWalletToEdit] = useState<Wallet | null>(null);

  // State quản lý Modal Xác nhận Xóa
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState<Wallet | null>(null);

  // Mở Modal Edit
  const handleEditClick = (wallet: Wallet) => {
    setWalletToEdit(wallet);
    setIsEditOpen(true);
  };

  // Mở Modal Xác nhận Xóa
  const handleDeleteClick = (wallet: Wallet) => {
    setWalletToDelete(wallet);
    setDeleteConfirmOpen(true);
  };

  // Xử lý Xóa ví
  const confirmDelete = () => {
    if (walletToDelete) {
      deleteWallet.mutate(walletToDelete.id, {
        onSuccess: () => setDeleteConfirmOpen(false),
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 mt-6 font-sans mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* TRANG TRÍ NỀN MỜ ẢO */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] -z-10" />

      {/* HEADER TỔNG SỐ DƯ */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 mb-16 pb-12 border-b border-border/40 relative">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-primary">
            <Sparkles size={18} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Trung tâm tài sản
            </span>
          </div>
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground font-money flex items-baseline gap-2">
              {totalBalance.toLocaleString()}
              <span className="text-2xl md:text-3xl font-black text-primary opacity-40 italic tracking-normal">
                đ
              </span>
            </h1>
            <p className="text-muted-foreground font-medium text-lg md:text-xl mt-2">
              Tổng giá trị tài sản ròng của homie hiện tại.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsTransferOpen(true)}
            className="flex-1 xl:flex-none rounded-2xl font-black uppercase text-[11px] tracking-widest h-14 px-8 border-2 border-border/60 hover:bg-primary/5 active:scale-95 transition-all"
          >
            <ArrowRightLeft size={18} className="mr-2.5" /> Điều chuyển vốn
          </Button>
          <Button
            size="lg"
            onClick={() => setIsCreateOpen(true)}
            className="flex-1 xl:flex-none rounded-2xl font-black uppercase text-[11px] tracking-widest h-14 px-8 shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={20} strokeWidth={3} className="mr-2" /> Khởi tạo ví mới
          </Button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[400px]">
        {isLoading ? (
          /* SKELETON LOADING CAO CẤP */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-60 rounded-[2.5rem] bg-muted/30 border-2 border-border/20 animate-pulse relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>
            ))}
          </div>
        ) : wallets.length === 0 ? (
          /* TRẠNG THÁI TRỐNG */
          <div className="py-40 text-center border-2 border-dashed rounded-[3rem] border-border/40 bg-muted/[0.02] backdrop-blur-[2px]">
            <div className="w-20 h-20 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet2 size={32} className="text-muted-foreground/30" />
            </div>
            <p className="text-base font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              Homie chưa có chiếc ví nào
            </p>
            <Button
              variant="link"
              onClick={() => setIsCreateOpen(true)}
              className="mt-2 text-primary font-black uppercase text-[10px] tracking-widest"
            >
              Tạo ví ngay để bắt đầu quản lý
            </Button>
          </div>
        ) : (
          /* DANH SÁCH VÍ - GRID MỚI */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {wallets.map((wallet) => (
              <WalletCard
                key={wallet.id}
                wallet={wallet}
                onEdit={() => handleEditClick(wallet)}
                onDelete={() => handleDeleteClick(wallet)}
              />
            ))}
          </div>
        )}
      </div>

      {/* CÁC MODALS */}
      <CreateWalletModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />

      <TransferWalletModal
        isOpen={isTransferOpen}
        onClose={() => setIsTransferOpen(false)}
        wallets={wallets}
      />

      <EditWalletModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        wallet={walletToEdit}
      />

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Dừng hoạt động ví?"
        description={`Xác nhận xóa ví "${walletToDelete?.name.toUpperCase()}". Mọi dữ liệu về lịch sử giao dịch gắn liền với ví này sẽ bị lưu trữ vĩnh viễn và không thể khôi phục.`}
        confirmText="XÁC NHẬN XÓA"
        isLoading={deleteWallet.isPending}
      />
    </div>
  );
}
