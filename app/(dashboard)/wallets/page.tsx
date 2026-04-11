// app/wallets/page.tsx
"use client";

import { useState } from "react";
import { useWallets } from "@/hooks/useWallets";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRightLeft } from "lucide-react";

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
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 mt-4">
      {/* HEADER TỔNG SỐ DƯ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b pb-10">
        <div>
          <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Tổng tài sản hiện có
          </span>
          <h1 className="text-6xl font-black tracking-tighter mt-3 text-foreground">
            {totalBalance.toLocaleString()}
            <span className="text-primary opacity-80 p-2">đ</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setIsTransferOpen(true)}
            className="rounded-xl font-black uppercase text-[11px] tracking-widest h-12 px-6 border-2 hover:bg-primary/5"
          >
            <ArrowRightLeft size={16} className="mr-2" /> Chuyển tiền
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-xl font-black uppercase text-[11px] tracking-widest h-12 px-6 shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
          >
            <Plus size={16} className="mr-2" /> Tạo ví mới
          </Button>
        </div>
      </div>

      {/* DANH SÁCH VÍ */}
      {isLoading ? (
        // SKELETON LOADING
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-56 rounded-[2.5rem] bg-muted/50 border-2 border-border/50 animate-pulse"
            />
          ))}
        </div>
      ) : (
        // GỌI COMPONENT TÁI SỬ DỤNG
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
        title="Xóa ví này?"
        description={`Bạn có chắc chắn muốn xóa ví "${walletToDelete?.name}"? Mọi dữ liệu giao dịch liên quan đến ví này có thể bị ảnh hưởng và không thể khôi phục.`}
        isLoading={deleteWallet.isPending}
      />
    </div>
  );
}
