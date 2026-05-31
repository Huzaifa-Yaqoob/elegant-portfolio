import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

export async function getStaticPaths() {
  const allEntries = await getCollection("portfolio")
  return allEntries.map((entry) => ({
    params: { slug: entry.data.slug },
  }))
}

export const GET: APIRoute = async ({ params, site }) => {
  const siteUrl = site?.origin ?? "https://huzaifa.dev"
  const { slug } = params

  const entries = await getCollection("portfolio")
  const entry = entries.find((e) => e.data.slug === slug)
  if (!entry) {
    return new Response("Not found", { status: 404 })
  }

  const d = entry.data
  const body = entry.body ?? ""

  const sections = ["The Mission"]
  if (slug === "go-visualize") {
    sections.push(
      "Multi-Artboard Canvas Engine",
      "Multi-Agent AI Design Orchestration",
      "Brand Guideline Extraction Engine",
      "Auth, Billing & Credit Ledger",
      "Engineering Impact"
    )
  } else if (slug === "capex") {
    sections.push(
      "Full Rewrite, Modern Stack",
      "Multi-Step Calculation Engine",
      "Role-Based Access Control",
      "Engineering Impact"
    )
  } else if (slug === "yere") {
    sections.push(
      "AI Curriculum & Assessment Engine",
      "Recruitment Data Marketplace",
      "RBAC & Subscription Management",
      "Scalable Infrastructure"
    )
  } else if (slug === "autoprov") {
    sections.push(
      "Multi-Source API Engine",
      "PDF Generation at Scale",
      "Billing & Monetisation",
      "Viral Growth Engine",
      "Engineering Impact"
    )
  }

  const content = `# ${d.title}

> ${d.description}

## Project Overview

| Field | Value |
|-------|-------|
| **Role** | ${d.role ?? "N/A"} |
| **Company** | [${d.company}](${d.companyUrl ?? ""}) |
| **Timeline** | ${d.timeline ?? "N/A"} |
| **Tags** | ${d.tags?.join(", ") ?? "N/A"} |

## Tools & Technologies

${d.tools.join(", ")}

## Project Sections

${sections.map((s) => `- ${s}`).join("\n")}

## Content

${body.trim() ? stripMdxComponents(body) : "No additional content."}

## Metadata

- **Order:** ${d.order}
- **Live URL:** ${d.url ?? "N/A"}
- **Main Image:** ${d.mainImage}

## Links

- [Live Page](${siteUrl}/my-work/${d.slug})
- [Live Project](${d.url ?? `${siteUrl}/my-work/${d.slug}`})
`

  return new Response(content, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}

function stripMdxComponents(content: string): string {
  return content
    .replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, "")
    .replace(/<[A-Z][^/]*\/>/g, "")
    .replace(/import\s+.*?from\s+["'].*?["'];?\n?/g, "")
    .trim()
}
