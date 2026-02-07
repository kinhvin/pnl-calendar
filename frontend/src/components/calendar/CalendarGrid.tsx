import { CalendarDay } from './CalendarDay';
import type { DayData } from '../../types';
import type { CalendarEvent } from '../../types/events';
import styles from './CalendarGrid.module.css';

interface CalendarGridProps {
  currentDate: Date;
  data: Record<string, DayData>;
  events?: CalendarEvent[];
  onDayClick: (day: number) => void;
}

export function CalendarGrid({ currentDate, data, events = [], onDayClick }: CalendarGridProps) {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (dateKey: string): CalendarEvent[] => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
      const targetDate = new Date(dateKey);
      
      // Check if target date falls within event range
      return targetDate >= eventStart && targetDate <= eventEnd;
    });
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
      const dayEvents = getEventsForDate(dateKey);
      
      const isToday =
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <CalendarDay
          key={day}
          day={day}
          data={dayData}
          events={dayEvents}
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