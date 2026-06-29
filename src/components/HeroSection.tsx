'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Zap } from 'lucide-react'
import dynamic from 'next/dynamic'

// Load canvas background client-side only (no SSR needed)
const GymVideoBackground = dynamic(() => import('./GymVideoBackground'), { ssr: false })

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="hero">
      {/* ── Animated Video Background ── */}
      {mounted && <GymVideoBackground />}

      {/* ── Content ── */}
      <div className="container hero-content">
        <div className="hero-badge">
          <Zap size={13} />
          India&apos;s #1 Gym Franchise Network
        </div>

        <h1 className="hero-title">
          Transform Your
          <br />
          <span className="gradient-text">Body. Mind. Life.</span>
        </h1>

        <p className="hero-subtitle">
          25+ premium gyms across India. Expert trainers, cutting-edge equipment,
          and personalized plans designed to help you achieve your ultimate fitness goals.
        </p>

        <div className="hero-stats">
          {[
            { value: '25+', label: 'Gym Locations' },
            { value: '50K+', label: 'Active Members' },
            { value: '200+', label: 'Expert Trainers' },
            { value: '4.8★', label: 'Average Rating' },
          ].map(stat => (
            <div key={stat.label} className="hero-stat">
              <span className="hero-stat-value">{stat.value}</span>
              <span className="hero-stat-label">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="hero-actions">
          <Link href="/register" className="btn btn-primary btn-lg" id="hero-cta-primary">
            Start Your Journey <ArrowRight size={18} />
          </Link>
          <Link href="/workouts" className="btn btn-secondary btn-lg" id="hero-cta-secondary">
            <Play size={18} /> Explore Workouts
          </Link>
        </div>
      </div>

      <style>{`
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: #05050F;
          overflow: hidden;
          padding-top: 80px;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          padding-top: 48px;
          padding-bottom: 96px;
        }
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 16px;
          background: rgba(124, 58, 237, 0.15);
          border: 1px solid rgba(124, 58, 237, 0.3);
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--primary-light);
          font-family: var(--font-heading);
          letter-spacing: 0.05em;
          margin-bottom: 28px;
          animation: fadeInDown 0.6s ease both;
          backdrop-filter: blur(8px);
        }
        .hero-title {
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          margin-bottom: 24px;
          animation: fadeInDown 0.7s ease 0.1s both;
          text-shadow: 0 0 80px rgba(124,58,237,0.3);
        }
        .hero-subtitle {
          font-size: clamp(1rem, 2vw, 1.2rem);
          color: rgba(226, 232, 240, 0.8);
          max-width: 560px;
          line-height: 1.7;
          margin-bottom: 48px;
          animation: fadeInDown 0.7s ease 0.2s both;
        }
        .hero-stats {
          display: flex;
          gap: 40px;
          margin-bottom: 48px;
          animation: fadeInDown 0.7s ease 0.3s both;
          flex-wrap: wrap;
        }
        .hero-stat { display: flex; flex-direction: column; }
        .hero-stat-value {
          font-family: var(--font-heading);
          font-size: 2rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          filter: drop-shadow(0 0 12px rgba(124,58,237,0.5));
        }
        .hero-stat-label {
          font-size: 0.8rem;
          color: rgba(148, 163, 184, 0.8);
          font-weight: 500;
          margin-top: 4px;
        }
        .hero-actions {
          display: flex;
          gap: 14px;
          flex-wrap: wrap;
          animation: fadeInDown 0.7s ease 0.4s both;
        }
        .hero-actions .btn-primary {
          box-shadow: 0 0 32px rgba(124,58,237,0.5), 0 4px 16px rgba(0,0,0,0.4);
        }
        .hero-actions .btn-secondary {
          backdrop-filter: blur(8px);
          background: rgba(15, 15, 40, 0.6);
          border-color: rgba(124,58,237,0.3);
        }
        .hero-actions .btn-secondary:hover {
          background: rgba(124,58,237,0.15);
          border-color: rgba(124,58,237,0.6);
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
          .hero-stats { gap: 24px; }
          .hero-stat-value { font-size: 1.5rem; }
          .hero-actions { flex-direction: column; }
          .hero-actions .btn { width: 100%; }
        }
      `}</style>
    </section>
  )
}
