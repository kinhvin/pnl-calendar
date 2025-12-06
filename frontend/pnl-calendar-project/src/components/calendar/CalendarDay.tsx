import type { DayData } from '../../types/calendar';
import styles from './CalendarDay.module.css';

interface CalendarDayProps {
    day: number;
    data: DayData | null;
    isToday: boolean;
    onClick: () => void;
}

export function CalendarDay({ day, data, isToday, onClick }: CalendarDayProps) {
    const formatCurrency = (amount: number) => {
        const prefix = amount >= 0 ? '+$' : '-$';
        return prefix + Math.abs(amount).toFixed(2);
    };

    const getDayClass = () => {
        const classes = [styles.dayCell];
        if (isToday) classes.push(styles.today);
        if (data) {
            if (data.pnl > 0) classes.push(styles.profit);
            else if (data.pnl < 0) classes.push(styles.loss);
        }
        return classes.join(' ');
    };

    return (
        <div
            onClick={onClick}
            className={getDayClass()}
        >
            <div className={styles.dayNumber}>
                {day}
            </div>

            {data && (
                <div className={styles.dayContent}>
                    <div 
                        className={styles.pnlValue}
                        style={{ color: data.pnl >= 0 ? '#16a34a' : '#dc2626' }}
                    >
                        {formatCurrency(data.pnl)}
                    </div>
                    {data.trades != null && data.trades > 0 && (
                        <div className={styles.tradesText}>
                            {data.trades} trade{data.trades !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}