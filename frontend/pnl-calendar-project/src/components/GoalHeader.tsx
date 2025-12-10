import React, { useState, useEffect } from 'react';
import type { GoalProgress } from '../types';
import styles from './GoalHeader.module.css';

/**
 * 🎯 GoalHeader Component
 * 
 * TEACHING MOMENT: Seamless inline editing
 * 
 * The key to preventing the "box moving" issue:
 * 1. When you click "Edit Goal", the panel doesn't close
 * 2. The panel contents just swap from stats → edit form
 * 3. Same position, same size = no movement!
 */

interface GoalHeaderProps {
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

export const GoalHeader: React.FC<GoalHeaderProps> = ({
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
  /**
   * 🎨 Local State for Expanded View
   * 
   * This tracks if the details panel is open.
   * When editing starts, we keep it open!
   */
  const [isExpanded, setIsExpanded] = useState(false);

  /**
   * 🔄 Auto-expand when editing starts
   * 
   * TEACHING MOMENT: Why useEffect here?
   * 
   * When isEditingGoal changes from false → true (user clicks "Edit Goal"),
   * we automatically expand the panel so the edit form appears smoothly
   * in the same location where the stats were.
   */
  useEffect(() => {
    if (isEditingGoal) {
      setIsExpanded(true);
    }
  }, [isEditingGoal]);

  /**
   * 🎯 No Goal Set - Show "Set Monthly Goal" Button
   */
  if (!goalProgress && !isEditingGoal) {
    return (
      <button onClick={onStartSetGoal} className={styles.setGoalButton}>
        Set Monthly Goal
      </button>
    );
  }

  /**
   * 📊 Main Component - Always uses the same structure!
   * 
   * CRITICAL: This structure never changes:
   * - Compact bar (top)
   * - Expanded panel (below, when open)
   * 
   * Whether viewing OR editing, we use these same containers.
   * Only the contents inside them change!
   */
  if (goalProgress || isEditingGoal) {
    return (
      <div className={styles.container}>
        {/* 
          📦 Compact Summary Bar
          
          This stays visible and shows current mode.
          When editing: Can't click to collapse (editing in progress)
          When viewing: Click to toggle expand/collapse
        */}
        <div 
          className={`${styles.compactGoal} ${isEditingGoal ? styles.editing : ''} ${isExpanded ? styles.expanded : ''}`}
          onClick={() => !isEditingGoal && setIsExpanded(!isExpanded)}
          style={{ cursor: isEditingGoal ? 'default' : 'pointer' }}
        >
          <div className={styles.compactLeft}>
            <span className={styles.compactIcon}>{isEditingGoal ? '✏️' : '🎯'}</span>
            <span className={styles.compactLabel}>
              {isEditingGoal ? 'Editing Goal' : 'Monthly Goal'}
            </span>
          </div>
          
          {!isEditingGoal && goalProgress && (
            <>
              <div className={styles.compactStats}>
                <div className={styles.statBadge}>
                  <span className={styles.badgeLabel}>Current</span>
                  <strong
                    className={styles.badgeValue}
                    style={{ 
                      color: goalProgress.current >= 0 ? '#16a34a' : '#dc2626' 
                    }}
                  >
                    {formatCurrency(goalProgress.current)}
                  </strong>
                </div>
                <span className={styles.separator}>→</span>
                <div className={styles.statBadge}>
                  <span className={styles.badgeLabel}>Goal</span>
                  <span className={styles.badgeValue}>{formatCurrency(goalProgress.goal)}</span>
                </div>
              </div>
              <div className={styles.compactRight}>
                <div className={`${styles.progressBadge} ${goalProgress.percentage >= 100 ? styles.complete : ''}`}>
                  {goalProgress.percentage.toFixed(0)}%
                </div>
                <button 
                  className={styles.expandButton}
                  aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                >
                  {isExpanded ? '▲' : '▼'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* 
          📋 Expanded Panel - THE KEY TO NO MOVEMENT!
          
          TEACHING MOMENT: Same container, different contents
          
          This panel:
          - Opens when you click the compact bar OR when editing starts
          - Shows EITHER stats (view mode) OR edit form (edit mode)
          - NEVER changes position or size
          
          When you click "Edit Goal":
          1. Panel is already open (showing stats)
          2. Contents swap from stats → edit form
          3. Panel stays in exact same spot
          4. Result: NO MOVEMENT! ✨
        */}
        {(isExpanded || isEditingGoal) && (
          <div className={styles.expandedPanel}>
            {isEditingGoal ? (
              /* ✏️ EDIT MODE - Form in the panel */
              <div className={styles.editFormContainer}>
                <label className={styles.inputLabel}>
                  💰 Enter Your Monthly Goal
                </label>
                <div className={styles.inputWrapper}>
                  <span className={styles.currencySymbol}>$</span>
                  <input
                    type="number"
                    value={goalInput}
                    onChange={(e) => onGoalInputChange(e.target.value)}
                    placeholder="e.g., 5000"
                    className={styles.goalInput}
                    autoFocus
                  />
                </div>
                <div className={styles.goalFormButtons}>
                  <button onClick={onSave} className={styles.goalSaveButton}>
                    ✓ Save Goal
                  </button>
                  <button onClick={onCancel} className={styles.goalCancelButton}>
                    ✕ Cancel
                  </button>
                </div>
              </div>
            ) : goalProgress ? (
              /* 📊 VIEW MODE - Stats in the panel */
              <>
                {/* Three-column stats layout */}
                <div className={styles.goalStats}>
                  <div className={styles.goalStatItem}>
                    <span className={styles.goalLabel}>🎯 Goal</span>
                    <span className={styles.goalValue}>
                      {formatCurrency(goalProgress.goal)}
                    </span>
                  </div>
                  <div className={styles.goalStatItem}>
                    <span className={styles.goalLabel}>
                      {goalProgress.current >= 0 ? '📈 Current' : '📉 Current'}
                    </span>
                    <span
                      className={styles.goalValue}
                      style={{ color: goalProgress.current >= 0 ? '#16a34a' : '#dc2626' }}
                    >
                      {formatCurrency(goalProgress.current)}
                    </span>
                  </div>
                  <div className={styles.goalStatItem}>
                    <span className={styles.goalLabel}>
                      {goalProgress.remaining > 0 ? '🔜 Remaining' : '✅ Over Goal'}
                    </span>
                    <span className={styles.goalValue} style={{ color: goalProgress.remaining <= 0 ? '#16a34a' : '#1f2937' }}>
                      {goalProgress.remaining > 0 ? formatCurrency(goalProgress.remaining) : formatCurrency(Math.abs(goalProgress.remaining))}
                    </span>
                  </div>
                </div>

                {/* Progress bar with percentage text inside */}
                <div className={styles.progressBarContainer}>
                  <div
                    className={styles.progressBar}
                    style={{
                      width: `${Math.min(goalProgress.percentage, 100)}%`,
                      backgroundColor: goalProgress.percentage >= 100 ? '#16a34a' : '#3b82f6',
                    }}
                  >
                    {goalProgress.percentage >= 10 && (
                      <span className={styles.progressBarText}>
                        {goalProgress.percentage.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  {goalProgress.percentage < 10 && (
                    <span className={styles.progressBarTextOutside}>
                      {goalProgress.percentage.toFixed(1)}%
                    </span>
                  )}
                </div>

                {/* Status message */}
                <div className={styles.progressText}>
                  {goalProgress.percentage >= 100 ? (
                    <span className={styles.successText}>🎉 Congratulations! You've achieved your goal!</span>
                  ) : (
                    <span>Keep going! You're {(100 - goalProgress.percentage).toFixed(1)}% away from your goal</span>
                  )}
                </div>

                {/* Action buttons */}
                <div className={styles.goalActions}>
                  <button onClick={onEdit} className={styles.editGoalButton}>
                    ✏️ Edit Goal
                  </button>
                  <button onClick={onClear} className={styles.clearGoalButton}>
                    🗑️ Clear Goal
                  </button>
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    );
  }

  return null;
};
