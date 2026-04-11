// types/log.ts

export interface TransactionLog {
  id: string;
  transactionId: string;
  updatedBy: string;
  action: string;
  details: string;
  updatedAt: string; 
}