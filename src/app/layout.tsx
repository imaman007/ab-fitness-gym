import type { Metadata } from 'next'
import Providers from '@/components/Providers'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AB Fitness — Premium Gym Franchise Across India',
    template: '%s | AB Fitness',
  },
  description:
    'AB Fitness is India\'s premier gym franchise with 25+ locations across major cities. Join today and transform your body with expert trainers, modern equipment, and personalized plans.',
  keywords: ['gym', 'fitness', 'India', 'workout', 'AB Fitness', 'membership', 'personal trainer'],
  authors: [{ name: 'AB Fitness' }],
  openGraph: {
    title: 'AB Fitness — Premium Gym Franchise Across India',
    description: 'Join India\'s fastest growing gym franchise. 25+ locations, expert trainers, and premium facilities.',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
