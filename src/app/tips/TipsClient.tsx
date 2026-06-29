'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Dumbbell, Heart, Apple, Lightbulb } from 'lucide-react'

const tipCategories = [
  {
    category: 'Form & Safety',
    icon: Dumbbell,
    color: 'primary',
    tips: [
      { q: 'How do I avoid injuries during weight training?', a: 'Always warm up for 5-10 minutes before lifting. Start with lighter weights to perfect your form before adding load. Keep your core braced, breathe properly (exhale on effort), and never sacrifice form for heavier weights. If something hurts — stop immediately and seek professional advice.' },
      { q: 'What is the correct breathing technique while lifting?', a: 'Breathe in during the eccentric phase (lowering) and breathe out during the concentric phase (lifting). For very heavy lifts, use the Valsalva maneuver: take a deep breath, brace your core hard, complete the rep, then exhale. This stabilizes your spine under load.' },
      { q: 'How often should I change my workout program?', a: 'Most programs are effective for 8-12 weeks. Signs you need a change: plateau in strength or physique, lack of motivation, easy sessions. Progressive overload (gradually increasing weight or reps) is more important than frequently changing exercises.' },
      { q: 'Is it safe to train every day?', a: 'Training every day can work if you vary intensity. Muscles need 48-72 hours to recover after intense sessions. You can train different muscle groups on consecutive days (e.g. Push/Pull/Legs split) or alternate intense and recovery sessions like yoga or light cardio.' },
    ],
  },
  {
    category: 'Recovery & Rest',
    icon: Heart,
    color: 'accent',
    tips: [
      { q: 'How much sleep do I need for muscle growth?', a: 'Aim for 7-9 hours of quality sleep per night. During deep sleep, your body releases growth hormone (GH) and repairs muscle tissue. Poor sleep dramatically reduces testosterone, increases cortisol, impairs cognitive function, and slows recovery. Sleep is when the gains happen.' },
      { q: 'What is active recovery and when should I do it?', a: 'Active recovery involves light movement on rest days — walking, yoga, swimming, or mobility work. It increases blood flow to muscles, reduces DOMS (delayed onset muscle soreness), and maintains your routine without overtaxing recovery systems. Do it 1-2 days per week.' },
      { q: 'How do I reduce muscle soreness (DOMS)?', a: 'DOMS typically peaks 24-72 hours after training. Strategies: stay hydrated, eat protein-rich meals post-workout, do light active recovery, use foam rolling, take cold/contrast showers, and get adequate sleep. The soreness typically lessens as your body adapts to training.' },
    ],
  },
  {
    category: 'Nutrition',
    icon: Apple,
    color: 'primary',
    tips: [
      { q: 'How much protein do I need to build muscle?', a: "Research suggests 1.6-2.2g of protein per kg of bodyweight per day for muscle building. For a 70kg person, that's 112-154g daily. Prioritize whole food sources like chicken, fish, eggs, paneer, lentils, and dairy. Distribute protein across 3-5 meals for optimal muscle protein synthesis." },
      { q: 'Should I eat before or after training?', a: "Both matter. Pre-workout (1-2 hours before): eat carbs + protein for energy and muscle protection (e.g., banana + eggs). Post-workout (within 30-60 min): consume fast protein + carbs to kickstart recovery (e.g., protein shake + fruit, or rice + chicken). Don't train completely fasted unless adapted to it." },
      { q: 'How much water should I drink during workouts?', a: 'Start hydrated (urine should be pale yellow). Drink 500ml-1L of water before training. During exercise: 150-250ml every 15-20 minutes. After training: replenish 1.5x the fluid you lost. Add electrolytes for sessions over 60 minutes or in hot conditions.' },
      { q: 'Are supplements necessary for gym progress?', a: 'No — nutrition from whole foods is the foundation. That said, a few supplements have strong evidence: Creatine monohydrate (strength & power), Protein powder (convenience, not necessity), Vitamin D3+K2 (especially in India where deficiency is common), Magnesium (sleep & recovery). Everything else is largely marketing.' },
    ],
  },
  {
    category: 'Mindset & Motivation',
    icon: Lightbulb,
    color: 'accent',
    tips: [
      { q: 'How do I stay consistent with my gym routine?', a: "Consistency beats perfection. Schedule workouts like appointments. Start with 3 days/week rather than ambitious 6-day plans. Find a training partner for accountability. Track your progress to see improvements over time. Remember: showing up on low-motivation days is where real growth happens." },
      { q: 'How do I overcome a training plateau?', a: "Plateaus are normal and expected. Solutions: vary your rep ranges (high rep weeks vs low rep weeks), change exercise order, add volume gradually, ensure you're eating enough to support your goals, prioritize sleep and recovery, and deload for a week (reduce weight by 40-50%) before pushing again." },
      { q: 'How long until I see visible results?', a: "First 4 weeks: neural adaptations — you'll feel stronger but look similar. Weeks 4-8: noticeable definition and muscle fullness. Weeks 8-16: visible muscle growth and body composition changes. Months 6-12: significant transformation. Consistency in training AND nutrition is non-negotiable. Trust the process." },
    ],
  },
]

function TipAccordion({ tip }: { tip: { q: string; a: string } }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`tip-item${open ? ' open' : ''}`} onClick={() => setOpen(!open)}>
      <div className="tip-question">
        <span>{tip.q}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      {open && (
        <div className="tip-answer" onClick={e => e.stopPropagation()}>
          {tip.a}
        </div>
      )}
    </div>
  )
}

export default function TipsClient() {
  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
        {tipCategories.map(cat => {
          const Icon = cat.icon
          return (
            <div key={cat.category}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div className={`tip-cat-icon tip-cat-icon--${cat.color}`}>
                  <Icon size={20} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem' }}>{cat.category}</h2>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cat.tips.map((tip, i) => <TipAccordion key={i} tip={tip} />)}
              </div>
            </div>
          )
        })}
      </div>

      <style>{`
        .tip-cat-icon {
          width: 48px; height: 48px;
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
        }
        .tip-cat-icon--primary { background: rgba(124,58,237,0.15); color: var(--primary-light); border: 1px solid rgba(124,58,237,0.2); }
        .tip-cat-icon--accent { background: rgba(6,182,212,0.12); color: var(--accent-light); border: 1px solid rgba(6,182,212,0.2); }
        .tip-item {
          background: var(--gradient-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          cursor: pointer;
          transition: var(--transition-fast);
        }
        .tip-item:hover, .tip-item.open { border-color: rgba(124,58,237,0.3); }
        .tip-question {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 18px 20px;
          font-weight: 600;
          font-family: var(--font-heading);
          font-size: 0.95rem;
          color: var(--text-primary);
        }
        .tip-question svg { flex-shrink: 0; color: var(--primary-light); }
        .tip-answer {
          padding: 16px 20px 18px;
          font-size: 0.875rem;
          color: var(--text-secondary);
          line-height: 1.8;
          border-top: 1px solid var(--border-light);
        }
      `}</style>
    </>
  )
}
