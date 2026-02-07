import type { CalendarEvent, EventFormData } from '../types';

/**
 * Events Service
 * 
 * This service manages all event-related operations.
 * It handles storing events in localStorage for persistence.
 * 
 * Why localStorage?
 * - Data persists between browser sessions
 * - No backend needed for MVP
 * - Easy to migrate to API later
 */

const STORAGE_KEY = 'calendar_events';

/**
 * Generate a unique ID for new events
 * Uses timestamp + random number for uniqueness
 */
const generateId = (): string => {
  return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get all events from storage
 * Returns empty array if none exist
 */
export const getEvents = (): CalendarEvent[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading events:', error);
    return [];
  }
};

/**
 * Get events for a specific date
 * 
 * This checks if an event's date range includes the target date.
 * Useful for showing events on calendar days.
 * 
 * @param dateString - Date in YYYY-MM-DD format
 */
export const getEventsByDate = (dateString: string): CalendarEvent[] => {
  const events = getEvents();
  
  return events.filter(event => {
    const eventStart = new Date(event.startDate);
    const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
    const targetDate = new Date(dateString);
    
    // Check if target date falls within event range
    return targetDate >= eventStart && targetDate <= eventEnd;
  });
};

/**
 * Get events for a specific month
 * 
 * @param year - Year (e.g., 2024)
 * @param month - Month (0-11, where 0 = January)
 */
export const getEventsByMonth = (year: number, month: number): CalendarEvent[] => {
  const events = getEvents();
  
  return events.filter(event => {
    const eventStart = new Date(event.startDate);
    const eventEnd = event.endDate ? new Date(event.endDate) : eventStart;
    
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    
    // Check if event overlaps with this month at all
    return eventStart <= monthEnd && eventEnd >= monthStart;
  });
};

/**
 * Create a new event
 * 
 * Takes form data, adds metadata (id, timestamps), and saves it.
 */
export const createEvent = (formData: EventFormData): CalendarEvent => {
  const events = getEvents();
  
  const newEvent: CalendarEvent = {
    ...formData,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Add to beginning so newest events appear first
  events.unshift(newEvent);
  
  // Save to localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  
  return newEvent;
};

/**
 * Update an existing event
 * 
 * Finds event by ID, updates it, and saves changes.
 */
export const updateEvent = (
  id: string,
  updates: Partial<EventFormData>
): CalendarEvent | null => {
  const events = getEvents();
  const index = events.findIndex(event => event.id === id);
  
  if (index === -1) {
    console.error('Event not found:', id);
    return null;
  }
  
  // Merge updates with existing event
  events[index] = {
    ...events[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  
  return events[index];
};

/**
 * Delete an event
 * 
 * Removes event from storage by ID.
 */
export const deleteEvent = (id: string): boolean => {
  const events = getEvents();
  const filtered = events.filter(event => event.id !== id);
  
  // Check if anything was actually removed
  if (filtered.length === events.length) {
    console.error('Event not found:', id);
    return false;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

/**
 * Get a single event by ID
 */
export const getEventById = (id: string): CalendarEvent | null => {
  const events = getEvents();
  return events.find(event => event.id === id) || null;
};

/**
 * Clear all events (useful for testing or reset functionality)
 */
export const clearAllEvents = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
