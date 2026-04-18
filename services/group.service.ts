import { axiosInstance } from "@/lib/axios";
import { ApiResponse } from "@/types/auth";
import {
  Group,
  GroupDebt,
  GroupStats,
  TransactionResponse,
} from "@/types/group";

export const groupService = {
  getMyGroups: async () => {
    const response =
      await axiosInstance.get<ApiResponse<Group[]>>("/groups/me");
    return response.data;
  },

  getGroupById: async (groupId: string) => {
    const response = await axiosInstance.get<ApiResponse<Group>>(
      `/groups/${groupId}`,
    );
    return response.data;
  },

  createGroup: async (name: string) => {
    const response = await axiosInstance.post<ApiResponse<Group>>(
      "/groups/create",
      null,
      {
        params: { name },
      },
    );
    return response.data;
  },

  joinGroup: async (inviteCode: string) => {
    const response = await axiosInstance.post<ApiResponse<Group>>(
      "/groups/join",
      null,
      { params: { inviteCode } },
    );
    return response.data;
  },

  leaveGroup: async (id: string) => {
    const response = await axiosInstance.post<ApiResponse<string>>(
      `/groups/${id}/leave`,
    );
    return response.data;
  },

  deleteGroup: async (id: string) => {
    const response = await axiosInstance.delete<ApiResponse<string>>(
      `/groups/${id}`,
    );
    return response.data;
  },

  updateGroupName: async (id: string, newName: string) => {
    const response = await axiosInstance.put<ApiResponse<Group>>(
      `/groups/${id}`,
      null,
      { params: { newName } },
    );
    return response.data;
  },

  getGroupStats: async (groupId: string, month: number, year: number) => {
    const response = await axiosInstance.get<ApiResponse<GroupStats>>(
      `/groups/details/${groupId}/stats`,
      { params: { month, year } },
    );
    return response.data;
  },

  getGroupDebts: async (groupId: string) => {
    const response = await axiosInstance.get<ApiResponse<GroupDebt[]>>(
      `/groups/details/${groupId}/debts`,
    );
    return response.data;
  },

  settleDebt: async (debtId: string) => {
    const response = await axiosInstance.post<ApiResponse<any>>(
      `/groups/details/debts/${debtId}/settle`,
    );
    return response.data;
  },
};
