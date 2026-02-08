/**
 * MomentumBadge — Weekly momentum summary (e.g. “4/5 days”).
 * Colour: Yellow accent for encouragement and momentum; not green
 * so it feels like “keep going” not “finished”.
 */
import styles from './MomentumBadge.module.css'

export default function MomentumBadge({ completed, total = 5, label = 'Momentum maintained' }) {
  return (
    <div className={styles.badge}>
      <span className={styles.icon}>✦</span>
      <div>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{completed}/{total} days</span>
      </div>
    </div>
  )
}
