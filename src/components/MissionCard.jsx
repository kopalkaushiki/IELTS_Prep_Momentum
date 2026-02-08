/**
 * MissionCard — Daily micro-mission. One task, one win.
 * Colour: Blue accent for structure; green when complete for reassurance/success.
 * Checkbox/Complete button makes the action feel easy and achievable.
 */
import styles from './MissionCard.module.css'

export default function MissionCard({
  title,
  task,
  estimatedMinutes,
  completed = false,
  onComplete,
}) {
  return (
    <div className={`${styles.card} ${completed ? styles.completed : ''}`}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.task}>{task}</p>
      <div className={styles.footer}>
        <span className={styles.badge}>~{estimatedMinutes} min</span>
        {completed ? (
          <span className={styles.done}>Done</span>
        ) : (
          <button type="button" className={styles.cta} onClick={onComplete}>
            Complete
          </button>
        )}
      </div>
    </div>
  )
}
