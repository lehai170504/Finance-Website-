// hooks/useGroups.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groupService } from "@/services/group.service";
import { toast } from "sonner";

export const useGroups = () => {
  const queryClient = useQueryClient();

  // Query lấy danh sách
  const groupsQuery = useQuery({
    queryKey: ["groups"],
    queryFn: () => groupService.getMyGroups(),
  });

  // Mutation tạo nhóm
  const createGroupMutation = useMutation({
    mutationFn: (name: string) => groupService.createGroup(name),
    onSuccess: () => {
      toast.success("Tạo nhóm mới thành công!");
      queryClient.invalidateQueries({ queryKey: ["groups"] }); // Làm mới danh sách ngay
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Không thể tạo nhóm.");
    },
  });

  // Mutation: Tham gia nhóm
  const joinGroupMutation = useMutation({
    mutationFn: (code: string) => groupService.joinGroup(code),
    onSuccess: () => {
      toast.success("Đã tham gia nhóm thành công!");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Mã mời không hợp lệ"),
  });

  // Mutation: Rời nhóm
  const leaveGroupMutation = useMutation({
    mutationFn: (id: string) => groupService.leaveGroup(id),
    onSuccess: () => {
      toast.success("Đã rời khỏi nhóm.");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi khi rời nhóm"),
  });

  // Mutation: Xóa nhóm
  const deleteGroupMutation = useMutation({
    mutationFn: (id: string) => groupService.deleteGroup(id),
    onSuccess: () => {
      toast.success("Đã xóa nhóm vĩnh viễn.");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (err: any) =>
      toast.error(err.response?.data?.message || "Lỗi khi xóa nhóm"),
  });

  return {
    groups: groupsQuery.data?.data || [],
    isLoading: groupsQuery.isLoading,
    createGroup: createGroupMutation,
    joinGroup: joinGroupMutation,
    leaveGroup: leaveGroupMutation,
    deleteGroup: deleteGroupMutation,
  };
};

export const useGroupById = (groupId: string) => {
  return useQuery({
    queryKey: ["group_info", groupId],
    queryFn: () => groupService.getGroupById(groupId),
    enabled: !!groupId,
    retry: false,
  });
};
