/**
 * PAGE 3: Profile — Identity, ownership, long-term progress.
 * Reinforces “you’re in control” with target, momentum summary, skills, reflection, intensity.
 */
import { useState, useEffect } from 'react'
import MomentumBadge from '../components/MomentumBadge'
import SkillProgressCard from '../components/SkillProgressCard'
import { api } from '../api'
import styles from './ProfilePage.module.css'

const INTENSITY_OPTIONS = [
  { id: 'light', label: 'Light' },
  { id: 'standard', label: 'Standard' },
  { id: 'sprint', label: 'Sprint' },
]

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getProfile()
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [])

  const handleIntensity = (level) => {
    api.setIntensity(level).then(() => {
      setProfile((p) => (p ? { ...p, intensity: level } : null))
    })
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading…</div>
      </div>
    )
  }

  const user = profile?.user || {}
  const momentum = profile?.momentum || { completed: 4, total: 5 }
  const skills = profile?.skills || [
    { skill: 'Listening', current: 6.0, target: 6.5, confidence: 60 },
    { skill: 'Reading', current: 6.0, target: 6.5, confidence: 55 },
    { skill: 'Writing', current: 5.5, target: 6.0, confidence: 50 },
    { skill: 'Speaking', current: 6.0, target: 6.5, confidence: 58 },
  ]
  const reflection = profile?.reflection || [
    'You practiced Speaking 3 times',
    'Reading accuracy improved by 8%',
  ]
  const intensity = profile?.intensity || 'standard'

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Your profile</h1>
      </header>

      <div className={styles.content}>
        {/* User name + avatar placeholder */}
        <section className={styles.profileCard}>
          <div className={styles.avatar} aria-hidden />
          <div>
            <h2 className={styles.name}>{user.name || 'IELTS Learner'}</h2>
            <p className={styles.meta}>
              Target Band {user.targetBand ?? 6.5}
              {user.examDate && ` · Exam ${new Date(user.examDate).toLocaleDateString()}`}
            </p>
          </div>
        </section>

        {/* Weekly Momentum Summary */}
        <section className={styles.section}>
          <MomentumBadge
            completed={momentum.completed}
            total={momentum.total}
            label="Momentum maintained"
          />
        </section>

        {/* Skill breakdown cards */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Skill breakdown</h2>
          {skills.map((s) => (
            <SkillProgressCard
              key={s.skill}
              skill={s.skill}
              current={s.current}
              target={s.target}
              status="in progress"
              confidencePercent={s.confidence ?? 50}
            />
          ))}
        </section>

        {/* Weekly Reflection Preview */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>This week</h2>
          <ul className={styles.reflection}>
            {reflection.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </section>

        {/* Adjust Weekly Intensity */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Adjust weekly intensity</h2>
          <div className={styles.intensityRow}>
            {INTENSITY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`${styles.intensityBtn} ${intensity === opt.id ? styles.intensitySelected : ''}`}
                onClick={() => handleIntensity(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
