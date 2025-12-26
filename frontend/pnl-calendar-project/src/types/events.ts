/**
 * Event Types for Calendar
 * 
 * This defines different categories of events you can create.
 * Each type has a specific color and purpose.
 */
export type EventType = 
  | 'news'        // Important news/announcements (e.g., Fed meetings, earnings)
  | 'break'       // Days off from trading (e.g., vacation, holidays)
  | 'milestone'   // Personal milestones (e.g., profit goals reached)
  | 'reminder'    // General reminders
  | 'market'      // Market events (e.g., economic data releases)
  | 'custom';     // User-defined events

/**
 * CalendarEvent Interface
 * 
 * This is the main data structure for events.
 * 
 * - id: Unique identifier (generated when creating)
 * - title: What the event is called
 * - description: Optional details about the event
 * - startDate: When the event starts (ISO string format: "2024-12-25")
 * - endDate: Optional end date for multi-day events
 * - type: The category of event (affects color/icon)
 * - allDay: Whether it's an all-day event (vs specific time)
 * - color: Optional custom color (overrides type default)
 * - createdAt: When this event was created
 * - updatedAt: When this event was last modified
 */
export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string;  // ISO date string: "YYYY-MM-DD"
  endDate?: string;   // Optional for multi-day events
  type: EventType;
  allDay: boolean;
  color?: string;     // Hex color code (e.g., "#FF5733")
  createdAt: string;
  updatedAt: string;
}

/**
 * Form data for creating/editing events
 * This is what the form will work with before saving
 */
export interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: EventType;
  allDay: boolean;
  color: string;
}

/**
 * Default colors for each event type
 * These provide visual distinction between different event categories
 */
export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  news: '#3B82F6',       // Blue - informational
  break: '#F59E0B',      // Amber - vacation/rest
  milestone: '#10B981',  // Green - achievements
  reminder: '#8B5CF6',   // Purple - things to remember
  market: '#EF4444',     // Red - important market events
  custom: '#6B7280',     // Gray - user-defined
};

/**
 * Labels for each event type (for dropdowns/UI)
 */
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  news: '📰 News',
  break: '🏖️ Break/Vacation',
  milestone: '🎯 Milestone',
  reminder: '🔔 Reminder',
  market: '📊 Market Event',
  custom: '✨ Custom',
};
