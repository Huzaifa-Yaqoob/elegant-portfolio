import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

export async function getStaticPaths() {
  const allEntries = await getCollection("blog")
  return allEntries
    .filter((b) => !b.data.draft)
    .map((entry) => ({
      params: { slug: entry.data.slug },
    }))
}

export const GET: APIRoute = async ({ params, site }) => {
  const siteUrl = site?.origin ?? "https://huzaifa.dev"
  const { slug } = params

  const entries = await getCollection("blog")
  const entry = entries.find((e) => e.data.slug === slug)
  if (!entry || entry.data.draft) {
    return new Response("Not found", { status: 404 })
  }

  const d = entry.data
  const body = entry.body ?? ""

  const content = `# ${d.title}

> ${d.description}

## Blog Post Details

| Field | Value |
|-------|-------|
| **Author** | ${d.author} |
| **Date** | ${d.date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} |
| **Category** | ${d.category ?? "N/A"} |
| **Reading Time** | ${d.readingTime ?? "N/A"} |
| **Featured** | ${d.featured ? "Yes" : "No"} |

## Tags

${d.tags.join(", ")}

## Content

${body.trim() ? stripMdxComponents(body) : "No additional content."}

## Metadata

- **Keywords:** ${d.keywords ?? ""}
- **Cover Image:** ${d.coverImage ?? "N/A"}

## Links

- [Live Page](${siteUrl}/blogs/${d.slug})
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
