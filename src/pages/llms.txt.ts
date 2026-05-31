import type { APIRoute } from "astro"
import { getCollection } from "astro:content"

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.origin ?? "https://huzaifa.dev"

  const services = await getCollection("services")
  const portfolio = await getCollection("portfolio")
  const blogs = await getCollection("blog")

  const publishedBlogs = blogs.filter((b) => !b.data.draft)

  const sections = [
    `## Pages

- [Home](${siteUrl}/): Landing page with hero, services, portfolio, tech stack, testimonials, blog, and contact sections.
- [About](${siteUrl}/about): About Huzaifa with journey timeline and architectural methodology.
- [Services](${siteUrl}/service): Full-stack development services including architecture, animation, SEO, UI/UX, cloud, and quality assurance.
- [Portfolio](${siteUrl}/my-work): Index of all portfolio projects.
- [Contact](${siteUrl}/contact): Contact form, FAQ, and social links.
- [Terms and Conditions](${siteUrl}/terms-and-conditions): Terms governing use of services and deliverables.
- [Privacy Policy](${siteUrl}/privacy-policy): Data collection, usage, and protection practices.

## Portfolio Projects

${portfolio
  .sort((a, b) => b.data.order - a.data.order)
  .map(
    (p) =>
      `- [${p.data.title}](${siteUrl}/my-work/${p.data.slug}): ${p.data.description}`
  )
  .join("\n")}

## Services

${services
  .sort((a, b) => a.data.order - b.data.order)
  .map((s) => `- [${s.data.title}](${siteUrl}/service): ${s.data.description}`)
  .join("\n")}

## Blog

${publishedBlogs
  .sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  )
  .map(
    (b) =>
      `- [${b.data.title}](${siteUrl}/blogs/${b.data.slug}): ${b.data.description}`
  )
  .join("\n")}

## Docs (Markdown Reviewers)

- [Home Doc](${siteUrl}/docs/home): Markdown reviewer for the home page.
- [About Doc](${siteUrl}/docs/about/): Markdown reviewer for the about page.
- [Services Doc](${siteUrl}/docs/service/): Markdown reviewer for the services page.
- [Contact Doc](${siteUrl}/docs/contact/): Markdown reviewer for the contact page.
- [Terms & Conditions Doc](${siteUrl}/docs/terms-and-conditions/): Markdown reviewer for the terms and conditions page.
- [Privacy Policy Doc](${siteUrl}/docs/privacy-policy/): Markdown reviewer for the privacy policy page.
${portfolio
  .sort((a, b) => b.data.order - a.data.order)
  .map(
    (p) =>
      `- [${p.data.title} Doc](${siteUrl}/docs/my-work/${p.data.slug}/): Markdown reviewer for the ${p.data.title} project page.`
  )
  .join("\n")}
${publishedBlogs
  .sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  )
  .map(
    (b) =>
      `- [${b.data.title} Doc](${siteUrl}/docs/blogs/${b.data.slug}/): Markdown reviewer for the blog post "${b.data.title}".`
  )
  .join("\n")}
`,
  ]

  const body = `# Huzaifa.dev

> Full-stack web developer and technical architect specializing in React, TypeScript, and Node.js. 5+ years building SaaS platforms, compliance systems, and AI-powered tools for startups and enterprises worldwide.

Huzaifa.dev is the portfolio and professional site of Huzaifa, a full-stack web developer based in Shahdara, Lahore, Pakistan. The site showcases portfolio projects, technical blog posts, professional services, and contact information.

Key technology expertise: React, TypeScript, Node.js, Next.js, Astro, GSAP, Tailwind CSS, PostgreSQL, Prisma, AWS, Docker, OpenAI/Gemini APIs, Stripe.

${sections.join("\n")}

## Optional

- [GitHub](https://github.com/huzaifayaqoob)
- [X / Twitter](https://x.com/huzaifadev)
- [LinkedIn](https://linkedin.com/in/huzaifayaqoob)
- [Instagram](https://instagram.com/huzaifadev)
`

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
