'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles, Play, ShieldAlert, Layers, Palette, Eye, EyeOff } from 'lucide-react'

// ─── AI Gym Aesthetic Video Themes ─────────────────────────────────────────
export interface GymTheme {
  id: string
  name: string
  icon: string
  videoUrl: string | null
  primaryHex: string
  primaryLightHex: string
  accentHex: string
  gradientPrimary: string
  hues: [number, number] // Canvas particle hue range [primary, accent]
  tagline: string
}

export const GYM_THEMES: GymTheme[] = [
  {
    id: 'cyber-titan',
    name: 'Cyber Titan',
    icon: '🟣',
    videoUrl: 'https://cdn.pixabay.com/video/2020/08/16/47310-450190586_large.mp4',
    primaryHex: '#8b3dff',
    primaryLightHex: '#b87aff',
    accentHex: '#00f0ff',
    gradientPrimary: 'linear-gradient(135deg, #ff2a6d 0%, #8b3dff 50%, #00f0ff 100%)',
    hues: [265, 190],
    tagline: 'AI Cyber-Violet Heavy Lifting Atmosphere',
  },
  {
    id: 'inferno-titan',
    name: 'Inferno Power',
    icon: '🔴',
    videoUrl: 'https://videos.pexels.com/video-files/4761426/4761426-hd_1920_1080_25fps.mp4',
    primaryHex: '#ff2a6d',
    primaryLightHex: '#ff709b',
    accentHex: '#ffbe00',
    gradientPrimary: 'linear-gradient(135deg, #ff2a6d 0%, #ff8c00 50%, #ffbe00 100%)',
    hues: [350, 45],
    tagline: 'Molten Crimson & Gold Powerlifting Vibe',
  },
  {
    id: 'bio-synth',
    name: 'Bio-Synth',
    icon: '🟢',
    videoUrl: 'https://videos.pexels.com/video-files/3254006/3254006-hd_1920_1080_25fps.mp4',
    primaryHex: '#05ffa1',
    primaryLightHex: '#70ffcb',
    accentHex: '#00f0ff',
    gradientPrimary: 'linear-gradient(135deg, #05ffa1 0%, #00f0ff 100%)',
    hues: [155, 190],
    tagline: 'High-Speed Agility & Conditioning Grid',
  },
  {
    id: 'ai-matrix',
    name: 'AI Matrix',
    icon: '🌌',
    videoUrl: null, // Pure 3D Cyber Canvas Hologram
    primaryHex: '#a855f7',
    primaryLightHex: '#d8b4fe',
    accentHex: '#f43f5e',
    gradientPrimary: 'linear-gradient(135deg, #f43f5e 0%, #a855f7 50%, #6366f1 100%)',
    hues: [280, 340],
    tagline: 'Holographic 3D Gym Equipment Canvas Matrix',
  },
]

// ─── Types for Canvas ──────────────────────────────────────────────────────
interface Particle {
  x: number; y: number
  vx: number; vy: number
  radius: number
  hue: number
  opacity: number
  opacityDir: number
  opacitySpeed: number
}

interface Equipment {
  x: number; y: number
  vx: number; vy: number
  angle: number
  angleSpeed: number
  type: 'barbell' | 'dumbbell' | 'kettlebell' | 'ring'
  scale: number
  opacity: number
  opacityDir: number
}

interface GlowPulse {
  x: number; y: number
  radius: number
  maxRadius: number
  speed: number
  hue: number
}

