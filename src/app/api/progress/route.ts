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
    const entries = await prisma.progressEntry.findMany({
      where: { userId },
      orderBy: { date: 'asc' },
    })
    return NextResponse.json(entries)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
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

    const entry = await prisma.progressEntry.create({
      data: {
        userId,
        weight: body.weight ? parseFloat(body.weight) : null,
        bodyFat: body.bodyFat ? parseFloat(body.bodyFat) : null,
        chest: body.chest ? parseFloat(body.chest) : null,
        waist: body.waist ? parseFloat(body.waist) : null,
        hips: body.hips ? parseFloat(body.hips) : null,
        biceps: body.biceps ? parseFloat(body.biceps) : null,
        thighs: body.thighs ? parseFloat(body.thighs) : null,
        notes: body.notes || null,
        date: body.date ? new Date(body.date) : new Date(),
      },
    })
    return NextResponse.json(entry, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 })
  }
}
