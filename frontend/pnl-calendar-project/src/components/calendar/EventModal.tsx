import { useState, useEffect } from 'react';
import type { CalendarEvent, EventType, EventFormData } from '../../types';
import styles from './EventModal.module.css';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: EventFormData) => void;
  onDelete?: (eventId: string) => void;
  selectedDate: string; // YYYY-MM-DD format
  existingEvent?: CalendarEvent;
}

const EVENT_TYPES: { value: EventType; label: string; description: string }[] = [
  { value: 'news', label: 'Important News', description: 'Fed meetings, earnings, major announcements' },
  { value: 'break', label: 'Break/Holiday', description: 'Days off from trading (vacation, holidays)' },
  { value: 'market', label: 'Market Event', description: 'Economic data releases, market events' },
  { value: 'milestone', label: 'Milestone', description: 'Personal goals, achievements' },
  { value: 'reminder', label: 'Reminder', description: 'General reminders' },
  { value: 'custom', label: 'Custom', description: 'Your own event type' },
];

const EVENT_COLORS: Record<EventType, string> = {
  news: '#3b82f6',      // Blue
  break: '#8b5cf6',     // Purple
  market: '#f59e0b',    // Orange
  milestone: '#10b981', // Green
  reminder: '#6366f1',  // Indigo
  custom: '#ec4899',    // Pink
};

export function EventModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  selectedDate, 
  existingEvent 
}: EventModalProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: selectedDate,
    endDate: selectedDate,
    type: 'reminder',
    allDay: true,
    color: EVENT_COLORS['reminder'],
  });

  // Populate form when editing existing event
  useEffect(() => {
    if (existingEvent) {
      setFormData({
        title: existingEvent.title,
        description: existingEvent.description || '',
        startDate: existingEvent.startDate,
        endDate: existingEvent.endDate || existingEvent.startDate,
        type: existingEvent.type,
        allDay: existingEvent.allDay,
        color: existingEvent.color || EVENT_COLORS[existingEvent.type],
      });
    } else {
      // Reset form for new event
      setFormData({
        title: '',
        description: '',
        startDate: selectedDate,
        endDate: selectedDate,
        type: 'reminder',
        allDay: true,
        color: EVENT_COLORS['reminder'],
      });
    }
    // Reset delete confirmation when modal opens/closes
    setShowDeleteConfirm(false);
  }, [existingEvent, selectedDate, isOpen]);

  const handleTypeChange = (type: EventType) => {
    setFormData({
      ...formData,
      type,
      color: EVENT_COLORS[type],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSave(formData);
    onClose();
  };

  // TEACHING MOMENT: Delete Confirmation State
  // Instead of using browser's confirm(), we track this in component state
  // This gives us full control over the UI and user experience
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    if (existingEvent && onDelete) {
      onDelete(existingEvent.id);
      onClose();
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{existingEvent ? 'Edit Event' : 'New Event'}</h2>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Title */}
          <div className={styles.formGroup}>
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Christmas Break, FOMC Meeting"
              required
            />
          </div>

          {/* Event Type */}
          <div className={styles.formGroup}>
            <label>Event Type *</label>
            <div className={styles.typeGrid}>
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  className={`${styles.typeBtn} ${formData.type === type.value ? styles.active : ''}`}
                  style={{
                    borderColor: formData.type === type.value ? EVENT_COLORS[type.value] : undefined,
                    backgroundColor: formData.type === type.value 
                      ? `${EVENT_COLORS[type.value]}15` 
                      : undefined,
                  }}
                  onClick={() => handleTypeChange(type.value)}
                >
                  <div 
                    className={styles.typeColor} 
                    style={{ backgroundColor: EVENT_COLORS[type.value] }}
                  />
                  <div>
                    <div className={styles.typeLabel}>{type.label}</div>
                    <div className={styles.typeDesc}>{type.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="startDate">Start Date *</label>
              <input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="endDate">End Date</label>
              <input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate}
              />
            </div>
          </div>

          {/* Description */}
          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add any notes or details about this event..."
              rows={3}
            />
          </div>

          {/* All Day Toggle */}
          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.allDay}
                onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
              />
              <span>All-day event</span>
            </label>
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <div>
              {existingEvent && onDelete && !showDeleteConfirm && (
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={handleDeleteClick}
                >
                  Delete Event
                </button>
              )}
              {/* TEACHING MOMENT: Custom Delete Confirmation UI */}
              {showDeleteConfirm && (
                <div className={styles.deleteConfirm}>
                  <span className={styles.deleteConfirmText}>Delete this event?</span>
                  <button
                    type="button"
                    className={styles.deleteConfirmBtn}
                    onClick={handleDeleteConfirm}
                  >
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    className={styles.deleteCancelBtn}
                    onClick={handleDeleteCancel}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
            <div className={styles.rightActions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.saveBtn}
              >
                {existingEvent ? 'Update' : 'Create'} Event
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
