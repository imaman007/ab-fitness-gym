import type { Metadata } from 'next'
import { Dumbbell, TrendingUp, Users, MapPin } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Join AB Fitness',
}

const stats = [
  { icon: TrendingUp, value: '50K+', label: 'Active Members' },
  { icon: Users, value: '200+', label: 'Expert Trainers' },
  { icon: MapPin, value: '25+', label: 'Gym Locations' },
]

const quotes = [
  { text: 'The only bad workout is the one that didn\'t happen.', author: 'AB Fitness Philosophy' },
  { text: 'Your body can stand almost anything. It\'s your mind that you have to convince.', author: 'AB Fitness Mindset' },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const quote = quotes[0]

  return (
    <div className="auth-layout">
      {/* Left Branding Panel */}
      <div className="auth-left">
        <div className="auth-left-overlay" />
        <div className="auth-left-content">
          <div className="auth-logo">
            <div className="auth-logo-icon"><Dumbbell size={24} /></div>
            <span className="auth-logo-text">AB<span>Fitness</span></span>
          </div>

          <div className="auth-hero-text">
            <h1 className="auth-hero-title">
              Start Your
              <br />
              <span className="gradient-text">Transformation</span>
              <br />
              Today
            </h1>
            <p className="auth-hero-sub">India&apos;s premier gym network with world-class facilities and expert coaching.</p>
          </div>

          <blockquote className="auth-quote">
            <p>&quot;{quote.text}&quot;</p>
            <footer>— {quote.author}</footer>
          </blockquote>

          <div className="auth-stats">
            {stats.map(stat => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="auth-stat">
                  <div className="auth-stat-icon"><Icon size={16} /></div>
                  <div>
                    <div className="auth-stat-value">{stat.value}</div>
                    <div className="auth-stat-label">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-right">
        {children}
      </div>

      <style>{`
        .auth-layout {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .auth-left {
          position: relative;
          background: linear-gradient(135deg, #0a0820 0%, #150a30 40%, #051020 100%);
          display: flex;
          align-items: center;
          overflow: hidden;
          padding: 48px;
        }
        .auth-left::before {
          content: '';
          position: absolute;
          top: -200px;
          left: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 60%);
          pointer-events: none;
        }
        .auth-left::after {
          content: '';
          position: absolute;
          bottom: -100px;
          right: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, transparent 60%);
          pointer-events: none;
        }
        .auth-left-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(124, 58, 237, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.05) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .auth-left-content {
          position: relative;
          z-index: 1;
          width: 100%;
        }
        .auth-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 60px;
        }
        .auth-logo-icon {
          width: 44px;
          height: 44px;
          background: var(--gradient-primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          box-shadow: 0 4px 16px var(--primary-glow);
        }
        .auth-logo-text {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text-primary);
        }
        .auth-logo-text span { color: var(--primary-light); }
        .auth-hero-title {
          font-size: clamp(2.5rem, 4vw, 3.5rem);
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: 20px;
        }
        .auth-hero-sub {
          font-size: 1rem;
          color: var(--text-secondary);
          max-width: 400px;
          line-height: 1.7;
          margin-bottom: 48px;
        }
        .auth-quote {
          background: rgba(124, 58, 237, 0.08);
          border-left: 3px solid var(--primary);
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
          padding: 20px 24px;
          margin-bottom: 48px;
        }
        .auth-quote p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          font-style: italic;
          margin-bottom: 8px;
          line-height: 1.7;
        }
        .auth-quote footer { font-size: 0.8rem; color: var(--primary-light); font-weight: 600; }
        .auth-stats { display: flex; flex-direction: column; gap: 16px; }
        .auth-stat { display: flex; align-items: center; gap: 14px; }
        .auth-stat-icon {
          width: 36px;
          height: 36px;
          background: rgba(6, 182, 212, 0.1);
          border: 1px solid rgba(6, 182, 212, 0.2);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-light);
          flex-shrink: 0;
        }
        .auth-stat-value { font-family: var(--font-heading); font-weight: 800; font-size: 1.1rem; color: var(--text-primary); }
        .auth-stat-label { font-size: 0.8rem; color: var(--text-muted); }
        .auth-right {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px;
          background: var(--bg-primary);
          overflow-y: auto;
        }
        @media (max-width: 1024px) {
          .auth-layout { grid-template-columns: 1fr; }
          .auth-left { display: none; }
          .auth-right { padding: 32px 24px; }
        }
      `}</style>
    </div>
  )
}
