import { prisma } from '@/lib/db'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ExercisesClient from './ExercisesClient'
import { Dumbbell } from 'lucide-react'

export const metadata = { title: 'Exercise Library — AB Fitness' }

export default async function ExercisesPage() {
  const exercises = await prisma.exercise.findMany({ orderBy: { name: 'asc' } })
  const exercisesWithParsedTips = exercises.map(e => ({ ...e, tips: JSON.parse(e.tips) as string[] }))

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 80 }}>
        <div className="section">
          <div className="container">
            <div className="section-header">
              <div className="section-badge"><Dumbbell size={12} /> Exercise Library</div>
              <h1>Master Every <span className="gradient-text">Exercise</span></h1>
              <div className="divider" />
              <p style={{ maxWidth: 480, margin: '20px auto 0' }}>
                {exercises.length}+ exercises with detailed instructions, tips, and muscle group guides.
              </p>
            </div>
            <ExercisesClient exercises={exercisesWithParsedTips} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
