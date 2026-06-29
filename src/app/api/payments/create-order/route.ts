import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { razorpay, isMockMode } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { planId } = await request.json()
    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 })
    }

    const plan = await prisma.plan.findUnique({ where: { id: planId } })
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    const userId = (session.user as any).id
    const amountInPaise = Math.round(plan.price * 100)

    // Sandbox / Mock mode
    if (isMockMode()) {
      const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

      await prisma.payment.create({
        data: {
          userId,
          amount: plan.price,
          currency: 'INR',
          status: 'PENDING',
          razorpayOrderId: mockOrderId,
          description: `${plan.name} Plan Subscription`,
        },
      })

      return NextResponse.json({
        isMock: true,
        orderId: mockOrderId,
        amount: plan.price,
        planName: plan.name,
        planId: plan.id,
        currency: 'INR',
      })
    }

    // Real Razorpay
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        planId: plan.id,
        userId,
        planName: plan.name,
      },
    })

    await prisma.payment.create({
      data: {
        userId,
        amount: plan.price,
        currency: 'INR',
        status: 'PENDING',
        razorpayOrderId: order.id,
        description: `${plan.name} Plan Subscription`,
      },
    })

    return NextResponse.json({
      isMock: false,
      orderId: order.id,
      amount: plan.price,
      planName: plan.name,
      planId: plan.id,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