// ─── Draw Primitives ────────────────────────────────────────────────────────
function drawBarbell(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, scale: number, alpha: number, primaryHue: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.globalAlpha = alpha
  ctx.strokeStyle = `hsl(${primaryHue}, 80%, 65%)`
  ctx.lineWidth = 2 * scale
  ctx.shadowColor = `hsl(${primaryHue}, 80%, 60%)`
  ctx.shadowBlur = 12

  const barLen = 90 * scale
  ctx.beginPath()
  ctx.moveTo(-barLen, 0)
  ctx.lineTo(barLen, 0)
  ctx.stroke()

  const plateW = 10 * scale
  const plateH = 28 * scale
  for (const side of [-1, 1]) {
    const px = side * (barLen - plateW / 2)
    ctx.beginPath()
    ctx.rect(px - plateW / 2, -plateH / 2, plateW, plateH)
    ctx.stroke()

    ctx.beginPath()
    ctx.rect(px - plateW * 1.8, -plateH * 0.65, plateW * 1.4, plateH * 1.3)
    ctx.strokeStyle = `hsl(${primaryHue}, 90%, 75%)`
    ctx.lineWidth = 1.5 * scale
    ctx.stroke()
  }
  ctx.restore()
}

function drawDumbbell(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, scale: number, alpha: number, accentHue: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.globalAlpha = alpha
  ctx.strokeStyle = `hsl(${accentHue}, 85%, 60%)`
  ctx.lineWidth = 2.5 * scale
  ctx.shadowColor = `hsl(${accentHue}, 85%, 60%)`
  ctx.shadowBlur = 12

  const handleLen = 30 * scale
  ctx.beginPath()
  ctx.moveTo(-handleLen, 0)
  ctx.lineTo(handleLen, 0)
  ctx.stroke()

  for (const side of [-1, 1]) {
    const cx = side * (handleLen + 10 * scale)
    ctx.beginPath()
    ctx.arc(cx, 0, 12 * scale, 0, Math.PI * 2)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(cx, 0, 7 * scale, 0, Math.PI * 2)
    ctx.strokeStyle = `hsl(${accentHue}, 95%, 75%)`
    ctx.lineWidth = 1.5 * scale
    ctx.stroke()
  }
  ctx.restore()
}

function drawKettlebell(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, scale: number, alpha: number, primaryHue: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.globalAlpha = alpha
  ctx.strokeStyle = `hsl(${primaryHue}, 80%, 70%)`
  ctx.lineWidth = 2 * scale
  ctx.shadowColor = `hsl(${primaryHue}, 80%, 70%)`
  ctx.shadowBlur = 10

  const r = 20 * scale
  ctx.beginPath()
  ctx.arc(0, 8 * scale, r, 0, Math.PI * 2)
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(0, -5 * scale, 14 * scale, Math.PI + 0.3, -0.3)
  ctx.stroke()
  ctx.restore()
}

