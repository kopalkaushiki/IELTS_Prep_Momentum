/**
 * CompletionMessage: Reassuring “you showed up” state with a small visual cue.
 * Design: One clear win, subtle animation so it feels rewarding.
 */
import styles from './CompletionMessage.module.css'

export default function CompletionMessage() {
  return (
    <div className={styles.wrap}>
      <div className={styles.icon}>✓</div>
      <p className={styles.title}>Nice work! You showed up today.</p>
      <p className={styles.sub}>Every day counts toward your band goal.</p>
    </div>
  )
}
