"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGroups } from "@/hooks/useGroups";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { GroupCard } from "@/components/cards/GroupCard";
import { Plus, UserPlus, Users, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    if (!inputValue.trim()) return;
    if (mode === "CREATE") {
      createGroup.mutate(inputValue, { onSuccess: () => setInputValue("") });
    } else {
      joinGroup.mutate(inputValue, { onSuccess: () => setInputValue("") });
    }
  };

  const handleActionClick = (
    e: React.MouseEvent,
    id: string,
    isOwner: boolean,
  ) => {
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
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 mt-6 space-y-16 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 pb-12 border-b border-border/40">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Sparkles size={18} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                Cùng nhau quản lý
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none text-foreground">
              Không Gian Chung
            </h1>
            <p className="text-muted-foreground font-medium text-lg md:text-xl max-w-2xl">
              Nơi minh bạch tài chính, gạt bỏ lo âu về những khoản chi tiêu
              chung cùng đồng đội.
            </p>
          </div>

          {/* Switch Chế độ Create/Join kiểu Tab hiện đại */}
          <div className="flex p-1.5 bg-muted/40 backdrop-blur-sm rounded-[1.25rem] w-fit border border-border/40 shadow-inner">
            <button
              onClick={() => {
                setMode("CREATE");
                setInputValue("");
              }}
              className={cn(
                "flex items-center gap-2.5 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300",
                mode === "CREATE"
                  ? "bg-background shadow-xl text-primary scale-100 border border-border/50"
                  : "text-muted-foreground hover:text-foreground/80 scale-95",
              )}
            >
              <Plus size={16} strokeWidth={3} /> Tạo nhóm mới
            </button>
            <button
              onClick={() => {
                setMode("JOIN");
                setInputValue("");
              }}
              className={cn(
                "flex items-center gap-2.5 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300",
                mode === "JOIN"
                  ? "bg-background shadow-xl text-primary scale-100 border border-border/50"
                  : "text-muted-foreground hover:text-foreground/80 scale-95",
              )}
            >
              <UserPlus size={16} strokeWidth={3} /> Tham gia nhóm
            </button>
          </div>
        </div>

        {/* Form nhập liệu uý tín */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-stretch gap-3 w-full xl:w-[500px] animate-in slide-in-from-right-4 duration-700"
        >
          <div className="relative flex-1 group">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                mode === "CREATE"
                  ? "NHẬP TÊN NHÓM..."
                  : "NHẬP MÃ MỜI 6 KÝ TỰ..."
              }
              className="h-16 px-6 rounded-2xl border-2 border-border/60 bg-muted/20 font-bold uppercase focus:bg-background transition-all text-sm tracking-widest placeholder:opacity-30"
            />
          </div>
          <Button
            type="submit"
            size="lg"
            disabled={isLoading || !inputValue.trim()}
            className="h-16 px-10 rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] shadow-2xl shadow-primary/30"
          >
            {createGroup.isPending || joinGroup.isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              "XÁC NHẬN"
            )}
          </Button>
        </form>
      </div>

      {/* CONTENT AREA: Danh sách nhóm */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Users size={20} className="text-primary animate-pulse" />
              </div>
            </div>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary/70">
              Đang kết nối không gian...
            </span>
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center py-40 border-2 border-dashed rounded-[3rem] border-border/60 bg-muted/[0.02] backdrop-blur-[2px] animate-in zoom-in duration-500">
            <div className="w-24 h-24 bg-muted/40 rounded-full flex items-center justify-center mx-auto mb-8">
              <Users size={40} className="text-muted-foreground/30" />
            </div>
            <p className="text-base font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-2">
              Chưa có không gian nào
            </p>
            <p className="text-[11px] font-bold text-muted-foreground/40 uppercase">
              Hãy tạo nhóm hoặc nhập mã mời để bắt đầu
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                userEmail={user?.email}
                onAction={handleActionClick}
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
        title={selectedGroup?.isOwner ? "Xóa nhóm vĩnh viễn" : "Rời khỏi nhóm"}
        description={
          selectedGroup?.isOwner
            ? "Cảnh báo: Mọi dữ liệu giao dịch và nợ nần trong nhóm sẽ bị xóa sạch khỏi hệ thống. Hành động này không thể khôi phục."
            : "Bạn sẽ không thể tiếp tục theo dõi lịch sử thu chi chung của nhóm này sau khi rời đi."
        }
        confirmText={selectedGroup?.isOwner ? "XÓA NHÓM" : "RỜI NHÓM"}
        isLoading={deleteGroup.isPending || leaveGroup.isPending}
      />
    </div>
  );
}
