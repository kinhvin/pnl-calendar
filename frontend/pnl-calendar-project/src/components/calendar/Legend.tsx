import styles from './Legend.module.css';

export function Legend() {
    return (
        <div className={styles.legend}>
            <div className={styles.legendItem}>
                <div className={`${styles.legendBox} ${styles.profit}`}></div>
                <span className={styles.legendText}>Profitable Day</span>
            </div>
            <div className={styles.legendItem}>
                <div className={`${styles.legendBox} ${styles.loss}`}></div>
                <span className={styles.legendText}>Loss Day</span>
            </div>
            <div className={styles.legendItem}>
                <div className={`${styles.legendBox} ${styles.today}`}></div>
                <span className={styles.legendText}>Today</span>
            </div>
        </div>
    );
}