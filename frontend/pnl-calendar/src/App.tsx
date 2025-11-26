import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

interface DayData {
  date: number;
  pnl: number;
  trades?: number;
}

interface TradeForm {
  pnl: string;
  trades: string;
}

const PnLCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Sample data - replace with your actual data
  const sampleData: Record<string, DayData> = {
    '2025-11-03': { date: 1, pnl: 250, trades: 3 },
    '2025-11-04': { date: 4, pnl: -120, trades: 2 },
    '2025-11-05': { date: 5, pnl: 480, trades: 5 },
    '2025-11-06': { date: 6, pnl: 190, trades: 2 },
    '2025-11-07': { date: 8, pnl: -85, trades: 1 },
    '2025-11-10': { date: 11, pnl: 320, trades: 4 },
    '2025-11-12': { date: 12, pnl: 150, trades: 3 },
    '2025-11-13': { date: 13, pnl: -200, trades: 2 },
    '2025-11-14': { date: 15, pnl: 410, trades: 6 },
    '2025-11-18': { date: 18, pnl: 275, trades: 3 },
    '2025-11-19': { date: 19, pnl: -95, trades: 2 },
    '2025-11-20': { date: 20, pnl: 520, trades: 7 },
    '2025-11-21': { date: 22, pnl: 180, trades: 2 },
    '2025-11-24': { date: 25, pnl: 340, trades: 4 },
  };

  const [data, setData] = useState<Record<string, DayData>>(sampleData);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [formData, setFormData] = useState<TradeForm>({ pnl: '', trades: '' });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const formatCurrency = (amount: number) => {
    const prefix = amount >= 0 ? '+$' : '-$';
    return prefix + Math.abs(amount).toFixed(2);
  };

  const getDataForDay = (day: number): DayData | null => {
    const key = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return data[key] || null;
  };

  const handleDayClick = (day: number) => {
    const key = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDay(key);
    const existingData = data[key];
    if (existingData) {
      setFormData({
        pnl: existingData.pnl.toString(),
        trades: existingData.trades?.toString() || ''
      });
    } else {
      setFormData({ pnl: '', trades: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay) return;
    
    const pnlValue = parseFloat(formData.pnl);
    const tradesValue = parseInt(formData.trades) || 0;
    
    if (isNaN(pnlValue)) return;
    
    const dayNumber = parseInt(selectedDay.split('-')[2]);
    
    setData(prev => ({
      ...prev,
      [selectedDay]: {
        date: dayNumber,
        pnl: pnlValue,
        trades: tradesValue
      }
    }));
    
    setSelectedDay(null);
    setFormData({ pnl: '', trades: '' });
  };

  const handleDelete = () => {
    if (!selectedDay) return;
    setData(prev => {
      const newData = { ...prev };
      delete newData[selectedDay];
      return newData;
    });
    setSelectedDay(null);
    setFormData({ pnl: '', trades: '' });
  };

  const closeModal = () => {
    setSelectedDay(null);
    setFormData({ pnl: '', trades: '' });
  };

  const calculateMonthlyStats = () => {
    const days = getDaysInMonth(currentDate);
    let totalPnL = 0;
    let winningDays = 0;
    let losingDays = 0;
    let totalTrades = 0;

    for (let day = 1; day <= days; day++) {
      const data = getDataForDay(day);
      if (data) {
        totalPnL += data.pnl;
        if (data.pnl > 0) winningDays++;
        if (data.pnl < 0) losingDays++;
        totalTrades += data.trades || 0;
      }
    }

    return { totalPnL, winningDays, losingDays, totalTrades, tradingDays: winningDays + losingDays };
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={styles.emptyCell} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const data = getDataForDay(day);
      const isToday = 
        day === new Date().getDate() && 
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

        days.push(
          <div
            key={day}
            onClick={() => handleDayClick(day)}
            style={{
              ...styles.dayCell,
              ...(isToday ? styles.todayCell : {}),
              ...(data ? styles.activeDayCell : {}),
              ...(data && data.pnl > 0 ? { backgroundColor: '#dcfce7' } : {}),
              ...(data && data.pnl < 0 ? { backgroundColor: '#fee2e2' } : {})
            }}
          >
          <div style={styles.dayNumber}>{day}</div>
          {data && (
            <div style={styles.dayContent}>
              <div style={data.pnl >= 0 ? styles.profitText : styles.lossText}>
                {formatCurrency(data.pnl)}
              </div>
              {data.trades && (
                <div style={styles.tradesText}>
                  {data.trades} trade{data.trades !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const stats = calculateMonthlyStats();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.card}>
          <h1 style={styles.title}>P&L Calendar</h1>
          
          {/* Month Navigation */}
          <div style={styles.navigation}>
            <button onClick={previousMonth} style={styles.navButton}>
              <ChevronLeft style={styles.icon} />
            </button>
            <h2 style={styles.monthTitle}>
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button onClick={nextMonth} style={styles.navButton}>
              <ChevronRight style={styles.icon} />
            </button>
          </div>

          {/* Monthly Statistics */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Monthly P&L</div>
              <div style={{
                ...styles.statValue,
                color: stats.totalPnL >= 0 ? '#16a34a' : '#dc2626'
              }}>
                {formatCurrency(stats.totalPnL)}
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Trading Days</div>
              <div style={styles.statValue}>{stats.tradingDays}</div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Winning Days</div>
              <div style={{...styles.statValue, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '4px'}}>
                <TrendingUp style={styles.smallIcon} />
                {stats.winningDays}
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Losing Days</div>
              <div style={{...styles.statValue, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px'}}>
                <TrendingDown style={styles.smallIcon} />
                {stats.losingDays}
              </div>
            </div>
            <div style={styles.statCard}>
              <div style={styles.statLabel}>Total Trades</div>
              <div style={styles.statValue}>{stats.totalTrades}</div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div style={styles.calendar}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={styles.weekdayHeader}>
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>

          {/* Legend */}
          <div style={styles.legend}>
            <div style={styles.legendItem}>
              <div style={{...styles.legendBox, backgroundColor: '#dcfce7', border: '2px solid #16a34a'}}></div>
              <span style={styles.legendText}>Profitable Day</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.legendBox, backgroundColor: '#fee2e2', border: '2px solid #dc2626'}}></div>
              <span style={styles.legendText}>Loss Day</span>
            </div>
            <div style={styles.legendItem}>
              <div style={{...styles.legendBox, backgroundColor: '#ffffff', border: '2px solid #3b82f6'}}></div>
              <span style={styles.legendText}>Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedDay && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>
              Add/Edit Trade for {selectedDay}
            </h3>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>P&L ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.pnl}
                  onChange={(e) => setFormData(prev => ({ ...prev, pnl: e.target.value }))}
                  style={styles.input}
                  placeholder="Enter profit or loss (use negative for loss)"
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Number of Trades</label>
                <input
                  type="number"
                  value={formData.trades}
                  onChange={(e) => setFormData(prev => ({ ...prev, trades: e.target.value }))}
                  style={styles.input}
                  placeholder="Enter number of trades"
                />
              </div>
              <div style={styles.modalButtons}>
                <button type="submit" style={styles.submitButton}>
                  Save
                </button>
                {data[selectedDay] && (
                  <button type="button" onClick={handleDelete} style={styles.deleteButton}>
                    Delete
                  </button>
                )}
                <button type="button" onClick={closeModal} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    minWidth: '100vw',
    backgroundColor: '#f9fafb',
    padding: '2rem',
  },
  content: {
    width: '100%',
    maxWidth: '1400px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    marginBottom: '24px',
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '24px',
    marginTop: 0,
  },
  navigation: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  navButton: {
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    fontSize: '32px',
    fontWeight: 'bold',
    lineHeight: '1',
    color: 'black'
  },
  icon: {
    width: '24px',
    height: '24px',
  },
  smallIcon: {
    width: '16px',
    height: '16px',
  },
  monthTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1f2937',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    backgroundColor: '#f9fafb',
    padding: '16px',
    borderRadius: '8px',
  },
  statLabel: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1f2937',
  },
  calendar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '4px',
  },
  weekdayHeader: {
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#4b5563',
    padding: '8px',
  },
  emptyCell: {
    aspectRatio: '1',
  },
  dayCell: {
    aspectRatio: '1',
    border: '1px solid #e5e7eb',
    padding: '8px',
    display: 'flex',
    flexDirection: 'column',
  },
  todayCell: {
    boxShadow: '0 0 0 2px #3b82f6',
  },
  activeDayCell: {
    cursor: 'pointer',
  },
  dayNumber: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px',
  },
  dayContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  profitText: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#16a34a',
  },
  lossText: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#dc2626',
  },
  tradesText: {
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  },
  legend: {
    marginTop: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    fontSize: '14px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendBox: {
    width: '16px',
    height: '16px',
    borderRadius: '2px',
  },
  legendText: {
    color: '#4b5563',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '24px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: '20px',
    color: '#1f2937',
  },
  formGroup: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '6px',
    color: '#374151',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    boxSizing: 'border-box',
  },
  modalButtons: {
    display: 'flex',
    gap: '8px',
    marginTop: '20px',
  },
  submitButton: {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  deleteButton: {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  cancelButton: {
    flex: 1,
    padding: '10px 16px',
    backgroundColor: '#6b7280',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
};

export default PnLCalendar