import { useEffect, useRef, useState } from "react"

import { gsap } from "@/lib/gsap"
import { onCursorStateChange, type CursorState } from "./cursor-store"

const CURSOR_SIZE = 22

const VIEW_BOX = `0 0 ${CURSOR_SIZE} ${CURSOR_SIZE}`

const TRIANGLE_PATH = `M ${CURSOR_SIZE / 2} 0 L ${CURSOR_SIZE} ${CURSOR_SIZE} L 0 ${CURSOR_SIZE} Z`

const SQUARE_PATH = `M 0 0 H ${CURSOR_SIZE} V ${CURSOR_SIZE} H 0 Z`

const SPINNER_PATH = `M ${CURSOR_SIZE / 2} 4 A ${CURSOR_SIZE / 2 - 4} ${CURSOR_SIZE / 2 - 4} 0 1 1 4 ${CURSOR_SIZE / 2}`
const TYPE_PATH = `M 7 3 H 15 M 11 3 V 19 M 7 19 H 15`
const GRAB_PATH =
  "M 11 2 L 14 5 H 12.5 V 9.5 H 17 V 8 L 20 11 L 17 14 V 12.5 H 12.5 V 17 H 14 L 11 20 L 8 17 H 9.5 V 12.5 H 5 V 14 L 2 11 L 5 8 V 9.5 H 9.5 V 5 H 8 Z"

export function Cursor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const triangleRef = useRef<SVGPathElement>(null)
  const squareRef = useRef<SVGPathElement>(null)
  const labelElRef = useRef<HTMLSpanElement>(null)
  const spinnerRef = useRef<SVGPathElement>(null)
  const typeRef = useRef<SVGPathElement>(null)
  const grabRef = useRef<SVGPathElement>(null)

  const posRef = useRef({ x: -100, y: -100 })
  const pointerRef = useRef<{ x: number; y: number } | null>(null)
  const rotationRef = useRef(-45)
  const rafRef = useRef(0)
  const spinnerTweenRef = useRef<gsap.core.Tween | null>(null)
  const rotateToRef = useRef<((value: number) => void) | null>(null)

  const [state, setState] = useState<CursorState>("default")
  const [label, setLabel] = useState("")
  const [isTextTarget, setIsTextTarget] = useState(false)
  const textTargetRef = useRef(false)

  useEffect(() => {
    const styleId = "custom-cursor-hide-native-style"
    const hideNative = () => {
      const existing = document.getElementById(styleId)
      if (existing) return

      const style = document.createElement("style")
      style.id = styleId
      style.textContent = `
        *, *::before, *::after {
          cursor: none !important;
        }
      `
      document.head.appendChild(style)
    }
    const showNative = () => {
      document.getElementById(styleId)?.remove()
    }

    hideNative()

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
      const nextIsTextTarget = Boolean(
        target?.closest(
          'input, textarea, [contenteditable=""], [contenteditable="true"]'
        )
      )
      if (nextIsTextTarget !== textTargetRef.current) {
        textTargetRef.current = nextIsTextTarget
        setIsTextTarget(nextIsTextTarget)
      }

      posRef.current.x = e.clientX - CURSOR_SIZE / 2
      posRef.current.y = e.clientY - CURSOR_SIZE / 2

      const prev = pointerRef.current
      pointerRef.current = { x: e.clientX, y: e.clientY }
      if (!prev || !rotateToRef.current) return

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
      showNative()
    }
  }, [])

  useEffect(() => {
    const effectiveState: CursorState = isTextTarget ? "type" : state

    const triangle = triangleRef.current
    const square = squareRef.current
    const labelEl = labelElRef.current
    const spinner = spinnerRef.current
    const typeEl = typeRef.current
    const grabEl = grabRef.current

    if (!triangle || !square || !labelEl || !spinner || !typeEl || !grabEl)
      return

    if (effectiveState === "loading" && spinnerTweenRef.current === null) {
      spinnerTweenRef.current = gsap.to(spinner, {
        rotation: 360,
        duration: 1,
        ease: "none",
        repeat: -1,
      })
    } else if (effectiveState !== "loading" && spinnerTweenRef.current) {
      spinnerTweenRef.current.kill()
      spinnerTweenRef.current = null
      gsap.set(spinner, { rotation: 0 })
    }

    switch (effectiveState) {
      case "default":
        gsap.to(triangle, {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        })
        gsap.to([square, labelEl, spinner, typeEl, grabEl], {
          opacity: 0,
          scale: 0.5,
          duration: 0.15,
          ease: "power2.in",
        })
        break

      case "loading":
        gsap.to(triangle, {
          opacity: 0,
          scale: 0.5,
          duration: 0.15,
          ease: "power2.in",
        })
        gsap.to(square, {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        })
        gsap.to([labelEl, typeEl, grabEl], {
          opacity: 0,
          scale: 0.5,
          duration: 0.15,
          ease: "power2.in",
        })
        gsap.to(spinner, {
          opacity: 1,
          duration: 0.2,
        })
        break

      case "type":
        gsap.to([triangle, square, spinner, labelEl, grabEl], {
          opacity: 0,
          scale: 0.5,
          duration: 0.15,
          ease: "power2.in",
        })
        gsap.to(typeEl, {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        })
        break

      case "grab":
        gsap.to([triangle, spinner, labelEl, typeEl, grabEl], {
          opacity: 0,
          scale: 0.5,
          duration: 0.15,
          ease: "power2.in",
        })
        gsap.to(square, {
          opacity: 1,
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
        })
        break

      case "grabbing":
        gsap.to([triangle, square, spinner, labelEl, typeEl, grabEl], {
          opacity: 0,
          scale: 0.5,
          duration: 0.15,
          ease: "power2.in",
        })
        break

      case "hidden":
        gsap.to([triangle, square, labelEl, spinner, typeEl, grabEl], {
          opacity: 0,
          scale: 0.5,
          duration: 0.15,
          ease: "power2.in",
        })
        break
    }
  }, [isTextTarget, state, label])

  useEffect(() => {
    const cleanup = onCursorStateChange(({ state: s, options }) => {
      setState(s)
      setLabel(options?.label ?? "")
    })
    return cleanup
  }, [])

  useEffect(() => {
    return () => {
      if (spinnerTweenRef.current) {
        spinnerTweenRef.current.kill()
      }
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
          ref={triangleRef}
          d={TRIANGLE_PATH}
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
          ref={squareRef}
          d={SQUARE_PATH}
          fill="#F5F5F5"
          stroke="#141313"
          strokeWidth="1"
          style={{
            opacity: 0,
            transformOrigin: "center",
            transformBox: "fill-box",
            transform: "scale(0.5)",
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

        <path
          ref={typeRef}
          d={TYPE_PATH}
          fill="none"
          stroke="#F5F5F5"
          strokeWidth="1.75"
          strokeLinecap="square"
          style={{
            opacity: 0,
            transformOrigin: "center",
            transformBox: "fill-box",
            transform: "scale(0.5)",
          }}
        />

        <path
          ref={grabRef}
          d={GRAB_PATH}
          fill="#F5F5F5"
          stroke="#141313"
          strokeWidth="1"
          style={{
            opacity: 0,
            transformOrigin: "center",
            transformBox: "fill-box",
            transform: "scale(0.5)",
          }}
        />
      </svg>

      <span
        ref={labelElRef}
        className="label-caps-style absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-on-surface"
        style={{
          opacity: 0,
          transform: "translate(-50%, -50%) scale(0.5)",
          transformOrigin: "center",
        }}
      >
        {label}
      </span>
    </div>
  )
}
