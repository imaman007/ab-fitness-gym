import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const exercises = await prisma.exercise.findMany({
      select: { id: true, name: true, muscleGroup: true, equipment: true },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json(exercises)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 })
  }
}
