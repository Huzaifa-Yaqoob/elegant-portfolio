import { useEffect } from "react"
import { gsap } from "@/lib/gsap"
import { ScrollSmoother } from "gsap/ScrollSmoother"

export interface SkewScrollOptions {
  minSkew?: number
  maxSkew?: number
  multiplier?: number
}

function getScrollPos(): number {
  const s = ScrollSmoother.get()
  return s ? s.scrollTop() : window.scrollY
}

export function useSkewScroll<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  options: SkewScrollOptions = {}
) {
  const { minSkew = -8, maxSkew = 8, multiplier = 0.08 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let lastPos = getScrollPos()

    const tick = () => {
      const pos = getScrollPos()
      const v = pos - lastPos
      lastPos = pos

      if (Math.abs(v) > 0.5) {
        const skew = gsap.utils.clamp(minSkew, maxSkew, v * multiplier)
        gsap.set(el, { skewY: skew })
      } else {
        gsap.set(el, { skewY: 0 })
      }
    }

    gsap.ticker.add(tick)

    return () => gsap.ticker.remove(tick)
  }, [ref, minSkew, maxSkew, multiplier])
}
