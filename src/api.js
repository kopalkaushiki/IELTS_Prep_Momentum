/**
 * API client for IELTS Momentum Path.
 * By default uses localStorage only (no backend), so dev works without proxy errors.
 * Set VITE_USE_BACKEND=true and run the server to use the real API.
 */

const BASE = '/api'
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true'

const LS_KEYS = {
  user: 'ielts_user',
  completions: 'ielts_completions',
  intensity: 'ielts_intensity',
}

function getJson(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key)
    return raw != null ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function setJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function weekStart(dateStr) {
  const x = new Date(dateStr)
  const day = x.getDay()
  const diff = x.getDate() - day + (day === 0 ? -6 : 1)
  x.setDate(diff)
  return x.toISOString().slice(0, 10)
}

// --- Local storage “backend” (used when backend is off or as fallback) ---

function localGetUser() {
  return getJson(LS_KEYS.user)
}

function localSaveUser(data) {
  const user = {
    name: 'IELTS Learner',
    targetBand: data.targetBand ?? 6.5,
    examDate: data.examDate ?? null,
    dailyMinutes: data.dailyMinutes ?? 15,
    weakestSection: data.weakestSection ?? 'listening',
  }
  setJson(LS_KEYS.user, user)
  return user
}

function localGetCompletions() {
  return getJson(LS_KEYS.completions, [])
}

function localSaveCompletions(dates) {
  setJson(LS_KEYS.completions, dates)
}

function localGetMomentum() {
  const completions = localGetCompletions()
  const weekStartStr = weekStart(today())
  const completedThisWeek = completions.filter(
    (d) => d >= weekStartStr && d <= today()
  ).length
  const targetPerWeek = 5
  const percent = Math.min(100, Math.round((completedThisWeek / targetPerWeek) * 100))
  return {
    completedThisWeek,
    targetPerWeek,
    percent,
  }
}

function localGetTodayCompleted() {
  return localGetCompletions().includes(today())
}

function localCompleteToday() {
  const dates = localGetCompletions()
  const d = today()
  if (!dates.includes(d)) {
    setJson(LS_KEYS.completions, [...dates, d])
  }
  return Promise.resolve({ ok: true })
}

function localGetProfile() {
  const user = localGetUser()
  const momentum = localGetMomentum()
  const intensity = getJson(LS_KEYS.intensity, 'standard')
  return {
    user,
    momentum: { completed: momentum.completedThisWeek, total: 5 },
    intensity,
    skills: [
      { skill: 'Listening', current: 6.0, target: user?.targetBand ?? 6.5, confidence: 65 },
      { skill: 'Reading', current: 6.0, target: user?.targetBand ?? 6.5, confidence: 55 },
      { skill: 'Writing', current: 5.5, target: (user?.targetBand ?? 6.5) - 0.5, confidence: 50 },
      { skill: 'Speaking', current: 6.0, target: user?.targetBand ?? 6.5, confidence: 58 },
    ],
    reflection: [
      'You practiced Speaking 3 times',
      'Reading accuracy improved by 8%',
    ],
  }
}

function localSetIntensity(level) {
  if (['light', 'standard', 'sprint'].includes(level)) {
    setJson(LS_KEYS.intensity, level)
  }
  return Promise.resolve({ intensity: getJson(LS_KEYS.intensity, 'standard') })
}

// --- Fetch with optional fallback ---

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  if (!res.ok) {
    const err = new Error(res.statusText)
    err.status = res.status
    throw err
  }
  return res.json().catch(() => ({}))
}

async function withFallback(fn, fallback) {
  try {
    return await fn()
  } catch {
    return fallback()
  }
}

export const api = {
  async getUser() {
    if (!USE_BACKEND) return localGetUser()
    return withFallback(
      () => request('/user'),
      () => localGetUser()
    )
  },

  async saveUser(data) {
    if (!USE_BACKEND) return localSaveUser(data)
    return withFallback(
      () => request('/user', { method: 'POST', body: JSON.stringify(data) }),
      () => localSaveUser(data)
    )
  },

  async getMomentum() {
    if (!USE_BACKEND) return localGetMomentum()
    return withFallback(
      () => request('/momentum'),
      () => localGetMomentum()
    )
  },

  async getTodayMissionCompleted() {
    if (!USE_BACKEND) return localGetTodayCompleted()
    return withFallback(
      () => request('/mission/today').then((d) => d.completed === true),
      () => localGetTodayCompleted()
    )
  },

  async completeTodayMission() {
    if (!USE_BACKEND) {
      localCompleteToday()
      return Promise.resolve()
    }
    return withFallback(
      () => request('/mission/complete', { method: 'POST' }),
      () => localCompleteToday()
    )
  },

  async getProfile() {
    if (!USE_BACKEND) return localGetProfile()
    return withFallback(
      () => request('/profile'),
      () => localGetProfile()
    )
  },

  async setIntensity(level) {
    if (!USE_BACKEND) return localSetIntensity(level)
    return withFallback(
      () => request('/intensity', { method: 'POST', body: JSON.stringify({ level }) }),
      () => localSetIntensity(level)
    )
  },
}
