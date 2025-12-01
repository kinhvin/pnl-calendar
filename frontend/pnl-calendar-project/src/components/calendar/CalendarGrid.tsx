import { CalendarDay } from './CalendarDay';
import type { DayData } from '../../types';
import styles from './CalendarGrid.module.css';

interface CalendarGridProps {
  currentDate: Date;
  data: Record<string, DayData>;
  onDayClick: (day: number) => void;
}

export function CalendarGrid({ currentDate, data, onDayClick }: CalendarGridProps) {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className={styles.emptyCell} />
      );
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const dayData = data[dateKey];
      
      const isToday =
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <CalendarDay
          key={day}
          day={day}
          data={dayData}
          isToday={isToday}
          onClick={() => onDayClick(day)}
        />
      );
    }

    return days;
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      {/* Weekday headers */}
      <div className={styles.weekdayHeader}>
        {weekdays.map((day) => (
          <div key={day} className={styles.weekday}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={styles.grid}>
        {renderDays()}
      </div>
    </div>
  );
}