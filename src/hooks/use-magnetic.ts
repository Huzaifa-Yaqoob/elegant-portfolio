import { useEffect, useRef, useState } from "react"

interface UseMagneticProps {
  enabled?: boolean
  strength?: number
  distance?: number
}

export function useMagnetic({
  enabled = false,
  strength = 0.35,
  distance = 100,
}: UseMagneticProps = {}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (!enabled || !ref.current) return

    const element = ref.current

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

      if (dist < distance) {
        const factor = (1 - dist / distance) * strength
        const moveX = deltaX * factor
        const moveY = deltaY * factor

        element.style.transform = `translate(${moveX}px, ${moveY}px)`
        setIsHovering(true)
      } else if (isHovering) {
        element.style.transform = "translate(0px, 0px)"
        setIsHovering(false)
      }
    }

    const handleMouseLeave = () => {
      element.style.transform = "translate(0px, 0px)"
      setIsHovering(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    element.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      element.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [enabled, strength, distance, isHovering])

  return { ref }
}
