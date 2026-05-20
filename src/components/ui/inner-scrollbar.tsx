import { useEffect, useRef, useState, useCallback } from "react"

interface InnerScrollbarProps {
  targetRef: React.RefObject<HTMLTextAreaElement | null>
  position?: "left" | "right"
}

export function InnerScrollbar({
  targetRef,
  position = "right",
}: InnerScrollbarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isDraggingRef = useRef(false)
  const startYRef = useRef(0)
  const startScrollTopRef = useRef(0)

  const show = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    setVisible(true)
  }, [])

  const hide = useCallback(() => {
    setVisible(false)
  }, [])

  const resetTimer = useCallback(() => {
    hideTimerRef.current = setTimeout(hide, 1500)
  }, [hide])

  const updateThumb = useCallback(() => {
    const target = targetRef.current
    const container = containerRef.current
    const thumb = thumbRef.current
    if (!target || !container || !thumb) return

    const trackH = target.offsetHeight
    const totalH = target.scrollHeight
    const viewportH = target.clientHeight

    if (totalH <= viewportH) {
      container.style.display = "none"
      return
    }

    container.style.display = "block"
    container.style.top = `${target.offsetTop}px`
    container.style.height = `${trackH}px`

    const thumbH = Math.max(24, trackH * (viewportH / totalH))
    const scrollable = totalH - viewportH
    const available = trackH - thumbH
    const thumbT = (target.scrollTop / scrollable) * available

    thumb.style.height = `${thumbH}px`
    thumb.style.top = `${thumbT}px`
  }, [targetRef])

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    updateThumb()
    resetTimer()

    const onScroll = () => {
      updateThumb()
      show()
      resetTimer()
    }

    target.addEventListener("scroll", onScroll)

    const ro = new ResizeObserver(updateThumb)
    ro.observe(target)

    return () => {
      target.removeEventListener("scroll", onScroll)
      ro.disconnect()
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [targetRef, updateThumb, show, resetTimer])

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const onPointerEnter = () => {
      show()
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
      setExpanded(true)
    }

    const onPointerLeave = () => {
      if (!isDraggingRef.current) resetTimer()
      setExpanded(false)
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("pointerenter", onPointerEnter)
      container.addEventListener("pointerleave", onPointerLeave)
    }

    return () => {
      if (container) {
        container.removeEventListener("pointerenter", onPointerEnter)
        container.removeEventListener("pointerleave", onPointerLeave)
      }
    }
  }, [targetRef, show, resetTimer])

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const thumb = thumbRef.current
    if (!thumb) return

    const onPointerDown = (e: PointerEvent) => {
      isDraggingRef.current = true
      startYRef.current = e.clientY
      startScrollTopRef.current = target.scrollTop
      thumb.style.cursor = "grabbing"
      document.body.style.userSelect = "none"
      e.preventDefault()
    }

    thumb.addEventListener("pointerdown", onPointerDown)

    return () => {
      thumb.removeEventListener("pointerdown", onPointerDown)
    }
  }, [targetRef])

  useEffect(() => {
    const target = targetRef.current
    if (!target) return

    const onPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return
      const deltaY = e.clientY - startYRef.current
      const thumb = thumbRef.current
      if (!thumb) return

      const trackH = target.offsetHeight
      const thumbH = thumb.offsetHeight
      const scrollable = target.scrollHeight - target.clientHeight
      const available = trackH - thumbH
      if (available <= 0) return

      const ratio = deltaY / available
      target.scrollTop = startScrollTopRef.current + ratio * scrollable
    }

    const onPointerUp = () => {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      const thumb = thumbRef.current
      if (thumb) thumb.style.cursor = "grab"
      document.body.style.userSelect = ""
    }

    document.addEventListener("pointermove", onPointerMove)
    document.addEventListener("pointerup", onPointerUp)

    return () => {
      document.removeEventListener("pointermove", onPointerMove)
      document.removeEventListener("pointerup", onPointerUp)
    }
  }, [targetRef])

  const thumbWidth = expanded ? 8 : 4

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        [position]: 0,
        height: "100%",
        width: "12px",
        zIndex: 10,
        pointerEvents: "none",
        transition: "opacity 200ms",
        opacity: visible ? 1 : 0,
      }}
    >
      <div
        ref={thumbRef}
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(196, 199, 199, 0.6)",
          width: `${thumbWidth}px`,
          cursor: "grab",
          transition: "all 200ms ease-out",
          pointerEvents: "auto",
        }}
      />
    </div>
  )
}
