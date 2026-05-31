import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

function stripHtml(content: string): string {
  return content
    .replace(/<[^>]*>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.origin ?? "https://huzaifa.dev"

  const services = await getCollection("services")
  const portfolio = await getCollection("portfolio")
  const blogs = await getCollection("blog")

  const publishedBlogs = blogs.filter((b) => !b.data.draft)

  const homeContent = `URL: ${siteUrl}/
Title: Home — Huzaifa | Full-Stack Web Developer
Last Updated: 2026-05-31

Landing page for Huzaifa, a full-stack web developer specializing in React, TypeScript, and Node.js. Includes hero section, services overview (Full-Stack Architecture, High-End Animation, SEO & Performance, UI/UX Engineering, Scalable Systems, Digital Precision), portfolio showcase, tech stack grid, client testimonials, blog previews, and contact CTA.
`

  const aboutContent = `URL: ${siteUrl}/about
Title: About — Huzaifa | Full-Stack Web Developer
Last Updated: 2026-05-31

About page detailing Huzaifa's background and journey. Includes journey timeline with milestones (Birth, Matric, FSC, Bachelors, Axtra, Musketeers) and architecture methodology (Plan, Design, Execute, Deploy phases).
`

  const serviceLines = services
    .sort((a, b) => a.data.order - b.data.order)
    .map(
      (s) =>
        `- **${s.data.title}** (${s.data.number}): ${s.data.description} Tags: ${s.data.tags.join(", ")}`
    )
    .join("\n")

  const servicesContent = `URL: ${siteUrl}/service
Title: Services — Full-Stack Web Development | Huzaifa
Last Updated: 2026-05-31

Comprehensive full-stack web development services:

${serviceLines}
`

  const portfolioContent = `URL: ${siteUrl}/my-work
Title: Portfolio — Engineered Works | Huzaifa
Last Updated: 2026-05-31

Portfolio index showcasing SaaS platforms, compliance systems, and design tools built for startups and enterprises worldwide.
`

  const projectEntries = await Promise.all(
    portfolio
      .sort((a, b) => b.data.order - a.data.order)
      .map(async (entry) => {
        const rendered = entry.body
          ? stripHtml(entry.body)
          : "No additional content."
        return `URL: ${siteUrl}/my-work/${entry.data.slug}
Title: ${entry.data.title}
Role: ${entry.data.role ?? "N/A"}
Company: ${entry.data.company ?? "N/A"}
Timeline: ${entry.data.timeline ?? "N/A"}
Tools: ${entry.data.tools.join(", ")}
Tags: ${entry.data.tags?.join(", ") ?? "N/A"}
Live URL: ${entry.data.url ?? "N/A"}
Description: ${entry.data.description}

${rendered}
`
      })
  )

  const blogEntries = await Promise.all(
    publishedBlogs
      .sort(
        (a, b) =>
          new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
      )
      .map(async (entry) => {
        const rendered = entry.body
          ? stripHtml(entry.body)
          : "No additional content."
        return `URL: ${siteUrl}/blogs/${entry.data.slug}
Title: ${entry.data.title}
Author: ${entry.data.author}
Date: ${entry.data.date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
Category: ${entry.data.category ?? "N/A"}
Reading Time: ${entry.data.readingTime ?? "N/A"}
Tags: ${entry.data.tags.join(", ")}

${rendered}
`
      })
  )

  const body = `# Huzaifa.dev

> Full-stack web developer and technical architect specializing in React, TypeScript, and Node.js. 5+ years building SaaS platforms, compliance systems, and AI-powered tools for startups and enterprises worldwide.

---

${homeContent}
---

${aboutContent}
---

${servicesContent}
---

${portfolioContent}
---

${projectEntries.join("---\n\n")}
---

${blogEntries.join("---\n\n")}
`

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
