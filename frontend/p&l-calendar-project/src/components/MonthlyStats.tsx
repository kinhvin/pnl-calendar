import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { MonthlyStats } from '../types';
import { styles } from '../styles';

interface MonthlyStatsProps {
  stats: MonthlyStats;
  formatCurrency: (amount: number) => string;
}

const MonthlyStatsSection: React.FC<MonthlyStatsProps> = ({ stats, formatCurrency }) => {
  return (
    <div style={styles.statsGrid}>
      <div style={styles.statCard}>
        <div style={styles.statLabel}>Monthly P&L</div>
        <div
          style={{
            ...styles.statValue,
            color: stats.totalPnL >= 0 ? '#16a34a' : '#dc2626',
          }}
        >
          {formatCurrency(stats.totalPnL)}
        </div>
      </div>
      <div style={styles.statCard}>
        <div style={styles.statLabel}>Trading Days</div>
        <div style={styles.statValue}>{stats.tradingDays}</div>
      </div>
      <div style={styles.statCard}>
        <div style={styles.statLabel}>Winning Days</div>
        <div
          style={{
            ...styles.statValue,
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <TrendingUp style={styles.smallIcon} />
          {stats.winningDays}
        </div>
      </div>
      <div style={styles.statCard}>
        <div style={styles.statLabel}>Losing Days</div>
        <div
          style={{
            ...styles.statValue,
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <TrendingDown style={styles.smallIcon} />
          {stats.losingDays}
        </div>
      </div>
      <div style={styles.statCard}>
        <div style={styles.statLabel}>Total Trades</div>
        <div style={styles.statValue}>{stats.totalTrades}</div>
      </div>
    </div>
  );
};

export default MonthlyStatsSection;


