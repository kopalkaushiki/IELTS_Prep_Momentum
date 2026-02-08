/**
 * Bottom nav: Home, Setup, Profile. Clear labels and active state.
 * Colour: Blue for active item (structure/trust).
 */
import styles from './Nav.module.css'

export default function Nav({ current, onNavigate }) {
  return (
    <nav className={styles.nav} aria-label="Main">
      <button
        type="button"
        className={`${styles.link} ${current === 'home' ? styles.active : ''}`}
        onClick={() => onNavigate('home')}
      >
        <span className={styles.icon}>◉</span>
        <span>Home</span>
      </button>
      <button
        type="button"
        className={`${styles.link} ${current === 'setup' ? styles.active : ''}`}
        onClick={() => onNavigate('setup')}
      >
        <span className={styles.icon}>◇</span>
        <span>Setup</span>
      </button>
      <button
        type="button"
        className={`${styles.link} ${current === 'profile' ? styles.active : ''}`}
        onClick={() => onNavigate('profile')}
      >
        <span className={styles.icon}>◎</span>
        <span>Profile</span>
      </button>
    </nav>
  )
}
