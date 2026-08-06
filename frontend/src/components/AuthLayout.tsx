import type { ReactNode } from 'react'

interface AuthLayoutProps {
  eyebrow: string
  title: string
  description: string
  children: ReactNode
}

export function AuthLayout({ eyebrow, title, description, children }: AuthLayoutProps) {
  return (
    <main className="auth-shell">
      <section className="auth-intro">
        <a className="brand brand-light" href="/" data-link>
          <span className="brand-mark">E</span>
          <span>PeopleFlow</span>
        </a>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <p className="security-note">Secure sessions · Role-based access · PostgreSQL</p>
      </section>
      <section className="auth-panel">{children}</section>
    </main>
  )
}
