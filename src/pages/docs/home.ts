import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import type { SiteSchema } from "@/config/site_nav.config"
import type { sectionSchema } from "@/config/section.config"
import type { z } from "astro/zod"

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.origin ?? "https://huzaifa.dev"

  const [siteData, services, portfolioItems, blogs, testimonials, sections] =
    await Promise.all([
      getCollection("site"),
      getCollection("services"),
      getCollection("portfolio"),
      getCollection("blog"),
      getCollection("testimonial"),
      getCollection("section"),
    ])

  const siteConfig = siteData[0]?.data as z.infer<typeof SiteSchema> | undefined
  const heroSection = sections.find((s) => s.id === "main_hero.md")?.data as
    | z.infer<typeof sectionSchema>
    | undefined
  const techSection = sections.find((s) => s.id === "tech-stack.md")?.data as
    | z.infer<typeof sectionSchema>
    | undefined

  const publishedBlogs = blogs.filter((b) => !b.data.draft)
  const topBlogs = publishedBlogs
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
    )
    .slice(0, 3)

  const sortedServices = services
    .sort((a, b) => a.data.order - b.data.order)
    .map(
      (s) => `- **${s.data.title}** (${s.data.number}): ${s.data.description}`
    )
    .join("\n")

  const sortedPortfolio = portfolioItems
    .sort((a, b) => b.data.order - a.data.order)
    .map(
      (p) =>
        `- [${p.data.title}](${siteUrl}/my-work/${p.data.slug}): ${p.data.description}`
    )
    .join("\n")

  const blogLines = topBlogs
    .map(
      (b) =>
        `- [${b.data.title}](${siteUrl}/blogs/${b.data.slug}): ${b.data.description} — ${b.data.date.toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )}`
    )
    .join("\n")

  const testimonialLines = testimonials
    .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
    .map((t) => `- "${t.data.quote}" — ${t.data.author}, ${t.data.role}`)
    .join("\n")

  const techs = techSection?.technologies as
    | Array<{ name: string; icon: string }>
    | undefined
  const strengths = techSection?.core_strengths as string[] | undefined
  const techNames = techs?.map((t) => t.name).join(", ") ?? ""
  const coreStrengths = strengths?.join(", ") ?? ""

  const body = `# Home — Huzaifa | Full-Stack Web Developer

> ${heroSection?.description ?? siteConfig?.description ?? "Full-stack web developer and technical architect."}

Site: ${siteConfig?.site_name ?? "Huzaifa."}
Location: ${siteConfig?.personal?.address ?? "Shahdara, Lahore, Punjab, Pakistan"}
Email: ${siteConfig?.personal?.email ?? "huzaifa.yaqoob.dev@gmail.com"}
Experience: ${siteConfig?.stats?.years_experience ?? 5}+ years
Projects: ${siteConfig?.stats?.projects_completed ?? 42}+
Clients: ${siteConfig?.stats?.total_clients ?? 28}+

## Hero

**${heroSection?.title ?? "Full-stack web development, engineered to scale."}**
${heroSection?.description ?? "Building web applications and SaaS platforms that ship fast and hold up under traffic."}

## Core Strengths

${coreStrengths}

## Technologies

${techNames}

## Services

${sortedServices}

## Featured Portfolio Projects

${sortedPortfolio}

## Recent Blog Posts

${blogLines}

## Client Testimonials

${testimonialLines}

## Page Sections

- **Main Hero** — Full-screen hero with animated headline and CTA
- **Marquee** — Animated scrolling technology logos
- **Services** — Six service offerings
- **Portfolio** — Featured project cards
- **Tech Stack** — Technology grid with ${techNames.split(", ").length}+ tools
- **Testimonials** — Client social proof
- **Blog** — Recent posts
- **Contact** — Call-to-action section

## Metadata

- **Title:** Full-Stack Web Developer | React & Node.js | Huzaifa
- **Description:** ${heroSection?.description ?? ""}
- **Canonical:** ${siteUrl}/
- **Schema:** Person, WebSite, WebPage, BreadcrumbList, LocalBusiness

## Links

- [Live Page](${siteUrl}/)
- [Services](${siteUrl}/service)
- [Portfolio](${siteUrl}/my-work)
- [Blog](${siteUrl}/blogs)
- [Contact](${siteUrl}/contact)
`

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
