/**
 * Backend for IELTS Momentum Path.
 * In-memory store; supports user setup, mission completion, momentum, profile, intensity.
 * Run: npm run server (or node server/index.cjs)
 */

const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const store = {
  user: null,
  missionCompletions: [],
  intensity: 'standard',
}

const today = () => new Date().toISOString().slice(0, 10)

function weekStart(d) {
  const x = new Date(d)
  const day = x.getDay()
  const diff = x.getDate() - day + (day === 0 ? -6 : 1)
  x.setDate(diff)
  return x.toISOString().slice(0, 10)
}

app.get('/api/user', (req, res) => {
  res.json(store.user)
})

app.post('/api/user', (req, res) => {
  store.user = {
    name: 'IELTS Learner',
    targetBand: req.body.targetBand ?? 6.5,
    examDate: req.body.examDate ?? null,
    dailyMinutes: req.body.dailyMinutes ?? 15,
    weakestSection: req.body.weakestSection ?? 'listening',
    flashcards: req.body.flashcards,
  }
  res.json(store.user)
})

app.get('/api/momentum', (req, res) => {
  const targetPerWeek = 5
  const weekStartStr = weekStart(today())
  const completedThisWeek = store.missionCompletions.filter(
    (c) => c.date >= weekStartStr && c.date <= today()
  ).length
  const percent = Math.min(100, Math.round((completedThisWeek / targetPerWeek) * 100))
  res.json({
    completedThisWeek,
    targetPerWeek,
    percent,
  })
})

app.get('/api/mission/today', (req, res) => {
  const completed = store.missionCompletions.some((c) => c.date === today())
  res.json({ completed })
})

app.post('/api/mission/complete', (req, res) => {
  const date = today()
  if (!store.missionCompletions.some((c) => c.date === date)) {
    store.missionCompletions.push({ date })
  }
  res.json({ ok: true })
})

app.get('/api/profile', (req, res) => {
  const weekStartStr = weekStart(today())
  const completed = store.missionCompletions.filter(
    (c) => c.date >= weekStartStr && c.date <= today()
  ).length
  res.json({
    user: store.user,
    momentum: { completed, total: 5 },
    intensity: store.intensity,
    skills: [
      { skill: 'Listening', current: 6.0, target: store.user?.targetBand ?? 6.5, confidence: 65 },
      { skill: 'Reading', current: 6.0, target: store.user?.targetBand ?? 6.5, confidence: 55 },
      { skill: 'Writing', current: 5.5, target: (store.user?.targetBand ?? 6.5) - 0.5, confidence: 50 },
      { skill: 'Speaking', current: 6.0, target: store.user?.targetBand ?? 6.5, confidence: 58 },
    ],
    reflection: [
      'You practiced Speaking 3 times',
      'Reading accuracy improved by 8%',
    ],
  })
})

app.post('/api/intensity', (req, res) => {
  const level = req.body?.level || 'standard'
  if (['light', 'standard', 'sprint'].includes(level)) {
    store.intensity = level
  }
  res.json({ intensity: store.intensity })
})

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`IELTS Momentum Path API at http://localhost:${PORT}`)
})
