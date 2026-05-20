import { useEffect } from "react"
import { gsap } from "@/lib/gsap"

export interface SkewScrollOptions {
  minSkew?: number
  maxSkew?: number
  multiplier?: number
}

export function useSkewScroll<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  options: SkewScrollOptions = {}
) {
  const { minSkew = -8, maxSkew = 8, multiplier = 0.08 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let lastY = window.scrollY

    const handler = () => {
      const y = window.scrollY
      const v = y - lastY
      lastY = y
      const skew = gsap.utils.clamp(minSkew, maxSkew, v * multiplier)
      gsap.set(el, { skewY: skew })
    }

    window.addEventListener("scroll", handler, { passive: true })

    return () => window.removeEventListener("scroll", handler)
  }, [ref, minSkew, maxSkew, multiplier])
}
