import { MapPin, Dumbbell, Users, Trophy, Brain, Shield, Smartphone, Zap } from 'lucide-react'

const features = [
  {
    icon: MapPin,
    title: 'All-India Access',
    description: 'One membership card unlocks 25+ premium gym locations across major Indian cities. Train anywhere, anytime.',
    color: 'primary',
  },
  {
    icon: Dumbbell,
    title: 'Modern Equipment',
    description: 'State-of-the-art machines, free weights, cardio zones, and CrossFit rigs. Everything you need to excel.',
    color: 'accent',
  },
  {
    icon: Users,
    title: 'Certified Trainers',
    description: 'Work with India\'s top certified personal trainers. Personalized programs tailored to your specific goals.',
    color: 'primary',
  },
  {
    icon: Trophy,
    title: 'Progress Tracking',
    description: 'Advanced digital tracking for workouts, body metrics, and fitness goals. See your transformation unfold.',
    color: 'accent',
  },
  {
    icon: Brain,
    title: 'Smart Workout Plans',
    description: 'AI-curated workout plans for every fitness level — from beginner to advanced athlete.',
    color: 'primary',
  },
  {
    icon: Shield,
    title: 'Hygienic & Safe',
    description: 'Hospital-grade cleanliness standards with daily deep-cleaning protocols across all locations.',
    color: 'accent',
  },
  {
    icon: Smartphone,
    title: 'Digital Gym Card',
    description: 'Your virtual membership card lives in the app. Access any gym with a single QR scan — no plastic required.',
    color: 'primary',
  },
  {
    icon: Zap,
    title: 'Group Classes',
    description: 'HIIT, Yoga, Zumba, Spinning, and more. Join energetic group sessions led by passionate instructors.',
    color: 'accent',
  },
]

export default function FeaturesGrid() {
  return (
    <section className="section features-section">
      <div className="container">
        <div className="section-header">
          <div className="section-badge">✦ Why AB Fitness</div>
          <h2>
            Everything You Need to{' '}
            <span className="gradient-text">Reach Your Peak</span>
          </h2>
          <div className="divider" />
          <p style={{ maxWidth: 560, margin: '24px auto 0', fontSize: '1.05rem' }}>
            We built AB Fitness to be the most complete fitness ecosystem in India — premium facilities, expert guidance, and smart technology all in one.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className="feature-card" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className={`feature-icon feature-icon--${feature.color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      <style>{`
        .features-section {
          position: relative;
        }
        .features-section::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 800px;
          height: 800px;
          background: radial-gradient(ellipse, rgba(124, 58, 237, 0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .feature-card {
          background: var(--gradient-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          padding: 28px 24px;
          transition: var(--transition-base);
          animation: fadeInUp 0.5s ease both;
          position: relative;
          overflow: hidden;
        }
        .feature-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: var(--gradient-primary);
          opacity: 0;
          transition: var(--transition-base);
        }
        .feature-card:hover {
          border-color: rgba(124, 58, 237, 0.3);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 1px rgba(124, 58, 237, 0.3);
        }
        .feature-card:hover::after { opacity: 1; }
        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }
        .feature-icon--primary {
          background: rgba(124, 58, 237, 0.15);
          color: var(--primary-light);
          border: 1px solid rgba(124, 58, 237, 0.2);
        }
        .feature-icon--accent {
          background: rgba(6, 182, 212, 0.12);
          color: var(--accent-light);
          border: 1px solid rgba(6, 182, 212, 0.2);
        }
        .feature-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 10px;
          font-family: var(--font-heading);
        }
        .feature-desc {
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 1200px) {
          .features-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .features-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
