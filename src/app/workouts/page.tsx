import { prisma } from '@/lib/db'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Clock, Flame, Dumbbell, ChevronRight, Star } from 'lucide-react'

export const metadata = { title: 'Workout Plans — AB Fitness' }

const difficultyColor: Record<string, string> = {
  Beginner: 'badge-success',
  Intermediate: 'badge-warning',
  Advanced: 'badge-danger',
}

export default async function WorkoutsPage() {
  const workouts = await prisma.workoutPlan.findMany({
    orderBy: [{ featured: 'desc' }, { name: 'asc' }],
    include: { _count: { select: { exercises: true } } },
  })

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        <div className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-badge"><Dumbbell size={12} /> Training Programs</div>
              <h1>Workout <span className="gradient-text">Plans</span></h1>
              <div className="divider" />
              <p style={{ maxWidth: 480, margin: '20px auto 0' }}>
                Expert-curated workout programs for every fitness level. From beginner to elite athlete.
              </p>
            </div>

            <div className="grid-auto">
              {workouts.map(workout => (
                <Link key={workout.id} href={`/workouts/${workout.id}`} className="workout-card" id={`workout-${workout.slug}`}>
                  <div className="workout-card-inner">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <span className={`badge ${difficultyColor[workout.difficulty] || 'badge-primary'}`}>
                          {workout.difficulty}
                        </span>
                        <span className="badge badge-accent" style={{ fontSize: '0.68rem' }}>{workout.category}</span>
                      </div>
                      {workout.featured && (
                        <Star size={16} fill="#fbbf24" color="#fbbf24" />
                      )}
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: 8, color: 'var(--text-primary)' }}>
                      {workout.name}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {workout.description}
                    </p>

                    <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Clock size={12} style={{ color: 'var(--primary-light)' }} /> {workout.duration} mins
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Flame size={12} style={{ color: '#f97316' }} /> {workout.calories} cal
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <Dumbbell size={12} style={{ color: 'var(--accent-light)' }} /> {workout._count.exercises} exercises
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary-light)', fontSize: '0.875rem', fontWeight: 600 }}>
                      View Program <ChevronRight size={14} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <style>{`
        .workout-card {
          text-decoration: none;
          display: block;
        }
        .workout-card-inner {
          background: var(--gradient-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 28px 24px;
          height: 100%;
          transition: var(--transition-base);
          position: relative;
          overflow: hidden;
        }
        .workout-card-inner::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--gradient-primary);
          opacity: 0;
          transition: var(--transition-base);
        }
        .workout-card:hover .workout-card-inner {
          border-color: rgba(124, 58, 237, 0.4);
          transform: translateY(-4px);
          box-shadow: var(--shadow-card);
        }
        .workout-card:hover .workout-card-inner::before { opacity: 1; }
      `}</style>
    </>
  )
}
