import { useEffect, useState } from 'react'
import { useAuth } from './auth/useAuth'
import { DashboardPage } from './pages/DashboardPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import './App.css'

function App() {
  const { user, loading } = useAuth()
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    const handleLink = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[data-link]')
      if (!target) return
      event.preventDefault()
      window.history.pushState({}, '', target.pathname)
      setPath(target.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    document.addEventListener('click', handleLink)
    return () => {
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('click', handleLink)
    }
  }, [])

  const navigate = (nextPath: string) => {
    window.history.pushState({}, '', nextPath)
    setPath(nextPath)
  }

  if (loading) return <main className="loading-screen"><span className="loader" />Restoring your session…</main>
  if (user) return <DashboardPage navigate={navigate} />
  if (path === '/register') return <RegisterPage navigate={navigate} />
  return <LoginPage navigate={navigate} />
}

export default App
