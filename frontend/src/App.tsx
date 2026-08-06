import { useEffect, useState } from 'react'
import './App.css'

type ApiStatus = 'loading' | 'connected' | 'error'

interface HealthResponse {
  status: string
  message: string
}

function App() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>('loading')
  const [apiMessage, setApiMessage] = useState('Checking the Django API...')

  useEffect(() => {
    const checkApi = async () => {
      try {
        const response = await fetch('/api/health/')

        if (!response.ok) {
          throw new Error(`API responded with ${response.status}`)
        }

        const data: HealthResponse = await response.json()
        setApiStatus('connected')
        setApiMessage(data.message)
      } catch {
        setApiStatus('error')
        setApiMessage('Start Django on port 8000 to connect the application.')
      }
    }

    void checkApi()
  }, [])

  return (
    <main className="app-shell">
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="/">
          <span className="brand-mark">E</span>
          <span>PeopleFlow</span>
        </a>
        <span className="phase-label">Foundation · Phase 1</span>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Employee management, made clear</p>
          <h1>One workspace for your people operations.</h1>
          <p className="hero-description">
            We are building a secure system for employee profiles, departments,
            leave, attendance, documents, and role-based dashboards.
          </p>

          <div className={`status-card status-${apiStatus}`} role="status">
            <span className="status-dot" aria-hidden="true" />
            <div>
              <strong>
                {apiStatus === 'connected'
                  ? 'Frontend and backend connected'
                  : apiStatus === 'loading'
                    ? 'Connecting to backend'
                    : 'Backend is offline'}
              </strong>
              <p>{apiMessage}</p>
            </div>
          </div>
        </div>

        <aside className="roadmap-card" aria-labelledby="roadmap-title">
          <p className="card-kicker">Build roadmap</p>
          <h2 id="roadmap-title">What comes next</h2>
          <ol>
            <li className="active"><span>01</span> Project foundation</li>
            <li><span>02</span> Users and roles</li>
            <li><span>03</span> Employees and departments</li>
            <li><span>04</span> Leave and attendance</li>
          </ol>
        </aside>
      </section>
    </main>
  )
}

export default App
