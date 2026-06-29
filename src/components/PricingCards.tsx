'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Check, Star, Zap, Crown, Shield, X } from 'lucide-react'

interface Plan {
  id: string
  name: string
  slug: string
  price: number
  duration: number
  tier: string
  description: string
  features: string
  popular: boolean
}

interface OrderData {
  isMock: boolean
  orderId: string
  amount: number
  planName: string
  planId: string
  currency: string
  keyId?: string
}

interface SandboxModalProps {
  orderData: OrderData
  onSuccess: () => void
  onCancel: () => void
  loading: boolean
}

function SandboxModal({ orderData, onSuccess, onCancel, loading }: SandboxModalProps) {
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-label="Sandbox Payment Simulator">
      <div className="modal-box sandbox-modal">
        <div className="sandbox-header">
          <div className="sandbox-icon">
            <Shield size={24} />
          </div>
          <div className="sandbox-badge">SANDBOX MODE</div>
        </div>

        <h2 className="sandbox-title">Checkout Simulator</h2>
        <p className="sandbox-subtitle">No real payment will be processed in sandbox mode.</p>

        <div className="sandbox-plan-info">
          <div className="sandbox-row">
            <span className="sandbox-label">Plan</span>
            <span className="sandbox-value">{orderData.planName}</span>
          </div>
          <div className="sandbox-row">
            <span className="sandbox-label">Amount</span>
            <span className="sandbox-value sandbox-price">
              ₹{orderData.amount.toLocaleString('en-IN')}/mo
            </span>
          </div>
          <div className="sandbox-row">
            <span className="sandbox-label">Order ID</span>
            <span className="sandbox-value sandbox-order-id">{orderData.orderId}</span>
          </div>
        </div>

        <div className="sandbox-notice">
          <Zap size={13} />
          Click &quot;Simulate Success&quot; to activate membership without real payment
        </div>

        <div className="sandbox-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={onSuccess}
            disabled={loading}
            id="sandbox-simulate-success"
            style={{ flex: 1 }}
          >
            {loading ? <span className="spinner" /> : <><Check size={16} /> Simulate Success</>}
          </button>
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
            id="sandbox-cancel"
            style={{ flex: 1 }}
          >
            <X size={16} /> Cancel
          </button>
        </div>

        <style>{`
          .sandbox-modal { text-align: center; }
          .sandbox-header { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 20px; }
          .sandbox-icon {
            width: 56px; height: 56px;
            background: rgba(6, 182, 212, 0.15);
            border: 2px solid rgba(6, 182, 212, 0.3);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: var(--accent-light);
          }
          .sandbox-badge {
            padding: 4px 12px;
            background: rgba(6, 182, 212, 0.15);
            border: 1px solid rgba(6, 182, 212, 0.3);
            border-radius: var(--radius-full);
            font-size: 0.7rem;
            font-weight: 700;
            color: var(--accent-light);
            letter-spacing: 0.1em;
            font-family: var(--font-heading);
          }
          .sandbox-title { font-size: 1.6rem; margin-bottom: 8px; }
          .sandbox-subtitle { color: var(--text-secondary); margin-bottom: 28px; font-size: 0.9rem; }
          .sandbox-plan-info {
            background: rgba(15, 15, 42, 0.6);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: 20px;
            margin-bottom: 20px;
            text-align: left;
          }
          .sandbox-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border-light); }
          .sandbox-row:last-child { border-bottom: none; }
          .sandbox-label { font-size: 0.85rem; color: var(--text-muted); }
          .sandbox-value { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }
          .sandbox-price { color: var(--primary-light); font-size: 1.1rem; }
          .sandbox-order-id { font-size: 0.75rem; color: var(--text-secondary); font-family: monospace; }
          .sandbox-notice {
            display: flex; align-items: center; justify-content: center; gap: 6px;
            padding: 10px 16px;
            background: rgba(6, 182, 212, 0.08);
            border: 1px solid rgba(6, 182, 212, 0.2);
            border-radius: var(--radius-md);
            font-size: 0.8rem;
            color: var(--accent-light);
            margin-bottom: 24px;
          }
          .sandbox-actions { display: flex; gap: 12px; }
        `}</style>
      </div>
    </div>
  )
}

