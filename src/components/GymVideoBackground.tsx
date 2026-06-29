'use client'

import { useEffect, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────
interface Particle {
  x: number; y: number
  vx: number; vy: number
  radius: number
  hue: number        // 260–200 (violet→cyan)
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

// ─── Draw Primitives ──────────────────────────────────────
function drawBarbell(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, scale: number, alpha: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.globalAlpha = alpha
  ctx.strokeStyle = '#7c3aed'
  ctx.lineWidth = 2 * scale
  ctx.shadowColor = '#7c3aed'
  ctx.shadowBlur = 8

  // Bar
  const barLen = 90 * scale
  ctx.beginPath()
  ctx.moveTo(-barLen, 0)
  ctx.lineTo(barLen, 0)
  ctx.stroke()

  // Plates
  const plateW = 10 * scale
  const plateH = 28 * scale
  for (const side of [-1, 1]) {
    const px = side * (barLen - plateW / 2)
    ctx.beginPath()
    ctx.rect(px - plateW / 2, -plateH / 2, plateW, plateH)
    ctx.strokeStyle = '#7c3aed'
    ctx.stroke()

    ctx.beginPath()
    ctx.rect(px - plateW * 1.8, -plateH * 0.65, plateW * 1.4, plateH * 1.3)
    ctx.strokeStyle = '#a78bfa'
    ctx.lineWidth = 1.5 * scale
    ctx.stroke()
  }

  ctx.restore()
}

function drawDumbbell(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, scale: number, alpha: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.globalAlpha = alpha
  ctx.strokeStyle = '#06b6d4'
  ctx.lineWidth = 2.5 * scale
  ctx.shadowColor = '#06b6d4'
  ctx.shadowBlur = 10

  // Handle
  const handleLen = 30 * scale
  ctx.beginPath()
  ctx.moveTo(-handleLen, 0)
  ctx.lineTo(handleLen, 0)
  ctx.stroke()

  // End caps
  for (const side of [-1, 1]) {
    const cx = side * (handleLen + 10 * scale)
    ctx.beginPath()
    ctx.arc(cx, 0, 12 * scale, 0, Math.PI * 2)
    ctx.strokeStyle = '#06b6d4'
    ctx.lineWidth = 2 * scale
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(cx, 0, 7 * scale, 0, Math.PI * 2)
    ctx.strokeStyle = '#22d3ee'
    ctx.lineWidth = 1.5 * scale
    ctx.stroke()
  }

  ctx.restore()
}

function drawKettlebell(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, scale: number, alpha: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.globalAlpha = alpha
  ctx.strokeStyle = '#a78bfa'
  ctx.lineWidth = 2 * scale
  ctx.shadowColor = '#a78bfa'
  ctx.shadowBlur = 8

  // Body (teardrop)
  const r = 20 * scale
  ctx.beginPath()
  ctx.arc(0, 8 * scale, r, 0, Math.PI * 2)
  ctx.stroke()

  // Handle (arc)
  ctx.beginPath()
  ctx.arc(0, -5 * scale, 14 * scale, Math.PI + 0.3, -0.3)
  ctx.stroke()

  ctx.restore()
}

function drawRing(ctx: CanvasRenderingContext2D, x: number, y: number, angle: number, scale: number, alpha: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.globalAlpha = alpha
  ctx.strokeStyle = '#34d399'
  ctx.lineWidth = 3 * scale
  ctx.shadowColor = '#34d399'
  ctx.shadowBlur = 8

  // Olympic ring
  ctx.beginPath()
  ctx.arc(0, 0, 22 * scale, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(0, 0, 14 * scale, 0, Math.PI * 2)
  ctx.stroke()

  ctx.restore()
}

// ─── Main Component ───────────────────────────────────────
export default function GymVideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Resize
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const W = () => canvas.width
    const H = () => canvas.height

    // ── Init particles
    const particles: Particle[] = Array.from({ length: 70 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2.5 + 0.5,
      hue: Math.random() > 0.5 ? 260 + Math.random() * 20 : 190 + Math.random() * 15,
      opacity: Math.random() * 0.6 + 0.2,
      opacityDir: Math.random() > 0.5 ? 1 : -1,
      opacitySpeed: Math.random() * 0.005 + 0.002,
    }))

    // ── Init equipment
    const types: Equipment['type'][] = ['barbell', 'dumbbell', 'kettlebell', 'ring']
    const equipment: Equipment[] = Array.from({ length: 14 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      angle: Math.random() * Math.PI * 2,
      angleSpeed: (Math.random() - 0.5) * 0.003,
      type: types[i % types.length],
      scale: Math.random() * 0.55 + 0.25,
      opacity: Math.random() * 0.14 + 0.05,
      opacityDir: Math.random() > 0.5 ? 1 : -1,
    }))

    // ── Init glow pulses
    const pulses: GlowPulse[] = Array.from({ length: 4 }, (_, i) => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 80,
      maxRadius: 200 + Math.random() * 200,
      speed: 0.4 + Math.random() * 0.3,
      hue: i % 2 === 0 ? 265 : 192,
    }))

    let scanlineOffset = 0
    let tick = 0

    // ─── Draw loop ────────────────────────────────────────
    const draw = () => {
      tick++
      const w = W(), h = H()

      // Background
      ctx.fillStyle = '#05050F'
      ctx.fillRect(0, 0, w, h)

      // ── Grid
      ctx.strokeStyle = 'rgba(124,58,237,0.04)'
      ctx.lineWidth = 1
      const gridSize = 60
      for (let gx = 0; gx < w; gx += gridSize) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke()
      }
      for (let gy = 0; gy < h; gy += gridSize) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke()
      }

      // ── Glow pulses (radial gradients that breathe)
      for (const pulse of pulses) {
        pulse.radius += pulse.speed
        if (pulse.radius > pulse.maxRadius) {
          pulse.radius = 0
          pulse.x = Math.random() * w
          pulse.y = Math.random() * h
        }
        const grad = ctx.createRadialGradient(pulse.x, pulse.y, 0, pulse.x, pulse.y, pulse.radius)
        grad.addColorStop(0, `hsla(${pulse.hue}, 80%, 55%, 0.08)`)
        grad.addColorStop(1, `hsla(${pulse.hue}, 80%, 40%, 0)`)
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2)
        ctx.fill()
      }

      // ── Central breathing glow
      const breathe = Math.sin(tick * 0.012) * 0.5 + 0.5
      const cx = w * 0.5, cy = h * 0.5
      const centralGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.6)
      centralGrad.addColorStop(0, `rgba(124,58,237,${0.04 + breathe * 0.03})`)
      centralGrad.addColorStop(0.5, `rgba(6,182,212,${0.02 + breathe * 0.02})`)
      centralGrad.addColorStop(1, 'rgba(5,5,15,0)')
      ctx.fillStyle = centralGrad
      ctx.fillRect(0, 0, w, h)

      // ── Particles
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0
        p.opacity += p.opacityDir * p.opacitySpeed
        if (p.opacity > 0.85 || p.opacity < 0.1) p.opacityDir *= -1

        ctx.save()
        ctx.shadowColor = `hsla(${p.hue}, 80%, 65%, ${p.opacity})`
        ctx.shadowBlur = p.radius * 4
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.opacity})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      // ── Particle connections (web effect)
      ctx.strokeStyle = 'rgba(124,58,237,0.08)'
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 100) {
            ctx.globalAlpha = (1 - dist / 100) * 0.3
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
      ctx.globalAlpha = 1

      // ── Gym equipment silhouettes
      for (const eq of equipment) {
        eq.x += eq.vx; eq.y += eq.vy
        eq.angle += eq.angleSpeed

        // Wrap around screen with padding
        const pad = 120
        if (eq.x < -pad) eq.x = w + pad
        if (eq.x > w + pad) eq.x = -pad
        if (eq.y < -pad) eq.y = h + pad
        if (eq.y > h + pad) eq.y = -pad

        eq.opacity += eq.opacityDir * 0.0003
        if (eq.opacity > 0.18 || eq.opacity < 0.03) eq.opacityDir *= -1

        ctx.shadowBlur = 0
        switch (eq.type) {
          case 'barbell':    drawBarbell(ctx, eq.x, eq.y, eq.angle, eq.scale, eq.opacity); break
          case 'dumbbell':   drawDumbbell(ctx, eq.x, eq.y, eq.angle, eq.scale, eq.opacity); break
          case 'kettlebell': drawKettlebell(ctx, eq.x, eq.y, eq.angle, eq.scale, eq.opacity); break
          case 'ring':       drawRing(ctx, eq.x, eq.y, eq.angle, eq.scale, eq.opacity); break
        }
      }

      // ── Scanlines (cinematic feel)
      scanlineOffset = (scanlineOffset + 0.5) % 4
      for (let y = scanlineOffset; y < h; y += 4) {
        ctx.fillStyle = 'rgba(0,0,0,0.06)'
        ctx.fillRect(0, y, w, 1)
      }

      // ── Vignette edges
      const vignette = ctx.createRadialGradient(cx, cy, h * 0.2, cx, cy, h * 0.9)
      vignette.addColorStop(0, 'rgba(0,0,0,0)')
      vignette.addColorStop(1, 'rgba(0,0,0,0.7)')
      ctx.fillStyle = vignette
      ctx.fillRect(0, 0, w, h)

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        zIndex: 0,
      }}
      aria-hidden="true"
    />
  )
}
