import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Dumbbell, CreditCard, ArrowRight } from 'lucide-react'
import './membership.css'

// Generate a deterministic QR-like pattern from card number
function QRPattern({ seed }: { seed: string }) {
  const cells = Array.from({ length: 25 }, (_, i) => {
    const char = seed.charCodeAt(i % seed.length) + i
    return char % 3 !== 0
  })
  return (
    <div className="gym-card-qr" aria-label="QR Code">
      {cells.map((filled, i) => (
        <div key={i} className="qr-cell" style={{ background: filled ? '#1a0a35' : 'transparent' }} />
      ))}
    </div>
  )
}

export default async function MembershipPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const userId = (session.user as any).id

  const [membership, payments] = await Promise.all([
    prisma.membership.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: { plan: true },
    }),
    prisma.payment.findMany({
      where: { userId, status: 'SUCCESS' },
      orderBy: { createdAt: 'desc' },
      take: 10,
    }),
  ])

  const tierClass = membership ? membership.plan.tier.toLowerCase() : 'silver'

  return (
    <div className="membership-page">
      <div className="membership-header">
        <h1>Your Membership</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Your digital gym card and membership details
        </p>
      </div>

      {membership ? (
        <>
          {/* Virtual Gym Card */}
          <div className={`gym-card gym-card--${tierClass}`}>
            <div className="gym-card-bg">
              <div className="gym-card-circle1" />
              <div className="gym-card-circle2" />
            </div>

            <div className="gym-card-content">
              <div className="gym-card-top">
                <div className="gym-card-logo">
                  <div className="gym-card-logo-icon"><Dumbbell size={18} /></div>
                  <span className="gym-card-logo-text">AB Fitness</span>
                </div>
                <span className="gym-card-tier-badge">{membership.plan.tier}</span>
              </div>

              <div>
                <div className="gym-card-chip">
                  <div /><div /><div /><div />
                </div>
                <div className="gym-card-number">{membership.cardNumber}</div>
              </div>

              <div className="gym-card-bottom">
                <div>
                  <div className="gym-card-name">{session.user.name}</div>
                  <div className="gym-card-validity-label">Valid Until</div>
                  <div className="gym-card-validity">
                    {new Date(membership.endDate).toLocaleDateString('en-IN', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <QRPattern seed={membership.cardNumber} />
              </div>
            </div>
          </div>

          {/* Plan Details */}
          <div className="card-gradient" style={{ marginBottom: 32 }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: 20 }}>Plan Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Plan Name</div>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{membership.plan.name}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Status</div>
                <span className="badge badge-success">● Active</span>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Monthly Price</div>
                <div style={{ fontWeight: 700, color: 'var(--primary-light)' }}>₹{membership.plan.price.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Start Date</div>
                <div style={{ fontWeight: 600 }}>{new Date(membership.startDate).toLocaleDateString('en-IN')}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>End Date</div>
                <div style={{ fontWeight: 600 }}>{new Date(membership.endDate).toLocaleDateString('en-IN')}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 4 }}>Tier</div>
                <span className={`badge badge-${tierClass}`}>{membership.plan.tier}</span>
              </div>
            </div>
          </div>

          {/* Payment History */}
          {payments.length > 0 && (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-light)' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)' }}>Payment History</h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="payment-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => (
                      <tr key={payment.id}>
                        <td>{new Date(payment.createdAt).toLocaleDateString('en-IN')}</td>
                        <td>{payment.description || 'Membership Payment'}</td>
                        <td style={{ fontWeight: 600, color: 'var(--primary-light)' }}>
                          ₹{payment.amount.toLocaleString('en-IN')}
                        </td>
                        <td><span className="badge badge-success">Success</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        /* No Membership State */
        <div className="card" style={{ textAlign: 'center', padding: '60px 40px', maxWidth: 500 }}>
          <div style={{ width: 72, height: 72, background: 'rgba(124, 58, 237, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', color: 'var(--primary-light)' }}>
            <CreditCard size={32} />
          </div>
          <h2 style={{ marginBottom: 12 }}>No Active Membership</h2>
          <p style={{ marginBottom: 28, fontSize: '0.95rem' }}>
            You don&apos;t have an active membership yet. Choose a plan that fits your goals and get your digital gym card instantly.
          </p>
          <Link href="/#pricing" className="btn btn-primary btn-lg">
            Browse Membership Plans <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  )
}
