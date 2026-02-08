/**
 * SkillProgressCard — Per-skill progress (e.g. Listening 6.0 → 6.5).
 * Colour: Blue for in-progress; green for “on track”. Simple bars/dots
 * reinforce confidence without feeling test-heavy.
 */
import styles from './SkillProgressCard.module.css'

export default function SkillProgressCard({
  skill,
  current,
  target,
  status = 'in progress', // 'in progress' | 'on track'
  confidencePercent = 50, // 0–100 for bar
}) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.skill}>{skill}</span>
        <span className={styles.range}>
          {current} → {target}
        </span>
      </div>
      <div className={styles.barWrap}>
        <div
          className={styles.bar}
          style={{ width: `${Math.min(100, confidencePercent)}%` }}
        />
      </div>
      <span className={styles.status}>{status}</span>
    </div>
  )
}
