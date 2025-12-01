import React from 'react';
import type { TradeForm } from '../types';
import styles from './TradeModal.module.css';

interface TradeModalProps {
  selectedDay: string;
  formData: TradeForm;
  onFormChange: (field: keyof TradeForm, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onDelete: () => void;
  onClose: () => void;
  hasExistingData: boolean;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  selectedDay,
  formData,
  onFormChange,
  onSubmit,
  onDelete,
  onClose,
  hasExistingData,
}) => {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.modalTitle}>Add/Edit Trade for {selectedDay}</h3>
        <form onSubmit={onSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>P&L ($)</label>
            <input
              type="number"
              step="0.01"
              value={formData.pnl}
              onChange={(e) => onFormChange('pnl', e.target.value)}
              className={styles.input}
              placeholder="Enter profit or loss (use negative for loss)"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Number of Trades</label>
            <input
              type="number"
              value={formData.trades}
              onChange={(e) => onFormChange('trades', e.target.value)}
              className={styles.input}
              placeholder="Enter number of trades"
            />
          </div>
          <div className={styles.modalButtons}>
            <button type="submit" className={styles.submitButton}>
              Save
            </button>
            {hasExistingData && (
              <button type="button" onClick={onDelete} className={styles.deleteButton}>
                Delete
              </button>
            )}
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

