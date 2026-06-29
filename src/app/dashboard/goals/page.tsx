'use client'

import { useState, useEffect } from 'react'
import { Plus, Target, Trash2, CheckCircle, Edit3, X, Check } from 'lucide-react'

interface Goal {
  id: string
  type: string
  title: string
  target: number
  current: number
  unit: string
  deadline: string | null
  status: string
  createdAt: string
}

function ProgressRing({ current, target, size = 80 }: { current: number; target: number; size?: number }) {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(current / target, 1)
  const strokeDashoffset = circumference - progress * circumference

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(124,58,237,0.15)" strokeWidth={8} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke="url(#progressGrad)" strokeWidth={8} fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
      <defs>
        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ type: 'Weight', title: '', target: '', current: '', unit: 'kg', deadline: '' })

  const fetchGoals = async () => {
    const res = await fetch('/api/goals')
    if (res.ok) setGoals(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchGoals() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { await fetchGoals(); setShowForm(false); setForm({ type: 'Weight', title: '', target: '', current: '', unit: 'kg', deadline: '' }) }
    setSubmitting(false)
  }

  const updateProgress = async (goal: Goal, newCurrent: number) => {
    const status = newCurrent >= goal.target ? 'COMPLETED' : 'ACTIVE'
    await fetch(`/api/goals/${goal.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current: newCurrent, status }),
    })
    fetchGoals()
  }

  const deleteGoal = async (id: string) => {
    await fetch(`/api/goals/${id}`, { method: 'DELETE' })
    setGoals(g => g.filter(x => x.id !== id))
  }

  const markComplete = async (goal: Goal) => {
    await fetch(`/api/goals/${goal.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'COMPLETED', current: goal.target }),
    })
    fetchGoals()
  }

  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <div className="flex-between" style={{ marginBottom: 36 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: 6 }}>Fitness Goals</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track your progress toward your fitness milestones.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} id="add-goal-btn">
          <Plus size={16} /> Add Goal
        </button>
      </div>

      {showForm && (
        <div className="card-gradient" style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 20 }}>New Fitness Goal</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Goal Type</label>
              <select className="form-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {['Weight', 'Strength', 'Cardio', 'Body Fat', 'Flexibility', 'Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Unit</label>
              <select className="form-input" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                {['kg', 'lbs', 'reps', 'mins', '%', 'km'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Goal Title</label>
              <input className="form-input" placeholder="e.g. Lose 5kg in 3 months" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Target Value ({form.unit})</label>
              <input className="form-input" type="number" step="0.1" placeholder="e.g. 70" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Current Value ({form.unit})</label>
              <input className="form-input" type="number" step="0.1" placeholder="e.g. 80" value={form.current} onChange={e => setForm(f => ({ ...f, current: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Deadline (Optional)</label>
              <input className="form-input" type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={submitting} id="save-goal-btn">
                {submitting ? <span className="spinner" /> : <><Check size={16} /> Save Goal</>}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                <X size={16} /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto', width: 32, height: 32 }} /></div>
      ) : goals.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <Target size={40} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
          <h3 style={{ marginBottom: 8 }}>No Goals Set</h3>
          <p style={{ marginBottom: 20 }}>Set your first fitness goal to start tracking your progress!</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>Set First Goal</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {goals.map(goal => {
            const pct = Math.round(Math.min((goal.current / goal.target) * 100, 100))
            const isCompleted = goal.status === 'COMPLETED'
            return (
              <div key={goal.id} className={`card${isCompleted ? ' goal-completed' : ''}`}>
                <div className="flex-between" style={{ marginBottom: 16 }}>
                  <span className={`badge ${isCompleted ? 'badge-success' : 'badge-primary'}`}>
                    {isCompleted ? '✓ Completed' : goal.type}
                  </span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {!isCompleted && (
                      <button className="btn btn-ghost btn-sm" onClick={() => markComplete(goal)} title="Mark complete">
                        <CheckCircle size={14} />
                      </button>
                    )}
                    <button className="btn btn-danger btn-sm" onClick={() => deleteGoal(goal.id)} title="Delete goal">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <ProgressRing current={goal.current} target={goal.target} />
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                      {pct}%
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: 6, color: 'var(--text-primary)' }}>{goal.title}</h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {goal.current} / {goal.target} {goal.unit}
                    </div>
                    {goal.deadline && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        Deadline: {new Date(goal.deadline).toLocaleDateString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>

                {!isCompleted && (
                  <div style={{ marginTop: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="range"
                      min={0}
                      max={goal.target}
                      step={0.5}
                      value={goal.current}
                      onChange={e => updateProgress(goal, parseFloat(e.target.value))}
                      style={{ flex: 1, accentColor: 'var(--primary)' }}
                    />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: 50, textAlign: 'right' }}>
                      {goal.current}{goal.unit}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <style>{`
        .goal-completed { opacity: 0.7; background: rgba(16, 185, 129, 0.05); border-color: rgba(16, 185, 129, 0.2); }
        @media (max-width: 640px) { div[style*="padding: 40px"] { padding: 24px 16px !important; } }
      `}</style>
    </div>
  )
}