const tierIcons = { SILVER: Shield, GOLD: Star, PLATINUM: Crown }
const tierColors = {
  SILVER: 'badge-silver',
  GOLD: 'badge-gold',
  PLATINUM: 'badge-platinum',
}

export default function PricingCards({ plans }: { plans: Plan[] }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [sandboxModal, setSandboxModal] = useState<OrderData | null>(null)
  const [verifying, setVerifying] = useState(false)

  const handleSubscribe = async (plan: Plan) => {
    if (!session?.user) {
      router.push('/login')
      return
    }

    setLoadingPlan(plan.id)
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id }),
      })
      const data: OrderData = await res.json()
      if (!res.ok) throw new Error('Order creation failed')

      if (data.isMock) {
        setSandboxModal(data)
      } else {
        // Load real Razorpay SDK
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true
        document.body.appendChild(script)
        script.onload = () => {
          const options = {
            key: data.keyId,
            amount: data.amount * 100,
            currency: data.currency,
            name: 'AB Fitness',
            description: `${data.planName} Membership`,
            order_id: data.orderId,
            handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
              const verifyRes = await fetch('/api/payments/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  orderId: response.razorpay_order_id,
                  paymentId: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                  planId: data.planId,
                }),
              })
              if (verifyRes.ok) {
                router.push('/dashboard/membership')
              }
            },
            theme: { color: '#7C3AED' },
          }
          const rzp = new (window as any).Razorpay(options)
          rzp.open()
        }
      }
    } catch {
      alert('Failed to initiate payment. Please try again.')
    } finally {
      setLoadingPlan(null)
    }
  }

  const handleSandboxSuccess = async () => {
    if (!sandboxModal) return
    setVerifying(true)
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: sandboxModal.orderId,
          paymentId: `pay_mock_${Date.now()}`,
          signature: 'mock_signature',
          planId: sandboxModal.planId,
        }),
      })
      if (res.ok) {
        setSandboxModal(null)
        router.push('/dashboard/membership')
      } else {
        alert('Sandbox simulation failed.')
      }
    } catch {
      alert('Something went wrong.')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <>
      {sandboxModal && (
        <SandboxModal
          orderData={sandboxModal}
          onSuccess={handleSandboxSuccess}
          onCancel={() => setSandboxModal(null)}
          loading={verifying}
        />
      )}

      <section className="section pricing-section" id="pricing">
        <div className="container">
          <div className="section-header">
            <div className="section-badge">💎 Membership Plans</div>
            <h2>
              Choose Your{' '}
              <span className="gradient-text">Fitness Journey</span>
            </h2>
            <div className="divider" />
            <p style={{ maxWidth: 480, margin: '20px auto 0' }}>
              Flexible plans designed for every fitness level and budget. Upgrade anytime.
            </p>
          </div>

          <div className="pricing-grid">
            {plans.map((plan) => {
              const features = JSON.parse(plan.features) as string[]
              const TierIcon = tierIcons[plan.tier as keyof typeof tierIcons] || Shield
              const isLoading = loadingPlan === plan.id

              return (
                <div
                  key={plan.id}
                  className={`pricing-card${plan.popular ? ' pricing-card--popular' : ''}`}
                  id={`plan-${plan.slug}`}
                >
                  {plan.popular && (
                    <div className="popular-badge">
                      <Star size={11} fill="currentColor" /> Most Popular
                    </div>
                  )}

                  <div className="pricing-tier-header">
                    <div className={`pricing-tier-icon tier-${plan.tier.toLowerCase()}`}>
                      <TierIcon size={20} />
                    </div>
                    <div>
                      <div className={`badge ${tierColors[plan.tier as keyof typeof tierColors]}`}>{plan.tier}</div>
                    </div>
                  </div>

                  <h3 className="pricing-plan-name">{plan.name}</h3>
                  <p className="pricing-description">{plan.description}</p>

                  <div className="pricing-price">
                    <span className="price-currency">₹</span>
                    <span className="price-amount">{plan.price.toLocaleString('en-IN')}</span>
                    <span className="price-period">/mo</span>
                  </div>

                  <ul className="pricing-features">
                    {features.map((feature) => (
                      <li key={feature} className="pricing-feature-item">
                        <Check size={14} className="feature-check" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`btn btn-lg pricing-cta${plan.popular ? ' btn-primary' : ' btn-secondary'}`}
                    onClick={() => handleSubscribe(plan)}
                    disabled={isLoading}
                    id={`subscribe-${plan.slug}`}
                  >
                    {isLoading ? <span className="spinner" /> : `Get ${plan.name}`}
                  </button>
                </div>
              )
            })}
          </div>
        </div>

        <style>{`
          .pricing-section {
            position: relative;
          }
          .pricing-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            align-items: start;
          }
          .pricing-card {
            background: var(--gradient-card);
            border: 1px solid var(--border);
            border-radius: var(--radius-xl);
            padding: 36px 28px;
            position: relative;
            transition: var(--transition-base);
          }
          .pricing-card:hover {
            border-color: rgba(124, 58, 237, 0.4);
            transform: translateY(-4px);
            box-shadow: var(--shadow-card);
          }
          .pricing-card--popular {
            border-color: var(--primary);
            background: linear-gradient(145deg, rgba(124, 58, 237, 0.12), rgba(6, 182, 212, 0.05));
            box-shadow: 0 0 0 1px rgba(124, 58, 237, 0.3), 0 16px 48px rgba(124, 58, 237, 0.2);
            transform: scale(1.02);
          }
          .pricing-card--popular:hover { transform: scale(1.02) translateY(-4px); }
          .popular-badge {
            position: absolute;
            top: -14px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 5px 16px;
            background: var(--gradient-primary);
            border-radius: var(--radius-full);
            font-size: 0.75rem;
            font-weight: 700;
            color: #fff;
            white-space: nowrap;
            box-shadow: 0 4px 16px var(--primary-glow);
          }
          .pricing-tier-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
          }
          .pricing-tier-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .tier-silver { background: rgba(148, 163, 184, 0.15); color: #cbd5e1; border: 1px solid rgba(148, 163, 184, 0.2); }
          .tier-gold { background: rgba(251, 191, 36, 0.15); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.2); }
          .tier-platinum { background: rgba(139, 92, 246, 0.2); color: #a78bfa; border: 1px solid rgba(139, 92, 246, 0.3); }
          .pricing-plan-name { font-size: 1.6rem; font-weight: 800; margin-bottom: 8px; }
          .pricing-description { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 24px; line-height: 1.6; }
          .pricing-price {
            display: flex;
            align-items: baseline;
            gap: 4px;
            margin-bottom: 28px;
          }
          .price-currency { font-size: 1.5rem; font-weight: 700; color: var(--primary-light); }
          .price-amount { font-family: var(--font-heading); font-size: 3.5rem; font-weight: 900; color: var(--text-primary); line-height: 1; }
          .price-period { font-size: 1rem; color: var(--text-muted); }
          .pricing-features { list-style: none; margin-bottom: 28px; display: flex; flex-direction: column; gap: 10px; }
          .pricing-feature-item { display: flex; align-items: flex-start; gap: 10px; font-size: 0.875rem; color: var(--text-secondary); }
          .feature-check { color: var(--primary-light); flex-shrink: 0; margin-top: 2px; }
          .pricing-cta { width: 100%; }
          @media (max-width: 1024px) {
            .pricing-grid { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; }
            .pricing-card--popular { transform: none; }
            .pricing-card--popular:hover { transform: translateY(-4px); }
          }
        `}</style>
      </section>
    </>
  )
}
