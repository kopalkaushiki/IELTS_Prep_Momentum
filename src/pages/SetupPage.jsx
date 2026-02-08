/**
 * PAGE 2: Initial Setup — “This fits my life.” Light, fast, reassuring.
 * No long forms; icons and spacing used generously.
 */
import { useState } from 'react'
import { api } from '../api'
import styles from './SetupPage.module.css'

const BAND_OPTIONS = [5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0]
const TIME_OPTIONS = [
  { value: 10, label: '10 min', sub: 'Quick focus' },
  { value: 15, label: '15 min', sub: 'Sweet spot' },
  { value: 20, label: '20 min', sub: 'Deep practice' },
]
const SECTIONS = [
  { id: 'listening', label: 'Listening', icon: '🎧' },
  { id: 'reading', label: 'Reading', icon: '📖' },
  { id: 'writing', label: 'Writing', icon: '✍️' },
  { id: 'speaking', label: 'Speaking', icon: '🎤' },
]

export default function SetupPage({ onComplete }) {
  const [band, setBand] = useState(6.5)
  const [examDate, setExamDate] = useState('')
  const [dailyMinutes, setDailyMinutes] = useState(15)
  const [weakestSection, setWeakestSection] = useState(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const plan = {
      targetBand: band,
      examDate: examDate || null,
      dailyMinutes,
      weakestSection,
    }
    try {
      await api.saveUser(plan)
    } catch {
      // Still redirect so user can use the app with their choices (e.g. backend offline)
    } finally {
      setSaving(false)
      onComplete?.()
    }
  }

  const defaultDate = () => {
    const d = new Date()
    d.setMonth(d.getMonth() + 3)
    return d.toISOString().slice(0, 10)
  }
  const dateValue = examDate || defaultDate()

  return (
    <div className={styles.page}>
      <header className={styles.headerCard}>
        <h1 className={styles.title}>Set up your IELTS Momentum Path</h1>
        <p className={styles.subtext}>
          Just a few details to personalise your daily plan
        </p>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <section className={styles.section}>
          <label className={styles.label}>Target Band Score</label>
          <div className={styles.cardList} role="list">
            {BAND_OPTIONS.map((b) => (
              <button
                key={b}
                type="button"
                role="listitem"
                className={`${styles.card} ${band === b ? styles.cardSelected : ''}`}
                onClick={() => setBand(b)}
              >
                <span className={styles.cardMain}>{b}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.label} htmlFor="exam-date">Exam Date</label>
          <div className={styles.inputWrap}>
            <input
              id="exam-date"
              type="date"
              value={dateValue}
              onChange={(e) => setExamDate(e.target.value)}
              className={styles.input}
              min={new Date().toISOString().slice(0, 10)}
            />
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.label}>Daily available time</label>
          <div className={styles.cardList}>
            {TIME_OPTIONS.map((t) => (
              <button
                key={t.value}
                type="button"
                className={`${styles.timeCard} ${dailyMinutes === t.value ? styles.cardSelected : ''}`}
                onClick={() => setDailyMinutes(t.value)}
              >
                <span className={styles.timeLabel}>{t.label}</span>
                <span className={styles.timeSub}>{t.sub}</span>
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <label className={styles.labelOptional}>
            Weakest section <span>(optional)</span>
          </label>
          <div className={styles.cardList}>
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`${styles.sectionCard} ${weakestSection === s.id ? styles.cardSelected : ''}`}
                onClick={() => setWeakestSection(weakestSection === s.id ? null : s.id)}
              >
                <span className={styles.sectionIcon}>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </section>

        <div className={styles.ctaWrap}>
          <button type="submit" className={styles.cta} disabled={saving}>
            {saving ? 'Saving…' : 'Start My Momentum Path'}
          </button>
        </div>
      </form>
    </div>
  )
}
