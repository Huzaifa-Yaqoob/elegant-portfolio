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

export function initSkewScroll(
  targets: string | HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
  options: SkewScrollOptions = {}
): () => void {
  const { minSkew = -8, maxSkew = 8, multiplier = 0.08 } = options
  const elements = gsap.utils.toArray<HTMLElement>(targets)
  if (!elements.length) return () => {}

  let lastPos = getScrollPos()

  const tick = () => {
    const pos = getScrollPos()
    const v = pos - lastPos
    lastPos = pos

    const skew = gsap.utils.clamp(minSkew, maxSkew, v * multiplier)
    gsap.to(elements, {
      skewY: skew,
      duration: 0.4,
      ease: "power3.out",
      overwrite: "auto",
    })
  }

  gsap.ticker.add(tick)

  return () => gsap.ticker.remove(tick)
}
