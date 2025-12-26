import type { DayData } from '../../types/calendar';
import type { CalendarEvent, EventType } from '../../types/events';
import styles from './CalendarDay.module.css';

interface CalendarDayProps {
    day: number;
    data: DayData | null;
    isToday: boolean;
    onClick: () => void;
    events?: CalendarEvent[];
}

const EVENT_COLORS: Record<EventType, string> = {
    news: '#3b82f6',
    break: '#8b5cf6',
    market: '#f59e0b',
    milestone: '#10b981',
    reminder: '#6366f1',
    custom: '#ec4899',
};

export function CalendarDay({ day, data, isToday, onClick, events = [] }: CalendarDayProps) {
    const formatCurrency = (amount: number) => {
        const prefix = amount >= 0 ? '+$' : '-$';
        return prefix + Math.abs(amount).toFixed(2);
    };

    const getDayClass = () => {
        const classes = [styles.dayCell];
        if (isToday) classes.push(styles.today);
        
        // TEACHING MOMENT: Priority System
        // 1. If P&L exists: P&L background color wins (profit/loss)
        // 2. If NO P&L but events exist: Event background color shows
        if (data) {
            // P&L takes priority
            if (data.pnl > 0) classes.push(styles.profit);
            else if (data.pnl < 0) classes.push(styles.loss);
        } else if (events.length > 0) {
            // No P&L, so show event styling
            classes.push(styles.eventDay);
        }
        
        return classes.join(' ');
    };

    // TEACHING MOMENT: Helper to get primary event color for visual accent
    const getPrimaryEventColor = () => {
        if (events.length === 0) return null;
        
        // Priority order: break > news > market > others
        const priorityOrder: EventType[] = ['break', 'news', 'market', 'milestone', 'reminder', 'custom'];
        
        for (const type of priorityOrder) {
            const event = events.find(e => e.type === type);
            if (event) return event.color || EVENT_COLORS[event.type];
        }
        
        return events[0].color || EVENT_COLORS[events[0].type];
    };

    const primaryEventColor = getPrimaryEventColor();

    return (
        <div
            onClick={onClick}
            className={getDayClass()}
            // TEACHING MOMENT: CSS custom properties allow dynamic styling
            // We pass the event color as a CSS variable that the stylesheet can use
            style={{
                '--event-accent-color': primaryEventColor,
            } as React.CSSProperties}
        >
            {/* Day Number + Event Indicators */}
            <div className={styles.dayNumber}>
                {day}
                {events.length > 0 && (
                    <div className={styles.eventIndicators}>
                        {events.slice(0, 3).map((event) => (
                            <div
                                key={event.id}
                                className={styles.eventDot}
                                style={{ backgroundColor: event.color || EVENT_COLORS[event.type] }}
                                title={event.title}
                            />
                        ))}
                        {events.length > 3 && (
                            <span className={styles.moreEvents}>+{events.length - 3}</span>
                        )}
                    </div>
                )}
            </div>

            {/* Main Content Area */}
            <div className={styles.dayBody}>
                {/* P&L Display - Always show if exists */}
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

                {/* Event Preview - Show compactly when P&L exists, expanded when it doesn't */}
                {events.length > 0 && (
                    <div className={data ? styles.eventPreviewCompact : styles.eventPreviewExpanded}>
                        {data ? (
                            // Compact: Just show first event title as a tag
                            <div className={styles.eventTag}>
                                <span 
                                    className={styles.eventTagDot}
                                    style={{ backgroundColor: primaryEventColor }}
                                />
                                {events[0].title}
                                {events.length > 1 && (
                                    <span className={styles.eventTagCount}>+{events.length - 1}</span>
                                )}
                            </div>
                        ) : (
                            // Expanded: Show multiple event titles
                            <>
                                {events.slice(0, 2).map((event) => (
                                    <div
                                        key={event.id}
                                        className={styles.eventTitle}
                                        style={{ borderLeftColor: event.color || EVENT_COLORS[event.type] }}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                                {events.length > 2 && (
                                    <div className={styles.moreEventsText}>
                                        +{events.length - 2} more
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
