'use client'

import dynamic from 'next/dynamic'

const GymVideoBackground = dynamic(() => import('./GymVideoBackground'), { ssr: false })

interface AmbientVideoBgProps {
  showSwitcher?: boolean
  initialThemeIndex?: number
  className?: string
}

export default function AmbientVideoBg({
  showSwitcher = false,
  initialThemeIndex = 0,
  className = '',
}: AmbientVideoBgProps) {
  return (
    <GymVideoBackground
      showSwitcher={showSwitcher}
      initialThemeIndex={initialThemeIndex}
      className={className}
    />
  )
}
