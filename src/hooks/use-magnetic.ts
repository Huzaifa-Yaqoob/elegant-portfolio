import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"

interface UseMagneticProps {
  enabled?: boolean
  /** Maximum displacement in pixels (default: 20) */
  maxDisplacement?: number
  /** Activation radius in pixels from element center (default: 75) */
  distance?: number
  /** Tween duration for mouse move in seconds (default: 0.25) */
  duration?: number
}

export function useMagnetic<T extends HTMLElement = HTMLButtonElement>({
  enabled = false,
  maxDisplacement = 20,
  distance = 75,
  duration = 0.25,
}: UseMagneticProps = {}) {
  const ref = useRef<T>(null)
  const rectRef = useRef<DOMRect | null>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return

    const element = ref.current
    if (!element) return

    const updateRect = () => {
      rectRef.current = element.getBoundingClientRect()
    }

    const handleMouseEnter = () => {
      updateRect()
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!rectRef.current) return

      const { left, top, width, height } = rectRef.current
      const centerX = left + width / 2
      const centerY = top + height / 2

      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      const dist = Math.hypot(deltaX, deltaY)

      if (dist < distance) {
        const normalizedDist = dist / distance
        const attenuation = Math.pow(1 - normalizedDist, 2.5)
        const moveX = deltaX * attenuation * (maxDisplacement / distance)
        const moveY = deltaY * attenuation * (maxDisplacement / distance)

        if (tweenRef.current) {
          tweenRef.current.kill()
        }

        tweenRef.current = gsap.to(element, {
          x: moveX,
          y: moveY,
          duration,
          ease: "expo.out",
          overwrite: true,
        })
      }
    }

    const handleMouseLeave = () => {
      if (tweenRef.current) {
        tweenRef.current.kill()
      }

      tweenRef.current = gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: "elastic.out(1, 0.75)",
        overwrite: true,
      })

      rectRef.current = null
    }

    element.addEventListener("mouseenter", handleMouseEnter)
    element.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      element.removeEventListener("mouseenter", handleMouseEnter)
      element.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("mouseleave", handleMouseLeave)

      if (tweenRef.current) {
        tweenRef.current.kill()
      }
    }
  }, [enabled, maxDisplacement, distance, duration])

  return { ref }
}
