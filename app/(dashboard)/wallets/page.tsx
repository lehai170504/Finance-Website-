"use client";

import { useState } from "react";
import { useWallets } from "@/hooks/useWallets";
import { Button } from "@/components/ui/button";
import { Plus, ArrowRightLeft, Sparkles, Wallet2 } from "lucide-react";

// Import các Modals và Components
import { CreateWalletModal } from "@/components/modals/CreateWalletModal";
import { TransferWalletModal } from "@/components/modals/TransferWalletModal";
import { EditWalletModal } from "@/components/modals/EditWalletModal";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { WalletCard } from "@/components/cards/WalletCard";
import { Wallet } from "@/types/wallet";

export default function WalletsPage() {
  const { wallets, totalBalance, isLoading, deleteWallet } = useWallets();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [walletToEdit, setWalletToEdit] = useState<Wallet | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState<Wallet | null>(null);

  const handleEditClick = (wallet: Wallet) => {
    setWalletToEdit(wallet);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (wallet: Wallet) => {
    setWalletToDelete(wallet);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (walletToDelete) {
      deleteWallet.mutate(walletToDelete.id, {
        onSuccess: () => setDeleteConfirmOpen(false),
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 font-sans mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-12 pb-10 border-b border-border/40 relative">
        <div className="space-y-4 w-full">
          <div className="flex items-center gap-2.5 text-primary">
            <Sparkles size={16} strokeWidth={3} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">
              Trung tâm tài sản
            </span>
          </div>
          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground font-money flex items-baseline gap-2 overflow-hidden">
              <span className="truncate">{totalBalance.toLocaleString()}</span>
              <span className="text-xl md:text-2xl font-black text-primary opacity-40">
                đ
              </span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm md:text-lg mt-1 max-w-md">
              Tổng giá trị tài sản ròng của homie.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:flex items-center gap-3 w-full lg:w-auto">
          <Button
            variant="outline"
            onClick={() => setIsTransferOpen(true)}
            className="rounded-2xl font-black uppercase text-[10px] tracking-widest h-14 border-2 hover:bg-primary/5 active:scale-95 transition-all"
          >
            <ArrowRightLeft size={16} className="md:mr-2" />
            <span className="hidden md:inline text-[11px]">Điều chuyển</span>
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-2xl font-black uppercase text-[10px] tracking-widest h-14 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus size={18} strokeWidth={3} className="md:mr-2" />
            <span className="hidden md:inline text-[11px]">Ví mới</span>
            <span className="md:hidden">Tạo ví</span>
          </Button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="min-h-[300px]">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-[2rem] bg-muted/40 animate-pulse border-2 border-border/10"
              />
            ))}
          </div>
        ) : wallets.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed rounded-[3rem] border-border/40 bg-muted/[0.02]">
            <Wallet2
              size={40}
              className="text-muted-foreground/20 mx-auto mb-4"
            />
            <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
              Trống trải quá homie ơi
            </p>
          </div>
        ) : (
          /* GRID: Responsive gap */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
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

      {/* MODALS */}
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
        description={`Mọi dữ liệu của ví "${walletToDelete?.name}" sẽ biến mất vĩnh viễn.`}
        isLoading={deleteWallet.isPending}
      />
    </div>
  );
}
