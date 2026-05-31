import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

interface FaqItem {
  question: string
  answer: string
}

interface FaqData {
  section: { title: string; description?: string; badge?: string }
  items: FaqItem[]
}

interface PricingTier {
  name: string
  description: string
  price_range: string
  features: string[]
}

interface PricingData {
  section: { title: string; description?: string; badge?: string }
  items: PricingTier[]
}

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.origin ?? "https://huzaifa.dev"

  const [serviceIndexData, services, faqData, pricingData] = await Promise.all([
    getCollection("serviceIndex"),
    getCollection("services"),
    getCollection("faq"),
    getCollection("pricing"),
  ])

  const indexData = serviceIndexData[0]?.data
  const faq = faqData[0]?.data as FaqData | undefined
  const pricing = pricingData[0]?.data as PricingData | undefined

  const serviceLines = services
    .sort((a, b) => a.data.order - b.data.order)
    .map(
      (s) =>
        `### ${s.data.number}. ${s.data.title}

${s.data.description}

**Tags:** ${s.data.tags?.join(", ") ?? ""}
**Icon:** ${s.data.icon ?? ""}
`
    )
    .join("\n")

  const faqLines =
    faq?.items
      ?.map(
        (item) =>
          `### ${item.question}

${item.answer}
`
      )
      .join("\n") ?? ""

  const pricingLines =
    pricing?.items
      ?.map(
        (tier) =>
          `- **${tier.name}** (${tier.price_range}): ${tier.description}`
      )
      .join("\n") ?? ""

  const body = `# Services — Full-Stack Web Development

> ${indexData?.description ?? "Comprehensive full-stack web development services."}

## Service Offerings

${serviceLines}
## FAQ

${faqLines}
## Pricing

${pricingLines}

## Metadata

- **Title:** ${indexData?.seo_title ?? "Full-Stack Web Development Services | Huzaifa"}
- **Description:** ${indexData?.seo_description ?? ""}
- **Keywords:** ${indexData?.seo_keywords ?? ""}
- **Canonical:** ${siteUrl}/service
- **Schema:** Service, OfferCatalog, BreadcrumbList

## Links

- [Live Page](${siteUrl}/service)
- [Contact](${siteUrl}/contact)
`

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
