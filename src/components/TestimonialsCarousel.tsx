'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  { name: 'Aditya Sharma', city: 'Mumbai', plan: 'Gold', text: 'AB Fitness completely transformed my lifestyle. The trainers are exceptional, the equipment is world-class, and having access to gyms across India while traveling for work is a game-changer. Best investment I\'ve ever made!', rating: 5, initials: 'AS' },
  { name: 'Priya Menon', city: 'Bengaluru', plan: 'Platinum', text: 'The Platinum plan with personal training sessions has helped me lose 18kg in 6 months. My trainer Rahul creates personalized programs and the nutrition plan is incredibly detailed. I\'ve never felt this energetic in my life.', rating: 5, initials: 'PM' },
  { name: 'Rohit Kapoor', city: 'Delhi', plan: 'Gold', text: 'I\'ve been to many gyms across India but AB Fitness stands out. The app, the virtual gym card, and the workout tracking features are incredibly well-thought-out. The equipment is always well-maintained too.', rating: 5, initials: 'RK' },
  { name: 'Sneha Iyer', city: 'Hyderabad', plan: 'Silver', text: 'Started with Silver to test the waters and I\'m amazed by the value. The workout plans in the app are detailed and easy to follow. I\'m definitely upgrading to Gold next month for the group classes!', rating: 5, initials: 'SI' },
  { name: 'Karan Mehta', city: 'Pune', plan: 'Platinum', text: 'The Baner location has the best CrossFit setup I\'ve ever used. Got my Platinum membership 8 months ago and the results speak for themselves — dropped body fat from 28% to 16%. The team here genuinely cares about your progress.', rating: 5, initials: 'KM' },
]

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(c => (c - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrent(c => (c + 1) % testimonials.length)

  const t = testimonials[current]

  return (
    <section className="section testimonials-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">⭐ Member Stories</div>
          <h2>What Our <span className="gradient-text">Members Say</span></h2>
          <div className="divider" />
        </div>

        <div className="testimonial-carousel">
          <button className="carousel-btn carousel-btn--prev" onClick={prev} aria-label="Previous testimonial" id="testimonial-prev">
            <ChevronLeft size={20} />
          </button>

          <div className="testimonial-card">
            <div className="quote-icon"><Quote size={32} /></div>

            <p className="testimonial-text">&quot;{t.text}&quot;</p>

            <div className="testimonial-rating">
              {'★'.repeat(t.rating)}<span style={{ color: 'var(--text-muted)' }}>{'★'.repeat(5 - t.rating)}</span>
            </div>

            <div className="testimonial-author">
              <div className="author-avatar">{t.initials}</div>
              <div>
                <div className="author-name">{t.name}</div>
                <div className="author-meta">{t.city} · <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>{t.plan}</span></div>
              </div>
            </div>
          </div>

          <button className="carousel-btn carousel-btn--next" onClick={next} aria-label="Next testimonial" id="testimonial-next">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="carousel-dots">
          {testimonials.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot${i === current ? ' active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .testimonials-section { background: linear-gradient(180deg, transparent, rgba(124, 58, 237, 0.04), transparent); }
        .testimonial-carousel {
          display: flex;
          align-items: center;
          gap: 24px;
          max-width: 720px;
          margin: 0 auto;
        }
        .carousel-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--glass-bg);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
          flex-shrink: 0;
        }
        .carousel-btn:hover { background: var(--primary); border-color: var(--primary); color: #fff; }
        .testimonial-card {
          flex: 1;
          background: var(--gradient-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          padding: 40px;
          position: relative;
          min-height: 280px;
        }
        .quote-icon { color: var(--primary); opacity: 0.4; margin-bottom: 20px; }
        .testimonial-text {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.8;
          margin-bottom: 20px;
          font-style: italic;
        }
        .testimonial-rating { font-size: 1.1rem; color: #fbbf24; margin-bottom: 20px; letter-spacing: 2px; }
        .testimonial-author { display: flex; align-items: center; gap: 14px; }
        .author-avatar {
          width: 46px;
          height: 46px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
          color: #fff;
        }
        .author-name { font-weight: 700; font-family: var(--font-heading); font-size: 1rem; margin-bottom: 4px; }
        .author-meta { font-size: 0.85rem; color: var(--text-muted); display: flex; align-items: center; gap: 6px; }
        .carousel-dots { display: flex; justify-content: center; gap: 8px; margin-top: 28px; }
        .carousel-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--border);
          border: none;
          cursor: pointer;
          transition: var(--transition-base);
        }
        .carousel-dot.active { background: var(--primary); width: 24px; border-radius: 4px; }
        @media (max-width: 640px) {
          .testimonial-carousel { flex-direction: column; }
          .carousel-btn { display: none; }
          .testimonial-card { padding: 28px 20px; }
        }
      `}</style>
    </section>
  )
}
