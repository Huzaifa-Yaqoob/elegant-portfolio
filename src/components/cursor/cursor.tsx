import { useEffect, useMemo, useRef, useState } from "react"

import { gsap } from "@/lib/gsap"
import { onCursorStateChange, type CursorState } from "./cursor-store"

const CURSOR_SIZE = 22
const VIEW_BOX = `0 0 ${CURSOR_SIZE} ${CURSOR_SIZE}`

type Point = [number, number]

function poly(points: Point[]) {
  return `M ${points.map(([x, y]) => `${x} ${y}`).join(" L ")} Z`
}

const SHAPES: Record<Exclude<CursorState, "hidden" | "grabbing">, string> = {
  default: poly([
    [11, 0],
    [22, 22],
    [0, 22],
    [0, 22],
    [0, 22],
    [0, 22],
    [0, 22],
    [0, 22],
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
    [1, 1],
    [21, 1],
    [21, 21],
    [1, 21],
    [1, 21],
    [1, 21],
    [1, 21],
    [1, 21],
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
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const shapeRef = useRef<SVGPathElement>(null)
  const spinnerRef = useRef<SVGPathElement>(null)
  const labelElRef = useRef<HTMLSpanElement>(null)

  const posRef = useRef({ x: -100, y: -100 })
  const pointerRef = useRef<{ x: number; y: number } | null>(null)
  const rotationRef = useRef(-45)
  const rafRef = useRef(0)
  const spinnerTweenRef = useRef<gsap.core.Tween | null>(null)
  const rotateToRef = useRef<((value: number) => void) | null>(null)
  const revealPendingRef = useRef(false)
  const effectiveStateRef = useRef<CursorState>("default")

  const [state, setState] = useState<CursorState>("default")
  const [label, setLabel] = useState("")
  const [hoverKind, setHoverKind] = useState<"none" | "text" | "pointer">(
    "none"
  )
  const [revealPending, setRevealPending] = useState(false)

  const autoState = useMemo<CursorState>(() => {
    if (hoverKind === "text") return "type"
    if (hoverKind === "pointer") return "pointer"
    return "default"
  }, [hoverKind])

  useEffect(() => {
    revealPendingRef.current = revealPending
  }, [revealPending])

  useEffect(() => {
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

    if (svgRef.current) {
      gsap.set(svgRef.current, { rotation: rotationRef.current })
      rotateToRef.current = gsap.quickTo(svgRef.current, "rotation", {
        duration: 0.12,
        ease: "power2.out",
      })
    }

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

      if (!prev || !rotateToRef.current || nextHoverKind === "text") {
        if (nextHoverKind === "text") {
          rotationRef.current = 0
          rotateToRef.current?.(0)
        }
        return
      }

      const dx = e.clientX - prev.x
      const dy = e.clientY - prev.y
      if (Math.abs(dx) + Math.abs(dy) < 0.5) return

      const targetAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90
      const nextAngle = shortestRotation(rotationRef.current, targetAngle)
      rotationRef.current = nextAngle
      rotateToRef.current(nextAngle)
    }

    const tick = () => {
      const el = containerRef.current
      if (el) {
        const { x, y } = posRef.current
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    window.addEventListener("mousemove", onMove)
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(rafRef.current)
      rotateToRef.current = null
      document.getElementById(styleId)?.remove()
    }
  }, [])

  useEffect(() => {
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
      gsap.to([shape, spinner, labelEl], {
        opacity: 0,
        scale: 0.5,
        duration: 0.14,
        ease: "power2.in",
      })
      return
    }

    const nextPath = SHAPES[renderState]
    gsap.to(shape, {
      attr: { d: nextPath },
      opacity: 1,
      scale: 1,
      duration: 0.22,
      ease: "power2.out",
    })

    gsap.to(labelEl, {
      opacity: renderState === "type" && label ? 1 : 0,
      scale: renderState === "type" && label ? 1 : 0.6,
      duration: 0.16,
      ease: "power2.out",
    })

    gsap.to(spinner, {
      opacity: renderState === "loading" ? 1 : 0,
      duration: 0.18,
      ease: "power2.out",
    })
  }, [autoState, label, revealPending, state])

  useEffect(() => {
    const cleanup = onCursorStateChange(({ state: s, options }) => {
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
      spinnerTweenRef.current?.kill()
    }
  }, [])

  return (
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
  )
}
