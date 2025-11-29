export interface DayData {
  date: number;
  pnl: number;
  trades?: number;
}

export interface TradeForm {
  pnl: string;
  trades: string;
}

export interface GoalProgress {
  goal: number;
  current: number;
  percentage: number;
  remaining: number;
}

export interface MonthlyStats {
  totalPnL: number;
  winningDays: number;
  losingDays: number;
  totalTrades: number;
  tradingDays: number;
}


