'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { User, Mail, Lock, Phone, MapPin, Eye, EyeOff, ArrowRight, Dumbbell } from 'lucide-react'

const INDIAN_CITIES = [
  'Ahmedabad', 'Bengaluru', 'Bhopal', 'Chandigarh', 'Chennai',
  'Coimbatore', 'Delhi', 'Gurugram', 'Hyderabad', 'Indore',
  'Jaipur', 'Kochi', 'Kolkata', 'Lucknow', 'Mumbai',
  'Nagpur', 'Noida', 'Patna', 'Pune', 'Surat',
  'Thiruvananthapuram', 'Vadodara', 'Visakhapatnam',
]

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', city: '',
  })

  const update = (field: string, value: string) => {
    setForm(f => ({ ...f, [field]: value }))
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.email || !form.password) {
      setError('Name, email, and password are required.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.')
        return
      }

      // Auto sign-in
      await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      router.push('/dashboard')
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
        <h1 className="auth-form-title">Join AB Fitness</h1>
        <p className="auth-form-sub">Create your free account and start transforming today</p>
      </div>

      {error && <div className="auth-error" role="alert">{error}</div>}

      <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
        <div className="form-group">
          <label className="form-label" htmlFor="reg-name">Full Name</label>
          <div className="input-icon-wrapper">
            <User size={16} className="input-icon" />
            <input id="reg-name" type="text" className="form-input with-icon" placeholder="Aditya Sharma" value={form.name} onChange={e => update('name', e.target.value)} required />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-email">Email Address</label>
          <div className="input-icon-wrapper">
            <Mail size={16} className="input-icon" />
            <input id="reg-email" type="email" className="form-input with-icon" placeholder="you@email.com" value={form.email} onChange={e => update('email', e.target.value)} required autoComplete="email" />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-password">Password</label>
          <div className="input-icon-wrapper">
            <Lock size={16} className="input-icon" />
            <input id="reg-password" type={showPassword ? 'text' : 'password'} className="form-input with-icon with-icon-right" placeholder="Min. 6 characters" value={form.password} onChange={e => update('password', e.target.value)} required autoComplete="new-password" />
            <button type="button" className="input-icon-right" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="reg-row">
          <div className="form-group">
            <label className="form-label" htmlFor="reg-phone">Phone Number</label>
            <div className="input-icon-wrapper">
              <Phone size={16} className="input-icon" />
              <input id="reg-phone" type="tel" className="form-input with-icon" placeholder="+91 98765 43210" value={form.phone} onChange={e => update('phone', e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-city">City</label>
            <div className="input-icon-wrapper">
              <MapPin size={16} className="input-icon" />
              <select id="reg-city" className="form-input with-icon" value={form.city} onChange={e => update('city', e.target.value)}>
                <option value="">Select city</option>
                {INDIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-lg" disabled={loading} id="register-submit" style={{ width: '100%', marginTop: 8 }}>
          {loading ? <span className="spinner" /> : <>Create Account <ArrowRight size={16} /></>}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?{' '}
        <Link href="/login" id="go-to-login">Sign in here</Link>
      </p>

      <style>{`
        .auth-form-wrapper { width: 100%; max-width: 460px; }
        .auth-form-header { text-align: center; margin-bottom: 32px; }
        .auth-form-icon {
          width: 56px; height: 56px;
          background: var(--gradient-primary);
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          color: #fff; margin: 0 auto 20px;
          box-shadow: 0 6px 24px var(--primary-glow);
        }
        .auth-form-title { font-size: 2rem; font-weight: 800; margin-bottom: 8px; }
        .auth-form-sub { color: var(--text-secondary); font-size: 0.9rem; }
        .auth-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          color: #f87171;
          font-size: 0.875rem;
          margin-bottom: 16px;
        }
        .input-icon-wrapper { position: relative; }
        .input-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: var(--text-muted); pointer-events: none;
        }
        .form-input.with-icon { padding-left: 42px; }
        .form-input.with-icon-right { padding-right: 42px; }
        .input-icon-right {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          background: none; border: none; color: var(--text-muted); cursor: pointer;
          padding: 2px; display: flex; align-items: center; transition: var(--transition-fast);
        }
        .input-icon-right:hover { color: var(--text-primary); }
        .reg-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .auth-switch { text-align: center; font-size: 0.9rem; color: var(--text-muted); }
        .auth-switch a { color: var(--primary-light); font-weight: 600; }
        .auth-switch a:hover { color: var(--accent-light); }
        @media (max-width: 480px) { .reg-row { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
