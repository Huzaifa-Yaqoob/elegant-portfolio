import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import type { SiteSchema } from "@/config/site_nav.config"
import type { sectionSchema } from "@/config/section.config"
import type { z } from "astro/zod"

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.origin ?? "https://huzaifa.dev"

  const [siteData, sections, journey, architect] = await Promise.all([
    getCollection("site"),
    getCollection("section"),
    getCollection("journey"),
    getCollection("architectPhase"),
  ])

  const siteConfig = siteData[0]?.data as z.infer<typeof SiteSchema> | undefined
  const heroSection = sections.find((s) => s.id === "about-hero.md")?.data as
    | z.infer<typeof sectionSchema>
    | undefined

  const journeyLines = journey
    .sort((a, b) => a.data.order - b.data.order)
    .map((j) => `- **${j.data.title}**: ${j.data.description}`)
    .join("\n")

  const architectLines = architect
    .sort((a, b) => a.data.order - b.data.order)
    .map(
      (a) =>
        `- **${a.data.title}** — ${a.data.description} Tags: ${a.data.tags?.join(", ") ?? ""}`
    )
    .join("\n")

  const buttons = heroSection?.ai_buttons as
    | Array<{ name: string; url: string; icon: string }>
    | undefined
  const aiButtons =
    buttons?.map((b) => `- [${b.name}](${b.url})`).join("\n") ?? ""

  const body = `# About — Huzaifa | Full-Stack Web Developer

> ${heroSection?.description ?? "Full-stack web developer and technical architect from Shahdara, Lahore."}

## Profile

**Name:** ${siteConfig?.personal?.name ?? "Huzaifa"}
**Title:** Full-Stack Web Developer & Technical Architect
**Location:** ${siteConfig?.personal?.address ?? "Shahdara, Lahore, Pakistan"}
**Email:** ${siteConfig?.personal?.email ?? "hi@huzaifa.dev"}
**Experience:** ${siteConfig?.stats?.years_experience ?? 5}+ years
**Projects Completed:** ${siteConfig?.stats?.projects_completed ?? 42}+
**Clients Served:** ${siteConfig?.stats?.total_clients ?? 28}+

## AI-Powered Discovery

Ask AI assistants about Huzaifa:

${aiButtons}

## Journey Timeline

${journeyLines}

## Development Methodology

${architectLines}

## Metadata

- **Title:** About Me | Huzaifa | Full-Stack Web Developer, Lahore
- **Canonical:** ${siteUrl}/about
- **OG Type:** website

## Links

- [Live Page](${siteUrl}/about)
- [Home](${siteUrl}/)
`

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
