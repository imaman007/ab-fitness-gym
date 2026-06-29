import { prisma } from '@/lib/db'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturesGrid from '@/components/FeaturesGrid'
import PricingCards from '@/components/PricingCards'
import TestimonialsCarousel from '@/components/TestimonialsCarousel'
import Footer from '@/components/Footer'
import { MapPin, Star } from 'lucide-react'
import Link from 'next/link'

async function getPlans() {
  return prisma.plan.findMany({ where: { active: true }, orderBy: { price: 'asc' } })
}

async function getLocations() {
  return prisma.gymLocation.findMany({ where: { active: true }, take: 6, orderBy: { rating: 'desc' } })
}

export default async function Home() {
  const [plans, locations] = await Promise.all([getPlans(), getLocations()])

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesGrid />
        <TestimonialsCarousel />

        {/* Locations Preview */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-badge"><MapPin size={12} /> Our Locations</div>
              <h2>Find a Gym <span className="gradient-text">Near You</span></h2>
              <div className="divider" />
              <p style={{ maxWidth: 480, margin: '20px auto 0' }}>
                25+ premium locations across India. Use your single AB Fitness card at any of them.
              </p>
            </div>

            <div className="grid-3" style={{ marginBottom: 40 }}>
              {locations.map(loc => {
                const amenities = JSON.parse(loc.amenities) as string[]
                return (
                  <div key={loc.id} className="card" style={{ cursor: 'default' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-heading)', marginBottom: 4 }}>{loc.name}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={12} /> {loc.city}, {loc.state}
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fbbf24', fontSize: '0.85rem', fontWeight: 700 }}>
                        <Star size={13} fill="currentColor" /> {loc.rating}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {amenities.slice(0, 4).map(a => (
                        <span key={a} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>{a}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Link href="/locations" className="btn btn-secondary btn-lg" id="view-all-locations">
                View All Locations <MapPin size={16} />
              </Link>
            </div>
          </div>
        </section>

        <PricingCards plans={plans} />
      </main>
      <Footer />
    </>
  )
}
