import { useState } from 'react'
import { useAuth } from '../auth/useAuth'

const roleDescriptions = {
  ADMIN: 'You have system-wide administration access.',
  HR: 'You can manage people operations and employee records.',
  MANAGER: 'You can manage your team and review approvals.',
  EMPLOYEE: 'You can view your profile and use employee self-service.',
}

export function DashboardPage({ navigate }: { navigate: (path: string) => void }) {
  const { user, logout } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)
  if (!user) return null

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await logout()
      navigate('/login')
    } finally {
      setLoggingOut(false)
    }
  }

  const displayName = `${user.first_name} ${user.last_name}`.trim() || user.username

  return (
    <main className="dashboard-shell">
      <nav className="dashboard-nav">
        <a className="brand" href="/dashboard" data-link><span className="brand-mark">E</span><span>PeopleFlow</span></a>
        <button className="secondary-button" disabled={loggingOut} onClick={handleLogout} type="button">{loggingOut ? 'Signing out…' : 'Sign out'}</button>
      </nav>
      <section className="dashboard-content">
        <div className="welcome-block">
          <p className="eyebrow">Dashboard</p>
          <h1>Welcome, {displayName}.</h1>
          <p>{roleDescriptions[user.role]}</p>
        </div>
        <div className="profile-card">
          <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
          <div><span className="role-pill">{user.role}</span><h2>{displayName}</h2><p>{user.email}</p></div>
        </div>
        <div className="module-grid">
          <article><span>01</span><h3>Employee directory</h3><p>Coming in the next phase</p></article>
          <article><span>02</span><h3>Leave requests</h3><p>Planned module</p></article>
          <article><span>03</span><h3>Attendance</h3><p>Planned module</p></article>
        </div>
      </section>
    </main>
  )
}
