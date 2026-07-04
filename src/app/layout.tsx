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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&family=Syne:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
