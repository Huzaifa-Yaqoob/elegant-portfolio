import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.origin ?? "https://huzaifa.dev"

  const entries = await getCollection("page")
  const entry = entries.find(
    (e) => e.id === "privacy-policy" || e.id === "privacy-policy.md"
  )

  if (!entry) {
    return new Response("Privacy policy content not found", { status: 404 })
  }

  const { data, body: rawContent } = entry

  const body = `# ${data.title}

> ${data.description}

${data.lastUpdated ? `**Last updated:** ${data.lastUpdated.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}\n\n` : ""}

---

${rawContent}

---

## Metadata

- **Title:** ${data.seo_title ?? `${data.title} | Huzaifa`}
- **Description:** ${data.seo_description ?? data.description}
- **Keywords:** ${data.seo_keywords ?? ""}
- **Canonical:** ${siteUrl}/privacy-policy

## Links

- [Live Page](${siteUrl}/privacy-policy)
- [Home](${siteUrl}/)
`

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
