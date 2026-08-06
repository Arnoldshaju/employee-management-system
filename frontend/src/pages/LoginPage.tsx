import { type FormEvent, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import { AuthLayout } from '../components/AuthLayout'

export function LoginPage({ navigate }: { navigate: (path: string) => void }) {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout eyebrow="Welcome back" title="Your people, one clear view." description="Sign in to manage employee operations securely.">
      <div className="form-wrap">
        <div className="form-heading">
          <p className="eyebrow">Employee management</p>
          <h2>Sign in to PeopleFlow</h2>
          <p>Enter the email and password connected to your account.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <label>
            Work email
            <input autoComplete="email" onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required type="email" value={email} />
          </label>
          <label>
            Password
            <input autoComplete="current-password" minLength={8} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" required type="password" value={password} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button" disabled={submitting} type="submit">{submitting ? 'Signing in…' : 'Sign in'}</button>
        </form>
        <p className="form-switch">
          New to PeopleFlow?{' '}
          <button className="text-button" onClick={() => navigate('/register')} type="button">Create an employee account</button>
        </p>
      </div>
    </AuthLayout>
  )
}
