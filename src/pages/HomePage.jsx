/**
 * PAGE 1: Home / Daily Mission — User’s daily destination.
 * Layout: Momentum bar (top) → Mission card → Progress that means something → Flashcards.
 * Goal: One task, one action, one win; motivating and reassuring.
 */
import { useState, useEffect } from 'react'
import ProgressBar from '../components/ProgressBar'
import MissionCard from '../components/MissionCard'
import SkillProgressCard from '../components/SkillProgressCard'
import FlashCard from '../components/FlashCard'
import CompletionMessage from '../components/CompletionMessage'
import { api } from '../api'
import styles from './HomePage.module.css'

const TASK_BY_SECTION = {
  listening: 'Solve 5 Listening MCQs',
  reading: 'Complete 1 Reading passage (13 questions)',
  writing: 'Plan and write 1 Task 2 essay outline',
  speaking: 'Record 3 Part 1 answers (1 min each)',
}

const DEFAULT_FLASHCARDS = [
  { front: 'What does "mitigate" mean?', back: 'To make something less severe or serious.' },
  { front: 'What does "coherent" mean?', back: 'Logical and consistent; easy to understand.' },
  { front: 'What does "substantial" mean?', back: 'Large in size, amount, or importance.' },
]

export default function HomePage() {
  const [user, setUser] = useState(null)
  const [momentum, setMomentum] = useState({ completedThisWeek: 3, targetPerWeek: 5, percent: 60 })
  const [missionComplete, setMissionComplete] = useState(false)
  const [flashcardIndex, setFlashcardIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getUser()
      .then((u) => {
        setUser(u || null)
        if (u) {
          api.getMomentum().then(setMomentum).catch(() => setMomentum({ completedThisWeek: 3, targetPerWeek: 5, percent: 60 }))
          // Don't pre-fill missionComplete: always show the mission card first, then completion message only after user clicks Complete
        }
        setLoading(false)
      })
      .catch(() => {
        setUser(null)
        setMomentum({ completedThisWeek: 3, targetPerWeek: 5, percent: 60 })
        setLoading(false)
      })
  }, [])

  const handleCompleteMission = () => {
    setMissionComplete(true)
    api.completeTodayMission().then(() => {
      api.getMomentum().then(setMomentum).catch(() => {})
    }).catch(() => {})
  }

  const targetBand = user?.targetBand ?? 6.5
  const dailyMinutes = user?.dailyMinutes ?? 15
  const weakestSection = user?.weakestSection ?? 'listening'
  const task = TASK_BY_SECTION[weakestSection] || TASK_BY_SECTION.listening

  const flashcards = user?.flashcards?.length ? user.flashcards : DEFAULT_FLASHCARDS
  const currentCard = flashcards[flashcardIndex % flashcards.length]

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>Loading…</div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.greeting}>Today's IELTS Mission</h1>
      </header>

      <div className={styles.content}>
        {/* 1. Momentum & Progress — top priority; progress doesn’t reset on missed day */}
        <section className={styles.section}>
          <ProgressBar
            label="Your IELTS Momentum"
            subtext="5 missions per week keeps your momentum alive"
            percent={momentum.percent}
            showPercent={true}
          />
        </section>

        {/* 2. Daily Micro-Mission Card */}
        <section className={styles.section}>
          {missionComplete ? (
            <CompletionMessage />
          ) : (
            <MissionCard
              title={`Today's ${dailyMinutes}-minute Mission`}
              task={task}
              estimatedMinutes={dailyMinutes}
              completed={false}
              onComplete={handleCompleteMission}
            />
          )}
        </section>

        {/* 3. Progress that actually means something */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Progress toward your goal</h2>
          <SkillProgressCard
            skill="Listening"
            current={6.0}
            target={6.5}
            status="in progress"
            confidencePercent={65}
          />
          <p className={styles.projection}>
            At your current pace, you're on track for Band 7 in 4 weeks.
          </p>
        </section>

        {/* 4. Flashcard practice — lightweight, 2–3 cards */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Quick vocab</h2>
          <FlashCard
            front={currentCard.front}
            back={currentCard.back}
            onNext={() => setFlashcardIndex((i) => i + 1)}
          />
        </section>
      </div>
    </div>
  )
}
