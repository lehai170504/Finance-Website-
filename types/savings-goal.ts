export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  progressPercent: number;
  icon: string | null;
  color: string | null;
  completed: boolean;
}

export interface SavingsGoalRequest {
  name: string;
  targetAmount: number;
  icon?: string;
  color?: string;
}
