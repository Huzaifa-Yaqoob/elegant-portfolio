import type { APIRoute } from "astro"
import { getCollection } from "astro:content"
import type { SiteSchema } from "@/config/site_nav.config"
import type { z } from "astro/zod"

interface FaqItem {
  question: string
  answer: string
}

interface FaqData {
  section: { title: string; description?: string; badge?: string }
  items: FaqItem[]
}

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.origin ?? "https://huzaifa.dev"

  const [contactIndexData, faqData, siteData] = await Promise.all([
    getCollection("contactIndex"),
    getCollection("faq"),
    getCollection("site"),
  ])

  const indexData = contactIndexData[0]?.data
  const faq = faqData[0]?.data as FaqData | undefined
  const siteConfig = siteData[0]?.data as z.infer<typeof SiteSchema> | undefined

  const faqLines =
    faq?.items
      ?.map(
        (item) =>
          `### ${item.question}

${item.answer}
`
      )
      .join("\n") ?? ""

  const social = siteConfig?.social as
    | {
        github?: string
        x?: string
        instagram?: string
        facebook?: string
        discord?: string
        whatsapp?: string
        linkedin?: string
      }
    | undefined

  const socialLines = [
    social?.github && `- [GitHub](${social.github})`,
    social?.x && `- [X / Twitter](${social.x})`,
    social?.instagram && `- [Instagram](${social.instagram})`,
    social?.facebook && `- [Facebook](${social.facebook})`,
    social?.discord && `- [Discord](${social.discord})`,
    social?.whatsapp && `- [WhatsApp](${social.whatsapp})`,
    social?.linkedin && `- [LinkedIn](${social.linkedin})`,
  ]
    .filter(Boolean)
    .join("\n")

  const body = `# Contact — Hire a Full-Stack Developer

> ${indexData?.description ?? "Have a project in mind? Let's talk."}

## Contact Information

- **Name:** ${siteConfig?.personal?.name ?? "Huzaifa"}
- **Email:** ${siteConfig?.personal?.email ?? "huzaifa.yaqoob.dev@gmail.com"}
- **Phone:** ${siteConfig?.personal?.phone ?? ""}
- **Location:** ${siteConfig?.personal?.address ?? "Shahdara, Lahore, Pakistan"}
- **Response Time:** Within 24 hours

## Social & Professional Profiles

${socialLines}

## Frequently Asked Questions

${faqLines}

## Metadata

- **Title:** ${indexData?.seo_title ?? "Hire a Full-Stack Developer | React & Node.js | Huzaifa"}
- **Description:** ${indexData?.seo_description ?? ""}
- **Keywords:** ${indexData?.seo_keywords ?? ""}
- **Canonical:** ${siteUrl}/contact

## Links

- [Live Page](${siteUrl}/contact)
- [Home](${siteUrl}/)
`

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  })
}
