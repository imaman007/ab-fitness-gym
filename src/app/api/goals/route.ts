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
    const goals = await prisma.fitnessGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(goals)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 })
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
    const { type, title, target, current, unit, deadline } = body

    const goal = await prisma.fitnessGoal.create({
      data: {
        userId,
        type,
        title,
        target: parseFloat(target),
        current: parseFloat(current || 0),
        unit,
        deadline: deadline ? new Date(deadline) : null,
        status: 'ACTIVE',
      },
    })
    return NextResponse.json(goal, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 })
  }
}
