import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { MonthlyStats } from '../../types';
import styles from './MonthlyStats.module.css';

interface MonthlyStatsProps {
  stats: MonthlyStats;
  formatCurrency: (amount: number) => string;
}

export const MonthlyStatsSection: React.FC<MonthlyStatsProps> = ({ stats, formatCurrency }) => {
  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Monthly P&L</div>
        <div
          className={styles.statValue}
          style={{ color: stats.totalPnL >= 0 ? '#16a34a' : '#dc2626' }}
        >
          {formatCurrency(stats.totalPnL)}
        </div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Trading Days</div>
        <div className={styles.statValue}>{stats.tradingDays}</div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Winning Days</div>
        <div
          className={styles.statValue}
          style={{ color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <TrendingUp className={styles.smallIcon} />
          {stats.winningDays}
        </div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Losing Days</div>
        <div
          className={styles.statValue}
          style={{ color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <TrendingDown className={styles.smallIcon} />
          {stats.losingDays}
        </div>
      </div>
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Total Trades</div>
        <div className={styles.statValue}>{stats.totalTrades}</div>
      </div>
    </div>
  );
};
