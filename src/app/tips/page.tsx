import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TipsClient from './TipsClient'
import { Lightbulb } from 'lucide-react'

export const metadata: Metadata = { title: 'Fitness Tips — AB Fitness' }

export default function TipsPage() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        <div className="section">
          <div className="container" style={{ maxWidth: 860 }}>
            <div className="section-header">
              <div className="section-badge"><Lightbulb size={12} /> Expert Guidance</div>
              <h1>Fitness <span className="gradient-text">Tips &amp; FAQ</span></h1>
              <div className="divider" />
              <p style={{ maxWidth: 480, margin: '20px auto 0' }}>
                Expert advice on form, recovery, nutrition, and mindset from AB Fitness coaches.
              </p>
            </div>
            <TipsClient />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
