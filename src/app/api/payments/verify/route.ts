import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import crypto from 'crypto'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateCardNumber } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { orderId, paymentId, signature, planId } = await request.json()
    const userId = (session.user as any).id

    let isValid = false

    if (orderId.startsWith('order_mock_')) {
      // Sandbox mode: check mock signature
      isValid = signature === 'mock_signature'
    } else {
      // Real Razorpay: verify HMAC-SHA256
      const keySecret = process.env.RAZORPAY_KEY_SECRET || ''
      const body = `${orderId}|${paymentId}`
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body)
        .digest('hex')
      isValid = expectedSignature === signature
    }

    if (!isValid) {
      // Mark payment as failed
      await prisma.payment.updateMany({
        where: { razorpayOrderId: orderId, userId },
        data: { status: 'FAILED' },
      })
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Get plan details
    const plan = await prisma.plan.findUnique({ where: { id: planId } })
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 })
    }

    // Create or update membership
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + plan.duration)

    // Expire any existing membership
    await prisma.membership.updateMany({
      where: { userId, status: 'ACTIVE' },
      data: { status: 'EXPIRED' },
    })

    const cardNumber = generateCardNumber()

    const membership = await prisma.membership.create({
      data: {
        userId,
        planId: plan.id,
        status: 'ACTIVE',
        cardNumber,
        startDate,
        endDate,
        autoRenew: false,
      },
    })

    // Update payment to SUCCESS
    await prisma.payment.updateMany({
      where: { razorpayOrderId: orderId, userId },
      data: {
        status: 'SUCCESS',
        razorpayPaymentId: paymentId || `pay_mock_${Date.now()}`,
        razorpaySignature: signature,
        membershipId: membership.id,
      },
    })

    return NextResponse.json({
      success: true,
      membershipId: membership.id,
      cardNumber: membership.cardNumber,
      message: 'Payment verified and membership activated!',
    })
  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
