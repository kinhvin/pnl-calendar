import type { CalendarEvent, EventType } from '../../types';
import styles from './EventList.module.css';

interface EventListProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  selectedDate?: string;
}

const EVENT_COLORS: Record<EventType, string> = {
  news: '#3b82f6',
  break: '#8b5cf6',
  market: '#f59e0b',
  milestone: '#10b981',
  reminder: '#6366f1',
  custom: '#ec4899',
};

const EVENT_LABELS: Record<EventType, string> = {
  news: 'News',
  break: 'Break',
  market: 'Market',
  milestone: 'Milestone',
  reminder: 'Reminder',
  custom: 'Custom',
};

export function EventList({ events, onEventClick, selectedDate }: EventListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const formatDateRange = (start: string, end?: string) => {
    if (!end || start === end) {
      return formatDate(start);
    }
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  // TEACHING MOMENT: Calculating event status
  // Events can be: upcoming, active (happening now), or past
  const getEventStatus = (event: CalendarEvent): 'past' | 'active' | 'upcoming' => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset to start of day for fair comparison
    
    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : startDate;
    
    if (endDate < now) return 'past';
    if (startDate <= now && endDate >= now) return 'active';
    return 'upcoming';
  };

  // TEACHING MOMENT: Smart sorting
  // Active events first, then upcoming, then past
  // Within each group, sort by date
  const sortedEvents = [...events].sort((a, b) => {
    const statusA = getEventStatus(a);
    const statusB = getEventStatus(b);
    
    const statusOrder = { active: 0, upcoming: 1, past: 2 };
    
    if (statusOrder[statusA] !== statusOrder[statusB]) {
      return statusOrder[statusA] - statusOrder[statusB];
    }
    
    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
  });

  if (events.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No events {selectedDate ? 'for this date' : 'yet'}</p>
        <span className={styles.emptyHint}>
          Click on a day to add your first event
        </span>
      </div>
    );
  }

  return (
    <div className={styles.eventList}>
      {sortedEvents.map((event) => {
        const status = getEventStatus(event);
        
        return (
          <div
            key={event.id}
            className={`${styles.eventCard} ${status === 'active' ? styles.activeEvent : ''} ${status === 'past' ? styles.pastEvent : ''}`}
            onClick={() => onEventClick(event)}
            style={{ borderLeftColor: event.color || EVENT_COLORS[event.type] }}
          >
            <div className={styles.eventHeader}>
              <div className={styles.eventTitleRow}>
                <div className={styles.eventTitle}>{event.title}</div>
                {status === 'active' && (
                  <span className={styles.activeIndicator}>● Active</span>
                )}
              </div>
              <span 
                className={styles.eventBadge}
                style={{ 
                  backgroundColor: `${event.color || EVENT_COLORS[event.type]}20`,
                  color: event.color || EVENT_COLORS[event.type]
                }}
              >
                {EVENT_LABELS[event.type]}
              </span>
            </div>
            
            <div className={styles.eventDate}>
              {formatDateRange(event.startDate, event.endDate)}
            </div>
            
            {event.description && (
              <div className={styles.eventDescription}>
                {event.description}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
