"use client"

import { useRef, useEffect } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import { useCursor } from "@/components/cursor/useCursor.ts"

function CustomCursor() {
  const { variant, cursorText } = useCursor()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lines = useRef<any[]>([])
  const cursorRef = useRef<HTMLAnchorElement>(null)
  const particlesRef = useRef<HTMLDivElement>(null)
  
  // Persistent physics state to prevent "jumps" on re-renders
  const mouse = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const variantRef = useRef(variant)

  // Keep the variant ref up to date without re-running the main GSAP effect
  useEffect(() => {
    variantRef.current = variant
  }, [variant])

  useGSAP(() => {
    // 1. Create highly optimized setters
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const xSetter = gsap.quickSetter(cursorRef.current, "x", "px")
    const ySetter = gsap.quickSetter(cursorRef.current, "y", "px")
    const rSetter = gsap.quickSetter(cursorRef.current, "rotation", "deg")

    // Physics Configuration
    const E = {
      friction: 0.5,
      trails: 20,
      size: 50,
      dampening: 0.25,
      tension: 0.98,
    }

    class Node {
      x = 0
      y = 0
      vx = 0
      vy = 0
    }

    class Line {
      spring: number
      friction: number
      nodes: Node[]

      constructor(config: { spring: number }) {
        this.spring = config.spring + 0.1 * Math.random() - 0.02
        this.friction = E.friction + 0.01 * Math.random() - 0.002
        this.nodes = Array.from({ length: E.size }, () => new Node())
      }

      update(targetX: number, targetY: number) {
        let e = this.spring
        const t = this.nodes[0]
        t.vx += (targetX - t.x) * e
        t.vy += (targetY - t.y) * e

        for (let i = 0; i < this.nodes.length; i++) {
          const node = this.nodes[i]
          if (i > 0) {
            const prev = this.nodes[i - 1]
            node.vx += (prev.x - node.x) * e
            node.vy += (prev.y - node.y) * e
            node.vx += prev.vx * E.dampening
            node.vy += prev.vy * E.dampening
          }
          node.vx *= this.friction
          node.vy *= this.friction
          node.x += node.vx
          node.y += node.vy
          e *= E.tension
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.moveTo(this.nodes[0].x, this.nodes[0].y)
        for (let i = 1; i < this.nodes.length - 2; i++) {
          const a = this.nodes[i]
          const b = this.nodes[i + 1]
          const midX = 0.5 * (a.x + b.x)
          const midY = 0.5 * (a.y + b.y)
          ctx.quadraticCurveTo(a.x, a.y, midX, midY)
        }
        const lastA = this.nodes[this.nodes.length - 2]
        const lastB = this.nodes[this.nodes.length - 1]
        ctx.quadraticCurveTo(lastA.x, lastA.y, lastB.x, lastB.y)
        ctx.stroke()
      }
    }

    // 2. Add smoothing (The "Physics" part)
    // We use a proxy object to 'lerp' (interpolate) the values
    const prevMouse = { x: 0, y: 0 } // To calculate actual mouse velocity

    // 3. Fix Canvas Resolution
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize lines
    lines.current = Array.from(
      { length: E.trails },
      (_, i) => new Line({ spring: 0.4 + (i / E.trails) * 0.025 })
    )

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const updateTicker = () => {
      if (!ctx || !canvas) return

      const dt = 0.1
      const dx = mouse.current.x - pos.current.x
      const dy = mouse.current.y - pos.current.y
      const speed = Math.sqrt(dx * dx + dy * dy)

      // Calculate actual mouse velocity for more realistic smoke
      const mouseVelX = mouse.current.x - prevMouse.x
      const mouseVelY = mouse.current.y - prevMouse.y
      prevMouse.x = mouse.current.x
      prevMouse.y = mouse.current.y

      pos.current.x += dx * dt
      pos.current.y += dy * dt

      if (variantRef.current !== 'hidden') {
        xSetter(pos.current.x)
        ySetter(pos.current.y)
      }

      // 0. Update Plane Rotation to face movement direction
      if (speed > 0.5) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI)
        // Only rotate the '>' icon, not the I-beam '|' or text
        if (variantRef.current === 'default' || variantRef.current === 'button') rSetter(angle)
        else rSetter(0)
      }

      // Calculate tail position for the trail start
      const tailOffsetX = speed > 0 ? (dx / speed) * 12 : 0
      const tailOffsetY = speed > 0 ? (dy / speed) * 12 : 0
      const targetX = pos.current.x - tailOffsetX
      const targetY = pos.current.y - tailOffsetY

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = variantRef.current === 'hidden' ? "transparent" : "rgba(210, 215, 220, 0.12)"
      ctx.lineWidth = 1.2

      lines.current.forEach((line) => {
        line.update(targetX, targetY)
        line.draw(ctx)
      })
    }

    // 4. The Ticker (The heart of the physics)
    gsap.ticker.add(updateTicker)

    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", resizeCanvas)
      gsap.ticker.remove(updateTicker)
    }
  }, []) // Never re-run the physics loop setup

  // Handle the "Form" variant character release
  useEffect(() => {
    if (variant !== "form") return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.length !== 1) return // Only handle printable characters

      const particle = document.createElement("span")
      particle.innerText = e.key
      particle.className = "fixed pointer-events-none font-mono text-primary z-[9999] opacity-80"
      particle.style.left = `${cursorRef.current?.getBoundingClientRect().left}px`
      particle.style.top = `${cursorRef.current?.getBoundingClientRect().top}px`
      
      particlesRef.current?.appendChild(particle)

      gsap.to(particle, {
        y: -100 - Math.random() * 50,
        x: (Math.random() - 0.5) * 50,
        rotation: (Math.random() - 0.5) * 45,
        opacity: 0,
        duration: 1.5,
        ease: "power2.out",
        onComplete: () => particle.remove()
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [variant])

  useGSAP(() => {
    const tl = gsap.timeline({ overwrite: "auto", ease: "power2.out" })

    if (variant === "button") {
      tl.to(cursorRef.current, {
        scale: 2,
      })
    } else {
      tl.to(cursorRef.current, {
        scale: 1,
      })
    }

    if (variant === "hidden") {
      gsap.to([cursorRef.current, canvasRef.current], { opacity: 0, duration: 0.2 })
    } else {
      gsap.to([cursorRef.current, canvasRef.current], { opacity: 1, duration: 0.2 })
    }
  }, [variant])

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9998] bg-transparent mix-blend-difference"
      />
      <div ref={particlesRef} className="pointer-events-none fixed inset-0 z-[10000]" />
      <a
        href="#"
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999] flex -translate-x-1/2 -translate-y-1/2 items-center justify-center font-heading text-lg font-bold text-white mix-blend-difference whitespace-nowrap"
      >
        {variant === "form" ? (
          <span className="text-2xl font-light">|</span>
        ) : variant === "text" ? (
          <div className="flex flex-col items-center">
             <span className="mb-8 text-xs uppercase tracking-widest bg-white text-black px-2 py-1">
              {cursorText}
            </span>
            <span>&gt;</span>
          </div>
        ) : (
          <span>&gt;</span>
        )}
      </a>
    </>
  )
}

export default CustomCursor
