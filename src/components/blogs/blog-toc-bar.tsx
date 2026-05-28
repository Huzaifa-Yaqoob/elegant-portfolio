import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { ChevronDown } from "lucide-react"
import { gsap } from "@/lib/gsap"

interface TocItem {
  depth: number
  slug: string
  text: string
}

interface BlogTocBarProps {
  headings: TocItem[]
}

export default function BlogTocBar({ headings }: BlogTocBarProps) {
  const [activeId, setActiveId] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const spacerRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filtered = headings.filter((h) => h.depth >= 2 && h.depth <= 3)

  useEffect(() => {
    if (filtered.length === 0) return

    const spacer = spacerRef.current
    const bar = barRef.current
    if (!spacer || !bar) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: "-100px 0px -60% 0px" }
    )

    filtered.forEach((h) => {
      const el = document.getElementById(h.slug)
      if (el) observer.observe(el)
    })

    const wrapper = document.querySelector("#blog-content-wrapper")
    if (!wrapper) {
      return () => observer.disconnect()
    }

    bar.style.opacity = "0"
    bar.style.pointerEvents = "none"

    const state = { y: 0, o: 0 }

    const updateBar = () => {
      bar.style.transform = `translateY(${state.y}px)`
      bar.style.opacity = `${state.o}`
      bar.style.pointerEvents = state.o > 0.5 ? "auto" : "none"
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: spacer,
        start: "top bottom",
        end: "top 48px",
        scrub: 1.5,
      },
      onUpdate: updateBar,
    })

    const spacerRect = spacer.getBoundingClientRect()
    const initY = Math.max(spacerRect.top - 48, 0)

    state.y = initY
    state.o = 0

    tl.fromTo(state, { y: initY, o: 0 }, { y: 0, o: 1, ease: "power1.out" }, 0)

    const endTl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "bottom bottom+=120",
        end: "bottom bottom",
        scrub: 1,
      },
      onUpdate: updateBar,
    })

    endTl.to(state, { o: 0, ease: "power1.in" }, 0)

    return () => {
      observer.disconnect()
      tl.kill()
      endTl.kill()
    }
  }, [filtered])

  const activeHeading = filtered.find((h) => h.slug === activeId)
  const displayText = activeHeading?.text || filtered[0]?.text || "On this page"

  const scrollTo = (slug: string) => {
    const el = document.getElementById(slug)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90
      window.scrollTo({ top: y, behavior: "smooth" })
    }
    setIsOpen(false)
  }

  const toggleOpen = () => {
    const el = dropdownRef.current
    if (!el) return

    if (isOpen) {
      gsap.to(el, {
        maxHeight: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power2.inOut",
        onComplete: () => setIsOpen(false),
      })
    } else {
      setIsOpen(true)
      requestAnimationFrame(() => {
        if (el) {
          gsap.fromTo(
            el,
            { maxHeight: 0, opacity: 0 },
            {
              maxHeight: el.scrollHeight,
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
            }
          )
        }
      })
    }
  }

  if (filtered.length === 0) return null

  const bar = (
    <div
      ref={barRef}
      className="fixed right-0 left-0 z-40 xl:hidden"
      style={{ top: "48px", willChange: "transform, opacity" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <button
          onClick={toggleOpen}
          className="flex w-full items-center justify-between border border-surface-variant bg-surface-container-low px-4 py-3"
        >
          <span className="text-sm text-on-surface-variant">{displayText}</span>
          <ChevronDown
            size={16}
            className={`text-outline transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          ref={dropdownRef}
          className="overflow-hidden border-x border-b border-surface-variant bg-surface-container-low"
          style={{ maxHeight: 0, opacity: 0 }}
        >
          {filtered.map((h) => (
            <button
              key={h.slug}
              onClick={() => scrollTo(h.slug)}
              className={`flex w-full items-center gap-3 border-b border-surface-variant px-4 py-2.5 text-left text-sm transition-colors last:border-b-0 hover:bg-surface-container ${
                h.slug === activeId
                  ? "font-medium text-on-surface"
                  : "text-on-surface-variant"
              } ${h.depth === 3 ? "pl-8" : ""}`}
            >
              <span
                className={`block h-1.5 w-1.5 shrink-0 ${
                  h.slug === activeId ? "bg-on-surface" : "bg-outline-variant"
                }`}
              />
              {h.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div ref={spacerRef} className="h-[52px] xl:hidden" />
      {createPortal(bar, document.body)}
    </>
  )
}
