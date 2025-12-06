import { useState, useEffect } from 'react';
import { CalendarHeader, CalendarGrid, Legend } from '../components/calendar';
import { MonthlyStatsSection, GoalSection, TradeModal } from '../components';
import { useCalendarData } from '../hooks';
import { useAuth } from '../contexts/AuthContext';
import { createPNLEntry, updatePNLEntry, deletePNLEntry, fetchMonthlyGoal, upsertMonthlyGoal, deleteMonthlyGoal } from '../services/calendarService';
import type { TradeForm, MonthlyStats as MonthlyStatsType, GoalProgress } from '../types';
import styles from './CalendarPage.module.css';

export function CalendarPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const { data, setData, loading, error } = useCalendarData(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );

  // Form state
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [formData, setFormData] = useState<TradeForm>({ pnl: '', trades: '' });

  // Goal state
  const [currentGoal, setCurrentGoal] = useState<number | null>(null);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState('');

  // Load monthly goal when month changes
  useEffect(() => {
    if (!user?.id) return;

    async function loadGoal() {
      try {
        const goalData = await fetchMonthlyGoal(
          user!.id,
          currentDate.getFullYear(),
          currentDate.getMonth() + 1
        );
        setCurrentGoal(goalData?.goal ?? null);
      } catch (error) {
        console.error('Error loading goal:', error);
      }
    }

    loadGoal();
  }, [user, currentDate]);

  // Month navigation handlers
  const previousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  // Day click handler
  const handleDayClick = (day: number) => {
    const key = `${currentDate.getFullYear()}-${String(
      currentDate.getMonth() + 1
    ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDay(key);

    const existingData = data[key];
    if (existingData) {
      setFormData({
        pnl: existingData.pnl.toString(),
        trades: existingData.trades?.toString() || '',
      });
    } else {
      setFormData({ pnl: '', trades: '' });
    }
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay || !user) return;

    const pnlValue = parseFloat(formData.pnl);
    // const tradesValue = parseInt(formData.trades) || 0;
    const tradesValue = formData.trades ? parseInt(formData.trades) : undefined;

    if (isNaN(pnlValue)) return;

    try {
      const existingEntry = data[selectedDay];

      let savedEntry;
      if (existingEntry?.id) {
        // Update existing entry
        savedEntry = await updatePNLEntry(existingEntry.id, {
          pnl: pnlValue,
          trades: tradesValue,
        });
      } else {
        // Create new entry
        savedEntry = await createPNLEntry(user.id, selectedDay, pnlValue, tradesValue);
      }

      // Update local state with the saved entry (includes ID from server)
      const dayNumber = parseInt(selectedDay.split('-')[2]);
      setData((prev) => ({
        ...prev,
        [selectedDay]: {
          id: savedEntry.id,
          date: dayNumber,
          pnl: pnlValue,
          trades: tradesValue,
        },
      }));

      setSelectedDay(null);
      setFormData({ pnl: '', trades: '' });
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Failed to save entry. Please try again.');
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (!selectedDay) return;

    try {
      const entry = data[selectedDay];
      if (entry?.id) {
        await deletePNLEntry(entry.id);
      }

      setData((prev) => {
        const newData = { ...prev };
        delete newData[selectedDay];
        return newData;
      });

      setSelectedDay(null);
      setFormData({ pnl: '', trades: '' });
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };

  // Calculate monthly statistics
  const calculateMonthlyStats = (): MonthlyStatsType => {
    const entries = Object.values(data);
    let totalPnL = 0;
    let winningDays = 0;
    let losingDays = 0;
    let totalTrades = 0;

    entries.forEach((entry) => {
      totalPnL += entry.pnl;
      if (entry.pnl > 0) winningDays++;
      if (entry.pnl < 0) losingDays++;
      if (entry.trades != null) {
        totalTrades += entry.trades;
      }
    });

    return {
      totalPnL,
      winningDays,
      losingDays,
      totalTrades,
      tradingDays: winningDays + losingDays,
    };
  };

  // Format currency helper
  const formatCurrency = (amount: number) => {
    const prefix = amount >= 0 ? '+$' : '-$';
    return prefix + Math.abs(amount).toFixed(2);
  };

  // Goal handlers
  const handleGoalSave = async () => {
    if (!user?.id) return;

    const goalValue = parseFloat(goalInput);
    if (isNaN(goalValue) || goalValue <= 0) {
      alert('Please enter a valid positive number');
      return;
    }

    try {
      await upsertMonthlyGoal(
        user.id,
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        goalValue
      );
      setCurrentGoal(goalValue);
      setIsEditingGoal(false);
      setGoalInput('');
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Failed to save goal. Please try again.');
    }
  };

  const handleGoalEdit = () => {
    setGoalInput(currentGoal ? currentGoal.toString() : '');
    setIsEditingGoal(true);
  };

  const handleGoalClear = async () => {
    if (!user?.id) return;

    try {
      await deleteMonthlyGoal(
        user.id,
        currentDate.getFullYear(),
        currentDate.getMonth() + 1
      );
      setCurrentGoal(null);
    } catch (error) {
      console.error('Error clearing goal:', error);
      alert('Failed to clear goal. Please try again.');
    }
  };

  const handleGoalCancel = () => {
    setIsEditingGoal(false);
    setGoalInput('');
  };

  // Calculate goal progress
  const calculateGoalProgress = (monthlyStats: MonthlyStatsType): GoalProgress | null => {
    if (!currentGoal) return null;

    const progress = (monthlyStats.totalPnL / currentGoal) * 100;
    return {
      goal: currentGoal,
      current: monthlyStats.totalPnL,
      percentage: Math.max(0, Math.min(100, progress)),
      remaining: (currentGoal - monthlyStats.totalPnL) > 0 ? (currentGoal - monthlyStats.totalPnL) : 0,
    };
  };

  // Early returns for loading/error states
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        Loading calendar data...
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        Error loading data: {error}
      </div>
    );
  }

  // Calculate stats and goal progress for rendering
  const stats = calculateMonthlyStats();
  const goalProgress = calculateGoalProgress(stats);

  return (
    <div className={styles.container}>
      {/* Calendar Header */}
      <CalendarHeader
        currentDate={currentDate}
        onPreviousMonth={previousMonth}
        onNextMonth={nextMonth}
      />

      {/* Monthly Statistics Section */}
      <div className={styles.section}>
        <MonthlyStatsSection stats={stats} formatCurrency={formatCurrency} />
      </div>

      {/* Monthly Goal Section */}
      <div>
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
      </div>

      {/* Legend */}
      <Legend />

      {/* Calendar Grid */}
      <CalendarGrid
        currentDate={currentDate}
        data={data}
        onDayClick={handleDayClick}
      />

      {/* Trade Modal */}
      {selectedDay && (
        <TradeModal
          selectedDay={selectedDay}
          formData={formData}
          onFormChange={(field, value) =>
            setFormData((prev) => ({ ...prev, [field]: value }))
          }
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          onClose={() => setSelectedDay(null)}
          hasExistingData={!!data[selectedDay]}
        />
      )}
    </div>
  );
}
