import React from 'react';
import type { GoalProgress } from '../types';
import { styles } from '../styles';

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

const GoalSection: React.FC<GoalSectionProps> = ({
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
      <div style={styles.goalSection}>
        <h3 style={styles.goalTitle}>Monthly Goal</h3>

        {isEditingGoal ? (
          <div style={styles.goalForm}>
            <input
              type="number"
              value={goalInput}
              onChange={(e) => onGoalInputChange(e.target.value)}
              placeholder="Enter monthly goal ($)"
              style={styles.goalInput}
              autoFocus
            />
            <div style={styles.goalFormButtons}>
              <button onClick={onSave} style={styles.goalSaveButton}>
                Save
              </button>
              <button onClick={onCancel} style={styles.goalCancelButton}>
                Cancel
              </button>
            </div>
          </div>
        ) : goalProgress ? (
          <div>
            <div style={styles.goalStats}>
              <div style={styles.goalStatItem}>
                <span style={styles.goalLabel}>Goal:</span>
                <span style={styles.goalValue}>{formatCurrency(goalProgress.goal)}</span>
              </div>
              <div style={styles.goalStatItem}>
                <span style={styles.goalLabel}>Current:</span>
                <span
                  style={{
                    ...styles.goalValue,
                    color: goalProgress.current >= 0 ? '#16a34a' : '#dc2626',
                  }}
                >
                  {formatCurrency(goalProgress.current)}
                </span>
              </div>
              <div style={styles.goalStatItem}>
                <span style={styles.goalLabel}>Remaining:</span>
                <span style={styles.goalValue}>
                  {formatCurrency(Math.abs(goalProgress.remaining))}
                </span>
              </div>
            </div>

            <div style={styles.progressBarContainer}>
              <div
                style={{
                  ...styles.progressBar,
                  width: `${goalProgress.percentage}%`,
                  backgroundColor:
                    goalProgress.percentage >= 100 ? '#16a34a' : '#3b82f6',
                }}
              />
            </div>

            <div style={styles.progressText}>
              {goalProgress.percentage.toFixed(1)}% of goal achieved
            </div>

            <div style={styles.goalActions}>
              <button onClick={onEdit} style={styles.editGoalButton}>
                Edit Goal
              </button>
              <button onClick={onClear} style={styles.clearGoalButton}>
                Clear Goal
              </button>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <button onClick={onStartSetGoal} style={styles.setGoalButton}>
      Set Monthly Goal
    </button>
  );
};

export default GoalSection;


