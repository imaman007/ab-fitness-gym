import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = (session.user as any).id
    const logs = await prisma.workoutLog.findMany({
      where: { userId },
      include: { exercise: true },
      orderBy: { date: 'desc' },
      take: 50,
    })
    return NextResponse.json(logs)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = (session.user as any).id
    const body = await request.json()
    const { exerciseId, sets, reps, weight, duration, notes, date } = body

    const log = await prisma.workoutLog.create({
      data: {
        userId,
        exerciseId,
        sets: parseInt(sets),
        reps: parseInt(reps),
        weight: weight ? parseFloat(weight) : null,
        duration: duration ? parseInt(duration) : null,
        notes: notes || null,
        date: date ? new Date(date) : new Date(),
      },
      include: { exercise: true },
    })
    return NextResponse.json(log, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to log workout' }, { status: 500 })
  }
}
