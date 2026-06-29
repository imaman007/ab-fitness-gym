import { prisma } from '@/lib/db'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MapPin, Phone, Mail, Star, Clock, Search } from 'lucide-react'
import LocationsClient from './LocationsClient'

export const metadata = { title: 'Gym Locations — AB Fitness' }

export default async function LocationsPage() {
  const locations = await prisma.gymLocation.findMany({
    where: { active: true },
    orderBy: [{ state: 'asc' }, { city: 'asc' }],
  })

  const locationsWithParsedAmenities = locations.map(l => ({
    ...l,
    amenities: JSON.parse(l.amenities) as string[],
  }))

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        <div className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-badge"><MapPin size={12} /> Find a Gym</div>
              <h1>AB Fitness <span className="gradient-text">Locations</span></h1>
              <div className="divider" />
              <p style={{ maxWidth: 480, margin: '20px auto 0' }}>
                25+ premium gyms across India. Your single membership card works at every location.
              </p>
            </div>
            <LocationsClient locations={locationsWithParsedAmenities} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
