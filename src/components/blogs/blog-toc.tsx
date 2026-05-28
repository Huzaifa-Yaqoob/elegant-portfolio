import { useRef, useEffect } from "react"
import { gsap } from "@/lib/gsap"

interface TocItem {
  depth: number
  slug: string
  text: string
}

interface BlogTocProps {
  headings: TocItem[]
  contentSelector?: string
}

export default function BlogToc({
  headings,
  contentSelector = "#blog-content-wrapper",
}: BlogTocProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const lineRef = useRef<SVGPathElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filtered = headings.filter((h) => h.depth >= 2 && h.depth <= 3)

  useEffect(() => {
    if (filtered.length === 0) return

    const svg = svgRef.current
    const line = lineRef.current
    const list = listRef.current
    if (!svg || !line || !list) return

    const items = [...list.querySelectorAll<HTMLLIElement>("li")]
    if (items.length === 0) return

    const positions = items.map((item, i) => ({
      y: item.offsetTop + item.offsetHeight / 2,
      depth: filtered[i].depth,
    }))

    const svgH = svg.clientHeight || list.scrollHeight
    const lx = 8

    line.setAttribute("d", `M ${lx},0 V ${svgH}`)
    const totalLen = svgH

    svg.querySelectorAll(".toc-dot, .toc-branch").forEach((el) => el.remove())

    const dots: SVGCircleElement[] = []
    const branches: SVGPathElement[] = []

    positions.forEach(({ y, depth }) => {
      const bl = depth === 2 ? 14 : 10

      const dot = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      )
      dot.classList.add("toc-dot")
      dot.setAttribute("cx", `${lx}`)
      dot.setAttribute("cy", `${y}`)
      dot.setAttribute("r", "3")
      dot.setAttribute("fill", "var(--outline-variant)")
      dot.setAttribute("stroke", "none")
      svg.appendChild(dot)
      dots.push(dot)

      const branch = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      )
      branch.classList.add("toc-branch")
      branch.setAttribute("d", `M ${lx},${y} L ${lx + bl},${y}`)
      branch.setAttribute("stroke", "var(--outline-variant)")
      branch.setAttribute("stroke-width", "2")
      branch.setAttribute("stroke-linecap", "round")
      branch.setAttribute("fill", "none")
      svg.appendChild(branch)
      branches.push(branch)
    })

    gsap.set(line, { strokeDasharray: totalLen, strokeDashoffset: totalLen })

    const updateActive = (idx: number) => {
      dots.forEach((dot, i) => {
        dot.setAttribute(
          "fill",
          i <= idx ? "var(--on-surface)" : "var(--outline-variant)"
        )
      })
      branches.forEach((branch, i) => {
        branch.setAttribute(
          "stroke",
          i <= idx ? "var(--on-surface)" : "var(--outline-variant)"
        )
      })
      items.forEach((li, i) => {
        const a = li.querySelector("a")
        if (!a) return
        if (i === idx) {
          a.style.color = "var(--on-surface)"
          a.style.fontWeight = "600"
        } else {
          a.style.color = "var(--on-surface-variant)"
          a.style.fontWeight = "400"
        }
      })
    }

    const mainTL = gsap.timeline({
      scrollTrigger: {
        trigger: contentSelector,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    })
    mainTL.to(line, { strokeDashoffset: 0, ease: "none" }, 0)

    let activeIdx = -1
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = filtered.findIndex((h) => h.slug === entry.target.id)
            if (idx >= 0 && idx !== activeIdx) {
              activeIdx = idx
              updateActive(idx)
            }
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

    const initTimer = setTimeout(() => {
      if (activeIdx === -1) {
        activeIdx = 0
        updateActive(0)
      }
    }, 100)

    return () => {
      clearTimeout(initTimer)
      observer.disconnect()
      mainTL.kill()
    }
  }, [filtered, contentSelector])

  const scrollTo = (slug: string) => {
    const el = document.getElementById(slug)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  if (filtered.length === 0) return null

  return (
    <div className="flex w-full gap-0">
      <svg
        ref={svgRef}
        className="w-8 shrink-0"
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        <path
          ref={lineRef}
          stroke="var(--outline-variant)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <ul ref={listRef} className="min-w-0 flex-1 space-y-2.5">
        {filtered.map((h) => (
          <li key={h.slug} className={h.depth === 3 ? "pl-5" : ""}>
            <a
              href={`#${h.slug}`}
              onClick={(e) => {
                e.preventDefault()
                scrollTo(h.slug)
              }}
              className="block text-sm leading-snug text-on-surface-variant no-underline transition-colors duration-200 hover:text-on-surface"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
