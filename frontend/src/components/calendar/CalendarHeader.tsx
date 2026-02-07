import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CalendarHeader.module.css';

interface CalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export function CalendarHeader({
  currentDate,
  onPreviousMonth,
  onNextMonth,
}: CalendarHeaderProps) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className={styles.header}>
      <button
        onClick={onPreviousMonth}
        className={styles.navButton}
        aria-label="Previous month"
      >
        <ChevronLeft className={styles.icon} />
      </button>
      
      <h2 className={styles.monthTitle}>
        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
      </h2>
      
      <button
        onClick={onNextMonth}
        className={styles.navButton}
        aria-label="Next month"
      >
        <ChevronRight className={styles.icon} />
      </button>
    </div>
  );
}