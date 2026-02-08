/**
 * 3-page flow: Home (daily mission) | Setup | Profile.
 * Nav at bottom for easy thumb reach; backend drives persistence.
 */
import { useState } from 'react'
import HomePage from './pages/HomePage'
import SetupPage from './pages/SetupPage'
import ProfilePage from './pages/ProfilePage'
import Nav from './components/Nav'
import styles from './App.module.css'

export default function App() {
  const [page, setPage] = useState('setup') // 'home' | 'setup' | 'profile'

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        {page === 'home' && <HomePage />}
        {page === 'setup' && <SetupPage onComplete={() => setPage('home')} />}
        {page === 'profile' && <ProfilePage />}
      </main>
      <Nav current={page} onNavigate={setPage} />
    </div>
  )
}
