import React from 'react';
import type { TradeForm } from '../types';
import { styles } from '../styles';

interface TradeModalProps {
  selectedDay: string;
  formData: TradeForm;
  onFormChange: (field: keyof TradeForm, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: () => void;
  onClose: () => void;
  hasExistingData: boolean;
}

const TradeModal: React.FC<TradeModalProps> = ({
  selectedDay,
  formData,
  onFormChange,
  onSubmit,
  onDelete,
  onClose,
  hasExistingData,
}) => {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={styles.modalTitle}>Add/Edit Trade for {selectedDay}</h3>
        <form onSubmit={onSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>PnL ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.pnl}
              onChange={(e) => onFormChange('pnl', e.target.value)}
              style={styles.input}
              placeholder="Enter profit or loss (use negative for loss)"
              required
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Number of Trades</label>
            <input
              type="number"
              value={formData.trades}
              onChange={(e) => onFormChange('trades', e.target.value)}
              style={styles.input}
              placeholder="Enter number of trades"
            />
          </div>
          <div style={styles.modalButtons}>
            <button type="submit" style={styles.submitButton}>
              Save
            </button>
            {hasExistingData && (
              <button type="button" onClick={onDelete} style={styles.deleteButton}>
                Delete
              </button>
            )}
            <button type="button" onClick={onClose} style={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TradeModal;


