/**
 * FlashCard — Quick, lightweight micro-learning. Swipeable stack feel.
 * Colour: White card with blue border for focus; flip reveals answer (no extra colour).
 * Supports short attention spans and one-card-at-a-time clarity.
 */
import { useState } from 'react'
import styles from './FlashCard.module.css'

export default function FlashCard({ front, back, onNext }) {
  const [flipped, setFlipped] = useState(false)

  const handleFlip = () => setFlipped((f) => !f)
  const handleNext = () => {
    setFlipped(false)
    onNext?.()
  }

  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.card}
        onClick={handleFlip}
        aria-pressed={flipped}
      >
        <div className={styles.side}>
          {flipped ? back : front}
        </div>
        <span className={styles.hint}>{flipped ? 'Tap to see question' : 'Tap to see answer'}</span>
      </button>
      {flipped && (
        <button type="button" className={styles.nextBtn} onClick={handleNext}>
          Next card
        </button>
      )}
    </div>
  )
}
