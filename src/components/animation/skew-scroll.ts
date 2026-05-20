import { gsap } from "@/lib/gsap"

export interface SkewScrollOptions {
  minSkew?: number
  maxSkew?: number
  multiplier?: number
}

export function initSkewScroll(
  targets: string | HTMLElement | HTMLElement[] | NodeListOf<HTMLElement>,
  options: SkewScrollOptions = {}
): () => void {
  const { minSkew = -8, maxSkew = 8, multiplier = 0.08 } = options
  const elements = gsap.utils.toArray<HTMLElement>(targets)
  if (!elements.length) return () => {}

  let lastY = window.scrollY

  const handler = () => {
    const y = window.scrollY
    const v = y - lastY
    lastY = y
    const skew = gsap.utils.clamp(minSkew, maxSkew, v * multiplier)
    gsap.set(elements, { skewY: skew })
  }

  window.addEventListener("scroll", handler, { passive: true })

  return () => window.removeEventListener("scroll", handler)
}
