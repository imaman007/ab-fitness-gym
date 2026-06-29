'use client'

import { useState } from 'react'
import { Search, ChevronDown, ChevronUp, Dumbbell, ImageOff } from 'lucide-react'
import Image from 'next/image'

interface Exercise {
  id: string
  name: string
  muscleGroup: string
  equipment: string
  difficulty: string
  instructions: string
  tips: string[]
}

const difficultyColor: Record<string, string> = {
  Beginner: 'badge-success',
  Intermediate: 'badge-warning',
  Advanced: 'badge-danger',
}

const muscleGroups = ['All', 'Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Full Body']
const equipmentTypes = ['All', 'Barbell', 'Dumbbell', 'Bodyweight', 'Cable Machine', 'Machine', 'Kettlebell']

// Map exercise names to stickman image slugs
const STICKMAN_MAP: Record<string, string> = {
  'Barbell Bench Press': 'bench_press',
  'Deadlift': 'deadlift',
  'Barbell Squat': 'squat',
  'Pull-Ups': 'pull_ups',
  'Push-Ups': 'push_ups',
  'Overhead Press': 'overhead_press',
  'Dumbbell Flyes': 'dumbbell_flyes',
  'Lateral Raises': 'lateral_raises',
  'Barbell Bicep Curl': 'bicep_curls',
  'Tricep Dips': 'tricep_dips',
  'Seated Cable Row': 'cable_row',
  'Romanian Deadlift': 'romanian_deadlift',
  'Leg Press': 'leg_press',
  'Walking Lunges': 'lunges',
  'Plank': 'plank',
  'Cable Crunches': 'cable_crunches',
  'Russian Twists': 'russian_twists',
  'Burpees': 'burpees',
  'Kettlebell Swings': 'kettlebell_swings',
  'Box Jumps': 'box_jumps',
  'Mountain Climbers': 'mountain_climbers',
}

function StickmanViewer({ exerciseName }: { exerciseName: string }) {
  const [imgError, setImgError] = useState(false)
  const slug = STICKMAN_MAP[exerciseName]
  const src = slug ? `/exercises/${slug}.png` : null

  if (!src || imgError) {
    return (
      <div className="stickman-placeholder">
        <ImageOff size={28} style={{ color: 'var(--text-muted)', marginBottom: 8 }} />
        <span>Illustration coming soon</span>
      </div>
    )
  }

  return (
    <div className="stickman-viewer">
      <div className="stickman-label">Position Guide</div>
      <div className="stickman-img-wrap">
        <Image
          src={src}
          alt={`${exerciseName} stickman position guide`}
          width={600}
          height={280}
          style={{ width: '100%', height: 'auto', borderRadius: 10, display: 'block' }}
          onError={() => setImgError(true)}
          priority={false}
        />
      </div>
    </div>
  )
}

export default function ExercisesClient({ exercises }: { exercises: Exercise[] }) {
  const [search, setSearch] = useState('')
  const [muscle, setMuscle] = useState('All')
  const [equipment, setEquipment] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = exercises.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase())
    const matchMuscle = muscle === 'All' || e.muscleGroup === muscle
    const matchEquip = equipment === 'All' || e.equipment === equipment
    return matchSearch && matchMuscle && matchEquip
  })

  return (
    <div>
      {/* Filters */}
      <div style={{ maxWidth: 600, margin: '0 auto 32px' }}>
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 42 }}
            placeholder="Search exercises..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="exercise-search"
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
            {muscleGroups.map(m => (
              <button
                key={m}
                className={`btn btn-sm ${muscle === m ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setMuscle(m)}
              >
                {m}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
            {equipmentTypes.map(eq => (
              <button
                key={eq}
                className={`btn btn-sm ${equipment === eq ? 'btn-accent' : 'btn-secondary'}`}
                onClick={() => setEquipment(eq)}
              >
                {eq}
              </button>
            ))}
          </div>
        </div>
      </div>

      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.9rem' }}>
        {filtered.length} exercise{filtered.length !== 1 ? 's' : ''}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(ex => {
          const isExpanded = expandedId === ex.id
          return (
            <div
              key={ex.id}
              className={`card exercise-card${isExpanded ? ' expanded' : ''}`}
              style={{ padding: '20px 24px', cursor: 'pointer' }}
              onClick={() => setExpandedId(isExpanded ? null : ex.id)}
              id={`exercise-${ex.id}`}
            >
              {/* Header Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 44, height: 44,
                  background: 'rgba(124,58,237,0.12)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, color: 'var(--primary-light)',
                }}>
                  <Dumbbell size={18} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', marginBottom: 6 }}>{ex.name}</h3>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span className="badge badge-primary" style={{ fontSize: '0.68rem' }}>{ex.muscleGroup}</span>
                    <span className="badge badge-accent" style={{ fontSize: '0.68rem' }}>{ex.equipment}</span>
                    <span className={`badge ${difficultyColor[ex.difficulty]}`} style={{ fontSize: '0.68rem' }}>{ex.difficulty}</span>
                    {STICKMAN_MAP[ex.name] && (
                      <span className="badge" style={{ fontSize: '0.68rem', background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.2)' }}>
                        📐 Position Guide
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div
                  style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--border-light)' }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Stickman Position Guide */}
                  <StickmanViewer exerciseName={ex.name} />

                  {/* Instructions + Tips */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 24 }}>
                    <div>
                      <h5 className="exercise-section-title" style={{ color: 'var(--primary-light)' }}>
                        Step-by-Step Instructions
                      </h5>
                      <ol style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {ex.instructions.split('\n').map((step, i) => (
                          <li key={i} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                            {step.replace(/^\d+\.\s*/, '')}
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <h5 className="exercise-section-title" style={{ color: 'var(--accent-light)' }}>
                        Pro Tips
                      </h5>
                      <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {ex.tips.map((tip, i) => (
                          <li key={i} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 24px' }}>
          <Dumbbell size={40} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
          <h3 style={{ marginBottom: 8 }}>No exercises found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>Try different filters or search terms.</p>
          <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setMuscle('All'); setEquipment('All') }}>Reset Filters</button>
        </div>
      )}

      <style>{`
        .exercise-card { transition: var(--transition-base); }
        .exercise-card:hover { border-color: rgba(124,58,237,0.3); }
        .exercise-card.expanded { border-color: rgba(124,58,237,0.4); box-shadow: 0 8px 32px rgba(124,58,237,0.12); }

        .stickman-viewer {
          background: rgba(5, 5, 20, 0.6);
          border: 1px solid rgba(124,58,237,0.2);
          border-radius: 12px;
          overflow: hidden;
        }
        .stickman-label {
          padding: 10px 16px;
          font-size: 0.75rem;
          font-weight: 700;
          font-family: var(--font-heading);
          color: var(--primary-light);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border-bottom: 1px solid rgba(124,58,237,0.15);
          background: rgba(124,58,237,0.06);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .stickman-label::before {
          content: '📐';
          font-size: 0.85rem;
        }
        .stickman-img-wrap {
          padding: 12px;
          background: #060612;
        }
        .stickman-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 36px;
          background: rgba(5,5,20,0.4);
          border: 1px dashed var(--border);
          border-radius: 12px;
          color: var(--text-muted);
          font-size: 0.8rem;
        }
        .exercise-section-title {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 12px;
          font-family: var(--font-heading);
        }
        @media (max-width: 640px) {
          .exercise-card > div > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
