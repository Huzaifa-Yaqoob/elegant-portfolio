import { useEffect, useRef, useState } from "react"
import { List } from "lucide-react"
import { Drawer, DrawerContent } from "@/components/ui/drawer"

interface TocItem {
  depth: number
  slug: string
  text: string
}

interface BlogTocFabProps {
  headings: TocItem[]
}

export default function BlogTocFab({ headings }: BlogTocFabProps) {
  const [activeId, setActiveId] = useState("")
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const filtered = headings.filter((h) => h.depth >= 2 && h.depth <= 3)

  useEffect(() => {
    if (filtered.length === 0) return

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

    return () => observer.disconnect()
  }, [filtered])

  const scrollTo = (slug: string) => {
    const el = document.getElementById(slug)
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90
      window.scrollTo({ top: y, behavior: "smooth" })
    }
    setOpen(false)
  }

  if (filtered.length === 0) return null

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center border border-surface-variant bg-surface-container-low text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface xl:hidden"
        aria-label="Open table of contents"
      >
        <List size={20} />
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent
          className="border-surface-variant bg-background"
          style={{ maxHeight: "50vh" }}
        >
          <div className="flex flex-col px-8 py-8">
            <h4 className="label-caps-style mb-6 tracking-wider text-outline">
              On this page
            </h4>
            <nav className="flex flex-col gap-4">
              {filtered.map((h) => (
                <button
                  key={h.slug}
                  onClick={() => scrollTo(h.slug)}
                  className={`flex items-center gap-3 text-left label-data-style transition-colors ${
                    h.slug === activeId
                      ? "font-medium text-on-surface"
                      : "text-on-surface-variant hover:text-on-surface"
                  } ${h.depth === 3 ? "pl-6" : ""}`}
                >
                  <span
                    className={`block h-1.5 w-1.5 shrink-0 ${
                      h.slug === activeId
                        ? "bg-on-surface"
                        : "bg-outline-variant"
                    }`}
                  />
                  {h.text}
                </button>
              ))}
            </nav>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
