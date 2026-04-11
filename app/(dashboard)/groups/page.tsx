"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGroups } from "@/hooks/useGroups";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { GroupCard } from "@/components/cards/GroupCard";
import { Plus, UserPlus, Users } from "lucide-react";
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

  // 1. Xử lý Tạo hoặc Tham gia nhóm
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    if (mode === "CREATE") {
      createGroup.mutate(inputValue, { onSuccess: () => setInputValue("") });
    } else {
      joinGroup.mutate(inputValue, { onSuccess: () => setInputValue("") });
    }
  };

  // 2. Mở Modal xác nhận (Rời nhóm hoặc Xóa nhóm)
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

  // 3. Thực thi hành động sau khi xác nhận Modal
  const handleConfirmAction = () => {
    if (!selectedGroup) return;
    const mutation = selectedGroup.isOwner ? deleteGroup : leaveGroup;
    mutation.mutate(selectedGroup.id, {
      onSuccess: () => setConfirmOpen(false),
    });
  };

  // 4. Điều hướng sang trang Nhật ký nhóm (Activity Logs)
  const handleViewLogs = (groupId: string) => {
    router.push(`/groups/${groupId}/logs`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-8 mt-4 space-y-12">
      {/* HEADER SECTION: Tiêu đề và Form nhập liệu */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-10 border-b border-border/50">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">
              Không Gian Chung
            </h1>
            <p className="text-muted-foreground font-medium text-lg">
              Kết nối tài chính, minh bạch chi tiêu cùng đồng đội.
            </p>
          </div>

          {/* Switch Chế độ Create/Join */}
          <div className="flex p-1 bg-muted/50 rounded-2xl w-fit border border-border/50">
            <button
              onClick={() => setMode("CREATE")}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                mode === "CREATE"
                  ? "bg-background shadow-md text-primary"
                  : "text-muted-foreground",
              )}
            >
              <Plus size={16} /> Tạo nhóm mới
            </button>
            <button
              onClick={() => setMode("JOIN")}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                mode === "JOIN"
                  ? "bg-background shadow-md text-primary"
                  : "text-muted-foreground",
              )}
            >
              <UserPlus size={16} /> Tham gia nhóm
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-[450px]"
        >
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              mode === "CREATE" ? "TÊN NHÓM MỚI..." : "MÃ MỜI 6 CHỮ SỐ..."
            }
            className="h-12 font-bold uppercase"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="w-full sm:w-auto h-12 px-8 font-black uppercase text-[11px]"
          >
            XÁC NHẬN
          </Button>
        </form>
      </div>

      {/* CONTENT AREA: Danh sách nhóm */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 animate-pulse">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">
            Đang truy xuất danh sách nhóm...
          </span>
        </div>
      ) : groups.length === 0 ? (
        <div className="text-center py-40 border-4 border-dashed rounded-[3.5rem] border-muted/30">
          <Users size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">
            Chưa có nhóm nào ở đây cả homie. Hãy tạo một nhóm ngay!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* MODAL XÁC NHẬN HÀNH ĐỘNG NGUY HIỂM */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmAction}
        title={selectedGroup?.isOwner ? "Xóa nhóm vĩnh viễn" : "Rời khỏi nhóm"}
        description={
          selectedGroup?.isOwner
            ? "Cảnh báo: Mọi dữ liệu giao dịch và nợ nần trong nhóm sẽ bị xóa sạch khỏi hệ thống. Bạn có chắc chắn không?"
            : "Bạn sẽ không thể xem lại lịch sử chi tiêu chung của nhóm này sau khi rời đi."
        }
        confirmText={selectedGroup?.isOwner ? "XÓA NHÓM" : "RỜI NHÓM"}
        isLoading={deleteGroup.isPending || leaveGroup.isPending}
      />
    </div>
  );
}
