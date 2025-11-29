import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DayData, TradeForm, GoalProgress, MonthlyStats } from './types';
import { styles } from './styles';
import MonthlyStatsSection from './components/MonthlyStats';
import GoalSection from './components/GoalSection';
import TradeModal from './components/TradeModal';

const PnLCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Sample data - replace with your actual data
  const sampleData: Record<string, DayData> = {
    '2025-11-24': { date: 24, pnl: 0, trades: 0 },
    '2025-11-25': { date: 25, pnl: 329.73, trades: 15 },
    '2025-11-26': { date: 26, pnl: -299.31, trades: 15 },
    '2025-11-27': { date: 27, pnl: 0, trades: 0 },
    '2025-11-28': { date: 28, pnl: -501.95, trades: 5 },
    '2025-12-01': { date: 1, pnl: 0, trades: 0 },
    '2025-12-02': { date: 2, pnl: 0, trades: 0 },
    '2025-12-03': { date: 3, pnl: 0, trades: 0 },
    '2025-12-04': { date: 4, pnl: 0, trades: 0 },
    '2025-12-05': { date: 5, pnl: 0, trades: 0 },
    '2025-12-08': { date: 8, pnl: 0, trades: 0 },
    '2025-12-09': { date: 9, pnl: 0, trades: 0 },
    '2025-12-10': { date: 10, pnl: 0, trades: 0 },
    '2025-12-11': { date: 11, pnl: 0, trades: 0 },
    '2025-12-12': { date: 12, pnl: 0, trades: 0 },
    '2025-12-15': { date: 15, pnl: 0, trades: 0 },
    '2025-12-16': { date: 16, pnl: 0, trades: 0 },
    '2025-12-17': { date: 17, pnl: 0, trades: 0 },
    '2025-12-18': { date: 18, pnl: 0, trades: 0 },
    '2025-12-19': { date: 19, pnl: 0, trades: 0 },
    '2025-12-22': { date: 22, pnl: 0, trades: 0 },
    '2025-12-23': { date: 23, pnl: 0, trades: 0 },
    '2025-12-24': { date: 24, pnl: 0, trades: 0 },
    '2025-12-25': { date: 25, pnl: 0, trades: 0 },
    '2025-12-26': { date: 26, pnl: 0, trades: 0 },
    '2025-12-29': { date: 29, pnl: 0, trades: 0 },
    '2025-12-30': { date: 30, pnl: 0, trades: 0 },
    '2025-12-31': { date: 31, pnl: 0, trades: 0 },
  };

  const [data, setData] = useState<Record<string, DayData>>(sampleData);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [formData, setFormData] = useState<TradeForm>({ pnl: '', trades: '' });
  const [monthlyGoals, setMonthlyGoals] = useState<Record<string, number>>({});
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState('');

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

  const calculateMonthlyStats = (): MonthlyStats => {
    const days = getDaysInMonth(currentDate);
    let totalPnL = 0;
    let winningDays = 0;
    let losingDays = 0;
    let totalTrades = 0;

    for (let day = 1; day <= days; day++) {
      const dataForDay = getDataForDay(day);
      if (dataForDay) {
        totalPnL += dataForDay.pnl;
        if (dataForDay.pnl > 0) winningDays++;
        if (dataForDay.pnl < 0) losingDays++;
        totalTrades += dataForDay.trades || 0;
      }
    }

    return { totalPnL, winningDays, losingDays, totalTrades, tradingDays: winningDays + losingDays };
  };

  const getCurrentMonthKey = () => {
    return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  };

  const handleGoalSave = () => {
  const goalValue = parseFloat(goalInput);
  if (isNaN(goalValue) || goalValue <= 0) {
    alert('Please enter a valid positive number');
    return;
  }
  
  setMonthlyGoals(prev => ({
    ...prev,
    [getCurrentMonthKey()]: goalValue
  }));
  
  setIsEditingGoal(false);
  setGoalInput('');
};

  const handleGoalEdit = () => {
    const currentGoal = monthlyGoals[getCurrentMonthKey()];
    setGoalInput(currentGoal ? currentGoal.toString() : '');
    setIsEditingGoal(true);
  };

  const handleGoalClear = () => {
    setMonthlyGoals(prev => {
      const newGoals = { ...prev };
      delete newGoals[getCurrentMonthKey()];
      return newGoals;
    });
  };

  const handleGoalCancel = () => {
    setIsEditingGoal(false);
    setGoalInput('');
  };

  const calculateGoalProgress = (monthlyStats: MonthlyStats): GoalProgress | null => {
    const currentGoal = monthlyGoals[getCurrentMonthKey()];
    if (!currentGoal) return null;
    
    const progress = (monthlyStats.totalPnL / currentGoal) * 100;
    return {
      goal: currentGoal,
      current: monthlyStats.totalPnL,
      percentage: Math.max(0, Math.min(100, progress)),
      remaining: currentGoal - monthlyStats.totalPnL
    };
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: React.ReactElement[] = [];

    // Empty cells for days before the month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} style={styles.emptyCell} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dataForDay = getDataForDay(day);
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
              ...(dataForDay ? styles.activeDayCell : {}),
              ...(dataForDay && dataForDay.pnl > 0 ? { backgroundColor: '#dcfce7' } : {}),
              ...(dataForDay && dataForDay.pnl < 0 ? { backgroundColor: '#fee2e2' } : {})
            }}
          >
          <div style={styles.dayNumber}>{day}</div>
          {dataForDay && (
            <div style={styles.dayContent}>
              <div style={dataForDay.pnl >= 0 ? styles.profitText : styles.lossText}>
                {formatCurrency(dataForDay.pnl)}
              </div>
              {dataForDay.trades && (
                <div style={styles.tradesText}>
                  {dataForDay.trades} trade{dataForDay.trades !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const handleFormChange = (field: keyof TradeForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const stats = calculateMonthlyStats();
  const goalProgress = calculateGoalProgress(stats);

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
          <MonthlyStatsSection stats={stats} formatCurrency={formatCurrency} />

          {/* Monthly Goal Section */}
          <GoalSection
            goalProgress={goalProgress}
            isEditingGoal={isEditingGoal}
            goalInput={goalInput}
            onGoalInputChange={setGoalInput}
            onSave={handleGoalSave}
            onCancel={handleGoalCancel}
            onEdit={handleGoalEdit}
            onClear={handleGoalClear}
            onStartSetGoal={() => setIsEditingGoal(true)}
            formatCurrency={formatCurrency}
          />

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
        <TradeModal
          selectedDay={selectedDay}
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onClose={closeModal}
          hasExistingData={!!data[selectedDay]}
        />
      )}
    </div>
  );
};

export default PnLCalendar;