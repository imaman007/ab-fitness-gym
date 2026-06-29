'use client'

import { useState, useEffect } from 'react'
import { Plus, Activity, Calendar, Weight, X, Check } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Exercise { id: string; name: string; muscleGroup: string }
interface Log { id: string; sets: number; reps: number; weight: number | null; date: string; exercise: Exercise; notes: string | null }

export default function WorkoutLogPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ exerciseId: '', sets: '3', reps: '10', weight: '', duration: '', notes: '', date: new Date().toISOString().split('T')[0] })

  useEffect(() => {
    Promise.all([
      fetch('/api/workout-log').then(r => r.json()),
      fetch('/api/exercises-list').then(r => r.json()),
    ]).then(([logsData, exercisesData]) => {
      setLogs(logsData)
      setExercises(exercisesData)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/workout-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const newLog = await res.json()
      setLogs(l => [newLog, ...l])
      setShowForm(false)
      setForm({ exerciseId: '', sets: '3', reps: '10', weight: '', duration: '', notes: '', date: new Date().toISOString().split('T')[0] })
    }
    setSubmitting(false)
  }

  // Build chart data
  const chartData = logs
    .filter(l => l.weight)
    .slice(-20)
    .reverse()
    .map(l => ({
      date: new Date(l.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
      weight: l.weight,
      exercise: l.exercise.name,
    }))

  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <div className="flex-between" style={{ marginBottom: 36 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: 6 }}>Workout Logger</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track every set, rep, and weight to see your progress.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} id="log-workout-btn">
          <Plus size={16} /> Log Workout
        </button>
      </div>

      {showForm && (
        <div className="card-gradient" style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 20 }}>Log New Workout</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Exercise</label>
              <select className="form-input" value={form.exerciseId} onChange={e => setForm(f => ({ ...f, exerciseId: e.target.value }))} required>
                <option value="">Select exercise...</option>
                {exercises.map(ex => <option key={ex.id} value={ex.id}>{ex.name} ({ex.muscleGroup})</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sets</label>
              <input className="form-input" type="number" min="1" value={form.sets} onChange={e => setForm(f => ({ ...f, sets: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Reps</label>
              <input className="form-input" type="number" min="1" value={form.reps} onChange={e => setForm(f => ({ ...f, reps: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Weight (kg, optional)</label>
              <input className="form-input" type="number" step="0.5" placeholder="e.g. 80" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (mins, optional)</label>
              <input className="form-input" type="number" placeholder="e.g. 45" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Notes (optional)</label>
              <input className="form-input" placeholder="How did it feel?" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={submitting} id="save-log-btn">
                {submitting ? <span className="spinner" /> : <><Check size={16} /> Save Log</>}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}><X size={16} /> Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Weight Chart */}
      {chartData.length > 1 && (
        <div className="card" style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 20 }}>Weight Lifted Over Time (kg)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" />
              <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
              <YAxis stroke="var(--text-muted)" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: 'var(--text-primary)' }}
              />
              <Line type="monotone" dataKey="weight" stroke="#7c3aed" strokeWidth={2} dot={{ fill: '#7c3aed', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Log List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto', width: 32, height: 32 }} /></div>
      ) : logs.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <Activity size={40} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
          <h3 style={{ marginBottom: 8 }}>No Workouts Logged</h3>
          <p style={{ marginBottom: 20 }}>Log your first workout to start tracking your fitness journey!</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>Log First Workout</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {logs.map(log => (
            <div key={log.id} className="card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--primary-light)' }}>
                <Weight size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-heading)', marginBottom: 2 }}>{log.exercise.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {log.sets} sets × {log.reps} reps{log.weight ? ` · ${log.weight}kg` : ''}
                  {log.notes ? ` · "${log.notes}"` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)', fontSize: '0.8rem', flexShrink: 0 }}>
                <Calendar size={12} />
                {new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </div>
              <span className="badge badge-primary" style={{ flexShrink: 0, fontSize: '0.7rem' }}>{log.exercise.muscleGroup}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
