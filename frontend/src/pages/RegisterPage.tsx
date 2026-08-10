import { type FormEvent, useState } from 'react'
import { useAuth } from '../auth/useAuth'
import type { RegisterInput } from '../auth/types'
import { AuthLayout } from '../components/AuthLayout'

const initialForm: RegisterInput = { username: '', email: '', password: '', first_name: '', last_name: '' }

export function RegisterPage({ navigate }: { navigate: (path: string) => void }) {
  const { register } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field: keyof RegisterInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await register(form)
      navigate('/dashboard')
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Registration failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout eyebrow="Employee access" title="Start with a secure workspace." description="New accounts begin with Employee access. HR controls elevated roles.">
      <div className="form-wrap register-form">
        <div className="form-heading">
          <p className="eyebrow">Create account</p>
          <h2>Join your organization</h2>
          <p>Use accurate details—they will form the start of your employee profile.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <label>First name<input required value={form.first_name} onChange={(event) => updateField('first_name', event.target.value)} /></label>
            <label>Last name<input required value={form.last_name} onChange={(event) => updateField('last_name', event.target.value)} /></label>
          </div>
          <label>Username<input autoComplete="username" required value={form.username} onChange={(event) => updateField('username', event.target.value)} /></label>
          <label>Work email<input autoComplete="email" required type="email" value={form.email} onChange={(event) => updateField('email', event.target.value)} /></label>
          <label>Password<input autoComplete="new-password" minLength={8} required type="password" value={form.password} onChange={(event) => updateField('password', event.target.value)} /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button" disabled={submitting} type="submit">{submitting ? 'Creating account…' : 'Create employee account'}</button>
        </form>
        <p className="form-switch">
          Already have an account?{' '}
          <button className="text-button" onClick={() => navigate('/login')} type="button">Sign in</button>
        </p>
      </div>
    </AuthLayout>
  )
}
