'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Dumbbell } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password. Please try again.')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header">
        <div className="auth-form-icon">
          <Dumbbell size={22} />
        </div>
        <h1 className="auth-form-title">Welcome Back</h1>
        <p className="auth-form-sub">Sign in to continue your fitness journey</p>
      </div>

      {error && (
        <div className="auth-error" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">Email Address</label>
          <div className="input-icon-wrapper">
            <Mail size={16} className="input-icon" />
            <input
              id="login-email"
              type="email"
              className={`form-input with-icon${error ? ' error' : ''}`}
              placeholder="you@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="login-password">Password</label>
          <div className="input-icon-wrapper">
            <Lock size={16} className="input-icon" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input with-icon with-icon-right${error ? ' error' : ''}`}
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="input-icon-right"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
          id="login-submit"
          style={{ width: '100%', marginTop: 8 }}
        >
          {loading ? <span className="spinner" /> : <>Sign In <ArrowRight size={16} /></>}
        </button>
      </form>

      <p className="auth-switch">
        Don&apos;t have an account?{' '}
        <Link href="/register" id="go-to-register">Create one free</Link>
      </p>

      <style>{`
        .auth-form-wrapper {
          width: 100%;
          max-width: 420px;
        }
        .auth-form-header { text-align: center; margin-bottom: 36px; }
        .auth-form-icon {
          width: 56px; height: 56px;
          background: var(--gradient-primary);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          margin: 0 auto 20px;
          box-shadow: 0 6px 24px var(--primary-glow);
        }
        .auth-form-title { font-size: 2rem; font-weight: 800; margin-bottom: 8px; }
        .auth-form-sub { color: var(--text-secondary); font-size: 0.95rem; }
        .auth-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          color: #f87171;
          font-size: 0.875rem;
          margin-bottom: 20px;
        }
        .auth-form { display: flex; flex-direction: column; gap: 20px; margin-bottom: 24px; }
        .input-icon-wrapper { position: relative; }
        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
          pointer-events: none;
        }
        .form-input.with-icon { padding-left: 42px; }
        .form-input.with-icon-right { padding-right: 42px; }
        .input-icon-right {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 2px;
          display: flex;
          align-items: center;
          transition: var(--transition-fast);
        }
        .input-icon-right:hover { color: var(--text-primary); }
        .auth-switch { text-align: center; font-size: 0.9rem; color: var(--text-muted); }
        .auth-switch a { color: var(--primary-light); font-weight: 600; }
        .auth-switch a:hover { color: var(--accent-light); }
      `}</style>
    </div>
  )
}
