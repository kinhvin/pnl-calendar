# Events System Guide

## Overview

Your PnL Calendar now includes a Google Calendar-style events system that lets you mark important dates with various types of events. This is perfect for tracking:

- 📰 **Important News** - Fed meetings, earnings reports, major announcements
- 🏖️ **Breaks/Holidays** - Christmas week, vacation days, market closures
- 📊 **Market Events** - Economic data releases, option expiration dates
- 🎯 **Milestones** - Personal goals achieved, profit targets reached
- 🔔 **Reminders** - Things you don't want to forget
- ✨ **Custom** - Anything else you want to track

## Features

### Visual Indicators on Calendar
- **Event Dots**: Small colored dots appear in the day number area showing which days have events
- **Event Titles**: When a day has no P&L data, event titles are displayed directly on the calendar
- **Multiple Events**: Days can have multiple events, with visual indicators showing "+ more" when there are too many to display

### Event Types & Colors
Each event type has a distinct color for easy visual recognition:
- News: Blue (#3b82f6)
- Break/Holiday: Purple (#8b5cf6)
- Market Event: Orange (#f59e0b)
- Milestone: Green (#10b981)
- Reminder: Indigo (#6366f1)
- Custom: Pink (#ec4899)

### Multi-Day Events
Events can span multiple days! For example:
- Mark an entire week off for Christmas break
- Track a multi-day conference
- Note a period of vacation

## How to Use

### Creating an Event

1. **Click "+ Add Event" button** above the calendar
2. Fill in the event details:
   - **Title**: Name your event (e.g., "Christmas Break", "FOMC Meeting")
   - **Event Type**: Choose from the 6 predefined types
   - **Start Date**: When the event begins
   - **End Date**: (Optional) For multi-day events
   - **Description**: (Optional) Additional notes
   - **All-day**: Keep checked for calendar events

3. Click **"Create Event"**

### Quick Create from Calendar
- Click on any day in the calendar
- The event modal will open with that date pre-selected
- Fill in the details and create

### Viewing Events

#### On the Calendar
- Events appear as colored dots on their dates
- Hover over dots to see event titles
- Days with only events (no P&L) show the event titles directly

#### Events List
1. Click **"Show Events"** button to see all events for the current month
2. Events are displayed in chronological order
3. Each card shows:
   - Event title and type badge
   - Date or date range
   - Description (if provided)

### Editing Events
1. Click on any event in the Events List
2. The event modal will open with current details
3. Make your changes and click **"Update Event"**

### Deleting Events
1. Open an event for editing
2. Click the **"Delete Event"** button at the bottom
3. Confirm the deletion

## Use Cases & Examples

### Example 1: Christmas Week Break
```
Title: Christmas Break
Type: Break/Holiday
Start Date: 2024-12-23
End Date: 2024-12-27
Description: Taking the week off for holidays
```

This will mark the entire week with purple dots on the calendar.

### Example 2: Fed Meeting
```
Title: FOMC Rate Decision
Type: News
Start Date: 2024-12-18
End Date: (leave empty for single day)
Description: Federal Reserve interest rate announcement - expect volatility
```

This creates a single-day event with important market news.

### Example 3: Earnings Season
```
Title: Tech Earnings Week
Type: Market Event
Start Date: 2024-01-15
End Date: 2024-01-19
Description: MSFT, AAPL, GOOGL reporting
```

Track multiple days of important earnings reports.

### Example 4: Personal Milestone
```
Title: Hit $10K Profit Goal!
Type: Milestone
Start Date: 2024-12-15
Description: Reached monthly profit target 🎉
```

Celebrate your achievements!

## Data Storage

Events are currently stored in **browser localStorage**, which means:
- ✅ Events persist between sessions
- ✅ No backend required
- ⚠️ Events are device-specific (won't sync across devices)
- ⚠️ Clearing browser data will delete events

### Future Enhancement: Database Integration
The architecture is ready to migrate to Supabase when needed. The event service can be updated to sync with your database just like the P&L entries.

## Technical Architecture

### Components Created
1. **EventModal** - Form for creating/editing events
2. **EventList** - Display events in a list format
3. **Updated CalendarDay** - Shows event indicators
4. **Updated CalendarGrid** - Passes events to days

### Services
- **eventService.ts** - All event CRUD operations
  - `createEvent()`
  - `updateEvent()`
  - `deleteEvent()`
  - `getEvents()`
  - `getEventsByDate()`
  - `getEventsByMonth()`

### Types
- **EventType** - Union type for event categories
- **CalendarEvent** - Full event data structure
- **EventFormData** - Form input data structure

## Tips & Best Practices

1. **Use Descriptive Titles**: Make events easy to identify at a glance
2. **Add Descriptions**: Capture important details you might forget later
3. **Color Coding**: Use event types consistently for visual scanning
4. **Review Monthly**: Click "Show Events" to review what's coming up
5. **Multi-Day for Breaks**: Use date ranges for vacation periods
6. **Single-Day for News**: Use individual events for specific announcements

## Keyboard Shortcuts (Future Enhancement)
- Press **E** to quickly add an event
- Press **Esc** to close modal
- Arrow keys to navigate dates

## Mobile Experience
The events system is fully responsive:
- Touch-friendly buttons and modals
- Scrollable event lists
- Easy date selection with native date pickers

## Questions?

The events system integrates seamlessly with your existing P&L tracking:
- Events don't interfere with P&L data
- You can have both events and P&L on the same day
- Navigate between calendar and chart views without losing event context

Happy tracking! 🎉
