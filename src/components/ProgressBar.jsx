/**
 * ProgressBar — Reusable momentum/progress indicator.
 * Colour: Blue for progress/trust. Supports motivation by showing movement
 * that doesn’t reset on a missed day (cumulative feel).
 */
import styles from './ProgressBar.module.css'

export default function ProgressBar({
  label = 'Your IELTS Momentum',
  subtext,
  percent = 0,
  showPercent = true,
  className = '',
}) {
  return (
    <div className={`${styles.wrap} ${className}`}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {showPercent && <span className={styles.percent}>{Math.round(percent)}%</span>}
      </div>
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {subtext && <p className={styles.subtext}>{subtext}</p>}
    </div>
  )
}