function drawRing(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, scale: number, alpha: number, accentHue: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.globalAlpha = alpha
  ctx.strokeStyle = `hsl(${accentHue}, 80%, 65%)`
  ctx.lineWidth = 3 * scale
  ctx.shadowColor = `hsl(${accentHue}, 80%, 65%)`
  ctx.shadowBlur = 10

  ctx.beginPath()
  ctx.arc(0, 0, 22 * scale, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(0, 0, 14 * scale, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

// ─── Main Component ─────────────────────────────────────────────────────────
interface GymVideoBackgroundProps {
  showSwitcher?: boolean
  initialThemeIndex?: number
  className?: string
}

export default function GymVideoBackground({
  showSwitcher = true,
  initialThemeIndex = 0,
  className = '',
}: GymVideoBackgroundProps) {
  const [activeThemeIdx, setActiveThemeIdx] = useState(initialThemeIndex)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [switcherMinimized, setSwitcherMinimized] = useState(false)

  const activeTheme = GYM_THEMES[activeThemeIdx] || GYM_THEMES[0]
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Apply CSS root theme variables when theme changes
  useEffect(() => {
    const root = document.documentElement
    if (!root) return
    root.style.setProperty('--primary', activeTheme.primaryHex)
    root.style.setProperty('--primary-light', activeTheme.primaryLightHex)
    root.style.setProperty('--accent', activeTheme.accentHex)
    root.style.setProperty('--gradient-primary', activeTheme.gradientPrimary)
  }, [activeTheme])

  // Reset video state when switching theme
  useEffect(() => {
    setVideoLoaded(false)
    setVideoError(false)
    if (videoRef.current && activeTheme.videoUrl) {
      videoRef.current.load()
      videoRef.current.play().catch(() => setVideoError(true))
    }
  }, [activeThemeIdx, activeTheme.videoUrl])

  // Canvas Animation Engine
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const [hue1, hue2] = activeTheme.hues

    const particles: Particle[] = Array.from({ length: 75 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2.8 + 0.6,
      hue: Math.random() > 0.5 ? hue1 + (Math.random() * 20 - 10) : hue2 + (Math.random() * 20 - 10),
      opacity: Math.random() * 0.65 + 0.2,
      opacityDir: Math.random() > 0.5 ? 1 : -1,
      opacitySpeed: Math.random() * 0.005 + 0.002,
    }))

    const types: Equipment['type'][] = ['barbell', 'dumbbell', 'kettlebell', 'ring']
    const equipment: Equipment[] = Array.from({ length: 16 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.0035,
      type: types[i % types.length],
      scale: Math.random() * 0.6 + 0.3,
      opacity: Math.random() * 0.16 + 0.05,
      opacityDir: Math.random() > 0.5 ? 1 : -1,
    }))

    const pulses: GlowPulse[] = Array.from({ length: 4 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 80,
      maxRadius: 220 + Math.random() * 200,
      speed: 0.45 + Math.random() * 0.3,
      hue: i % 2 === 0 ? hue1 : hue2,
    }))

    let scanlineOffset = 0
    let tick = 0

    const draw = () => {
      tick++
      const w = canvas.width, h = canvas.height

      // If video is playing, keep canvas background semi-transparent; otherwise deep void
      const bgAlpha = activeTheme.videoUrl && videoLoaded && !videoError ? 0.38 : 1.0
      ctx.fillStyle = `rgba(3, 3, 9, ${bgAlpha})`
      ctx.fillRect(0, 0, w, h)

      // Cyber Grid
      ctx.strokeStyle = `hsla(${hue1}, 80%, 65%, 0.035)`
      ctx.lineWidth = 1
      const gridSize = 64
      for (let gx = 0; gx < w; gx += gridSize) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke()
      }
      for (let gy = 0; gy < h; gy += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke()
      }

      // Breathing Glow Pulses
      for (const pulse of pulses) {
        pulse.radius += pulse.speed
        if (pulse.radius > pulse.maxRadius) {
          pulse.radius = 0
          pulse.x = Math.random() * w
          pulse.y = Math.random() * h
        }
        const grad = ctx.createRadialGradient(pulse.x, pulse.y, 0, pulse.x, pulse.y, pulse.radius)
        grad.addColorStop(0, `hsla(${pulse.hue}, 85%, 55%, 0.12)`)
        grad.addColorStop(1, `hsla(${pulse.hue}, 85%, 40%, 0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // Central Breathing Glow
      const breathe = Math.sin(tick * 0.015) * 0.5 + 0.5
      const cx = w * 0.5, cy = h * 0.5
      const centralGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.65)
      centralGrad.addColorStop(0, `hsla(${hue1}, 80%, 60%, ${0.05 + breathe * 0.04})`)
      centralGrad.addColorStop(0.5, `hsla(${hue2}, 80%, 55%, ${0.02 + breathe * 0.02})`)
      centralGrad.addColorStop(1, 'rgba(3,3,9,0)')
      ctx.fillStyle = centralGrad
      ctx.fillRect(0, 0, w, h)

      // Particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
        p.opacity += p.opacityDir * p.opacitySpeed
        if (p.opacity > 0.9 || p.opacity < 0.1) p.opacityDir *= -1

        ctx.save()
        ctx.shadowColor = `hsla(${p.hue}, 85%, 65%, ${p.opacity})`
        ctx.shadowBlur = p.radius * 5
        ctx.fillStyle = `hsla(${p.hue}, 85%, 70%, ${p.opacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // Web connections
      ctx.strokeStyle = `hsla(${hue1}, 80%, 65%, 0.09)`
      ctx.lineWidth = 0.6
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 105) {
            ctx.globalAlpha = (1 - dist / 105) * 0.35
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1

      // Equipment Silhouettes
      for (const eq of equipment) {
        eq.x += eq.vx; eq.y += eq.vy
        eq.angle += eq.angleSpeed
        const pad = 120
        if (eq.x < -pad) eq.x = w + pad
        if (eq.x > w + pad) eq.x = -pad
        if (eq.y < -pad) eq.y = h + pad
        if (eq.y > h + pad) eq.y = -pad

        eq.opacity += eq.opacityDir * 0.00035
        if (eq.opacity > 0.22 || eq.opacity < 0.04) eq.opacityDir *= -1

        ctx.shadowBlur = 0
        switch (eq.type) {
          case 'barbell':    drawBarbell(ctx, eq.x, eq.y, eq.angle, eq.scale, eq.opacity, hue1); break
          case 'dumbbell':   drawDumbbell(ctx, eq.x, eq.y, eq.angle, eq.scale, eq.opacity, hue2); break
          case 'kettlebell': drawKettlebell(ctx, eq.x, eq.y, eq.angle, eq.scale, eq.opacity, hue1); break
          case 'ring':       drawRing(ctx, eq.x, eq.y, eq.angle, eq.scale, eq.opacity, hue2); break
        }
      }

      // Cinematic Scanlines
      scanlineOffset = (scanlineOffset + 0.5) % 4
      for (let y = scanlineOffset; y < h; y += 4) {
        ctx.fillStyle = 'rgba(0,0,0,0.07)'
        ctx.fillRect(0, y, w, 1)
      }

      // Vignette
      const vignette = ctx.createRadialGradient(cx, cy, h * 0.25, cx, cy, h * 0.95)
      vignette.addColorStop(0, 'rgba(0,0,0,0)')
      vignette.addColorStop(1, 'rgba(0,0,0,0.75)')
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, w, h)

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [activeThemeIdx, activeTheme.hues, activeTheme.videoUrl, videoLoaded, videoError])

  return (
    <div className={`gym-video-bg-wrapper ${className}`} aria-hidden="true">
      {/* ── 1. AI Loop Video Background Layer ── */}
      {activeTheme.videoUrl && !videoError && (
        <video
          ref={videoRef}
          key={activeTheme.videoUrl}
          src={activeTheme.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setVideoLoaded(true)}
          onError={() => setVideoError(true)}
          className={`gym-bg-video ${videoLoaded ? 'loaded' : ''}`}
        />
      )}

      {/* ── 2. Interactive Holographic Particle Canvas ── */}
      <canvas ref={canvasRef} className="gym-bg-canvas" />

      {/* ── 3. Floating AI Aesthetic Vibe Switcher Pill ── */}
      {showSwitcher && (
        <div className={`ai-vibe-dock ${switcherMinimized ? 'minimized' : ''}`} style={{ pointerEvents: 'auto' }}>
          {switcherMinimized ? (
            <button
              onClick={() => setSwitcherMinimized(false)}
              className="vibe-dock-toggle-btn"
              title="Expand AI Vibe Controls"
            >
              <Sparkles size={16} className="spin-slow" />
              <span>AI Vibe: {activeTheme.name}</span>
              <Eye size={14} />
            </button>
          ) : (
            <div className="vibe-dock-panel">
              <div className="vibe-dock-header">
                <div className="vibe-dock-title">
                  <Sparkles size={15} className="text-accent spin-slow" />
                  <span>AI Aesthetic Vibe</span>
                  <span className="vibe-badge">LIVE</span>
                </div>
                <button
                  onClick={() => setSwitcherMinimized(true)}
                  className="vibe-dock-min-btn"
                  title="Minimize Switcher"
                >
                  <EyeOff size={14} />
                </button>
              </div>

              <div className="vibe-theme-list">
                {GYM_THEMES.map((theme, idx) => {
                  const isActive = idx === activeThemeIdx
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setActiveThemeIdx(idx)}
                      className={`vibe-theme-btn ${isActive ? 'active' : ''}`}
                      style={{
                        '--btn-primary': theme.primaryHex,
                        '--btn-accent': theme.accentHex,
                      } as React.CSSProperties}
                    >
                      <span className="theme-icon">{theme.icon}</span>
                      <span className="theme-name">{theme.name}</span>
                      {isActive && <span className="active-dot" />}
                    </button>
                  )
                })}
              </div>

              <div className="vibe-tagline">
                <Layers size={11} />
                <span>{activeTheme.tagline}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <style>{`
        .gym-video-bg-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
          z-index: 0;
          background: #030309;
        }
        .gym-bg-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0;
          transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          filter: contrast(1.15) saturate(1.25) brightness(0.65);
          transform: scale(1.02);
        }
        .gym-bg-video.loaded {
          opacity: 0.75;
        }
        .gym-bg-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: block;
          z-index: 1;
        }
        .ai-vibe-dock {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 999;
          font-family: var(--font-heading);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .ai-vibe-dock.minimized {
          bottom: 20px;
          right: 20px;
        }
        .vibe-dock-toggle-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          background: rgba(15, 13, 34, 0.88);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(139, 61, 255, 0.35);
          border-radius: 999px;
          color: #f5f5ff;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 61, 255, 0.3);
          transition: all 0.25s ease;
        }
        .vibe-dock-toggle-btn:hover {
          background: rgba(22, 19, 48, 0.95);
          border-color: var(--accent);
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.7), 0 0 28px rgba(0, 240, 255, 0.4);
        }
        .vibe-dock-panel {
          background: rgba(10, 8, 24, 0.9);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(139, 61, 255, 0.3);
          border-radius: 20px;
          padding: 16px;
          width: 320px;
          box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8), 0 0 30px rgba(139, 61, 255, 0.25);
          animation: slideUpFade 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .vibe-dock-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .vibe-dock-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 800;
          color: #f5f5ff;
          letter-spacing: 0.02em;
        }
        .vibe-badge {
          font-size: 0.65rem;
          padding: 2px 6px;
          border-radius: 999px;
          background: linear-gradient(135deg, #ff2a6d, #8b3dff);
          color: #fff;
          font-weight: 800;
          letter-spacing: 0.08em;
          animation: pulseGlow 2s infinite;
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px rgba(255, 42, 109, 0.6); }
          50% { opacity: 0.8; box-shadow: 0 0 16px rgba(139, 61, 255, 0.8); }
        }
        .vibe-dock-min-btn {
          background: transparent;
          border: none;
          color: #a8a8d0;
          cursor: pointer;
          padding: 4px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .vibe-dock-min-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }
        .vibe-theme-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 12px;
        }
        .vibe-theme-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          background: rgba(20, 16, 46, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          color: #a8a8d0;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .vibe-theme-btn:hover {
          background: rgba(30, 24, 66, 0.8);
          color: #fff;
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-1px);
        }
        .vibe-theme-btn.active {
          background: linear-gradient(135deg, rgba(139, 61, 255, 0.25), rgba(0, 240, 255, 0.15));
          border-color: var(--btn-accent, #00f0ff);
          color: #fff;
          font-weight: 700;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 12px rgba(139, 61, 255, 0.3);
        }
        .theme-icon { font-size: 0.95rem; }
        .theme-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .active-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent, #00f0ff);
          margin-left: auto;
          box-shadow: 0 0 8px var(--accent, #00f0ff);
        }
        .vibe-tagline {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.72rem;
          color: #8888b8;
          font-family: var(--font-body);
          padding-top: 6px;
          border-top: 1px dashed rgba(255, 255, 255, 0.08);
        }
        .spin-slow { animation: spinSlow 8s linear infinite; }
        @keyframes spinSlow { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .ai-vibe-dock { bottom: 16px; right: 16px; }
          .vibe-dock-panel { width: 280px; }
        }
      `}</style>
    </div>
  )
}
