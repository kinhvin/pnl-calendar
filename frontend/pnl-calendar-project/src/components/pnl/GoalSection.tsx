import React from 'react';
import type { GoalProgress } from '../types';
import styles from './GoalSection.module.css';

interface GoalSectionProps {
  goalProgress: GoalProgress | null;
  isEditingGoal: boolean;
  goalInput: string;
  onGoalInputChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onClear: () => void;
  onStartSetGoal: () => void;
  formatCurrency: (amount: number) => string;
}

export const GoalSection: React.FC<GoalSectionProps> = ({
  goalProgress,
  isEditingGoal,
  goalInput,
  onGoalInputChange,
  onSave,
  onCancel,
  onEdit,
  onClear,
  onStartSetGoal,
  formatCurrency,
}) => {
  if (goalProgress || isEditingGoal) {
    return (
      <div className={styles.goalSection}>
        <h3 className={styles.goalTitle}>Monthly Goal</h3>

        {isEditingGoal ? (
          <div className={styles.goalForm}>
            <input
              type="number"
              value={goalInput}
              onChange={(e) => onGoalInputChange(e.target.value)}
              placeholder="Enter monthly goal ($)"
              className={styles.goalInput}
              autoFocus
            />
            <div className={styles.goalFormButtons}>
              <button onClick={onSave} className={styles.goalSaveButton}>
                Save
              </button>
              <button onClick={onCancel} className={styles.goalCancelButton}>
                Cancel
              </button>
            </div>
          </div>
        ) : goalProgress ? (
          <div>
            <div className={styles.goalStats}>
              <div className={styles.goalStatItem}>
                <span className={styles.goalLabel}>Goal:</span>
                <span className={styles.goalValue}>{formatCurrency(goalProgress.goal)}</span>
              </div>
              <div className={styles.goalStatItem}>
                <span className={styles.goalLabel}>Current:</span>
                <span
                  className={styles.goalValue}
                  style={{ color: goalProgress.current >= 0 ? '#16a34a' : '#dc2626' }}
                >
                  {formatCurrency(goalProgress.current)}
                </span>
              </div>
              <div className={styles.goalStatItem}>
                <span className={styles.goalLabel}>Remaining:</span>
                <span className={styles.goalValue}>
                  {formatCurrency(Math.abs(goalProgress.remaining))}
                </span>
              </div>
            </div>

            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{
                  width: `${goalProgress.percentage}%`,
                  backgroundColor: goalProgress.percentage >= 100 ? '#16a34a' : '#3b82f6',
                }}
              />
            </div>

            <div className={styles.progressText}>
              {goalProgress.percentage.toFixed(1)}% of goal achieved
            </div>

            <div className={styles.goalActions}>
              <button onClick={onEdit} className={styles.editGoalButton}>
                Edit Goal
              </button>
              <button onClick={onClear} className={styles.clearGoalButton}>
                Clear Goal
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <button onClick={onStartSetGoal} className={styles.setGoalButton}>
      Set Monthly Goal
    </button>
  );
};
