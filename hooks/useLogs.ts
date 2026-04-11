// hooks/useLogs.ts
import { useQuery } from "@tanstack/react-query";
import { logService } from "@/services/log.service";

export const useTransactionLogs = (transactionId: string | null) => {
  return useQuery({
    queryKey: ["transaction_logs", transactionId],
    queryFn: async () => {
      const res = await logService.getTransactionLogs(transactionId!);
      return res.data; 
    },
    enabled: !!transactionId, 
    staleTime: 60 * 1000, 
  });
};

export const useGroupLogs = (groupId: string | null) => {
  return useQuery({
    queryKey: ["group_logs", groupId],
    queryFn: async () => {
      const res = await logService.getGroupLogs(groupId!);
      return res.data;
    },
    enabled: !!groupId, 
    staleTime: 60 * 1000, 
    retry: false, 
  });
};