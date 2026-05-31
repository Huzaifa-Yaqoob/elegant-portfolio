import { useState, useMemo, useRef } from "react"
import { useGSAP } from "@gsap/react"
import { gsap } from "@/lib/gsap"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export interface BlogListItem {
  title: string
  description: string
  slug: string
  date: string
  tags: string[]
  category: string | undefined
  readingTime: string | undefined
  coverImage: string | undefined
  coverAlt: string | undefined
  featured: boolean
}

interface BlogListProps {
  blogs: BlogListItem[]
  perPage: number
  placeholderImageUrl?: string
}

type SortField = "date" | "title"
type SortDir = "asc" | "desc"

export default function BlogList({
  blogs,
  perPage,
  placeholderImageUrl = "/blogs/placeholder.png",
}: BlogListProps) {
  const [search, setSearch] = useState("")
  const [activeTags, setActiveTags] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [page, setPage] = useState(1)

  const gridRef = useRef<HTMLDivElement>(null)

  const allTags = useMemo(() => {
    const set = new Set<string>()
    blogs.forEach((b) => b.tags.forEach((t) => set.add(t)))
    return Array.from(set).sort()
  }, [blogs])

  const allCategories = useMemo(() => {
    const set = new Set<string>()
    blogs.forEach((b) => {
      if (b.category) set.add(b.category)
    })
    return Array.from(set).sort()
  }, [blogs])

  const filtered = useMemo(() => {
    let result = [...blogs]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    if (activeTags.length > 0) {
      result = result.filter((b) => activeTags.every((t) => b.tags.includes(t)))
    }

    if (activeCategory) {
      result = result.filter((b) => b.category === activeCategory)
    }

    result.sort((a, b) => {
      let cmp: number
      if (sortField === "date") {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime()
      } else {
        cmp = a.title.localeCompare(b.title)
      }
      return sortDir === "asc" ? cmp : -cmp
    })

    return result
  }, [blogs, search, activeTags, activeCategory, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * perPage, safePage * perPage)

  useGSAP(
    () => {
      if (!gridRef.current) return

      gsap.fromTo(
        gridRef.current.children,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        }
      )
    },
    { dependencies: [paginated], scope: gridRef }
  )

  function toggleTag(tag: string) {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  function toggleSortDir() {
    setSortDir((d) => (d === "asc" ? "desc" : "asc"))
  }

  function setSort(field: SortField) {
    if (sortField === field) {
      toggleSortDir()
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 space-y-4 border-b border-surface-variant pb-6 sm:mb-12 sm:space-y-6 sm:pb-8">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Search articles..."
            className="w-full border-b-2 border-surface-variant bg-transparent pr-10 pb-2 body-lg-style text-on-surface transition-colors outline-none placeholder:text-outline/50 focus:border-on-surface"
          />
          <span className="absolute right-0 bottom-2 text-outline">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {allTags.map((tag) => {
              const isActive = activeTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => {
                    toggleTag(tag)
                    setPage(1)
                  }}
                  className={`label-caps-style border px-3 py-1.5 transition-colors ${
                    isActive
                      ? "border-on-surface bg-on-surface text-background"
                      : "border-surface-variant text-outline hover:border-outline hover:text-on-surface"
                  }`}
                >
                  {tag}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="label-caps-style hidden text-outline sm:inline">
              Category
            </span>
            <Select
              value={activeCategory}
              onValueChange={(value: string | null) => {
                setActiveCategory(value ?? "")
                setPage(1)
              }}
            >
              <SelectTrigger className="min-w-[120px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 sm:gap-3">
            <span className="label-caps-style hidden text-outline sm:inline">
              Sort by
            </span>
            <button
              onClick={() => setSort("date")}
              className={`label-caps-style border px-3 py-1.5 transition-colors ${
                sortField === "date"
                  ? "border-on-surface bg-on-surface text-background"
                  : "border-surface-variant text-outline hover:border-outline hover:text-on-surface"
              }`}
            >
              Date
            </button>
            <button
              onClick={() => setSort("title")}
              className={`label-caps-style border px-3 py-1.5 transition-colors ${
                sortField === "title"
                  ? "border-on-surface bg-on-surface text-background"
                  : "border-surface-variant text-outline hover:border-outline hover:text-on-surface"
              }`}
            >
              Title
            </button>
            <button
              onClick={toggleSortDir}
              className="label-caps-style inline-flex items-center gap-1 border border-surface-variant px-3 py-1.5 text-outline transition-colors hover:border-outline hover:text-on-surface"
              aria-label={`Sort ${sortDir === "asc" ? "descending" : "ascending"}`}
            >
              <span>{sortDir === "asc" ? "Asc" : "Desc"}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-transform ${sortDir === "asc" ? "rotate-180" : ""}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
          </div>

          <span className="label-data-style text-outline">
            {filtered.length} {filtered.length === 1 ? "article" : "articles"}
          </span>
        </div>
      </div>

      {paginated.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24">
          <span className="font-heading text-6xl font-black tracking-tighter text-surface-variant/30">
            00
          </span>
          <p className="mt-4 body-lg-style text-on-surface-variant">
            No articles match your criteria.
          </p>
          <button
            onClick={() => {
              setSearch("")
              setActiveTags([])
              setActiveCategory("")
              setSortField("date")
              setSortDir("desc")
              setPage(1)
            }}
            className="label-caps-style mt-6 border border-on-surface px-6 py-2 text-on-surface transition-colors hover:bg-on-surface hover:text-background"
          >
            Clear All Filters
          </button>
        </div>
      )}

      <div ref={gridRef} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {paginated.map((blog) => (
          <a
            key={blog.slug}
            href={`/blogs/${blog.slug}`}
            className="blog-card group flex flex-col border border-surface-variant bg-background transition-colors duration-500 hover:bg-card-hover"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-surface-variant bg-surface-container-low">
              <img
                src={blog.coverImage ?? placeholderImageUrl}
                alt={blog.coverAlt ?? blog.title}
                className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget
                  if (target.src !== placeholderImageUrl) {
                    target.src = placeholderImageUrl
                  }
                }}
              />
              {blog.featured && (
                <div className="absolute top-4 left-4 border border-outline bg-surface/85 px-3 py-1 backdrop-blur">
                  <span className="label-caps-style text-on-surface">
                    Featured
                  </span>
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col p-5 md:p-6">
              <div className="mb-3 flex items-center gap-3 text-outline">
                <span className="label-data-style">
                  {new Date(blog.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                {blog.readingTime && (
                  <>
                    <span className="text-outline-variant">/</span>
                    <span className="label-data-style">{blog.readingTime}</span>
                  </>
                )}
              </div>

              <h3 className="mb-3 h3-style text-on-surface uppercase transition-colors group-hover:text-primary">
                {blog.title}
              </h3>

              <p className="mb-6 line-clamp-3 body-sm-style text-on-surface-variant">
                {blog.description}
              </p>

              {blog.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {blog.tags.slice(0, 3).map((tag) => (
                    <span className="label-caps-style border border-surface-variant px-2 py-1 text-outline">
                      {tag}
                    </span>
                  ))}
                  {blog.tags.length > 3 && (
                    <span className="label-caps-style border border-surface-variant px-2 py-1 text-outline">
                      +{blog.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-auto flex items-center justify-between border-t border-surface-variant pt-4">
                <span className="label-caps-style text-outline group-hover:text-on-surface">
                  Read Article
                </span>
                <span className="inline-flex size-8 items-center justify-center border border-surface-variant text-outline transition-colors group-hover:border-on-surface group-hover:text-on-surface">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-16 flex items-center justify-center gap-3">
          <button
            disabled={safePage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="label-caps-style border border-surface-variant px-4 py-2 text-outline transition-colors hover:border-outline hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-30"
          >
            Previous
          </button>

          {generatePageNumbers(safePage, totalPages).map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-2 text-outline">
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p as number)}
                className={`label-caps-style border px-4 py-2 transition-colors ${
                  p === safePage
                    ? "border-on-surface bg-on-surface text-background"
                    : "border-surface-variant text-outline hover:border-outline hover:text-on-surface"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            disabled={safePage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="label-caps-style border border-surface-variant px-4 py-2 text-outline transition-colors hover:border-outline hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

function generatePageNumbers(
  current: number,
  total: number
): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | "...")[] = []
  if (current <= 3) {
    pages.push(1, 2, 3, 4, "...", total)
  } else if (current >= total - 2) {
    pages.push(1, "...", total - 3, total - 2, total - 1, total)
  } else {
    pages.push(1, "...", current - 1, current, current + 1, "...", total)
  }
  return pages
}
