import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CreditCard, Target, Activity, BarChart3, ArrowRight, Dumbbell, Calendar } from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const userId = (session.user as any).id

  const [membership, goals, recentLogs, progressCount] = await Promise.all([
    prisma.membership.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: { plan: true },
    }),
    prisma.fitnessGoal.count({ where: { userId, status: 'ACTIVE' } }),
    prisma.workoutLog.findMany({
      where: { userId },
      include: { exercise: true },
      orderBy: { date: 'desc' },
      take: 5,
    }),
    prisma.progressEntry.count({ where: { userId } }),
  ])

  const workoutCount = await prisma.workoutLog.count({ where: { userId } })

  const quickActions = [
    { href: '/dashboard/membership', icon: CreditCard, label: 'My Gym Card', desc: membership ? `${membership.plan.name} Plan` : 'No active plan', color: 'primary' },
    { href: '/dashboard/goals', icon: Target, label: 'Fitness Goals', desc: `${goals} active goal${goals !== 1 ? 's' : ''}`, color: 'accent' },
    { href: '/dashboard/log', icon: Activity, label: 'Log Workout', desc: `${workoutCount} sessions logged`, color: 'primary' },
    { href: '/dashboard/progress', icon: BarChart3, label: 'Progress', desc: `${progressCount} entries recorded`, color: 'accent' },
  ]

  return (
    <div className="dash-page">
      {/* Header */}
      <div className="dash-page-header">
        <div>
          <h1 className="dash-greeting">
            Welcome back, <span className="gradient-text">{session.user.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="dash-greeting-sub">Here&apos;s your fitness overview for today.</p>
        </div>
        {membership && (
          <div className="dash-member-badge">
            <div className={`badge badge-${membership.plan.tier.toLowerCase()}`}>
              <Dumbbell size={11} /> {membership.plan.tier}
            </div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Member</span>
          </div>
        )}
      </div>

      {/* Quick Action Cards */}
      <div className="dash-grid">
        {quickActions.map(action => {
          const Icon = action.icon
          return (
            <Link key={action.href} href={action.href} className="dash-action-card" id={`dash-action-${action.label.toLowerCase().replace(/\s/g, '-')}`}>
              <div className={`dash-action-icon dash-action-icon--${action.color}`}>
                <Icon size={22} />
              </div>
              <div className="dash-action-content">
                <div className="dash-action-label">{action.label}</div>
                <div className="dash-action-desc">{action.desc}</div>
              </div>
              <ArrowRight size={16} className="dash-action-arrow" />
            </Link>
          )
        })}
      </div>

      {/* Membership Status */}
      {membership ? (
        <div className="card-gradient dash-membership-card">
          <div className="flex-between" style={{ marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)' }}>Active Membership</h3>
            <span className="badge badge-success">● Active</span>
          </div>
          <div className="dash-membership-info">
            <div>
              <div className="text-muted text-sm">Plan</div>
              <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{membership.plan.name}</div>
            </div>
            <div>
              <div className="text-muted text-sm">Card Number</div>
              <div style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary-light)' }}>{membership.cardNumber}</div>
            </div>
            <div>
              <div className="text-muted text-sm">Valid Until</div>
              <div style={{ fontWeight: 700 }}>{new Date(membership.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>
          <Link href="/dashboard/membership" className="btn btn-primary btn-sm" style={{ marginTop: 20 }}>
            View Gym Card <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="card dash-no-membership">
          <Dumbbell size={32} style={{ color: 'var(--primary-light)', marginBottom: 12 }} />
          <h3 style={{ marginBottom: 8 }}>No Active Membership</h3>
          <p style={{ marginBottom: 20, fontSize: '0.9rem' }}>Subscribe to a plan to unlock all gym locations and features.</p>
          <Link href="/#pricing" className="btn btn-primary">Browse Plans</Link>
        </div>
      )}

      {/* Recent Workouts */}
      <div style={{ marginTop: 32 }}>
        <div className="flex-between" style={{ marginBottom: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-heading)' }}>Recent Workouts</h3>
          <Link href="/dashboard/log" className="btn btn-ghost btn-sm">View All</Link>
        </div>
        {recentLogs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <Activity size={32} style={{ color: 'var(--text-muted)', marginBottom: 12 }} />
            <p>No workouts logged yet. <Link href="/dashboard/log">Log your first workout</Link></p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentLogs.map(log => (
              <div key={log.id} className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className="dash-log-icon"><Dumbbell size={15} /></div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{log.exercise.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{log.sets} sets × {log.reps} reps{log.weight ? ` · ${log.weight}kg` : ''}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <Calendar size={12} />
                  {new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .dash-page { padding: 40px; max-width: 960px; }
        .dash-page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 36px; }
        .dash-greeting { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; margin-bottom: 6px; }
        .dash-greeting-sub { color: var(--text-secondary); font-size: 0.95rem; }
        .dash-member-badge { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
        .dash-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 28px; }
        .dash-action-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--gradient-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          text-decoration: none;
          transition: var(--transition-base);
        }
        .dash-action-card:hover { border-color: rgba(124, 58, 237, 0.4); transform: translateY(-2px); box-shadow: var(--shadow-card); }
        .dash-action-icon {
          width: 48px; height: 48px;
          border-radius: var(--radius-md);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .dash-action-icon--primary { background: rgba(124, 58, 237, 0.15); color: var(--primary-light); border: 1px solid rgba(124, 58, 237, 0.2); }
        .dash-action-icon--accent { background: rgba(6, 182, 212, 0.12); color: var(--accent-light); border: 1px solid rgba(6, 182, 212, 0.2); }
        .dash-action-content { flex: 1; }
        .dash-action-label { font-weight: 700; font-size: 0.95rem; font-family: var(--font-heading); color: var(--text-primary); margin-bottom: 2px; }
        .dash-action-desc { font-size: 0.8rem; color: var(--text-muted); }
        .dash-action-arrow { color: var(--text-muted); transition: var(--transition-fast); }
        .dash-action-card:hover .dash-action-arrow { color: var(--primary-light); transform: translateX(4px); }
        .dash-membership-card { margin-bottom: 0; }
        .dash-membership-info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .dash-no-membership { text-align: center; padding: 40px 24px; }
        .dash-log-icon {
          width: 36px; height: 36px;
          background: rgba(124, 58, 237, 0.12);
          border-radius: var(--radius-sm);
          display: flex; align-items: center; justify-content: center;
          color: var(--primary-light);
        }
        @media (max-width: 640px) {
          .dash-page { padding: 24px 16px; }
          .dash-grid { grid-template-columns: 1fr; }
          .dash-membership-info { grid-template-columns: 1fr 1fr; }
          .dash-page-header { flex-direction: column; gap: 12px; }
        }
      `}</style>
    </div>
  )
}
