import { useEffect, useMemo, useRef, useState } from "react"

import { gsap } from "@/lib/gsap"
import {
  onCursorReinit,
  onCursorStateChange,
  type CursorState,
} from "./cursor-store"

const CURSOR_SIZE = 22
const VIEW_BOX = `0 0 ${CURSOR_SIZE} ${CURSOR_SIZE}`

type Point = [number, number]

function poly(points: Point[]) {
  return `M ${points.map(([x, y]) => `${x} ${y}`).join(" L ")} Z`
}

const SHAPES: Record<Exclude<CursorState, "hidden" | "grabbing">, string> = {
  default: poly([
    [11, 2.5],
    [18.5, 19.5],
    [3.5, 19.5],
    [3.5, 19.5],
    [3.5, 19.5],
    [3.5, 19.5],
    [3.5, 19.5],
    [3.5, 19.5],
  ]),
  pointer: poly([
    [11, 1],
    [13.5, 8.5],
    [21, 11],
    [13.5, 13.5],
    [11, 21],
    [8.5, 13.5],
    [1, 11],
    [8.5, 8.5],
  ]),
  type: poly([
    [8, 2],
    [14, 2],
    [14, 5],
    [12, 5],
    [12, 17],
    [14, 17],
    [14, 20],
    [8, 20],
  ]),
  grab: poly([
    [4, 4],
    [18, 4],
    [18, 18],
    [4, 18],
    [4, 18],
    [4, 18],
    [4, 18],
    [4, 18],
  ]),
  loading: poly([
    [5, 1],
    [17, 1],
    [21, 5],
    [21, 17],
    [17, 21],
    [5, 21],
    [1, 17],
    [1, 5],
  ]),
}

const SPINNER_PATH = `M ${CURSOR_SIZE / 2} 4 A ${CURSOR_SIZE / 2 - 4} ${CURSOR_SIZE / 2 - 4} 0 1 1 4 ${CURSOR_SIZE / 2}`
const CLICKABLE_SELECTOR =
  'a, button, [role="button"], [data-cursor="pointer"], summary, select, [data-slot="radio-group-item"], .cursor-pointer'

