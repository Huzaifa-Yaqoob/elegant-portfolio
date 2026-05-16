import { z } from "astro:content"

// Define a base schema for all sections, allowing for additional properties
export const sectionSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    main_image: z.string().optional(), // Changed to optional as it was removed from service.md
    divider_text: z.string().optional(), // Added as optional
    badge: z.string().optional(), // Added as optional
    // Add any other common properties that all sections might share
  })
  .passthrough() // Allows for additional, specific properties in individual section frontmatters

export type SectionConfig = z.infer<typeof sectionSchema>

// The 'sections' object is removed as it's redundant with Astro's content collections.
// The schema defined above will be used directly by the content collection.