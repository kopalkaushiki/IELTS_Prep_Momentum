/**
 * MomentumStreak: Simple streak display — “Momentum: X days this week”.
 * Gamified accent (amber) to celebrate consistency without feeling childish.
 */
import styles from './MomentumStreak.module.css'

export default function MomentumStreak({ daysThisWeek = 3 }) {
  return (
    <div className={styles.card}>
      <span className={styles.icon}>🔥</span>
      <div>
        <span className={styles.label}>Momentum</span>
        <span className={styles.value}>{daysThisWeek} days this week</span>
      </div>
    </div>
  )
}
