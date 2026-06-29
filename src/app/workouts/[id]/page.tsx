import { prisma } from '@/lib/db'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Clock, Flame, Dumbbell, ArrowLeft, Timer, RotateCcw, ChevronRight } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const workout = await prisma.workoutPlan.findUnique({ where: { id } })
  return { title: workout ? `${workout.name} — AB Fitness` : 'Workout Not Found' }
}

const difficultyColor: Record<string, string> = {
  Beginner: 'badge-success',
  Intermediate: 'badge-warning',
  Advanced: 'badge-danger',
}

export default async function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const workout = await prisma.workoutPlan.findUnique({
    where: { id },
    include: {
      exercises: {
        orderBy: { order: 'asc' },
        include: { exercise: true },
      },
    },
  })

  if (!workout) notFound()

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        <div className="container" style={{ padding: '48px 24px' }}>
          <Link href="/workouts" className="btn btn-ghost btn-sm" style={{ marginBottom: 32, display: 'inline-flex' }}>
            <ArrowLeft size={14} /> Back to Workouts
          </Link>

          {/* Header */}
          <div style={{ marginBottom: 48, maxWidth: 700 }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
              <span className={`badge ${difficultyColor[workout.difficulty] || 'badge-primary'}`}>{workout.difficulty}</span>
              <span className="badge badge-accent">{workout.category}</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, marginBottom: 16, lineHeight: 1.1 }}>
              {workout.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: 28 }}>{workout.description}</p>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[
                { icon: Clock, label: `${workout.duration} minutes`, color: 'var(--primary-light)' },
                { icon: Flame, label: `~${workout.calories} calories`, color: '#f97316' },
                { icon: Dumbbell, label: `${workout.exercises.length} exercises`, color: 'var(--accent-light)' },
              ].map(stat => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(124,58,237,0.06)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <Icon size={15} style={{ color: stat.color }} />
                    {stat.label}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Exercise List */}
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', marginBottom: 24 }}>Exercise Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {workout.exercises.map((we, i) => {
              const tips = JSON.parse(we.exercise.tips) as string[]
              return (
                <div key={we.id} className="card-gradient" style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 20, left: 20, width: 32, height: 32, background: 'var(--gradient-primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {i + 1}
                  </div>

                  <div style={{ marginLeft: 48 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                      <div>
                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: 4 }}>{we.exercise.name}</h3>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{we.exercise.muscleGroup}</span>
                          <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>{we.exercise.equipment}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 12 }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--primary-light)' }}>{we.sets}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sets</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--accent-light)' }}>{we.reps}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reps</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fbbf24' }}>{we.restSeconds}s</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rest</div>
                        </div>
                      </div>
                    </div>

                    <details style={{ marginTop: 12 }}>
                      <summary style={{ cursor: 'pointer', fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, listStyle: 'none', userSelect: 'none' }}>
                        <ChevronRight size={14} /> Instructions & Tips
                      </summary>
                      <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                          <h5 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Step-by-Step</h5>
                          <ol style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {we.exercise.instructions.split('\n').map((step, si) => (
                              <li key={si} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.replace(/^\d+\.\s*/, '')}</li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <h5 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>Pro Tips</h5>
                          <ul style={{ paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {tips.map((tip, ti) => (
                              <li key={ti} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{tip}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
