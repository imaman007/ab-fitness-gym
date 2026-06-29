import Razorpay from 'razorpay'

const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_yourkeyhere'
const keySecret = process.env.RAZORPAY_KEY_SECRET || 'your_razorpay_secret_here'

export const razorpay = new Razorpay({
  key_id: keyId,
  key_secret: keySecret,
})

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function generateCardNumber(): string {
  const prefix = 'ABF'
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 9000 + 1000).toString()
  return `${prefix}-${timestamp}-${random}`
}

export function isMockMode(): boolean {
  const keyId = process.env.RAZORPAY_KEY_ID || ''
  return !keyId || keyId === 'rzp_test_yourkeyhere' || keyId.length < 10
}
