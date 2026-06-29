'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Plus, Scale, X, Check } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Entry {
  id: string
  weight: number | null
  bodyFat: number | null
  chest: number | null
  waist: number | null
  biceps: number | null
  date: string
  notes: string | null
}

export default function ProgressPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ weight: '', bodyFat: '', chest: '', waist: '', biceps: '', thighs: '', hips: '', notes: '', date: new Date().toISOString().split('T')[0] })

  const fetchEntries = async () => {
    const res = await fetch('/api/progress')
    if (res.ok) setEntries(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchEntries() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { await fetchEntries(); setShowForm(false) }
    setSubmitting(false)
  }

  const chartData = entries.map(e => ({
    date: new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    Weight: e.weight,
    'Body Fat %': e.bodyFat,
    Chest: e.chest,
    Waist: e.waist,
  }))

  return (
    <div style={{ padding: 40, maxWidth: 900 }}>
      <div className="flex-between" style={{ marginBottom: 36 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, marginBottom: 6 }}>Progress Tracker</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor your body metrics and visualize your transformation.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)} id="add-progress-btn">
          <Plus size={16} /> Add Entry
        </button>
      </div>

      {showForm && (
        <div className="card-gradient" style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 20 }}>New Progress Entry</h3>
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
            {[
              { label: 'Weight (kg)', key: 'weight' },
              { label: 'Body Fat (%)', key: 'bodyFat' },
              { label: 'Chest (cm)', key: 'chest' },
              { label: 'Waist (cm)', key: 'waist' },
              { label: 'Hips (cm)', key: 'hips' },
              { label: 'Biceps (cm)', key: 'biceps' },
              { label: 'Thighs (cm)', key: 'thighs' },
            ].map(field => (
              <div key={field.key} className="form-group">
                <label className="form-label">{field.label}</label>
                <input
                  className="form-input" type="number" step="0.1" placeholder="0.0"
                  value={(form as any)[field.key]}
                  onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Notes (optional)</label>
              <input className="form-input" placeholder="How are you feeling?" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 12 }}>
              <button type="submit" className="btn btn-primary" disabled={submitting} id="save-progress-btn">
                {submitting ? <span className="spinner" /> : <><Check size={16} /> Save Entry</>}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}><X size={16} /> Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto', width: 32, height: 32 }} /></div>
      ) : entries.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <BarChart3 size={40} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
          <h3 style={{ marginBottom: 8 }}>No Progress Entries</h3>
          <p style={{ marginBottom: 20 }}>Start tracking your body metrics to see your transformation over time.</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>Add First Entry</button>
        </div>
      ) : (
        <>
          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
            <div className="card">
              <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 16 }}>Weight (kg)</h4>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.1)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
                  <YAxis stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="Weight" stroke="#7c3aed" strokeWidth={2} dot={{ fill: '#7c3aed', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 16 }}>Body Fat %</h4>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.1)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
                  <YAxis stroke="var(--text-muted)" tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="Body Fat %" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Entry List */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)' }}>Entry History</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr>
                    {['Date', 'Weight', 'Body Fat', 'Chest', 'Waist', 'Biceps', 'Notes'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid var(--border-light)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...entries].reverse().map(e => (
                    <tr key={e.id}>
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-secondary)' }}>{new Date(e.date).toLocaleDateString('en-IN')}</td>
                      {[e.weight, e.bodyFat, e.chest, e.waist, e.biceps].map((v, i) => (
                        <td key={i} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', color: v ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: v ? 600 : 400 }}>
                          {v != null ? v : '—'}
                        </td>
                      ))}
                      <td style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{e.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