export function Cursor() {
  const log = (...args: unknown[]) => console.log("[cursor.tsx]", ...args)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const shapeRef = useRef<SVGPathElement>(null)
  const spinnerRef = useRef<SVGPathElement>(null)
  const labelElRef = useRef<HTMLSpanElement>(null)

  const posRef = useRef({ x: -100, y: -100 })
  const pointerRef = useRef<{ x: number; y: number } | null>(null)
  const currentRotationRef = useRef(-45)
  const targetRotationRef = useRef(-45)
  const rafRef = useRef(0)
  const spinnerTweenRef = useRef<gsap.core.Tween | null>(null)
  const shapeTweenRef = useRef<gsap.core.Tween | null>(null)
  const labelTweenRef = useRef<gsap.core.Tween | null>(null)
  const spinnerOpacityTweenRef = useRef<gsap.core.Tween | null>(null)
  const revealPendingRef = useRef(false)
  const effectiveStateRef = useRef<CursorState>("default")
  const [initCycle, setInitCycle] = useState(0)

  const [state, setState] = useState<CursorState>("default")
  const [label, setLabel] = useState("")
  const [hoverKind, setHoverKind] = useState<"none" | "text" | "pointer">(
    "none"
  )
  const [revealPending, setRevealPending] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const onPageLoad = () => {
      log("lifecycle event received; re-init cycle +1")
      setInitCycle((prev) => prev + 1)
    }

    log("bind lifecycle listeners")
    document.addEventListener("astro:page-load", onPageLoad)
    const cleanupReinit = onCursorReinit(onPageLoad)

    return () => {
      log("cleanup lifecycle listeners")
      document.removeEventListener("astro:page-load", onPageLoad)
      cleanupReinit()
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)")
    log("visibility effect run", {
      initCycle,
      matches: mq.matches,
      readyState: document.readyState,
    })
    setIsVisible(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsVisible(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [initCycle])

  const autoState = useMemo<CursorState>(() => {
    if (hoverKind === "text") return "type"
    if (hoverKind === "pointer") return "pointer"
    return "default"
  }, [hoverKind])

  useEffect(() => {
    revealPendingRef.current = revealPending
  }, [revealPending])

  useEffect(() => {
    log("pointer/shape setup effect run", { initCycle })
    const styleId = "custom-cursor-hide-native-style"
    const style = document.createElement("style")
    style.id = styleId
    style.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `
    document.head.appendChild(style)

    const shortestRotation = (from: number, to: number) => {
      const delta = ((to - from + 540) % 360) - 180
      return from + delta
    }

    if (svgRef.current) gsap.set(svgRef.current, { rotation: -45 })

    const onMove = (e: MouseEvent) => {
      const target = e.target as Element | null
      const isText = Boolean(
        target?.closest(
          'input, textarea, [contenteditable=""], [contenteditable="true"]'
        )
      )
      const isPointer = !isText && Boolean(target?.closest(CLICKABLE_SELECTOR))
      const nextHoverKind = isText ? "text" : isPointer ? "pointer" : "none"
      setHoverKind((prev) => (prev === nextHoverKind ? prev : nextHoverKind))

      posRef.current.x = e.clientX - CURSOR_SIZE / 2
      posRef.current.y = e.clientY - CURSOR_SIZE / 2
      if (revealPendingRef.current) setRevealPending(false)

      const prev = pointerRef.current
      pointerRef.current = { x: e.clientX, y: e.clientY }

      if (!prev || nextHoverKind === "text") {
        if (nextHoverKind === "text") {
          targetRotationRef.current = 0
        }
        return
      }

      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      if (Math.abs(dx) + Math.abs(dy) < 0.5) return

      const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90
      targetRotationRef.current = shortestRotation(
        currentRotationRef.current,
        targetAngle
      )
    }

    const tick = () => {
      const el = containerRef.current
      if (el) {
        const { x, y } = posRef.current
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }
      if (svgRef.current) {
        const current = currentRotationRef.current
        const target = targetRotationRef.current
        const next = current + (target - current) * 0.14
        currentRotationRef.current = next
        gsap.set(svgRef.current, { rotation: next })
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener("mousemove", onMove)
    rafRef.current = requestAnimationFrame(tick)
    log("mousemove + raf attached")

    return () => {
      log("pointer/shape setup cleanup")
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(rafRef.current)
      document.getElementById(styleId)?.remove()
    }
  }, [initCycle])

  useEffect(() => {
    log("trail canvas effect run", { initCycle })
    const canvas = canvasRef.current
    if (!canvas) {
      log("trail canvas missing")
      return
    }

    const ctx = canvas.getContext("2d")
    if (!ctx) {
      log("2d context missing")
      return
    }

    class Node {
      x = 0
      y = 0
      vx = 0
      vy = 0
    }

    const config = {
      friction: 0.5,
      trails: 20,
      size: 44,
      dampening: 0.25,
      tension: 0.98,
    }

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    type Line = { spring: number; friction: number; nodes: Node[] }
    let lines: Line[] = []
    let huePhase = Math.random() * Math.PI * 2
    let running = true
    let rafId = 0

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const createLines = () => {
      lines = []
      for (let i = 0; i < config.trails; i += 1) {
        const nodes: Node[] = []
        for (let n = 0; n < config.size; n += 1) {
          const node = new Node()
          node.x = pos.x
          node.y = pos.y
          nodes.push(node)
        }
        lines.push({
          spring: 0.42 + (i / config.trails) * 0.03 + Math.random() * 0.03,
          friction: config.friction + Math.random() * 0.02 - 0.01,
          nodes,
        })
      }
    }

    const updateLine = (line: Line) => {
      let spring = line.spring
      let node = line.nodes[0]
      node.vx += (pos.x - node.x) * spring
      node.vy += (pos.y - node.y) * spring

      for (let i = 0; i < line.nodes.length; i += 1) {
        node = line.nodes[i]
        if (i > 0) {
          const prev = line.nodes[i - 1]
          node.vx += (prev.x - node.x) * spring
          node.vy += (prev.y - node.y) * spring
          node.vx += prev.vx * config.dampening
          node.vy += prev.vy * config.dampening
        }
        node.vx *= line.friction
        node.vy *= line.friction
        node.x += node.vx
        node.y += node.vy
        spring *= config.tension
      }
    }

    const drawLine = (line: Line) => {
      let x = line.nodes[0].x
      let y = line.nodes[0].y
      ctx.beginPath()
      ctx.moveTo(x, y)

      for (let i = 1; i < line.nodes.length - 2; i += 1) {
        const current = line.nodes[i]
        const next = line.nodes[i + 1]
        x = (current.x + next.x) * 0.5
        y = (current.y + next.y) * 0.5
        ctx.quadraticCurveTo(current.x, current.y, x, y)
      }

      const current = line.nodes[line.nodes.length - 2]
      const next = line.nodes[line.nodes.length - 1]
      ctx.quadraticCurveTo(current.x, current.y, next.x, next.y)
      ctx.stroke()
      ctx.closePath()
    }

    const render = () => {
      if (!running) return

      ctx.globalCompositeOperation = "source-over"
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = "lighter"

      huePhase += 0.0015
      const hue = Math.round(285 + Math.sin(huePhase) * 12)
      ctx.strokeStyle = `hsla(${hue}, 8%, 82%, 0.12)`
      ctx.lineWidth = 1

      for (let i = 0; i < lines.length; i += 1) {
        updateLine(lines[i])
        drawLine(lines[i])
      }

      rafId = window.requestAnimationFrame(render)
    }

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if ("touches" in e) {
        if (!e.touches[0]) return
        pos.x = e.touches[0].clientX
        pos.y = e.touches[0].clientY
      } else {
        pos.x = e.clientX
        pos.y = e.clientY
      }
    }

    const onFocus = () => {
      if (running) return
      running = true
      render()
    }

    const onBlur = () => {
      running = false
      cancelAnimationFrame(rafId)
    }

    resizeCanvas()
    createLines()
    render()
    log("trail render loop started")

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("orientationchange", resizeCanvas)
    document.addEventListener("mousemove", onPointerMove)
    document.addEventListener("touchmove", onPointerMove, { passive: true })
    window.addEventListener("focus", onFocus)
    window.addEventListener("blur", onBlur)

    return () => {
      log("trail canvas effect cleanup")
      running = false
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("orientationchange", resizeCanvas)
      document.removeEventListener("mousemove", onPointerMove)
      document.removeEventListener("touchmove", onPointerMove)
      window.removeEventListener("focus", onFocus)
      window.removeEventListener("blur", onBlur)
    }
  }, [initCycle])

  useEffect(() => {
    log("cursor state effect", { state, autoState, label, revealPending })
    const effectiveState: CursorState = state === "default" ? autoState : state
    const prevState = effectiveStateRef.current

    if (prevState === "hidden" && effectiveState !== "hidden") {
      if (pointerRef.current) {
        posRef.current.x = pointerRef.current.x - CURSOR_SIZE / 2
        posRef.current.y = pointerRef.current.y - CURSOR_SIZE / 2
        setRevealPending(false)
      } else {
        setRevealPending(true)
      }
    }
    effectiveStateRef.current = effectiveState

    const shape = shapeRef.current
    const spinner = spinnerRef.current
    const labelEl = labelElRef.current
    if (!shape || !spinner || !labelEl) return

    const renderState: CursorState = revealPending ? "hidden" : effectiveState

    if (renderState === "loading" && spinnerTweenRef.current === null) {
      spinnerTweenRef.current = gsap.to(spinner, {
        rotation: 360,
        duration: 1,
        ease: "none",
        repeat: -1,
      })
    } else if (renderState !== "loading" && spinnerTweenRef.current) {
      spinnerTweenRef.current.kill()
      spinnerTweenRef.current = null
      gsap.set(spinner, { rotation: 0 })
    }

    if (renderState === "hidden" || renderState === "grabbing") {
      shapeTweenRef.current?.kill()
      labelTweenRef.current?.kill()
      spinnerOpacityTweenRef.current?.kill()
      gsap.to([shape, spinner, labelEl], {
        opacity: 0,
        scale: 0.5,
        duration: 0.18,
        ease: "power2.inOut",
      })
      return
    }

    const nextPath = SHAPES[renderState]
    shapeTweenRef.current?.kill()
    shapeTweenRef.current = gsap.to(shape, {
      attr: { d: nextPath },
      opacity: 1,
      scale: 1,
      duration: 0.32,
      ease: "power3.inOut",
      overwrite: "auto",
    })

    labelTweenRef.current?.kill()
    labelTweenRef.current = gsap.to(labelEl, {
      opacity: renderState === "type" && label ? 1 : 0,
      scale: renderState === "type" && label ? 1 : 0.6,
      duration: 0.2,
      ease: "power2.inOut",
      overwrite: "auto",
    })

    spinnerOpacityTweenRef.current?.kill()
    spinnerOpacityTweenRef.current = gsap.to(spinner, {
      opacity: renderState === "loading" ? 1 : 0,
      duration: 0.22,
      ease: "power2.inOut",
      overwrite: "auto",
    })
  }, [autoState, label, revealPending, state])

  useEffect(() => {
    log("bind cursor-state-change listener")
    const cleanup = onCursorStateChange(({ state: s, options }) => {
      log("cursor-state-change received", { state: s, options })
      if (typeof options?.x === "number" && typeof options?.y === "number") {
        pointerRef.current = { x: options.x, y: options.y }
        posRef.current.x = options.x - CURSOR_SIZE / 2
        posRef.current.y = options.y - CURSOR_SIZE / 2
      }
      setState(s)
      setLabel(options?.label ?? "")
    })
    return cleanup
  }, [])

  useEffect(() => {
    return () => {
      log("kill GSAP tweens")
      spinnerTweenRef.current?.kill()
      shapeTweenRef.current?.kill()
      labelTweenRef.current?.kill()
      spinnerOpacityTweenRef.current?.kill()
    }
  }, [])

  if (!isVisible) return null

  return (
    <>
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-[9998]"
        aria-hidden="true"
      />
      <div
        ref={containerRef}
        className="pointer-events-none fixed top-0 left-0 z-[9999]"
        style={{
          width: CURSOR_SIZE,
          height: CURSOR_SIZE,
          willChange: "transform",
        }}
      >
        <svg
          ref={svgRef}
          width={CURSOR_SIZE}
          height={CURSOR_SIZE}
          viewBox={VIEW_BOX}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref={shapeRef}
            d={SHAPES.default}
            fill="#F5F5F5"
            stroke="#141313"
            strokeWidth="1"
            style={{
              opacity: 1,
              transformOrigin: "center",
              transformBox: "fill-box",
              transform: "scale(1)",
            }}
          />
          <path
            ref={spinnerRef}
            d={SPINNER_PATH}
            fill="none"
            stroke="#F5F5F5"
            strokeWidth="1.5"
            strokeLinecap="round"
            style={{
              opacity: 0,
              transformOrigin: "center",
              transformBox: "fill-box",
            }}
          />
        </svg>

        <span
          ref={labelElRef}
          className="label-caps-style absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-on-surface"
          style={{
            opacity: 0,
            transform: "translate(-50%, -50%) scale(0.6)",
            transformOrigin: "center",
          }}
        >
          {label}
        </span>
      </div>
    </>
  )
}
