"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGroups } from "@/hooks/useGroups";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { GroupCard } from "@/components/cards/GroupCard";
import { Plus, UserPlus, Users, Sparkles, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function GroupsPage() {
  const router = useRouter();
  const { groups, isLoading, createGroup, joinGroup, leaveGroup, deleteGroup } =
    useGroups();
  const { data: user } = useProfile();

  const [inputValue, setInputValue] = useState("");
  const [mode, setMode] = useState<"CREATE" | "JOIN">("CREATE");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{
    id: string;
    isOwner: boolean;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) {
      toast.error("Nhập thông tin đã homie ơi!");
      return;
    }
    
    if (mode === "CREATE") {
      createGroup.mutate(inputValue, { 
        onSuccess: () => {
          setInputValue("");
          toast.success("Đã tạo không gian nhóm mới! 🚀");
        }
      });
    } else {
      joinGroup.mutate(inputValue, { 
        onSuccess: () => {
          setInputValue("");
          toast.success("Chào mừng homie đã gia nhập nhóm! 🤝");
        }
      });
    }
  };

  const handleActionClick = (e: React.MouseEvent, id: string, isOwner: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedGroup({ id, isOwner });
    setConfirmOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedGroup) return;
    const mutation = selectedGroup.isOwner ? deleteGroup : leaveGroup;
    mutation.mutate(selectedGroup.id, {
      onSuccess: () => setConfirmOpen(false),
    });
  };

  const handleViewLogs = (groupId: string) => {
    router.push(`/groups/${groupId}/logs`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 space-y-12 font-sans animate-in fade-in slide-in-from-bottom-4 duration-700 mb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 pb-10 border-b border-border/40 relative">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Users size={20} strokeWidth={2.5} />
            <span className="text-[11px] font-black uppercase tracking-[0.3em]">
              Kết nối tài chính
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
            KHÔNG GIAN <span className="text-primary">NHÓM</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-2xl">
            Quản lý chi tiêu chung cùng gia đình, bạn bè và người thân một cách minh bạch.
          </p>
        </div>

        {/* MODE SWITCHER TABS */}
        <div className="flex bg-muted/40 p-1.5 rounded-2xl border border-border/50 shadow-inner w-full md:w-auto backdrop-blur-md">
          <button
            onClick={() => setMode("CREATE")}
            className={cn(
              "flex-1 md:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
              mode === "CREATE" ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Plus size={14} strokeWidth={3} /> Tạo nhóm mới
          </button>
          <button
            onClick={() => setMode("JOIN")}
            className={cn(
              "flex-1 md:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
              mode === "JOIN" ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <UserPlus size={14} strokeWidth={3} /> Tham gia nhóm
          </button>
        </div>
      </div>

      {/* ACTION CARD (CREATE/JOIN) */}
      <div className="relative group max-w-2xl mx-auto w-full">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
        <form 
          onSubmit={handleSubmit}
          className="relative p-6 md:p-8 bg-card border-2 border-border/40 rounded-[2.5rem] shadow-xl flex flex-col md:flex-row gap-4 items-center"
        >
          <div className="relative flex-1 w-full">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/30">
               {mode === "CREATE" ? <Plus size={20} /> : <Search size={20} />}
            </div>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={mode === "CREATE" ? "Đặt tên cho nhóm của homie..." : "Nhập mã nhóm (6-8 ký tự)..."}
              className="h-16 pl-14 pr-6 rounded-2xl border-none bg-muted/30 text-lg font-bold placeholder:text-muted-foreground/30 focus-visible:ring-primary/20 transition-all uppercase tracking-tight"
            />
          </div>
          <Button
            type="submit"
            disabled={createGroup.isPending || joinGroup.isPending}
            className="h-16 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl shadow-primary/30 transition-all hover:scale-[1.05] active:scale-95 w-full md:w-auto"
          >
            {(createGroup.isPending || joinGroup.isPending) ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              mode === "CREATE" ? "Tạo ngay" : "Gia nhập"
            )}
          </Button>
        </form>
      </div>

      {/* GROUPS LIST SECTION */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-1 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">
              Không gian của bạn ({groups?.length || 0})
            </h2>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[280px] rounded-[3rem] bg-muted/10 animate-pulse border-2 border-dashed border-border/20 flex items-center justify-center">
                 <Loader2 size={32} className="text-muted-foreground/10 animate-spin" />
              </div>
            ))}
          </div>
        ) : groups?.length === 0 ? (
          <div className="py-32 text-center border-2 border-dashed rounded-[3.5rem] border-border/40 bg-muted/5 flex flex-col items-center gap-6 group hover:border-primary/20 transition-colors duration-500">
            <div className="p-8 bg-muted/20 rounded-full text-muted-foreground/10 group-hover:text-primary/10 transition-colors duration-500">
              <Users size={80} strokeWidth={1} />
            </div>
            <div className="space-y-3">
              <p className="text-2xl font-black uppercase tracking-tight text-muted-foreground/60">Homie chưa có nhóm nào</p>
              <p className="text-sm text-muted-foreground/40 font-medium max-w-sm mx-auto">
                Hãy bắt đầu bằng cách tạo một nhóm mới hoặc xin mã mời từ bạn bè để cùng nhau quản lý nhé!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groups?.map((group: any) => (
              <GroupCard
                key={group.id}
                group={group}
                userEmail={user?.email}
                userAvatar={user?.avatarUrl}
                onAction={(e) => handleActionClick(e, group.id, group.owner?.id === user?.id)}
                onViewLogs={() => handleViewLogs(group.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* MODAL XÁC NHẬN */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        title={selectedGroup?.isOwner ? "Giải tán nhóm vĩnh viễn" : "Rời khỏi không gian"}
        description={
          selectedGroup?.isOwner
            ? "Cảnh báo: Mọi dữ liệu giao dịch và lịch sử trong nhóm sẽ bị xóa sạch khỏi hệ thống. Hành động này không thể khôi phục."
            : "Bạn sẽ không thể tiếp tục theo dõi thu chi chung của nhóm sau khi rời đi. Homie chắc chứ?"
        }
        confirmText={selectedGroup?.isOwner ? "GIẢI TÁN NGAY" : "RỜI KHÔNG GIAN"}
        isLoading={deleteGroup.isPending || leaveGroup.isPending}
      />
    </div>
  );
}
